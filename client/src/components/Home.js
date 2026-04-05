import React from "react";
import { useSearchParams } from "react-router-dom";
import Card from "./Card";
import Loader from "./Loader";
import ErrorState from "./ErrorState";
import { useVideos } from "../hooks/useVideos";

function Home() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const { videos, loading, error } = useVideos(query);

    if (loading) {
        return <Loader label={query ? "Searching videos..." : "Loading feed..."} />;
    }

    if (error && !videos.length) {
        return (
            <ErrorState
                title="Feed unavailable"
                message={error}
                actionLabel="Try again"
                onAction={() => window.location.reload()}
            />
        );
    }

    return (
        <div className="min-h-screen flex-1 bg-slate-50 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
            <div className="mb-6 flex flex-col gap-3 rounded-3xl bg-gradient-to-r from-red-600 via-red-500 to-orange-400 p-5 text-white shadow-lg sm:p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-100">
                    Discover
                </p>
                <h1 className="max-w-2xl text-2xl font-bold sm:text-3xl lg:text-4xl">
                    Stream tutorials, creator uploads, and product builds in one place.
                </h1>
                <p className="max-w-2xl text-sm text-red-50 sm:text-base">
                    {query
                        ? `Showing results for "${query}".`
                        : "Browse the latest videos from your feed."}
                </p>
            </div>

            {videos.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {videos.map((video) => (
                        <Card key={video._id} video={video} />
                    ))}
                </div>
            ) : (
                <ErrorState
                    title="No videos found"
                    message={query ? "Try a different search term." : "There are no videos to show yet."}
                />
            )}
        </div>
    );
}

export default Home;
