"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

const ResetPasswordClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    setPasswordStrength(strength);
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!token) {
      setError("Invalid or missing token.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (passwordStrength < 3) {
      setError("Password is too weak. Please use a stronger password.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/Authentication/ResetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setSuccess("Password reset successfully!");
      setTimeout(() => router.push("/Authentication/SignIn"), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center text-center bg-[url('/images/brawlhalla-bg-2.jpg')] bg-cover bg-center min-h-screen px-4">
      <form
        onSubmit={handleSubmit}
        className="shadow-lg text-white bg-gray-900/90 shadow-gray-400 rounded-lg p-6 sm:p-10 w-full max-w-xs sm:max-w-md md:max-w-[24rem]"
      >
        <h1 className="text-3xl font-bold mb-6">Reset Password</h1>

        {error && (
          <div className="mb-4 text-red-400 bg-red-900/30 p-2 rounded-md">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 text-green-400 bg-green-900/30 p-2 rounded-md">
            {success}
          </div>
        )}

        <div className="mb-4 text-left">
          <label className="block text-gray-300 mb-1">New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:border-blue-400 focus:ring focus:ring-blue-500 outline-none transition-all duration-200"
          />

          {password && (
            <div className="mt-2">
              <div className="flex gap-1 h-1 mb-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-sm ${
                      passwordStrength >= i
                        ? i <= 1
                          ? "bg-red-500"
                          : i <= 3
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

        <div className="mb-6 text-left">
          <label className="block text-gray-300 mb-1">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:border-blue-400 focus:ring focus:ring-blue-500 outline-none transition-all duration-200"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full ${
            isLoading ? "bg-blue-700" : "bg-blue-600 hover:bg-blue-700"
          } text-white font-bold py-2 rounded-lg transition-all duration-200 flex justify-center items-center`}
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Reset Password"
          )}
        </button>

        <div className="mt-4 text-sm text-gray-300">
          <Link
            href="/Authentication/SignIn"
            className="text-blue-400 hover:underline"
          >
            Back to login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordClient;