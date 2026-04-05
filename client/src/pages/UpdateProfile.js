import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../components/AxiosInstance";
import { persistAuthState } from "../utils/storage";

const UpdateProfile = ({ user, setUser }) => {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState(user?.fullName || "");
    const [email, setEmail] = useState(user?.email || "");
    const [avatar, setAvatar] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();
        setSaving(true);
        setError("");

        try {
            const response = await axiosInstance.patch("user/update-account", {
                fullName,
                email,
            });

            let updatedUser = {
                ...(user || {}),
                ...(response.data?.data || {}),
                fullName,
                email,
            };

            if (avatar) {
                const avatarFormData = new FormData();
                avatarFormData.append("avatar", avatar);
                const avatarResponse = await axiosInstance.patch("user/update-avatar", avatarFormData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                updatedUser = { ...updatedUser, ...(avatarResponse.data?.data || {}) };
            }

            if (coverImage) {
                const coverFormData = new FormData();
                coverFormData.append("coverImage", coverImage);
                const coverResponse = await axiosInstance.patch(
                    "user/update-cover-image",
                    coverFormData,
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                    }
                );
                updatedUser = { ...updatedUser, ...(coverResponse.data?.data || {}) };
            }

            persistAuthState(updatedUser);
            setUser(updatedUser);
            navigate("/profile");
        } catch (apiError) {
            setError(apiError.response?.data?.message || "Unable to update profile.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="flex-1 bg-slate-50 p-4 sm:p-6 md:p-8">
            <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
                <h1 className="text-3xl font-bold text-slate-900">Update profile</h1>
                <form className="mt-8 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-900">
                            Full name <span className="text-red-500">*</span>
                        </label>
                        <input
                            value={fullName}
                            onChange={(event) => setFullName(event.target.value)}
                            className="w-full rounded-2xl border border-slate-300 bg-slate-50 p-3"
                            placeholder="Full name"
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-900">
                            Username
                        </label>
                        <input
                            value={user?.username || ""}
                            readOnly
                            className="w-full rounded-2xl border border-slate-200 bg-slate-100 p-3 text-slate-500"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-slate-900">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="w-full rounded-2xl border border-slate-300 bg-slate-50 p-3"
                            placeholder="Email"
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-900">
                            New profile image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => setAvatar(event.target.files?.[0] || null)}
                            className="w-full rounded-2xl border border-slate-300 bg-slate-50 p-3"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-900">
                            New cover image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => setCoverImage(event.target.files?.[0] || null)}
                            className="w-full rounded-2xl border border-slate-300 bg-slate-50 p-3"
                        />
                    </div>
                    {error ? <p className="text-sm text-red-600 md:col-span-2">{error}</p> : null}
                    <div className="flex flex-col gap-3 md:col-span-2 sm:flex-row">
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-2xl bg-red-600 px-6 py-3 font-semibold text-white disabled:opacity-60"
                        >
                            {saving ? "Processing..." : "Save changes"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="rounded-2xl border border-slate-300 px-6 py-3 font-semibold text-slate-700"
                        >
                            Cancel
                        </button>
                    </div>
                    {saving ? (
                        <p className="text-xs text-slate-500 md:col-span-2">
                            Processing your request...
                        </p>
                    ) : null}
                </form>
            </div>
        </div>
    );
};

export default UpdateProfile;
