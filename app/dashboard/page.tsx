import Image from "next/image";
import NavbarMain from "../components/NavbarMain";
import Footer from "../components/Footer";
import { FiBook } from "react-icons/fi";

const Dashboard = () => {
	return (
		<div className="bg-white text-gray-900 flex flex-col items-center w-full h-auto">
			{/* Header */}
			<NavbarMain />

			{/* Main Section */}
			<section className="px-10 py-35 flex items-center justify-center gap-10 w-full h-auto">
				<div className="bg-red-100/80 w-full max-w-380 p-15 rounded-2xl">
					<h1 className="text-5xl font-semibold mb-6">
						Welcome back, Student!
					</h1>
					<p className="text-md text-gray-500 mb-6">
						Your central hub for all things UniMarket. Quickly navigate,
						discover new listings, or <br /> manage your requests.
					</p>
					<div className="flex space-x-4">
						<button className="bg-red-800 text-white px-6 py-3 rounded-md">
							Post a New Item
						</button>
					</div>
				</div>
			</section>

			{/* Why UniMarket Section */}
			<section className="px-20 py-10 w-full">
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-15">
					<div className="flex flex-col justify-center items-center p-20 bg-white text-center rounded-lg shadow-md gap-3">
						<FiBook
							size={40}
							color="ffd900"
						/>

						<h3 className="text-2xl font-semibold mb-2">Buy/Sell Items</h3>
						<p className="text-gray-500">
							Browse or list academic essentials and more.
						</p>
					</div>
					<div className="flex flex-col justify-center items-center p-20 bg-white text-center rounded-lg shadow-md gap-3">
						<Image
							className="text-red-800 mb-4 w-10 h-auto"
							src="/images/money.png"
							alt="Money"
							width={1000}
							height={64}
						/>
						<h3 className="text-2xl font-semibold mb-2">Easy Loans</h3>
						<p>
							Peer-to-peer borrowing and lending for textbooks, equipment, or
							small amounts, all within a trusted network.
						</p>
					</div>
					<div className="flex flex-col justify-center items-center p-20 bg-white text-center rounded-lg shadow-md gap-3">
						<Image
							className="text-red-800 mb-4 w-10 h-auto"
							src="/images/collab.png"
							alt="Collab"
							width={1000}
							height={64}
						/>
						<h3 className="text-2xl font-semibold mb-2">Build Trust</h3>
						<p>
							Secure student verification and a trust score system ensure
							reliable and safe transactions for everyone.
						</p>
					</div>
				</div>
			</section>

			{/* Student Testimonial Section */}
			<section className="px-10 py-40 w-full">
				<h2 className="text-4xl font-bold text-center mb-8">
					What Students Say
				</h2>
				<div className="flex flex-col justify-center items-center text-center max-w-2xl mx-auto mb-8">
					<p className="text-lg italic mb-4">
						&quot;UniMarket made buying and selling textbooks so easy! I saved
						money and connected with other students on campus. It&apos;s a
						game-changer!&quot;
					</p>
					<Image
						className="text-red-800 my-10 w-20 h-auto"
						src="/images/woman.png"
						alt="Woman"
						width={1000}
						height={64}
					/>
					<p className="font-semibold text-orange-800">
						Sarah J., Engineering Student
					</p>
					<p className="text-gray-600">CIT University</p>
				</div>
			</section>

			{/* Call to Action Section */}
			<section className="bg-[#FFF0F0FF] py-40 text-center w-full flex flex-col justify-center items-center gap-5">
				<h2 className="text-4xl font-bold mb-6">
					Ready to simplify your student life?
				</h2>
				<p className="text-lg mb-6 font-light">
					Join UniMarket today and discover a smarter way to manage your
					academic needs. <br></br>Connect with your peers, find great deals,
					and build a trusted campus community.
				</p>
				<button className="text-white bg-red-800 px-8 py-3 rounded-2xl">
					Register Now
				</button>
			</section>

			{/* Footer */}
			<Footer />
		</div>
	);
};

export default Dashboard;
