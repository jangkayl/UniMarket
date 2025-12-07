import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MessagesClient from "../components/MessagesClient";

// Define user type from session
interface User {
	studentId: number;
	firstName: string;
	lastName: string;
	profilePicture: string | null;
}

// Define contact type from API
interface Contact {
	studentId: number;
	firstName: string;
	lastName: string;
	profilePicture: string | null;
}

const MessagesPage = async ({
	searchParams,
}: {
	searchParams: Promise<{ chatWith?: string }>;
}) => {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get("session");

	if (!sessionCookie) {
		redirect("/login");
	}

	const user: User = JSON.parse(sessionCookie.value);
	const resolvedSearchParams = await searchParams;
	const chatWithId = resolvedSearchParams.chatWith
		? Number(resolvedSearchParams.chatWith)
		: null;

	// 1. Fetch Your Existing Contacts
	let contacts: Contact[] = [];
	try {
		const res = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/messages/contacts/${user.studentId}`,
			{
				cache: "no-store",
			}
		);
		if (res.ok) {
			contacts = await res.json();
		}
	} catch (e) {
		console.error("Failed to fetch contacts", e);
	}

	// 2. PRE-FETCH: If 'chatWith' is a new person, fetch their details NOW (Server-Side)
	// This prevents the "Loading..." flicker on the client
	if (chatWithId) {
		const exists = contacts.some((c) => c.studentId === chatWithId);

		if (!exists) {
			try {
				// Fetch the specific student details to create a temporary contact card
				const res = await fetch(
					`${process.env.SPRING_BOOT_API_URL}/api/students/getStudentById/${chatWithId}`,
					{
						cache: "no-store",
					}
				);

				if (res.ok) {
					const newContact = await res.json();

					// Add them to the TOP of the list so they appear selected
					contacts.unshift({
						studentId: newContact.studentId || newContact.id, // Handle potential DTO diff
						firstName: newContact.firstName,
						lastName: newContact.lastName,
						profilePicture: newContact.profilePicture,
					});
				}
			} catch (e) {
				console.error("Failed to fetch new contact details", e);
			}
		}
	}

	return (
		<div className="bg-white min-h-screen flex flex-col font-sans text-gray-900">
			<Navbar />
			<main className="grow w-full max-w-[1400px] mx-auto px-6 py-8">
				<h1 className="text-3xl font-bold mb-6">Messages</h1>
				<MessagesClient
					currentUser={user}
					initialContacts={contacts}
					initialActiveId={chatWithId} // Pass the ID directly
				/>
			</main>
			<Footer />
		</div>
	);
};

export default MessagesPage;
