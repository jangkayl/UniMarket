"use client";

import { useState } from "react";
import Image from "next/image";

interface AddFundsModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (
		amount: number,
		provider: string,
		referenceNumber: string
	) => Promise<void>;
}

const AddFundsModal = ({ isOpen, onClose, onConfirm }: AddFundsModalProps) => {
	const [step, setStep] = useState(1);
	const [amount, setAmount] = useState("");
	const [provider, setProvider] = useState("GCash");
	const [referenceNumber, setReferenceNumber] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	// Combined Error State
	const [errors, setErrors] = useState({
		amount: "",
		referenceNumber: "",
	});

	if (!isOpen) return null;

	const handleNext = (e: React.FormEvent) => {
		e.preventDefault();
		setErrors((prev) => ({ ...prev, amount: "" })); // Clear amount error

		const val = Number(amount);

		if (!amount || isNaN(val) || val <= 0) {
			setErrors((prev) => ({
				...prev,
				amount: "Please enter a valid amount.",
			}));
			return;
		}

		if (val < 50) {
			setErrors((prev) => ({
				...prev,
				amount: "Minimum cash in amount is ₱50.00",
			}));
			return;
		}

		setStep(2);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors((prev) => ({ ...prev, referenceNumber: "" })); // Clear ref error

		if (!referenceNumber.trim()) {
			setErrors((prev) => ({
				...prev,
				referenceNumber: "Reference number is required.",
			}));
			return;
		}

		setIsLoading(true);
		await onConfirm(Number(amount), provider, referenceNumber);
		setIsLoading(false);

		setTimeout(() => {
			setStep(1);
			setAmount("");
			setReferenceNumber("");
			setErrors({ amount: "", referenceNumber: "" });
		}, 500);
		onClose();
	};

	const clearError = (field: keyof typeof errors) => {
		setErrors((prev) => ({ ...prev, [field]: "" }));
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
			<div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-up">
				{/* Header */}
				<div className="bg-red-900 px-6 py-4 flex justify-between items-center text-white">
					<h3 className="font-bold text-lg">
						{step === 1 ? "Cash In" : `Pay via ${provider}`}
					</h3>
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

				{/* STEP 1: Amount & Provider */}
				{step === 1 && (
					<form
						onSubmit={handleNext}
						className="p-6 space-y-5">
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-1">
								Amount
							</label>
							<div className="relative">
								<span
									className={`absolute left-3 top-1/2 -translate-y-1/2 font-bold ${
										errors.amount ? "text-red-600" : "text-gray-500"
									}`}>
									₱
								</span>
								<input
									type="number"
									value={amount}
									onChange={(e) => {
										setAmount(e.target.value);
										clearError("amount");
									}}
									placeholder="0.00"
									className={`w-full pl-8 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 text-lg font-bold transition-all ${
										errors.amount
											? "border-red-500 text-red-900 focus:ring-red-200 placeholder-red-300 bg-red-50"
											: "border-gray-300 text-gray-900 focus:ring-red-900"
									}`}
									autoFocus
								/>
							</div>
							{/* Error Message */}
							<div className="flex justify-between items-start mt-1">
								{errors.amount ? (
									<p className="text-xs text-red-600 font-medium flex items-center gap-1">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="12"
											height="12"
											fill="currentColor"
											className="bi bi-exclamation-circle-fill"
											viewBox="0 0 16 16">
											<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
										</svg>
										{errors.amount}
									</p>
								) : (
									<p className="text-xs text-gray-400">Min. amount: ₱50.00</p>
								)}
							</div>
						</div>

						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Select Method
							</label>
							<div className="grid grid-cols-2 gap-3">
								{["GCash", "Maya", "7-Eleven", "UnionBank"].map((p) => (
									<div
										key={p}
										onClick={() => setProvider(p)}
										className={`cursor-pointer px-4 py-3 rounded-xl border-2 text-center text-sm font-bold transition-all ${
											provider === p
												? "border-red-900 bg-red-50 text-red-900"
												: "border-gray-200 text-gray-500 hover:border-gray-300"
										}`}>
										{p}
									</div>
								))}
							</div>
						</div>

						<button
							type="submit"
							className="w-full bg-[#8B0000] text-white font-bold py-3.5 rounded-xl hover:bg-red-900 transition-transform active:scale-95">
							Next
						</button>
					</form>
				)}

				{/* STEP 2: QR & Reference */}
				{step === 2 && (
					<form
						onSubmit={handleSubmit}
						className="p-6 space-y-5">
						<div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-200">
							<p className="text-sm text-gray-500 mb-3">
								Scan to Pay ₱{parseFloat(amount).toLocaleString()}
							</p>
							{/* Fake QR using API */}
							<div className="bg-white p-2 rounded-lg shadow-sm">
								<Image
									src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=UniMarket-${provider}-${amount}`}
									alt="QR Code"
									width={150}
									height={150}
								/>
							</div>
						</div>

						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-1">
								Receipt Transaction No.
							</label>
							<input
								type="text"
								value={referenceNumber}
								onChange={(e) => {
									setReferenceNumber(e.target.value);
									clearError("referenceNumber");
								}}
								placeholder="e.g. 123456789"
								className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 text-sm transition-all ${
									errors.referenceNumber
										? "border-red-500 text-red-900 focus:ring-red-200 bg-red-50 placeholder-red-300"
										: "border-gray-300 focus:ring-red-900 text-gray-900"
								}`}
							/>
							{errors.referenceNumber ? (
								<p className="text-xs text-red-600 mt-1 font-medium">
									{errors.referenceNumber}
								</p>
							) : (
								<p className="text-xs text-gray-400 mt-1">
									No picture needed. Just the ref no.
								</p>
							)}
						</div>

						<div className="flex gap-3">
							<button
								type="button"
								onClick={() => setStep(1)}
								className="flex-1 border border-gray-300 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-50 transition-colors">
								Back
							</button>
							<button
								type="submit"
								disabled={isLoading}
								className="flex-1 bg-[#8B0000] text-white font-bold py-3.5 rounded-xl hover:bg-red-900 transition-transform active:scale-95 disabled:bg-gray-400">
								{isLoading ? "Verifying..." : "Submit"}
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
};

export default AddFundsModal;
