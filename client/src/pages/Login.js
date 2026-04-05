import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../components/AxiosInstance.js";
import { persistAuthState } from "../utils/storage.js";

function Login({ setLoggedIn, setUser }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        try {
            const response = await axiosInstance.post("user/login", {
                username,
                password,
            });

            if (response.status === 200) {
                const nextUser = response.data?.data?.user;
                setLoggedIn(true);
                setUser(nextUser);
                persistAuthState(nextUser);
                navigate("/");
                return;
            }

            setError("Invalid username or password");
        } catch (apiError) {
            setError(apiError.response?.data?.message || "Login failed.");
        }
    }

    return (
        <div className="flex flex-1 items-center justify-center bg-slate-50 p-4 sm:p-6">
            <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
                            Welcome back
                        </p>
                        <h5 className="mt-2 text-2xl font-bold text-slate-900">
                            Sign in to continue building your feed
                        </h5>
                    </div>
                    <div>
                        <label htmlFor="username" className="mb-2 block text-sm font-medium text-slate-900">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            className="block w-full rounded-2xl border border-slate-300 bg-slate-50 p-3 text-sm text-slate-900 outline-none focus:border-red-400"
                            placeholder="xyz"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-900">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Enter your password"
                            className="block w-full rounded-2xl border border-slate-300 bg-slate-50 p-3 text-sm text-slate-900 outline-none focus:border-red-400"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex items-start">
                        <div className="flex items-start">
                            <div className="flex h-5 items-center">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    value=""
                                    className="h-4 w-4 rounded-sm border border-slate-300 bg-slate-50"
                                />
                            </div>
                            <label htmlFor="remember" className="ms-2 text-sm font-medium text-slate-700">
                                Remember me
                            </label>
                        </div>
                        <Link to="/forget-password" className="ms-auto text-sm text-blue-700 hover:underline">
                            Lost Password?
                        </Link>
                    </div>
                    {error ? <p className="text-sm text-red-600">{error}</p> : null}
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <button
                            type="submit"
                            className="flex-1 rounded-2xl bg-red-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-red-700"
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700"
                        >
                            Cancel
                        </button>
                    </div>
                    <div className="text-sm font-medium text-slate-500">
                        Not registered?{" "}
                        <Link to="/signup" className="text-blue-700 hover:underline">
                            Create account
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
