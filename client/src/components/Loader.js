import React from "react";

function Loader({ label = "Loading..." }) {
    return (
        <div className="flex min-h-[40vh] items-center justify-center px-4">
            <div className="w-full max-w-xl rounded-[2rem] border border-slate-200 bg-white p-6 text-center shadow-sm">
                <div className="mb-5 flex flex-col items-center justify-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-red-500" />
                    <div>
                        <p className="text-sm font-semibold text-slate-900">{label}</p>
                        <p className="text-xs text-slate-500">
                            Please wait while we process your request.
                        </p>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="mx-auto h-4 w-3/4 animate-pulse rounded-full bg-slate-100" />
                    <div className="mx-auto h-4 w-full animate-pulse rounded-full bg-slate-100" />
                    <div className="mx-auto h-4 w-5/6 animate-pulse rounded-full bg-slate-100" />
                </div>
            </div>
        </div>
    );
}

export default Loader;
