"use client";
import { useEffect, useState } from "react";
import { FaTrophy } from "react-icons/fa";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { CiLogin } from "react-icons/ci";
import Link from "next/link";
import { User } from "../Cosntants/constants";

const navDivStyles = `flex gap-2 cursor-pointer hover:text-white transition-colors duration-300 p-4 justify-start items-center`;

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/Authentication/Session`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user session", error);
      }
    };
    fetchUser();
  }, []);

  return (
    <nav className="bg-[#0f1925] text-[#8392A5] sm:static lg:fixed w-full lg:w-36 lg:h-screen z-10 transition-all duration-300 flex flex-col">
      {/* Logo and burger icon */}
      <div className="flex justify-between items-center p-4">
        <Link href={"/"}>
          <img
            src="/images/Duaelity_logo.png"
            alt="Duaelity logo"
            className="object-cover w-12 h-12 lg:w-20 lg:h-20 transition-all duration-300"
          />
        </Link>
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
          isMenuOpen ? "flex" : "hidden"
        } flex-col flex-grow lg:flex justify-between bg-[#0f1925] lg:bg-transparent w-full transition-all duration-300`}
      >
        <div>
          <Link href={"/tournaments"} className={`${navDivStyles}`}>
            <FaTrophy className="w-4 h-5 flex-none" />
            <span>Tournaments</span>
          </Link>
        </div>

        <div className="lg:mb-4">
          {user ? (
            <Link href="/Profile" className={`${navDivStyles}`}>
              <div className="flex items-center gap-2">
                <img
                  src={user.profileImage || "/images/default-avatar.jpg"}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-white"
                />
                <span className="truncate max-w-[8rem]">{user.username}</span>
              </div>
            </Link>
          ) : (
            <Link
              href={`/Authentication/SignIn`}
              className={`${navDivStyles}`}
            >
              <CiLogin />
              <span>Log In!</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;