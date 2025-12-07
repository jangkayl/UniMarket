import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Image from "next/image";

// Define the shape of the User object stored in the session
interface User {
	studentId: number;
	studentNumber: string;
	universityEmail: string;
	firstName: string;
	lastName: string;
	profilePicture: string | null;
	isVerified: boolean;
	accountStatus: string;
}

// Interface for the data coming from Spring Boot
interface FetchedItem {
	itemId: number;
	itemName: string;
	price: number;
	itemPhoto: string | null; // Added String filename
	itemPhotoId: number | null; // Fallback ID
	condition: string;
	category: string;
	transactionType: string;
	rentalFee: number | null;
	rentalDurationDays?: number | null;
}

const ProfilePage = async () => {
	// 1. Get the session cookie
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get("session");

	// 2. If no session, redirect to login
	if (!sessionCookie) {
		redirect("/login");
	}

	// 3. Parse the user data
	let user: User = JSON.parse(sessionCookie.value);

	// OPTIONAL: Fetch fresh user data to ensure profile picture is up to date immediately after changes
	try {
		const res = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/students/${user.studentId}`,
			{ cache: "no-store" }
		);
		if (res.ok) {
			user = await res.json();
		}
	} catch (e) {
		/* fallback to session data */
	}

	// 4. FETCH REAL LISTINGS from Spring Boot
	let userItems: {
		id: number;
		title: string;
		price: string;
		category: string;
		condition: string;
		type: string;
		image: string | null;
	}[] = [];

	try {
		const res = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/items/getAllItemsByStudentId/${user.studentId}`,
			{
				cache: "no-store", // Ensure we get fresh data
			}
		);

		if (res.ok) {
			const data: FetchedItem[] = await res.json();
			// Map backend data to UI format
			userItems = data.map((item) => {
				const isRental = item.transactionType === "Rent";
				const rawPrice = isRental ? item.rentalFee : item.price;
				const priceDisplay = `₱${(rawPrice ?? 0).toFixed(2)}`;

				// --- FIXED ITEM IMAGE LOGIC ---
				let imageUrl = null;
				if (item.itemPhoto) {
					imageUrl = `${process.env.SPRING_BOOT_API_URL}/api/items/images/${item.itemPhoto}`;
				} else if (item.itemPhotoId) {
					imageUrl = `${process.env.SPRING_BOOT_API_URL}/uploads/items/${item.itemPhotoId}`;
				}

				return {
					id: item.itemId,
					title: item.itemName,
					price: priceDisplay,
					category: item.category,
					condition: item.condition,
					type: item.transactionType,
					image: imageUrl,
				};
			});
		}
	} catch (error) {
		console.error("Failed to fetch user items:", error);
	}

	const displayListings = userItems;

	// Split into Sale vs Rent/Swap
	const itemsForSale = displayListings.filter((i) => i.type === "Sell");
	const itemsForRent = displayListings.filter(
		(i) => i.type === "Rent" || i.type === "Swap"
	);

	// --- PROFILE PICTURE URL ---
	const profilePicUrl = user.profilePicture
		? `${process.env.SPRING_BOOT_API_URL}/api/students/images/${user.profilePicture}`
		: null;

	// Reusable Card Component
	const ListingCard = ({ item }: { item: (typeof userItems)[0] }) => (
		<Link
			key={item.id}
			href={`/profile/edit-item/${item.id}`}
			className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col relative">
			<div className="absolute top-3 right-3 z-10 bg-white/90 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity text-gray-700">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="currentColor"
					className="bi bi-pencil-square"
					viewBox="0 0 16 16">
					<path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
					<path
						fillRule="evenodd"
						d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
					/>
				</svg>
			</div>
			<div className="h-52 bg-gray-200 relative overflow-hidden">
				<div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 relative">
					{item.image ? (
						<Image
							src={item.image}
							alt={item.title}
							width={100}
							height={100}
							className="w-full h-full object-cover"
						/>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="48"
							height="48"
							fill="currentColor"
							className="bi bi-image"
							viewBox="0 0 16 16">
							<path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
							<path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12" />
						</svg>
					)}
				</div>
			</div>
			<div className="p-4 grow flex flex-col">
				<h3 className="font-bold text-gray-900 mb-2 truncate group-hover:text-red-900 transition-colors">
					{item.title}
				</h3>
				<div className="flex flex-wrap gap-2 mb-3">
					<span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-semibold rounded-full uppercase">
						{item.category}
					</span>
					<span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-semibold rounded-full uppercase">
						{item.condition}
					</span>
				</div>
				<div className="text-[#8B0000] font-extrabold text-lg mt-auto">
					{item.price}
				</div>
			</div>
		</Link>
	);

	return (
		<div className="bg-gray-50 min-h-screen flex flex-col font-sans text-gray-900">
			<Navbar />

			<main className="grow w-full max-w-[1400px] mx-auto px-6 py-10">
				<h1 className="text-4xl font-bold text-gray-900 mb-8">My Profile</h1>

				<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
					{/* --- LEFT SIDEBAR --- */}
					<aside className="lg:col-span-1 space-y-6">
						{/* 1. Profile Card */}
						<div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm flex flex-col items-center text-center">
							<div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 mb-4 overflow-hidden relative border border-gray-100">
								{profilePicUrl ? (
									// eslint-disable-next-line @next/next/no-img-element
									<img
										src={profilePicUrl}
										alt="Profile"
										className="w-full h-full object-cover"
									/>
								) : (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="40"
										height="40"
										fill="currentColor"
										className="bi bi-person"
										viewBox="0 0 16 16">
										<path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664z" />
									</svg>
								)}
							</div>

							<h2 className="text-xl font-bold text-red-900">
								{user.firstName} {user.lastName}
							</h2>

							<p className="text-sm text-gray-500 mb-4">
								Student ID: {user.studentNumber}
							</p>

							{user.isVerified ? (
								<div className="bg-yellow-400 text-gray-900 text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="12"
										height="12"
										fill="currentColor"
										className="bi bi-patch-check-fill"
										viewBox="0 0 16 16">
										<path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.896.011a2.89 2.89 0 0 0-2.924 2.924l.01.896-.636.622a2.89 2.89 0 0 0 0 4.134l.638.622-.011.896a2.89 2.89 0 0 0 2.924 2.924l.896-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.638.896-.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.896.636-.622a2.89 2.89 0 0 0 0-4.134l-.638-.622.011-.896a2.89 2.89 0 0 0-2.924-2.924l-.896.01zm.93 4.225 1.61 2.151a.25.25 0 0 1-.226.418h-1.6v2.1a.25.25 0 0 1-.418.17l-1.9-2.1a.25.25 0 0 1 .226-.419h1.6V5.265a.25.25 0 0 1 .418-.17" />
									</svg>
									Verified Student
								</div>
							) : (
								<div className="bg-gray-200 text-gray-600 text-xs font-bold px-4 py-1.5 rounded-full">
									Unverified
								</div>
							)}
						</div>

						<div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
							<h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
							<div className="space-y-3">
								<Link
									href="/profile/reviews"
									className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-red-900 transition-colors w-full text-left">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										fill="currentColor"
										className="bi bi-file-text"
										viewBox="0 0 16 16">
										<path d="M5 4a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1zm-.5 2.5A.5.5 0 0 1 5 6h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5M5 8a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1z" />
										<path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1" />
									</svg>
									Reviews & Ratings
								</Link>
								<Link
									href="/profile/wallet"
									className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-red-900 transition-colors w-full text-left">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										fill="currentColor"
										className="bi bi-wallet2"
										viewBox="0 0 16 16">
										<path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499L12.136.326zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484L5.562 3zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z" />
									</svg>
									Payment & Wallet
								</Link>
								<Link
									href="/profile/settings"
									className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-red-900 transition-colors w-full text-left">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										fill="currentColor"
										className="bi bi-gear"
										viewBox="0 0 16 16">
										<path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0" />
										<path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z" />
									</svg>
									Settings
								</Link>
							</div>
						</div>
					</aside>

					{/* --- RIGHT CONTENT: Listings --- */}
					<div className="lg:col-span-3 space-y-10">
						{/* SECTION 1: ITEMS FOR SALE */}
						<div>
							<div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
								<h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
									<span className="bg-red-100 text-red-900 p-1.5 rounded-lg">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="20"
											height="20"
											fill="currentColor"
											className="bi bi-tag-fill"
											viewBox="0 0 16 16">
											<path d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
										</svg>
									</span>
									Items for Sale
								</h2>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{itemsForSale.length > 0 ? (
									itemsForSale.map((item) => (
										<ListingCard
											key={item.id}
											item={item}
										/>
									))
								) : (
									<div className="col-span-full py-8 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
										<p>No items listed for sale.</p>
									</div>
								)}
							</div>
						</div>

						{/* SECTION 2: ITEMS FOR RENT/SWAP */}
						<div>
							<div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
								<h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
									<span className="bg-blue-100 text-blue-900 p-1.5 rounded-lg">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="20"
											height="20"
											fill="currentColor"
											className="bi bi-clock-history"
											viewBox="0 0 16 16">
											<path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342zm1.37.71a7 7 0 0 0-.439-.45l.506-.906c.17.086.336.181.498.284zM14 7.053V7h-1v.053c-.09.776-.353 1.509-.756 2.159l.812.584c.506-.803.834-1.731.944-2.743m-2.71 4.132c-.65.403-1.383.666-2.159.756V13h-.053a7 7 0 0 0 2.159-.756zM8 14a6.97 6.97 0 0 0 2.158-.342l.498.906A8 8 0 0 1 8 15zM4.842 13.658A7 7 0 0 0 8 14v1a8 8 0 0 1-3.158-.642zm-1.016-.866a6.97 6.97 0 0 0 1.158.866l-.498.906A8 8 0 0 1 3.328 13.79zm-1.37-1.081c.31.388.666.735 1.053 1.028l-.584.812a8 8 0 0 1-1.313-1.282zM2.053 8.842A7 7 0 0 0 3 11.858l.906-.498A6 6 0 0 1 2.053 8.842zM2 7a7 7 0 0 0 .053 2.158l-.976.219A8 8 0 0 1 1 7zm-.022-.589c.017-.195.043-.388.076-.58h.965a6.97 6.97 0 0 1-.076.58zM1.482 4.81c.14-.366.303-.714.487-1.042l-.884-.468a8 8 0 0 1-.608 1.302zM3.328 2.21a6.97 6.97 0 0 0-1.042.487l-.468-.884a8 8 0 0 1 1.302-.608zM5.842.342A7 7 0 0 0 4.158.658l-.219.976A6 6 0 0 1 5.842 1.318zM8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
										</svg>
									</span>
									Items for Rent / Swap
								</h2>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{itemsForRent.length > 0 ? (
									itemsForRent.map((item) => (
										<ListingCard
											key={item.id}
											item={item}
										/>
									))
								) : (
									<div className="col-span-full py-8 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
										<p>No rental items listed.</p>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
};

export default ProfilePage;
