"use client";

import { createTournamentInputStyles } from "@/app/Cosntants/constants";
import { useState } from "react";

const CreateTournament = () => {
  const [formData, setFormData] = useState({
    tournamentName: "",
    tournamentDescription: "",
    tournamentDate: "",
    tournamentRegistrationDeadline: "",
    tournamentTime: "",
    maxParticipants: "",
    tournamentFormat: "",
    tournamentImage: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add form submission logic here
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/images/brawlhalla-bg-3.jpg')] bg-cover">
      <h1 className="text-3xl sm:text-4xl font-bold mb-12 text-white">Create A Tournament</h1>
      <form
        onSubmit={handleSubmit}
        className="shadow-gray-400 text-white bg-gray-800 rounded-lg w-[85%] sm:w-1/4 p-4 sm:p-8 shadow-xl flex flex-col gap-6 max-w-2xl mb-8"
      >
        {/* Tournament Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="tournamentName" className="text-lg font-medium">
            Tournament Name
          </label>
          <input
            type="text"
            id="tournamentName"
            placeholder="Trial of Ymir..."
            className={createTournamentInputStyles}
            value={formData.tournamentName}
            onChange={handleChange}
            name="tournamentName"
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
            placeholder="Describe your tournament..."
            className={`${createTournamentInputStyles} resize-none h-32`}
            value={formData.tournamentDescription}
            onChange={handleChange}
            name="tournamentDescription"
            required
          />
        </div>

        {/* Tournament Date */}
        <div className="flex flex-col gap-2">
          <label htmlFor="tournamentDate" className="text-lg font-medium">
            Tournament Date
          </label>
          <input
            type="date"
            id="tournamentDate"
            className={createTournamentInputStyles}
            value={formData.tournamentDate}
            onChange={handleChange}
            name="tournamentDate"
            required
          />
        </div>

        {/* Registration Deadline */}
        <div className="flex flex-col gap-2">
          <label htmlFor="tournamentRegistrationDeadline" className="text-lg font-medium">
            Partcipant Registration Deadline
          </label>
          <input
            type="date"
            id="tournamentRegistrationDeadline"
            className={createTournamentInputStyles}
            value={formData.tournamentRegistrationDeadline}
            onChange={handleChange}
            name="tournamentRegistrationDeadline"
            required
          />
        </div>

        {/* Tournament Time */}
        <div className="flex flex-col gap-2">
          <label htmlFor="tournamentTime" className="text-lg font-medium">
            Tournament Time
          </label>
          <input
            type="time"
            id="tournamentTime"
            className={createTournamentInputStyles}
            value={formData.tournamentTime}
            onChange={handleChange}
            name="tournamentTime"
            required
          />
        </div>

        {/* Max Participants */}
        <div className="flex flex-col gap-2">
          <label htmlFor="maxParticipants" className="text-lg font-medium">
            Max Participants
          </label>
          <input
            type="text"
            id="maxParticipants"
            placeholder="Enter maximum participants..."
            className={createTournamentInputStyles}
            value={formData.maxParticipants}
            onChange={handleChange}
            name="maxParticipants"
            required
          />
        </div>

        {/* Tournament Format */}
        <div className="flex flex-col gap-2">
          <label htmlFor="tournamentFormat" className="text-lg font-medium">
            Tournament Format
          </label>
          <input
            type="text"
            id="tournamentFormat"
            placeholder="e.g., Single Elimination"
            className={createTournamentInputStyles}
            value={formData.tournamentFormat}
            onChange={handleChange}
            name="tournamentFormat"
            required
          />
        </div>

        {/* Tournament Image */}
        <div className="flex flex-col gap-2">
          <label htmlFor="tournamentImage" className="text-lg font-medium">
            Tournament Image (URL)
          </label>
          <input
            type="url"
            id="tournamentImage"
            placeholder="Image URL..."
            className={createTournamentInputStyles}
            value={formData.tournamentImage}
            onChange={handleChange}
            name="tournamentImage"
          />
        </div>

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
