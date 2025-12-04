"use client";

import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// --- Mock Data ---
const activeListings = [
	{
		id: 1,
		title: "Calculus III Textbook",
		price: "$45.00",
		image: "/images/book_calc.jpg",
	},
	{
		id: 2,
		title: "MacBook Pro (2020)",
		price: "$800.00",
		image: "/images/laptop_mock.jpg",
	},
	{
		id: 3,
		title: "TI-84 Plus Calculator",
		price: "$60.00",
		image: "/images/calculator.jpg",
	},
	{
		id: 4,
		title: "Mini Coffee Maker",
		price: "$25.00",
		image: "/images/coffee.jpg",
	},
	{
		id: 5,
		title: "Ergonomic Desk Chair",
		price: "$150.00",
		image: "/images/chair.jpg",
	},
	{
		id: 6,
		title: "Bluetooth Speaker",
		price: "$35.00",
		image: "/images/speaker.jpg",
	},
];

const ProfilePage = () => {
	return (
		<div className="bg-gray-50 min-h-screen flex flex-col font-sans text-gray-900">
			<Navbar />

			<main className="flex-grow w-full max-w-[1400px] mx-auto px-6 py-10">
				<h1 className="text-4xl font-bold text-gray-900 mb-8">My Profile</h1>

				<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
					{/* --- LEFT SIDEBAR --- */}
					<aside className="lg:col-span-1 space-y-6">
						{/* 1. Profile Card */}
						<div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm flex flex-col items-center text-center">
							<div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 mb-4 overflow-hidden">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="40"
									height="40"
									fill="currentColor"
									className="bi bi-image"
									viewBox="0 0 16 16">
									<path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
									<path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12" />
								</svg>
							</div>
							<h2 className="text-xl font-bold text-red-900">Jessica Lim</h2>
							<p className="text-sm text-gray-500 mb-4">Student ID: U1928374</p>
							<div className="bg-yellow-400 text-gray-900 text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="12"
									height="12"
									fill="currentColor"
									className="bi bi-patch-check-fill"
									viewBox="0 0 16 16">
									<path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.896.011a2.89 2.89 0 0 0-2.924 2.924l.01.896-.636.622a2.89 2.89 0 0 0 0 4.134l.638.622-.011.896a2.89 2.89 0 0 0 2.924 2.924l.896-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.638.896-.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.896.636-.622a2.89 2.89 0 0 0 0-4.134l-.638-.622.011-.896a2.89 2.89 0 0 0-2.924-2.924l-.896.01zm.93 4.225 1.61 2.151a.25.25 0 0 1-.226.418h-1.6v2.1a.25.25 0 0 1-.418.17l-1.9-2.1a.25.25 0 0 1 .226-.419h1.6V5.265a.25.25 0 0 1 .418-.17" />
								</svg>
								Verified Student
							</div>
						</div>

						{/* 2. Trust Score */}
						<div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
							<h3 className="font-bold text-gray-900 mb-2">Trust Score</h3>
							<div className="flex items-baseline gap-1 mb-2">
								<span className="text-4xl font-extrabold text-red-900">92</span>
								<span className="text-lg font-bold text-red-900">%</span>
								<span className="ml-auto text-sm text-gray-500 font-medium">
									Excellent
								</span>
							</div>
							<div className="w-full bg-red-100 rounded-full h-2.5">
								<div
									className="bg-red-900 h-2.5 rounded-full"
									style={{ width: "92%" }}></div>
							</div>
						</div>

						{/* 3. Earned Badges */}
						<div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
							<h3 className="font-bold text-gray-900 mb-4">Earned Badges</h3>
							<div className="flex flex-wrap gap-2">
								<div className="bg-red-50 text-red-900 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="12"
										height="12"
										fill="currentColor"
										className="bi bi-award"
										viewBox="0 0 16 16">
										<path d="M9.669.864 8 0 6.331.864l-1.858.282-.842 1.68-1.337 1.32L2.6 6l-.306 1.854 1.337 1.32.842 1.68 1.858.282L8 12l1.669-.864 1.858-.282.842-1.68 1.337-1.32L12.6 6l.306-1.854-1.337-1.32-.842-1.68z" />
									</svg>
									Top Seller
								</div>
								<div className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="12"
										height="12"
										fill="currentColor"
										className="bi bi-shield-check"
										viewBox="0 0 16 16">
										<path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.826 7.18 3.422 9.676.595.571 1.16 1.056 1.69 1.455 1.573 1.164 1.528 2.052 2.659 2.052.88 0 1.666-.372 2.502-1.094 2.238-1.928 4.67-4.148 5.672-8.086a.48.48 0 0 0-.328-.39c-.91-.256-1.956-.566-2.91-.856C11.332 1.34 9.67.92 8.01 1.59c-1.658-.67-3.32.35-4.672-.35zM8 2.25c.036 0 .073.003.11.009.28.046.56.095.84.145l.235.042c1.07.195 2.18.397 3.325.567.08.012.16.012.24 0 .84-.132 1.63-.3 2.373-.497a.475.475 0 0 1 .593.535 59.86 59.86 0 0 0-1.87 6.425c-.297 1.334-.72 2.64-1.258 3.92-.09.213-.19.423-.3.63-.09-.07-.173-.146-.25-.224-2.28-2.227-3.483-5.066-2.87-8.914a.48.48 0 0 1 .45-.415z" />
									</svg>
									Reliable Lender
								</div>
								<div className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="12"
										height="12"
										fill="currentColor"
										className="bi bi-people"
										viewBox="0 0 16 16">
										<path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
									</svg>
									Community Helper
								</div>
								<div className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="12"
										height="12"
										fill="currentColor"
										className="bi bi-tree"
										viewBox="0 0 16 16">
										<path d="M8.416.223a.5.5 0 0 0-.832 0l-3 4.5A.5.5 0 0 0 5 5.5h.098L3.076 8.735A.5.5 0 0 0 3.5 9.5h.191l-1.638 3.276a.5.5 0 0 0 .447.724H7V16h2v-2.5h4.5a.5.5 0 0 0 .447-.724L12.31 9.5h.191a.5.5 0 0 0 .424-.765L10.902 5.5H11a.5.5 0 0 0 .416-.777zM6.437 4.758A.5.5 0 0 0 6 4.5h-.066L8 1.401 10.066 4.5H10a.5.5 0 0 0-.424.765L11.598 8.5H11.5a.5.5 0 0 0-.447.724L12.69 12.5H3.309l1.638-3.276A.5.5 0 0 0 4.5 8.5h-.098l2.022-3.235a.5.5 0 0 0 .013-.507" />
									</svg>
									Eco-Friendly Trader
								</div>
							</div>
						</div>

						{/* 4. Quick Actions */}
						<div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
							<h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
							<div className="space-y-3">
								{/* REVIEWS LINK */}
								<Link
									href="/profile/reviews"
									className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-red-900 transition-colors w-full text-left">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										fill="currentColor"
										className="bi bi-file-text"
										viewBox="0 0 16 16">
										<path d="M5 4a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1zm-.5 2.5A.5.5 0 0 1 5 6h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5M5 8a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1z" />
										<path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1" />
									</svg>
									Reviews & Ratings
								</Link>

								{/* SETTINGS LINK */}
								<Link
									href="/profile/settings"
									className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-red-900 transition-colors w-full text-left">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										fill="currentColor"
										className="bi bi-gear"
										viewBox="0 0 16 16">
										<path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0" />
										<path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z" />
									</svg>
									Settings
								</Link>

								{/* PAYMENT & WALLET LINK */}
								<Link
									href="/profile/wallet"
									className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-red-900 transition-colors w-full text-left">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										fill="currentColor"
										className="bi bi-wallet2"
										viewBox="0 0 16 16">
										<path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499L12.136.326zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484L5.562 3zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z" />
									</svg>
									Payment & Wallet
								</Link>
							</div>
						</div>
					</aside>

					{/* --- RIGHT CONTENT: Listings --- */}
					<div className="lg:col-span-3">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-2xl font-bold text-gray-900">
								Active Listings
							</h2>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{activeListings.map((item) => (
								<div
									key={item.id}
									className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer">
									<div className="h-52 bg-gray-200 relative overflow-hidden">
										{/* Placeholder Image Logic */}
										<div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="48"
												height="48"
												fill="currentColor"
												className="bi bi-image"
												viewBox="0 0 16 16">
												<path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
												<path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12" />
											</svg>
										</div>
									</div>
									<div className="p-5">
										<h3 className="font-bold text-gray-900 mb-2 truncate">
											{item.title}
										</h3>
										<div className="text-[#8B0000] font-extrabold text-xl">
											{item.price}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
};

export default ProfilePage;
