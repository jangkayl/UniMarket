import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SettingsClient from "../../components/SettingsClient";

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

const SettingsPage = async () => {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get("session");

	if (!sessionCookie) {
		redirect("/login");
	}

	const sessionUser = JSON.parse(sessionCookie.value);

	// Optional: Fetch fresh user data to ensure profile picture is up to date
	let user: User = sessionUser;
	try {
		const res = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/students/${sessionUser.studentId}`,
			{ cache: "no-store" }
		);
		if (res.ok) {
			user = await res.json();
		}
	} catch (e) {
		/* fallback to session data */
	}

	return <SettingsClient user={user} />;
};

export default SettingsPage;
