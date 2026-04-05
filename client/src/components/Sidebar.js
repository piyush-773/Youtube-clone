import React from "react";
import { GoHome } from "react-icons/go";
import { MdOutlineSubscriptions, MdHistory, MdOutlineWatchLater } from "react-icons/md";
import { PiUserSquareThin } from "react-icons/pi";
import { AiOutlineLike, AiOutlinePlaySquare } from "react-icons/ai";
import { RiPlayList2Line } from "react-icons/ri";
import { NavLink } from "react-router-dom";

function Sidebar({ isOpen, isCollapsed, onClose }) {
    const sidebarItems = [
        { id: 1, path: "/", name: "Home", icon: <GoHome /> },
        { id: 2, path: "/subscriptions", name: "Subscriptions", icon: <MdOutlineSubscriptions /> },
        { id: 3, path: "/your-channel", name: "Your channel", icon: <PiUserSquareThin /> },
        { id: 4, path: "/history", name: "History", icon: <MdHistory /> },
        { id: 5, path: "/playlist", name: "Playlists", icon: <RiPlayList2Line /> },
        { id: 6, path: "/your-videos", name: "Your videos", icon: <AiOutlinePlaySquare /> },
        { id: 7, path: "/watch-later", name: "Watch later", icon: <MdOutlineWatchLater /> },
        { id: 8, path: "/liked-videos", name: "Liked videos", icon: <AiOutlineLike /> },
    ];

    return (
        <>
            {isOpen ? (
                <button
                    type="button"
                    onClick={onClose}
                    className="fixed inset-0 z-20 bg-black/40 lg:hidden"
                    aria-label="Close navigation"
                />
            ) : null}

            <div
                className={`fixed left-0 top-[73px] z-30 h-[calc(100vh-73px)] border-r border-slate-200 bg-white px-3 py-6 transition-transform duration-300 lg:sticky lg:top-[73px] lg:z-10 lg:translate-x-0 ${
                    isCollapsed ? "lg:w-24" : "lg:w-72"
                } ${isOpen ? "translate-x-0" : "-translate-x-full"} w-72`}
            >
                <div className="items-center space-y-2">
                    {sidebarItems.map((item) => (
                        <NavLink to={item.path} key={item.id} onClick={onClose}>
                            {({ isActive }) => (
                                <div
                                    className={`flex items-center rounded-2xl p-3 text-sm font-medium transition ${
                                        isActive
                                            ? "bg-red-50 text-red-600"
                                            : "text-slate-700 hover:bg-slate-100"
                                    } ${isCollapsed ? "justify-center lg:px-2" : "space-x-4"}`}
                                    title={item.name}
                                >
                                    <span className="text-lg">{item.icon}</span>
                                    <span className={isCollapsed ? "lg:hidden" : ""}>{item.name}</span>
                                </div>
                            )}
                        </NavLink>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Sidebar;
