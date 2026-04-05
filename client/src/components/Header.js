import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineMenu, AiOutlineBell } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import { IoMdMic } from "react-icons/io";
import { RiVideoAddLine } from "react-icons/ri";

function Header({ isLoggedIn, user, onLogout, onToggleSidebar }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isListening, setIsListening] = useState(false);
    const navigate = useNavigate();

    const SpeechRecognition = useMemo(
        () => window.SpeechRecognition || window.webkitSpeechRecognition,
        []
    );

    function handleSearch(event) {
        event.preventDefault();
        const trimmedSearch = searchTerm.trim();
        navigate(trimmedSearch ? `/?q=${encodeURIComponent(trimmedSearch)}` : "/");
    }

    function handleMicSearch() {
        if (!SpeechRecognition) {
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);
        recognition.onresult = (event) => {
            const transcript = event.results?.[0]?.[0]?.transcript || "";
            setSearchTerm(transcript);
            navigate(transcript ? `/?q=${encodeURIComponent(transcript)}` : "/");
        };

        recognition.start();
    }

    return (
        <div className="sticky top-0 z-30 flex w-full flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur md:px-6">
            <div className="flex items-center space-x-4">
                <button
                    type="button"
                    onClick={onToggleSidebar}
                    className="rounded-full bg-slate-100 p-2 text-4xl text-slate-700 transition hover:bg-slate-200"
                    aria-label="Toggle navigation menu"
                >
                    <AiOutlineMenu />
                </button>
                <Link to="/">
                    <div className="flex items-center gap-3">
                        <img src="/hub.png" alt="Logo" className="w-24 cursor-pointer" />
                    </div>
                </Link>
            </div>

            <form onSubmit={handleSearch} className="order-3 flex w-full items-center md:order-2 md:max-w-2xl">
                <div className="w-full rounded-l-full border border-slate-300 px-4 py-3">
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full outline-none"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    className="rounded-r-full border border-l-0 border-slate-300 bg-slate-100 px-5 py-3 hover:bg-slate-200"
                >
                    <CiSearch size="24px" />
                </button>
                <button
                    type="button"
                    onClick={handleMicSearch}
                    disabled={!SpeechRecognition}
                    className={`ml-3 hidden rounded-full border border-slate-300 p-2 sm:block ${
                        isListening ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-700"
                    } ${!SpeechRecognition ? "cursor-not-allowed opacity-50" : ""}`}
                    title={SpeechRecognition ? "Voice search" : "Voice search not supported"}
                >
                    <IoMdMic size="26px" />
                </button>
            </form>

            {isLoggedIn ? (
                <div className="order-2 flex items-center gap-3 md:order-3 md:gap-4">
                    <Link to="/your-videos" className="hidden rounded-full bg-red-50 p-2 text-red-600 md:block">
                        <RiVideoAddLine className="text-2xl" />
                    </Link>
                    <AiOutlineBell className="hidden text-2xl text-slate-700 md:block" />
                    <Link to="/profile" className="flex items-center gap-3 rounded-full border border-slate-200 px-2 py-1">
                        <img
                            src={user?.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=YT"}
                            alt={user?.fullName || "User"}
                            className="h-9 w-9 rounded-full object-cover"
                        />
                        <span className="hidden text-sm font-medium text-slate-700 md:block">
                            {user?.fullName || "Creator"}
                        </span>
                    </Link>
                    <button
                        type="button"
                        onClick={onLogout}
                        className="hidden rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 md:block"
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <div className="order-2 flex items-center gap-3 md:order-3">
                    <Link to="/signup" className="hidden text-sm font-medium text-slate-600 sm:block">
                        Sign up
                    </Link>
                    <Link
                        to="/login"
                        className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-blue-600"
                    >
                        Login
                    </Link>
                </div>
            )}
        </div>
    );
}

export default Header;
