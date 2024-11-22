"use client"
import { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { FaTrophy } from "react-icons/fa";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi"; // Burger and close icons
import Link from "next/link";

// Common styles for nav items
const navDivStyles = `flex gap-2 cursor-pointer hover:bg-white hover:text-black transition duration-300 p-4 justify-start items-center`;

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle the menu

  return (
    <nav className="bg-[#0f1925] text-[#8392A5] sm:static lg:fixed w-full lg:w-36 lg:h-full z-10 transition-all duration-300">
      {/* Logo and burger icon */}
      <div className="flex justify-between items-center p-4">
        {/* Logo */}
        <img
          src="/images/Duaelity_logo.png"
          alt="Duaelity logo"
           className="object-cover w-12 h-12 lg:w-20 lg:h-20 transition-all duration-300"
        />
        {/* Burger Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white lg:hidden"
        >
          {isMenuOpen ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
        </button>
      </div>

      {/* Menu Items */}
      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } lg:block bg-[#0f1925] lg:bg-transparent w-full lg:h-full transition-all duration-300`}
      >
        <Link href={"/"} className={`${navDivStyles}`}>
          <FaTrophy size={20} />
          <span>Tournaments</span>
        </Link>
        <div className={`${navDivStyles}`}>
          <IoIosSearch />
          <span>Search</span>
        </div>
        <div className={`${navDivStyles}`}>
          <IoIosSearch />
          <span>Search</span>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
