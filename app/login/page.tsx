"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/app/actions/auth";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const LoginPage = () => {
	const router = useRouter();
	// Connect to Server Action
	const [state, formAction, isPending] = useActionState(loginUser, undefined);

	// Watch for success state to trigger Redirect ONLY
	useEffect(() => {
		if (state?.success) {
			router.push("/dashboard");
		}
	}, [state?.success, router]);

	return (
		<div className="min-h-screen bg-white flex flex-col items-center gap-20 relative">
			<Navbar />

			<div className="w-full max-w-lg bg-white shadow-lg rounded-b-2xl">
				<div className="bg-red-900 pt-8 px-8 pb-1 rounded-t-2xl">
					<h2 className="text-3xl font-bold text-center mb-6 text-white">
						Welcome Back!
					</h2>
					<p className="text-center mb-8 text-gray-200">
						Log in to your UniMarket account
					</p>
				</div>

				<form
					action={formAction}
					className="space-y-4 p-8">
					{/* Email Input */}
					<div>
						<label
							htmlFor="email"
							className="block text-gray-600 font-medium">
							Student Email/ID
						</label>
						<input
							name="email"
							id="email"
							type="email"
							className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-600"
							placeholder="e.g., john.doe@cit.edu"
							required
						/>
						{state?.errors?.email && (
							<p className="text-red-500 text-xs mt-1">
								{state.errors.email[0]}
							</p>
						)}
					</div>

					{/* Password Input */}
					<div>
						<label
							htmlFor="password"
							className="block text-gray-600 font-medium">
							Password
						</label>
						<input
							name="password"
							id="password"
							type="password"
							className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-600"
							placeholder="********"
							required
						/>
						{state?.errors?.password && (
							<p className="text-red-500 text-xs mt-1">
								{state.errors.password[0]}
							</p>
						)}
					</div>

					{/* Forgot Password Link */}
					<div className="text-right pb-5">
						<a
							href="#"
							className="text-sm text-red-500 hover:underline">
							Forgot Password?
						</a>
					</div>

					{/* Submit Button */}
					<button
						type="submit"
						disabled={isPending}
						className="w-full py-3 bg-red-800 text-white rounded-md hover:bg-red-900 focus:outline-none cursor-pointer disabled:bg-gray-400 transition-colors">
						{isPending ? "Logging in..." : "Login"}
					</button>

					{/* General Error Message */}
					{state?.message && !state.success && (
						<p className="text-center text-red-500 text-sm mt-2">
							{state.message}
						</p>
					)}
				</form>
			</div>

			<Footer />
		</div>
	);
};

export default LoginPage;
