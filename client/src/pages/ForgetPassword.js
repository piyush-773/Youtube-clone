import React from "react";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-1 items-center justify-center bg-slate-50 p-4 sm:p-6">
            <div className="w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
                    Recovery
                </p>
                <h1 className="mt-2 text-3xl font-bold text-slate-900">Reset your password</h1>
                <p className="mt-3 text-slate-600">
                    Connect this screen to your email reset flow when you add mail delivery.
                </p>
                <form className="mt-6 space-y-4">
                    <input
                        type="email"
                        placeholder="Enter your registered email"
                        className="w-full rounded-2xl border border-slate-300 bg-slate-50 p-3"
                    />
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <button className="rounded-2xl bg-red-600 px-6 py-3 font-semibold text-white">
                            Send reset link
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

export default ForgetPassword;
