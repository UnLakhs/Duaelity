// components/PasswordChangeForm.tsx
"use client";
import { FaKey } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";

interface PasswordChangeFormData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

interface PasswordChangeFormProps {
  userId: string;
}

export const PasswordChangeForm = ({userId}: PasswordChangeFormProps) => {

  if (!userId) {
    return (
      <div className="mt-6 w-full">
        <div className="text-center text-gray-400">
          Loading user information...
        </div>
      </div>
    );
  }
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<PasswordChangeFormData>({ mode: "onChange" });

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const newPassword = watch("newPassword");

  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength(0);
      return;
    }

    // Simple password strength calculation
    let strength = 0;
    if (newPassword.length >= 8) strength += 1;
    if (/[A-Z]/.test(newPassword)) strength += 1;
    if (/[0-9]/.test(newPassword)) strength += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 1;

    setPasswordStrength(strength);
  }, [newPassword]);

  const onSubmit = async (data: PasswordChangeFormData) => {
    if (passwordStrength < 3) {
      setError("Password is too weak");
      return;
    }

    setIsChangingPassword(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/Authentication/ChangePassword", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error?.message ||
            result.error ||
            "Password change failed. Please try again."
        );
      }

      setSuccess(true);
      reset();
      setTimeout(() => setSuccess(false), 5000); // Hide success message after 5s
    } catch (err) {
      console.error("Password change error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An unknown error occurred. Please try again."
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="mt-6 w-full">
      <h3 className="text-lg font-semibold mb-3 flex items-center justify-center gap-2">
        <FaKey /> Change Password
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Current Password Field */}
        <div className="text-left">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Current Password
          </label>
          <input
            type="password"
            {...register("currentPassword", {
              required: "Current password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:border-blue-400 focus:ring focus:ring-blue-500 outline-none transition duration-200"
          />
          {errors.currentPassword && (
            <p className="mt-1 text-sm text-red-400">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        {/* New Password Field */}
        <div className="text-left">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            New Password
          </label>
          <input
            type="password"
            {...register("newPassword", {
              required: "New password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              validate: (value) => {
                if (value === watch("currentPassword")) {
                  return "New password must be different from current password";
                }
                return true;
              },
            })}
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:border-blue-400 focus:ring focus:ring-blue-500 outline-none transition duration-200"
          />
          {errors.newPassword && (
            <p className="mt-1 text-sm text-red-400">
              {errors.newPassword.message}
            </p>
          )}

          {/* Password Strength Meter */}
          {newPassword && (
            <div className="mt-2">
              <div className="flex gap-1 h-1 mb-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-sm ${
                      passwordStrength >= i
                        ? i <= 2
                          ? "bg-red-500"
                          : i === 3
                          ? "bg-yellow-500"
                          : "bg-green-500"
                        : "bg-gray-600"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-400">
                {passwordStrength < 2
                  ? "Weak - include uppercase, numbers & symbols"
                  : passwordStrength < 4
                  ? "Moderate - could be stronger"
                  : "Strong password"}
              </p>
            </div>
          )}
        </div>

        {/* Confirm New Password Field */}
        <div className="text-left">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            {...register("confirmNewPassword", {
              required: "Please confirm your password",
              validate: (value) => {
                if (value !== watch("newPassword")) {
                  return "Passwords do not match";
                }
                if (value === watch("currentPassword")) {
                  return "New password must be different from current password";
                }
                return true;
              },
            })}
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:border-blue-400 focus:ring focus:ring-blue-500 outline-none transition duration-200"
          />
          {errors.confirmNewPassword && (
            <p className="mt-1 text-sm text-red-400">
              {errors.confirmNewPassword.message}
            </p>
          )}
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="text-red-400 bg-red-900/30 p-2 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="text-green-400 bg-green-900/30 p-2 rounded-md animate-fade-in">
            Password changed successfully!
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isChangingPassword || !isValid}
          className={`w-full flex items-center justify-center gap-2 ${
            isChangingPassword || !isValid
              ? "bg-blue-700 opacity-70"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white py-2 px-4 rounded-lg transition-colors`}
        >
          {isChangingPassword ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};
