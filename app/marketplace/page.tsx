import { Suspense } from "react";
import { cookies } from "next/headers";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MarketplaceClient, {
	ListingItem,
} from "../components/MarketplaceClient";

// 1. Interface for raw data coming from Spring Boot API
interface FetchedItem {
	itemId: number;
	itemName: string;
	price: number | null;
	category: string;
	condition: string;
	transactionType: string;
	itemPhotoId: number | null;
	sellerId: number;
	sellerFirstName?: string;
	sellerLastName?: string;
	rentalFee?: number | null;
	rentalDurationDays?: number | null;
}

const MarketplacePage = async () => {
	// Get User Session
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get("session");

	let currentStudentId = -1;
	if (sessionCookie) {
		try {
			const user = JSON.parse(sessionCookie.value);
			currentStudentId = Number(user.studentId);
		} catch (e) {
			/* ignore */
		}
	}

	// Lists to hold separated items
	let myListings: ListingItem[] = [];
	let otherListings: ListingItem[] = [];

	try {
		const res = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/items/getAllItems`,
			{
				cache: "no-store",
			}
		);

		if (res.ok) {
			const data: FetchedItem[] = await res.json();

			const mappedItems = data.map((item) => {
				const sellerName =
					item.sellerFirstName && item.sellerLastName
						? `${item.sellerFirstName} ${item.sellerLastName}`
						: `Student #${item.sellerId}`;

				const isRental = item.transactionType === "Rent";
				const rawPrice = isRental ? item.rentalFee : item.price;
				const formattedPrice = `₱${(rawPrice ?? 0).toFixed(2)}`;

				const finalPriceLabel =
					isRental && item.rentalDurationDays
						? `${formattedPrice} / ${item.rentalDurationDays} Days`
						: formattedPrice;

				return {
					id: item.itemId,
					title: item.itemName,
					category: item.category || "Other",
					type: item.transactionType || "Sell",
					condition: item.condition || "Used",
					price: finalPriceLabel,
					seller: sellerName,
					sellerId: item.sellerId, // Needed for filtering
					image: item.itemPhotoId
						? `${process.env.SPRING_BOOT_API_URL}/uploads/items/${item.itemPhotoId}`
						: null,
				};
			});

			// --- SEPARATE ITEMS ---
			myListings = mappedItems.filter(
				(item) => Number(item.sellerId) === currentStudentId
			);
			otherListings = mappedItems.filter(
				(item) => Number(item.sellerId) !== currentStudentId
			);
		}
	} catch (error) {
		console.error("Failed to fetch marketplace items:", error);
	}

	return (
		<div className="bg-white min-h-screen flex flex-col font-sans text-gray-900 relative">
			<Navbar />

			<Suspense
				fallback={
					<div className="p-20 text-center">Loading Marketplace...</div>
				}>
				{/* Pass separated lists to Client Component */}
				<MarketplaceClient
					myListings={myListings}
					otherListings={otherListings}
				/>
			</Suspense>

			<Footer />
		</div>
	);
};

export default MarketplacePage;
