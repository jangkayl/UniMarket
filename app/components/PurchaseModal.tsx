"use client";

import { useState } from "react";

interface PurchaseModalProps {
	isOpen: boolean;
	onClose: () => void;
	itemTitle: string;
	itemPrice: string;
	onConfirm: (method: "WALLET" | "MEETUP") => void;
}

const PurchaseModal = ({
	isOpen,
	onClose,
	itemTitle,
	itemPrice,
	onConfirm,
}: PurchaseModalProps) => {
	const [paymentMethod, setPaymentMethod] = useState<"WALLET" | "MEETUP">(
		"WALLET"
	);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
			<div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-up">
				{/* Header */}
				<div className="bg-red-900 px-6 py-4 flex justify-between items-center text-white">
					<h3 className="font-bold text-lg">Confirm Purchase</h3>
					<button
						onClick={onClose}
						className="hover:bg-red-800 p-1 rounded-full transition-colors">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							fill="currentColor"
							className="bi bi-x-lg"
							viewBox="0 0 16 16">
							<path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
						</svg>
					</button>
				</div>

				{/* Body */}
				<div className="p-6 space-y-6">
					<div className="text-center">
						<p className="text-gray-500 text-sm uppercase tracking-wide font-semibold">
							You are buying
						</p>
						<h2 className="text-2xl font-bold text-gray-900 mt-1">
							{itemTitle}
						</h2>
						<p className="text-[#8B0000] font-extrabold text-3xl mt-2">
							{itemPrice}
						</p>
					</div>

					<div className="space-y-3">
						<label className="block text-sm font-semibold text-gray-700">
							Select Payment Method
						</label>

						{/* Wallet Option */}
						<label
							className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
								paymentMethod === "WALLET"
									? "border-red-900 bg-red-50"
									: "border-gray-200 hover:border-red-200"
							}`}>
							<div className="flex items-center gap-3">
								<input
									type="radio"
									name="payment"
									value="WALLET"
									checked={paymentMethod === "WALLET"}
									onChange={() => setPaymentMethod("WALLET")}
									className="accent-red-900 w-5 h-5"
								/>
								<div className="text-left">
									<div className="font-bold text-gray-900">
										UniMarket Wallet
									</div>
									<div className="text-xs text-gray-500">
										Fast & Secure. Balance: ₱5,000.00
									</div>
								</div>
							</div>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								fill="currentColor"
								className="bi bi-wallet2 text-gray-400"
								viewBox="0 0 16 16">
								<path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499L12.136.326zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484L5.562 3zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z" />
							</svg>
						</label>

						{/* Meetup Option */}
						<label
							className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
								paymentMethod === "MEETUP"
									? "border-red-900 bg-red-50"
									: "border-gray-200 hover:border-red-200"
							}`}>
							<div className="flex items-center gap-3">
								<input
									type="radio"
									name="payment"
									value="MEETUP"
									checked={paymentMethod === "MEETUP"}
									onChange={() => setPaymentMethod("MEETUP")}
									className="accent-red-900 w-5 h-5"
								/>
								<div className="text-left">
									<div className="font-bold text-gray-900">Meetup / Cash</div>
									<div className="text-xs text-gray-500">
										Pay when you receive the item.
									</div>
								</div>
							</div>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								fill="currentColor"
								className="bi bi-people-fill text-gray-400"
								viewBox="0 0 16 16">
								<path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4 1 1 1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
							</svg>
						</label>
					</div>
				</div>

				{/* Footer */}
				<div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end">
					<button
						onClick={onClose}
						className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors">
						Cancel
					</button>
					<button
						onClick={() => onConfirm(paymentMethod)}
						className="px-5 py-2.5 rounded-lg bg-[#8B0000] text-white font-bold hover:bg-red-900 transition-colors shadow-sm flex items-center gap-2">
						Confirm Purchase
					</button>
				</div>
			</div>
		</div>
	);
};

export default PurchaseModal;
