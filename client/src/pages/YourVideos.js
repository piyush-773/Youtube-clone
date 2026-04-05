import React from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { useVideos } from "../hooks/useVideos";
import { loadAuthState } from "../utils/storage";

const YourVideos = () => {
    const { videos, loading } = useVideos();
    const authState = loadAuthState();

    if (loading) {
        return <Loader label="Loading uploads..." />;
    }

    const uploads =
        videos.filter(
            (video) =>
                video.owner?.username &&
                authState.user?.username &&
                video.owner.username === authState.user.username
        ).length > 0
            ? videos.filter((video) => video.owner?.username === authState.user?.username)
            : videos.slice(0, 4);

    return (
        <div className="flex-1 bg-slate-50 p-4 sm:p-6 md:p-8">
            <div className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
                            Studio
                        </p>
                        <h1 className="mt-2 text-3xl font-bold text-slate-900">Your uploaded videos</h1>
                    </div>
                    <button className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white">
                        Upload video
                    </button>
                </div>
                <div className="space-y-4">
                    {uploads.map((video) => (
                        <div
                            key={video._id}
                            className="grid gap-4 rounded-3xl border border-slate-200 p-4 md:grid-cols-[220px_minmax(0,1fr)_auto]"
                        >
                            <img src={video.thumbnail} alt={video.title} className="aspect-video w-full rounded-2xl object-cover" />
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">{video.title}</h2>
                                <p className="mt-2 text-sm text-slate-600">{video.description}</p>
                                <p className="mt-3 text-xs text-slate-500">{(video.views || 0).toLocaleString()} views</p>
                            </div>
                            <div className="flex items-start">
                                <Link
                                    to={`/videos/${video._id}/edit`}
                                    className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
                                >
                                    Edit
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default YourVideos;
