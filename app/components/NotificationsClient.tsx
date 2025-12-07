"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {
	NotificationItem,
	markNotificationAsReadAction,
	markAllNotificationsAsReadAction,
	clearAllNotificationsAction,
} from "@/app/actions/notifications";

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

interface NotificationsClientProps {
	initialNotifications: NotificationItem[];
	currentUser: User;
}

const FilterButton = ({
	name,
	icon,
	isActive,
	onClick,
}: {
	name: string;
	icon: React.ReactNode;
	isActive: boolean;
	onClick: () => void;
}) => (
	<button
		onClick={onClick}
		className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
			isActive
				? "bg-red-900 text-white font-medium shadow-md"
				: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
		}`}>
		{icon}
		{name}
	</button>
);

const NotificationsClient = ({
	initialNotifications,
}: NotificationsClientProps) => {
	const [activeFilter, setActiveFilter] = useState("All");
	const [notifications, setNotifications] =
		useState<NotificationItem[]>(initialNotifications);
	const [isClearing, setIsClearing] = useState(false);
	const [isMarkingAll, setIsMarkingAll] = useState(false);

	// UI States
	const [showClearModal, setShowClearModal] = useState(false);
	const [showToast, setShowToast] = useState(false);

	// Helper to format date "time ago" style
	const formatTimeAgo = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

		if (diffInSeconds < 60) return "Just now";
		if (diffInSeconds < 3600)
			return `${Math.floor(diffInSeconds / 60)} min ago`;
		if (diffInSeconds < 86400)
			return `${Math.floor(diffInSeconds / 3600)} hours ago`;
		return date.toLocaleDateString();
	};

	// Helper to determine action text based on type
	const getActionText = (type: string) => {
		switch (type.toLowerCase()) {
			case "message":
				return "View Message";
			case "loan":
				return "View Loan";
			case "listing":
				return "View Item";
			case "payment":
				return "Make Payment";
			default:
				return "View Details";
		}
	};

	const handleMarkAsRead = async (id: number) => {
		// Optimistic update
		setNotifications((prev) =>
			prev.map((n) => (n.notificationId === id ? { ...n, read: true } : n))
		);
		await markNotificationAsReadAction(id);
	};

	const handleMarkAllRead = async () => {
		const unreadIds = notifications
			.filter((n) => !n.read)
			.map((n) => n.notificationId);
		if (unreadIds.length === 0) return;

		setIsMarkingAll(true);
		setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
		await markAllNotificationsAsReadAction(unreadIds);
		setIsMarkingAll(false);
	};

	// --- Clear All Handler (Triggers Modal) ---
	const handleClearAllClick = () => {
		if (notifications.length === 0) return;
		setShowClearModal(true);
	};

	// --- Confirm Clear Action ---
	const confirmClearAll = async () => {
		setIsClearing(true);
		const ids = notifications.map((n) => n.notificationId);
		const success = await clearAllNotificationsAction(ids);

		if (success) {
			setNotifications([]);
			setShowClearModal(false);
			setShowToast(true);
			setTimeout(() => setShowToast(false), 3000);
		} else {
			alert("Failed to clear notifications");
		}
		setIsClearing(false);
	};

	// Icons Map
	const getIcon = (type: string) => {
		switch (type.toLowerCase()) {
			case "message":
				return (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						fill="currentColor"
						className="bi bi-chat-left-text"
						viewBox="0 0 16 16">
						<path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
						<path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
					</svg>
				);
			case "loan":
				return (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						fill="currentColor"
						className="bi bi-person-check"
						viewBox="0 0 16 16">
						<path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
						<path d="M8.256 14a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256z" />
					</svg>
				);
			case "listing":
				return (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						fill="currentColor"
						className="bi bi-box-seam"
						viewBox="0 0 16 16">
						<path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zm3.564 1.426L5.596 5 8 5.961 14.154 3.5l-2.404-.961zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z" />
					</svg>
				);
			case "payment":
				return (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						fill="currentColor"
						className="bi bi-wallet2"
						viewBox="0 0 16 16">
						<path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499L12.136.326zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484L5.562 3zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z" />
					</svg>
				);
			default:
				return (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						fill="currentColor"
						className="bi bi-bell"
						viewBox="0 0 16 16">
						<path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6" />
					</svg>
				);
		}
	};

	return (
		<div className="bg-white min-h-screen flex flex-col font-sans relative">
			{/* --- TOAST NOTIFICATION --- */}
			{showToast && (
				<div className="fixed top-24 right-10 z-80 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in-down">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						fill="currentColor"
						className="bi bi-check-circle-fill"
						viewBox="0 0 16 16">
						<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
					</svg>
					<div>
						<h4 className="font-bold">Success</h4>
						<p className="text-sm">All notifications cleared.</p>
					</div>
				</div>
			)}

			{/* --- DELETE CONFIRMATION MODAL --- */}
			{showClearModal && (
				<div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
					<div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full animate-fade-in-up">
						<div className="flex items-center gap-3 text-red-900 mb-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								fill="currentColor"
								className="bi bi-exclamation-triangle-fill"
								viewBox="0 0 16 16">
								<path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
							</svg>
							<h3 className="text-xl font-bold">Clear All?</h3>
						</div>
						<p className="text-gray-600 mb-6 leading-relaxed">
							Are you sure you want to clear all notifications? This action
							cannot be undone.
						</p>
						<div className="flex gap-3 justify-end">
							<button
								onClick={() => setShowClearModal(false)}
								className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
								Cancel
							</button>
							<button
								onClick={confirmClearAll}
								disabled={isClearing}
								className="px-5 py-2.5 rounded-lg bg-red-900 text-white font-semibold hover:bg-red-800 transition-colors disabled:bg-red-400">
								{isClearing ? "Clearing..." : "Yes, Clear All"}
							</button>
						</div>
					</div>
				</div>
			)}

			<Navbar />

			<main className="grow w-full max-w-[1400px] mx-auto px-6 py-10">
				<h1 className="text-4xl font-bold text-gray-900 mb-10">
					Notifications
				</h1>

				<div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(90vh-250px)]">
					{/* LEFT COLUMN: Notification List (Scrollable) */}
					<div className="lg:col-span-3 space-y-4 h-full overflow-y-auto pr-2 custom-scrollbar">
						{notifications.length > 0 ? (
							notifications.map((notif) => (
								<div
									key={notif.notificationId}
									className={`border rounded-xl p-6 flex flex-col md:flex-row gap-4 hover:shadow-sm transition-shadow ${
										notif.read
											? "bg-white border-gray-200"
											: "bg-red-50 border-red-200"
									}`}>
									{/* Icon Box */}
									<div className="shrink-0">
										<div
											className={`w-12 h-12 rounded-full flex items-center justify-center ${
												notif.read
													? "bg-gray-100 text-gray-500"
													: "bg-white text-red-900 shadow-sm"
											}`}>
											{getIcon(notif.type)}
										</div>
									</div>

									{/* Content */}
									<div className="grow">
										<div className="flex justify-between items-start">
											<h3
												className={`text-lg font-bold ${
													notif.read ? "text-gray-900" : "text-red-900"
												}`}>
												{notif.title}
											</h3>
											{!notif.read && (
												<div className="flex items-center gap-6">
													<button
														onClick={() =>
															handleMarkAsRead(notif.notificationId)
														}
														className="flex items-center gap-1 text-red-900 hover:text-red-700 text-sm font-medium transition-colors">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="16"
															height="16"
															fill="currentColor"
															className="bi bi-check-square"
															viewBox="0 0 16 16">
															<path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
															<path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
														</svg>
														Mark Read
													</button>
												</div>
											)}
										</div>
										<p className="text-gray-600 mt-1">{notif.message}</p>
										<div className="flex justify-between items-center mt-3">
											<p className="text-gray-400 text-xs">
												{formatTimeAgo(notif.createdAt)}
											</p>
											<button className="text-sm font-semibold text-gray-800 hover:underline md:hidden block">
												{getActionText(notif.type)}
											</button>
										</div>
									</div>
								</div>
							))
						) : (
							<div className="p-12 text-center text-gray-500 bg-white border border-dashed border-gray-300 rounded-xl h-full flex flex-col justify-center items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="48"
									height="48"
									fill="currentColor"
									className="bi bi-inbox text-gray-300 mb-4"
									viewBox="0 0 16 16">
									<path d="M4.98 4a.5.5 0 0 0-.39.188L1.54 8H6a.5.5 0 0 1 .5.5 1.5 1.5 0 1 0 3 0A.5.5 0 0 1 10 8h4.46l-3.05-3.812A.5.5 0 0 0 11.02 4H4.98zm9.954 5H10.45a2.5 2.5 0 0 1-4.9 0H1.066l.32 2.562a.5.5 0 0 0 .497.438h12.234a.5.5 0 0 0 .496-.438L14.933 9zM3.809 3.563A1.5 1.5 0 0 1 4.981 3h6.038a1.5 1.5 0 0 1 1.172.563l3.7 4.625a.5.5 0 0 1 .105.374l-.39 3.124A1.5 1.5 0 0 1 14.117 13H1.883a1.5 1.5 0 0 1-1.489-1.314l-.39-3.124a.5.5 0 0 1 .106-.374l3.7-4.625z" />
								</svg>
								<p>No notifications found.</p>
							</div>
						)}
					</div>

					{/* RIGHT COLUMN: Sidebar */}
					<div className="lg:col-span-1 space-y-8">
						{/* Filter Notifications */}
						<div>
							<h2 className="text-xl font-bold text-gray-900 mb-4">
								Filter Notifications
							</h2>
							<div className="space-y-3">
								<FilterButton
									name="All"
									icon={
										<div
											className={`w-2 h-2 rounded-full ${
												activeFilter === "All" ? "bg-white" : "bg-red-900"
											}`}></div>
									}
									isActive={activeFilter === "All"}
									onClick={() => setActiveFilter("All")}
								/>
								<FilterButton
									name="Unread"
									icon={
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											fill="currentColor"
											className="bi bi-bell"
											viewBox="0 0 16 16">
											<path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6" />
										</svg>
									}
									isActive={activeFilter === "Unread"}
									onClick={() => setActiveFilter("Unread")}
								/>
								<FilterButton
									name="Messages"
									icon={
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											fill="currentColor"
											className="bi bi-chat-left"
											viewBox="0 0 16 16">
											<path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
										</svg>
									}
									isActive={activeFilter === "Messages"}
									onClick={() => setActiveFilter("Messages")}
								/>
								<FilterButton
									name="Activity"
									icon={
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											fill="currentColor"
											className="bi bi-box-seam"
											viewBox="0 0 16 16">
											<path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zm3.564 1.426L5.596 5 8 5.961 14.154 3.5l-2.404-.961zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z" />
										</svg>
									}
									isActive={activeFilter === "Activity"}
									onClick={() => setActiveFilter("Activity")}
								/>
							</div>
						</div>

						{/* Actions */}
						<div>
							<h2 className="text-xl font-bold text-gray-900 mb-4">Actions</h2>
							<div className="space-y-3">
								<button
									onClick={handleMarkAllRead}
									disabled={isMarkingAll || notifications.every((n) => n.read)}
									className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-800 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										fill="currentColor"
										className="bi bi-check-circle"
										viewBox="0 0 16 16">
										<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
										<path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" />
									</svg>
									{isMarkingAll ? "Marking..." : "Mark All as Read"}
								</button>

								<button
									onClick={handleClearAllClick}
									disabled={isClearing || notifications.length === 0}
									className="w-full flex items-center justify-center gap-2 bg-red-800 text-white font-semibold py-3 rounded-lg hover:bg-red-900 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										fill="currentColor"
										className="bi bi-trash"
										viewBox="0 0 16 16">
										<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
										<path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
									</svg>
									{isClearing ? "Clearing..." : "Clear All Notifications"}
								</button>
							</div>
						</div>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
};

export default NotificationsClient;
