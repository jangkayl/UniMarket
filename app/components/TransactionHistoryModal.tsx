"use client";

interface Transaction {
	transactionId: number;
	amount: number;
	type: string;
	description: string;
	status: string;
	transactionDate: string;
}

interface Props {
	isOpen: boolean;
	onClose: () => void;
	transactions: Transaction[];
}

const TransactionHistoryModal = ({ isOpen, onClose, transactions }: Props) => {
	if (!isOpen) return null;

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const formatCurrency = (amount: number) =>
		new Intl.NumberFormat("en-PH", {
			style: "currency",
			currency: "PHP",
		}).format(amount);

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
			{/* Modal Container */}
			<div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up flex flex-col max-h-[80vh]">
				{/* Header */}
				<div className="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 z-10">
					<h3 className="font-bold text-xl text-gray-900">
						Transaction History
					</h3>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-red-900 p-1 rounded-full transition-colors">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							fill="currentColor"
							className="bi bi-x"
							viewBox="0 0 16 16">
							<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
						</svg>
					</button>
				</div>

				{/* Scrollable Content */}
				<div className="overflow-y-auto p-6 space-y-4 custom-scrollbar">
					{transactions.length > 0 ? (
						transactions.map((tx) => (
							<div
								key={tx.transactionId}
								className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 p-2 rounded-lg">
								<div>
									<p className="font-semibold text-gray-800 text-sm">
										{tx.description}
									</p>
									<p className="text-xs text-gray-400 mt-1">
										{formatDate(tx.transactionDate)}
									</p>
									<span
										className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide mt-1 inline-block ${
											tx.status === "Completed"
												? "bg-green-100 text-green-700"
												: tx.status === "Failed"
												? "bg-red-100 text-red-700"
												: "bg-yellow-100 text-yellow-700"
										}`}>
										{tx.status}
									</span>
								</div>
								<div
									className={`font-bold ${
										tx.type === "CREDIT" ? "text-green-600" : "text-red-600"
									}`}>
									{tx.type === "CREDIT" ? "+" : "-"}
									{formatCurrency(tx.amount)}
								</div>
							</div>
						))
					) : (
						<div className="text-center text-gray-400 py-10">
							No transactions found.
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default TransactionHistoryModal;
