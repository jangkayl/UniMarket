"use client";

import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ReviewItem } from "@/app/actions/review";

interface ReviewsClientProps {
	currentUser: { studentId: number };
	reviews: ReviewItem[];
}

const StarRating = ({ rating }: { rating: number }) => {
	return (
		<div className="flex text-yellow-400 gap-1">
			{[...Array(5)].map((_, i) => (
				<svg
					key={i}
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
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
};

const ReviewsClient = ({ reviews }: ReviewsClientProps) => {
	// Calculate Average Rating
	const averageRatingVal =
		reviews.length > 0
			? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
			: 0;

	const averageRating = averageRatingVal.toFixed(1);

	// Helper for Tag Styling
	const getTagStyle = (type: string) => {
		switch (type?.toLowerCase()) {
			case "sell":
				return "bg-green-50 text-green-900 border-green-100";
			case "rent":
				return "bg-orange-50 text-orange-900 border-orange-100";
			case "swap":
				return "bg-purple-50 text-purple-900 border-purple-100";
			default:
				return "bg-gray-100 text-gray-700";
		}
	};

	const getTagLabel = (type: string, item: string) => {
		switch (type?.toLowerCase()) {
			case "sell":
				return `Sold: ${item}`;
			case "rent":
				return `Lent: ${item}`;
			case "swap":
				return `Swapped: ${item}`;
			default:
				return `Item: ${item}`;
		}
	};

	const getAvatarUrl = (photo: string | null) => {
		return photo
			? `${
					process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
			  }/api/students/images/${photo}`
			: null;
	};

	return (
		<div className="bg-white min-h-screen flex flex-col font-sans text-gray-900">
			<Navbar />

			<main className="grow w-full max-w-[1400px] mx-auto px-6 py-12">
				{/* Header Section */}
				<div className="text-center mb-16">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">
						Your Reviews & Ratings
					</h1>
					<p className="text-gray-500 text-lg">
						See what others are saying about your transactions and contributions
						to UniMarket.
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* --- LEFT COLUMN: REVIEWS GRID --- */}
					<div className="lg:col-span-2">
						<h2 className="text-2xl font-bold text-gray-900 mb-6">
							Recent Reviews ({reviews.length})
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{reviews.length > 0 ? (
								reviews.map((review) => (
									<div
										key={review.review_id}
										className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
										<div className="flex items-center gap-3 mb-4">
											{/* Avatar */}
											<div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden relative shrink-0 border border-gray-100">
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
															width="24"
															height="24"
															fill="currentColor"
															className="bi bi-person-fill"
															viewBox="0 0 16 16">
															<path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
														</svg>
													</div>
												)}
											</div>
											<div>
												<h3 className="font-bold text-gray-900">
													{review.reviewerName || "Anonymous"}
												</h3>
												<p className="text-xs text-gray-400">
													{new Date(review.created_at).toLocaleDateString()}
												</p>
											</div>
										</div>

										<div className="flex items-center gap-2 mb-3">
											<StarRating rating={review.rating} />
											<span className="text-sm text-gray-400 font-medium">
												({review.rating.toFixed(1)})
											</span>
										</div>

										<p className="text-gray-600 text-sm mb-6 grow leading-relaxed">
											&quot;{review.comment}&quot;
										</p>

										<div className="mt-auto">
											<span
												className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border ${getTagStyle(
													review.transactionType
												)}`}>
												{getTagLabel(review.transactionType, review.itemName)}
											</span>
										</div>
									</div>
								))
							) : (
								<div className="col-span-full py-12 text-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
									No reviews yet.
								</div>
							)}
						</div>
					</div>

					{/* --- RIGHT COLUMN: SIDEBAR STATS --- */}
					<div className="lg:col-span-1 space-y-8">
						{/* Overall Trust Score Card */}
						<div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-center">
							<h3 className="font-bold text-lg text-gray-900 mb-6">
								Overall Trust Score
							</h3>
							<div className="relative w-32 h-32 mx-auto flex items-center justify-center bg-gray-100 rounded-full mb-6">
								<div className="text-center">
									<span className="text-4xl font-extrabold text-[#8B0000]">
										{averageRating}
									</span>
									<span className="text-lg font-bold text-yellow-500">/5</span>
								</div>
							</div>

							{/* Decorative Line */}
							<div className="w-full bg-gray-100 rounded-full h-1.5 mb-4 overflow-hidden">
								<div
									className="bg-[#8B0000] h-1.5 rounded-full transition-all duration-1000"
									style={{ width: `${(averageRatingVal / 5) * 100}%` }}></div>
							</div>

							<p className="text-gray-500 text-sm font-medium mb-2">
								{reviews.length} reviews
							</p>
							<div className="flex justify-center">
								<StarRating rating={averageRatingVal} />
							</div>
						</div>

						{/* Rating Breakdown Card */}
						<div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
							<h3 className="font-bold text-lg text-gray-900 mb-6">
								Rating Breakdown
							</h3>
							<div className="space-y-6">
								{/* Using standard averageRating for all categories to avoid negative mock values */}
								{[
									{ label: "Item Accuracy", score: averageRating },
									{ label: "Communication", score: averageRating },
									{ label: "Timeliness", score: averageRating },
									{ label: "Fairness", score: averageRating },
								].map((item, idx) => (
									<div key={idx}>
										<div className="flex justify-between text-sm font-semibold text-gray-800 mb-1">
											<span>{item.label}</span>
											<div className="flex items-center gap-1">
												<span>{item.score}</span>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="12"
													height="12"
													fill="currentColor"
													className="bi bi-star text-yellow-400"
													viewBox="0 0 16 16">
													<path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z" />
												</svg>
											</div>
										</div>
										<div className="w-full bg-gray-100 rounded-full h-1.5">
											<div
												className="bg-[#8B0000] h-1.5 rounded-full"
												style={{
													width: `${(Number(item.score) / 5) * 100}%`,
												}}></div>
										</div>
									</div>
								))}
							</div>
							<p className="text-center text-xs text-gray-400 mt-6">
								Based on {reviews.length} individual ratings
							</p>
						</div>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
};

export default ReviewsClient;
