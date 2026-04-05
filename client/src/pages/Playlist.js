import React from "react";
import Loader from "../components/Loader";
import { useVideos } from "../hooks/useVideos";
import { getCollections, getVideosByIds } from "../utils/storage";

const Playlist = () => {
    const { videos, loading } = useVideos();
    const playlists = getCollections().playlists;

    if (loading) {
        return <Loader label="Loading playlists..." />;
    }

    return (
        <div className="flex-1 bg-slate-50 p-4 sm:p-6 md:p-8">
            <div className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
                <h1 className="text-3xl font-bold text-slate-900">Playlists</h1>
                <div className="mt-8 grid gap-5 lg:grid-cols-2">
                    {playlists.map((playlist) => {
                        const playlistVideos = getVideosByIds(playlist.videoIds, videos);

                        return (
                            <div key={playlist.id} className="rounded-3xl border border-slate-200 p-6">
                                <h2 className="text-xl font-semibold text-slate-900">{playlist.name}</h2>
                                <p className="mt-2 text-sm text-slate-600">{playlist.description}</p>
                                <p className="mt-3 text-xs font-medium uppercase tracking-[0.25em] text-slate-400">
                                    {playlistVideos.length} videos
                                </p>
                                <div className="mt-5 space-y-3">
                                    {playlistVideos.map((video) => (
                                        <div key={video._id} className="flex items-center gap-3">
                                            <img
                                                src={video.thumbnail}
                                                alt={video.title}
                                                className="h-16 w-28 rounded-xl object-cover"
                                            />
                                            <div>
                                                <p className="font-medium text-slate-900">{video.title}</p>
                                                <p className="text-sm text-slate-500">{video.owner?.fullName}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Playlist;
