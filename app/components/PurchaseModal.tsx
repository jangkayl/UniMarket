"use client";

import { useState } from "react";

interface PurchaseModalProps {
	isOpen: boolean;
	onClose: () => void;
	itemTitle: string;
	itemPrice: string;
	walletBalance: number; // Added prop
	onConfirm: (method: "WALLET" | "MEETUP") => Promise<boolean>;
	onSuccess: () => void;
}

const PurchaseModal = ({
	isOpen,
	onClose,
	itemTitle,
	itemPrice,
	walletBalance,
	onConfirm,
	onSuccess,
}: PurchaseModalProps) => {
	const [step, setStep] = useState<"SELECT" | "CONFIRM" | "SUCCESS">("SELECT");
	const [paymentMethod, setPaymentMethod] = useState<"WALLET" | "MEETUP">(
		"WALLET"
	);
	const [isProcessing, setIsProcessing] = useState(false);

	// Reset state when opening/closing
	if (!isOpen) return null;

	const handleNextStep = () => {
		setStep("CONFIRM");
	};

	const handleBack = () => {
		setStep("SELECT");
	};

	const handleConfirmClick = async () => {
		setIsProcessing(true);
		const success = await onConfirm(paymentMethod);
		setIsProcessing(false);

		if (success) {
			setStep("SUCCESS");
		}
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-PH", {
			style: "currency",
			currency: "PHP",
		}).format(amount);
	};

	// Extract numeric price for calculations (assuming itemPrice string "₱1,000.00")
	const numericPrice = parseFloat(itemPrice.replace(/[^0-9.-]+/g, ""));
	const remainingBalance = walletBalance - numericPrice;
	const isInsufficient = paymentMethod === "WALLET" && remainingBalance < 0;

	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
			<div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-up relative">
				{/* --- 3. SUCCESS VIEW --- */}
				{step === "SUCCESS" && (
					<div className="p-8 flex flex-col items-center text-center animate-fade-in">
						<div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 shadow-sm">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="40"
								height="40"
								fill="currentColor"
								className="bi bi-check-lg"
								viewBox="0 0 16 16">
								<path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
							</svg>
						</div>
						<h3 className="text-2xl font-bold text-gray-900 mb-2">
							Purchase Confirmed!
						</h3>
						<p className="text-gray-500 mb-8 leading-relaxed">
							You have successfully secured <strong>{itemTitle}</strong>. You
							will be redirected to the chat to finalize the details with the
							seller.
						</p>
						<button
							onClick={onSuccess}
							className="w-full bg-[#8B0000] text-white font-bold py-3.5 rounded-xl hover:bg-red-900 transition-colors shadow-lg flex items-center justify-center gap-2 transform active:scale-95">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								fill="currentColor"
								className="bi bi-chat-dots-fill"
								viewBox="0 0 16 16">
								<path d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
							</svg>
							Go to Chat
						</button>
					</div>
				)}

				{/* --- 2. CONFIRMATION SUMMARY VIEW --- */}
				{step === "CONFIRM" && (
					<div className="animate-fade-in">
						<div className="bg-red-900 px-6 py-4 flex justify-between items-center text-white">
							<h3 className="font-bold text-lg">Review Order</h3>
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

						<div className="p-6">
							<div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
								<div className="flex justify-between items-start mb-2">
									<span className="text-gray-500 text-sm font-medium">
										Item
									</span>
									<span className="text-gray-900 font-bold text-right w-2/3">
										{itemTitle}
									</span>
								</div>
								<div className="flex justify-between items-center mb-4">
									<span className="text-gray-500 text-sm font-medium">
										Price
									</span>
									<span className="text-gray-900 font-bold">{itemPrice}</span>
								</div>
								<div className="h-px bg-gray-200 my-2"></div>
								<div className="flex justify-between items-center pt-1">
									<span className="text-gray-900 font-bold">Total to Pay</span>
									<span className="text-[#8B0000] font-extrabold text-xl">
										{itemPrice}
									</span>
								</div>
							</div>

							<div className="space-y-4">
								<div>
									<p className="text-sm font-semibold text-gray-500 mb-1">
										Payment Method
									</p>
									<div className="flex items-center gap-2 text-gray-900 font-bold">
										{paymentMethod === "WALLET" ? (
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="18"
												height="18"
												fill="currentColor"
												className="bi bi-wallet2 text-red-900"
												viewBox="0 0 16 16">
												<path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499L12.136.326zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484L5.562 3zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z" />
											</svg>
										) : (
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="18"
												height="18"
												fill="currentColor"
												className="bi bi-people-fill text-red-900"
												viewBox="0 0 16 16">
												<path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4 1 1 1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
											</svg>
										)}
										{paymentMethod === "WALLET"
											? "UniMarket Wallet"
											: "Meetup / Cash"}
									</div>
								</div>

								{paymentMethod === "WALLET" && (
									<div
										className={`p-3 rounded-lg border ${
											isInsufficient
												? "bg-red-50 border-red-200"
												: "bg-gray-50 border-gray-200"
										}`}>
										<div className="flex justify-between text-sm">
											<span className="text-gray-600">Current Balance:</span>
											<span className="font-semibold">
												{formatCurrency(walletBalance)}
											</span>
										</div>
										<div className="flex justify-between text-sm mt-1">
											<span className="text-gray-600">Balance after:</span>
											<span
												className={`font-bold ${
													isInsufficient ? "text-red-600" : "text-green-600"
												}`}>
												{formatCurrency(remainingBalance)}
											</span>
										</div>
										{isInsufficient && (
											<p className="text-xs text-red-600 font-bold mt-2 flex items-center gap-1">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="12"
													height="12"
													fill="currentColor"
													className="bi bi-exclamation-circle-fill"
													viewBox="0 0 16 16">
													<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
												</svg>
												Insufficient funds. Please top up.
											</p>
										)}
									</div>
								)}
							</div>

							<div className="flex gap-3 mt-8">
								<button
									onClick={handleBack}
									disabled={isProcessing}
									className="flex-1 px-5 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-100 transition-colors">
									Back
								</button>
								<button
									onClick={handleConfirmClick}
									disabled={isProcessing || isInsufficient}
									className="flex-1 px-5 py-3 rounded-xl bg-[#8B0000] text-white font-bold hover:bg-red-900 transition-all shadow-md disabled:bg-gray-400 disabled:shadow-none flex justify-center items-center gap-2">
									{isProcessing ? (
										<>
											<span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
											Processing...
										</>
									) : (
										"Confirm Payment"
									)}
								</button>
							</div>
						</div>
					</div>
				)}

				{/* --- 1. SELECTION VIEW --- */}
				{step === "SELECT" && (
					<div className="animate-fade-in">
						{/* Header */}
						<div className="bg-red-900 px-6 py-4 flex justify-between items-center text-white">
							<h3 className="font-bold text-lg">Checkout</h3>
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
								<h2
									className="text-2xl font-bold text-gray-900 mt-1 line-clamp-1"
									title={itemTitle}>
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
											<div className="text-xs text-gray-500 font-medium">
												Balance: {formatCurrency(walletBalance)}
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
											<div className="font-bold text-gray-900">
												Meetup / Cash
											</div>
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

							<button
								onClick={handleNextStep}
								className="w-full bg-[#8B0000] text-white font-bold py-3.5 rounded-xl hover:bg-red-900 transition-transform active:scale-95 shadow-md mt-4">
								Proceed to Confirm
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default PurchaseModal;
