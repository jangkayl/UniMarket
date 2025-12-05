import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Image from "next/image";

// Define the shape of the User object stored in the session
interface User {
	studentId: number;
	studentNumber: string;
	universityEmail: string;
	firstName: string;
	lastName: string;
	profilePicture: string | null;
	isVerified: boolean;
	accountStatus: string;
}

// --- Mock Data for Listings (Replace with API fetch later) ---
const activeListings = [
	{
		id: 1,
		title: "Calculus III Textbook",
		price: "$45.00",
		image: "/images/book_calc.jpg",
	},
	{
		id: 2,
		title: "MacBook Pro (2020)",
		price: "$800.00",
		image: "/images/laptop_mock.jpg",
	},
	{
		id: 3,
		title: "TI-84 Plus Calculator",
		price: "$60.00",
		image: "/images/calculator.jpg",
	},
];

const ProfilePage = async () => {
	// 1. Get the session cookie
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get("session");

	// 2. If no session, redirect to login (Middleware handles this usually, but safe to check)
	if (!sessionCookie) {
		redirect("/login");
	}

	// 3. Parse the user data
	const user: User = JSON.parse(sessionCookie.value);

	return (
		<div className="bg-gray-50 min-h-screen flex flex-col font-sans text-gray-900">
			<Navbar />

			<main className="grow w-full max-w-[1400px] mx-auto px-6 py-10">
				<h1 className="text-4xl font-bold text-gray-900 mb-8">My Profile</h1>

				<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
					{/* --- LEFT SIDEBAR --- */}
					<aside className="lg:col-span-1 space-y-6">
						{/* 1. Profile Card */}
						<div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm flex flex-col items-center text-center">
							<div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 mb-4 overflow-hidden relative">
								{/* Check if user has a profile picture, else show placeholder */}
								{user.profilePicture ? (
									// Assuming you serve uploaded images from an endpoint or public URL
									// You might need to prepend your backend URL here if it's a relative path
									<Image
										src={`${process.env.SPRING_BOOT_API_URL}/uploads/${user.profilePicture}`}
										alt="Profile"
										className="w-full h-full object-cover"
									/>
								) : (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="40"
										height="40"
										fill="currentColor"
										className="bi bi-person"
										viewBox="0 0 16 16">
										<path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
									</svg>
								)}
							</div>

							{/* DYNAMIC USER NAME */}
							<h2 className="text-xl font-bold text-red-900">
								{user.firstName} {user.lastName}
							</h2>

							{/* DYNAMIC STUDENT ID */}
							<p className="text-sm text-gray-500 mb-4">
								Student ID: {user.studentNumber}
							</p>

							{/* Verified Badge (Conditional) */}
							{user.isVerified ? (
								<div className="bg-yellow-400 text-gray-900 text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="12"
										height="12"
										fill="currentColor"
										className="bi bi-patch-check-fill"
										viewBox="0 0 16 16">
										<path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.896.011a2.89 2.89 0 0 0-2.924 2.924l.01.896-.636.622a2.89 2.89 0 0 0 0 4.134l.638.622-.011.896a2.89 2.89 0 0 0 2.924 2.924l.896-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.638.896-.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.896.636-.622a2.89 2.89 0 0 0 0-4.134l-.638-.622.011-.896a2.89 2.89 0 0 0-2.924-2.924l-.896.01zm.93 4.225 1.61 2.151a.25.25 0 0 1-.226.418h-1.6v2.1a.25.25 0 0 1-.418.17l-1.9-2.1a.25.25 0 0 1 .226-.419h1.6V5.265a.25.25 0 0 1 .418-.17" />
									</svg>
									Verified Student
								</div>
							) : (
								<div className="bg-gray-200 text-gray-600 text-xs font-bold px-4 py-1.5 rounded-full">
									Unverified
								</div>
							)}
						</div>

						{/* 2. Trust Score */}
						<div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
							<h3 className="font-bold text-gray-900 mb-2">Trust Score</h3>
							<div className="flex items-baseline gap-1 mb-2">
								<span className="text-4xl font-extrabold text-red-900">92</span>
								<span className="text-lg font-bold text-red-900">%</span>
								<span className="ml-auto text-sm text-gray-500 font-medium">
									Excellent
								</span>
							</div>
							<div className="w-full bg-red-100 rounded-full h-2.5">
								<div
									className="bg-red-900 h-2.5 rounded-full"
									style={{ width: "92%" }}></div>
							</div>
						</div>

						{/* 3. Earned Badges */}
						<div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
							<h3 className="font-bold text-gray-900 mb-4">Earned Badges</h3>
							<div className="flex flex-wrap gap-2">
								<div className="bg-red-50 text-red-900 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="12"
										height="12"
										fill="currentColor"
										className="bi bi-award"
										viewBox="0 0 16 16">
										<path d="M9.669.864 8 0 6.331.864l-1.858.282-.842 1.68-1.337 1.32L2.6 6l-.306 1.854 1.337 1.32.842 1.68 1.858.282L8 12l1.669-.864 1.858-.282.842-1.68 1.337-1.32L12.6 6l.306-1.854-1.337-1.32-.842-1.68z" />
									</svg>
									Top Seller
								</div>
								{/* ... other badges ... */}
							</div>
						</div>

						{/* 4. Quick Actions */}
						<div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
							<h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
							<div className="space-y-3">
								<Link
									href="/profile/reviews"
									className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-red-900 transition-colors w-full text-left">
									{/* ... svg ... */}
									Reviews & Ratings
								</Link>
								{/* ... other links ... */}
							</div>
						</div>
					</aside>

					{/* --- RIGHT CONTENT: Listings --- */}
					<div className="lg:col-span-3">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-2xl font-bold text-gray-900">
								Active Listings
							</h2>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{/* TODO: Fetch Real Listings from Spring Boot
                  To make this dynamic, you need an endpoint in Spring Boot:
                  GET /api/items/seller/{studentId}
                  
                  Then you would call:
                  const res = await fetch(`${process.env.SPRING_BOOT_API_URL}/api/items/seller/${user.studentId}`);
                  const myItems = await res.json();
                  
                  And map over myItems instead of activeListings.
              */}
							{activeListings.map((item) => (
								<div
									key={item.id}
									className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer">
									<div className="h-52 bg-gray-200 relative overflow-hidden">
										{/* Placeholder Image Logic */}
										<div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
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
										</div>
									</div>
									<div className="p-5">
										<h3 className="font-bold text-gray-900 mb-2 truncate">
											{item.title}
										</h3>
										<div className="text-[#8B0000] font-extrabold text-xl">
											{item.price}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
};

export default ProfilePage;
