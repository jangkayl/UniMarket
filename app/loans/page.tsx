"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// --- Mock Data ---

// Data for when I am the BORROWER (requesting items from others)
const borrowerRequests = [
  {
    id: 1,
    title: "Calculus Textbook",
    counterpartyLabel: "Lender",
    counterpartyName: "Alice Smith",
    requestedOn: "2024-03-01",
    dueOn: "2024-05-15",
    status: "Approved",
    image: "/images/book_calc.jpg",
    description:
      "Standard Calculus textbook for MATH 101. Condition is slightly used but no markings.",
    pickupLocation: "Main Library Entrance",
  },
  {
    id: 2,
    title: "Graphic Design Tablet",
    counterpartyLabel: "Lender",
    counterpartyName: "Bob Johnson",
    requestedOn: "2024-03-20",
    dueOn: null,
    status: "Pending",
    image: "/images/tablet.jpg",
    description: "Wacom Intuos tablet, medium size. Comes with pen and cable.",
    pickupLocation: "Design Studio (Room 304)",
  },
  {
    id: 3,
    title: "Lab Coat",
    counterpartyLabel: "Lender",
    counterpartyName: "Charlie Brown",
    requestedOn: "2024-02-10",
    dueOn: "2024-03-10",
    status: "Completed",
    image: "/images/lab_coat.jpg",
    description: "White cotton lab coat, size Medium. Freshly laundered.",
    pickupLocation: "Science Building Lobby",
  },
  {
    id: 4,
    title: "Statistics Software License",
    counterpartyLabel: "Lender",
    counterpartyName: "Diana Ross",
    requestedOn: "2024-03-05",
    dueOn: null,
    status: "Declined",
    image: "/images/software.jpg",
    description: "1-year license key for SPSS software.",
    pickupLocation: "Digital Transfer (Email)",
  },
  {
    id: 5,
    title: "Biology Microscope",
    counterpartyLabel: "Lender",
    counterpartyName: "Eve Green",
    requestedOn: "2024-04-01",
    dueOn: null,
    status: "Pending",
    image: "/images/microscope.jpg",
    description: "Standard compound microscope with 4x, 10x, 40x objectives.",
    pickupLocation: "Bio Lab 1",
  },
];

// Data for when I am the LENDER (others requesting items from me)
const lenderRequests = [
  {
    id: 101,
    title: "Financial Calculator",
    counterpartyLabel: "Borrower",
    counterpartyName: "John Doe",
    requestedOn: "2024-04-02",
    dueOn: "2024-04-10",
    status: "Pending",
    image: "/images/calculator.jpg",
    description: "TI BA II Plus Financial Calculator. Needed for FIN 200 exam.",
    pickupLocation: "Business School Cafeteria",
  },
  {
    id: 102,
    title: "Dune Novel",
    counterpartyLabel: "Borrower",
    counterpartyName: "Jane Smith",
    requestedOn: "2024-03-15",
    dueOn: "2024-03-22",
    status: "Approved",
    image: "/images/book_dune.jpg",
    description: "Paperback copy of Dune by Frank Herbert.",
    pickupLocation: "Student Center",
  },
];

// --- Components ---

