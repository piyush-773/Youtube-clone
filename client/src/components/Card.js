import React from "react";
import { Link } from "react-router-dom";

const Card = ({ video }) => {
    const ownerName =
        video.owner?.fullName || video.owner?.username || video.owner?.email || "Unknown";

    return (
        <Link
            to={`/watch/${video._id}`}
            className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
        >
            <div className="relative aspect-video overflow-hidden bg-slate-100">
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <span className="absolute bottom-3 right-3 rounded-lg bg-black/80 px-2 py-1 text-xs font-semibold text-white">
                    {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, "0")}
                </span>
            </div>

            <div className="space-y-3 p-4">
                <div className="flex items-start gap-3">
                    <img
                        src={video.owner?.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=YT"}
                        alt={ownerName}
                        className="mt-1 h-10 w-10 rounded-full bg-slate-100 object-cover"
                    />
                    <div className="min-w-0">
                        <h3 className="line-clamp-2 text-base font-semibold text-slate-900">
                            {video.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">{ownerName}</p>
                        <p className="text-xs text-slate-500">
                            {video.views?.toLocaleString?.() || 0} views
                        </p>
                    </div>
                </div>
                <p className="line-clamp-2 text-sm text-slate-600">{video.description}</p>
            </div>
        </Link>
    );
};

export default Card;
