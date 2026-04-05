import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../components/AxiosInstance.js";
import { defaultUser } from "../utils/mockData.js";
import { persistAuthState } from "../utils/storage.js";

function Signup() {
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        setError("");

        const formData = new FormData();
        formData.append("fullName", fullName);
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);

        if (avatar) {
            formData.append("avatar", avatar);
        }

        if (coverImage) {
            formData.append("coverImage", coverImage);
        }

        try {
            const response = await axiosInstance.post("user/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const createdUser = response.data?.data || {
                ...defaultUser,
                fullName,
                username,
                email,
            };

            persistAuthState(createdUser);
            navigate("/login");
        } catch (apiError) {
            setError(apiError.response?.data?.message || "Unable to create account right now.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-1 items-center justify-center bg-slate-50 p-4 sm:p-6">
            <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
                        Start your channel
                    </p>
                    <h1 className="mt-2 text-3xl font-bold text-slate-900">Create your account</h1>
                </div>
                <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-900">
                            Full name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            name="fullName"
                            id="fullName"
                            placeholder="Full name"
                            className="w-full rounded-2xl border border-slate-300 bg-slate-50 p-3"
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-900">
                            Username <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            name="username"
                            id="username"
                            placeholder="Username"
                            className="w-full rounded-2xl border border-slate-300 bg-slate-50 p-3"
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-900">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-2xl border border-slate-300 bg-slate-50 p-3"
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-900">
                            Profile image
                        </label>
                        <input
                            type="file"
                            name="avatar"
                            id="avatar"
                            onChange={(e) => setAvatar(e.target.files?.[0] || null)}
                            className="w-full rounded-2xl border border-slate-300 bg-slate-50 p-3"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-900">
                            Cover image
                        </label>
                        <input
                            type="file"
                            name="coverImage"
                            id="coverImage"
                            onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                            className="w-full rounded-2xl border border-slate-300 bg-slate-50 p-3"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-900">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            name="password"
                            placeholder="Password"
                            className="w-full rounded-2xl border border-slate-300 bg-slate-50 p-3"
                            required
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-slate-900">
                            Confirm password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            name="confirmPassword"
                            placeholder="Confirm password"
                            className="w-full rounded-2xl border border-slate-300 bg-slate-50 p-3"
                            required
                        />
                    </div>
                    <p className="text-sm text-slate-500 md:col-span-2">
                        Profile and cover images are optional. You can add them later.
                    </p>
                    {error ? <p className="text-sm text-red-600 md:col-span-2">{error}</p> : null}
                    <div className="flex flex-col gap-3 md:col-span-2 sm:flex-row">
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-2xl bg-red-600 px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-40"
                        >
                            {loading ? "Processing..." : "Create account"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="rounded-2xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 sm:min-w-32"
                        >
                            Cancel
                        </button>
                    </div>
                    {loading ? (
                        <p className="text-xs text-slate-500 md:col-span-2">
                            Processing your request...
                        </p>
                    ) : null}
                </form>
                <p className="mt-6 text-sm text-slate-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-700">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;
