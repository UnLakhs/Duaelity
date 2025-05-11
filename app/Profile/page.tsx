"use client";
import { FaUpload, FaSignOutAlt } from "react-icons/fa";
import { User } from "../Cosntants/constants";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/Authentication/Session`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          next: { revalidate: 60 }, // Revalidate every 60 seconds
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Error fetching user session:", error);
      }
    };
    fetchUser();
  }, []);

  const handleProfileImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/cloudinary-upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      const imageUrl = data.url;

      // Send to backend to save in DB
      await fetch("/api/users/update-profile-image", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id, imageUrl }),
      });

      // Update state
      setUser((prev) => (prev ? { ...prev, profileImage: imageUrl } : prev));
    } catch (error) {
      console.error("Error uploading profile image:", error);
      alert("Failed to upload profile image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      // 1. Call sign-out API
      await fetch("/api/Authentication/SignOut", {
        method: "POST",
        credentials: "include",
      });

      // 2. Force full reload to clear all states
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center text-center bg-[url('/images/brawlhalla-bg-2.jpg')] bg-cover bg-center min-h-screen px-4">
      <div className="shadow-lg text-white bg-gray-900/90 shadow-gray-400 rounded-lg p-6 sm:p-10 w-full max-w-xs sm:max-w-md md:max-w-[24rem]">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Profile</h1>

        {/* Profile Image Hover Upload */}
        <div className="relative inline-block mb-6 group">
          <img
            src={user?.profileImage || "/images/default-avatar.jpg"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md transition-opacity duration-200 group-hover:opacity-60"
          />
          <label
            htmlFor="profileImageUpload"
            className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <FaUpload size={24} className="text-white" />
          </label>
          <input
            type="file"
            id="profileImageUpload"
            accept="image/*"
            onChange={handleProfileImageUpload}
            className="hidden"
            disabled={isUploading}
          />
        </div>

        <p className="text-sm opacity-75">
          {isUploading ? "Uploading..." : "Edit Profile Picture"}
        </p>
        {/* User Info Section */}
        <div className="mt-6 space-y-2">
          <h2 className="text-xl font-semibold">{user?.username}</h2>
          <p className="text-gray-300">{user?.email}</p>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="mt-8 w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
        >
          <FaSignOutAlt />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Profile;
