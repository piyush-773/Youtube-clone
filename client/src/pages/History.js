import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import { axiosInstance } from "../components/AxiosInstance";

const History = () => {
    const [historyVideos, setHistoryVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function loadHistory() {
            try {
                const response = await axiosInstance.get("user/history");
                if (isMounted) {
                    setHistoryVideos(response.data?.data || []);
                }
            } catch (apiError) {
                if (isMounted) {
                    setError(apiError.response?.data?.message || "Unable to load history.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadHistory();

        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) {
        return <Loader label="Loading history..." />;
    }

    if (error) {
        return <ErrorState title="Couldn't load history" message={error} />;
    }

    return (
        <div className="flex-1 bg-slate-50 p-4 sm:p-6 md:p-8">
            <div className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Watch history</h1>
                        <p className="mt-2 text-slate-500">
                            Only the videos you watched are listed here.
                        </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                        <p className="text-xs text-slate-500">Recent watches</p>
                        <p className="mt-1 text-xl font-bold text-slate-900">
                            {historyVideos.length}
                        </p>
                    </div>
                </div>

                {historyVideos.length ? (
                    <div className="space-y-4">
                        {historyVideos.map((video, index) => (
                            <Link
                                key={video._id}
                                to={`/watch/${video._id}`}
                                className="grid gap-4 rounded-3xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50 md:grid-cols-[40px_220px_minmax(0,1fr)]"
                            >
                                <div className="flex items-center justify-center text-sm font-semibold text-slate-400">
                                    {index + 1}
                                </div>
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="aspect-video w-full rounded-2xl object-cover"
                                />
                                <div className="min-w-0">
                                    <h2 className="line-clamp-2 text-lg font-semibold text-slate-900">
                                        {video.title}
                                    </h2>
                                    <p className="mt-2 text-sm text-slate-500">
                                        {video.owner?.fullName} • {(video.views || 0).toLocaleString()} views
                                    </p>
                                    <p className="mt-3 line-clamp-2 text-sm text-slate-600">
                                        {video.description}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <ErrorState
                        title="No watch history yet"
                        message="Your watched videos will show up here automatically."
                    />
                )}
            </div>
        </div>
    );
};

export default History;
