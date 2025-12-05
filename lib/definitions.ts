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

// --- CHANGE PASSWORD SCHEMA ---
export const ChangePasswordSchema = z
	.object({
		currentPassword: z
			.string()
			.min(1, { message: "Current password is required" }),
		newPassword: z
			.string()
			.min(8, { message: "New password must be at least 8 characters" }),
		confirmPassword: z
			.string()
			.min(1, { message: "Please confirm your new password" }),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

// --- CREATE ITEM SCHEMA ---
export const CreateItemSchema = z
	.object({
		itemName: z
			.string()
			.min(3, { message: "Item name must be at least 3 characters." }),
		category: z.string().min(1, { message: "Please select a category." }),
		description: z.string().optional(),
		transactionType: z.enum(["Sell", "Rent", "Swap"]),
		condition: z.string().min(1, { message: "Please select condition." }),

		// Price is required for Sell/Rent, optional for Swap
		price: z.coerce.number().optional(),

		// Rental specific fields
		rentalFee: z.coerce.number().optional(),
		rentalDurationDays: z.coerce.number().optional(),

		// File is optional for now (mocking upload)
		itemPhoto: z.any().optional(),
	})
	.refine(
		(data) => {
			if (data.transactionType === "Sell" && (!data.price || data.price <= 0)) {
				return false;
			}
			if (
				data.transactionType === "Rent" &&
				(!data.rentalFee || data.rentalFee <= 0)
			) {
				return false;
			}
			return true;
		},
		{
			message: "Price/Fee is required for this transaction type",
			path: ["price"], // Attaches error to price field generally
		}
	);

// --- FORM STATE ---
export type FormState =
	| {
			errors?: {
				// Auth Fields
				fullName?: string[];
				studentID?: string[];
				citEmail?: string[];
				password?: string[];
				confirmPassword?: string[];
				email?: string[];
				file?: string[];

				// Settings Fields
				currentPassword?: string[];
				newPassword?: string[];

				// Marketplace Fields (Added to fix your error)
				itemName?: string[];
				category?: string[];
				description?: string[];
				transactionType?: string[];
				condition?: string[];
				price?: string[];
				rentalFee?: string[];
				rentalDurationDays?: string[];
				itemPhoto?: string[];
			};
			message?: string;
			success?: boolean;
			name?: string;
	  }
	| undefined;
