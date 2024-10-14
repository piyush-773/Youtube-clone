import React from "react";
import Avatar from "react-avatar";
import { AiOutlineMenu } from "react-icons/ai";
import { AiOutlineBell } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import { IoMdMic } from "react-icons/io";
import { RiVideoAddLine } from "react-icons/ri";

function Header() {
  return (
    <div className="flex fixed w-[100%] top-0 bg-white justify-between px-6 py-2">
      <div className="flex items-center space-x-5">
        <AiOutlineMenu className="text-4xl rounded-full cursor-pointer bg-gray-100 hover:bg-gray-200 delay-200 p-2" />
        <img src="./hub.png" alt="" className="w-24 cursor-pointer px-3 bg-gray-100" />
      </div>
      <div className="flex items-center w-[35%]">
        <div className="w-[100%] px-3 py-2 border rounded-l-full">
          <input
            type="text"
            placeholder="Search here"
            className="w-full outline-none"
          />
        </div>
        <button className="px-4 py-2 rounded-r-full bg-gray-100 hover:bg-gray-200 duration-200">
          <CiSearch size="24px" />
        </button>
        <IoMdMic
          size="42px"
          className="rounded-full m-3 border p-2 bg-gray-100 cursor-pointer hover:bg-gray-200 duration-200"
        />
      </div>
      <div className="flex space-x-5 items-center">
        <RiVideoAddLine className="text-2xl cursor-pointer" />
        <AiOutlineBell  className="text-2xl cursor-pointer"/>
        <Avatar src="./logo.png" size="32" round={true} className="cursor-pointer"/> 
      </div>
    </div>
  );
}

export default Header;
