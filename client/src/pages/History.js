import React from "react";
import Card from "../components/Card";
import Loader from "../components/Loader";
import { useVideos } from "../hooks/useVideos";
import { getCollections, getVideosByIds } from "../utils/storage";

const History = () => {
    const { videos, loading } = useVideos();
    const collections = getCollections();
    const historyVideos = getVideosByIds(collections.history, videos);

    if (loading) {
        return <Loader label="Loading history..." />;
    }

    return (
        <div className="flex-1 bg-slate-50 p-4 sm:p-6 md:p-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-900">Watch history</h1>
                <p className="mt-2 text-slate-500">The videos you opened recently are listed here.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {historyVideos.map((video) => (
                    <Card key={video._id} video={video} />
                ))}
            </div>
        </div>
    );
};

export default History;
