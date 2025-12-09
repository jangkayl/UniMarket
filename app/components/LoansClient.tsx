"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { TransactionHistoryItem } from "@/app/actions/transaction";

interface LoansClientProps {
	currentUser: { studentId: number };
	transactions: TransactionHistoryItem[];
}

const LoansClient = ({ currentUser, transactions }: LoansClientProps) => {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<"borrower" | "lender">("borrower");

	// 1. FILTER FOR RENTALS ONLY
	const rentalTransactions = transactions.filter(
		(t) => t.transactionType.toLowerCase() === "rent"
	);

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
				if (status === "ongoing" || status === "returning") return 0; // Highest Priority
				if (status === "pending" || status === "to meet") return 1;
				return 2;
			};
			const pA = getPriority(a.status);
			const pB = getPriority(b.status);
			if (pA !== pB) return pA - pB;
			return b.transactionId - a.transactionId;
		});

	// --- HANDLERS ---

	// Just redirect to chat for Borrower to initiate return
	const handleReturnItem = (tx: TransactionHistoryItem) => {
		router.push(`/messages?chatWith=${tx.sellerId}`);
	};

	// Just redirect to chat for Lender to confirm return
	const handleConfirmReturn = (tx: TransactionHistoryItem) => {
		router.push(`/messages?chatWith=${tx.buyerId}`);
	};

	// --- ENHANCED STATUS STYLES ---
	const getStatusStyle = (status: string) => {
		switch (status?.toLowerCase()) {
			case "completed":
				return "bg-green-600 text-white border-green-600 shadow-md";
			case "ongoing":
				return "bg-blue-600 text-white border-blue-600 shadow-md";
			case "returning":
				return "bg-orange-500 text-white border-orange-500 shadow-md animate-pulse";
			case "pending":
				return "bg-yellow-400 text-yellow-900 border-yellow-400 shadow-sm";
			case "cancelled":
				return "bg-red-100 text-red-700 border-red-200";
			case "to meet":
				return "bg-indigo-600 text-white border-indigo-600";
			default:
				return "bg-gray-100 text-gray-600 border-gray-200";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status?.toLowerCase()) {
			case "completed":
				return (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
						fill="currentColor"
						className="bi bi-check-circle-fill"
						viewBox="0 0 16 16">
						<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
					</svg>
				);
			case "ongoing":
				return (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
						fill="currentColor"
						className="bi bi-clock-fill"
						viewBox="0 0 16 16">
						<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
					</svg>
				);
			case "returning":
				return (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
						fill="currentColor"
						className="bi bi-arrow-counterclockwise"
						viewBox="0 0 16 16">
						<path
							fillRule="evenodd"
							d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"
						/>
						<path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466" />
					</svg>
				);
			default:
				return null;
		}
	};

	const getCardBorderColor = (status: string) => {
		switch (status?.toLowerCase()) {
			case "ongoing":
				return "border-blue-400 ring-1 ring-blue-50";
			case "returning":
				return "border-orange-400 ring-1 ring-orange-50";
			case "pending":
				return "border-yellow-400 ring-1 ring-yellow-50";
			case "completed":
				return "border-green-200 hover:border-green-300";
			default:
				return "border-gray-200 hover:border-gray-300";
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
				{/* Header Section */}
				<div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
					<div>
						<h1 className="text-4xl font-bold text-gray-900">Borrow & Loans</h1>
						<p className="text-gray-500 mt-1">
							Manage items you are borrowing or lending.
						</p>
					</div>

					{/* Tab Switcher */}
					<div className="bg-white p-1.5 rounded-xl border border-gray-200 inline-flex shadow-sm self-start md:self-auto">
						<button
							onClick={() => setActiveTab("borrower")}
							className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${
								activeTab === "borrower"
									? "bg-[#8B0000] text-white shadow-md"
									: "text-gray-500 hover:bg-gray-50"
							}`}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								className="bi bi-box-arrow-in-down"
								viewBox="0 0 16 16">
								<path
									fillRule="evenodd"
									d="M3.5 6a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 1 0-1h2A1.5 1.5 0 0 1 14 6.5v8a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-8A1.5 1.5 0 0 1 3.5 5h2a.5.5 0 0 1 0 1z"
								/>
								<path
									fillRule="evenodd"
									d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"
								/>
							</svg>
							Borrowing
						</button>
						<button
							onClick={() => setActiveTab("lender")}
							className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${
								activeTab === "lender"
									? "bg-[#8B0000] text-white shadow-md"
									: "text-gray-500 hover:bg-gray-50"
							}`}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								className="bi bi-box-arrow-up"
								viewBox="0 0 16 16">
								<path
									fillRule="evenodd"
									d="M3.5 6a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 1 0-1h2A1.5 1.5 0 0 1 14 6.5v8a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-8A1.5 1.5 0 0 1 3.5 5h2a.5.5 0 0 1 0 1z"
								/>
								<path
									fillRule="evenodd"
									d="M7.646.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 1.707V10.5a.5.5 0 0 1-1 0V1.707L5.354 3.854a.5.5 0 1 1-.708-.708z"
								/>
							</svg>
							Lending
						</button>
					</div>
				</div>

				{/* Content Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{displayList.length > 0 ? (
						displayList.map((loan) => (
							<div
								key={loan.transactionId}
								className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group relative ${getCardBorderColor(
									loan.status
								)}`}>
								{/* Image Area */}
								<div className="h-44 bg-gray-100 rounded-xl overflow-hidden mb-4 relative flex items-center justify-center border border-gray-100 group-hover:scale-[1.02] transition-transform duration-500">
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
									{/* Rent Badge Overlay */}
									<div className="absolute top-3 left-3">
										<span className="bg-white/90 backdrop-blur-md text-orange-700 text-[10px] font-extrabold px-3 py-1 rounded-lg border border-white shadow-sm uppercase tracking-wider">
											RENT
										</span>
									</div>
								</div>

								{/* Header Info */}
								<div className="flex justify-between items-start mb-2 gap-2">
									<h3
										className="font-bold text-lg text-gray-900 line-clamp-1 leading-tight"
										title={loan.itemName}>
										{loan.itemName || "Unknown Item"}
									</h3>
									{/* Enhanced Status Badge */}
									<span
										className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border shadow-sm ${getStatusStyle(
											loan.status
										)}`}>
										{getStatusIcon(loan.status)}
										{loan.status}
									</span>
								</div>

								<p className="text-sm text-gray-500 mb-4 flex items-center gap-2">
									<span className="bg-gray-100 p-1 rounded-full">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="12"
											height="12"
											fill="currentColor"
											className="bi bi-person-fill text-gray-500"
											viewBox="0 0 16 16">
											<path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
										</svg>
									</span>
									{activeTab === "borrower" ? (
										<>
											Lender:{" "}
											<span className="font-bold text-gray-800">
												{loan.sellerName}
											</span>
										</>
									) : (
										<>
											Borrower:{" "}
											<span className="font-bold text-gray-800">
												{loan.buyerName}
											</span>
										</>
									)}
								</p>

								{/* Date Details */}
								<div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500 space-y-1 mb-4 border border-gray-100">
									<div className="flex justify-between">
										<span>Start Date:</span>
										<span className="font-medium text-gray-700">
											{formatDate(loan.transactionDate)}
										</span>
									</div>
									{loan.dueDate && (
										<div className="flex justify-between">
											<span>Due Date:</span>
											<span
												className={`font-bold ${
													loan.status === "Completed"
														? "text-green-600 line-through"
														: "text-orange-600"
												}`}>
												{formatDate(loan.dueDate)}
											</span>
										</div>
									)}
								</div>

								{/* Footer Actions */}
								<div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
									{/* RENTAL ACTIONS - Redirects to Chat */}
									{loan.status.toLowerCase() === "ongoing" &&
									activeTab === "borrower" ? (
										<button
											onClick={() => handleReturnItem(loan)}
											className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2.5 text-sm font-bold shadow-md hover:shadow-lg transition-all transform active:scale-95 flex justify-center items-center gap-2">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="16"
												height="16"
												fill="currentColor"
												className="bi bi-box-seam"
												viewBox="0 0 16 16">
												<path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zm3.564 1.426L5.596 5 8 5.961 14.154 3.5l-2.404-.961zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z" />
											</svg>
											Return Item
										</button>
									) : loan.status.toLowerCase() === "returning" &&
									  activeTab === "lender" ? (
										<button
											onClick={() => handleConfirmReturn(loan)}
											className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl py-2.5 text-sm font-bold shadow-md hover:shadow-lg transition-all transform active:scale-95 flex justify-center items-center gap-2">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="16"
												height="16"
												fill="currentColor"
												className="bi bi-check-circle"
												viewBox="0 0 16 16">
												<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
												<path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" />
											</svg>
											Confirm Return
										</button>
									) : (
										<Link
											href={`/messages?chatWith=${
												activeTab === "borrower" ? loan.sellerId : loan.buyerId
											}`}
											className="flex-1">
											<button className="w-full border border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl py-2.5 text-sm font-bold transition-colors flex justify-center items-center gap-2">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="16"
													height="16"
													fill="currentColor"
													className="bi bi-chat-text"
													viewBox="0 0 16 16">
													<path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894m-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z" />
												</svg>
												Chat
											</button>
										</Link>
									)}

									<Link href={`/marketplace/item/${loan.itemId}`}>
										<button className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-colors">
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
						))
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
		</div>
	);
};

export default LoansClient;
