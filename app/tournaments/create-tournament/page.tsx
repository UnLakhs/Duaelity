"use client";
import { createTournamentInputStyles } from "@/app/Cosntants/constants";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CreateTournament = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    tournamentName: "",
    tournamentDescription: "",
    tournamentDate: "",
    tournamentRegistrationDeadline: "",
    tournamentTime: "",
    maxParticipants: "",
    tournamentFormat: { tournamentType: "", rounds: 0 },
    entryFee: { amount: "", currency: "USD" },
    prizes: [
      { position: 1, reward: "" },
      { position: 2, reward: "" },
      { position: 3, reward: "" },
    ],
    tournamentImage: "",
  });


  useEffect(() => {
    if(formData.tournamentDate) {
      setFormData((prevData) => ({
        ...prevData,
        tournamentRegistrationDeadline: prevData.tournamentDate,
      }));
    }
  }, [formData.tournamentDate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle nested state updates
  const handleNestedChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    key: keyof typeof formData
  ) => {
    const { name, value } = e.target;
  
    setFormData((prevData) => {
      const target = prevData[key];
  
      if (Array.isArray(target)) {
        // Find the index of the element to update (e.g., prizes array)
        const index = Number(e.target.dataset.index);
        return {
          ...prevData,
          [key]: target.map((item, i) =>
            i === index ? { ...item, [name]: value } : item
          ),
        };
      } else if (typeof target === "object") {
        // Handle nested objects
        return {
          ...prevData,
          [key]: {
            ...target,
            [name]: value,
          },
        };
      }
  
      return prevData;
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Submit form data to the backend
    const response = await fetch("/api/Tournaments/Create-tournament", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });
    const result = await response.json();
    alert(result.message);
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/images/brawlhalla-bg-3.jpg')] bg-cover">
      <h1 className="text-3xl sm:text-4xl font-bold mb-12 text-white">
        Create A Tournament
      </h1>
      <form
        onSubmit={handleSubmit}
        className="shadow-gray-400 text-white bg-gray-800 rounded-lg w-[85%] xl:w-[40%] sm:w-1/3 md:w-full p-4 sm:p-8 shadow-xl flex flex-col gap-6 max-w-xl mb-8"
      >
        {/* Tournament Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="tournamentName" className="text-lg font-medium">
            Tournament Name
          </label>
          <input
            type="text"
            id="tournamentName"
            name="tournamentName"
            placeholder="e.g trial of the damned"
            className={createTournamentInputStyles}
            value={formData.tournamentName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Tournament Description */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="tournamentDescription"
            className="text-lg font-medium"
          >
            Tournament Description
          </label>
          <textarea
            id="tournamentDescription"
            name="tournamentDescription"
            placeholder="e.g Participants will battle it out to be the best and earn money and other prizes"
            className={createTournamentInputStyles}
            value={formData.tournamentDescription}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex lg:flex-row flex-col md:items-center gap-8 lg:gap-40 2xl:gap-32">
          {/* Tournament Date */}
          <div className="flex flex-col gap-2">
            <label htmlFor="tournamentDate" className="text-lg font-medium">
              Tournament Date
            </label>
            <input
              type="date"
              id="tournamentDate"
              name="tournamentDate"
              className={`${createTournamentInputStyles} sm:w-44`}
              value={formData.tournamentDate}
              onChange={handleChange}
              required
            />
          </div>
          {/* Tournament Registration Deadline */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="tournamentRegistrationDeadline"
              className="text-md font-medium"
            >
              Registration Deadline
            </label>
            <input
              type="date"
              id="tournamentRegistrationDeadline"
              name="tournamentRegistrationDeadline"
              className={`${createTournamentInputStyles} sm:w-44`}
              value={formData.tournamentRegistrationDeadline}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="flex lg:flex-row flex-col gap-8 md:items-center lg:gap-40 2xl:gap-32">
          {/* Tournament Time */}
          <div className="flex flex-col gap-2">
            <label htmlFor="tournamentTime" className="text-lg font-medium">
              Tournament Time
            </label>
            <input
              type="time"
              id="tournamentTime"
              name="tournamentTime"
              className={`${createTournamentInputStyles} sm:w-44`}
              value={formData.tournamentTime}
              onChange={handleChange}
              required
            />
          </div>

          {/* Max Participants */}
          <div className="flex flex-col gap-2">
            <label htmlFor="maxParticipants" className="text-lg font-medium text-center">
              Max Participants
            </label>
            <input
              type="number"
              id="maxParticipants"
              name="maxParticipants"
              placeholder="e.g 100"
              className={`${createTournamentInputStyles} sm:w-44`}
              value={formData.maxParticipants}
              onChange={handleChange}
              required
            />
          </div>
        </div>
          {/* Tournament Format */}
          <div className="flex flex-col gap-2 sm:items-center md:items-start">
            <label htmlFor="tournamentFormat" className="text-lg font-medium">
              Tournament Format
            </label>
            <input
              type="text"
              id="tournamentType"
              name="tournamentType"
              placeholder="e.g single elimination"
              className={`${createTournamentInputStyles} sm:w-56 md:w-full`}
              value={formData.tournamentFormat.tournamentType}
              onChange={(e) => handleNestedChange(e, "tournamentFormat")}
            />         
        </div>

        <label htmlFor="prizes" className="text-2xl font-bold underline text-center">
          Prizes:
        </label>

        {/* Prizes */}
        <div className="flex lg:flex-row flex-col gap-2">
          <label htmlFor="position" className="text-lg font-medium sm:w-1/3">
            1st Place
          </label>
          <input
            type="text"
            id="prizes"
            name="reward"
            placeholder="Enter the prize reward for first place"
            className={createTournamentInputStyles}
            value={formData.prizes[0].reward}
            onChange={(e) => handleNestedChange(e, "prizes")}
            data-index="0"
            required
          />
        </div>
        <div className="flex lg:flex-row flex-col gap-2">
          <label htmlFor="position" className="text-lg font-medium sm:w-1/3">
            2nd Place
          </label>
          <input
            type="text"
            id="prizes"
            name="reward"
            placeholder="Enter the prize reward for second place"
            className={createTournamentInputStyles}
            value={formData.prizes[1].reward}
            onChange={(e) => handleNestedChange(e, "prizes")}
            data-index="1"
            required
          />
        </div>
        <div className="flex lg:flex-row flex-col gap-2">
          <label htmlFor="position" className="text-lg font-medium sm:w-1/3">
            3rd Place
          </label>
          <input
            type="text"
            id="prizes"
            name="reward"
            placeholder="Enter the prize reward for third place"
            className={createTournamentInputStyles}
            value={formData.prizes[2].reward}
            onChange={(e) => handleNestedChange(e, "prizes")}
            data-index="2"
            required
          />
        </div>

        {/* Entry Fee */}
        <div className="flex lg:flex-row flex-col gap-2 ">
          <label htmlFor="entryFee" className="text-lg font-medium sm:w-1/3">
            Entry Fee
          </label>
          <input
            type="text"
            id="entryFeeAmount"
            name="amount"
            placeholder="Amount (0 for free tournaments)"
            className={createTournamentInputStyles}
            value={formData.entryFee.amount}
            onChange={(e) => handleNestedChange(e, "entryFee")}
          />
        </div>
        {/* Entry currency */}
        <div className="flex lg:flex-row flex-col gap-2">
          <label htmlFor="entryFeeCurrency" className="text-lg font-medium sm:w-1/3">
            Entry Fee Currency
          </label>
          <select
            id="entryFeeCurrency"
            name="currency"
            className={`${createTournamentInputStyles} text-black`}
            value={formData.entryFee.currency}
            onChange={(e) => handleNestedChange(e, "entryFee")}
          >
            <option value="USD">USD</option>
            <option value="EUR">Euro</option>
            <option value="GBP">British Pound</option>
            <option value="JPY">Japanese Yen</option>
          </select>
        </div>

        {/* Tournament Image
        <div className="flex flex-col gap-2">
          <label htmlFor="tournamentImage" className="text-lg font-medium">
            Tournament Image URL
          </label>
          <input
            type="text"
            id="tournamentImage"
            name="tournamentImage"
            placeholder="Enter image URL (optional)"
            className={createTournamentInputStyles}
            value={formData.tournamentImage}
            onChange={handleChange}
          />
        </div> */}

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 mt-4"
        >
          Create Tournament
        </button>
      </form>
    </div>
  );
};

export default CreateTournament;