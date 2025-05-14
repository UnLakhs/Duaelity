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

export const PasswordChangeForm = ({ userId }: PasswordChangeFormProps) => {
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
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: "",
  });

  const newPassword = watch("newPassword");

  const checkPasswordStrength = (password: string) => {
    let score = 0;
    const feedback = [];
    
    if (password.length >= 8) score += 1;
    else feedback.push("At least 8 characters");
    
    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push("One uppercase letter");
    
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push("One lowercase letter");
    
    if (/\d/.test(password)) score += 1;
    else feedback.push("One number");
    
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    else feedback.push("One special character");
    
    setPasswordStrength({
      score,
      feedback: feedback.length ? `Missing: ${feedback.join(", ")}` : "Strong password!"
    });
  };

  useEffect(() => {
    if (newPassword) {
      checkPasswordStrength(newPassword);
    } else {
      setPasswordStrength({ score: 0, feedback: "" });
    }
  }, [newPassword]);

  const getStrengthColor = () => {
    switch (passwordStrength.score) {
      case 0: return "bg-gray-500";
      case 1: return "bg-red-500";
      case 2: return "bg-orange-500";
      case 3: return "bg-yellow-500";
      case 4: return "bg-blue-500";
      case 5: return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const onSubmit = async (data: PasswordChangeFormData) => {
    if (passwordStrength.score < 3) {
      setError("Password is too weak. Please follow the requirements.");
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
      setTimeout(() => setSuccess(false), 5000);
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

  if (!userId) {
    return (
      <div className="mt-6 w-full">
        <div className="text-center text-gray-400">
          Loading user information...
        </div>
      </div>
    );
  }

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
          
          {/* Enhanced Password Strength Meter */}
          {newPassword && (
            <div className="mt-2">
              <div className="flex gap-1 h-1.5 mb-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-sm ${
                      passwordStrength.score >= i 
                        ? getStrengthColor() 
                        : "bg-gray-600"
                    }`}
                  />
                ))}
              </div>
              <p className={`text-xs ${
                passwordStrength.score < 3 ? "text-red-400" : 
                passwordStrength.score < 5 ? "text-yellow-400" : "text-green-400"
              }`}>
                {passwordStrength.feedback}
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
          {isChangingPassword ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Changing...
            </>
          ) : (
            "Change Password"
          )}
        </button>
      </form>
    </div>
  );
};