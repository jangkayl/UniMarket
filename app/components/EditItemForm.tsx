"use client";

import { useState, useActionState, useEffect } from "react";
import Image from "next/image";
import { updateItem, deleteItemAction } from "@/app/actions/marketplace";
import { useRouter } from "next/navigation";

// Constants (Shared with MarketplaceClient)
const categories = [
	"Textbooks",
	"Electronics",
	"Stationery",
	"Apparel",
	"Other",
];
const conditions = ["New", "Used - Like New", "Used - Good", "Used - Fair"];

interface EditItemFormProps {
	item: {
		itemId: number;
		itemName: string;
		description: string;
		price: number | null;
		category: string;
		condition: string;
		transactionType: string;
		rentalFee: number | null;
		rentalDurationDays: number | null;
		itemPhotoId: number | null;
	} | null;
	imageUrl: string | null;
}

const EditItemForm = ({ item, imageUrl }: EditItemFormProps) => {
	const router = useRouter();

	const [transactionType, setTransactionType] = useState(
		item?.transactionType || "Sell"
	);

	const [state, formAction, isPending] = useActionState(updateItem, undefined);

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	// Redirect on Update Success
	useEffect(() => {
		if (state?.success) {
			router.push("/profile");
		}
	}, [state?.success, router]);

	// 2. Guard Clause: NOW it is safe to return early
	if (!item) {
		return (
			<div className="flex flex-col items-center justify-center p-12 text-gray-500 bg-white rounded-2xl border border-gray-200 shadow-sm">
				<p className="mb-4">Item data is missing or could not be loaded.</p>
				<button
					onClick={() => window.location.reload()}
					className="text-red-900 font-semibold hover:underline">
					Reload Page
				</button>
			</div>
		);
	}

	// Handle Delete
	const handleDelete = async () => {
		setIsDeleting(true);
		const res = await deleteItemAction(item.itemId);

		if (res?.success) {
			router.refresh();
			router.push("/profile");
		} else {
			alert(res?.message || "Failed to delete item");
			setIsDeleting(false);
			setIsDeleteModalOpen(false);
		}
	};

	return (
		<>
			<form
				action={formAction}
				className="grid grid-cols-1 lg:grid-cols-2 gap-12">
				<input
					type="hidden"
					name="itemId"
					value={item.itemId}
				/>
				<input
					type="hidden"
					name="currentPhotoId"
					value={item.itemPhotoId || ""}
				/>

				{/* --- LEFT: IMAGE PREVIEW --- */}
				<div className="space-y-4">
					<div className="w-full h-[400px] bg-white rounded-2xl border border-gray-200 overflow-hidden flex items-center justify-center relative shadow-sm">
						{imageUrl ? (
							<Image
								src={imageUrl}
								alt="Preview"
								fill
								className="object-cover"
							/>
						) : (
							<div className="text-gray-400 flex flex-col items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="64"
									height="64"
									fill="currentColor"
									className="bi bi-image"
									viewBox="0 0 16 16">
									<path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
									<path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12" />
								</svg>
								<span className="text-sm mt-2">
									Photo Editing Not Available Yet
								</span>
							</div>
						)}
					</div>

					{/* Delete Button Area */}
					<div className="pt-4 border-t border-gray-100">
						<p className="text-sm text-gray-500 mb-3 text-center">
							Need to remove this listing?
						</p>
						<button
							type="button"
							onClick={() => setIsDeleteModalOpen(true)}
							className="w-full py-3 border border-red-200 text-red-700 font-bold rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								className="bi bi-trash"
								viewBox="0 0 16 16">
								<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
								<path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
							</svg>
							Delete Listing
						</button>
					</div>
				</div>

				{/* --- RIGHT: EDIT FORM --- */}
				<div className="flex flex-col gap-6 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
					<div className="border-b border-gray-100 pb-4 mb-2">
						<h2 className="text-2xl font-bold text-gray-900">Edit Listing</h2>
						<p className="text-sm text-gray-500">
							Update details for your item.
						</p>
					</div>

					{/* Name */}
					<div>
						<label className="block font-bold text-sm mb-2">Item Name</label>
						<input
							name="itemName"
							defaultValue={item.itemName}
							required
							className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 text-sm"
						/>
						{state?.errors?.itemName && (
							<p className="text-red-500 text-xs mt-1">
								{state.errors.itemName}
							</p>
						)}
					</div>

					{/* Category & Condition */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block font-bold text-sm mb-2">Category</label>
							<select
								name="category"
								defaultValue={item.category}
								className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 text-sm bg-white">
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
							<label className="block font-bold text-sm mb-2">Condition</label>
							<select
								name="condition"
								defaultValue={item.condition}
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

					{/* Transaction Type */}
					<div>
						<label className="block font-bold text-sm mb-2">
							Transaction Type
						</label>
						<select
							name="transactionType"
							value={transactionType}
							onChange={(e) => setTransactionType(e.target.value)}
							className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 text-sm bg-white">
							<option value="Sell">Sell</option>
							<option value="Rent">Rent</option>
							<option value="Swap">Swap</option>
						</select>
					</div>

					{/* Dynamic Price Fields */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
						{transactionType === "Sell" && (
							<div className="col-span-2">
								<label className="block font-bold text-sm mb-2">
									Selling Price (PHP)
								</label>
								<input
									name="price"
									type="number"
									step="0.01"
									defaultValue={item.price || ""}
									required
									className="w-full p-3 border border-gray-300 rounded-lg text-sm"
								/>
							</div>
						)}
						{transactionType === "Rent" && (
							<>
								<div>
									<label className="block font-bold text-sm mb-2">
										Rental Fee (PHP)
									</label>
									<input
										name="rentalFee"
										type="number"
										step="0.01"
										defaultValue={item.rentalFee || ""}
										required
										className="w-full p-3 border border-gray-300 rounded-lg text-sm"
									/>
								</div>
								<div>
									<label className="block font-bold text-sm mb-2">
										Duration (Days)
									</label>
									<input
										name="rentalDurationDays"
										type="number"
										defaultValue={item.rentalDurationDays || ""}
										required
										className="w-full p-3 border border-gray-300 rounded-lg text-sm"
									/>
								</div>
							</>
						)}
						{transactionType === "Swap" && (
							<div className="col-span-2">
								<label className="block font-bold text-sm mb-2">
									Est. Value (PHP)
								</label>
								<input
									name="price"
									type="number"
									defaultValue={item.price || ""}
									className="w-full p-3 border border-gray-300 rounded-lg text-sm"
								/>
							</div>
						)}
					</div>

					{/* Description */}
					<div>
						<label className="block font-bold text-sm mb-2">Description</label>
						<textarea
							name="description"
							defaultValue={item.description}
							rows={5}
							className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 text-sm resize-y"></textarea>
					</div>

					{/* Actions */}
					<div className="flex gap-4 pt-4">
						<button
							type="button"
							onClick={() => router.back()}
							className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-colors">
							Cancel
						</button>
						<button
							type="submit"
							disabled={isPending}
							className="flex-1 px-6 py-3 bg-[#8B0000] text-white rounded-xl font-bold hover:bg-red-900 transition-colors disabled:bg-gray-400">
							{isPending ? "Saving..." : "Save Changes"}
						</button>
					</div>

					{state?.message && (
						<p
							className={`text-center text-sm mt-2 ${
								state.success ? "text-green-600" : "text-red-500"
							}`}>
							{state.message}
						</p>
					)}
				</div>
			</form>

			{/* --- CONFIRMATION MODAL --- */}
			{isDeleteModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
					<div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full animate-fade-in-up">
						<h3 className="text-xl font-bold text-gray-900 mb-2">
							Delete Item?
						</h3>
						<p className="text-gray-500 mb-6">
							Are you sure you want to delete{" "}
							<span className="font-bold text-gray-800">
								&quot;{item.itemName}&quot;
							</span>
							? This action cannot be undone.
						</p>
						<div className="flex gap-3 justify-end">
							<button
								onClick={() => setIsDeleteModalOpen(false)}
								className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
								Cancel
							</button>
							<button
								onClick={handleDelete}
								disabled={isDeleting}
								className="px-5 py-2.5 rounded-lg bg-red-900 text-white font-semibold hover:bg-red-800 transition-colors disabled:bg-red-400 flex items-center gap-2">
								{isDeleting ? "Deleting..." : "Yes, Delete"}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default EditItemForm;
