"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { TransactionHistoryItem } from "@/app/actions/transaction";

interface OrdersClientProps {
	currentUser: { studentId: number };
	transactions: TransactionHistoryItem[];
}

const OrdersClient = ({ currentUser, transactions }: OrdersClientProps) => {
	const [activeTab, setActiveTab] = useState<"BUYING" | "SELLING">("BUYING");

	// 1. Filter out Rentals (Show only Sales/Purchases/Swaps)
	const orderTransactions = transactions.filter(
		(tx) => tx.transactionType.toLowerCase() !== "rent"
	);

	// Helper: Sort by Status (Pending First) then Date (Newest First)
	const sortOrders = (a: TransactionHistoryItem, b: TransactionHistoryItem) => {
		const getPriority = (status: string) =>
			status.toLowerCase() === "pending" ? 0 : 1;

		const priorityA = getPriority(a.status);
		const priorityB = getPriority(b.status);

		if (priorityA !== priorityB) {
			return priorityA - priorityB;
		}

		return b.transactionId - a.transactionId;
	};

	// Split and Sort
	const buyingOrders = orderTransactions
		.filter((tx) => tx.buyerId === currentUser.studentId)
		.sort(sortOrders);

	const sellingOrders = orderTransactions
		.filter((tx) => tx.sellerId === currentUser.studentId)
		.sort(sortOrders);

	// Status Badge Logic
	const getStatusColor = (status: string) => {
		switch (status?.toLowerCase()) {
			case "completed":
				return "bg-green-100 text-green-700 border-green-200";
			case "pending":
				return "bg-yellow-100 text-yellow-800 border-yellow-200 animate-pulse";
			case "cancelled":
				return "bg-red-50 text-red-700 border-red-200";
			case "to meet":
			case "to pay":
				return "bg-blue-50 text-blue-700 border-blue-200";
			default:
				return "bg-gray-100 text-gray-700 border-gray-200";
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const getAvatarUrl = (photo: string | null) => {
		return photo
			? `${
					process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
			  }/api/items/images/${photo}`
			: null;
	};

	// --- ORDER CARD COMPONENT ---
	const OrderCard = ({
		tx,
		role,
	}: {
		tx: TransactionHistoryItem;
		role: "BUYER" | "SELLER";
	}) => {
		const isPending = tx.status.toLowerCase() === "pending";

		// Dynamic Badge Color for Transaction Type
		const getTypeBadgeStyle = (type: string) => {
			switch (type.toLowerCase()) {
				case "sell":
					return "bg-emerald-100 text-emerald-800 border-emerald-200";
				case "swap":
					return "bg-purple-100 text-purple-800 border-purple-200";
				default:
					return "bg-gray-100 text-gray-800 border-gray-200";
			}
		};

		return (
			<div
				className={`relative bg-white rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg flex flex-col sm:flex-row gap-6 group ${
					isPending
						? "border-yellow-400 shadow-amber-50/50 shadow-md"
						: "border-gray-200 shadow-sm"
				}`}>
				{/* Item Image with Overlay Badge */}
				<div className="w-32 h-32 bg-gray-100 rounded-xl overflow-hidden relative shrink-0 border border-gray-100 self-center sm:self-start group-hover:scale-[1.02] transition-transform">
					{tx.itemImage ? (
						<Image
							src={getAvatarUrl(tx.itemImage)!}
							alt={tx.itemName}
							fill
							className="object-cover"
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center text-gray-400">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="40"
								height="40"
								fill="currentColor"
								className="bi bi-bag"
								viewBox="0 0 16 16">
								<path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4z" />
							</svg>
						</div>
					)}

					{/* Prominent Transaction Type Badge */}
					<div className="absolute top-2 left-2 z-10">
						<span
							className={`text-[10px] font-extrabold px-2 py-1 rounded shadow-sm border uppercase tracking-wider ${getTypeBadgeStyle(
								tx.transactionType
							)}`}>
							{tx.transactionType}
						</span>
					</div>
				</div>

				{/* Content */}
				<div className="grow flex flex-col">
					{/* Header: Title & Status */}
					<div className="flex justify-between items-start mb-2">
						<div>
							<h4
								className="font-bold text-gray-900 text-xl leading-tight line-clamp-1"
								title={tx.itemName}>
								{tx.itemName}
							</h4>
							<p className="text-xs text-gray-400 mt-1 font-mono">
								Order ID: #{tx.transactionId}
							</p>
						</div>
						<span
							className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(
								tx.status
							)}`}>
							{tx.status}
						</span>
					</div>

					{/* Details */}
					<div className="mb-4">
						<div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
							<span className="bg-gray-100 p-1 rounded-md">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="14"
									height="14"
									fill="currentColor"
									className="bi bi-person-fill text-gray-500"
									viewBox="0 0 16 16">
									<path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
								</svg>
							</span>
							<span>
								{role === "BUYER" ? "Seller:" : "Buyer:"}
								<span className="font-bold text-gray-800 ml-1">
									{role === "BUYER" ? tx.sellerName : tx.buyerName}
								</span>
							</span>
						</div>
						<div className="flex items-center gap-2 text-sm text-gray-500">
							<span className="bg-gray-100 p-1 rounded-md">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="14"
									height="14"
									fill="currentColor"
									className="bi bi-calendar-event-fill text-gray-500"
									viewBox="0 0 16 16">
									<path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2M8.5 8.5V10H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V11H6a.5.5 0 0 1 0-1h1.5V8.5a.5.5 0 0 1 1 0" />
								</svg>
							</span>
							<span>{formatDate(tx.transactionDate)}</span>
						</div>
					</div>

					{/* Footer: Price & Actions */}
					<div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
						<div className="flex flex-col">
							<span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">
								Total Amount
							</span>
							<span className="text-2xl font-extrabold text-[#8B0000]">
								₱
								{tx.amount.toLocaleString(undefined, {
									minimumFractionDigits: 2,
								})}
							</span>
						</div>

						<div className="flex gap-3">
							<Link
								href={`/messages?chatWith=${
									role === "BUYER" ? tx.sellerId : tx.buyerId
								}`}>
								<button className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-700 rounded-xl font-bold text-sm transition-colors border border-transparent hover:border-red-100">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										fill="currentColor"
										className="bi bi-chat-dots-fill"
										viewBox="0 0 16 16">
										<path d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0-2 1 1 0 0 0 0 2" />
									</svg>
									Chat
								</button>
							</Link>

							{/* VIEW ITEM BUTTON with Eye Icon */}
							<Link href={`/marketplace/item/${tx.itemId}`}>
								<button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition-colors">
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
									View Item
								</button>
							</Link>
						</div>
					</div>
				</div>
			</div>
		);
	};

	const displayList = activeTab === "BUYING" ? buyingOrders : sellingOrders;

	return (
		<div className="bg-gray-50 min-h-screen flex flex-col font-sans text-gray-900">
			<Navbar />

			<main className="grow w-full max-w-[1400px] mx-auto px-6 py-12">
				<div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
					<div>
						<h1 className="text-4xl font-bold text-gray-900">My Orders</h1>
						<p className="text-gray-500 mt-1">
							Manage your active purchases and sales.
						</p>
					</div>

					{/* Tab Switcher */}
					<div className="bg-white p-1.5 rounded-xl border border-gray-200 inline-flex shadow-sm self-start md:self-auto">
						<button
							onClick={() => setActiveTab("BUYING")}
							className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${
								activeTab === "BUYING"
									? "bg-red-50 text-red-900 shadow-sm ring-1 ring-red-100"
									: "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
							}`}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								className="bi bi-bag-fill"
								viewBox="0 0 16 16">
								<path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4z" />
							</svg>
							Buying{" "}
							<span className="ml-1 bg-gray-200 text-gray-600 px-1.5 rounded-full text-[10px] min-w-[ text-center">
								{buyingOrders.length}
							</span>
						</button>
						<button
							onClick={() => setActiveTab("SELLING")}
							className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${
								activeTab === "SELLING"
									? "bg-red-50 text-red-900 shadow-sm ring-1 ring-red-100"
									: "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
							}`}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								className="bi bi-shop-window"
								viewBox="0 0 16 16">
								<path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.37 2.37 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0M1.5 8.5A.5.5 0 0 1 2 9v6h1v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h6V9a.5.5 0 0 1 1 0v6h1a.5.5 0 0 1 0 1H1a.5.5 0 0 1 0-1z" />
							</svg>
							Selling{" "}
							<span className="ml-1 bg-gray-200 text-gray-600 px-1.5 rounded-full text-[10px] min-w-5 text-center">
								{sellingOrders.length}
							</span>
						</button>
					</div>
				</div>

				{/* --- GRID LAYOUT --- */}
				<div className="grid grid-cols-2 gap-6">
					{displayList.length > 0 ? (
						displayList.map((tx) => (
							<OrderCard
								key={tx.transactionId}
								tx={tx}
								role={activeTab === "BUYING" ? "BUYER" : "SELLER"}
							/>
						))
					) : (
						<div className="col-span-full py-24 text-center bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center">
							<div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="32"
									height="32"
									fill="currentColor"
									className="bi bi-basket"
									viewBox="0 0 16 16">
									<path d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1v4.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 13.5V9a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1.217L5.07 1.243a.5.5 0 0 1 .686-.172zM2 9v4.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V9zM1 7v1h14V7zm3 3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 4 10m2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 6 10m2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 8 10m2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 10 10" />
								</svg>
							</div>
							<p className="text-gray-500 font-medium text-lg">
								No {activeTab.toLowerCase()} orders found.
							</p>
							<Link
								href={
									activeTab === "BUYING" ? "/marketplace" : "/profile/add-item"
								}
								className="mt-4 px-6 py-2.5 bg-red-900 text-white rounded-xl font-bold text-sm hover:bg-red-800 transition-colors shadow-sm">
								{activeTab === "BUYING" ? "Start Shopping" : "List an Item"}
							</Link>
						</div>
					)}
				</div>
			</main>

			<Footer />
		</div>
	);
};

export default OrdersClient;
