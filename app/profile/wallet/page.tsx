"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// --- Mock Data ---
const transactions = [
  {
    id: 1,
    date: "2024-07-28",
    description: "Marketplace Purchase: Textbook",
    amount: "-₱45.00",
    status: "Completed",
    type: "debit",
  },
  {
    id: 2,
    date: "2024-07-27",
    description: "Wallet Top-up",
    amount: "+₱100.00",
    status: "Completed",
    type: "credit",
  },
  {
    id: 3,
    date: "2024-07-26",
    description: "Loan Repayment: John Doe",
    amount: "+₱25.00",
    status: "Pending",
    type: "credit",
  },
  {
    id: 4,
    date: "2024-07-25",
    description: "Withdrawal to Bank",
    amount: "-₱75.00",
    status: "Failed",
    type: "debit",
  },
  {
    id: 5,
    date: "2024-07-24",
    description: "Marketplace Sale: Old Calculator",
    amount: "+₱15.00",
    status: "Completed",
    type: "credit",
  },
];

const WalletPage = () => {
  const [balance, setBalance] = useState(125.75);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-gray-100 text-gray-600";
      case "Pending":
        return "border border-gray-300 text-gray-500";
      case "Failed":
        return "bg-[#8B0000] text-white";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans text-gray-900">
      <Navbar />

      <main className="flex-grow w-full max-w-[1400px] mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Wallet Management
        </h1>

        {/* 1. Balance Card */}
        <div className="bg-[#FFF5F5] rounded-3xl p-10 text-center mb-12 flex flex-col items-center justify-center border border-red-50">
          <p className="text-gray-600 font-medium text-lg mb-1">
            Current Balance
          </p>
          <h2 className="text-6xl font-extrabold text-gray-900 mb-8">
            ₱{balance.toFixed(2)}
          </h2>
          <div className="flex gap-4">
            <button className="bg-[#8B0000] text-white font-bold py-3 px-8 rounded-xl shadow-md hover:bg-red-900 transition-transform transform hover:scale-105">
              Add Funds
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 font-bold py-3 px-8 rounded-xl shadow-sm hover:bg-gray-50 transition-transform transform hover:scale-105">
              Withdraw Funds
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* --- LEFT COLUMN: Transactions --- */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Recent Transactions
            </h2>

            {/* Table Header (Hidden on Mobile) */}
            <div className="hidden md:grid grid-cols-4 text-sm font-bold text-gray-500 mb-4 px-2">
              <span>Date</span>
              <span className="col-span-1">Description</span>
              <span className="text-right">Amount</span>
              <span className="text-right">Status</span>
            </div>

            <div className="space-y-4">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex flex-col md:grid md:grid-cols-4 items-start md:items-center py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 px-2 rounded-lg transition-colors"
                >
                  <span className="text-sm text-gray-500 mb-1 md:mb-0">
                    {tx.date}
                  </span>
                  <span className="font-semibold text-gray-800 text-sm mb-2 md:mb-0 col-span-1">
                    {tx.description}
                  </span>
                  <span
                    className={`font-bold text-sm text-right w-full md:w-auto mb-2 md:mb-0 ${
                      tx.type === "credit" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {tx.amount}
                  </span>
                  <div className="flex justify-end w-full md:w-auto">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusBadge(
                        tx.status
                      )}`}
                    >
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 text-red-900 font-bold text-sm hover:underline">
              View All Transactions
            </button>
          </div>

          {/* --- RIGHT COLUMN: Payment Methods & Security --- */}
          <div className="space-y-8">
            {/* Payment Methods */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Payment Methods
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    {/* Placeholder Card Icon */}
                    <div className="w-10 h-6 bg-gray-200 rounded"></div>
                    <span className="font-medium text-gray-700">
                      Card ending in 1234
                    </span>
                  </div>
                  <button className="text-gray-400 hover:text-red-900 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-trash"
                      viewBox="0 0 16 16"
                    >
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                    </svg>
                  </button>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    {/* Placeholder Bank Icon */}
                    <div className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                      Bank
                    </div>
                    <span className="font-medium text-gray-700">
                      Bank Account ending in 5678
                    </span>
                  </div>
                  <button className="text-gray-400 hover:text-red-900 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-trash"
                      viewBox="0 0 16 16"
                    >
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                    </svg>
                  </button>
                </div>
              </div>
              <button className="mt-6 flex items-center gap-2 text-[#8B0000] font-bold text-sm hover:underline">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-plus-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                </svg>
                Add New Method
              </button>
            </div>

            {/* Security PIN */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Security PIN
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Set or change your security PIN for secure transactions.
              </p>
              <button className="border border-[#8B0000] text-[#8B0000] font-bold py-2 px-6 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-lock"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1" />
                </svg>
                Set/Change PIN
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WalletPage;
