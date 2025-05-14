"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [retryAfter, setRetryAfter] = useState(0);

  const router = useRouter();

  useEffect(() => {
    if (!isRateLimited || retryAfter <= 0) return;

    const timer = setInterval(() => {
      setRetryAfter((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRateLimited(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRateLimited, retryAfter]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRateLimited) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch(`/api/Authentication/SignIn`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.status === 429) {
        const retry = parseInt(response.headers.get("Retry-After") || "60", 10);
        setIsRateLimited(true);
        setRetryAfter(retry);
        setErrorMessage(`Too many attempts. Please wait.`);
        return;
      }

      const result = await response.json();
      if (response.ok) {
        router.push("/");
        router.refresh();
      } else {
        setErrorMessage(result.error || "Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResetSuccess(false);
    setErrorMessage("");

    try {
      const res = await fetch("/api/Authentication/ForgotPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await res.json();
      if (res.ok) {
        setResetSuccess(true);
      } else {
        setErrorMessage(data.error || "Failed to send reset email.");
      }
    } catch (err) {
      console.error("Reset email error:", err);
      setErrorMessage("Could not send reset email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center text-center bg-[url('/images/brawlhalla-bg-2.jpg')] bg-cover bg-center min-h-screen px-4">
      {!showResetForm ? (
        <form
          onSubmit={handleSubmit}
          className="shadow-lg text-white bg-gray-900/90 shadow-gray-400 rounded-lg p-6 sm:p-10 w-full max-w-xs sm:max-w-md md:max-w-[24rem]"
        >
          <h1 className="text-4xl font-bold mb-6">Log In</h1>

          {errorMessage && (
            <div className="mb-4 text-red-400 bg-red-900/30 p-2 rounded-md">
              {errorMessage}
            </div>
          )}

          <div className="mb-4 text-left">
            <label className="block text-gray-300 mb-1">Username:</label>
            <input
              name="username"
              type="text"
              onChange={handleChange}
              value={formData.username}
              required
              className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:border-blue-400 focus:ring focus:ring-blue-500 outline-none transition-all duration-200"
            />
          </div>

          <div className="mb-2 text-left">
            <label className="block text-gray-300 mb-1">Password:</label>
            <input
              name="password"
              type="password"
              onChange={handleChange}
              value={formData.password}
              required
              className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:border-blue-400 focus:ring focus:ring-blue-500 outline-none transition-all duration-200"
            />
          </div>
  {/* Countdown with a bar */}
        {isRateLimited && (
          <div className="mb-4">
            <div className="flex items-center gap-2 text-blue-700">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Time remaining: {retryAfter} seconds</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-blue-500 h-2.5 rounded-full"
                style={{ width: `${(retryAfter / 60) * 100}%` }}
              >

              </div>
            </div>
          </div>
        )}
          <button
            type="submit"
            disabled={isSubmitting || isRateLimited}
            className={`w-full mt-4 ${
              isRateLimited
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white font-bold py-2 rounded-lg transition-all duration-200`}
          >
            {isSubmitting ? "Signing In..." : "Log In"}
          </button>

          <div className="mt-4 text-sm text-gray-300">
            <button
              type="button"
              onClick={() => setShowResetForm(true)}
              className="text-blue-400 hover:underline"
            >
              Forgot your password?
            </button>
          </div>
        </form>
      ) : (
        <form
          onSubmit={handleResetRequest}
          className="shadow-lg text-white bg-gray-900/90 shadow-gray-400 rounded-lg p-6 sm:p-10 w-full max-w-xs sm:max-w-md md:max-w-[24rem]"
        >
          <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
          {resetSuccess ? (
            <div className="text-green-400">
              A password reset link has been sent.
            </div>
          ) : (
            <>
              {errorMessage && (
                <div className="mb-3 text-red-400 bg-red-900/30 p-2 rounded-md">
                  {errorMessage}
                </div>
              )}
              <input
                type="email"
                placeholder="Enter your account email"
                className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:border-blue-400 focus:ring focus:ring-blue-500 outline-none transition-all duration-200 mb-4"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-500 transition duration-200 text-white font-semibold py-2 rounded-lg"
              >
                {isSubmitting ? "Sending..." : "Send Reset Email"}
              </button>
              <button
                type="button"
                onClick={() => setShowResetForm(false)}
                className="mt-4 text-sm text-gray-300 hover:underline"
              >
                Back to login
              </button>
            </>
          )}
        </form>
      )}

      <div className="mt-4">
        <Link
          href="/Authentication/SignUp"
          className="text-gray-100 hover:underline hover:text-gray-300 font-semibold"
        >
          Don&apos;t have an account? Sign Up!
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
