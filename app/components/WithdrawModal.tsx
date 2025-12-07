"use client";

import { useState } from "react";

interface WithdrawModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (
		amount: number,
		provider: string,
		accNum: string,
		accName: string,
		pin: string
	) => Promise<void>;
	balance: number;
}

const WithdrawModal = ({
	isOpen,
	onClose,
	onConfirm,
	balance,
}: WithdrawModalProps) => {
	const [step, setStep] = useState(1);
	const [amount, setAmount] = useState("");
	const [provider, setProvider] = useState("GCash");
	const [accountNumber, setAccountNumber] = useState("");
	const [accountName, setAccountName] = useState("");
	const [pin, setPin] = useState(["", "", "", ""]);
	const [isLoading, setIsLoading] = useState(false);

	// Validation State
	const [errors, setErrors] = useState({
		amount: "",
		accountNumber: "",
		accountName: "",
	});

	if (!isOpen) return null;

	const validateStep1 = () => {
		const newErrors = { amount: "", accountNumber: "", accountName: "" };
		let isValid = true;

		// Amount Validation
		const val = Number(amount);
		if (!amount || val <= 0) {
			newErrors.amount = "Please enter a valid amount.";
			isValid = false;
		} else if (val < 50) {
			newErrors.amount = "Minimum withdrawal amount is ₱50.00";
			isValid = false;
		} else if (val > balance) {
			newErrors.amount = "Insufficient balance.";
			isValid = false;
		}

		// Account Number Validation
		if (!accountNumber.trim()) {
			newErrors.accountNumber = "Account number is required.";
			isValid = false;
		}

		// Account Name Validation
		if (!accountName.trim()) {
			newErrors.accountName = "Account name is required.";
			isValid = false;
		}

		setErrors(newErrors);
		return isValid;
	};

	const handleNext = (e: React.FormEvent) => {
		e.preventDefault();
		if (validateStep1()) {
			setStep(2);
		}
	};

	const handlePinChange = (index: number, value: string) => {
		if (!/^\d*$/.test(value)) return;
		const newPin = [...pin];
		newPin[index] = value.slice(-1);
		setPin(newPin);
		if (value && index < 3)
			document.getElementById(`w-pin-${index + 1}`)?.focus();
	};

	const handlePinKeyDown = (
		index: number,
		e: React.KeyboardEvent<HTMLInputElement>
	) => {
		if (e.key === "Backspace" && !pin[index] && index > 0) {
			document.getElementById(`w-pin-${index - 1}`)?.focus();
		}
	};

	const handleSubmit = async () => {
		const pinStr = pin.join("");
		if (pinStr.length !== 4) return;

		setIsLoading(true);
		await onConfirm(
			Number(amount),
			provider,
			accountNumber,
			accountName,
			pinStr
		);
		setIsLoading(false);
	};

	// Helper to clear specific error on change
	const clearError = (field: keyof typeof errors) => {
		setErrors((prev) => ({ ...prev, [field]: "" }));
	};

	return (
		<div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
			<div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-up">
				<div className="bg-gray-900 px-6 py-4 flex justify-between items-center text-white">
					<h3 className="font-bold text-lg">Withdraw Funds</h3>
					<button
						onClick={onClose}
						className="hover:bg-gray-700 p-1 rounded-full transition-colors">
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

				{/* STEP 1: Details */}
				{step === 1 && (
					<form
						onSubmit={handleNext}
						className="p-6 space-y-5">
						{/* Amount Input */}
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
											: "border-gray-300 text-gray-900 focus:ring-gray-900"
									}`}
									autoFocus
								/>
							</div>

							{errors.amount ? (
								<p className="text-xs text-red-600 mt-1 font-medium flex items-center gap-1">
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
								<div className="flex justify-between items-center mt-1">
									<p className="text-xs text-gray-400">
										Min. withdrawal: ₱50.00
									</p>
									<p className="text-xs text-gray-500 text-right">
										Available: ₱{balance.toFixed(2)}
									</p>
								</div>
							)}
						</div>

						{/* Transfer Info */}
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Transfer To
							</label>
							<div className="grid grid-cols-2 gap-3 mb-4">
								{["GCash", "Maya"].map((p) => (
									<div
										key={p}
										onClick={() => setProvider(p)}
										className={`cursor-pointer px-4 py-3 rounded-xl border-2 text-center text-sm font-bold transition-all ${
											provider === p
												? "border-blue-600 bg-blue-50 text-blue-900"
												: "border-gray-200 text-gray-500 hover:border-gray-300"
										}`}>
										{p}
									</div>
								))}
							</div>

							<div className="space-y-3">
								{/* Account Number */}
								<div>
									<input
										type="text"
										value={accountNumber}
										onChange={(e) => {
											setAccountNumber(e.target.value);
											clearError("accountNumber");
										}}
										placeholder={`${provider} Number`}
										className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 text-sm font-medium transition-all ${
											errors.accountNumber
												? "border-red-500 text-red-900 focus:ring-red-200 bg-red-50 placeholder-red-300"
												: "border-gray-300 focus:ring-gray-900"
										}`}
									/>
									{errors.accountNumber && (
										<p className="text-xs text-red-600 mt-1 font-medium">
											{errors.accountNumber}
										</p>
									)}
								</div>

								{/* Account Name */}
								<div>
									<input
										type="text"
										value={accountName}
										onChange={(e) => {
											setAccountName(e.target.value.toUpperCase());
											clearError("accountName");
										}}
										placeholder="FULL ACCOUNT NAME"
										className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 text-sm font-medium uppercase placeholder:normal-case transition-all ${
											errors.accountName
												? "border-red-500 text-red-900 focus:ring-red-200 bg-red-50 placeholder-red-300"
												: "border-gray-300 focus:ring-gray-900"
										}`}
									/>
									{errors.accountName && (
										<p className="text-xs text-red-600 mt-1 font-medium">
											{errors.accountName}
										</p>
									)}
								</div>
							</div>
						</div>

						<button
							type="submit"
							className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition-transform active:scale-95">
							Next
						</button>
					</form>
				)}

				{/* STEP 2: PIN Verification */}
				{step === 2 && (
					<div className="p-6 text-center">
						<h4 className="font-bold text-gray-900 mb-2">Enter Security PIN</h4>
						<p className="text-xs text-gray-500 mb-6">
							Confirm withdrawal of{" "}
							<span className="font-bold text-gray-900">
								₱{parseFloat(amount).toLocaleString()}
							</span>{" "}
							to <span className="font-bold text-gray-900">{provider}</span>
						</p>

						<div className="flex gap-3 justify-center mb-8">
							{pin.map((digit, index) => (
								<input
									key={index}
									id={`w-pin-${index}`}
									type="password"
									maxLength={1}
									value={digit}
									onChange={(e) => handlePinChange(index, e.target.value)}
									onKeyDown={(e) => handlePinKeyDown(index, e)}
									className="w-12 h-12 border-2 border-gray-300 rounded-lg text-center text-2xl font-bold focus:border-gray-900 focus:outline-none transition-colors"
									autoFocus={index === 0}
								/>
							))}
						</div>

						<div className="flex gap-3">
							<button
								onClick={() => setStep(1)}
								className="flex-1 border border-gray-300 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-50">
								Back
							</button>
							<button
								onClick={handleSubmit}
								disabled={isLoading || pin.join("").length !== 4}
								className="flex-1 bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 disabled:bg-gray-400 transition-all">
								{isLoading ? "Processing..." : "Confirm"}
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default WithdrawModal;
