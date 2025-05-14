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
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: "",
  });
  const [isLoading, setIsLoading] = useState(false);

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
    if (password) {
      checkPasswordStrength(password);
    } else {
      setPasswordStrength({ score: 0, feedback: "" });
    }
  }, [password]);

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

    if (passwordStrength.score < 3) {
      setError("Password is too weak. Please follow the requirements.");
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

          {/* Enhanced Password Strength Meter */}
          {password && (
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
          } text-white font-bold py-2 rounded-lg transition-all duration-200 flex justify-center items-center gap-2`}
        >
          {isLoading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Resetting...
            </>
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