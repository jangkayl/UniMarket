"use server";

import { revalidatePath } from "next/cache";

// Matches Spring Boot NotificationDTO
export interface NotificationItem {
	notificationId: number;
	studentId: number;
	title: string;
	message: string;
	type: string;
	read: boolean;
	createdAt: string;
}

export async function fetchNotifications(userId: number) {
	try {
		const res = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/notifications/getNotificationsByUser/${userId}`,
			{
				cache: "no-store",
			}
		);
		if (res.ok) {
			return await res.json();
		}
		return [];
	} catch (error) {
		console.error("Fetch notifications error:", error);
		return [];
	}
}

export async function markNotificationAsReadAction(notificationId: number) {
	try {
		const res = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/notifications/${notificationId}/read`,
			{
				method: "PUT",
			}
		);

		if (res.ok) {
			revalidatePath("/notifications");
			return true;
		}
		return false;
	} catch (error) {
		console.error("Mark read error:", error);
		return false;
	}
}

export async function markAllNotificationsAsReadAction(
	notificationIds: number[]
) {
	try {
		// Parallel requests to mark each as read (since backend lacks batch endpoint)
		await Promise.all(
			notificationIds.map((id) =>
				fetch(
					`${process.env.SPRING_BOOT_API_URL}/api/notifications/${id}/read`,
					{
						method: "PUT",
					}
				)
			)
		);
		revalidatePath("/notifications");
		return true;
	} catch (error) {
		console.error("Mark all read error:", error);
		return false;
	}
}

export async function deleteNotificationAction(notificationId: number) {
	try {
		const res = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/notifications/deleteNotification/${notificationId}`,
			{
				method: "DELETE",
			}
		);
		return res.ok;
	} catch (error) {
		console.error("Delete error:", error);
		return false;
	}
}

export async function clearAllNotificationsAction(notificationIds: number[]) {
	try {
		await Promise.all(
			notificationIds.map((id) =>
				fetch(
					`${process.env.SPRING_BOOT_API_URL}/api/notifications/deleteNotification/${id}`,
					{
						method: "DELETE",
					}
				)
			)
		);
		revalidatePath("/notifications");
		return true;
	} catch (error) {
		console.error("Clear all error:", error);
		return false;
	}
}
