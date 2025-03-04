"use client";
import { IoIosSearch } from "react-icons/io";

const Search = () => {
  return (
    <div className="flex justify-center text-center items-center bg-white rounded-xl shadow-md p-4 w-1/2 lg:w-[300px]">
        <div className="flex justify-between items-center w-full">
            <input type="text" placeholder="Search" className="w-full bg-transparent outline-none text-black" />
            <IoIosSearch color="black" size={24}/>
        </div>
    </div>
  );
};

export default Search;
