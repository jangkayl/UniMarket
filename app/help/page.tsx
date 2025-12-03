"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Data for the FAQ sections
const faqData = [
  {
    title: "Account Management",
    questions: [
      {
        q: "How do I create a UniMarket account?",
        a: "To create an account, click the 'Register' button in the top right corner. You will need a valid student email address to verify your identity.",
      },
      {
        q: "I forgot my password. How can I reset it?",
        a: "Click on 'Login' and then select 'Forgot Password?'. Follow the instructions sent to your email to reset it.",
      },
      {
        q: "How do I update my profile information?",
        a: "Go to your Settings page and select the 'Account Settings' tab to update your personal details.",
      },
    ],
  },
  {
    title: "Marketplace & Listings",
    questions: [
      {
        q: "How do I list an item for sale or rent?",
        a: "Navigate to your dashboard and click 'New Listing'. Upload photos, add a description, and set your price.",
      },
      {
        q: "How do I buy or rent an item?",
        a: "Browse the marketplace, click on an item you like, and use the 'Buy Now' or 'Rent' button to initiate a transaction.",
      },
      {
        q: "What are the fees for selling items?",
        a: "UniMarket charges a small 2% transaction fee on sold items to maintain the platform.",
      },
    ],
  },
  {
    title: "Borrowing & Loans",
    questions: [
      {
        q: "How does the peer-to-peer loan system work?",
        a: "Students can request small short-term loans. Lenders can view requests and choose to fund them based on the borrower's Trust Score.",
      },
      {
        q: "What is a Trust Score?",
        a: "Your Trust Score is a rating based on your transaction history and repayment reliability. A higher score unlocks better loan terms.",
      },
      {
        q: "What if a borrower defaults on a loan?",
        a: "Defaults affect the borrower's Trust Score significantly and may result in account suspension. UniMarket assists in mediation but is not liable for losses.",
      },
    ],
  },
  {
    title: "Technical Support",
    questions: [
      {
        q: "The app is not loading correctly. What should I do?",
        a: "Try clearing your browser cache or checking your internet connection. If the issue persists, contact support.",
      },
      {
        q: "How do I report a suspicious listing or user?",
        a: "Use the 'Report' button found on every listing page or user profile to alert our moderation team.",
      },
    ],
  },
];

// Helper Component for a Single Accordion Item
const AccordionItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-5 text-left focus:outline-none group"
      >
        <span className="font-medium text-gray-800 group-hover:text-red-900 transition-colors">
          {question}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className={`bi bi-chevron-down text-gray-400 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
          />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-40 opacity-100 pb-5" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-gray-600 text-sm leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

const HelpPage = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      <Navbar />

      {/* Hero Section Wrapper (White Background) */}
      <div className="py-16 px-6 flex flex-col items-center">
        {/* The Colored Card containing ONLY text */}
        <div className="bg-[#FFF0F0] rounded-3xl p-10 md:p-16 text-center max-w-[1200px] mx-auto mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            UniMarket Help Center & FAQ
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Find answers to common questions about buying, selling, renting,
            borrowing, and using UniMarket. Your guide to a seamless student
            marketplace experience.
          </p>
        </div>

        {/* Search Bar (Outside the colored card) */}
        <div className="relative w-full max-w-xl">
          <input
            type="text"
            placeholder="Search for answers..."
            className="w-full py-4 pl-12 pr-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-900 shadow-sm text-gray-700 bg-white"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-search"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* FAQ Sections */}
      <main className="flex-grow w-full max-w-4xl mx-auto px-6 pb-16 space-y-8">
        {faqData.map((section, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
              {section.title}
            </h2>
            <div>
              {section.questions.map((q, qIndex) => (
                <AccordionItem key={qIndex} question={q.q} answer={q.a} />
              ))}
            </div>
          </div>
        ))}

        {/* Still Need Help Section */}
        <div className="bg-[#FFF0F0] rounded-2xl p-12 text-center mt-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Still Need Help?
          </h2>
          <p className="text-gray-600 mb-8">
            Our support team is here to assist you. Contact us directly for
            personalized help.
          </p>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg shadow-sm transition-colors cursor-pointer">
            Contact Support
          </button>
        </div>

        {/* Community Guidelines Section */}
        <div className="bg-gray-50 rounded-2xl p-12 text-center border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Community Guidelines
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Learn about UniMarket&apos;s rules and expectations to ensure a safe
            and respectful community for all students.
          </p>
          <a
            href="#"
            className="text-red-900 font-bold hover:underline text-lg"
          >
            View Community Guidelines
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HelpPage;
