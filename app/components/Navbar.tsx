import { IoIosSearch } from "react-icons/io";
import { FaTrophy } from "react-icons/fa";

//to avoid repetition of styles, we can create a variable for the styles
const navDivStyles = `flex gap-2 cursor-pointer hover:bg-white hover:text-black transition duration-300 p-4 justify-start items-center`;

const NavBar = () => {
  return (
    <nav className="bg-[#0f1925] text-[#8392A5] fixed h-full w-36">
      <div className="flex justify-center">
        <img
          src="images/Duaelity_logo.png"
          alt="Duaelity logo"
          className="object-cover w-20 h-20"
        />
      </div>
      <div className={`${navDivStyles}`}> 
        <FaTrophy size={20}/>
        <span>Tournaments</span>
      </div>    
      <div className={`${navDivStyles}`}>
        <IoIosSearch />
        <span>Search</span>
      </div> 
      <div className={`${navDivStyles}`}>
        <IoIosSearch />
        <span>Search</span>
      </div> 
    </nav>
  );
};

export default NavBar;
