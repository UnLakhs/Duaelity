"use client";
import { FaUpload, FaSignOutAlt, FaKey } from "react-icons/fa";
import { User } from "../Cosntants/constants";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface PasswordChangeForm {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordChangeError, setPasswordChangeError] = useState("");
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PasswordChangeForm>();

  const handlePasswordChange = async (data: PasswordChangeForm) => {
    if (!user) return;
    console.log("Form data:", {
    userId: user._id,
    currentPassword: data.currentPassword,
    newPassword: data.newPassword
  });
    setIsChangingPassword(true);
    setPasswordChangeError("");
    setPasswordChangeSuccess(false);

    try {
      const response = await fetch("/api/Authentication/ChangePassword", {
        method: "PUT",
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id.toString(),
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        })
      })

      const result = await response.json();
        if (!response.ok) {
        throw new Error(result.error || "Password change failed");
      }

      setPasswordChangeSuccess(true);
      reset(); // Reset the form fields
    } catch(error) {
      console.error("Error changing password:", error);
      if (error instanceof Error) {
        setPasswordChangeError(error.message);
      } else {
        setPasswordChangeError("An unknown error occurred");
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

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
        body: JSON.stringify({ userId: user._id, imageUrl }),
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
        <div className="relative inline-block mb-1 group">
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
        <div className="mt-5 space-y-2">
          <h2 className="text-xl font-semibold">{user?.username}</h2>
          <p className="text-gray-300">{user?.email}</p>
        </div>

         {/* Password Change Section */}
      <div className="mt-6 w-full">
        <h3 className="text-lg font-semibold mb-3 flex items-center justify-center gap-2">
          <FaKey /> Change Password
        </h3>
        
        <form onSubmit={handleSubmit(handlePasswordChange)} className="space-y-4">
          <div className="text-left">
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-1">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              {...register("currentPassword", { required: "Current password is required" })}
              className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:border-blue-400 focus:ring focus:ring-blue-500 outline-none transition duration-200"
            />
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-red-400">{errors.currentPassword.message}</p>
            )}
          </div>

          <div className="text-left">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              {...register("newPassword", { 
                required: "New password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters"
                }
              })}
              className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:border-blue-400 focus:ring focus:ring-blue-500 outline-none transition duration-200"
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-400">{errors.newPassword.message}</p>
            )}
          </div>

          <div className="text-left">
            <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-300 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmNewPassword"
              {...register("confirmNewPassword", { 
                required: "Please confirm your password",
                validate: value => 
                  value === watch('newPassword') || "Passwords do not match"
              })}
              className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:border-blue-400 focus:ring focus:ring-blue-500 outline-none transition duration-200"
            />
            {errors.confirmNewPassword && (
              <p className="mt-1 text-sm text-red-400">{errors.confirmNewPassword.message}</p>
            )}
          </div>

          {passwordChangeError && (
            <div className="text-red-400 bg-red-900/30 p-2 rounded-md">
              {passwordChangeError}
            </div>
          )}

          {passwordChangeSuccess && (
            <div className="text-green-400 bg-green-900/30 p-2 rounded-md">
              Password changed successfully!
            </div>
          )}

          <button
            type="submit"
            disabled={isChangingPassword}
            className={`w-full flex items-center justify-center gap-2 ${
              isChangingPassword ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
            } text-white py-2 px-4 rounded-lg transition-colors`}
          >
            {isChangingPassword ? 'Changing...' : 'Change Password'}
          </button>
        </form>
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
