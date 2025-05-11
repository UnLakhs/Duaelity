"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
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
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Prevent submission if already rate limited
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
        setErrorMessage(
          `Too many attempts. Please wait ${retry} seconds before trying again.`
        );
        return;
      }

      const result = await response.json();

      if (response.ok) {
        router.push("/");
        router.refresh();
      } else {
        setErrorMessage(result.error || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center text-center bg-[url('/images/brawlhalla-bg-2.jpg')] bg-cover bg-center min-h-screen px-4">
      <form
        onSubmit={handleSubmit}
        className="shadow-lg text-white bg-gray-900/90 shadow-gray-400 rounded-lg p-6 sm:p-10 w-full max-w-xs sm:max-w-md md:max-w-[24rem]"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Log In</h1>

        {errorMessage && (
          <div className="mb-4 text-red-400 bg-red-900/30 p-2 rounded-md">
            {errorMessage}
          </div>
        )}

        <div className="mb-4 text-left">
          <label
            htmlFor="username"
            className="block font-semibold text-gray-300 mb-1"
          >
            Username:
          </label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Enter your username"
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:border-blue-400 focus:ring focus:ring-blue-500 outline-none transition-all duration-200"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-6 text-left">
          <label
            htmlFor="password"
            className="block font-semibold text-gray-300 mb-1"
          >
            Password:
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:border-blue-400 focus:ring focus:ring-blue-500 outline-none transition-all duration-200"
            value={formData.password}
            onChange={handleChange}
            required
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
              ></div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        {/* Disable button if rate limited */}
        <button
          type="submit"
          disabled={isSubmitting || isRateLimited}
          className={`w-full ${
            isRateLimited
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white font-bold py-2 rounded-lg transition-all duration-200 ${
            isSubmitting ? "opacity-50" : ""
          }`}
        >
          {isRateLimited
            ? `Please wait (${retryAfter}s)`
            : isSubmitting
            ? "Signing In..."
            : "Log In"}
        </button>
      </form>

      <div className="mt-4">
        <Link
          href="/Authentication/SignUp"
          className="text-gray-100 hover:underline hover:text-gray-300 transition-all duration-200 font-semibold"
        >
          Don&apos;t have an account? Sign Up!
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
