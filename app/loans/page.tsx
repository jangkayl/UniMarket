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
    image: "/images/book_calc.jpg", // Replace with placeholder svg if needed
  },
  {
    id: 2,
    title: "Graphic Design Tablet",
    counterpartyLabel: "Lender",
    counterpartyName: "Bob Johnson",
    requestedOn: "2024-03-20",
    dueOn: null, // Pending requests might not have a due date yet
    status: "Pending",
    image: "/images/tablet.jpg",
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

const LoansPage = () => {
  const [activeTab, setActiveTab] = useState<"borrower" | "lender">("borrower");

  // Select data based on active tab
  const requests = activeTab === "borrower" ? borrowerRequests : lenderRequests;

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans text-gray-900">
      <Navbar />

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
                {/* Generic Placeholder SVG */}
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

                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (if no items) */}
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
