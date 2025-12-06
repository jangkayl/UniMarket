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
	myListings: ListingItem[];
	otherListings: ListingItem[];
}

const MarketplaceClient = ({
	myListings,
	otherListings,
}: MarketplaceClientProps) => {
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [showToast, setShowToast] = useState(false);
	const [formTransactionType, setFormTransactionType] = useState("Sell");

	const [state, formAction, isPending] = useActionState(createItem, undefined);

	const router = useRouter();
	const searchParams = useSearchParams();

	// Filter Logic (Applies to "Browse Marketplace" section)
	const filteredListings =
		selectedCategories.length > 0
			? otherListings.filter((item) =>
					selectedCategories.includes(item.category)
			  )
			: otherListings;

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

	// Reusable Card Component
	const ItemCard = ({
		item,
		isOwner = false,
	}: {
		item: ListingItem;
		isOwner?: boolean;
	}) => (
		<Link
			key={item.id}
			href={
				isOwner
					? `/profile/edit-item/${item.id}`
					: `/marketplace/item/${item.id}`
			} // Owner goes to edit, others go to details
			className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col relative">
			{/* Edit Icon Overlay for Owners */}
			{isOwner && (
				<div className="absolute top-3 right-3 z-10 bg-white/90 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity text-gray-700">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						className="bi bi-pencil-square"
						viewBox="0 0 16 16">
						<path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
						<path
							fillRule="evenodd"
							d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
						/>
					</svg>
				</div>
			)}

			<div className="h-52 bg-gray-200 relative overflow-hidden">
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
						{isOwner ? "You" : item.seller}
					</span>
				</div>
			</div>
		</Link>
	);

	return (
		<>
			{/* Toast & Modal (Unchanged) */}
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

			{isModalOpen && (
				<div className="fixed inset-0 z-60 flex items-center justify-center p-4">
					{/* ... (Modal content identical to previous version, omitted for brevity) ... */}
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
								{/* ... Form Inputs ... */}
								{/* Copying input fields from previous version for consistency */}
								<div>
									<label className="block font-bold text-sm mb-2">
										Item Name
									</label>
									<input
										required
										name="itemName"
										type="text"
										className="w-full p-3 border border-gray-300 rounded-lg"
										placeholder="Calculus Textbook"
									/>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block font-bold text-sm mb-2">
											Category
										</label>
										<select
											name="category"
											className="w-full p-3 border border-gray-300 rounded-lg bg-white">
											{categories.map((c) => (
												<option
													key={c}
													value={c}>
													{c}
												</option>
											))}
										</select>
									</div>
									<div>
										<label className="block font-bold text-sm mb-2">
											Transaction
										</label>
										<select
											name="transactionType"
											value={formTransactionType}
											onChange={(e) => setFormTransactionType(e.target.value)}
											className="w-full p-3 border border-gray-300 rounded-lg bg-white">
											<option value="Sell">Sell</option>
											<option value="Rent">Rent</option>
											<option value="Swap">Swap</option>
										</select>
									</div>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block font-bold text-sm mb-2">
											Condition
										</label>
										<select
											name="condition"
											className="w-full p-3 border border-gray-300 rounded-lg bg-white">
											{conditions.map((c) => (
												<option
													key={c}
													value={c}>
													{c}
												</option>
											))}
										</select>
									</div>
									{formTransactionType === "Sell" && (
										<div>
											<label className="block font-bold text-sm mb-2">
												Price (PHP)
											</label>
											<input
												required
												name="price"
												type="number"
												step="0.01"
												className="w-full p-3 border border-gray-300 rounded-lg"
											/>
										</div>
									)}
									{formTransactionType === "Rent" && (
										<div>
											<label className="block font-bold text-sm mb-2">
												Rental Fee (PHP)
											</label>
											<input
												required
												name="rentalFee"
												type="number"
												step="0.01"
												className="w-full p-3 border border-gray-300 rounded-lg"
											/>
										</div>
									)}
								</div>
								{formTransactionType === "Rent" && (
									<div>
										<label className="block font-bold text-sm mb-2">
											Duration (Days)
										</label>
										<input
											required
											name="rentalDurationDays"
											type="number"
											className="w-full p-3 border border-gray-300 rounded-lg"
										/>
									</div>
								)}
								<div>
									<label className="block font-bold text-sm mb-2">
										Description
									</label>
									<textarea
										name="description"
										rows={3}
										className="w-full p-3 border border-gray-300 rounded-lg resize-y"></textarea>
								</div>

								<div className="pt-4 flex justify-end gap-3">
									<button
										type="button"
										onClick={closeModal}
										className="px-6 py-2 border rounded-lg hover:bg-gray-50">
										Cancel
									</button>
									<button
										type="submit"
										disabled={isPending}
										className="px-6 py-2 bg-[#8B0000] text-white rounded-lg hover:bg-red-900 disabled:bg-gray-400">
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

			{/* --- CONTENT START --- */}
			<div className="grow w-full max-w-[1500px] mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
				{/* FILTERS SIDEBAR */}
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
						<button className="w-full bg-[#8B0000] text-white font-bold py-3 rounded-lg hover:bg-red-900 transition-colors shadow-sm cursor-pointer">
							Apply Filters
						</button>
					</div>
				</aside>

				{/* LISTINGS AREA */}
				<div className="grow space-y-10">
					{/* Header */}
					<div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
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

					{/* --- SECTION 1: MY LISTINGS --- */}
					{myListings.length > 0 && (
						<div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
							<h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									fill="currentColor"
									className="bi bi-person-workspace text-red-900"
									viewBox="0 0 16 16">
									<path d="M4 16s-1 0-1-1 1-4 5-4 5 3 5 4 1 1 1 1h1zm4-5.95a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
									<path d="M2 1a2 2 0 0 0-2 2v9.5A1.5 1.5 0 0 0 1.5 14h.653a5.4 5.4 0 0 1 1.066-2H1V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9h-2.219c.554.654.89 1.373 1.066 2h.653a1.5 1.5 0 0 0 1.5-1.5V3a2 2 0 0 0-2-2z" />
								</svg>
								Your Posted Items
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
								{myListings.map((item) => (
									<ItemCard
										key={item.id}
										item={item}
										isOwner={true}
									/>
								))}
							</div>
						</div>
					)}

					{/* --- SECTION 2: BROWSE OTHER LISTINGS --- */}
					<div>
						<h2 className="text-xl font-bold text-gray-900 mb-4">
							Latest Listings
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
							{filteredListings.length > 0 ? (
								filteredListings.map((item) => (
									<ItemCard
										key={item.id}
										item={item}
										isOwner={false}
									/>
								))
							) : (
								<div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-2xl border border-dashed border-gray-300">
									<p className="text-lg font-medium">
										No other listings found.
									</p>
									<p className="text-sm">Check back later for new items.</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default MarketplaceClient;
