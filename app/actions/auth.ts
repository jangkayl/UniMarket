"use server";

import { SignupSchema, LoginSchema, FormState } from "@/lib/definitions";
import { cookies } from "next/headers";

// --- REGISTER ACTION ---
export async function registerUser(
	prevState: FormState,
	formData: FormData
): Promise<FormState> {
	// 1. Validate the frontend form data
	const validatedFields = SignupSchema.safeParse({
		fullName: formData.get("fullName"),
		studentID: formData.get("studentID"),
		citEmail: formData.get("citEmail"),
		password: formData.get("password"),
		confirmPassword: formData.get("confirmPassword"),
	});

	// 2. Return errors if validation fails
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: "Missing Fields. Failed to Register.",
		};
	}

	const { fullName, studentID, citEmail, password } = validatedFields.data;

	// 3. TRANSFORM DATA
	const trimmedName = fullName.trim();
	const lastSpaceIndex = trimmedName.lastIndexOf(" ");

	let firstName = trimmedName;
	let lastName = "";

	if (lastSpaceIndex > 0) {
		firstName = trimmedName.substring(0, lastSpaceIndex);
		lastName = trimmedName.substring(lastSpaceIndex + 1);
	}

	// Create JSON Object
	const studentData = {
		firstName: firstName,
		lastName: lastName,
		studentNumber: studentID,
		universityEmail: citEmail,
		passwordHash: password,
	};

	try {
		// 4. Forward to Spring Boot
		const response = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/students/addStudent`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(studentData),
			}
		);

		if (!response.ok) {
			const errorText = await response.text();
			return {
				message: `Registration failed: ${errorText || response.statusText}`,
			};
		}

		return { message: "Registration successful! Please login." };
	} catch (error) {
		console.error("Registration error:", error);
		return {
			message: "Failed to connect to the server. Please try again later.",
		};
	}
}

// --- LOGIN ACTION ---
export async function loginUser(
	prevState: FormState,
	formData: FormData
): Promise<FormState> {
	// 1. Validate Form
	const validatedFields = LoginSchema.safeParse({
		email: formData.get("email"),
		password: formData.get("password"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: "Invalid credentials.",
		};
	}

	const { email, password } = validatedFields.data;

	try {
		// 2. Call Spring Boot Login Endpoint
		const response = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/students/login`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			}
		);

		if (!response.ok) {
			return { message: "Invalid email or password." };
		}

		// 3. Handle Success & Set Cookie
		const user = await response.json();

		// Create a session cookie
		// In a real app, you might store a JWT token here.
		// Since we are just storing user info, we stringify it.
		const cookieStore = await cookies();

		cookieStore.set("session", JSON.stringify(user), {
			httpOnly: true, // Prevents JavaScript from reading the cookie (Security)
			secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
			maxAge: 60 * 60 * 24 * 7, // 1 week
			path: "/",
		});

		return {
			success: true,
			message: "Login successful",
			name: user.firstName || "Student",
		};
	} catch (error) {
		console.error("Login error:", error);
		return { message: "Failed to connect to login server." };
	}
}
