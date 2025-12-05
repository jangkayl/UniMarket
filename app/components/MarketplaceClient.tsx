"use client";

import { useState, useEffect, useActionState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createItem } from "@/app/actions/marketplace";

const categories = [
	"Textbooks",
	"Electronics",
	"Stationery",
	"Apparel",
	"Other",
];

const conditions = ["New", "Used - Like New", "Used - Good", "Used - Fair"];

export interface ListingItem {
	id: number;
	title: string;
	category: string;
	type: string;
	condition: string;
	price: string;
	seller: string;
	image: string | null;
}

interface MarketplaceClientProps {
	dbListings: ListingItem[];
}

const MarketplaceClient = ({ dbListings }: MarketplaceClientProps) => {
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [showToast, setShowToast] = useState(false);
	const [formTransactionType, setFormTransactionType] = useState("Sell");

	const [state, formAction, isPending] = useActionState(createItem, undefined);

	const router = useRouter();
	const searchParams = useSearchParams();

	// FIXED: Only use data fetched from the database, no mocks.
	const allListings = dbListings;

	// Filter Logic
	const filteredListings =
		selectedCategories.length > 0
			? allListings.filter((item) => selectedCategories.includes(item.category))
			: allListings;

	// Effect: Open Modal from URL
	useEffect(() => {
		if (searchParams.get("create") === "true") {
			const timer = setTimeout(() => {
				setIsModalOpen(true);
			}, 0);
			return () => clearTimeout(timer);
		}
	}, [searchParams]);

	// Effect: Close Modal & Show Toast on Success
	useEffect(() => {
		if (state?.success) {
			const t1 = setTimeout(() => {
				setIsModalOpen(false);
				router.replace("/marketplace", { scroll: false });
				setShowToast(true);
			}, 0);

			const t2 = setTimeout(() => {
				setShowToast(false);
			}, 3000);

			return () => {
				clearTimeout(t1);
				clearTimeout(t2);
			};
		}
	}, [state?.success, router]);

	const toggleCategory = (cat: string) => {
		if (selectedCategories.includes(cat)) {
			setSelectedCategories(selectedCategories.filter((c) => c !== cat));
		} else {
			setSelectedCategories([...selectedCategories, cat]);
		}
	};

	const closeModal = () => {
		setIsModalOpen(false);
		router.replace("/marketplace", { scroll: false });
	};

	return (
		<>
			{/* --- TOAST NOTIFICATION --- */}
			{showToast && (
				<div className="fixed top-24 right-10 z-70 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in-down">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						fill="currentColor"
						className="bi bi-check-circle-fill"
						viewBox="0 0 16 16">
						<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
					</svg>
					<div>
						<h4 className="font-bold">Success!</h4>
						<p className="text-sm">
							{state?.message || "Item posted successfully!"}
						</p>
					</div>
				</div>
			)}

			{/* --- MODAL (POP-UP) --- */}
			{isModalOpen && (
				<div className="fixed inset-0 z-60 flex items-center justify-center p-4">
					<div
						className="absolute inset-0 bg-black/50 backdrop-blur-sm"
						onClick={closeModal}></div>

					<div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl animate-fade-in-up">
						<div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
							<h2 className="text-2xl font-bold">Create New Listing</h2>
							<button
								onClick={closeModal}
								className="text-gray-400 hover:text-gray-600 transition-colors">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									fill="currentColor"
									className="bi bi-x-lg"
									viewBox="0 0 16 16">
									<path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
								</svg>
							</button>
						</div>

						<div className="p-8">
							<form
								className="space-y-6"
								action={formAction}>
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
												viewBox="0 0 16 16">
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
											name="itemName"
											type="text"
											className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 text-sm"
											placeholder="e.g., Calculus Textbook"
										/>
									</div>
									<div>
										<label className="block font-bold text-sm mb-2">
											Category
										</label>
										<select
											name="category"
											className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 text-sm bg-white">
											<option value="">Select...</option>
											{categories.map((c) => (
												<option
													key={c}
													value={c}>
													{c}
												</option>
											))}
										</select>
									</div>
								</div>

								<div>
									<label className="block font-bold text-sm mb-2">
										Description
									</label>
									<textarea
										name="description"
										className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 text-sm resize-y"
										rows={3}
										placeholder="Describe the item's condition, defects, or specs..."></textarea>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block font-bold text-sm mb-2">
											Transaction Type
										</label>
										<select
											name="transactionType"
											className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 text-sm bg-white"
											value={formTransactionType}
											onChange={(e) => setFormTransactionType(e.target.value)}>
											<option value="Sell">Sell</option>
											<option value="Rent">Rent</option>
											<option value="Swap">Swap</option>
										</select>
									</div>
									<div>
										<label className="block font-bold text-sm mb-2">
											Condition
										</label>
										<select
											name="condition"
											className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 text-sm bg-white">
											{conditions.map((c) => (
												<option
													key={c}
													value={c}>
													{c}
												</option>
											))}
										</select>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{formTransactionType === "Sell" && (
										<div>
											<label className="block font-bold text-sm mb-2">
												Selling Price (PHP)
											</label>
											<input
												required
												name="price"
												type="number"
												step="0.01"
												className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 text-sm"
												placeholder="e.g., 2500.00"
											/>
										</div>
									)}

									{formTransactionType === "Rent" && (
										<>
											<div>
												<label className="block font-bold text-sm mb-2">
													Rental Fee (PHP)
												</label>
												<input
													required
													name="rentalFee"
													type="number"
													step="0.01"
													className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 text-sm"
													placeholder="e.g., 500.00"
												/>
											</div>
											<div>
												<label className="block font-bold text-sm mb-2">
													Duration (Days)
												</label>
												<input
													required
													name="rentalDurationDays"
													type="number"
													className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 text-sm"
													placeholder="e.g., 7"
												/>
											</div>
										</>
									)}

									{formTransactionType === "Swap" && (
										<div className="col-span-2">
											<label className="block font-bold text-sm mb-2">
												Estimated Value (PHP)
											</label>
											<input
												name="price"
												type="number"
												className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 text-sm"
												placeholder="e.g., 1000.00 (Optional)"
											/>
										</div>
									)}
								</div>

								<div className="pt-4 flex justify-end gap-3">
									<button
										type="button"
										onClick={closeModal}
										className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold text-sm hover:bg-gray-50">
										Cancel
									</button>
									<button
										type="submit"
										disabled={isPending}
										className="px-6 py-2 bg-[#8B0000] text-white rounded-lg font-bold text-sm hover:bg-red-900 cursor-pointer disabled:bg-gray-400">
										{isPending ? "Posting..." : "Post Item"}
									</button>
								</div>
								{state?.message && !state.success && (
									<p className="text-center text-red-500 text-sm mt-2">
										{state.message}
									</p>
								)}
							</form>
						</div>
					</div>
				</div>
			)}

			<div className="grow w-full max-w-[1500px] mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
				<aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-32 lg:h-[calc(100vh-10rem)] overflow-y-auto scrollbar-hide self-start">
					<div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
						<h2 className="text-xl font-bold mb-6">Filters</h2>
						<div className="mb-6">
							<h3 className="font-semibold text-gray-800 mb-3">Categories</h3>
							<div className="space-y-2">
								{categories.map((cat) => (
									<label
										key={cat}
										className="flex items-center gap-3 cursor-pointer">
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

				<div className="grow">
					<div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
						<h1 className="text-3xl font-bold text-gray-900">
							Browse Marketplace
						</h1>
						<button
							onClick={() => setIsModalOpen(true)}
							className="flex items-center gap-2 bg-[#8B0000] text-white px-6 py-3 rounded-full font-semibold hover:bg-red-900 transition-transform transform hover:scale-105 shadow-md cursor-pointer">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								fill="currentColor"
								className="bi bi-plus-circle"
								viewBox="0 0 16 16">
								<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
								<path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
							</svg>
							Post Item
						</button>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
						{filteredListings.length > 0 ? (
							filteredListings.map((item) => (
								<Link
									key={item.id}
									href={`/marketplace/item/${item.id}`}
									className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col">
									<div className="h-60 bg-gray-200 relative overflow-hidden">
										<div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 relative">
											{item.image ? (
												<Image
													src={item.image}
													alt={item.title}
													fill
													className="object-cover"
												/>
											) : (
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="48"
													height="48"
													fill="currentColor"
													className="bi bi-image"
													viewBox="0 0 16 16">
													<path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
													<path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12" />
												</svg>
											)}
										</div>
									</div>
									<div className="p-5 grow flex flex-col">
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
								</Link>
							))
						) : (
							<div className="col-span-full text-center py-20 text-gray-500">
								<p className="text-lg font-medium">No active listings found.</p>
								<p className="text-sm">Be the first to post an item!</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default MarketplaceClient;
