"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutUser } from "@/app/actions/auth"; // Import the logout action

const Navbar = () => {
	const pathname = usePathname();
	const router = useRouter();

	// State for the logout confirmation modal
	const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

	const handleLogout = async () => {
		// 1. Call Server Action to delete cookie
		await logoutUser();
		// 2. Close modal
		setShowLogoutConfirm(false);
		// 3. Redirect to login
		router.push("/login");
	};

	// Define which pages are "Public" (No app navigation shown)
	const isPublicPage =
		pathname === "/" || pathname === "/login" || pathname === "/register";

	const navLinks = [
		{ name: "Dashboard", href: "/dashboard" },
		{ name: "Marketplace", href: "/marketplace" },
		{ name: "Borrow/Loans", href: "/loans" },
	];

	return (
		<>
			<header className="bg-red-900 text-white py-4 px-8 flex justify-between items-center w-full sticky top-0 z-50 shadow-md">
				{/* Logo Section */}
				<Link
					href="/"
					className="text-2xl font-semibold flex items-center italic">
					<Image
						src="/images/unimarket_logo.png"
						alt="Logo"
						width={30}
						height={30}
						className="w-auto h-7 pr-2"
					/>
					UniMarket
				</Link>

				{isPublicPage ? (
					/* --- PUBLIC STATE --- */
					<div>
						<Link
							href="/help"
							className="mr-6 hover:underline text-sm font-medium">
							Help/FAQ
						</Link>

						{pathname !== "/login" && (
							<Link href="/login">
								<button className="bg-white text-red-900 px-5 py-2 rounded-lg font-bold mr-3 hover:bg-gray-100 transition-colors cursor-pointer">
									Login
								</button>
							</Link>
						)}
						{pathname !== "/register" && (
							<Link href="/register">
								<button className="bg-transparent border-2 border-white text-white px-5 py-2 rounded-lg font-bold hover:bg-white/10 transition-colors cursor-pointer">
									Register
								</button>
							</Link>
						)}
					</div>
				) : (
					/* --- APP STATE --- */
					<>
						{/* Center Navigation Links */}
						<nav className="hidden md:flex items-center gap-8">
							{navLinks.map((link) => (
								<Link
									key={link.name}
									href={link.href}
									className={`text-sm transition-colors hover:text-white ${
										pathname === link.href
											? "text-white font-bold border-b-2 border-white pb-1"
											: "text-red-100 font-medium"
									}`}>
									{link.name}
								</Link>
							))}
						</nav>

						{/* Right Side Icons & Actions */}
						<div className="flex items-center gap-6">
							{/* Messages Icon */}
							<Link
								href="/messages"
								className="relative text-red-100 hover:text-white transition-colors"
								title="Messages">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="22"
									height="22"
									fill="currentColor"
									className="bi bi-chat-dots-fill"
									viewBox="0 0 16 16">
									<path d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
								</svg>
							</Link>

							{/* Notification Bell */}
							<Link
								href="/notifications"
								className="relative text-red-100 hover:text-white transition-colors"
								title="Notifications">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="22"
									height="22"
									fill="currentColor"
									className="bi bi-bell-fill"
									viewBox="0 0 16 16">
									<path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
								</svg>
								<span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-red-900 bg-yellow-400 transform translate-x-1/4 -translate-y-1/4"></span>
							</Link>

							{/* Profile Link */}
							<Link
								href="/profile"
								className="flex items-center gap-2 text-red-100 hover:text-white transition-colors">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									fill="currentColor"
									className="bi bi-person-circle"
									viewBox="0 0 16 16">
									<path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
									<path
										fillRule="evenodd"
										d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
									/>
								</svg>
							</Link>

							{/* Logout Button - Triggers Modal */}
							<button
								onClick={() => setShowLogoutConfirm(true)}
								className="flex items-center gap-2 bg-white text-red-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors shadow-sm cursor-pointer">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									fill="currentColor"
									className="bi bi-box-arrow-right"
									viewBox="0 0 16 16">
									<path
										fillRule="evenodd"
										d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"
									/>
									<path
										fillRule="evenodd"
										d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
									/>
								</svg>
								Logout
							</button>
						</div>
					</>
				)}
			</header>

			{/* --- CONFIRMATION MODAL --- */}
			{showLogoutConfirm && (
				<div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4 backdrop-blur-sm">
					<div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full transform transition-all scale-100">
						<h3 className="text-xl font-bold text-gray-900 mb-2">
							Confirm Logout
						</h3>
						<p className="text-gray-600 mb-6">
							Are you sure you want to log out of your account?
						</p>
						<div className="flex gap-3 justify-end">
							<button
								onClick={() => setShowLogoutConfirm(false)}
								className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors cursor-pointer">
								Cancel
							</button>
							<button
								onClick={handleLogout}
								className="px-4 py-2 bg-red-900 text-white hover:bg-red-800 rounded-lg font-medium transition-colors cursor-pointer">
								Logout
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Navbar;
