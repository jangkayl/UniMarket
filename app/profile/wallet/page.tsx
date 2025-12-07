import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import WalletClient from "../../components/WalletClient";

interface User {
	studentId: number;
}

const WalletPage = async () => {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get("session");

	if (!sessionCookie) {
		redirect("/login");
	}

	const user: User = JSON.parse(sessionCookie.value);

	// Fetch Wallet Data
	let wallet = { balance: 0.0, pin: null };
	let transactions = [];

	try {
		// Check wallet for PIN
		const walletRes = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/wallet/${user.studentId}`,
			{ cache: "no-store" }
		);
		if (walletRes.ok) wallet = await walletRes.json();

		// Get Transactions
		const txRes = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/wallet/${user.studentId}/transactions`,
			{ cache: "no-store" }
		);
		if (txRes.ok) transactions = await txRes.json();
	} catch (e) {
		console.error("Wallet fetch error:", e);
	}

	// Determine if PIN is set (without exposing the PIN itself if possible, though backend sends it currently)
	const hasPin = wallet.pin !== null && wallet.pin !== "";

	return (
		<WalletClient
			user={user}
			initialBalance={wallet.balance}
			initialTransactions={transactions}
			hasPin={hasPin} // Pass boolean flag
		/>
	);
};

export default WalletPage;
