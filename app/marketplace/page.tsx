import { Suspense } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MarketplaceClient, {
	ListingItem,
} from "../components/MarketplaceClient";

// 1. Interface for raw data coming from Spring Boot API
// This MUST match your Java ItemDTO structure exactly
interface FetchedItem {
	itemId: number;
	itemName: string;
	price: number | null;
	category: string;
	condition: string;
	transactionType: string;
	itemPhotoId: number | null;
	sellerId: number;
	sellerFirstName?: string; // Flat field from DTO
	sellerLastName?: string; // Flat field from DTO
	rentalFee?: number | null; // Flat field from DTO
	rentalDurationDays?: number | null;
}

const MarketplacePage = async () => {
	// Initialize with the correct UI type
	let dbListings: ListingItem[] = [];

	try {
		// Use the standard REST endpoint
		const res = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/items/getAllItems`,
			{
				cache: "no-store", // Ensure fresh data on every request
			}
		);

		if (res.ok) {
			const data: FetchedItem[] = await res.json();

			// 2. Map Spring Boot Data to UI Format
			dbListings = data.map((item) => {
				// Fix 1: Construct seller name using the flat fields from DTO
				// (Fixes "Cannot read properties of undefined reading firstName")
				const sellerName =
					item.sellerFirstName && item.sellerLastName
						? `${item.sellerFirstName} ${item.sellerLastName}`
						: `Student #${item.sellerId}`;

				// Fix 2: Correctly determine price vs rental fee
				const isRental = item.transactionType === "Rent";

				// Use rentalFee if rent, otherwise price. Fallback to 0 if null.
				const rawPrice = isRental ? item.rentalFee : item.price;
				const formattedPrice = `₱${(rawPrice ?? 0).toFixed(2)}`;

				// Optional: Add context like "/ 7 Days" for rentals
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
					price: finalPriceLabel, // Now shows the correct Rental Fee
					seller: sellerName,
					// Construct Image URL
					image: item.itemPhotoId
						? `${process.env.SPRING_BOOT_API_URL}/uploads/items/${item.itemPhotoId}`
						: null,
				};
			});
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
				{/* Pass the fetched data to the Client Component */}
				<MarketplaceClient dbListings={dbListings} />
			</Suspense>

			<Footer />
		</div>
	);
};

export default MarketplacePage;
