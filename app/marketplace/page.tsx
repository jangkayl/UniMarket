"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// --- Mock Data ---

const categories = [
  "Textbooks",
  "Electronics",
  "Stationery",
  "Apparel",
  "Other",
];

const listings = [
  {
    id: 1,
    title: "Calculus III Textbook",
    category: "Textbooks",
    type: "Sell",
    condition: "Used - Like New",
    price: "$50.00",
    seller: "Alice Johnson",
    image: "/images/book_calc.jpg",
    avatar: "/images/avatar1.png",
  },
  {
    id: 2,
    title: "HP Spectre Laptop (i7, 16GB)",
    category: "Electronics",
    type: "Rent",
    condition: "Used - Good",
    price: "$75/month",
    seller: "Bob Williams",
    image: "/images/laptop_hp.jpg",
    avatar: "/images/avatar2.png",
  },
  {
    id: 3,
    title: "Art History Flashcards Set",
    category: "Stationery",
    type: "Swap",
    condition: "New",
    price: "Negotiable",
    seller: "Charlie Davis",
    image: "/images/flashcards.jpg",
    avatar: "/images/avatar3.png",
  },
  {
    id: 4,
    title: "CIT Branded Hoodie",
    category: "Apparel",
    type: "Sell",
    condition: "Used - Like New",
    price: "$25.00",
    seller: "Diana Miller",
    image: "/images/hoodie.jpg",
    avatar: "/images/avatar4.png",
  },
  {
    id: 5,
    title: "Organic Chemistry Model Kit",
    category: "Textbooks",
    type: "Sell",
    condition: "Used - Good",
    price: "$30.00",
    seller: "Ethan White",
    image: "/images/chem_kit.jpg",
    avatar: "/images/avatar5.png",
  },
  {
    id: 6,
    title: "Noise-Cancelling Headphones",
    category: "Electronics",
    type: "Rent",
    condition: "Used - Like New",
    price: "$15/week",
    seller: "Fiona Green",
    image: "/images/headphones.jpg",
    avatar: "/images/avatar6.png",
  },
  {
    id: 7,
    title: "Drafting Table",
    category: "Other",
    type: "Sell",
    condition: "Used - Fair",
    price: "$45.00",
    seller: "George Hall",
    image: "/images/table.jpg",
    avatar: "/images/avatar7.png",
  },
  {
    id: 8,
    title: "Scientific Calculator",
    category: "Electronics",
    type: "Sell",
    condition: "Used - Good",
    price: "$12.00",
    seller: "Hannah Lee",
    image: "/images/calculator.jpg",
    avatar: "/images/avatar1.png",
  },
];

const MarketplacePage = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans text-gray-900">
      <Navbar />

      <main className="flex-grow w-full max-w-[1500px] mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        {/* --- LEFT SIDEBAR: FILTERS --- */}
        {/* UPDATED: Increased top to 'top-32' to clear the Navbar, adjusted height calculation */}
        <aside className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-32 lg:h-[calc(100vh-10rem)] overflow-y-auto scrollbar-hide self-start">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Filters</h2>

            {/* Categories */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-800">Categories</h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  fill="currentColor"
                  className="bi bi-chevron-up"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"
                  />
                </svg>
              </div>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="w-4 h-4 rounded border-gray-300 text-red-900 focus:ring-red-900"
                    />
                    <span className="text-gray-600 text-sm">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="my-6 border-gray-100" />

            {/* Price Range */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-800">Price Range</h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  fill="currentColor"
                  className="bi bi-chevron-down text-gray-400"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                  />
                </svg>
              </div>
            </div>

            <hr className="my-6 border-gray-100" />

            {/* Condition */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-800">Condition</h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  fill="currentColor"
                  className="bi bi-chevron-down text-gray-400"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                  />
                </svg>
              </div>
            </div>

            <hr className="my-6 border-gray-100" />

            {/* Listing Type */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-800">Listing Type</h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  fill="currentColor"
                  className="bi bi-chevron-down text-gray-400"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                  />
                </svg>
              </div>
            </div>

            <button className="w-full bg-[#8B0000] text-white font-bold py-3 rounded-lg hover:bg-red-900 transition-colors shadow-sm cursor-pointer">
              Apply Filters
            </button>
          </div>
        </aside>

        {/* --- MAIN CONTENT AREA --- */}
        <div className="flex-grow">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Browse Marketplace
            </h1>
            <button className="flex items-center gap-2 bg-[#8B0000] text-white px-6 py-3 rounded-full font-semibold hover:bg-red-900 transition-transform transform hover:scale-105 shadow-md cursor-pointer">
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
              Post Item
            </button>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {listings.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col"
              >
                {/* Image Area */}
                <div className="h-60 bg-gray-200 relative overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                    {/* Placeholder Icon */}
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

                <div className="p-5 flex-grow flex flex-col">
                  {/* Title */}
                  <h3 className="font-bold text-xl text-gray-900 mb-2 truncate group-hover:text-red-900 transition-colors">
                    {item.title}
                  </h3>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                      {item.category}
                    </span>
                    <span className="px-3 py-1 bg-red-50 text-red-800 text-xs font-semibold rounded-full">
                      {item.type}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                      {item.condition}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="text-[#8B0000] font-extrabold text-2xl mb-4">
                    {item.price}
                  </div>

                  {/* Seller Info */}
                  <div className="mt-auto flex items-center gap-3 pt-4 border-t border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        className="w-full h-full p-1 text-gray-500"
                        viewBox="0 0 16 16"
                      >
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                        <path
                          fillRule="evenodd"
                          d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-600 hover:text-gray-900">
                      {item.seller}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MarketplacePage;
