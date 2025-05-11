"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };


const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch(`/api/Authentication/SignIn`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (response.ok) {
        router.push("/");
        router.refresh();
      } else {
        setErrorMessage(result.error || "Login failed. Please try again.");
        
        // Disable form if account is locked (status 423)
        if (response.status === 423) {
          (e.target as HTMLFormElement).querySelectorAll('input, button').forEach(
            el => el.setAttribute('disabled', 'true')
          );
        }
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
          <label htmlFor="username" className="block font-semibold text-gray-300 mb-1">
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
          <label htmlFor="password" className="block font-semibold text-gray-300 mb-1">
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

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-all duration-200 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Signing In...' : 'Log In'}
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
