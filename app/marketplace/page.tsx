"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
  },
  {
    id: 2,
    title: "HP Spectre Laptop",
    category: "Electronics",
    type: "Rent",
    condition: "Used - Good",
    price: "$75/month",
    seller: "Bob Williams",
  },
  {
    id: 3,
    title: "Art History Flashcards",
    category: "Stationery",
    type: "Swap",
    condition: "New",
    price: "Negotiable",
    seller: "Charlie Davis",
  },
  {
    id: 4,
    title: "CIT Branded Hoodie",
    category: "Apparel",
    type: "Sell",
    condition: "Used - Like New",
    price: "$25.00",
    seller: "Diana Miller",
  },
  {
    id: 5,
    title: "Organic Chem Kit",
    category: "Textbooks",
    type: "Sell",
    condition: "Used - Good",
    price: "$30.00",
    seller: "Ethan White",
  },
  {
    id: 6,
    title: "NC Headphones",
    category: "Electronics",
    type: "Rent",
    condition: "Used - Like New",
    price: "$15/week",
    seller: "Fiona Green",
  },
  {
    id: 7,
    title: "Drafting Table",
    category: "Other",
    type: "Sell",
    condition: "Used - Fair",
    price: "$45.00",
    seller: "George Hall",
  },
  {
    id: 8,
    title: "Sci Calculator",
    category: "Electronics",
    type: "Sell",
    condition: "Used - Good",
    price: "$12.00",
    seller: "Hannah Lee",
  },
];

// --- Internal Component handling the logic ---
const MarketplaceContent = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Trigger Modal if URL has ?create=true
  useEffect(() => {
    if (searchParams.get("create") === "true") {
      setIsModalOpen(true);
    }
  }, [searchParams]);

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Remove the query param nicely
    router.replace("/marketplace", { scroll: false });
  };

  const handlePostItem = (e: React.FormEvent) => {
    e.preventDefault();
    closeModal();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <>
      {/* --- TOAST NOTIFICATION --- */}
      {showToast && (
        <div className="fixed top-24 right-10 z-[70] bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in-down">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-check-circle-fill"
            viewBox="0 0 16 16"
          >
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
          </svg>
          <div>
            <h4 className="font-bold">Success!</h4>
            <p className="text-sm">Your listing has been posted.</p>
          </div>
        </div>
      )}

      {/* --- MODAL (POP-UP) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          ></div>

          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl animate-fade-in-up">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold">Create New Listing</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
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
            </div>

            <div className="p-8">
              <form className="space-y-6" onSubmit={handlePostItem}>
                {/* Image Upload */}
                <div>
                  <label className="block font-bold text-sm mb-2">
                    Item Images
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors h-40">
                    <div className="text-gray-400 mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        fill="currentColor"
                        className="bi bi-cloud-arrow-up"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708z"
                        />
                        <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383m.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm">
                      Click to upload photos
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-sm mb-2">
                      Item Name
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 text-sm"
                      placeholder="e.g., Calculus Textbook"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-sm mb-2">
                      Price (CAD)
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 text-sm"
                      placeholder="e.g., 50.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-sm mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 text-sm resize-y"
                    rows={3}
                    placeholder="Details about condition, etc."
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-sm mb-2">
                      Category
                    </label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 text-sm bg-white">
                      <option>Select...</option>
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-sm mb-2">
                      Transaction
                    </label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 text-sm bg-white">
                      <option>Select...</option>
                      <option value="Sell">Sell</option>
                      <option value="Rent">Rent</option>
                      <option value="Swap">Swap</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold text-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#8B0000] text-white rounded-lg font-bold text-sm hover:bg-red-900 cursor-pointer"
                  >
                    Post Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-grow w-full max-w-[1500px] mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        {/* --- LEFT SIDEBAR: FILTERS --- */}
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
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Price Range</h3>
            </div>
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Condition</h3>
            </div>

            <button className="w-full bg-[#8B0000] text-white font-bold py-3 rounded-lg hover:bg-red-900 transition-colors shadow-sm cursor-pointer">
              Apply Filters
            </button>
          </div>
        </aside>

        {/* --- CONTENT RIGHT SIDE --- */}
        <div className="flex-grow">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Browse Marketplace
            </h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-[#8B0000] text-white px-6 py-3 rounded-full font-semibold hover:bg-red-900 transition-transform transform hover:scale-105 shadow-md cursor-pointer"
            >
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

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {listings.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col"
              >
                <div className="h-60 bg-gray-200 relative overflow-hidden">
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
                <div className="p-5 flex-grow flex flex-col">
                  <h3 className="font-bold text-xl text-gray-900 mb-2 truncate group-hover:text-red-900 transition-colors">
                    {item.title}
                  </h3>
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
                  <div className="text-[#8B0000] font-extrabold text-2xl mb-4">
                    {item.price}
                  </div>
                  <div className="mt-auto flex items-center gap-3 pt-4 border-t border-gray-100">
                    <span className="text-sm font-medium text-gray-600 hover:text-gray-900">
                      {item.seller}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

// --- MAIN PAGE WRAPPER ---
const MarketplacePage = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col font-sans text-gray-900 relative">
      <Navbar />

      {/* Suspense is required for useSearchParams */}
      <Suspense fallback={<div className="p-20 text-center">Loading...</div>}>
        <MarketplaceContent />
      </Suspense>

      <Footer />
    </div>
  );
};

export default MarketplacePage;
