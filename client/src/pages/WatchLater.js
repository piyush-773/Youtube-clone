import React from "react";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import { useVideos } from "../hooks/useVideos";
import { getCollections, getVideosByIds, loadAuthState } from "../utils/storage";

const WatchLater = () => {
    const { videos, loading } = useVideos();
    const authState = loadAuthState();
    const collections = getCollections(authState.user?._id || authState.user?.username || "guest");
    const savedVideos = getVideosByIds(collections.watchLater, videos);

    if (loading) {
        return <Loader label="Loading watch later..." />;
    }

    return (
        <div className="flex-1 bg-slate-50 p-4 sm:p-6 md:p-8">
            <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
                <div className="rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-6 text-white shadow-sm">
                    <p className="text-sm uppercase tracking-[0.25em] text-slate-300">Queue</p>
                    <h1 className="mt-3 text-3xl font-bold">Watch later</h1>
                    <p className="mt-3 text-sm leading-7 text-slate-200">
                        Only videos you saved for later are shown here.
                    </p>
                    <div className="mt-8 rounded-3xl bg-white/10 p-5">
                        <p className="text-sm text-slate-300">Saved videos</p>
                        <p className="mt-2 text-4xl font-bold">{savedVideos.length}</p>
                    </div>
                </div>

                {savedVideos.length ? (
                    <div className="space-y-4">
                        {savedVideos.map((video) => (
                            <div
                                key={video._id}
                                className="grid gap-4 rounded-3xl bg-white p-4 shadow-sm md:grid-cols-[220px_minmax(0,1fr)]"
                            >
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="aspect-video w-full rounded-2xl object-cover"
                                />
                                <div className="min-w-0">
                                    <h2 className="line-clamp-2 text-lg font-semibold text-slate-900">
                                        {video.title}
                                    </h2>
                                    <p className="mt-2 text-sm text-slate-500">
                                        {video.owner?.fullName} • {Math.floor((video.duration || 0) / 60)} min
                                    </p>
                                    <p className="mt-3 line-clamp-2 text-sm text-slate-600">
                                        {video.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <ErrorState
                        title="Nothing saved yet"
                        message="Save videos to Watch later from the player page and they will appear here."
                    />
                )}
            </div>
        </div>
    );
};

export default WatchLater;
