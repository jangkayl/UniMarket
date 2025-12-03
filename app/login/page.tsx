"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle login logic here (API request, form validation, etc.)
		console.log("Logging in with", { email, password });
	};

	return (
		<div className="min-h-screen bg-white flex flex-col items-center gap-20">
			<Navbar />

			<div className="w-full max-w-lg bg-white shadow-lg rounded-b-2xl">
				<div className="bg-red-900 pt-8 px-8 pb-1 rounded-t-2xl">
					<h2 className="text-3xl font-bold text-center mb-6">Welcome Back!</h2>
					<p className="text-center mb-8">Log in to your UniMarket account</p>
				</div>

				<form
					onSubmit={handleSubmit}
					className="space-y-4 p-8">
					<div>
						<label
							htmlFor="email"
							className="block text-gray-600 font-medium">
							Student Email/ID
						</label>
						<input
							id="email"
							type="email"
							className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-600"
							placeholder="e.g., john.doe@cit.edu"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>

					<div>
						<label
							htmlFor="password"
							className="block text-gray-600 font-medium">
							Password
						</label>
						<input
							id="password"
							type="password"
							className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-600"
							placeholder="********"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>

					<div className="text-right pb-5">
						<a
							href="#"
							className="text-sm text-red-500 hover:underline">
							Forgot Password?
						</a>
					</div>

					<button
						type="submit"
						className="w-full py-3 bg-red-800 text-white rounded-md hover:bg-red-900 focus:outline-none cursor-pointer">
						Login
					</button>
				</form>
			</div>

			<Footer />
		</div>
	);
};

export default LoginPage;
