import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Define the shape of the User object
interface User {
	firstName: string;
	lastName: string;
	studentNumber: string;
	// Add other fields if necessary
}

// --- Mock Data ---

const quickStats = [
	{ label: "Active Listings", value: "7", icon: "box" },
	{ label: "Loan Requests", value: "3", icon: "piggy" },
	{ label: "Trust Score", value: "92%", icon: "chart" },
	{ label: "Wallet Balance", value: "$120", icon: "wallet" },
];

const recentNotifications = [
	{
		id: 1,
		text: "New message from Alex M. regarding 'Calculus Book'",
		time: "2 min ago",
		type: "message",
	},
	{
		id: 2,
		text: "Your loan request for 'Physics Textbook' was approved!",
		time: "1 hour ago",
		type: "loan",
	},
	{
		id: 3,
		text: "New item listed: 'Ergonomic Desk Chair'",
		time: "3 hours ago",
		type: "alert",
	},
	{
		id: 4,
		text: "Reminder: Repayment due for 'Chemistry Kit' in 2 days",
		time: "Yesterday",
		type: "reminder",
	},
	{
		id: 5,
		text: "You received a new rating from Jamie P.",
		time: "2 days ago",
		type: "rating",
	},
];

const featuredListings = [
	{
		id: 1,
		title: "Dune by Frank Herbert",
		price: "$15.00",
		condition: "Used - Good",
		image: "/images/book_dune.jpg",
	},
	{
		id: 2,
		title: "Ergonomic Desk Chair",
		price: "$75.00",
		condition: "Used - Excellent",
		image: "/images/chair.jpg",
	},
	{
		id: 3,
		title: "TI-84 Plus Calculator",
		price: "$40.00",
		condition: "Used - Fair",
		image: "/images/calculator.jpg",
	},
	{
		id: 4,
		title: "Portable Bluetooth Speaker",
		price: "$25.00",
		condition: "Used - Very Good",
		image: "/images/laptop_mock.jpg",
	},
	{
		id: 5,
		title: "Art History: A Concise Survey",
		price: "$20.00",
		condition: "Used - Good",
		image: "/images/art_book.jpg",
	},
	{
		id: 6,
		title: "Artist Pen Set",
		price: "$10.00",
		condition: "New",
		image: "/images/pens.jpg",
	},
];

// --- Helper Components ---

const NotificationIcon = ({ type }: { type: string }) => {
	switch (type) {
		case "message":
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="gold"
					className="bi bi-chat-left-text-fill"
					viewBox="0 0 16 16">
					<path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793V2zm3.5 1a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z" />
				</svg>
			);
		case "loan":
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="gold"
					className="bi bi-hand-thumbs-up-fill"
					viewBox="0 0 16 16">
					<path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.847 9.847 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z" />
				</svg>
			);
		case "alert":
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="gold"
					className="bi bi-megaphone-fill"
					viewBox="0 0 16 16">
					<path d="M13 2.5a1.5 1.5 0 0 1 3 0v11a1.5 1.5 0 0 1-3 0v-11zm-1 .5v11a.5.5 0 0 1-1 0v-11a.5.5 0 0 1 1 0zM4.722 2.016A5 5 0 0 0 2 8zm0 11.968A5 5 0 0 0 2 8zm.278-6a4 4 0 0 1 4-4v8a4 4 0 0 1-4-4z" />
				</svg>
			);
		case "reminder":
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="gold"
					className="bi bi-piggy-bank-fill"
					viewBox="0 0 16 16">
					<path d="M7.964 1.527c-2.977 0-5.571 1.704-6.32 4.125h-.55A1 1 0 0 0 .11 6.824l.254 1.46a1.5 1.5 0 0 0 1.478 1.243h.263c.3.513.688.978 1.145 1.382l-.729 2.477a.5.5 0 0 0 .48.641h2a.5.5 0 0 0 .471-.332l.482-1.351c.635.173 1.31.267 2.011.267.707 0 1.388-.095 2.028-.272l.543 1.372a.5.5 0 0 0 .463.316h2a.5.5 0 0 0 .478-.645l-.761-2.506C13.81 9.895 14.5 8.559 14.5 7.069c0-.145-.007-.29-.02-.431.261-.11.508-.266.705-.444.315.306.815.306.815-.417 0 .223-.5.223-.461-.026a.95.95 0 0 0 .09-.092.314.314 0 0 0 .092-.09c.232-.423-.028-.815-.417-.815-.178-.197-.334-.444-.444-.705.141-.013.286-.02.431-.02 1.49 0 2.826.69 3.826 1.838l2.506.761a.5.5 0 0 0 .645-.478v-2a.5.5 0 0 0-.332-.471l-1.351-.482c-.173-.635-.267-1.31-.267-2.011 0-.707.095-1.388.272-2.028l1.372-.543a.5.5 0 0 0 .316-.463v-2a.5.5 0 0 0-.645-.478l-2.477.729c-.404-.457-.87-.845-1.382-1.145V1.711a1.5 1.5 0 0 0-1.243-1.478l-1.46-.254a1 1 0 0 0-1.173.984v.55c-2.42.75-4.125 3.343-4.125 6.32z" />
				</svg>
			);
		default:
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="gold"
					className="bi bi-star-fill"
					viewBox="0 0 16 16">
					<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
				</svg>
			);
	}
};

