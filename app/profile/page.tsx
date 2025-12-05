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
	itemPhotoId: number | null;
	condition: string;
	category: string;
}

// --- Mock Data for Listings ---
const activeListings = [
	{
		id: 99991, // High IDs to avoid conflict with DB
		title: "Calculus III Textbook",
		price: "$45.00",
		image: "/images/book_calc.jpg",
	},
	{
		id: 99992,
		title: "MacBook Pro (2020)",
		price: "$800.00",
		image: "/images/laptop_mock.jpg",
	},
	{
		id: 99993,
		title: "TI-84 Plus Calculator",
		price: "$60.00",
		image: "/images/calculator.jpg",
	},
];

const ProfilePage = async () => {
	// 1. Get the session cookie
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get("session");

	// 2. If no session, redirect to login
	if (!sessionCookie) {
		redirect("/login");
	}

	// 3. Parse the user data
	const user: User = JSON.parse(sessionCookie.value);

	// 4. FETCH REAL LISTINGS from Spring Boot
	let userItems: {
		id: number;
		title: string;
		price: string;
		image: string | null;
	}[] = [];

	try {
		const res = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/items/seller/${user.studentId}`,
			{
				cache: "no-store", // Ensure we get fresh data
			}
		);

		if (res.ok) {
			const data: FetchedItem[] = await res.json();
			// Map backend data to UI format
			userItems = data.map((item) => ({
				id: item.itemId,
				title: item.itemName,
				price: `$${item.price.toFixed(2)}`,
				// If itemPhotoId exists, construct URL, else null (UI will show placeholder)
				image: item.itemPhotoId
					? `${process.env.SPRING_BOOT_API_URL}/uploads/items/${item.itemPhotoId}`
					: null,
			}));
		}
	} catch (error) {
		console.error("Failed to fetch user items:", error);
	}

	// 5. MERGE: Real Items + Mock Items
	const displayListings = [...userItems, ...activeListings];

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
							<div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 mb-4 overflow-hidden relative">
								{user.profilePicture ? (
									<Image
										src={`${process.env.SPRING_BOOT_API_URL}/uploads/${user.profilePicture}`}
										alt="Profile"
										width={96}
										height={96}
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
										<path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
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

						{/* 2. Trust Score */}
						<div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
							<h3 className="font-bold text-gray-900 mb-2">Trust Score</h3>
							<div className="flex items-baseline gap-1 mb-2">
								<span className="text-4xl font-extrabold text-red-900">92</span>
								<span className="text-lg font-bold text-red-900">%</span>
								<span className="ml-auto text-sm text-gray-500 font-medium">
									Excellent
								</span>
							</div>
							<div className="w-full bg-red-100 rounded-full h-2.5">
								<div
									className="bg-red-900 h-2.5 rounded-full"
									style={{ width: "92%" }}></div>
							</div>
						</div>

						{/* 3. Earned Badges */}
						<div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
							<h3 className="font-bold text-gray-900 mb-4">Earned Badges</h3>
							<div className="flex flex-wrap gap-2">
								<div className="bg-red-50 text-red-900 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="12"
										height="12"
										fill="currentColor"
										className="bi bi-award"
										viewBox="0 0 16 16">
										<path d="M9.669.864 8 0 6.331.864l-1.858.282-.842 1.68-1.337 1.32L2.6 6l-.306 1.854 1.337 1.32.842 1.68 1.858.282L8 12l1.669-.864 1.858-.282.842-1.68 1.337-1.32L12.6 6l.306-1.854-1.337-1.32-.842-1.68z" />
									</svg>
									Top Seller
								</div>
							</div>
						</div>

						{/* 4. Quick Actions */}
						<div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
							<h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
							<div className="space-y-3">
								{/* REVIEWS LINK */}
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

								{/* WALLET LINK */}
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

								{/* SETTINGS LINK */}
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
										<path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z" />
									</svg>
									Settings
								</Link>
							</div>
						</div>
					</aside>

					{/* --- RIGHT CONTENT: Listings --- */}
					<div className="lg:col-span-3">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-2xl font-bold text-gray-900">
								Active Listings
							</h2>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{displayListings.map((item) => (
								<div
									key={item.id}
									className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer">
									<div className="h-52 bg-gray-200 relative overflow-hidden">
										<div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 relative">
											{/* {item.image ? (
												<Image
													src={item.image}
													alt={item.title}
													width={96}
													height={96}
													className="w-full h-full object-cover"
												/>
											) : ( */}
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
											{/* )} */}
										</div>
									</div>
									<div className="p-5">
										<h3 className="font-bold text-gray-900 mb-2 truncate">
											{item.title}
										</h3>
										<div className="text-[#8B0000] font-extrabold text-xl">
											{item.price}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
};

export default ProfilePage;
