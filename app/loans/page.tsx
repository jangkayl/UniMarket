import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoansClient from "../components/LoansClient";
import {
	getUserTransactionsAction,
	TransactionHistoryItem,
} from "@/app/actions/transaction";

interface User {
	studentId: number;
}

const LoansPage = async () => {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get("session");

	if (!sessionCookie) {
		redirect("/login");
	}

	const user: User = JSON.parse(sessionCookie.value);

	// Fetch ALL transactions (Buy, Sell, Rent, etc.)
	const allTransactions = await getUserTransactionsAction(user.studentId);

	// Filter only 'Rent' transactions using the proper type
	const loanTransactions = allTransactions.filter(
		(t: TransactionHistoryItem) => t.transactionType === "Rent"
	);

	return (
		<LoansClient
			currentUser={user}
			transactions={loanTransactions}
		/>
	);
};

export default LoansPage;
