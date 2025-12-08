"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
	getConversationAction,
	sendMessageAction,
	deleteConversationAction,
} from "@/app/actions/chat";
import {
	getActiveTransactionAction,
	getPendingTransactionsAction,
	cancelTransactionAction,
	acceptTransactionAction,
	confirmTransactionAction,
} from "@/app/actions/transaction";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// --- Interfaces ---
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

interface TransactionData {
	transactionId: number;
	amount: number;
	transactionType: string;
	status: string;
	itemId: number;
	itemName?: string;
	buyerId: number;
	sellerId: number;
}

interface MessagesClientProps {
	currentUser: User;
	initialContacts: Contact[];
	initialActiveId: number | null;
}

const MessagesClient = ({
	currentUser,
	initialContacts = [],
	initialActiveId,
}: MessagesClientProps) => {
	const router = useRouter();
	const searchParams = useSearchParams();

	// 1. Initialize Contacts State
	const [contacts, setContacts] = useState<Contact[]>(() => {
		const chatWithId = searchParams.get("chatWith");
		const sellerNameParam = searchParams.get("sellerName");
		const sellerPicParam = searchParams.get("sellerPic");
		const safeContacts = initialContacts || [];

		if (chatWithId) {
			const contactId = Number(chatWithId);
			const exists = safeContacts.some((c) => c.studentId === contactId);

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
					profilePicture: sellerPicParam
						? decodeURIComponent(sellerPicParam)
						: null,
				};
				return [tempContact, ...safeContacts];
			}
		}
		return safeContacts;
	});

	const [activeContactId, setActiveContactId] = useState<number | null>(() => {
		if (initialActiveId) return initialActiveId;
		const paramId = searchParams.get("chatWith");
		if (paramId) return Number(paramId);
		if (initialContacts && initialContacts.length > 0)
			return initialContacts[0].studentId;
		return null;
	});

	const [messages, setMessages] = useState<Message[]>([]);
	const [activeTransaction, setActiveTransaction] =
		useState<TransactionData | null>(null);
	const [pendingPartnerIds, setPendingPartnerIds] = useState<Set<number>>(
		new Set()
	);

	// Loading States
	const [isActionLoading, setIsActionLoading] = useState(false);

	const [newMessage, setNewMessage] = useState(() => {
		const initialMessage = searchParams.get("initialMessage");
		const refItem = searchParams.get("refItem");

		if (initialMessage) {
			return decodeURIComponent(initialMessage);
		}

		if (refItem) {
			try {
				return `Hi, I'm interested in your "${decodeURIComponent(
					refItem
				)}". Is it still available?`;
			} catch (e) {
				return "";
			}
		}
		return "";
	});

	// --- MODAL STATES ---
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showCancelModal, setShowCancelModal] = useState(false);
	const [showAcceptModal, setShowAcceptModal] = useState(false);
	const [showReceiptModal, setShowReceiptModal] = useState(false);

	const [isDeleting, setIsDeleting] = useState(false);
	const [showToast, setShowToast] = useState(false);
	const [toastMsg, setToastMsg] = useState("");

	// 2. Fetch Data
	useEffect(() => {
		const fetchData = async () => {
			const promises: Promise<
				TransactionData[] | Message[] | TransactionData | null
			>[] = [getPendingTransactionsAction(currentUser.studentId)];

			if (activeContactId) {
				promises.push(
					getConversationAction(currentUser.studentId, activeContactId)
				);
				promises.push(
					getActiveTransactionAction(currentUser.studentId, activeContactId)
				);
			}

			const results = await Promise.all(promises);
			const pendingTxs = results[0] as TransactionData[];

			const newPendingSet = new Set<number>();
			if (pendingTxs && Array.isArray(pendingTxs)) {
				pendingTxs.forEach((tx) => {
					const partnerId =
						tx.buyerId === currentUser.studentId ? tx.sellerId : tx.buyerId;
					newPendingSet.add(partnerId);
				});
			}
			setPendingPartnerIds(newPendingSet);

			if (activeContactId) {
				const msgs = results[1] as Message[];
				const transaction = results[2] as TransactionData | null;

				setMessages(msgs || []);
				setActiveTransaction(transaction);

				if (msgs && msgs.length > 0) {
					const firstMsg = msgs[0];
					const otherUser =
						firstMsg.sender?.studentId === currentUser.studentId
							? firstMsg.receiver
							: firstMsg.sender;

					if (otherUser) {
						setContacts((prev) => {
							return prev.map((c) => {
								if (c.studentId === otherUser.studentId) {
									if (c.firstName === "User" || !c.profilePicture) {
										return {
											...c,
											firstName: otherUser.firstName,
											lastName: otherUser.lastName,
											profilePicture:
												otherUser.profilePicture || c.profilePicture,
										};
									}
								}
								return c;
							});
						});
					}
				}
			}
		};

		fetchData();

		const interval = setInterval(fetchData, 3000);
		return () => clearInterval(interval);
	}, [activeContactId, currentUser.studentId]);

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newMessage.trim() || !activeContactId) return;

		const itemIdParam = searchParams.get("itemId");
		const currentItemId = itemIdParam ? Number(itemIdParam) : undefined;

		const payload = {
			senderId: currentUser.studentId,
			receiverId: activeContactId,
			messageContent: newMessage,
			messageType: "CHAT",
			isRead: false,
			itemId: currentItemId,
		};

		const savedMsg = await sendMessageAction(payload);

		if (savedMsg) {
			setMessages((prev) => [...prev, savedMsg]);
			setNewMessage("");
		} else {
			alert("Failed to send message");
		}
	};

	const handleRequestDelete = () => {
		if (
			activeTransaction &&
			activeTransaction.status.toLowerCase() !== "cancelled" &&
			activeTransaction.status.toLowerCase() !== "completed"
		) {
			alert(
				`Cannot delete this conversation because there is an active transaction (${activeTransaction.status}). Please complete or cancel the transaction first.`
			);
			return;
		}
		setShowDeleteModal(true);
	};

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
			setActiveTransaction(null);

			setToastMsg("Conversation deleted.");
			setShowToast(true);
			setTimeout(() => setShowToast(false), 3000);

			setShowDeleteModal(false);
			setIsDeleting(false);

			if (updatedContacts.length > 0) {
				const nextId = updatedContacts[0].studentId;
				setActiveContactId(nextId);
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

	// --- ACTION HANDLERS ---
	const executeAction = async (actionType: "ACCEPT" | "CONFIRM" | "CANCEL") => {
		if (!activeTransaction) return;
		setIsActionLoading(true);

		let res;
		let sysMsg = "";

		if (actionType === "CANCEL") {
			res = await cancelTransactionAction(
				activeTransaction.transactionId,
				currentUser.studentId
			);
			sysMsg = `Transaction for "${activeTransaction.itemName}" was cancelled.`;
		} else if (actionType === "ACCEPT") {
			res = await acceptTransactionAction(
				activeTransaction.transactionId,
				currentUser.studentId
			);
			sysMsg = `Seller accepted the order for "${activeTransaction.itemName}". Please arrange the meetup.`;
		} else if (actionType === "CONFIRM") {
			res = await confirmTransactionAction(
				activeTransaction.transactionId,
				currentUser.studentId
			);
			sysMsg = `Buyer confirmed receipt of "${activeTransaction.itemName}". Transaction Complete.`;
		}

		if (res?.success) {
			const newStatus =
				actionType === "CANCEL"
					? "Cancelled"
					: actionType === "ACCEPT"
					? activeTransaction.amount > 0
						? "To Meet"
						: "To Pay"
					: "Completed";
			setActiveTransaction({ ...activeTransaction, status: newStatus });

			await sendMessageAction({
				senderId: currentUser.studentId,
				receiverId: activeContactId!,
				messageContent: sysMsg,
				messageType: "SYSTEM",
				isRead: false,
			});

			setToastMsg("Success!");
			setShowToast(true);
			setTimeout(() => setShowToast(false), 3000);

			// Close all modals
			setShowCancelModal(false);
			setShowAcceptModal(false);
			setShowReceiptModal(false);
		} else {
			alert("Action failed.");
		}
		setIsActionLoading(false);
	};

	const activeContact = contacts.find((c) => c.studentId === activeContactId);

	const getAvatarUrl = (photo: string | null) => {
		return photo ? `${API_BASE_URL}/api/students/images/${photo}` : null;
	};

	const getTransactionStatusColor = (status: string) => {
		switch (status?.toLowerCase()) {
			case "completed":
				return "bg-green-50 border-green-200 text-green-800";
			case "pending":
				return "bg-yellow-50 border-yellow-200 text-yellow-800";
			case "to pay":
			case "to meet":
				return "bg-blue-50 border-blue-200 text-blue-800";
			case "cancelled":
				return "bg-red-50 border-red-200 text-red-800";
			default:
				return "bg-gray-50 border-gray-200 text-gray-800";
		}
	};

	const isBuyer = activeTransaction?.buyerId === currentUser.studentId;
	const status = activeTransaction?.status.toLowerCase();

	const isDeleteDisabled = !!(
		activeTransaction &&
		activeTransaction.status.toLowerCase() !== "cancelled" &&
		activeTransaction.status.toLowerCase() !== "completed"
	);

	return (
		<div className="flex flex-col lg:flex-row gap-6 h-[calc(90vh-140px)] relative">
			{/* Toast Notification */}
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
						<p className="text-sm">{toastMsg}</p>
					</div>
				</div>
			)}

			{/* --- CONFIRMATION MODALS --- */}

			{/* 1. Delete Chat Modal */}
			{showDeleteModal && (
				<div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
					<div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full animate-fade-in-up">
						<div className="flex items-center gap-3 text-red-900 mb-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								fill="currentColor"
								className="bi bi-trash-fill"
								viewBox="0 0 16 16">
								<path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
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

			{/* 2. Cancel Transaction Modal */}
			{showCancelModal && (
				<div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
					<div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full animate-scale-up">
						<div className="flex items-center gap-3 text-red-900 mb-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								fill="currentColor"
								className="bi bi-x-circle-fill"
								viewBox="0 0 16 16">
								<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
							</svg>
							<h3 className="text-xl font-bold">Cancel Transaction?</h3>
						</div>
						<p className="text-gray-600 mb-2 leading-relaxed">
							Are you sure you want to cancel the request for{" "}
							<span className="font-bold text-gray-900">
								{activeTransaction?.itemName || "this item"}
							</span>
							?
						</p>
						<p className="text-xs text-gray-400 mb-6">
							If you paid via Wallet, funds will be refunded to your account
							immediately.
						</p>
						<div className="flex gap-3 justify-end">
							<button
								onClick={() => setShowCancelModal(false)}
								className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
								Keep it
							</button>
							<button
								onClick={() => executeAction("CANCEL")}
								disabled={isActionLoading}
								className="px-5 py-2.5 rounded-lg bg-red-900 text-white font-semibold hover:bg-red-800 transition-colors disabled:bg-red-400">
								{isActionLoading ? "Processing..." : "Yes, Cancel"}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* 3. Accept Order Modal */}
			{showAcceptModal && (
				<div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
					<div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full animate-scale-up">
						<div className="flex items-center gap-3 text-green-700 mb-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								fill="currentColor"
								className="bi bi-check-circle-fill"
								viewBox="0 0 16 16">
								<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
							</svg>
							<h3 className="text-xl font-bold">Accept Order?</h3>
						</div>
						<p className="text-gray-600 mb-6 leading-relaxed">
							By accepting, you agree to meet with the buyer to hand over{" "}
							<span className="font-bold">{activeTransaction?.itemName}</span>.
						</p>
						<div className="flex gap-3 justify-end">
							<button
								onClick={() => setShowAcceptModal(false)}
								className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
								Cancel
							</button>
							<button
								onClick={() => executeAction("ACCEPT")}
								disabled={isActionLoading}
								className="px-5 py-2.5 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors disabled:bg-green-400">
								{isActionLoading ? "Processing..." : "Yes, Accept"}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* 4. Confirm Receipt Modal */}
			{showReceiptModal && (
				<div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
					<div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full animate-scale-up">
						<div className="flex items-center gap-3 text-blue-800 mb-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								fill="currentColor"
								className="bi bi-bag-check-fill"
								viewBox="0 0 16 16">
								<path
									fillRule="evenodd"
									d="M10.5 3.5a2.5 2.5 0 0 0-5 0V4h5zm1 0V4H15v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4h3.5v-.5a3.5 3.5 0 1 1 7 0m-.646 5.354a.5.5 0 0 0-.708-.708L7.5 10.793 6.354 9.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z"
								/>
							</svg>
							<h3 className="text-xl font-bold">Item Received?</h3>
						</div>
						<p className="text-gray-600 mb-6 leading-relaxed">
							Only confirm if you have inspected and received the item. This
							action will release the funds to the seller and cannot be undone.
						</p>
						<div className="flex gap-3 justify-end">
							<button
								onClick={() => setShowReceiptModal(false)}
								className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
								Not Yet
							</button>
							<button
								onClick={() => executeAction("CONFIRM")}
								disabled={isActionLoading}
								className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400">
								{isActionLoading ? "Processing..." : "Yes, Received"}
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
									<Image
										src={getAvatarUrl(contact.profilePicture)!}
										alt="Avatar"
										fill
										className="object-cover"
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
							<div className="grow min-w-0 flex flex-col">
								<div className="flex justify-between items-center">
									<div className="font-bold text-gray-900 truncate">
										{contact.firstName} {contact.lastName}
									</div>

									{/* --- SIDEBAR PENDING BADGE --- */}
									{pendingPartnerIds.has(contact.studentId) && (
										<span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shadow-sm">
											Pending
										</span>
									)}
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
										<Image
											src={getAvatarUrl(activeContact.profilePicture)!}
											alt="Avatar"
											fill
											className="object-cover"
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

							{/* DELETE BUTTON with Validation */}
							<button
								onClick={handleRequestDelete}
								disabled={isDeleteDisabled}
								className={`p-2 rounded-full transition-colors ${
									isDeleteDisabled
										? "text-gray-300 cursor-not-allowed"
										: "text-gray-400 hover:text-red-600 hover:bg-red-50"
								}`}
								title={
									isDeleteDisabled
										? "Cannot delete while transaction is active"
										: "Delete Conversation"
								}>
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

						{/* --- TRANSACTION NOTICE BANNER --- */}
						{activeTransaction && (
							<div
								className={`mx-6 mt-4 p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-center shadow-sm animate-fade-in gap-4 ${getTransactionStatusColor(
									activeTransaction.status
								)}`}>
								<div className="text-center sm:text-left">
									<div className="text-xs font-bold uppercase tracking-wider mb-1 opacity-80 flex items-center justify-center sm:justify-start gap-2">
										{status === "cancelled" && (
											<span className="text-red-600">⚠</span>
										)}
										{status === "completed" && (
											<span className="text-green-600">✔</span>
										)}
										{activeTransaction.status} Transaction
									</div>
									<div className="font-bold text-gray-900 text-lg">
										₱{activeTransaction.amount.toLocaleString()}
									</div>
									<div className="text-xs mt-1 font-medium text-gray-700">
										for{" "}
										<span className="font-bold">
											&quot;{activeTransaction.itemName || "Item"}&quot;
										</span>
									</div>
								</div>

								<div className="flex flex-col gap-2 min-w-[140px]">
									{status === "pending" && (
										<>
											{!isBuyer && (
												<div className="flex gap-2">
													<button
														onClick={() => setShowAcceptModal(true)}
														className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 rounded-lg transition-colors shadow-sm">
														Accept
													</button>
													<button
														onClick={() => setShowCancelModal(true)}
														className="flex-1 bg-white border border-red-200 text-red-700 hover:bg-red-50 text-xs font-bold py-2 rounded-lg transition-colors">
														Decline
													</button>
												</div>
											)}
											{isBuyer && (
												<button
													onClick={() => setShowCancelModal(true)}
													className="w-full bg-white border border-red-200 text-red-700 hover:bg-red-50 text-xs font-bold py-2 rounded-lg transition-colors">
													Cancel Request
												</button>
											)}
										</>
									)}

									{(status === "to meet" || status === "to pay") && (
										<>
											{isBuyer ? (
												<button
													onClick={() => setShowReceiptModal(true)}
													className="w-full bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 rounded-lg transition-colors shadow-sm">
													I Received the Item
												</button>
											) : (
												<div className="text-xs font-medium text-center italic opacity-75">
													Waiting for buyer confirmation...
												</div>
											)}
										</>
									)}

									{(status === "completed" || status === "cancelled") && (
										<div className="text-xs font-bold text-center opacity-60">
											{status === "completed"
												? "Funds Released"
												: "Funds Refunded"}
										</div>
									)}
								</div>
							</div>
						)}

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
