"use server";

import { revalidatePath } from "next/cache";

export interface ReviewItem {
	review_id: number;
	reviewerId: number;
	reviewerName: string;
	reviewerProfilePicture: string | null;
	rating: number;
	comment: string;
	created_at: string;
	itemName: string;
	transactionType: string;
}

interface SubmitReviewData {
	reviewerId: number;
	revieweeId: number;
	transactionId: number;
	rating: number;
	comment: string;
}

export async function getUserReviewsAction(userId: number) {
	try {
		const res = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/reviews/user/${userId}`,
			{
				cache: "no-store",
			}
		);
		if (res.ok) {
			return await res.json();
		}
		return [];
	} catch (error) {
		return [];
	}
}

export async function submitReviewAction(data: SubmitReviewData) {
	try {
		const res = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/reviews/addReview`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			}
		);

		if (res.ok) {
			revalidatePath("/orders");
			return { success: true };
		}
		return { success: false, message: "Failed to submit review" };
	} catch (error) {
		return { success: false, message: "Network error" };
	}
}
