import Image from "next/image";
import Link from "next/link";
import { FiLogOut, FiMessageSquare } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoPersonOutline } from "react-icons/io5";

const NavbarMain = () => {
	return (
		<header className="bg-white py-4 px-8 flex justify-between items-center w-full sticky top-0">
			<div className="text-2xl text-red-800 font-semibold flex items-center italic">
				<Image
					src="/images/unimarket_dark_logo.png"
					alt="Logo"
					width={20}
					height={10}
					className="w-full h-auto pr-2"
				/>
				UniMarket
			</div>
			<div className="flex justify-center items-center gap-10">
				<Link href="">Dashboard</Link>
				<Link href="">Marketplace</Link>
				<Link href="">Borrow/Loans</Link>
			</div>
			<div className="flex justify-end items-center gap-4">
				<div className="flex justify-center items-center gap-10">
					<Link href="">
						<IoMdNotificationsOutline size={20} />
					</Link>
					<Link href="">
						<FiMessageSquare size={20} />
					</Link>
				</div>
				<Link
					href=""
					className="flex items-center px-4 py-2 rounded-md mr-2 cursor-pointer gap-2">
					<IoPersonOutline size={20} />
					<button className="bg-transparent cursor-pointer">Profile</button>
				</Link>
				<Link
					href=""
					className="flex items-center bg-red-500 border-2 border-white text-white px-4 py-2 rounded-md cursor-pointer gap-2">
					<FiLogOut />
					<button className="cursor-pointer">Logout</button>
				</Link>
			</div>
		</header>
	);
};

export default NavbarMain;
