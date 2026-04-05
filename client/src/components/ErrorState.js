import React from "react";

function ErrorState({
    title = "Something went wrong",
    message = "We couldn't complete that request right now.",
    actionLabel,
    onAction,
}) {
    return (
        <div className="flex min-h-[40vh] items-center justify-center p-4">
            <div className="w-full max-w-xl rounded-[2rem] border border-red-100 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl text-red-500">
                    ?
                </div>
                <h2 className="mt-5 text-2xl font-bold text-slate-900">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{message}</p>
                {actionLabel && onAction ? (
                    <button
                        type="button"
                        onClick={onAction}
                        className="mt-6 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white"
                    >
                        {actionLabel}
                    </button>
                ) : null}
            </div>
        </div>
    );
}

export default ErrorState;
