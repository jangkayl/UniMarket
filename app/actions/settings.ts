"use server";

import { ChangePasswordSchema, FormState } from "@/lib/definitions";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function changePassword(
	prevState: FormState,
	formData: FormData
): Promise<FormState> {
	// 1. Validate Form Data
	const validatedFields = ChangePasswordSchema.safeParse({
		currentPassword: formData.get("currentPassword"),
		newPassword: formData.get("newPassword"),
		confirmPassword: formData.get("confirmPassword"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: "Please fix the errors below.",
		};
	}

	const { currentPassword, newPassword } = validatedFields.data;

	try {
		// 2. Get User Session
		const cookieStore = await cookies();
		const sessionCookie = cookieStore.get("session");

		if (!sessionCookie) {
			return { message: "Unauthorized. Please login again." };
		}

		const sessionUser = JSON.parse(sessionCookie.value);
		const userId = sessionUser.studentId;
		const email = sessionUser.universityEmail;

		// 3. FETCH current student data from Spring Boot
		// We need the full object to ensure we don't overwrite other fields with null during update
		const fetchResponse = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/students/getStudentByEmail/${email}`,
			{
				method: "GET",
				headers: { "Content-Type": "application/json" },
			}
		);

		if (!fetchResponse.ok) {
			return { message: "Failed to retrieve user details." };
		}

		const currentStudentData = await fetchResponse.json();

		// 4. Verify Current Password
		// Note: In a production app, verify hash. Here we compare as per your service logic.
		if (currentStudentData.passwordHash !== currentPassword) {
			return {
				message: "Incorrect current password.",
				errors: { currentPassword: ["Incorrect password"] },
			};
		}

		// 5. Prepare Update Payload
		// We keep all existing fields and ONLY update the password
		const updatedStudentData = {
			...currentStudentData,
			passwordHash: newPassword, // Update the password
		};

		// 6. Send Update to Spring Boot
		const updateResponse = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/students/updateStudent/${userId}`,
			{
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(updatedStudentData),
			}
		);

		if (!updateResponse.ok) {
			return { message: "Failed to update password. Please try again." };
		}

		return {
			success: true,
			message: "Password updated successfully!",
		};
	} catch (error) {
		console.error("Password change error:", error);
		return { message: "An unexpected error occurred." };
	}
}

export type SettingsFormState =
	| {
			success?: boolean;
			message?: string;
			errors?: { [key: string]: string[] };
	  }
	| undefined;

export async function updateProfilePicture(
	prevState: SettingsFormState,
	formData: FormData
): Promise<SettingsFormState> {
	try {
		const cookieStore = await cookies();
		const sessionCookie = cookieStore.get("session");

		if (!sessionCookie) return { success: false, message: "Unauthorized" };
		const user = JSON.parse(sessionCookie.value);

		const file = formData.get("profilePicture");
		if (!file) return { success: false, message: "No file selected" };

		const backendFormData = new FormData();
		backendFormData.append("file", file);

		const res = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/students/${user.studentId}/upload-picture`,
			{
				method: "POST",
				body: backendFormData,
			}
		);

		if (res.ok) {
			revalidatePath("/profile/settings");
			revalidatePath("/profile");
			return { success: true, message: "Profile picture updated!" };
		} else {
			return { success: false, message: "Failed to upload image." };
		}
	} catch (error) {
		console.error("Upload error:", error);
		return { success: false, message: "An error occurred." };
	}
}

export async function removeProfilePictureAction(): Promise<SettingsFormState> {
	try {
		const cookieStore = await cookies();
		const sessionCookie = cookieStore.get("session");

		if (!sessionCookie) return { success: false, message: "Unauthorized" };
		const user = JSON.parse(sessionCookie.value);

		const res = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/students/${user.studentId}/profile-picture`,
			{
				method: "DELETE",
			}
		);

		if (res.ok) {
			revalidatePath("/profile/settings");
			revalidatePath("/profile");
			return { success: true, message: "Profile picture removed." };
		} else {
			return { success: false, message: "Failed to remove picture." };
		}
	} catch (error) {
		console.error("Remove error:", error);
		return { success: false, message: "An error occurred." };
	}
}
