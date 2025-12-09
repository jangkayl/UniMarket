"use client";

import { useState } from "react";
import { submitReviewAction } from "@/app/actions/review";

interface ReviewModalProps {
	isOpen: boolean;
	onClose: () => void;
	transactionId: number;
	reviewerId: number;
	revieweeId: number;
	itemName: string;
	onSuccess: () => void;
}

const ReviewModal = ({
	isOpen,
	onClose,
	transactionId,
	reviewerId,
	revieweeId,
	itemName,
	onSuccess,
}: ReviewModalProps) => {
	const [rating, setRating] = useState(5);
	const [comment, setComment] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	if (!isOpen) return null;

	const handleSubmit = async () => {
		if (!comment.trim()) return;
		setIsSubmitting(true);

		const res = await submitReviewAction({
			reviewerId,
			revieweeId,
			transactionId,
			rating,
			comment,
		});

		if (res.success) {
			onSuccess();
			onClose();
		} else {
			alert("Failed to submit review.");
		}
		setIsSubmitting(false);
	};

	return (
		<div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
			<div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-up p-6">
				<h3 className="text-xl font-bold text-gray-900 mb-2">
					Rate your experience
				</h3>
				<p className="text-sm text-gray-500 mb-6">
					How was your transaction for{" "}
					<span className="font-bold">{itemName}</span>?
				</p>

				{/* Star Rating */}
				<div className="flex justify-center gap-2 mb-6">
					{[1, 2, 3, 4, 5].map((star) => (
						<button
							key={star}
							onClick={() => setRating(star)}
							className={`text-3xl transition-transform hover:scale-110 ${
								star <= rating ? "text-yellow-400" : "text-gray-200"
							}`}>
							★
						</button>
					))}
				</div>

				<textarea
					className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-900 mb-6 text-sm"
					rows={4}
					placeholder="Write a short review..."
					value={comment}
					onChange={(e) => setComment(e.target.value)}
				/>

				<div className="flex gap-3">
					<button
						onClick={onClose}
						className="flex-1 py-3 border border-gray-300 rounded-xl font-bold text-gray-600 hover:bg-gray-50">
						Cancel
					</button>
					<button
						onClick={handleSubmit}
						disabled={isSubmitting || !comment}
						className="flex-1 py-3 bg-[#8B0000] text-white rounded-xl font-bold hover:bg-red-900 disabled:bg-gray-400 transition-colors">
						{isSubmitting ? "Submitting..." : "Submit Review"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default ReviewModal;
