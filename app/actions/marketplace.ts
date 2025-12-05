"use server";

import { CreateItemSchema, FormState } from "@/lib/definitions";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createItem(
	prevState: FormState,
	formData: FormData
): Promise<FormState> {
	// 1. Validate Form Data using Zod
	const validatedFields = CreateItemSchema.safeParse({
		itemName: formData.get("itemName"),
		category: formData.get("category"),
		description: formData.get("description"),
		transactionType: formData.get("transactionType"),
		condition: formData.get("condition"),
		price: formData.get("price"),
		rentalFee: formData.get("rentalFee"),
		rentalDurationDays: formData.get("rentalDurationDays"),
		// itemPhoto: formData.get('itemPhoto'),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: "Please check your inputs.",
		};
	}

	const {
		itemName,
		category,
		description,
		transactionType,
		condition,
		price,
		rentalFee,
		rentalDurationDays,
	} = validatedFields.data;

	try {
		// 2. Get User Session (To set Seller ID)
		const cookieStore = await cookies();
		const sessionCookie = cookieStore.get("session");

		if (!sessionCookie || !sessionCookie.value) {
			return { message: "Unauthorized. Please login again." };
		}

		let sessionUser;
		try {
			sessionUser = JSON.parse(sessionCookie.value);
		} catch (e) {
			return { message: "Invalid session data. Please login again." };
		}

		// Ensure studentId exists and is a valid number
		const sellerId = Number(sessionUser.studentId);
		if (!sellerId || isNaN(sellerId)) {
			return {
				message: "User profile error: Student ID missing. Please relogin.",
			};
		}

		// 3. Prepare Payload
		// UPDATED: Sending both 'sellerId' (flat) and 'seller' (nested) to match likely DTO structure
		const itemPayload = {
			itemName,
			category,
			description,
			transactionType,
			condition,
			availabilityStatus: "AVAILABLE",

			// Fix: Add flat sellerId in case DTO expects it at root level
			sellerId: sellerId,

			// Keep nested object in case DTO expects Entity structure
			seller: {
				studentId: sellerId,
			},

			price: transactionType === "Sell" ? price : null,
			rentalFee: transactionType === "Rent" ? rentalFee : null,
			rentalDurationDays:
				transactionType === "Rent" ? rentalDurationDays : null,
			itemPhotoId: null,
		};

		// 4. Send to Spring Boot
		const response = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/items/addItem`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(itemPayload),
			}
		);

		if (!response.ok) {
			const errorText = await response.text();
			console.error("Spring Boot Error:", errorText);

			let displayError = "Failed to create listing.";
			try {
				const errorJson = JSON.parse(errorText);
				if (errorJson.message) displayError = errorJson.message;
			} catch (e) {
				/* ignore json parse error */
			}

			return { message: displayError };
		}

		// 5. Success
		revalidatePath("/marketplace");
		revalidatePath("/profile");

		return { success: true, message: "Item posted successfully!" };
	} catch (error) {
		console.error("Create item error:", error);
		return { message: "An unexpected error occurred. Please try again." };
	}
}
