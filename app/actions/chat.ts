"use server";

interface MessagePayload {
	senderId: number;
	receiverId: number;
	messageContent: string;
	messageType: string;
	isRead: boolean;
	itemId?: number | null;
}

export async function getConversationAction(userId1: number, userId2: number) {
	try {
		const res = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/messages/conversation?userId1=${userId1}&userId2=${userId2}`,
			{ cache: "no-store" }
		);

		if (res.ok) {
			return await res.json();
		}
		return [];
	} catch (error) {
		console.error("Fetch conversation error:", error);
		return [];
	}
}

export async function fetchContactDetails(studentId: number) {
	try {
		const res = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/students/getStudentById/${studentId}`,
			{
				cache: "no-store",
			}
		);

		if (res.ok) {
			return await res.json();
		}
		return null;
	} catch (error) {
		console.error("Error fetching contact details:", error);
		return null;
	}
}

// --- DELETE CONVERSATION ACTION ---
export async function deleteConversationAction(
	userId1: number,
	userId2: number
) {
	try {
		// Assuming Spring Boot endpoint: DELETE /api/messages/conversation?userId1=...&userId2=...
		const res = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/messages/conversation?userId1=${userId1}&userId2=${userId2}`,
			{ method: "DELETE" }
		);

		return res.ok;
	} catch (error) {
		console.error("Delete conversation error:", error);
		return false;
	}
}

export async function sendMessageAction(payload: MessagePayload) {
	try {
		const dto = {
			senderId: payload.senderId,
			receiverId: payload.receiverId,
			messageContent: payload.messageContent,
			messageType: payload.messageType,
			isRead: payload.isRead,
			itemId: payload.itemId,
		};

		const res = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/messages/send`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(dto),
			}
		);

		if (res.ok) {
			return await res.json();
		}
		return null;
	} catch (error) {
		console.error("Send message error:", error);
		return null;
	}
}