const StatIcon = ({ icon }: { icon: string }) => {
	const iconClass = "text-yellow-400 w-8 h-8 mb-2";
	switch (icon) {
		case "box":
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					className={iconClass}
					viewBox="0 0 16 16">
					<path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zm3.564 1.426L5.596 5 8 5.961 14.154 3.5l-2.404-.961zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z" />
				</svg>
			);
		case "piggy":
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					className={iconClass}
					viewBox="0 0 16 16">
					<path d="M5 6.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm1.138-1.996a4.002 4.002 0 0 1 5.226 5.226H10a1 1 0 0 1-1 1H5.5a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1V4.254zm.674 1.283-.497 1.492a.5.5 0 0 0 .47.668h1.895a.5.5 0 0 0 .473-.67l-.502-1.49a.5.5 0 0 0-.926 0l-.078.232a.5.5 0 0 1-.948 0l-.077-.232z" />
				</svg>
			);
		case "chart":
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					className={iconClass}
					viewBox="0 0 16 16">
					<path
						fillRule="evenodd"
						d="M0 0h1v15h15v1H0V0zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5z"
					/>
				</svg>
			);
		case "wallet":
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					className={iconClass}
					viewBox="0 0 16 16">
					<path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499L12.136.326zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484L5.562 3zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z" />
				</svg>
			);
		default:
			return null;
	}
};

