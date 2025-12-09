"use server";

export interface NotificationItem {
	id: number;
	type: string;
	message: string;
	createdAt: string;
	read: boolean;
	title: string;
}

export interface DashboardData {
	walletBalance: number;
	activeListingsCount: number;
	pendingLoanRequestsCount: number;
	trustScore: number;
	notifications: NotificationItem[];
}

interface ApiItem {
	availabilityStatus: string;
	[key: string]: unknown;
}

interface ApiLoan {
	status: string;
	[key: string]: unknown;
}

interface ApiWallet {
	balance: number;
	[key: string]: unknown;
}

export async function getDashboardData(userId: number): Promise<DashboardData> {
	const API_URL = process.env.SPRING_BOOT_API_URL;

	try {
		// Fetch all data in parallel for performance
		const [walletRes, itemsRes, loansRes, notifRes] = await Promise.all([
			fetch(`${API_URL}/api/wallet/${userId}`, { cache: "no-store" }),
			fetch(`${API_URL}/api/items/seller/${userId}`, { cache: "no-store" }),
			fetch(`${API_URL}/api/loans/lender/${userId}`, { cache: "no-store" }),
			fetch(`${API_URL}/api/notifications/${userId}`, { cache: "no-store" }),
		]);

		const wallet: ApiWallet = walletRes.ok
			? await walletRes.json()
			: { balance: 0 };
		const items: ApiItem[] = itemsRes.ok ? await itemsRes.json() : [];
		const loans: ApiLoan[] = loansRes.ok ? await loansRes.json() : [];
		const notifications: NotificationItem[] = notifRes.ok
			? await notifRes.json()
			: [];

		// Calculate Stats
		// 1. Active Listings: Items where status is 'AVAILABLE'
		const activeListings = items.filter(
			(i) => i.availabilityStatus === "AVAILABLE"
		).length;

		// 2. Pending Loan Requests: Loans where status is 'Pending'
		const pendingLoans = loans.filter((l) => l.status === "Pending").length;

		return {
			walletBalance: wallet.balance || 0,
			activeListingsCount: activeListings,
			pendingLoanRequestsCount: pendingLoans,
			trustScore: 850, // Mock score for now
			notifications: notifications,
		};
	} catch (error) {
		console.error("Dashboard fetch error:", error);
		return {
			walletBalance: 0,
			activeListingsCount: 0,
			pendingLoanRequestsCount: 0,
			trustScore: 0,
			notifications: [],
		};
	}
}
