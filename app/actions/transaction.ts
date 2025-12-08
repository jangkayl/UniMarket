"use server";

export interface TransactionHistoryItem {
	transactionId: number;
	amount: number;
	transactionType: string;
	status: string;
	transactionDate: string;
	itemId: number;
	itemName: string;
	itemImage: string | null;
	buyerId: number;
	buyerName: string;
	sellerId: number;
	sellerName: string;
}

export async function getActiveTransactionAction(
	userId1: number,
	userId2: number
) {
	try {
		const res = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/transactions/active?userId1=${userId1}&userId2=${userId2}`,
			{ cache: "no-store" }
		);

		if (res.status === 204) return null; // No content
		if (res.ok) {
			return await res.json();
		}
		return null;
	} catch (error) {
		return null;
	}
}

export async function getPendingTransactionsAction(userId: number) {
	try {
		const res = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/transactions/pending/${userId}`,
			{ cache: "no-store" }
		);
		if (res.ok) {
			return await res.json();
		}
		return [];
	} catch (error) {
		return [];
	}
}

export async function createTransactionAction(data: {
	amount: number;
	transactionType: string;
	status: string;
	transactionDate: string;
	dueDate?: string | null;
	notes: string;
	buyerId: number;
	sellerId: number;
	itemId: number;
}) {
	try {
		const res = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/transactions/addTransaction`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			}
		);

		if (res.ok) {
			return { success: true, data: await res.json() };
		}
		return { success: false, message: "Failed to create transaction record." };
	} catch (error) {
		console.error("Create transaction error:", error);
		return { success: false, message: "Network error occurred." };
	}
}

// --- Cancel Transaction Action ---
export async function cancelTransactionAction(
	transactionId: number,
	userId: number
) {
	try {
		const res = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/transactions/${transactionId}/cancel`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId }),
			}
		);

		if (res.ok) {
			return { success: true };
		}
		const errorData = await res.json();
		return {
			success: false,
			message: errorData.error || "Failed to cancel transaction",
		};
	} catch (error) {
		return { success: false, message: "Network error" };
	}
}

// --- Fetch User History ---
export async function getUserTransactionsAction(userId: number) {
	try {
		const res = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/transactions/history/${userId}`,
			{ cache: "no-store" }
		);

		if (res.ok) {
			return await res.json();
		}
		return [];
	} catch (error) {
		return [];
	}
}

export async function acceptTransactionAction(
	transactionId: number,
	userId: number
) {
	try {
		const res = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/transactions/${transactionId}/accept`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId }),
			}
		);
		return { success: res.ok, message: await res.text() };
	} catch (e) {
		return { success: false, message: "Network error" };
	}
}

export async function confirmTransactionAction(
	transactionId: number,
	userId: number
) {
	try {
		const res = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/transactions/${transactionId}/confirm`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId }),
			}
		);
		return { success: res.ok, message: await res.text() };
	} catch (e) {
		return { success: false, message: "Network error" };
	}
}
