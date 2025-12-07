import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import EditItemForm from "../../../components/EditItemForm";

// Match DTO structure
interface EditItemData {
	itemId: number;
	itemName: string;
	description: string;
	price: number | null;
	category: string;
	condition: string;
	transactionType: string;
	rentalFee: number | null;
	rentalDurationDays: number | null;
	itemPhoto: string | null; // New String field
	itemPhotoId: number | null; // Old ID field
	sellerId: number;
}

const EditItemPage = async ({
	params,
}: {
	params: Promise<{ id: string }>;
}) => {
	const { id } = await params;

	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get("session");
	if (!sessionCookie) redirect("/login");

	const user = JSON.parse(sessionCookie.value);

	let item: EditItemData | null = null;
	try {
		const res = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/items/getItemById/${id}`,
			{
				cache: "no-store",
			}
		);
		if (res.ok) {
			item = await res.json();
		}
	} catch (e) {
		console.error("Failed to fetch item for edit:", e);
	}

	if (!item) return notFound();

	if (Number(item.sellerId) !== Number(user.studentId)) {
		return (
			<div className="min-h-screen flex flex-col bg-white">
				<Navbar />
				<div className="grow flex items-center justify-center flex-col text-center p-8">
					<h1 className="text-2xl font-bold text-red-900 mb-2">Unauthorized</h1>
					<p className="text-gray-600">
						You do not have permission to edit this item.
					</p>
					<Link
						href="/profile"
						className="mt-4 text-blue-600 underline">
						Back to Profile
					</Link>
				</div>
				<Footer />
			</div>
		);
	}

	// Logic to determine the correct Image URL
	let imageUrl = null;
	if (item.itemPhoto) {
		imageUrl = `${process.env.SPRING_BOOT_API_URL}/api/items/images/${item.itemPhoto}`;
	} else if (item.itemPhotoId) {
		imageUrl = `${process.env.SPRING_BOOT_API_URL}/uploads/items/${item.itemPhotoId}`;
	}

	return (
		<div className="bg-gray-50 min-h-screen flex flex-col font-sans text-gray-900">
			<Navbar />
			<main className="grow w-full max-w-[1200px] mx-auto px-6 py-10">
				<div className="mb-6">
					<Link
						href="/profile"
						className="text-gray-500 hover:text-red-900 flex items-center gap-2 text-sm font-medium">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							fill="currentColor"
							className="bi bi-arrow-left"
							viewBox="0 0 16 16">
							<path
								fillRule="evenodd"
								d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
							/>
						</svg>
						Back to Profile
					</Link>
				</div>

				<EditItemForm
					item={item}
					imageUrl={imageUrl}
				/>
			</main>
			<Footer />
		</div>
	);
};

export default EditItemPage;
