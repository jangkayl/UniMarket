"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ReviewModal from "../components/ReviewModal";
import {
	TransactionHistoryItem,
	returnItemAction,
	completeReturnAction,
} from "@/app/actions/transaction";

interface LoansClientProps {
	currentUser: { studentId: number };
	transactions: TransactionHistoryItem[];
}

// Extend type to include hasReviewed flag
interface ExtendedTransactionItem extends TransactionHistoryItem {
	hasReviewed?: boolean;
}

const LoansClient = ({ currentUser, transactions }: LoansClientProps) => {
	const [activeTab, setActiveTab] = useState<"borrower" | "lender">("borrower");
	const [loadingActionId, setLoadingActionId] = useState<number | null>(null);

	// Review Modal State
	const [isReviewOpen, setIsReviewOpen] = useState(false);
	const [reviewTarget, setReviewTarget] = useState<{
		txId: number;
		revieweeId: number;
		itemName: string;
	} | null>(null);

	// 1. FILTER FOR RENTALS ONLY
	const rentalTransactions = transactions.filter(
		(t) => t.transactionType.toLowerCase() === "rent"
	) as ExtendedTransactionItem[];

	const displayList = rentalTransactions
		.filter((tx) => {
			return activeTab === "borrower"
				? tx.buyerId === currentUser.studentId
				: tx.sellerId === currentUser.studentId;
		})
		.sort((a, b) => {
			// Sort priority: Active (Ongoing/Returning) > Pending > Completed
			const getPriority = (s: string) => {
				const status = s.toLowerCase();
				if (status === "ongoing" || status === "returning") return 0;
				if (status === "pending" || status === "to meet") return 1;
				return 2;
			};
			const pA = getPriority(a.status);
			const pB = getPriority(b.status);
			if (pA !== pB) return pA - pB;
			return b.transactionId - a.transactionId;
		});

	// --- HANDLERS ---
	const handleReturnItem = async (txId: number) => {
		if (!confirm("Are you ready to return this item to the owner?")) return;
		setLoadingActionId(txId);
		await returnItemAction(txId, currentUser.studentId);
		setLoadingActionId(null);
		window.location.reload();
	};

	const handleConfirmReturn = async (txId: number) => {
		if (!confirm("Confirm that you have received the item back?")) return;
		setLoadingActionId(txId);
		await completeReturnAction(txId, currentUser.studentId);
		setLoadingActionId(null);
		window.location.reload();
	};

	const handleOpenReview = (tx: ExtendedTransactionItem) => {
		setReviewTarget({
			txId: tx.transactionId,
			revieweeId: activeTab === "borrower" ? tx.sellerId : tx.buyerId,
			itemName: tx.itemName,
		});
		setIsReviewOpen(true);
	};

	// --- STYLES ---
	const getStatusColor = (status: string) => {
		switch (status?.toLowerCase()) {
			case "completed":
				return "bg-green-100 text-green-700 border-green-200";
			case "ongoing":
				return "bg-blue-50 text-blue-700 border-blue-200";
			case "returning":
				return "bg-orange-50 text-orange-700 border-orange-200 animate-pulse";
			case "pending":
				return "bg-yellow-50 text-yellow-700 border-yellow-200";
			case "cancelled":
				return "bg-red-50 text-red-700 border-red-200";
			default:
				return "bg-gray-50 text-gray-500 border-gray-200";
		}
	};

	const formatDate = (dateString: string) =>
		new Date(dateString).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});

	const getAvatarUrl = (photo: string | null) =>
		photo
			? `${
					process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
			  }/api/items/images/${photo}`
			: null;

	return (
		<div className="bg-gray-50 min-h-screen flex flex-col font-sans text-gray-900">
			<Navbar />
			<main className="grow w-full max-w-[1400px] mx-auto px-6 py-12">
				<div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
					<div>
						<h1 className="text-4xl font-bold text-gray-900">Borrow & Loans</h1>
						<p className="text-gray-500 mt-1">
							Manage items you are borrowing or lending.
						</p>
					</div>
					<div className="bg-white p-1.5 rounded-xl border border-gray-200 inline-flex shadow-sm self-start md:self-auto">
						<button
							onClick={() => setActiveTab("borrower")}
							className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${
								activeTab === "borrower"
									? "bg-[#8B0000] text-white shadow-md"
									: "text-gray-500 hover:bg-gray-50"
							}`}>
							Borrowing
						</button>
						<button
							onClick={() => setActiveTab("lender")}
							className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${
								activeTab === "lender"
									? "bg-[#8B0000] text-white shadow-md"
									: "text-gray-500 hover:bg-gray-50"
							}`}>
							Lending
						</button>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{displayList.length > 0 ? (
						displayList.map((loan) => {
							const isCompleted =
								loan.status.toLowerCase() === "completed" ||
								loan.status.toLowerCase() === "cancelled";
							const canReview = isCompleted && !loan.hasReviewed;
							const hasReviewed = isCompleted && loan.hasReviewed;

							return (
								<div
									key={loan.transactionId}
									className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col">
									<div className="h-40 bg-gray-100 rounded-xl overflow-hidden mb-4 relative flex items-center justify-center border border-gray-100">
										{loan.itemImage ? (
											<Image
												src={getAvatarUrl(loan.itemImage)!}
												alt={loan.itemName}
												fill
												className="object-cover"
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
										<div className="absolute top-2 left-2">
											<span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-1 rounded border border-orange-200 uppercase">
												RENT
											</span>
										</div>
									</div>

									<div className="flex justify-between items-start mb-2">
										<h3
											className="font-bold text-lg text-gray-900 line-clamp-1 flex-1 pr-2"
											title={loan.itemName}>
											{loan.itemName || "Unknown Item"}
										</h3>
										<span
											className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border shrink-0 ${getStatusColor(
												loan.status
											)}`}>
											{loan.status}
										</span>
									</div>

									<p className="text-sm text-gray-500 mb-4">
										{activeTab === "borrower" ? (
											<>
												Lender:{" "}
												<span className="font-semibold text-gray-800">
													{loan.sellerName}
												</span>
											</>
										) : (
											<>
												Borrower:{" "}
												<span className="font-semibold text-gray-800">
													{loan.buyerName}
												</span>
											</>
										)}
									</p>

									<div className="text-xs text-gray-400 mb-4 space-y-1">
										<p>Start: {formatDate(loan.transactionDate)}</p>
										{loan.dueDate && (
											<p className="text-orange-700 font-semibold">
												Due: {formatDate(loan.dueDate)}
											</p>
										)}
									</div>

									<div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
										{/* RENTAL ACTIONS */}
										{loan.status.toLowerCase() === "ongoing" &&
										activeTab === "borrower" ? (
											<button
												onClick={() => handleReturnItem(loan.transactionId)}
												disabled={loadingActionId === loan.transactionId}
												className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 text-sm font-bold shadow-sm transition-colors disabled:opacity-50">
												{loadingActionId === loan.transactionId
													? "..."
													: "Return Item"}
											</button>
										) : loan.status.toLowerCase() === "returning" &&
										  activeTab === "lender" ? (
											<button
												onClick={() => handleConfirmReturn(loan.transactionId)}
												disabled={loadingActionId === loan.transactionId}
												className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 text-sm font-bold shadow-sm transition-colors disabled:opacity-50">
												{loadingActionId === loan.transactionId
													? "..."
													: "Confirm Return"}
											</button>
										) : canReview ? (
											// REVIEW BUTTON
											<button
												onClick={() => handleOpenReview(loan)}
												className="flex-1 flex items-center justify-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 rounded-lg py-2 text-sm font-bold shadow-sm transition-colors">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="12"
													height="12"
													fill="currentColor"
													className="bi bi-star-fill"
													viewBox="0 0 16 16">
													<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
												</svg>
												Review
											</button>
										) : hasReviewed ? (
											// REVIEWED INDICATOR
											<div className="flex-1 flex items-center justify-center gap-1 bg-green-50 text-green-700 border border-green-100 rounded-lg py-2 text-xs font-bold cursor-default">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="12"
													height="12"
													fill="currentColor"
													className="bi bi-check-circle-fill"
													viewBox="0 0 16 16">
													<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
												</svg>
												Reviewed
											</div>
										) : (
											<Link
												href={`/messages?chatWith=${
													activeTab === "borrower"
														? loan.sellerId
														: loan.buyerId
												}`}
												className="flex-1">
												<button className="w-full border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg py-2 text-sm font-bold transition-colors">
													Chat
												</button>
											</Link>
										)}

										<Link href={`/marketplace/item/${loan.itemId}`}>
											<button className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="18"
													height="18"
													fill="currentColor"
													className="bi bi-eye-fill"
													viewBox="0 0 16 16">
													<path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
													<path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
												</svg>
											</button>
										</Link>
									</div>
								</div>
							);
						})
					) : (
						<div className="col-span-full py-24 text-center bg-white rounded-2xl border-2 border-dashed border-gray-200">
							<p className="text-gray-400 font-medium text-lg">
								No {activeTab} history found.
							</p>
						</div>
					)}
				</div>
			</main>
			<Footer />

			{reviewTarget && (
				<ReviewModal
					isOpen={isReviewOpen}
					onClose={() => setIsReviewOpen(false)}
					transactionId={reviewTarget.txId}
					reviewerId={currentUser.studentId}
					revieweeId={reviewTarget.revieweeId}
					itemName={reviewTarget.itemName}
					onSuccess={() => window.location.reload()}
				/>
			)}
		</div>
	);
};

export default LoansClient;
