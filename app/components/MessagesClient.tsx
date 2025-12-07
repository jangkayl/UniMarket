"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
	getConversationAction,
	sendMessageAction,
	deleteConversationAction,
} from "@/app/actions/chat";

interface User {
	studentId: number;
	firstName: string;
	lastName: string;
	profilePicture: string | null;
}

interface Message {
	messageId: number;
	senderId: number;
	receiverId: number;
	messageContent: string;
	sentAt: string;
	senderProfilePicture: string | null;
	sender?: User;
	receiver?: User;
}

interface Contact {
	studentId: number;
	firstName: string;
	lastName: string;
	profilePicture: string | null;
}

interface MessagesClientProps {
	currentUser: User;
	initialContacts: Contact[];
	initialActiveId: number | null;
}

const MessagesClient = ({
	currentUser,
	initialContacts,
	initialActiveId,
}: MessagesClientProps) => {
	const router = useRouter();
	const searchParams = useSearchParams();

	// 1. Initialize Contacts State
	const [contacts, setContacts] = useState<Contact[]>(() => {
		const chatWithId = searchParams.get("chatWith");
		const sellerNameParam = searchParams.get("sellerName");

		if (chatWithId) {
			const contactId = Number(chatWithId);
			const exists = initialContacts.some((c) => c.studentId === contactId);

			if (!exists) {
				let fName = "User";
				let lName = `#${contactId}`;

				if (sellerNameParam) {
					try {
						const decodedName = decodeURIComponent(sellerNameParam);
						const parts = decodedName.trim().split(/\s+/);
						if (parts.length > 0) fName = parts[0];
						if (parts.length > 1) lName = parts.slice(1).join(" ");
						else lName = "";
					} catch (e) {}
				}

				const tempContact: Contact = {
					studentId: contactId,
					firstName: fName,
					lastName: lName,
					profilePicture: null,
				};
				return [tempContact, ...initialContacts];
			}
		}
		return initialContacts;
	});

	const [activeContactId, setActiveContactId] = useState<number | null>(() => {
		if (initialActiveId) return initialActiveId;

		const paramId = searchParams.get("chatWith");
		if (paramId) return Number(paramId);

		if (initialContacts.length > 0) return initialContacts[0].studentId;
		return null;
	});

	const [messages, setMessages] = useState<Message[]>([]);

	// --- UPDATED: Initialize newMessage with refItem check ---
	const [newMessage, setNewMessage] = useState(() => {
		const refItem = searchParams.get("refItem");
		if (refItem) {
			return `Hi, I'm interested in your "${refItem}". Is it still available?`;
		}
		return "";
	});
	// --------------------------------------------------------

	// UI States for Delete
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [showToast, setShowToast] = useState(false);

	// 2. Fetch Messages & Polling (Existing logic preserved)
	useEffect(() => {
		if (!activeContactId) return;

		const fetchMessages = async () => {
			const data = await getConversationAction(
				currentUser.studentId,
				activeContactId
			);
			setMessages(data);
		};

		fetchMessages();

		const interval = setInterval(fetchMessages, 3000);
		return () => clearInterval(interval);
	}, [activeContactId, currentUser.studentId]);

	// 4. Send Message
	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newMessage.trim() || !activeContactId) return;

		const payload = {
			senderId: currentUser.studentId,
			receiverId: activeContactId,
			messageContent: newMessage,
			messageType: "CHAT",
			isRead: false,
		};

		const savedMsg = await sendMessageAction(payload);

		if (savedMsg) {
			setMessages([...messages, savedMsg]);
			setNewMessage("");
		} else {
			alert("Failed to send message");
		}
	};

	// 5. Delete Conversation Handler
	const handleDeleteConversation = async () => {
		if (!activeContactId) return;
		setIsDeleting(true);

		const success = await deleteConversationAction(
			currentUser.studentId,
			activeContactId
		);

		if (success) {
			const updatedContacts = contacts.filter(
				(c) => c.studentId !== activeContactId
			);
			setContacts(updatedContacts);
			setMessages([]);

			setShowToast(true);
			setTimeout(() => setShowToast(false), 3000);

			setShowDeleteModal(false);
			setIsDeleting(false);

			if (updatedContacts.length > 0) {
				const nextId = updatedContacts[0].studentId;
				setActiveContactId(nextId);
				// Clear message input when switching via delete
				setNewMessage("");
				router.push(`/messages?chatWith=${nextId}`, { scroll: false });
			} else {
				setActiveContactId(null);
				setNewMessage("");
				router.push("/messages", { scroll: false });
			}
		} else {
			setIsDeleting(false);
			alert("Failed to delete conversation.");
		}
	};

	const activeContact = contacts.find((c) => c.studentId === activeContactId);

	const getAvatarUrl = (photo: string | null) => {
		return photo
			? `${
					process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
			  }/api/items/images/${photo}`
			: null;
	};

	return (
		<div className="flex flex-col lg:flex-row gap-6 h-[calc(90vh-140px)] relative">
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
						<p className="text-sm">Conversation deleted.</p>
					</div>
				</div>
			)}

			{/* --- DELETE CONFIRMATION MODAL --- */}
			{showDeleteModal && (
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
							<h3 className="text-xl font-bold">Delete Chat?</h3>
						</div>
						<p className="text-gray-600 mb-6 leading-relaxed">
							Are you sure you want to delete this conversation? This action
							cannot be undone.
						</p>
						<div className="flex gap-3 justify-end">
							<button
								onClick={() => setShowDeleteModal(false)}
								className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
								Cancel
							</button>
							<button
								onClick={handleDeleteConversation}
								disabled={isDeleting}
								className="px-5 py-2.5 rounded-lg bg-red-900 text-white font-semibold hover:bg-red-800 transition-colors disabled:bg-red-400">
								{isDeleting ? "Deleting..." : "Yes, Delete"}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* LEFT: CONTACTS LIST */}
			<div className="w-full lg:w-1/3 flex flex-col gap-4 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
				<div className="p-4 border-b border-gray-100 font-bold text-lg bg-gray-50 text-gray-800">
					Chats
				</div>
				<div className="grow overflow-y-auto p-2 space-y-1">
					{contacts.map((contact) => (
						<div
							key={contact.studentId}
							onClick={() => {
								if (activeContactId !== contact.studentId) {
									setActiveContactId(contact.studentId);
									// Clear new message input when switching chats manually
									setNewMessage("");
									router.push(`/messages?chatWith=${contact.studentId}`, {
										scroll: false,
									});
								}
							}}
							className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 border border-transparent ${
								activeContactId === contact.studentId
									? "bg-red-50 border-red-100"
									: "hover:bg-gray-50"
							}`}>
							<div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-gray-100 relative">
								{contact.profilePicture ? (
									// eslint-disable-next-line @next/next/no-img-element
									<img
										src={getAvatarUrl(contact.profilePicture)!}
										alt="Avatar"
										className="w-full h-full object-cover"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center text-gray-400">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="currentColor"
											className="w-6 h-6"
											viewBox="0 0 16 16">
											<path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
											<path
												fillRule="evenodd"
												d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
											/>
										</svg>
									</div>
								)}
							</div>
							<div className="grow min-w-0">
								<div className="font-bold text-gray-900 truncate">
									{contact.firstName} {contact.lastName}
								</div>
								<div className="text-xs text-gray-500 truncate">
									Click to view conversation
								</div>
							</div>
						</div>
					))}
					{contacts.length === 0 && (
						<div className="p-8 text-center text-gray-400 text-sm">
							No active conversations. <br /> Start chatting from the
							Marketplace!
						</div>
					)}
				</div>
			</div>

			{/* RIGHT: CHAT AREA */}
			<div className="w-full lg:w-2/3 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col overflow-hidden h-full relative">
				{activeContactId ? (
					<>
						{/* Chat Header */}
						<div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white shadow-sm z-10">
							<div className="flex items-center gap-4">
								<div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative border border-gray-100">
									{activeContact?.profilePicture ? (
										// eslint-disable-next-line @next/next/no-img-element
										<img
											src={getAvatarUrl(activeContact.profilePicture)!}
											alt="Avatar"
											className="w-full h-full object-cover"
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center text-gray-400">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="currentColor"
												className="w-5 h-5"
												viewBox="0 0 16 16">
												<path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
												<path
													fillRule="evenodd"
													d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
												/>
											</svg>
										</div>
									)}
								</div>
								<div>
									<h2 className="font-bold text-gray-900 text-lg leading-tight">
										{activeContact
											? `${activeContact.firstName} ${activeContact.lastName}`
											: `User #${activeContactId}`}
									</h2>
									<span className="text-xs text-green-600 font-medium flex items-center gap-1">
										<span className="w-2 h-2 bg-green-500 rounded-full"></span>{" "}
										Online
									</span>
								</div>
							</div>

							{/* DELETE BUTTON */}
							<button
								onClick={() => setShowDeleteModal(true)}
								className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
								title="Delete Conversation">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									fill="currentColor"
									className="bi bi-trash"
									viewBox="0 0 16 16">
									<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
									<path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
								</svg>
							</button>
						</div>

						{/* Messages List - CSS AUTO SCROLL TO BOTTOM */}
						<div className="grow p-6 overflow-y-auto bg-white flex flex-col-reverse gap-3 scrollbar-thin scrollbar-thumb-gray-200">
							{[...messages].reverse().map((msg) => {
								const isMe = msg.senderId === currentUser.studentId;
								return (
									<div
										key={msg.messageId}
										className={`flex w-full ${
											isMe ? "justify-end" : "justify-start"
										}`}>
										<div
											className={`flex flex-col max-w-[70%] ${
												isMe ? "items-end" : "items-start"
											}`}>
											<div
												className={`px-5 py-3 text-sm leading-relaxed shadow-sm wrap-break-word ${
													isMe
														? "bg-[#8B0000] text-white rounded-2xl rounded-tr-sm"
														: "bg-gray-100 text-gray-800 rounded-2xl rounded-tl-sm border border-gray-200"
												}`}>
												{msg.messageContent}
											</div>
											<span className="text-[10px] text-gray-400 mt-1 px-1">
												{new Date(msg.sentAt).toLocaleTimeString([], {
													hour: "2-digit",
													minute: "2-digit",
												})}
											</span>
										</div>
									</div>
								);
							})}
						</div>

						{/* Input Area */}
						<div className="p-4 bg-white border-t border-gray-100">
							<form
								onSubmit={handleSendMessage}
								className="flex items-center gap-3 relative">
								<input
									type="text"
									placeholder="Type your message..."
									className="w-full py-3.5 pl-5 pr-12 rounded-full border border-gray-300 focus:outline-none focus:border-red-800 focus:ring-2 focus:ring-red-50 bg-gray-50 focus:bg-white transition-all"
									value={newMessage}
									onChange={(e) => setNewMessage(e.target.value)}
								/>
								<button
									type="submit"
									disabled={!newMessage.trim()}
									className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
										newMessage.trim()
											? "bg-[#8B0000] text-white hover:bg-red-900 shadow-md"
											: "bg-gray-200 text-gray-400"
									}`}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="18"
										height="18"
										fill="currentColor"
										className="bi bi-send-fill ml-0.5"
										viewBox="0 0 16 16">
										<path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
									</svg>
								</button>
							</form>
						</div>
					</>
				) : (
					<div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-50">
						<div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-gray-300">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="40"
								height="40"
								fill="currentColor"
								className="bi bi-chat-dots"
								viewBox="0 0 16 16">
								<path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
								<path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9 9 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.4 10.4 0 0 1-.524 2.318l-.003.011a11 11 0 0 1-.244.637c-.079.186.074.394.273.362a22 22 0 0 0 .693-.125m.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8 8 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a11 11 0 0 0 .398-2" />
							</svg>
						</div>
						<p className="font-medium">
							Select a conversation to start chatting
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default MessagesClient;