const StatusBadge = ({ status }: { status: string }) => {
  let styles = "";
  let icon = null;

  switch (status) {
    case "Approved":
      styles = "bg-[#8B0000] text-white"; // Dark Red
      icon = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          fill="currentColor"
          className="bi bi-check-circle-fill mr-1"
          viewBox="0 0 16 16"
        >
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
        </svg>
      );
      break;
    case "Pending":
      styles = "bg-yellow-100 text-yellow-800";
      icon = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          fill="currentColor"
          className="bi bi-hourglass-split mr-1"
          viewBox="0 0 16 16"
        >
          <path d="M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 14v1h1a.5.5 0 0 1 0 1h-11a.5.5 0 0 1 0-1z" />
        </svg>
      );
      break;
    case "Completed":
      styles = "bg-green-100 text-green-800";
      icon = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          fill="currentColor"
          className="bi bi-flag-fill mr-1"
          viewBox="0 0 16 16"
        >
          <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12 12 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A20 20 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a20 20 0 0 0 1.349-.476l.019-.007.004-.002h.001" />
        </svg>
      );
      break;
    case "Declined":
      styles = "bg-gray-200 text-gray-600";
      icon = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          fill="currentColor"
          className="bi bi-x-circle-fill mr-1"
          viewBox="0 0 16 16"
        >
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
        </svg>
      );
      break;
    default:
      styles = "bg-gray-200 text-gray-800";
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold flex items-center ${styles}`}
    >
      {icon}
      {status}
    </span>
  );
};

type LoanItem = {
  id: number;
  title: string;
  counterpartyLabel: string;
  counterpartyName: string;
  requestedOn: string;
  dueOn: string | null;
  status: string;
  image: string;
  description?: string;
  pickupLocation?: string;
};

const LoansPage = () => {
  const [activeTab, setActiveTab] = useState<"borrower" | "lender">("borrower");
  const [selectedLoan, setSelectedLoan] = useState<LoanItem | null>(null);

  const requests = activeTab === "borrower" ? borrowerRequests : lenderRequests;

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans text-gray-900 relative">
      <Navbar />

      {/* --- REVISED MODAL --- */}
      {selectedLoan && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedLoan(null)}
          ></div>

          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl relative z-10 overflow-y-auto max-h-[90vh] animate-fade-in-up">
            {/* Close Button */}
            <button
              onClick={() => setSelectedLoan(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors z-20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-x-lg"
                viewBox="0 0 16 16"
              >
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
              </svg>
            </button>

            <div className="p-8 space-y-8">
              {/* 1. Loan Overview Section */}
              <div className="border border-gray-100 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Loan Overview
                  </h2>
                  <StatusBadge status={selectedLoan.status} />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase mb-1">
                      Loan Amount / Value
                    </p>
                    <p className="text-xl font-bold text-gray-900">$500.00</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase mb-1">
                      Interest Rate
                    </p>
                    <p className="text-xl font-bold text-gray-900">5.5%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase mb-1">
                      Start Date
                    </p>
                    <p className="text-lg font-medium text-gray-900">
                      {selectedLoan.requestedOn}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase mb-1">
                      End Date
                    </p>
                    <p className="text-lg font-medium text-gray-900">
                      {selectedLoan.dueOn || "TBD"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase mb-1">
                      Loan ID
                    </p>
                    <p className="text-base font-medium text-gray-900">
                      UM-L-2024-{selectedLoan.id}
                    </p>
                  </div>
                  <div className="col-span-3">
                    <p className="text-xs text-gray-500 font-semibold uppercase mb-1">
                      Item
                    </p>
                    <p className="text-base font-medium text-gray-900">
                      {selectedLoan.title}
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. Parties Involved Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Lender Card */}
                <div className="border border-gray-100 rounded-xl p-8 flex flex-col items-center text-center shadow-sm">
                  <p className="text-gray-500 font-medium mb-4">Lender</p>
                  <div className="w-20 h-20 bg-gray-200 rounded-full mb-3 overflow-hidden flex items-center justify-center">
                    {/* Placeholder Avatar */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      className="w-12 h-12 text-gray-400"
                      viewBox="0 0 16 16"
                    >
                      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {activeTab === "borrower"
                      ? selectedLoan.counterpartyName
                      : "Jessica Lim (Me)"}
                  </h3>
                  <div className="flex items-center gap-1 mb-3">
                    <span className="text-sm text-gray-500">Trust Score:</span>
                    <span className="text-sm font-bold text-yellow-500">
                      920
                    </span>
                  </div>
                  <span className="bg-[#8B0000] text-white text-[10px] font-bold px-3 py-1 rounded-full mb-6 flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      fill="currentColor"
                      className="bi bi-check-circle-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                    </svg>
                    Verified Student
                  </span>
                  <div className="flex gap-3 w-full">
                    <button className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 flex items-center justify-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7 3.582 7 8 7M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 1a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
                      </svg>
                      Message
                    </button>
                    <button className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 flex items-center justify-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                      </svg>
                      Profile
                    </button>
                  </div>
                </div>

                {/* Borrower Card */}
                <div className="border border-gray-100 rounded-xl p-8 flex flex-col items-center text-center shadow-sm">
                  <p className="text-gray-500 font-medium mb-4">Borrower</p>
                  <div className="w-20 h-20 bg-gray-200 rounded-full mb-3 overflow-hidden flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      className="w-12 h-12 text-gray-400"
                      viewBox="0 0 16 16"
                    >
                      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {activeTab === "lender"
                      ? selectedLoan.counterpartyName
                      : "Jessica Lim (Me)"}
                  </h3>
                  <div className="flex items-center gap-1 mb-3">
                    <span className="text-sm text-gray-500">Trust Score:</span>
                    <span className="text-sm font-bold text-yellow-500">
                      780
                    </span>
                  </div>
                  <span className="bg-[#8B0000] text-white text-[10px] font-bold px-3 py-1 rounded-full mb-6 flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      fill="currentColor"
                      className="bi bi-check-circle-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                    </svg>
                    Verified Student
                  </span>
                  <div className="flex gap-3 w-full">
                    <button className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 flex items-center justify-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7 3.582 7 8 7M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 1a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
                      </svg>
                      Message
                    </button>
                    <button className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 flex items-center justify-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                      </svg>
                      Profile
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. Repayment Schedule Section */}
              <div className="border border-gray-100 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6">
                  Repayment Schedule
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-600 font-bold uppercase text-xs">
                      <tr>
                        <th className="px-6 py-3 rounded-l-lg">Installment</th>
                        <th className="px-6 py-3">Due Date</th>
                        <th className="px-6 py-3">Amount</th>
                        <th className="px-6 py-3 text-right rounded-r-lg">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      <tr>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          1
                        </td>
                        <td className="px-6 py-4 text-gray-500">2024-04-15</td>
                        <td className="px-6 py-4 font-medium">$171.88</td>
                        <td className="px-6 py-4 text-right">
                          <span className="bg-[#8B0000] text-white text-xs font-bold px-3 py-1 rounded-full">
                            Paid
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          2
                        </td>
                        <td className="px-6 py-4 text-gray-500">2024-05-15</td>
                        <td className="px-6 py-4 font-medium">$171.88</td>
                        <td className="px-6 py-4 text-right">
                          <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full flex items-center justify-end gap-1 ml-auto w-fit">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="10"
                              height="10"
                              fill="currentColor"
                              className="bi bi-clock"
                              viewBox="0 0 16 16"
                            >
                              <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
                              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0" />
                            </svg>
                            Upcoming
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          3
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {selectedLoan.dueOn || "2024-06-15"}
                        </td>
                        <td className="px-6 py-4 font-medium">$171.88</td>
                        <td className="px-6 py-4 text-right">
                          <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full flex items-center justify-end gap-1 ml-auto w-fit">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="10"
                              height="10"
                              fill="currentColor"
                              className="bi bi-clock"
                              viewBox="0 0 16 16"
                            >
                              <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
                              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0" />
                            </svg>
                            Upcoming
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="flex-grow w-full max-w-[1400px] mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Borrow/Loan Requests
        </h1>

        {/* --- Tab Switcher --- */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-10 max-w-2xl">
          <button
            onClick={() => setActiveTab("borrower")}
            className={`flex-1 py-3 rounded-md text-sm font-bold transition-all ${
              activeTab === "borrower"
                ? "bg-[#8B0000] text-white shadow-md"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Requests as Borrower
          </button>
          <button
            onClick={() => setActiveTab("lender")}
            className={`flex-1 py-3 rounded-md text-sm font-bold transition-all ${
              activeTab === "lender"
                ? "bg-[#8B0000] text-white shadow-md"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Requests as Lender
          </button>
        </div>

        {/* --- Requests Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
            >
              {/* Image Header */}
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    fill="currentColor"
                    className="bi bi-image"
                    viewBox="0 0 16 16"
                  >
                    <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                    <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12" />
                  </svg>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 flex-grow flex flex-col gap-3">
                <h3 className="text-xl font-bold text-gray-900">{req.title}</h3>

                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium text-gray-500">
                      {req.counterpartyLabel}:{" "}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {req.counterpartyName}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium text-gray-500">
                      Requested On:{" "}
                    </span>
                    {req.requestedOn}
                  </p>
                  {req.dueOn && (
                    <p>
                      <span className="font-medium text-gray-500">
                        Due On:{" "}
                      </span>
                      {req.dueOn}
                    </p>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="mt-auto pt-6 flex items-center justify-between">
                  <StatusBadge status={req.status} />

                  <button
                    onClick={() => setSelectedLoan(req)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {requests.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">
              No requests found in this category.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default LoansPage;
