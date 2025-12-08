import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import ItemDetailsClient from "../../../components/ItemDetailsClient";

// ... (Interfaces) ...
interface ItemDetails {
	itemId: number;
	itemName: string;
	description: string;
	price: number | null;
	itemPhoto: string | null;
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
	sellerProfilePicture?: string | null;
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
	let walletBalance = 0.0;

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

		// Fetch Seller Details
		if (item && item.sellerId) {
			try {
				const sellerRes = await fetch(
					`${process.env.SPRING_BOOT_API_URL}/api/students/${item.sellerId}`,
					{ cache: "no-store" }
				);
				if (sellerRes.ok) {
					const sellerData = await sellerRes.json();
					item.sellerProfilePicture = sellerData.profilePicture;
				}
			} catch (err) {
				console.error("Failed to fetch seller profile", err);
			}
		}
	} catch (error) {
		console.error("Error fetching item details:", error);
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-900">
				<p>Error loading item.</p>
			</div>
		);
	}

	if (!item) return notFound();

	// --- CHECK OWNER & GET CURRENT USER ---
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get("session");
	let isOwner = false;
	let currentUserId = 0;

	if (sessionCookie) {
		try {
			const user = JSON.parse(sessionCookie.value);
			currentUserId = user.studentId;
			if (Number(user.studentId) === Number(item.sellerId)) {
				isOwner = true;
			}

			try {
				const walletRes = await fetch(
					`${process.env.SPRING_BOOT_API_URL}/api/wallet/${user.studentId}`,
					{ cache: "no-store" }
				);
				if (walletRes.ok) {
					const walletData = await walletRes.json();
					walletBalance = walletData.balance || 0.0;
				}
			} catch (e) {}
		} catch (e) {}
	}

	let imageUrl = null;
	if (item.itemPhoto) {
		imageUrl = `${process.env.SPRING_BOOT_API_URL}/api/items/images/${item.itemPhoto}`;
	} else if (item.itemPhotoId) {
		imageUrl = `${process.env.SPRING_BOOT_API_URL}/uploads/items/${item.itemPhotoId}`;
	}

	const sellerPicUrl = item.sellerProfilePicture
		? `${process.env.SPRING_BOOT_API_URL}/api/students/images/${item.sellerProfilePicture}`
		: null;

	const isRental = item.transactionType === "Rent";
	const displayPrice = isRental ? item.rentalFee : item.price;
	const formattedPrice = formatPrice(displayPrice);

	const sellerName =
		item.sellerFirstName && item.sellerLastName
			? `${item.sellerFirstName} ${item.sellerLastName}`
			: `Student #${item.sellerId}`;

	// --- CRITICAL FIX: Include &itemId=${item.itemId} in the URL ---
	const chatUrl = `/messages?chatWith=${item.sellerId}&itemId=${
		item.itemId
	}&refItem=${encodeURIComponent(
		item.itemName
	)}&sellerName=${encodeURIComponent(
		sellerName
	)}&sellerPic=${encodeURIComponent(item.sellerProfilePicture || "")}`;

	const clientItemData = {
		itemId: item.itemId,
		itemName: item.itemName,
		description: item.description,
		price: item.price,
		imageUrl: imageUrl,
		category: item.category,
		condition: item.condition,
		availabilityStatus: item.availabilityStatus,
		transactionType: item.transactionType,
		rentalFee: item.rentalFee,
		rentalDurationDays: item.rentalDurationDays,
		createdAt: item.createdAt,
		sellerId: item.sellerId,
	};

	const clientSellerData = {
		name: sellerName,
		profilePictureUrl: sellerPicUrl,
	};

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

				<ItemDetailsClient
					item={clientItemData}
					seller={clientSellerData}
					isOwner={isOwner}
					currentUserId={currentUserId}
					formattedPrice={formattedPrice}
					chatUrl={chatUrl}
					walletBalance={walletBalance}
				/>
			</main>
			<Footer />
		</div>
	);
};

export default ItemDetailsPage;
