import React from "react";
import { Link } from "react-router-dom";
import { defaultUser } from "../utils/mockData";
import { useVideos } from "../hooks/useVideos";

const Profile = ({ user }) => {
    const profile = user?.username ? user : defaultUser;
    const { videos } = useVideos();
    const ownVideos = videos.filter((video) => video.owner?.username === profile.username);
    const totalViews = ownVideos.reduce((sum, video) => sum + (video.views || 0), 0);

    return (
        <div className="flex-1 bg-slate-50 p-6 md:p-8">
            <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
                <div
                    className="h-56 bg-cover bg-center"
                    style={{ backgroundImage: `url(${profile.coverImage || defaultUser.coverImage})` }}
                />
                <div className="p-6 md:p-8">
                    <div className="-mt-20 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div className="flex items-end gap-4">
                            <img
                                src={profile.avatar || defaultUser.avatar}
                                alt={profile.fullName}
                                className="h-28 w-28 rounded-full border-4 border-white bg-white object-cover"
                            />
                            <div className="pb-2">
                                <h1 className="text-3xl font-bold text-slate-900">{profile.fullName}</h1>
                                <p className="text-slate-500">@{profile.username}</p>
                            </div>
                        </div>
                        <Link
                            to="/profile/update"
                            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700"
                        >
                            Edit profile
                        </Link>
                    </div>
                    <div className="mt-8 grid gap-4 md:grid-cols-4">
                        <div className="rounded-3xl bg-slate-50 p-5">
                            <p className="text-sm text-slate-500">Email</p>
                            <p className="mt-2 font-semibold text-slate-900">{profile.email}</p>
                        </div>
                        <div className="rounded-3xl bg-slate-50 p-5">
                            <p className="text-sm text-slate-500">Uploads</p>
                            <p className="mt-2 text-2xl font-bold text-slate-900">{ownVideos.length}</p>
                        </div>
                        <div className="rounded-3xl bg-slate-50 p-5">
                            <p className="text-sm text-slate-500">Views</p>
                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                {totalViews.toLocaleString()}
                            </p>
                        </div>
                        <div className="rounded-3xl bg-slate-50 p-5">
                            <p className="text-sm text-slate-500">Role</p>
                            <p className="mt-2 font-semibold text-slate-900">Creator</p>
                        </div>
                    </div>

                    <div className="mt-8 grid gap-5 lg:grid-cols-2">
                        <div className="rounded-3xl border border-slate-200 p-5">
                            <h2 className="text-xl font-semibold text-slate-900">About</h2>
                            <p className="mt-3 text-sm leading-7 text-slate-600">
                                Manage your account details, channel identity, and creator activity
                                from this profile.
                            </p>
                        </div>
                        <div className="rounded-3xl border border-slate-200 p-5">
                            <h2 className="text-xl font-semibold text-slate-900">Quick actions</h2>
                            <div className="mt-4 flex flex-wrap gap-3">
                                <Link
                                    to="/your-channel"
                                    className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                                >
                                    View channel
                                </Link>
                                <Link
                                    to="/your-videos"
                                    className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
                                >
                                    Manage videos
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
