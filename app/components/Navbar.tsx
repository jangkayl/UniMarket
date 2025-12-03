"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  return (
    <header className="bg-red-900 text-white py-4 px-8 flex justify-between items-center w-full sticky top-0">
      <Link
        href="/"
        className="text-2xl font-semibold flex items-center italic"
      >
        <Image
          src="/images/unimarket_logo.png"
          alt="Logo"
          width={20}
          height={10}
          className="w-full h-auto pr-2"
        />
        UniMarket
      </Link>

      <div>
        {pathname !== "/login" && pathname !== "/register" && (
          <a href="#" className="mr-4">
            Help/FAQ
          </a>
        )}
        {pathname !== "/login" && (
          <Link href="/login">
            <button className="bg-white text-red-800 px-4 py-2 rounded-md mr-2 cursor-pointer">
              Login
            </button>
          </Link>
        )}
        {pathname !== "/register" && (
          <Link href="/register">
            <button className="bg-transparent border-2 border-white text-white px-4 py-2 rounded-md cursor-pointer">
              Register
            </button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
