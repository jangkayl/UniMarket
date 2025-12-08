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

	// Helper: Is the transaction considered "Active"?
	const isActiveStatus = (status: string) => {
		const s = status.toLowerCase();
		return s === "pending" || s === "to pay" || s === "to meet";
	};

	// Filter based on Tab
	const tabTransactions = transactions.filter((tx) => {
		if (activeTab === "BUYING") {
			return tx.buyerId === currentUser.studentId;
		} else {
			return tx.sellerId === currentUser.studentId;
		}
	});

	// Split into Active and History
	const activeOrders = tabTransactions
		.filter((tx) => isActiveStatus(tx.status))
		.sort((a, b) => b.transactionId - a.transactionId); // Newest first

	const pastOrders = tabTransactions
		.filter((tx) => !isActiveStatus(tx.status))
		.sort((a, b) => b.transactionId - a.transactionId); // Newest first

	const getStatusColor = (status: string) => {
		switch (status?.toLowerCase()) {
			case "completed":
				return "bg-green-100 text-green-700 border-green-200";
			case "pending":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "to pay":
			case "to meet":
				return "bg-blue-100 text-blue-800 border-blue-200";
			case "cancelled":
				return "bg-red-50 text-red-600 border-red-100";
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

	// --- REUSABLE CARD COMPONENT ---
	const OrderCard = ({
		tx,
		role,
		variant = "default",
	}: {
		tx: TransactionHistoryItem;
		role: "BUYER" | "SELLER";
		variant?: "active" | "default";
	}) => (
		<div
			className={`bg-white border rounded-2xl p-5 transition-all duration-300 relative group flex flex-col sm:flex-row gap-5 ${
				variant === "active"
					? "border-yellow-400 shadow-md ring-4 ring-yellow-50/50"
					: "border-gray-200 shadow-sm hover:shadow-md"
			}`}>
			{/* Active Indicator Strip */}
			{variant === "active" && (
				<div className="absolute top-5 right-5 flex items-center gap-2">
					<span className="relative flex h-3 w-3">
						<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
						<span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
					</span>
					<span className="text-xs font-bold text-yellow-700 uppercase tracking-wide">
						Action Needed
					</span>
				</div>
			)}

			{/* Image */}
			<div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden relative shrink-0 border border-gray-100 self-start sm:self-center">
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
							width="32"
							height="32"
							fill="currentColor"
							className="bi bi-image"
							viewBox="0 0 16 16">
							<path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
							<path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12" />
						</svg>
					</div>
				)}
			</div>

			{/* Info */}
			<div className="grow min-w-0 flex flex-col justify-between">
				<div>
					<div className="flex justify-between items-start mb-1 pr-8 sm:pr-0">
						<h4 className="font-bold text-gray-900 truncate text-lg">
							{tx.itemName}
						</h4>
					</div>

					<div className="flex items-center gap-2 mb-3">
						<span
							className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide border ${getStatusColor(
								tx.status
							)}`}>
							{tx.status}
						</span>
						<span className="text-gray-300">•</span>
						<span className="text-xs text-gray-500 font-medium">
							{formatDate(tx.transactionDate)}
						</span>
						<span className="text-gray-300">•</span>
						<span className="text-xs text-gray-400">#{tx.transactionId}</span>
					</div>

					<p className="text-sm text-gray-500 mb-2 flex items-center gap-2">
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
						{role === "BUYER" ? "Seller: " : "Buyer: "}
						<span className="font-semibold text-gray-700">
							{role === "BUYER" ? tx.sellerName : tx.buyerName}
						</span>
					</p>
				</div>

				{/* Action Bar */}
				<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-2">
					<div className="text-2xl font-extrabold text-[#8B0000]">
						₱
						{tx.amount.toLocaleString(undefined, {
							minimumFractionDigits: 2,
						})}
					</div>

					<div className="flex gap-2 w-full sm:w-auto">
						<Link
							href={`/messages?chatWith=${
								role === "BUYER" ? tx.sellerId : tx.buyerId
							}`}
							className="flex-1 sm:flex-none">
							<button
								className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors ${
									variant === "active"
										? "bg-[#8B0000] text-white hover:bg-red-900 shadow-md"
										: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
								}`}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									fill="currentColor"
									className="bi bi-chat-dots-fill"
									viewBox="0 0 16 16">
									<path d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
								</svg>
								{variant === "active" ? "Open Chat" : "Chat"}
							</button>
						</Link>
						<Link
							href={`/marketplace/item/${tx.itemId}`}
							className="flex-1 sm:flex-none">
							<button className="w-full sm:w-auto px-4 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
								View Item
							</button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);

	return (
		<div className="bg-gray-50 min-h-screen flex flex-col font-sans text-gray-900">
			<Navbar />

			<main className="grow w-full max-w-[1000px] mx-auto px-6 py-10">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
					<h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
					<div className="bg-white p-1 rounded-xl border border-gray-200 inline-flex shadow-sm">
						<button
							onClick={() => setActiveTab("BUYING")}
							className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${
								activeTab === "BUYING"
									? "bg-red-50 text-red-900 shadow-sm"
									: "text-gray-500 hover:bg-gray-50"
							}`}>
							Buying
						</button>
						<button
							onClick={() => setActiveTab("SELLING")}
							className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${
								activeTab === "SELLING"
									? "bg-red-50 text-red-900 shadow-sm"
									: "text-gray-500 hover:bg-gray-50"
							}`}>
							Selling
						</button>
					</div>
				</div>

				{/* ACTIVE ORDERS SECTION */}
				{activeOrders.length > 0 && (
					<div className="mb-10 animate-fade-in">
						<h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
							<span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
							Active Orders ({activeOrders.length})
						</h3>
						<div className="space-y-4">
							{activeOrders.map((tx) => (
								<OrderCard
									key={tx.transactionId}
									tx={tx}
									role={activeTab === "BUYING" ? "BUYER" : "SELLER"}
									variant="active"
								/>
							))}
						</div>
					</div>
				)}

				{/* PAST ORDERS SECTION */}
				<div>
					<h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
						Order History
					</h3>
					<div className="space-y-4">
						{pastOrders.length > 0 ? (
							pastOrders.map((tx) => (
								<OrderCard
									key={tx.transactionId}
									tx={tx}
									role={activeTab === "BUYING" ? "BUYER" : "SELLER"}
									variant="default"
								/>
							))
						) : (
							<div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
								<p className="text-gray-400 font-medium">
									No completed or cancelled orders yet.
								</p>
							</div>
						)}
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
};

export default OrdersClient;
