import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import NotificationsClient from "../components/NotificationsClient";
import { fetchNotifications } from "@/app/actions/notifications";

interface User {
	studentId: number;
	studentNumber: string;
	universityEmail: string;
	firstName: string;
	lastName: string;
	profilePicture: string | null;
	isVerified: boolean;
	accountStatus: string;
}

const NotificationsPage = async () => {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get("session");

	if (!sessionCookie) {
		redirect("/login");
	}

	const user: User = JSON.parse(sessionCookie.value);

	const notifications = await fetchNotifications(user.studentId);

	return (
		<NotificationsClient
			initialNotifications={notifications}
			currentUser={user}
		/>
	);
};

export default NotificationsPage;
