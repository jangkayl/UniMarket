import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

// --- Type definition ---
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
			<div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-900">
				<p>Error loading item.</p>
			</div>
		);
	}

	if (!item) return notFound();

	// --- CHECK OWNER ---
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get("session");
	let isOwner = false;
	if (sessionCookie) {
		try {
			const user = JSON.parse(sessionCookie.value);
			if (Number(user.studentId) === Number(item.sellerId)) {
				isOwner = true;
			}
		} catch (e) {}
	}

	const imageUrl = item.itemPhotoId
		? `${process.env.SPRING_BOOT_API_URL}/uploads/items/${item.itemPhotoId}`
		: null;

	const isRental = item.transactionType === "Rent";
	const displayPrice = isRental ? item.rentalFee : item.price;

	const sellerName =
		item.sellerFirstName && item.sellerLastName
			? `${item.sellerFirstName} ${item.sellerLastName}`
			: `Student #${item.sellerId}`;

	return (
		<div className="bg-gray-50 min-h-screen flex flex-col font-sans text-gray-900">
			<Navbar />

			<main className="grow w-full max-w-[1200px] mx-auto px-6 py-10">
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
					{/* LEFT: IMAGE */}
					<div className="space-y-4">
						<div className="w-full h-[500px] bg-white rounded-2xl border border-gray-200 overflow-hidden flex items-center justify-center relative shadow-sm">
							{imageUrl ? (
								<Image
									src={imageUrl}
									alt={item.itemName}
									fill
									className="object-cover"
									priority
								/>
							) : (
								<div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 flex-col gap-4">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="80"
										height="80"
										fill="currentColor"
										className="bi bi-image"
										viewBox="0 0 16 16">
										<path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
										<path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12" />
									</svg>
									<span className="text-sm font-medium">
										No Image Available
									</span>
								</div>
							)}
							<div className="absolute top-4 right-4">
								<span
									className={`px-4 py-2 rounded-full text-xs font-bold shadow-sm uppercase tracking-wide ${
										item.availabilityStatus === "AVAILABLE"
											? "bg-green-100 text-green-800"
											: "bg-gray-200 text-gray-600"
									}`}>
									{item.availabilityStatus}
								</span>
							</div>
						</div>
					</div>

					{/* RIGHT: DETAILS */}
					<div className="flex flex-col h-full">
						<div className="mb-6">
							<h1 className="text-3xl font-extrabold text-gray-900 mb-2 leading-tight">
								{item.itemName}
							</h1>
							<div className="flex items-center text-gray-500 text-sm gap-2">
								<span className="bg-red-50 text-red-900 px-2 py-1 rounded text-xs font-bold uppercase tracking-wide">
									{item.transactionType}
								</span>
								<span>•</span>
								<span>
									Posted {new Date(item.createdAt).toLocaleDateString()}
								</span>
							</div>
						</div>

						<div className="mb-6">
							<div className="flex items-baseline gap-2 mb-4">
								<span className="text-4xl font-extrabold text-[#8B0000]">
									{formatPrice(displayPrice)}
								</span>
								{isRental && (
									<span className="text-lg font-medium text-gray-500">
										{item.rentalDurationDays
											? `/ ${item.rentalDurationDays} Days`
											: "/ Rent Duration"}
									</span>
								)}
							</div>
						</div>

						<hr className="border-gray-200 mb-6" />

						<div className="mb-8">
							<h3 className="font-bold text-gray-900 mb-2">Description</h3>
							<p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
								{item.description || "No description provided."}
							</p>
						</div>

						<div className="mb-10 bg-white border border-gray-200 rounded-xl p-6">
							<h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">
								Details
							</h3>
							<div className="grid grid-cols-2 gap-y-6 gap-x-4">
								<div className="flex flex-col">
									<span className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">
										Category
									</span>
									<span className="text-gray-900 font-semibold">
										{item.category || "Uncategorized"}
									</span>
								</div>
								<div className="flex flex-col">
									<span className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">
										Condition
									</span>
									<span className="text-gray-900 font-semibold">
										{item.condition || "Not Specified"}
									</span>
								</div>
								{isRental && (
									<div className="flex flex-col">
										<span className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">
											Duration
										</span>
										<span className="text-gray-900 font-semibold">
											{item.rentalDurationDays} Days
										</span>
									</div>
								)}
							</div>
						</div>

						<div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-6 mt-auto">
							<div className="flex items-start gap-4">
								<div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden shrink-0 flex items-center justify-center text-gray-400 border border-gray-200">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="currentColor"
										className="w-6 h-6"
										viewBox="0 0 16 16">
										<path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
										<path
											fillRule="evenodd"
											d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
										/>
									</svg>
								</div>
								<div className="grow">
									<div className="flex justify-between items-center mb-1">
										<h4 className="font-bold text-gray-900 text-lg">
											{sellerName}
										</h4>
									</div>
									{!isOwner && (
										<div className="flex gap-3 mt-2">
											<button className="flex-1 bg-[#8B0000] text-white text-sm font-bold py-2 rounded-lg hover:bg-red-900 transition-colors flex items-center justify-center gap-2">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="16"
													height="16"
													fill="currentColor"
													className="bi bi-chat-dots-fill"
													viewBox="0 0 16 16">
													<path d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
												</svg>
												Chat Seller
											</button>
										</div>
									)}
								</div>
							</div>
						</div>

						{/* --- ACTION BUTTON LOGIC --- */}
						{isOwner ? (
							<Link href={`/profile/edit-item/${item.itemId}`}>
								<button className="w-full bg-white border-2 border-gray-300 text-gray-700 text-lg font-bold py-4 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm cursor-pointer flex items-center justify-center gap-3">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="20"
										height="20"
										fill="currentColor"
										className="bi bi-pencil-square"
										viewBox="0 0 16 16">
										<path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
										<path
											fillRule="evenodd"
											d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
										/>
									</svg>
									Edit Item
								</button>
							</Link>
						) : (
							<button className="w-full bg-yellow-400 text-gray-900 text-lg font-bold py-4 rounded-xl hover:bg-yellow-500 transition-transform transform hover:scale-[1.02] shadow-md cursor-pointer mt-auto">
								{item.transactionType === "Rent"
									? "Request to Borrow"
									: item.transactionType === "Swap"
									? "Offer a Swap"
									: "Buy Now"}
							</button>
						)}
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
};

export default ItemDetailsPage;
