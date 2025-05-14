"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const VerifyEmailContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [verificationSuccess, setVerificationSuccess] = useState("");
  const [resendSuccess, setResendSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(30);

  // Verification success countdown
  useEffect(() => {
    if (verificationSuccess) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [verificationSuccess]);

  // Redirect when verification succeeds
  useEffect(() => {
    if (countdown === 0 && verificationSuccess) {
      router.push("/Authentication/SignIn");
    }
  }, [countdown, verificationSuccess, router]);

  // Resend OTP countdown
  useEffect(() => {
    if (resendDisabled) {
      const timer = setInterval(() => {
        setResendCountdown((prev) => (prev <= 1 ? 30 : prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendDisabled]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setVerificationSuccess("");
    setResendSuccess("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/Authentication/VerifyEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Verification failed");

      setVerificationSuccess("Email verified successfully!");
      setCountdown(5);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Verification failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendDisabled(true);
    setError("");
    setResendSuccess("");
    try {
      const response = await fetch("/api/Authentication/ResendOTP", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Failed to resend OTP");
      setResendSuccess("New OTP sent to your email!");
      setResendCountdown(30);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend OTP");
    }
  };

  return (
      <div className="flex flex-col justify-center items-center text-center bg-[url('/images/brawlhalla-bg-2.jpg')] bg-cover bg-center min-h-screen px-4 transition-all duration-300">
        <form
          onSubmit={handleSubmit}
          className="shadow-lg text-white bg-gray-900/90 shadow-gray-400 rounded-lg p-6 sm:p-10 w-full max-w-xs sm:max-w-md md:max-w-[24rem] transition-all duration-300"
        >
          <h1 className="text-3xl font-bold mb-6">Verify Email</h1>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 text-red-300 rounded-md animate-fade-in">
              {error}
            </div>
          )}

          {/* Verification Success */}
          {verificationSuccess && (
            <div className="mb-4 p-3 bg-green-900/30 text-green-300 rounded-md animate-fade-in">
              <p>{verificationSuccess}</p>
              <p className="text-sm mt-1">
                Redirecting in {countdown} seconds...
              </p>
            </div>
          )}

          {/* Resend Success */}
          {resendSuccess && (
            <div className="mb-4 p-3 bg-blue-900/30 text-blue-300 rounded-md animate-fade-in">
              <p>{resendSuccess}</p>
            </div>
          )}
          {/* Email Display */}
          <div className="mb-6 text-left">
            <label className="block text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email || ""}
              readOnly
              className="w-full px-4 py-2 bg-gray-700/50 text-gray-300 border border-gray-600 rounded-md cursor-not-allowed transition-colors duration-200"
            />
          </div>

          {/* OTP Input */}
          <div className="mb-6 text-left">
            <label className="block text-gray-300 mb-1">OTP Code</label>
            <input
              type="text"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="Enter 6-digit code"
              className="w-full px-4 py-2 bg-gray-800/70 text-white border border-gray-700 rounded-md focus:border-blue-400 focus:ring focus:ring-blue-500 outline-none transition-all duration-200"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Check your email for the verification code
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || !!verificationSuccess}
            className={`w-full ${
              isLoading
                ? "bg-blue-700"
                : verificationSuccess
                ? "bg-green-600"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white font-medium py-2.5 rounded-lg transition-all duration-300 flex justify-center items-center gap-2`}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Verifying...
              </>
            ) : verificationSuccess ? (
              "✓ Verified"
            ) : (
              "Verify Email"
            )}
          </button>

          {/* Resend OTP Button */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resendDisabled || !!verificationSuccess}
              className={`text-sm ${
                resendDisabled
                  ? "text-gray-500"
                  : "text-blue-400 hover:underline"
              }`}
            >
              {resendDisabled
                ? `Resend OTP in ${resendCountdown}s`
                : "Didn't receive code? Resend OTP"}
            </button>
          </div>

          {/* Back to Login */}
          <div className="mt-6 pt-4 border-t border-gray-700 text-sm text-gray-300">
            <Link
              href="/Authentication/SignIn"
              className="text-blue-400 hover:underline transition-colors duration-200"
            >
              ← Back to login
            </Link>
          </div>
        </form>
      </div>
  );
};
export default VerifyEmailContent;
