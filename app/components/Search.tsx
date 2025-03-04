"use client";
import { useState } from "react";
import { IoIosSearch } from "react-icons/io";

interface SearchProps {
  onSearch: (query: string) => void;
}

const Search = ({ onSearch }: SearchProps) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(e.target.value);
    onSearch(value);
  };

  return (
    <div className="flex justify-center text-center items-center bg-white rounded-xl shadow-md p-4 w-1/2 lg:w-[300px]">
      <div className="flex justify-between items-center w-full">
        <input
          type="text"
          placeholder="Search tournaments..."
          value={query}
          onChange={handleInputChange}
          className="w-full bg-transparent outline-none text-black"
        />
        <IoIosSearch color="black" size={24} />
      </div>
    </div>
  );
};

export default Search;
