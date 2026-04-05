import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import { axiosInstance } from "../components/AxiosInstance";

const LikedVideos = () => {
    const [likedVideos, setLikedVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function loadLikedVideos() {
            try {
                const response = await axiosInstance.get("likes/videos");
                if (isMounted) {
                    setLikedVideos(response.data?.data || []);
                }
            } catch (apiError) {
                if (isMounted) {
                    setError(apiError.response?.data?.message || "Unable to load liked videos.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadLikedVideos();

        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) {
        return <Loader label="Loading liked videos..." />;
    }

    if (error) {
        return <ErrorState title="Couldn't load liked videos" message={error} />;
    }

    const totalViews = likedVideos.reduce((sum, video) => sum + (video.views || 0), 0);

    return (
        <div className="flex-1 bg-slate-50 p-4 sm:p-6 md:p-8">
            <div className="mb-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl bg-white p-6 shadow-sm md:col-span-2">
                    <h1 className="text-3xl font-bold text-slate-900">Liked videos</h1>
                    <p className="mt-2 text-slate-500">
                        Videos you actually liked appear here.
                    </p>
                </div>
                <div className="rounded-3xl bg-white p-6 shadow-sm">
                    <p className="text-sm text-slate-500">Combined views</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        {totalViews.toLocaleString()}
                    </p>
                </div>
            </div>

            {likedVideos.length ? (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {likedVideos.map((video) => (
                        <Card key={video._id} video={video} />
                    ))}
                </div>
            ) : (
                <ErrorState
                    title="No liked videos yet"
                    message="Like videos while watching and they will appear here."
                />
            )}
        </div>
    );
};

export default LikedVideos;
