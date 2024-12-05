"use client";
import { useState } from "react";
import { inputStyles } from "@/app/Cosntants/constants";
import Link from "next/link";

const SignIn = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    const { username, password } = formData;
    if (!username || !password) {
      setErrorMessage("All fields are required.");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await fetch(`/api/Authentication/SignIn`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        alert("User logged in successfully!");
        window.location.href = "/";
      } else {
        setErrorMessage(result.error || "User creation failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };
  return (
    <div className="flex flex-col justify-center items-center text-center bg-[url('/images/brawlhalla-bg-2.jpg')] h-screen">
      <form
        onSubmit={handleSubmit}
        className="shadow-xl text-white shadow-gray-400 bg-gray-800 rounded-lg p-12"
      >
        <h1 className="text-4xl font-bold mb-10">Log In</h1>
        {errorMessage && (
          <div className="mb-4 text-red-500">{errorMessage}</div>
        )}
        <div className="mb-4">
          <label htmlFor="username" className="block font-bold mb-2">
            Username:
          </label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            className={`${inputStyles}`}
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block font-bold mb-2">
            Password:
          </label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className={`${inputStyles}`}
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Log in
        </button>
      </form>
      <div className="p-2 rounded-md hover:opacity-80 transition duration-200 mt-4 bg-blue-700">
        <Link href={"/Authentication/SignUp"}>
          Don&apos;t have an account? Sign Up!
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
