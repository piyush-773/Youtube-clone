import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { defaultUser } from "../utils/mockData";

const UpdateProfile = ({ user }) => {
    const profile = user?.username ? user : defaultUser;
    const navigate = useNavigate();
    const [bio, setBio] = useState(
        "Creator focused on building a polished fullstack video platform."
    );

    return (
        <div className="flex-1 bg-slate-50 p-4 sm:p-6 md:p-8">
            <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
                <h1 className="text-3xl font-bold text-slate-900">Update profile</h1>
                <form className="mt-8 grid gap-4 md:grid-cols-2">
                    <input
                        defaultValue={profile.fullName}
                        className="rounded-2xl border border-slate-300 bg-slate-50 p-3"
                    />
                    <input
                        defaultValue={profile.username}
                        className="rounded-2xl border border-slate-300 bg-slate-50 p-3"
                    />
                    <input
                        defaultValue={profile.email}
                        className="rounded-2xl border border-slate-300 bg-slate-50 p-3 md:col-span-2"
                    />
                    <textarea
                        rows="5"
                        value={bio}
                        onChange={(event) => setBio(event.target.value)}
                        className="rounded-2xl border border-slate-300 bg-slate-50 p-3 md:col-span-2"
                    />
                    <div className="flex flex-col gap-3 md:col-span-2 sm:flex-row">
                        <button className="rounded-2xl bg-red-600 px-6 py-3 font-semibold text-white">
                            Save changes
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="rounded-2xl border border-slate-300 px-6 py-3 font-semibold text-slate-700"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateProfile;
