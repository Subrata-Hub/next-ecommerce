import React from "react";
import { IoIosSearch } from "react-icons/io";

const Searchbar = () => {
  return (
    <div className="relative w-full xl:w-[500px] 2xl:w-[400px] rounded-xl bg-gray-200">
      <input
        type="search"
        placeholder="enter your text"
        className="w-full h-[55px] px-4 relative"
      />
      <IoIosSearch className="absolute top-[40%] right-2" />
    </div>
  );
};

export default Searchbar;
