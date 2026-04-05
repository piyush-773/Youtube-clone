import React from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { useVideos } from "../hooks/useVideos";
import { loadAuthState } from "../utils/storage";

const YourChannel = () => {
    const { videos, loading } = useVideos();
    const authState = loadAuthState();

    if (loading) {
        return <Loader label="Loading channel..." />;
    }

    const channelVideos = videos.filter(
        (video) => video.owner?.username === authState.user?.username
    );
    const uploads = channelVideos.length ? channelVideos : videos.slice(0, 4);
    const totalViews = uploads.reduce((sum, video) => sum + (video.views || 0), 0);
    const channelOwner = authState.user || uploads[0]?.owner;
    const latestUpload = uploads[0];

    return (
        <div className="flex-1 bg-slate-50 p-4 sm:p-6 md:p-8">
            <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
                <div
                    className="h-48 bg-cover bg-center sm:h-60"
                    style={{
                        backgroundImage: `url(${
                            channelOwner?.coverImage || latestUpload?.thumbnail
                        })`,
                    }}
                />
                <div className="p-6 sm:p-8">
                    <div className="-mt-16 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div className="flex items-end gap-4">
                            <img
                                src={channelOwner?.avatar || latestUpload?.thumbnail}
                                alt={channelOwner?.fullName || "Channel"}
                                className="h-24 w-24 rounded-full border-4 border-white bg-white object-cover sm:h-28 sm:w-28"
                            />
                            <div className="pb-2">
                                <h1 className="text-3xl font-bold text-slate-900">
                                    {channelOwner?.fullName || "Your Channel"}
                                </h1>
                                <p className="text-slate-500">@{channelOwner?.username || "creator"}</p>
                            </div>
                        </div>
                        <Link
                            to="/your-videos"
                            className="inline-flex rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white"
                        >
                            Manage videos
                        </Link>
                    </div>

                    <div className="mt-8 grid gap-4 md:grid-cols-3">
                        <div className="rounded-3xl bg-slate-50 p-5">
                            <p className="text-sm text-slate-500">Uploads</p>
                            <p className="mt-2 text-2xl font-bold text-slate-900">{uploads.length}</p>
                        </div>
                        <div className="rounded-3xl bg-slate-50 p-5">
                            <p className="text-sm text-slate-500">Total views</p>
                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                {totalViews.toLocaleString()}
                            </p>
                        </div>
                        <div className="rounded-3xl bg-slate-50 p-5">
                            <p className="text-sm text-slate-500">Latest upload</p>
                            <p className="mt-2 text-lg font-semibold text-slate-900">
                                {latestUpload?.title || "No uploads yet"}
                            </p>
                        </div>
                    </div>

                    <div className="mt-10 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
                        <div className="rounded-3xl border border-slate-200 p-5">
                            <h2 className="text-xl font-semibold text-slate-900">Recent uploads</h2>
                            <div className="mt-5 space-y-4">
                                {uploads.map((video) => (
                                    <div
                                        key={video._id}
                                        className="grid gap-4 rounded-3xl bg-slate-50 p-4 md:grid-cols-[180px_minmax(0,1fr)]"
                                    >
                                        <img
                                            src={video.thumbnail}
                                            alt={video.title}
                                            className="aspect-video w-full rounded-2xl object-cover"
                                        />
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-900">
                                                {video.title}
                                            </h3>
                                            <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                                                {video.description}
                                            </p>
                                            <p className="mt-3 text-xs text-slate-500">
                                                {(video.views || 0).toLocaleString()} views
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200 p-5">
                            <h2 className="text-xl font-semibold text-slate-900">Channel notes</h2>
                            <p className="mt-3 text-sm leading-7 text-slate-600">
                                Keep this page focused on your own channel summary, latest uploads,
                                and quick access to creator actions.
                            </p>
                            <div className="mt-6 rounded-3xl bg-slate-50 p-5">
                                <p className="text-sm text-slate-500">Creator email</p>
                                <p className="mt-2 font-semibold text-slate-900">
                                    {channelOwner?.email || "Not available"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default YourChannel;
