import { notFound } from "next/navigation";
import PublicProfileClient from "../../components/PublicProfileClient";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getUserReviewsAction, ReviewItem } from "@/app/actions/review";

// Interface for the Profile User
interface PublicUser {
	studentId: number;
	firstName: string;
	lastName: string;
	profilePicture: string | null;
	isVerified: boolean;
	trustScore?: number;
}

interface Item {
	itemId: number;
	itemName: string;
	price: number;
	itemPhoto: string | null;
	category: string;
	condition: string;
	transactionType: string;
	availabilityStatus: string;
	createdAt: string;
	rentalFee?: number | null;
	rentalDurationDays?: number | null;
}

const PublicProfilePage = async ({
	params,
}: {
	params: Promise<{ id: string }>;
}) => {
	const { id } = await params;
	const userId = Number(id);

	if (isNaN(userId)) return notFound();

	let profileUser: PublicUser | null = null;
	let userItems: Item[] = [];
	let userReviews: ReviewItem[] = [];

	try {
		// 1. Fetch User Details
		const userRes = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/students/${userId}`,
			{
				cache: "no-store",
			}
		);

		if (!userRes.ok) {
			if (userRes.status === 404) return notFound();
		} else {
			profileUser = await userRes.json();
		}

		// 2. Fetch User's Items
		const itemsRes = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/items/seller/${userId}`,
			{
				cache: "no-store",
			}
		);

		if (itemsRes.ok) {
			userItems = await itemsRes.json();
		}

		// 3. Fetch User's Reviews
		userReviews = await getUserReviewsAction(userId);
	} catch (error) {
		console.error("Error fetching profile:", error);
		return notFound();
	}

	if (!profileUser) return notFound();

	return (
		<div className="bg-gray-50 min-h-screen flex flex-col font-sans text-gray-900">
			<Navbar />
			<PublicProfileClient
				user={profileUser}
				items={userItems}
				reviews={userReviews}
			/>
			<Footer />
		</div>
	);
};

export default PublicProfilePage;
