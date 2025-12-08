import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import OrdersClient from "../components/OrdersClient";
import { getUserTransactionsAction } from "@/app/actions/transaction";

interface User {
	studentId: number;
}

const OrdersPage = async () => {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get("session");

	if (!sessionCookie) {
		redirect("/login");
	}

	const user: User = JSON.parse(sessionCookie.value);

	// Fetch transactions where user is Buyer OR Seller
	const transactions = await getUserTransactionsAction(user.studentId);

	return (
		<OrdersClient
			currentUser={user}
			transactions={transactions}
		/>
	);
};

export default OrdersPage;
