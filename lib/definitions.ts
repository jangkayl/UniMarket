import { z } from "zod";

// --- SIGNUP SCHEMA ---
export const SignupSchema = z
	.object({
		fullName: z
			.string()
			.min(2, { message: "Name must be at least 2 characters long." }),
		studentID: z
			.string()
			.min(5, { message: "Please enter a valid Student ID." }),
		citEmail: z
			.string()
			.email({ message: "Please enter a valid CIT email address." })
			.endsWith("@cit.edu", {
				message: "Email must belong to the @cit.edu domain.",
			}),
		password: z
			.string()
			.min(8, { message: "Password must be at least 8 characters long." }),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

// --- LOGIN SCHEMA ---
export const LoginSchema = z.object({
	email: z.string().email({ message: "Please enter a valid email address." }),
	password: z.string().min(1, { message: "Password is required." }),
});

// --- FORM STATE ---
export type FormState =
	| {
			errors?: {
				fullName?: string[];
				studentID?: string[];
				citEmail?: string[];
				password?: string[];
				confirmPassword?: string[];
				email?: string[]; // Added for login
				file?: string[];
			};
			message?: string;
			success?: boolean; // Added to trigger redirect
			name?: string; // Added for the Welcome toast
	  }
	| undefined;
