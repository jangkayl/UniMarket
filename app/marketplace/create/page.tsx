"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const CreateListingPage = () => {
  // State for form fields (basic setup)
  const [transactionType, setTransactionType] = useState("Sell");

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans text-gray-900">
      <Navbar />

      <main className="flex-grow w-full max-w-[1000px] mx-auto px-6 py-10">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Listing
          </h1>
          <p className="text-gray-600 mt-2">
            Fill out the details below to list your item on UniMarket.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <form className="space-y-8">
            {/* 1. Item Images (Drag & Drop Area) */}
            <div>
              <label className="block font-bold text-gray-900 mb-2">
                Item Images
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors h-48">
                <div className="text-gray-400 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
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
                <p className="text-gray-500">
                  Drag & drop your photos here, or click to browse
                </p>
              </div>
            </div>

            {/* 2. Item Name */}
            <div>
              <label className="block font-bold text-gray-900 mb-2">
                Item Name
              </label>
              <input
                type="text"
                placeholder="e.g., Calculus 101 Textbook"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-transparent text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* 3. Description */}
            <div>
              <label className="block font-bold text-gray-900 mb-2">
                Description
              </label>
              <textarea
                rows={4}
                placeholder="Provide a detailed description of your item, including condition, features, and any relevant information."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-transparent text-gray-700 placeholder-gray-400 resize-y"
              ></textarea>
            </div>

            {/* 4. Category & Condition (Grid Layout) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-bold text-gray-900 mb-2">
                  Category
                </label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 text-gray-700 bg-white">
                  <option value="" disabled selected>
                    Select a category
                  </option>
                  <option value="textbooks">Textbooks</option>
                  <option value="electronics">Electronics</option>
                  <option value="stationery">Stationery</option>
                  <option value="apparel">Apparel</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-gray-900 mb-2">
                  Condition
                </label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 text-gray-700 bg-white">
                  <option value="" disabled selected>
                    Select condition
                  </option>
                  <option value="new">New</option>
                  <option value="like-new">Used - Like New</option>
                  <option value="good">Used - Good</option>
                  <option value="fair">Used - Fair</option>
                  <option value="poor">Used - Poor</option>
                </select>
              </div>
            </div>

            {/* 5. Transaction Type */}
            <div>
              <label className="block font-bold text-gray-900 mb-3">
                Transaction Type
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="transactionType"
                    value="Sell"
                    checked={transactionType === "Sell"}
                    onChange={() => setTransactionType("Sell")}
                    className="w-5 h-5 accent-red-900"
                  />
                  <span className="text-gray-700">Sell</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="transactionType"
                    value="Rent"
                    checked={transactionType === "Rent"}
                    onChange={() => setTransactionType("Rent")}
                    className="w-5 h-5 accent-red-900"
                  />
                  <span className="text-gray-700">Rent</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="transactionType"
                    value="Swap"
                    checked={transactionType === "Swap"}
                    onChange={() => setTransactionType("Swap")}
                    className="w-5 h-5 accent-red-900"
                  />
                  <span className="text-gray-700">Swap</span>
                </label>
              </div>
            </div>

            {/* 6. Price */}
            <div>
              <label className="block font-bold text-gray-900 mb-2">
                Price (CAD)
              </label>
              <input
                type="text"
                placeholder="e.g., 50.00"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-transparent text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* 7. Location */}
            <div>
              <label className="block font-bold text-gray-900 mb-2">
                Preferred Meetup Location
              </label>
              <input
                type="text"
                placeholder="e.g., CIT Library Entrance, Cafeteria"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-transparent text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* 8. Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                onClick={() => window.history.back()}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-[#8B0000] text-white rounded-lg font-bold hover:bg-red-900 transition-colors shadow-sm"
              >
                Post Item
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateListingPage;
