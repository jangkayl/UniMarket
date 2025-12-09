"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ReviewItem } from "@/app/actions/review";

interface PublicUser {
	studentId: number;
	firstName: string;
	lastName: string;
	profilePicture: string | null;
	isVerified: boolean;
	trustScore?: number;
}

interface Item {
	itemId: number;
	itemName: string;
	price: number;
	itemPhoto: string | null;
	category: string;
	condition: string;
	transactionType: string;
	availabilityStatus: string;
	createdAt: string;
	rentalFee?: number | null;
	rentalDurationDays?: number | null;
}

interface PublicProfileClientProps {
	user: PublicUser;
	items: Item[];
	reviews: ReviewItem[];
}

const PublicProfileClient = ({
	user,
	items,
	reviews = [],
}: PublicProfileClientProps) => {
	const [activeSection, setActiveSection] = useState<"LISTINGS" | "REVIEWS">(
		"LISTINGS"
	);
	const [listingType, setListingType] = useState<"SELL" | "RENT">("SELL");

	const getAvatarUrl = (photo: string | null) => {
		return photo
			? `${
					process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
			  }/api/students/images/${photo}`
			: null;
	};

	const getItemImageUrl = (photo: string | null) => {
		return photo
			? `${
					process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
			  }/api/items/images/${photo}`
			: null;
	};

	// Filter Items
	const sellItems = items.filter(
		(item) =>
			item.transactionType.toLowerCase() === "sell" ||
			item.transactionType.toLowerCase() === "swap"
	);
	const rentItems = items.filter(
		(item) => item.transactionType.toLowerCase() === "rent"
	);

	const displayItems = listingType === "SELL" ? sellItems : rentItems;

	// --- CALCULATE RATINGS ---
	const reviewCount = reviews ? reviews.length : 0;

	const averageRatingVal =
		reviewCount > 0
			? reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount
			: 0;

	const averageRatingStr =
		averageRatingVal > 0 ? averageRatingVal.toFixed(1) : "New";

	// Helper Components
	const StarRating = ({ rating }: { rating: number }) => (
		<div className="flex text-yellow-400 gap-0.5">
			{[...Array(5)].map((_, i) => (
				<svg
					key={i}
					xmlns="http://www.w3.org/2000/svg"
					width="14"
					height="14"
					fill={i < Math.floor(rating) ? "currentColor" : "none"}
					stroke="currentColor"
					strokeWidth="1.5"
					className="bi bi-star-fill"
					viewBox="0 0 16 16">
					<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
				</svg>
			))}
		</div>
	);

	const getTagStyle = (type: string) => {
		switch (type?.toLowerCase()) {
			case "sell":
				return "bg-green-50 text-green-900 border-green-100";
			case "rent":
				return "bg-orange-50 text-orange-900 border-orange-100";
			default:
				return "bg-gray-100 text-gray-700";
		}
	};

	return (
		<div className="bg-gray-50 min-h-screen flex flex-col font-sans text-gray-900">
			<main className="grow">
				{/* --- HERO BANNER --- */}
				<div className="h-64 bg-linear-to-r from-red-900 via-red-800 to-red-950 relative overflow-hidden">
					<div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
					<div className="absolute -bottom-10 -right-10 w-64 h-64 bg-yellow-400 rounded-full blur-[100px] opacity-20"></div>
					<div className="absolute -top-10 -left-10 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20"></div>
				</div>

				<div className="max-w-[1200px] mx-auto px-6 pb-20 relative">
					{/* --- PROFILE CARD (Floating) --- */}
					<div className="-mt-20 bg-white rounded-3xl p-8 shadow-xl border border-gray-100 relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 mb-12">
						{/* Avatar */}
						<div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100 relative shrink-0">
							{user.profilePicture ? (
								<Image
									src={getAvatarUrl(user.profilePicture)!}
									alt="Profile"
									fill
									className="object-cover"
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="64"
										height="64"
										fill="currentColor"
										className="bi bi-person-fill"
										viewBox="0 0 16 16">
										<path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
									</svg>
								</div>
							)}
						</div>

						{/* Info */}
						<div className="text-center md:text-left grow">
							<h1 className="text-3xl font-extrabold text-gray-900 flex items-center justify-center md:justify-start gap-2">
								{user.firstName} {user.lastName}
								{user.isVerified && (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										fill="currentColor"
										className="bi bi-patch-check-fill text-blue-500"
										viewBox="0 0 16 16">
										<path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.896.011a2.89 2.89 0 0 0-2.924 2.924l.01.896-.636.622a2.89 2.89 0 0 0 0 4.134l.638.622-.011.896a2.89 2.89 0 0 0 2.924 2.924l.896-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.638.896-.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.896.636-.622a2.89 2.89 0 0 0 0-4.134l-.638-.622.011-.896a2.89 2.89 0 0 0-2.924-2.924l-.896.01zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708" />
									</svg>
								)}
							</h1>
							<p className="text-gray-500 font-medium">
								Student • CIT University
							</p>

							<div className="flex items-center justify-center md:justify-start gap-4 mt-3">
								<div className="bg-yellow-50 text-yellow-800 px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1 border border-yellow-100">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="14"
										height="14"
										fill="currentColor"
										className="bi bi-star-fill text-yellow-500"
										viewBox="0 0 16 16">
										<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
									</svg>
									Rating: {averageRatingStr}
								</div>
								<div className="text-gray-400 text-sm border-r pr-4 mr-2">
									<span className="font-bold text-gray-900">
										{items.length}
									</span>{" "}
									Items
								</div>
								<div className="text-gray-400 text-sm">
									<span className="font-bold text-gray-900">{reviewCount}</span>{" "}
									Reviews
								</div>
							</div>
						</div>

						{/* Actions */}
						<div className="flex gap-3 mt-4 md:mt-0 w-full md:w-auto">
							<Link
								href={`/messages?chatWith=${user.studentId}`}
								className="flex-1 md:flex-none">
								<button className="w-full md:w-auto bg-gray-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="18"
										height="18"
										fill="currentColor"
										className="bi bi-chat-dots-fill"
										viewBox="0 0 16 16">
										<path d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
									</svg>
									Message
								</button>
							</Link>
						</div>
					</div>

					{/* --- MAIN TABS --- */}
					<div className="flex border-b border-gray-200 mb-8">
						<button
							onClick={() => setActiveSection("LISTINGS")}
							className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors ${
								activeSection === "LISTINGS"
									? "border-red-900 text-red-900"
									: "border-transparent text-gray-500 hover:text-gray-700"
							}`}>
							Listings ({items.length})
						</button>
						<button
							onClick={() => setActiveSection("REVIEWS")}
							className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors ${
								activeSection === "REVIEWS"
									? "border-red-900 text-red-900"
									: "border-transparent text-gray-500 hover:text-gray-700"
							}`}>
							Reviews ({reviewCount})
						</button>
					</div>

					{/* --- LISTINGS CONTENT --- */}
					{activeSection === "LISTINGS" && (
						<div className="animate-fade-in">
							<div className="flex bg-gray-100 p-1 rounded-lg mb-6">
								<button
									onClick={() => setListingType("SELL")}
									className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
										listingType === "SELL"
											? "bg-white shadow-sm text-gray-900"
											: "text-gray-500 hover:text-gray-700"
									}`}>
									For Sale ({sellItems.length})
								</button>
								<button
									onClick={() => setListingType("RENT")}
									className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
										listingType === "RENT"
											? "bg-white shadow-sm text-gray-900"
											: "text-gray-500 hover:text-gray-700"
									}`}>
									For Rent ({rentItems.length})
								</button>
							</div>

							{displayItems.length > 0 ? (
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
									{displayItems.map((item) => (
										<Link
											href={`/marketplace/item/${item.itemId}`}
											key={item.itemId}
											className="group block bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
											<div className="relative h-56 bg-gray-100 flex items-center justify-center overflow-hidden">
												{item.itemPhoto ? (
													<Image
														src={getItemImageUrl(item.itemPhoto)!}
														alt={item.itemName}
														fill
														className="object-cover group-hover:scale-110 transition-transform duration-500"
													/>
												) : (
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="48"
														height="48"
														fill="currentColor"
														className="bi bi-image text-gray-300"
														viewBox="0 0 16 16">
														<path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
														<path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12" />
													</svg>
												)}

												<div className="absolute top-3 right-3">
													<span
														className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm ${
															item.availabilityStatus === "AVAILABLE"
																? "bg-green-100 text-green-800"
																: "bg-gray-800 text-white"
														}`}>
														{item.availabilityStatus}
													</span>
												</div>
												<div className="absolute bottom-3 left-3">
													<span
														className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm border ${
															item.transactionType === "Rent"
																? "bg-orange-100 text-orange-800 border-orange-200"
																: "bg-blue-100 text-blue-800 border-blue-200"
														}`}>
														{item.transactionType}
													</span>
												</div>
											</div>

											<div className="p-4">
												<h3 className="font-bold text-gray-900 text-lg mb-1 truncate group-hover:text-[#8B0000] transition-colors">
													{item.itemName}
												</h3>
												<p className="text-gray-500 text-xs mb-3 font-medium uppercase tracking-wide">
													{item.category}
												</p>
												<div className="flex justify-between items-end">
													<div className="text-xl font-extrabold text-[#8B0000]">
														₱
														{item.rentalFee
															? item.rentalFee.toLocaleString()
															: item.price.toLocaleString()}
														{item.transactionType === "Rent" &&
															item.rentalDurationDays && (
																<span className="text-xs text-gray-500 font-normal ml-1">
																	/ {item.rentalDurationDays} days
																</span>
															)}
													</div>
													<div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#8B0000] group-hover:text-white transition-colors">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="16"
															height="16"
															fill="currentColor"
															className="bi bi-arrow-right"
															viewBox="0 0 16 16">
															<path
																fillRule="evenodd"
																d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
															/>
														</svg>
													</div>
												</div>
											</div>
										</Link>
									))}
								</div>
							) : (
								<div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
									<div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-4">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="32"
											height="32"
											fill="currentColor"
											className="bi bi-inbox"
											viewBox="0 0 16 16">
											<path d="M4.98 4a.5.5 0 0 0-.39.188L1.54 8H6a.5.5 0 0 1 .5.5 1.5 1.5 0 1 0 3 0A.5.5 0 0 1 10 8h4.46l-3.05-3.812A.5.5 0 0 0 11.02 4H4.98zm9.954 5H10.45a2.5 2.5 0 0 1-4.9 0H1.066l.32 2.562a.5.5 0 0 0 .497.438h12.234a.5.5 0 0 0 .496-.438L14.933 9zM3.809 3.563A1.5 1.5 0 0 1 4.981 3h6.038a1.5 1.5 0 0 1 1.172.563l3.7 4.625a.5.5 0 0 1 .105.374l-.39 3.124A1.5 1.5 0 0 1 14.117 13H1.883a1.5 1.5 0 0 1-1.489-1.314l-.39-3.124a.5.5 0 0 1 .106-.374l3.7-4.625z" />
										</svg>
									</div>
									<p className="text-gray-500 font-medium">
										No {listingType.toLowerCase()} listings found.
									</p>
								</div>
							)}
						</div>
					)}

					{/* --- REVIEWS SECTION --- */}
					{activeSection === "REVIEWS" && (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
							{reviews && reviews.length > 0 ? (
								reviews.map((review) => (
									<div
										key={review.review_id}
										className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
										<div className="flex items-center gap-3 mb-4">
											<div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden relative shrink-0 border border-gray-100">
												{review.reviewerProfilePicture ? (
													<Image
														src={getAvatarUrl(review.reviewerProfilePicture)!}
														alt={review.reviewerName}
														fill
														className="object-cover"
													/>
												) : (
													<div className="w-full h-full flex items-center justify-center text-gray-400">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="20"
															height="20"
															fill="currentColor"
															className="bi bi-person-fill"
															viewBox="0 0 16 16">
															<path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
														</svg>
													</div>
												)}
											</div>
											<div>
												<h4 className="font-bold text-gray-900 text-sm">
													{review.reviewerName || "User"}
												</h4>
												<p className="text-xs text-gray-400">
													{new Date(review.created_at).toLocaleDateString()}
												</p>
											</div>
										</div>
										<div className="flex mb-3">
											<StarRating rating={review.rating} />
										</div>
										<p className="text-gray-600 text-sm italic mb-4 grow">
											&quot;{review.comment}&quot;
										</p>
										<div className="pt-3 border-t border-gray-100 flex items-center gap-2">
											<span
												className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getTagStyle(
													review.transactionType
												)}`}>
												{review.transactionType}
											</span>
											<span className="text-xs font-semibold text-gray-700 truncate">
												{review.itemName || "Item"}
											</span>
										</div>
									</div>
								))
							) : (
								<div className="col-span-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
									<div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-4">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="32"
											height="32"
											fill="currentColor"
											className="bi bi-chat-square-text"
											viewBox="0 0 16 16">
											<path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
											<path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
										</svg>
									</div>
									<p className="text-gray-500 font-medium">No reviews yet.</p>
								</div>
							)}
						</div>
					)}
				</div>
			</main>
		</div>
	);
};

export default PublicProfileClient;
