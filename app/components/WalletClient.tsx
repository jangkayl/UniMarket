"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AddFundsModal from "../components/AddFundsModal";
import WithdrawModal from "../components/WithdrawModal";
import TransactionHistoryModal from "../components/TransactionHistoryModal";
import {
	addFundsAction,
	setWalletPinAction,
	withdrawFundsAction,
} from "@/app/actions/wallet";

interface Transaction {
	transactionId: number;
	amount: number;
	type: string;
	description: string;
	status: string;
	transactionDate: string;
	referenceNumber?: string;
}

interface WalletClientProps {
	user: { studentId: number };
	initialBalance: number;
	initialTransactions: Transaction[];
	hasPin: boolean;
}

const WalletClient = ({
	user,
	initialBalance,
	initialTransactions,
	hasPin,
}: WalletClientProps) => {
	const [balance, setBalance] = useState(initialBalance);

	// Modal States
	const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
	const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
	const [isHistoryOpen, setIsHistoryOpen] = useState(false);

	// PIN States
	const [isPinSet, setIsPinSet] = useState(hasPin);
	const [oldPin, setOldPin] = useState(["", "", "", ""]);
	const [newPin, setNewPin] = useState(["", "", "", ""]);
	const [isPinLoading, setIsPinLoading] = useState(false);

	// --- HANDLERS ---
	const handleAddFunds = async (
		amount: number,
		provider: string,
		referenceNumber: string
	) => {
		const result = await addFundsAction(
			user.studentId,
			amount,
			provider,
			referenceNumber
		);
		if (result.success) {
			showToast(`Successfully added ₱${amount}`, "success");
			setBalance((prev) => prev + amount);
			setTimeout(() => window.location.reload(), 1500);
		} else {
			showToast("Failed to add funds. Check reference number.", "error");
		}
	};

	// Withdraw Handler - UPDATED
	const handleWithdraw = async (
		amount: number,
		provider: string,
		accNum: string,
		accName: string,
		pin: string
	) => {
		const result = await withdrawFundsAction(
			user.studentId,
			amount,
			provider,
			accNum,
			accName,
			pin
		);
		if (result.success) {
			showToast(`Withdrawal of ₱${amount} successful!`, "success");
			setBalance((prev) => prev - amount);
			setIsWithdrawOpen(false);
			setTimeout(() => window.location.reload(), 1500);
		} else {
			showToast(result.message || "Withdrawal failed.", "error");
		}
	};

	const handleSetPin = async () => {
		const newPinStr = newPin.join("");
		const oldPinStr = oldPin.join("");

		if (newPinStr.length !== 4) {
			showToast("New PIN must be 4 digits", "error");
			return;
		}
		if (isPinSet && oldPinStr.length !== 4) {
			showToast("Please enter current PIN", "error");
			return;
		}

		setIsPinLoading(true);
		const res = await setWalletPinAction(
			user.studentId,
			newPinStr,
			isPinSet ? oldPinStr : undefined
		);
		setIsPinLoading(false);

		if (res.success) {
			showToast("PIN updated successfully!", "success");
			setOldPin(["", "", "", ""]);
			setNewPin(["", "", "", ""]);
			setIsPinSet(true);
		} else {
			showToast(res.message || "Failed to update PIN.", "error");
		}
	};

	// Helper to render PIN inputs
	const renderPinInputs = (
		values: string[],
		setter: React.Dispatch<React.SetStateAction<string[]>>,
		idPrefix: string
	) => (
		<div className="flex gap-3 justify-center mb-4">
			{values.map((digit, index) => (
				<input
					key={index}
					id={`${idPrefix}-${index}`}
					type="password"
					maxLength={1}
					value={digit}
					onChange={(e) => {
						const val = e.target.value;
						if (!/^\d*$/.test(val)) return;
						const newVals = [...values];
						newVals[index] = val.slice(-1);
						setter(newVals);
						if (val && index < 3)
							document.getElementById(`${idPrefix}-${index + 1}`)?.focus();
					}}
					onKeyDown={(e) => {
						if (e.key === "Backspace" && !values[index] && index > 0) {
							document.getElementById(`${idPrefix}-${index - 1}`)?.focus();
						}
					}}
					className="w-12 h-12 border-2 border-gray-300 rounded-lg text-center text-2xl font-bold focus:border-red-900 focus:outline-none transition-colors"
				/>
			))}
		</div>
	);

	const [toast, setToast] = useState<{
		msg: string;
		type: "success" | "error";
	} | null>(null);
	const showToast = (msg: string, type: "success" | "error") => {
		setToast({ msg, type });
		setTimeout(() => setToast(null), 3000);
	};

	const formatCurrency = (amount: number) =>
		new Intl.NumberFormat("en-PH", {
			style: "currency",
			currency: "PHP",
		}).format(amount);
	const formatDate = (dateString: string) =>
		new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "Completed":
				return "bg-green-100 text-green-700";
			case "Pending":
				return "bg-yellow-100 text-yellow-700";
			case "Failed":
				return "bg-red-100 text-red-700";
			default:
				return "bg-gray-100 text-gray-600";
		}
	};

	return (
		<div className="bg-white min-h-screen flex flex-col font-sans text-gray-900 relative">
			{toast && (
				<div
					className={`fixed top-24 right-10 z-80 px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in-down text-white ${
						toast.type === "success" ? "bg-green-600" : "bg-red-600"
					}`}>
					<div className="font-bold">
						{toast.type === "success" ? "Success" : "Error"}
					</div>
					<div className="text-sm">{toast.msg}</div>
				</div>
			)}

			<Navbar />

			<main className="grow w-full max-w-[1400px] mx-auto px-6 py-12">
				<h1 className="text-4xl font-bold text-gray-900 mb-8">
					Wallet Management
				</h1>

				<div className="bg-[#FFF5F5] rounded-3xl p-10 text-center mb-12 flex flex-col items-center justify-center border border-red-50 relative overflow-hidden">
					<div className="absolute top-0 left-0 w-32 h-32 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
					<div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

					<div className="relative z-10">
						<p className="text-gray-600 font-medium text-lg mb-1 uppercase tracking-widest">
							Current Balance
						</p>
						<h2 className="text-6xl font-extrabold text-gray-900 mb-8">
							{formatCurrency(balance)}
						</h2>
						<div className="flex gap-4">
							<button
								onClick={() => setIsAddFundsOpen(true)}
								className="bg-[#8B0000] text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-red-900 transition-all hover:-translate-y-1">
								Add Funds
							</button>
							<button
								onClick={() => {
									if (!isPinSet) {
										showToast("Please set a Security PIN first!", "error");
									} else {
										setIsWithdrawOpen(true);
									}
								}}
								className="bg-white border border-gray-200 text-gray-700 font-bold py-3 px-8 rounded-xl shadow-sm hover:bg-gray-50 transition-all hover:-translate-y-1">
								Withdraw
							</button>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* --- LEFT: Transactions --- */}
					<div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
						<h2 className="text-2xl font-bold text-gray-900 mb-6 flex justify-between items-center">
							<span>Recent Transactions</span>
							<button
								onClick={() => setIsHistoryOpen(true)}
								className="text-sm text-red-900 font-semibold hover:underline">
								View All
							</button>
						</h2>

						<div className="space-y-4">
							{initialTransactions && initialTransactions.length > 0 ? (
								initialTransactions.slice(0, 5).map((tx) => (
									<div
										key={tx.transactionId}
										className="flex flex-col md:grid md:grid-cols-4 items-start md:items-center py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 px-2 rounded-lg transition-colors">
										<span className="text-xs text-gray-400 mb-1 md:mb-0 font-medium">
											{formatDate(tx.transactionDate)}
										</span>
										<span
											className="font-semibold text-gray-800 text-sm mb-2 md:mb-0 col-span-1 pr-2"
											title={tx.description}>
											{tx.description}
										</span>
										<span
											className={`font-bold text-sm text-right w-full md:w-auto mb-2 md:mb-0 ${
												tx.type === "CREDIT" ? "text-green-600" : "text-red-600"
											}`}>
											{tx.type === "CREDIT" ? "+" : "-"}
											{formatCurrency(tx.amount)}
										</span>
										<div className="flex justify-end w-full md:w-auto">
											<span
												className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide ${getStatusBadge(
													tx.status
												)}`}>
												{tx.status}
											</span>
										</div>
									</div>
								))
							) : (
								<div className="text-center py-10 text-gray-400">
									No transactions yet.
								</div>
							)}
						</div>
					</div>

					{/* --- RIGHT: Security PIN --- */}
					<div className="space-y-8">
						<div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
							<div className="flex items-center gap-3 mb-4">
								<div className="bg-red-50 p-2 rounded-full text-red-900">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										fill="currentColor"
										className="bi bi-shield-lock-fill"
										viewBox="0 0 16 16">
										<path
											fillRule="evenodd"
											d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.8 11.8 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7 7 0 0 0 1.048-.625 11.8 11.8 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.54 1.54 0 0 0-1.044-1.263 63 63 0 0 0-2.887-.87C9.843.266 8.69 0 8 0m0 5a1.5 1.5 0 0 1 .5 2.915l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99A1.5 1.5 0 0 1 8 5"
										/>
									</svg>
								</div>
								<div>
									<h2 className="text-2xl font-bold text-gray-900">
										Security PIN
									</h2>
									{isPinSet && (
										<span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded">
											Active
										</span>
									)}
								</div>
							</div>

							<p className="text-gray-500 text-sm mb-6">
								{isPinSet
									? "Enter your current PIN to change it."
									: "Set a 4-digit PIN to secure your wallet transactions."}
							</p>

							{isPinSet && (
								<div className="mb-6">
									<label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">
										Current PIN
									</label>
									{renderPinInputs(oldPin, setOldPin, "old")}
								</div>
							)}

							<div className="mb-6">
								<label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">
									{isPinSet ? "New PIN" : "New PIN"}
								</label>
								{renderPinInputs(newPin, setNewPin, "new")}
							</div>

							<button
								onClick={handleSetPin}
								disabled={
									isPinLoading ||
									newPin.join("").length !== 4 ||
									(isPinSet && oldPin.join("").length !== 4)
								}
								className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors disabled:bg-gray-400">
								{isPinLoading
									? "Updating..."
									: isPinSet
									? "Change PIN"
									: "Set PIN"}
							</button>
						</div>
					</div>
				</div>
			</main>

			<Footer />

			{/* MODALS */}
			<AddFundsModal
				isOpen={isAddFundsOpen}
				onClose={() => setIsAddFundsOpen(false)}
				onConfirm={handleAddFunds}
			/>

			<WithdrawModal
				isOpen={isWithdrawOpen}
				onClose={() => setIsWithdrawOpen(false)}
				onConfirm={handleWithdraw}
				balance={balance}
			/>

			<TransactionHistoryModal
				isOpen={isHistoryOpen}
				onClose={() => setIsHistoryOpen(false)}
				transactions={initialTransactions}
			/>
		</div>
	);
};

export default WalletClient;
