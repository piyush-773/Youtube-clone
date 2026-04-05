import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { useVideos } from "../hooks/useVideos";
import { axiosInstance } from "../components/AxiosInstance";
import { getSubscribedChannels as getLocalSubscribedChannels } from "../utils/storage";

const Subscriptions = () => {
    const { videos, loading } = useVideos();
    const [subscribedChannelIds, setSubscribedChannelIds] = useState([]);

    useEffect(() => {
        let isMounted = true;

        async function loadSubscriptions() {
            const user = JSON.parse(localStorage.getItem("user") || "null");

            if (!user?._id) {
                if (isMounted) {
                    setSubscribedChannelIds(getLocalSubscribedChannels());
                }
                return;
            }

            try {
                const response = await axiosInstance.get(`subscriptions/u/${user._id}`);
                const channels = response.data?.data || [];

                if (isMounted) {
                    setSubscribedChannelIds(
                        channels.map((channel) => channel._id || channel.username).filter(Boolean)
                    );
                }
            } catch (error) {
                if (isMounted) {
                    setSubscribedChannelIds(getLocalSubscribedChannels());
                }
            }
        }

        loadSubscriptions();

        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) {
        return <Loader label="Loading subscriptions..." />;
    }

    const creators = Array.from(
        new Map(videos.map((video) => [video.owner?._id || video.owner?.username, video.owner])).values()
    )
        .filter(Boolean)
        .filter((creator) => subscribedChannelIds.includes(creator._id || creator.username));

    return (
        <div className="flex-1 bg-slate-50 p-4 sm:p-6 md:p-8">
            <div className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
                <h1 className="text-3xl font-bold text-slate-900">Subscriptions</h1>
                <p className="mt-2 text-slate-500">Channels you follow and recent uploads from them.</p>
                {creators.length ? (
                    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {creators.map((creator) => (
                            <div key={creator._id || creator.username} className="rounded-3xl border border-slate-200 p-5">
                                <img src={creator.avatar} alt={creator.fullName} className="h-14 w-14 rounded-full object-cover" />
                                <h2 className="mt-4 text-lg font-semibold text-slate-900">{creator.fullName}</h2>
                                <p className="text-sm text-slate-500">@{creator.username}</p>
                                <button className="mt-5 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">
                                    Subscribed
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
                        Subscribe to channels from a video page to see them here.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Subscriptions;
