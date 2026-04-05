import React from "react";

function Loader({ label = "Loading videos..." }) {
    return (
        <div className="flex min-h-[40vh] items-center justify-center">
            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-5 text-center shadow-sm">
                <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-red-500" />
                <p className="text-sm font-medium text-slate-600">{label}</p>
            </div>
        </div>
    );
}

export default Loader;
