import React from "react";
import { useVideos } from "../hooks/useVideos";
import Loader from "../components/Loader";

const YourChannel = () => {
    const { videos, loading } = useVideos();

    if (loading) {
        return <Loader label="Loading channel..." />;
    }

    const featuredVideos = videos.slice(0, 3);
    const channelOwner = featuredVideos[0]?.owner;

    return (
        <div className="flex-1 bg-slate-50 p-4 sm:p-6 md:p-8">
            <div className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <img
                            src={channelOwner?.avatar || featuredVideos[0]?.thumbnail}
                            alt={channelOwner?.fullName || "Channel"}
                            className="h-20 w-20 rounded-full object-cover"
                        />
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">
                                {channelOwner?.fullName || "Your Channel"}
                            </h1>
                            <p className="text-slate-500">
                                @{channelOwner?.username || "creator"}
                            </p>
                        </div>
                    </div>
                    <div className="rounded-3xl bg-slate-50 px-6 py-4">
                        <p className="text-sm text-slate-500">Channel snapshot</p>
                        <p className="mt-1 text-lg font-semibold text-slate-900">
                            {videos.length} uploads available
                        </p>
                    </div>
                </div>
                <div className="mt-8 grid gap-4 md:grid-cols-3">
                    {featuredVideos.map((video) => (
                        <div key={video._id} className="rounded-3xl border border-slate-200 p-4">
                            <img src={video.thumbnail} alt={video.title} className="aspect-video w-full rounded-2xl object-cover" />
                            <h2 className="mt-4 font-semibold text-slate-900">{video.title}</h2>
                            <p className="mt-2 text-sm text-slate-600">{video.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default YourChannel;
