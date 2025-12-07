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
		// We don't validate the file strictly in Zod here, but we pass it through
		itemPhoto: formData.get("itemPhoto"),
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

		const sellerId = sessionUser.studentId;
		if (!sellerId) {
			return {
				message: "User profile error: Student ID missing. Please relogin.",
			};
		}

		// 3. Prepare FormData for Spring Boot
		// We use a new FormData object to match the @ModelAttribute expectation in Spring Boot
		const backendFormData = new FormData();

		// Append Text Fields (Keys must match ItemDTO fields)
		backendFormData.append("itemName", itemName);
		backendFormData.append("category", category);
		if (description) backendFormData.append("description", description);
		backendFormData.append("transactionType", transactionType);
		backendFormData.append("condition", condition);
		backendFormData.append("availabilityStatus", "AVAILABLE");
		backendFormData.append("sellerId", sellerId.toString()); // Flat ID for DTO mapping

		// Conditional Fields
		if (transactionType === "Sell" && price)
			backendFormData.append("price", price.toString());
		if (transactionType === "Rent") {
			if (rentalFee) backendFormData.append("rentalFee", rentalFee.toString());
			if (rentalDurationDays)
				backendFormData.append(
					"rentalDurationDays",
					rentalDurationDays.toString()
				);
		}
		if (transactionType === "Swap" && price)
			backendFormData.append("price", price.toString());

		// Append File (Key 'file' matches @RequestParam("file") in Spring Boot)
		const file = formData.get("itemPhoto") as File;
		if (file && file.size > 0) {
			backendFormData.append("file", file);
		}

		// 4. Send to Spring Boot
		// Note: Do NOT set Content-Type header manually; fetch sets it with boundary for FormData
		const response = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/items/addItem`,
			{
				method: "POST",
				body: backendFormData,
			}
		);

		if (!response.ok) {
			const errorText = await response.text();
			console.error("Spring Boot Error:", errorText);
			return { message: "Failed to create listing. Please try again." };
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

// --- UPDATE ITEM ACTION ---
export async function updateItem(
	prevState: FormState,
	formData: FormData
): Promise<FormState> {
	const itemId = formData.get("itemId");

	// 1. Validate Form Data
	const validatedFields = CreateItemSchema.safeParse({
		itemName: formData.get("itemName"),
		category: formData.get("category"),
		description: formData.get("description"),
		transactionType: formData.get("transactionType"),
		condition: formData.get("condition"),
		price: formData.get("price"),
		rentalFee: formData.get("rentalFee"),
		rentalDurationDays: formData.get("rentalDurationDays"),
		itemPhoto: formData.get("itemPhoto"), // Pass file to validation
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
		// 2. Verify Session
		const cookieStore = await cookies();
		const sessionCookie = cookieStore.get("session");
		if (!sessionCookie) return { message: "Unauthorized." };
		const sessionUser = JSON.parse(sessionCookie.value);
		const sellerId = Number(sessionUser.studentId);

		// 3. Prepare FormData for Spring Boot (Multipart)
		const backendFormData = new FormData();

		backendFormData.append("itemName", itemName);
		backendFormData.append("category", category);
		if (description) backendFormData.append("description", description);
		backendFormData.append("transactionType", transactionType);
		backendFormData.append("condition", condition);
		// Ensure availability is preserved or defaulted. You might want a hidden input for this in the future.
		backendFormData.append("availabilityStatus", "AVAILABLE");

		backendFormData.append("sellerId", sellerId.toString());

		if (transactionType === "Sell" && price)
			backendFormData.append("price", price.toString());
		if (transactionType === "Rent") {
			if (rentalFee) backendFormData.append("rentalFee", rentalFee.toString());
			if (rentalDurationDays)
				backendFormData.append(
					"rentalDurationDays",
					rentalDurationDays.toString()
				);
		}
		if (transactionType === "Swap" && price)
			backendFormData.append("price", price.toString());

		// Handle File Update
		const file = formData.get("itemPhoto") as File;
		if (file && file.size > 0) {
			backendFormData.append("file", file);
		} else {
			// If no new file, we rely on the backend not overwriting the existing photo
			// if the file param is null/empty.
			// Ensure we pass the OLD itemPhoto string if Spring Boot needs it to persist.
			const currentPhoto = formData.get("currentItemPhoto") as string;
			if (currentPhoto) backendFormData.append("itemPhoto", currentPhoto);
		}

		// 4. Send PUT Request
		const response = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/items/updateItem/${itemId}`,
			{
				method: "PUT",
				// Remove Content-Type header for FormData so boundary is set automatically
				body: backendFormData,
			}
		);

		if (!response.ok) {
			const errorText = await response.text();
			console.error("Update Failed:", errorText);
			return { message: "Failed to update item." };
		}

		revalidatePath("/profile");
		revalidatePath(`/marketplace/item/${itemId}`);

		return { success: true, message: "Item updated successfully!" };
	} catch (error) {
		console.error("Update error:", error);
		return { message: "An error occurred." };
	}
}

export async function deleteItemAction(itemId: number): Promise<FormState> {
	try {
		const cookieStore = await cookies();
		const sessionCookie = cookieStore.get("session");
		if (!sessionCookie) return { message: "Unauthorized." };

		const response = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/items/deleteItem/${itemId}`,
			{
				method: "DELETE",
			}
		);

		if (!response.ok) {
			return { message: "Failed to delete item." };
		}

		revalidatePath("/marketplace");
		revalidatePath("/profile");

		return { success: true, message: "Item deleted successfully." };
	} catch (error) {
		console.error("Delete error:", error);
		return { message: "An error occurred while deleting." };
	}
}
