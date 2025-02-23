"use client";
import { useState } from "react";
import Link from "next/link";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    const { username, email, password } = formData;
    if (!username || !email || !password) {
      setErrorMessage("All fields are required.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await fetch(`/api/Authentication/SignUp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      await response.json();

      alert(
        "Your account has been created successfully! Redirecting to the login page..."
      );
      window.location.href = "/Authentication/SignIn";
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };
  return (
    <div className="flex flex-col justify-center items-center text-center bg-[url('/images/brawlhalla-bg-2.jpg')] bg-cover bg-center min-h-screen px-4">
      <form
        onSubmit={handleSubmit}
        className="shadow-lg text-white bg-gray-900/90 shadow-gray-400 rounded-lg p-6 sm:p-10 w-full max-w-xs sm:max-w-md md:max-w-[24rem]"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Sign Up</h1>
        {errorMessage && (
          <div className="mb-4 text-red-400 bg-red-900/30 p-2 rounded-md">
            {errorMessage}
          </div>
        )}
        <div className="mb-6 text-left">
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
            placeholder="Username"
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:border-blue-400 focus:ring focus:ring-blue-500 outline-none transition-all duration-200"
            value={formData.username}
            onChange={handleChange}
            autoComplete="off"
            required
          />
        </div>
        <div className="mb-6 text-left">
          <label
            htmlFor="email"
            className="block font-semibold text-gray-300 mb-1"
          >
            Email:
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:border-blue-400 focus:ring focus:ring-blue-500 outline-none transition-all duration-200"
            value={formData.email}
            onChange={handleChange}
            autoComplete="off"
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
            placeholder="Password"
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:border-blue-400 focus:ring focus:ring-blue-500 outline-none transition-all duration-200"
            value={formData.password}
            onChange={handleChange}
            autoComplete="off"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-all duration-200"
        >
          Sign Up
        </button>
      </form>

      <div className="mt-4">
        <Link
          href="/Authentication/SignUp"
          className="text-gray-100 hover:underline hover:text-gray-300 transition-all duration-200 font-semibold"
        >
          Already have an account? Log in!
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
