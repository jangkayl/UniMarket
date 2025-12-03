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
  switch (status) {
    case "Approved":
      styles = "bg-[#8B0000] text-white"; // Dark Red
      break;
    case "Pending":
      styles = "bg-orange-100 text-orange-600 font-bold";
      break;
    case "Completed":
      styles = "border border-gray-400 text-gray-600";
      break;
    case "Declined":
      styles = "bg-red-600 text-white"; // Bright Red
      break;
    default:
      styles = "bg-gray-200 text-gray-800";
  }

  return (
    <span className={`px-4 py-1 rounded-full text-xs font-bold ${styles}`}>
      {status}
    </span>
  );
};

// Define a type for our loan item to make TypeScript happy
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

  // Select data based on active tab
  const requests = activeTab === "borrower" ? borrowerRequests : lenderRequests;

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans text-gray-900 relative">
      <Navbar />

      {/* --- DETAILS MODAL --- */}
      {selectedLoan && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedLoan(null)}
          ></div>

          {/* Modal Card */}
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-fade-in-up">
            {/* Header Image Area */}
            <div className="h-48 bg-gray-100 relative">
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  fill="currentColor"
                  className="bi bi-image"
                  viewBox="0 0 16 16"
                >
                  <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                  <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12" />
                </svg>
              </div>
              {/* Close Button */}
              <button
                onClick={() => setSelectedLoan(null)}
                className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full text-gray-600 transition-colors shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-x-lg"
                  viewBox="0 0 16 16"
                >
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                </svg>
              </button>
            </div>

            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedLoan.title}
                </h2>
                <StatusBadge status={selectedLoan.status} />
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">
                    {selectedLoan.counterpartyLabel}
                  </p>
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-person-circle text-gray-400"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                      <path
                        fillRule="evenodd"
                        d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                      />
                    </svg>
                    {selectedLoan.counterpartyName}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Requested On</p>
                    <p className="font-medium">{selectedLoan.requestedOn}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Due Date</p>
                    <p className="font-medium">{selectedLoan.dueOn || "N/A"}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Description</p>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {selectedLoan.description || "No description provided."}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Pickup Location</p>
                  <p className="text-gray-700 text-sm font-medium flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      fill="currentColor"
                      className="bi bi-geo-alt-fill text-red-900"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
                    </svg>
                    {selectedLoan.pickupLocation || "TBD"}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button className="flex-1 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                  Message {selectedLoan.counterpartyLabel}
                </button>
                {activeTab === "lender" &&
                  selectedLoan.status === "Pending" && (
                    <button className="flex-1 py-3 bg-[#8B0000] text-white rounded-lg font-semibold hover:bg-red-900 transition-colors shadow-md">
                      Approve Request
                    </button>
                  )}
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
