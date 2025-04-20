"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import BiswaBangla from "@/assets/biswa_bangla.png";

const Header = () => {
  const [menu, setMenu] = useState(false);

  const toggleMenu = () => {
    setMenu(!menu);
  };

  return (
    <>
      <header className="bg-white w-full z-50 shadow">
        <div className="max-w-[1300px] mx-auto flex flex-col md:flex-row items-center justify-between py-2 px-4">
          {/* Logo */}
          <div className="flex items-center">
            <div className="ml-4 flex justify-center items-center">
              <Image
                src={BiswaBangla}
                alt="West Bengal State Emblem"
                className="h-16 w-auto"
              />
              <h1 className="text-2xl font-bold text-[#805dc8]">
                GIG Worker Registration Portal
              </h1>
            </div>
          </div>

        </div>
      </header>

      <nav className="bg-gray-800 text-white">
        <div className="max-w-[1300px] mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button className="md:hidden" onClick={toggleMenu}>
                {menu ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>

              {/* Desktop menu */}
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/" className="py-4 px-2 hover:text-gray-300">
                  Home
                </Link>
                <Link
                  href="#about"
                  className="py-4 px-2 scroll-smooth hover:text-gray-300"
                >
                  About
                </Link>
                <Link href="/login" className="py-4 px-2 hover:text-gray-300">
                  Login
                </Link>
                <Link
                  href="/registration"
                  className="py-4 px-2 hover:text-gray-300"
                >
                  Registration
                </Link>
              </div>
            </div>

            {/* Admin login button */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/admin/login"
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded hover:from-blue-600 hover:to-purple-600 transition duration-200"
              >
                Admin Login
              </Link>
            </div>
          </div>

          {/* Mobile menu */}
          {menu && (
            <div className="md:hidden">
              <Link href="/" className="block py-2 px-4 hover:bg-gray-700">
                Home
              </Link>
              <Link href="#about" className="block py-2 px-4 hover:bg-gray-700">
                About
              </Link>
              <Link href="/login" className="block py-2 px-4 hover:bg-gray-700">
                Login
              </Link>
              <Link
                href="/registration"
                className="block py-2 px-4 hover:bg-gray-700"
              >
                Registration
              </Link>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;
