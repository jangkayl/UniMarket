"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// --- Mock Data ---
const initialContacts = [
  {
    id: 1,
    name: "Libron James",
    status: "Online",
    lastMessage: "Is the textbook still available?",
    time: "10:30 AM",
    unread: 2,
    avatar: "/images/avatar1.jpg", // You can use placeholders if these don't exist
    isActive: true,
  },
  {
    id: 2,
    name: "Ikar Mikiriki",
    status: "Offline",
    lastMessage: "Thanks for the notes!",
    time: "Yesterday",
    unread: 0,
    avatar: "/images/avatar2.png",
    isActive: false,
  },
  {
    id: 3,
    name: "Nilo Butay",
    status: "Online",
    lastMessage: "Meet at library?",
    time: "Monday",
    unread: 1,
    avatar: "/images/avatar3.png",
    isActive: false,
  },
  {
    id: 4,
    name: "Ma. Cathy Fukiko",
    status: "Away",
    lastMessage: "Sure, let me know.",
    time: "Last Week",
    unread: 0,
    avatar: "/images/avatar4.png",
    isActive: false,
  },
];

const initialMessages = [
  {
    id: 1,
    sender: "them",
    text: "Hi! Is the 'Calculus Made Easy' textbook still available for sale?",
    time: "10:28 AM",
  },
  {
    id: 2,
    sender: "me",
    text: "Yes, it is! Are you interested?",
    time: "10:30 AM",
  },
];

const MessagesPage = () => {
  const [contacts, setContacts] = useState(initialContacts);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsgObj = {
      id: messages.length + 1,
      sender: "me",
      text: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMsgObj]);
    setNewMessage("");
  };

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans text-gray-900">
      <Navbar />

      <main className="flex-grow w-full max-w-[1400px] mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>

        <div className="flex flex-col lg:flex-row gap-6 h-[700px]">
          {/* --- LEFT SIDEBAR: Contact List --- */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            {/* Search (Optional enhancement not in image, but good for UI) */}
            {/* <input type="text" placeholder="Search messages..." className="p-3 rounded-xl border border-gray-200 bg-gray-50" /> */}

            <div className="flex-grow overflow-y-auto pr-2 space-y-2">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-colors ${
                    contact.isActive
                      ? "bg-[#FFF0F0]"
                      : "hover:bg-gray-50 bg-white"
                  }`}
                >
                  {/* Avatar Placeholder */}
                  <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden flex-shrink-0 relative">
                    {/* Replace src with contact.avatar if you have images */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      className="w-full h-full text-gray-500 bg-gray-200 p-2"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                      <path
                        fillRule="evenodd"
                        d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                      />
                    </svg>
                    {/* Online Status Dot */}
                    {contact.status === "Online" && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>

                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-gray-900 truncate">
                        {contact.name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {contact.time}
                      </span>
                    </div>
                    <p
                      className={`text-sm truncate ${
                        contact.isActive
                          ? "text-gray-800 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {contact.lastMessage}
                    </p>
                  </div>

                  {contact.unread > 0 && (
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-xs font-bold text-gray-900">
                      {contact.unread}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* --- RIGHT AREA: Chat Window --- */}
          <div className="w-full lg:w-2/3 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col overflow-hidden h-full">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="w-full h-full text-gray-500 bg-gray-200 p-2"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                    <path
                      fillRule="evenodd"
                      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                    />
                  </svg>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Libron James</h2>
                  <p className="text-xs text-green-600 font-medium">Online</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  className="bi bi-three-dots"
                  viewBox="0 0 16 16"
                >
                  <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
                </svg>
              </button>
            </div>

            {/* Messages Stream */}
            <div className="flex-grow p-6 overflow-y-auto space-y-6 bg-white">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === "me" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === "me"
                        ? "bg-[#8B0000] text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-xs text-gray-400 mt-1 px-1">
                    {msg.time}
                  </span>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-3"
              >
                {/* Attachment Icon */}
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-paperclip"
                    viewBox="0 0 16 16"
                  >
                    <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0z" />
                  </svg>
                </button>

                {/* Input Field */}
                <div className="flex-grow relative">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="w-full py-3 pl-4 pr-10 rounded-full border border-gray-200 focus:outline-none focus:border-red-800 focus:ring-1 focus:ring-red-800 bg-white"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  {/* Emoji Icon inside input */}
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      className="bi bi-emoji-smile"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                      <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.5 3.5 0 0 0 8 11.5a3.5 3.5 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5" />
                    </svg>
                  </button>
                </div>

                {/* Send Button */}
                <button
                  type="submit"
                  className="w-10 h-10 rounded-full bg-[#8B0000] text-white flex items-center justify-center hover:bg-red-900 transition-colors shadow-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    className="bi bi-send-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MessagesPage;