const DashboardPage = async () => {
	// 1. Get Session Cookie
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get("session");

	// 2. Redirect if not logged in
	if (!sessionCookie) {
		redirect("/login");
	}

	// 3. Parse User Data
	const user: User = JSON.parse(sessionCookie.value);

	return (
		<div className="bg-gray-50 min-h-screen flex flex-col font-sans text-gray-900">
			<Navbar />

			<main className="grow w-full max-w-[1400px] mx-auto px-6 py-8 space-y-10">
				{/* --- 1. HERO SECTION --- */}
				<section className="bg-linear-to-r from-red-100 to-red-200 rounded-3xl p-10 md:p-14 relative overflow-hidden shadow-sm">
					<div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
						<svg
							viewBox="0 0 200 200"
							xmlns="http://www.w3.org/2000/svg"
							className="w-full h-full text-red-900 fill-current">
							<path
								d="M45.7,-70.5C58.9,-62.5,69.3,-51.1,75.9,-38.3C82.5,-25.5,85.3,-11.3,82.8,1.5C80.3,14.2,72.6,25.5,63.6,35.2C54.6,44.9,44.3,53,33.1,59.3C21.9,65.6,9.8,70.1,-1.6,72.3C-13,74.5,-23.7,74.4,-33.6,69.5C-43.5,64.6,-52.6,54.9,-60.8,44.2C-69,33.5,-76.3,21.8,-78.6,9.2C-80.9,-3.4,-78.2,-16.9,-71.4,-28.7C-64.6,-40.5,-53.7,-50.6,-41.8,-59C-29.9,-67.4,-17,-74.1,-3.2,-69.7C10.6,-65.3,32.5,-80.5,45.7,-70.5Z"
								transform="translate(100 100)"
							/>
						</svg>
					</div>

					<div className="relative z-10 max-w-2xl">
						{/* DYNAMIC WELCOME MESSAGE */}
						<h1 className="text-4xl font-bold mb-4 text-gray-900">
							Welcome back, {user.firstName}!
						</h1>
						<p className="text-gray-700 text-lg mb-8 leading-relaxed">
							Your central hub for all things UniMarket. Quickly navigate,
							discover new listings, or manage your requests.
						</p>
						<Link href="/marketplace?create=true">
							<button className="bg-red-900 hover:bg-red-800 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-transform transform hover:scale-105 cursor-pointer">
								Post a New Item
							</button>
						</Link>
					</div>
				</section>

				{/* --- 2. QUICK ACTIONS CARDS --- */}
				<section className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow cursor-pointer group">
						<div className="text-yellow-400 mb-4 group-hover:scale-110 transition-transform">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="40"
								height="40"
								fill="currentColor"
								className="bi bi-phone"
								viewBox="0 0 16 16">
								<path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
								<path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
							</svg>
						</div>
						<h3 className="text-xl font-bold mb-2">Buy/Sell Items</h3>
						<p className="text-gray-500 text-sm mb-4">
							Browse or list academic essentials and more.
						</p>
						<p className="text-red-900 font-bold text-2xl mt-auto">
							1,245 items
						</p>
					</div>

					<div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow cursor-pointer group">
						<div className="text-yellow-400 mb-4 group-hover:scale-110 transition-transform">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="40"
								height="40"
								fill="currentColor"
								className="bi bi-handshake"
								viewBox="0 0 16 16">
								<path d="M9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3m-8.322.12C1.72 3.064 1.903 3 2.122 3h3.672a1 1 0 0 0 .707-.293L7.327 1.88A.997.997 0 0 0 6.62.179H2.825a1 1 0 0 0-1 1zM7 6.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
								<path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
							</svg>
						</div>
						<h3 className="text-xl font-bold mb-2">Borrow Requests</h3>
						<p className="text-gray-500 text-sm mb-4">
							Manage items you&apos;ve requested to borrow.
						</p>
						<p className="text-red-900 font-bold text-2xl mt-auto">5 pending</p>
					</div>

					<div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow cursor-pointer group">
						<div className="text-yellow-400 mb-4 group-hover:scale-110 transition-transform">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="40"
								height="40"
								fill="currentColor"
								className="bi bi-currency-dollar"
								viewBox="0 0 16 16">
								<path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z" />
							</svg>
						</div>
						<h3 className="text-xl font-bold mb-2">Loan Offers</h3>
						<p className="text-gray-500 text-sm mb-4">
							View and offer items for peer-to-peer loans.
						</p>
						<p className="text-red-900 font-bold text-2xl mt-auto">8 active</p>
					</div>
				</section>

				{/* --- 3. NOTIFICATIONS & STATS GRID --- */}
				<section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-xl font-bold">Recent Notifications</h2>
							<a
								href="#"
								className="text-red-900 text-sm font-semibold hover:underline">
								View All
							</a>
						</div>
						<div className="space-y-4">
							{recentNotifications.map((notif) => (
								<div
									key={notif.id}
									className="flex gap-4 items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
									<div className="mt-1">
										<NotificationIcon type={notif.type} />
									</div>
									<div className="grow">
										<p className="text-sm text-gray-800">{notif.text}</p>
										<p className="text-xs text-gray-400 mt-1">{notif.time}</p>
									</div>
								</div>
							))}
						</div>
					</div>

					<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
						<h2 className="text-xl font-bold mb-6">Quick Stats</h2>
						<div className="grid grid-cols-2 gap-6">
							{quickStats.map((stat, idx) => (
								<div
									key={idx}
									className="bg-gray-50 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-red-50 transition-colors">
									<StatIcon icon={stat.icon} />
									<p className="text-3xl font-bold text-red-900 mb-1">
										{stat.value}
									</p>
									<p className="text-sm text-gray-500 font-medium">
										{stat.label}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* --- 4. FEATURED LISTINGS --- */}
				<section>
					<div className="flex justify-between items-end mb-6">
						<h2 className="text-2xl font-bold text-gray-900">
							Featured Listings
						</h2>
						<Link
							href="/marketplace"
							className="text-red-900 font-semibold hover:underline flex items-center gap-1">
							View All
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="12"
								height="12"
								fill="currentColor"
								className="bi bi-arrow-up-right"
								viewBox="0 0 16 16">
								<path
									fillRule="evenodd"
									d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0z"
								/>
							</svg>
						</Link>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-6">
						{featuredListings.map((item) => (
							<div
								key={item.id}
								className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
								<div className="h-40 bg-gray-200 relative overflow-hidden">
									<div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="40"
											height="40"
											fill="currentColor"
											className="bi bi-image"
											viewBox="0 0 16 16">
											<path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
											<path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12" />
										</svg>
									</div>
								</div>
								<div className="p-4">
									<h4 className="font-bold text-gray-900 text-sm mb-1 truncate">
										{item.title}
									</h4>
									<p className="text-red-900 font-bold text-lg">{item.price}</p>
									<p className="text-xs text-gray-500 mt-1">{item.condition}</p>
								</div>
							</div>
						))}
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
};

export default DashboardPage;
