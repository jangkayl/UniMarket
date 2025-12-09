import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ReviewsClient from "../../components/ReviewsClient";
import { getUserReviewsAction } from "@/app/actions/review";

interface User {
	studentId: number;
}

const ReviewsPage = async () => {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get("session");

	if (!sessionCookie) {
		redirect("/login");
	}

	const user: User = JSON.parse(sessionCookie.value);

	// Fetch Reviews
	const reviews = await getUserReviewsAction(user.studentId);

	return (
		<ReviewsClient
			currentUser={user}
			reviews={reviews}
		/>
	);
};

export default ReviewsPage;
