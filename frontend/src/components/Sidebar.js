import React from "react";
import { GoHome } from "react-icons/go";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions, MdHistory } from "react-icons/md";
import { PiUserSquareThin } from "react-icons/pi";
import { AiOutlineLike } from "react-icons/ai";
import { MdOutlineWatchLater } from "react-icons/md";
import { AiOutlinePlaySquare } from "react-icons/ai";
import { RiPlayList2Line } from "react-icons/ri";

function sidebar() {
  const sidebarItems = [
    {
      id: 1,
      name: "Home",
      icon: <GoHome />,
    },
    {
      id: 2,
      name: "Shorts",
      icon: <SiYoutubeshorts />,
    },
    {
      id: 3,
      name: "Subscription",
      icon: <MdOutlineSubscriptions />,
    },
    {
      id: 4,
      name: "Your channel",
      icon: <PiUserSquareThin />,
    },
    {
      id: 5,
      name: "History",
      icon: <MdHistory />,
    },
    {
      id: 6,
      name: "Playlists",
      icon: <RiPlayList2Line />,
    },
    {
      id: 7,
      name: "Your videos",
      icon: <AiOutlinePlaySquare />,
    },
    {
      id: 8,
      name: "Watch later",
      icon: <MdOutlineWatchLater />,
    },
    {
      id: 9,
      name: "Liked videos",
      icon: <AiOutlineLike />,
    },
  ];

  return (
    <div className="px-6 w-[15%] mt-[75px] h-[calc(100vh-5.25rem)] border border-gray-400">
      <div className="items-center space-y-2">
        {sidebarItems.map((item) => {
          return (
            <div
              key={item.id}
              className="flex items-center space-x-6 hover:bg-gray-300 duration-300 rounded-xl p-1 cursor-pointer"
            >
              {item.icon}
              <span>{item.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default sidebar;
