"use client";

import Image from "next/image";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// --- Mock Data ---
const reviews = [
  {
    id: 1,
    name: "Alice Chen",
    date: "2024-03-15",
    rating: 5.0,
    comment:
      "Smooth transaction, textbook was exactly as described and delivered on time. Highly recommended seller!",
    tag: "Sold Item: Calculus Textbook",
    tagColor: "bg-red-50 text-red-900",
    avatar: "/images/avatar1.jpg", // Placeholder path
  },
  {
    id: 2,
    name: "Ben Carter",
    date: "2024-03-10",
    rating: 4.0,
    comment:
      "Great communication and very flexible with pickup. The item was in good condition, as shown in pictures.",
    tag: "Borrowed Item: Laptop Charger",
    tagColor: "bg-orange-50 text-orange-800",
    avatar: "/images/avatar2.png",
  },
  {
    id: 3,
    name: "Chloe Davis",
    date: "2024-03-01",
    rating: 5.0,
    comment:
      "Fantastic experience! The seller was incredibly helpful and the item arrived much faster than expected. A true asset to UniMarket.",
    tag: "Sold Item: Biology Notes",
    tagColor: "bg-red-50 text-red-900",
    avatar: "/images/avatar3.png",
  },
  {
    id: 4,
    name: "David Lee",
    date: "2024-02-28",
    rating: 4.0,
    comment:
      "Good experience overall. Item was a little more used than anticipated, but still perfectly functional.",
    tag: "Swapped Item: Art Supplies",
    tagColor: "bg-gray-100 text-gray-700",
    avatar: "/images/avatar4.png",
  },
  {
    id: 5,
    name: "Eva Rodriguez",
    date: "2024-02-20",
    rating: 5.0,
    comment:
      "Excellent lender, very understanding and easy to work with. The loan process was straightforward and stress-free.",
    tag: "Loaned Item: Calculator",
    tagColor: "bg-blue-50 text-blue-900",
    avatar: "/images/avatar1.jpg",
  },
  {
    id: 6,
    name: "Frank Green",
    date: "2024-02-18",
    rating: 3.0,
    comment:
      "The item was fine, but communication was a bit slow. Still, a satisfactory exchange.",
    tag: "Bought Item: Desk Lamp",
    tagColor: "bg-green-50 text-green-900",
    avatar: "/images/avatar2.png",
  },
];

const ratingBreakdown = [
  { label: "Item Accuracy", score: 4.8 },
  { label: "Communication", score: 4.9 },
  { label: "Timeliness", score: 4.5 },
  { label: "Fairness", score: 4.6 },
];

// --- Helper Components ---

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex text-yellow-400 gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill={i < Math.floor(rating) ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          className="bi bi-star-fill"
          viewBox="0 0 16 16"
        >
          <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
        </svg>
      ))}
    </div>
  );
};

const ReviewsPage = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col font-sans text-gray-900">
      <Navbar />

      <main className="flex-grow w-full max-w-[1400px] mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Your Reviews & Ratings
          </h1>
          <p className="text-gray-500 text-lg">
            See what others are saying about your transactions and contributions
            to UniMarket.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- LEFT COLUMN: REVIEWS GRID --- */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Recent Reviews
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
                >
                  <div className="flex items-center gap-3 mb-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden relative flex-shrink-0">
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="currentColor"
                          className="bi bi-person-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{review.name}</h3>
                      <p className="text-xs text-gray-400">{review.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <StarRating rating={review.rating} />
                    <span className="text-sm text-gray-400 font-medium">
                      ({review.rating.toFixed(1)})
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-6 flex-grow leading-relaxed">
                    {review.comment}
                  </p>

                  <div className="mt-auto">
                    <span
                      className={`text-[10px] font-bold px-3 py-1.5 rounded-lg ${review.tagColor}`}
                    >
                      {review.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- RIGHT COLUMN: SIDEBAR STATS --- */}
          <div className="lg:col-span-1 space-y-8">
            {/* Overall Trust Score Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-center">
              <h3 className="font-bold text-lg text-gray-900 mb-6">
                Overall Trust Score
              </h3>
              <div className="relative w-32 h-32 mx-auto flex items-center justify-center bg-gray-100 rounded-full mb-6">
                <div className="text-center">
                  <span className="text-4xl font-extrabold text-[#8B0000]">
                    4.7
                  </span>
                  <span className="text-lg font-bold text-yellow-500">/5</span>
                </div>
              </div>

              {/* Decorative Line */}
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
                <div className="bg-[#8B0000] h-1.5 rounded-full w-[94%]"></div>
              </div>

              <p className="text-gray-500 text-sm font-medium mb-2">
                120 reviews
              </p>
              <div className="flex justify-center">
                <StarRating rating={5} />
              </div>
            </div>

            {/* Rating Breakdown Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <h3 className="font-bold text-lg text-gray-900 mb-6">
                Rating Breakdown
              </h3>
              <div className="space-y-6">
                {ratingBreakdown.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm font-semibold text-gray-800 mb-1">
                      <span>{item.label}</span>
                      <div className="flex items-center gap-1">
                        <span>{item.score}</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          fill="currentColor"
                          className="bi bi-star text-yellow-400"
                          viewBox="0 0 16 16"
                        >
                          <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className="bg-[#8B0000] h-1.5 rounded-full"
                        style={{ width: `${(item.score / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-center text-xs text-gray-400 mt-6">
                Based on 120 individual ratings
              </p>
            </div>
          </div>
        </div>

        {/* Floating Action Button / Bottom CTA */}
        <div className="flex justify-center mt-16">
          <button className="bg-[#8B0000] hover:bg-red-900 text-white font-bold py-3 px-8 rounded-full shadow-lg flex items-center gap-2 transition-transform transform hover:scale-105">
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
            Write a Review
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReviewsPage;
