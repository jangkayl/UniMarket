import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

// --- Type definition matching your Spring Boot ItemDTO ---
interface ItemDetails {
	itemId: number;
	itemName: string;
	description: string;
	price: number | null;
	itemPhotoId: number | null;
	category: string;
	condition: string;
	availabilityStatus: string;
	transactionType: string;
	rentalFee: number | null;
	rentalDurationDays: number | null;
	createdAt: string;
	updatedAt: string;
	sellerId: number;
	sellerFirstName?: string;
	sellerLastName?: string;
}

// --- Helper to format currency ---
const formatPrice = (amount: number | null | undefined) => {
	if (amount === null || amount === undefined) return "N/A";
	return new Intl.NumberFormat("en-PH", {
		style: "currency",
		currency: "PHP",
	}).format(amount);
};

const ItemDetailsPage = async ({
	params,
}: {
	params: Promise<{ id: string }>;
}) => {
	const { id } = await params;

	let item: ItemDetails | null = null;

	try {
		const res = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/items/getItemById/${id}`,
			{ cache: "no-store" }
		);

		if (!res.ok) {
			if (res.status === 404) notFound();
			throw new Error("Failed to fetch item");
		}

		item = await res.json();
	} catch (error) {
		console.error("Error fetching item details:", error);
		return (
			<div className="min-h-screen flex flex-col font-sans text-gray-900 bg-gray-50">
				<Navbar />
				<main className="grow flex items-center justify-center">
					<div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-200">
						<h2 className="text-2xl font-bold mb-2 text-red-900">
							Error Loading Item
						</h2>
						<p className="text-gray-600">
							Unable to retrieve details. Please try again later.
						</p>
						<Link
							href="/marketplace"
							className="inline-block mt-4 underline">
							Back to Marketplace
						</Link>
					</div>
				</main>
				<Footer />
			</div>
		);
	}

	if (!item) return notFound();

	// --- Prepare Display Data ---
	const imageUrl = item.itemPhotoId
		? `${process.env.SPRING_BOOT_API_URL}/uploads/items/${item.itemPhotoId}`
		: null;

	const isRental = item.transactionType === "Rent";
	const displayPrice = isRental ? item.rentalFee : item.price;
	const unitLabel = isRental ? `/ ${item.rentalDurationDays} Days` : "";

	const sellerName =
		item.sellerFirstName && item.sellerLastName
			? `${item.sellerFirstName} ${item.sellerLastName}`
			: `Student #${item.sellerId}`;

	// Generate Tags based on item properties
	const tags = [item.category, item.condition, item.transactionType];
	if (item.availabilityStatus === "AVAILABLE") tags.push("Available");

	// Generate Features List
	const features = [
		{ label: "Category", value: item.category },
		{ label: "Condition", value: item.condition },
		{ label: "Transaction", value: item.transactionType },
		{ label: "Posted", value: new Date(item.createdAt).toLocaleDateString() },
	];
	if (isRental) {
		features.push({
			label: "Max Duration",
			value: `${item.rentalDurationDays} Days`,
		});
	}

	return (
		<div className="bg-gray-50 min-h-screen flex flex-col font-sans text-gray-900">
			<Navbar />

			<main className="grow w-full max-w-[1200px] mx-auto px-6 py-10">
				{/* Breadcrumb / Back Link */}
				<div className="mb-6">
					<Link
						href="/marketplace"
						className="text-gray-500 hover:text-red-900 flex items-center gap-2 text-sm font-medium">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							fill="currentColor"
							className="bi bi-arrow-left"
							viewBox="0 0 16 16">
							<path
								fillRule="evenodd"
								d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
							/>
						</svg>
						Back to Marketplace
					</Link>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
					{/* --- LEFT COLUMN: IMAGES --- */}
					<div className="space-y-4">
						{/* Main Image */}
						<div className="w-full h-[400px] bg-white rounded-2xl border border-gray-200 overflow-hidden flex items-center justify-center relative shadow-sm">
							{imageUrl ? (
								<Image
									src={imageUrl}
									alt={item.itemName}
									fill
									className="object-cover"
									priority
								/>
							) : (
								<div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 flex-col gap-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="80"
										height="80"
										fill="currentColor"
										className="bi bi-book"
										viewBox="0 0 16 16">
										<path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783" />
									</svg>
									<span>No Image Uploaded</span>
								</div>
							)}
						</div>

						{/* Thumbnails (Static Placeholder for UI consistency) */}
						<div className="grid grid-cols-4 gap-4">
							{/* We just show the main image as a thumbnail since we only have 1 */}
							<div className="aspect-square bg-white rounded-lg border border-red-900 ring-2 ring-red-900 ring-offset-2 cursor-pointer overflow-hidden relative">
								{imageUrl && (
									<Image
										src={imageUrl}
										alt="Thumbnail"
										fill
										className="object-cover"
									/>
								)}
							</div>
							{/* Empty slots to maintain grid look if you want, or remove */}
							{[1, 2, 3].map((i) => (
								<div
									key={i}
									className="aspect-square bg-gray-100 rounded-lg border border-gray-200"></div>
							))}
						</div>
					</div>

					{/* --- RIGHT COLUMN: DETAILS --- */}
					<div className="flex flex-col h-full">
						{/* Title & Header */}
						<div className="mb-6">
							<h1 className="text-3xl font-extrabold text-gray-900 mb-2 leading-tight">
								{item.itemName}
							</h1>
							<div className="flex items-center text-gray-500 text-sm gap-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									fill="currentColor"
									className="bi bi-geo-alt-fill text-red-900"
									viewBox="0 0 16 16">
									<path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
								</svg>
								CIT Campus (Main)
							</div>
						</div>

						{/* Price & Tags */}
						<div className="mb-6">
							<div className="flex items-baseline gap-1 mb-4">
								<span className="text-3xl font-extrabold text-[#8B0000]">
									{formatPrice(displayPrice)}
								</span>
								<span className="text-lg font-bold text-[#8B0000]">
									{unitLabel}
								</span>
							</div>
							<div className="flex flex-wrap gap-2">
								{tags.map((tag, idx) => (
									<span
										key={idx}
										className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">
										{tag}
									</span>
								))}
							</div>
						</div>

						<hr className="border-gray-200 mb-6" />

						{/* Description */}
						<div className="mb-8">
							<h3 className="font-bold text-gray-900 mb-2">Description</h3>
							<p className="text-gray-600 text-sm leading-relaxed">
								{item.description || "No description provided."}
							</p>
						</div>

						{/* Key Features */}
						<div className="mb-10">
							<h3 className="font-bold text-gray-900 mb-3">Key Details:</h3>
							<ul className="space-y-2">
								{features.map((feature, idx) => (
									<li
										key={idx}
										className="flex items-center text-sm">
										<span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3"></span>
										<span className="text-gray-500 mr-1">{feature.label}:</span>
										<span className="text-gray-800 font-medium">
											{feature.value}
										</span>
									</li>
								))}
							</ul>
						</div>

						{/* Seller Card */}
						<div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-6">
							<div className="flex items-start gap-4">
								{/* Avatar */}
								<div className="w-14 h-14 bg-gray-200 rounded-full overflow-hidden shrink-0 flex items-center justify-center text-gray-400">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="currentColor"
										className="w-8 h-8"
										viewBox="0 0 16 16">
										<path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
										<path
											fillRule="evenodd"
											d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
										/>
									</svg>
								</div>

								{/* Info */}
								<div className="grow">
									<div className="flex justify-between items-start mb-1">
										<div>
											<h4 className="font-bold text-gray-900 text-lg">
												{sellerName}
											</h4>
											<span className="bg-[#8B0000] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit mt-1">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="8"
													height="8"
													fill="currentColor"
													className="bi bi-check-circle-fill"
													viewBox="0 0 16 16">
													<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
												</svg>
												Verified Student
											</span>
										</div>
									</div>

									<div className="mt-2 mb-3">
										<div className="flex items-center justify-between text-xs text-gray-500 mb-1">
											<span>Trust Score</span>
											<span className="font-bold text-gray-900">92%</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-1.5">
											<div
												className="bg-yellow-400 h-1.5 rounded-full"
												style={{ width: "92%" }}></div>
										</div>
									</div>

									<button className="w-full bg-[#8B0000] text-white text-sm font-bold py-2.5 rounded-lg hover:bg-red-900 transition-colors flex items-center justify-center gap-2 cursor-pointer">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											fill="currentColor"
											className="bi bi-chat-dots-fill"
											viewBox="0 0 16 16">
											<path d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
										</svg>
										Message Seller
									</button>
								</div>
							</div>
						</div>

						{/* Main Action Button */}
						<button className="w-full bg-yellow-400 text-gray-900 text-lg font-bold py-4 rounded-xl hover:bg-yellow-500 transition-transform transform hover:scale-[1.02] shadow-md cursor-pointer mt-auto">
							{item.transactionType === "Rent"
								? "Request to Borrow"
								: "Buy Now"}
						</button>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
};

export default ItemDetailsPage;
