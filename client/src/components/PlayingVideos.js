import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    AiOutlineDislike,
    AiOutlineDownload,
    AiOutlineExpandAlt,
    AiOutlineLike,
    AiOutlinePause,
    AiOutlinePlayCircle,
    AiOutlineSound,
    AiOutlineFullscreenExit,
} from "react-icons/ai";
import { BsFillSkipBackwardFill, BsFillSkipForwardFill } from "react-icons/bs";
import { MdOutlineWatchLater, MdPictureInPictureAlt } from "react-icons/md";
import { BiListPlus } from "react-icons/bi";
import { axiosInstance } from "./AxiosInstance";
import Card from "./Card";
import Loader from "./Loader";
import { fetchData } from "../utils/rapidapi";
import { useVideos } from "../hooks/useVideos";
import {
    getCollections,
    getSubscribedChannels,
    loadAuthState,
    saveCollections,
    setHistory,
    setSubscribedChannels,
    toggleSubscribedChannel,
    updateCollectionIds,
} from "../utils/storage";

const playbackRates = [0.75, 1, 1.25, 1.5, 2];

function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";
    const totalSeconds = Math.floor(seconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;
    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
    }
    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function PlayingVideos() {
    const { videoId } = useParams();
    const { videos, loading } = useVideos();
    const [currentVideo, setCurrentVideo] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [hasCountedView, setHasCountedView] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscribersCount, setSubscribersCount] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(1);
    const [showControls, setShowControls] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isSavedForLater, setIsSavedForLater] = useState(false);
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const controlsTimeoutRef = useRef(null);
    const authState = loadAuthState();
    const storageUserId = authState.user?._id || authState.user?.username || "guest";

    useEffect(() => {
        let isMounted = true;

        async function loadVideo() {
            setPageLoading(true);
            try {
                const response = await fetchData(`videos/${videoId}`);
                const video = response?.data;
                if (isMounted && video) {
                    setCurrentVideo(video);
                    setLikesCount(video.likesCount || 0);
                    setLiked(false);
                    setDisliked(false);
                    setHasCountedView(false);
                    setCurrentTime(0);
                    setDuration(0);
                    const collections = getCollections(storageUserId);
                    setIsSavedForLater((collections.watchLater || []).includes(videoId));
                }
            } finally {
                if (isMounted) setPageLoading(false);
            }
        }

        loadVideo();
        return () => {
            isMounted = false;
        };
    }, [videoId, storageUserId]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = playbackRate;
            videoRef.current.volume = volume;
        }
    }, [playbackRate, volume, currentVideo]);

    useEffect(() => {
        let isMounted = true;

        async function loadSubscriptionState() {
            const channelId = currentVideo?.owner?._id;
            if (!channelId) return;

            if (!authState.user?._id) {
                if (isMounted) {
                    setIsSubscribed(false);
                    setSubscribersCount(0);
                }
                return;
            }

            try {
                const [channelsResponse, subscribersResponse] = await Promise.all([
                    axiosInstance.get(`subscriptions/u/${authState.user._id}`),
                    axiosInstance.get(`subscriptions/c/${channelId}`),
                ]);
                const channels = channelsResponse.data?.data || [];
                const subscribers = subscribersResponse.data?.data || [];
                if (isMounted) {
                    setIsSubscribed(channels.some((channel) => channel._id === channelId));
                    setSubscribersCount(subscribers.length);
                    setSubscribedChannels(channels.map((channel) => channel._id).filter(Boolean), storageUserId);
                }
            } catch (error) {
                if (isMounted) {
                    setIsSubscribed(getSubscribedChannels(storageUserId).includes(channelId));
                }
            }
        }

        loadSubscriptionState();
        return () => {
            isMounted = false;
        };
    }, [currentVideo?.owner?._id, authState.user?._id, storageUserId]);

    useEffect(() => {
        function handleKeyDown(event) {
            const activeTag = document.activeElement?.tagName;
            if (activeTag === "INPUT" || activeTag === "TEXTAREA" || !videoRef.current) return;

            if (event.code === "Space") {
                event.preventDefault();
                togglePlayPause();
            }
            if (event.code === "ArrowRight") {
                event.preventDefault();
                skip(5);
            }
            if (event.code === "ArrowLeft") {
                event.preventDefault();
                skip(-5);
            }
            if (event.code === "ArrowUp") {
                event.preventDefault();
                setVolume((previous) => Math.min(1, Number((previous + 0.1).toFixed(2))));
            }
            if (event.code === "ArrowDown") {
                event.preventDefault();
                setVolume((previous) => Math.max(0, Number((previous - 0.1).toFixed(2))));
            }
            if (event.key.toLowerCase() === "f") {
                event.preventDefault();
                toggleFullscreen();
            }
            if (event.key.toLowerCase() === "i") {
                event.preventDefault();
                enterPictureInPicture();
            }
        }

        function handleFullscreenChange() {
            setIsFullscreen(Boolean(document.fullscreenElement));
        }

        window.addEventListener("keydown", handleKeyDown);
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    });

    useEffect(() => () => {
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    }, []);

    const relatedVideos = useMemo(
        () => videos.filter((video) => video._id !== currentVideo?._id).slice(0, 6),
        [currentVideo?._id, videos]
    );

    function revealControls() {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => {
            if (videoRef.current && !videoRef.current.paused) setShowControls(false);
        }, 2200);
    }

    async function handleLikeToggle() {
        if (!authState.isLoggedIn) return;
        try {
            const response = await axiosInstance.post(`likes/toggle/v/${videoId}`);
            const nextLiked = response.data?.data?.liked || false;
            setLiked(nextLiked);
            setDisliked(false);
            setLikesCount(response.data?.data?.likesCount || 0);
            const collections = getCollections(storageUserId);
            saveCollections(
                {
                    ...collections,
                    liked: nextLiked
                        ? [videoId, ...collections.liked.filter((id) => id !== videoId)]
                        : collections.liked.filter((id) => id !== videoId),
                },
                storageUserId
            );
        } catch (error) {
            const nextLiked = !liked;
            setLiked(nextLiked);
            setDisliked(false);
            setLikesCount((previous) => Math.max(0, previous + (nextLiked ? 1 : -1)));
        }
    }

    function handleDislikeToggle() {
        setDisliked((previous) => !previous);
        if (!disliked) setLiked(false);
    }

    async function handleSubscribeToggle() {
        const channelId = currentVideo?.owner?._id;
        if (!channelId || !authState.isLoggedIn) return;
        try {
            const response = await axiosInstance.post(`subscriptions/c/${channelId}`);
            setIsSubscribed(response.data?.data?.subscribed || false);
            setSubscribersCount(response.data?.data?.subscribersCount || 0);
        } catch (error) {
            const next = toggleSubscribedChannel(channelId, storageUserId);
            const nextSubscribed = next.includes(channelId);
            setIsSubscribed(nextSubscribed);
            setSubscribersCount((previous) => Math.max(0, previous + (nextSubscribed ? 1 : -1)));
        }
    }

    function handleWatchLaterToggle() {
        const nextCollections = updateCollectionIds("watchLater", videoId, storageUserId);
        setIsSavedForLater((nextCollections.watchLater || []).includes(videoId));
    }

    async function incrementView() {
        if (hasCountedView) return;
        setHasCountedView(true);
        setHistory(videoId, storageUserId);
        try {
            const response = await axiosInstance.patch(`videos/${videoId}/view`);
            const nextVideo = response.data?.data;
            if (nextVideo) {
                setCurrentVideo((previous) => ({
                    ...(previous || {}),
                    ...nextVideo,
                    likesCount: previous?.likesCount || likesCount,
                }));
            }
        } catch (error) {
            setCurrentVideo((previous) =>
                previous ? { ...previous, views: (previous.views || 0) + 1 } : previous
            );
        }
    }

    function handleTimeUpdate() {
        if (!videoRef.current) return;
        setCurrentTime(videoRef.current.currentTime);
        if (videoRef.current.currentTime >= 10) incrementView();
    }

    function togglePlayPause() {
        if (!videoRef.current) return;
        if (videoRef.current.paused) videoRef.current.play();
        else videoRef.current.pause();
    }

    function skip(seconds) {
        if (!videoRef.current) return;
        const nextTime = Math.max(0, Math.min(videoRef.current.duration || 0, videoRef.current.currentTime + seconds));
        videoRef.current.currentTime = nextTime;
        setCurrentTime(nextTime);
    }

    async function enterPictureInPicture() {
        if (document.pictureInPictureEnabled && videoRef.current) {
            await videoRef.current.requestPictureInPicture();
        }
    }

    async function toggleFullscreen() {
        if (!playerRef.current) return;
        if (!document.fullscreenElement) await playerRef.current.requestFullscreen();
        else if (document.exitFullscreen) await document.exitFullscreen();
    }

    function handleSeek(event) {
        const nextTime = Number(event.target.value);
        setCurrentTime(nextTime);
        if (videoRef.current) videoRef.current.currentTime = nextTime;
    }

    function handleLoadedMetadata() {
        if (videoRef.current) setDuration(videoRef.current.duration || currentVideo?.duration || 0);
    }

    if (loading || pageLoading) return <Loader label="Loading player..." />;
    if (!currentVideo) return <div className="p-8 text-slate-600">Video not found.</div>;

    const ownerName = currentVideo.owner?.fullName || currentVideo.owner?.username || "Channel";
    const ownerHandle = currentVideo.owner?.username ? `@${currentVideo.owner.username}` : "Creator";

    return (
        <div className="min-h-screen flex-1 bg-slate-50 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
            <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
                <div className="min-w-0 space-y-5">
                    <div
                        ref={playerRef}
                        className="group relative overflow-hidden rounded-[1.75rem] bg-black shadow-xl"
                        onMouseMove={revealControls}
                        onMouseLeave={() => {
                            if (videoRef.current && !videoRef.current.paused) setShowControls(false);
                        }}
                    >
                        <video
                            ref={videoRef}
                            className="aspect-video w-full"
                            poster={currentVideo.thumbnail}
                            onTimeUpdate={handleTimeUpdate}
                            onLoadedMetadata={handleLoadedMetadata}
                            onClick={togglePlayPause}
                            onPlay={() => {
                                setIsPlaying(true);
                                revealControls();
                            }}
                            onPause={() => {
                                setIsPlaying(false);
                                setShowControls(true);
                            }}
                        >
                            <source src={currentVideo.videoFile} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>

                        <div className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`} />

                        <button
                            type="button"
                            onClick={togglePlayPause}
                            className={`absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/55 p-4 text-white transition ${showControls ? "opacity-100" : "opacity-0"}`}
                            aria-label={isPlaying ? "Pause video" : "Play video"}
                        >
                            {isPlaying ? <AiOutlinePause className="text-3xl" /> : <AiOutlinePlayCircle className="text-3xl" />}
                        </button>

                        <div className={`absolute inset-x-0 bottom-0 z-10 p-3 text-white transition-opacity duration-300 sm:p-4 ${showControls ? "opacity-100" : "opacity-0"}`}>
                            <input type="range" min="0" max={duration || 0} step="0.1" value={currentTime} onChange={handleSeek} className="mb-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/30 accent-red-600" />
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                    <button type="button" onClick={togglePlayPause} className="rounded-full p-2 hover:bg-white/10">
                                        {isPlaying ? <AiOutlinePause className="text-2xl" /> : <AiOutlinePlayCircle className="text-2xl" />}
                                    </button>
                                    <button type="button" onClick={() => skip(-10)} className="rounded-full p-2 hover:bg-white/10"><BsFillSkipBackwardFill className="text-xl" /></button>
                                    <button type="button" onClick={() => skip(10)} className="rounded-full p-2 hover:bg-white/10"><BsFillSkipForwardFill className="text-xl" /></button>
                                    <div className="flex items-center gap-2 rounded-full bg-black/25 px-3 py-1.5">
                                        <AiOutlineSound className="text-lg" />
                                        <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(event) => setVolume(Number(event.target.value))} className="w-20 cursor-pointer appearance-none rounded-full accent-white" />
                                    </div>
                                    <span className="text-xs font-medium sm:text-sm">{formatTime(currentTime)} / {formatTime(duration)}</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                    <select value={playbackRate} onChange={(event) => setPlaybackRate(Number(event.target.value))} className="rounded-full bg-black/25 px-3 py-2 text-xs text-white outline-none sm:text-sm">
                                        {playbackRates.map((rate) => (
                                            <option key={rate} value={rate} className="text-black">{rate}x</option>
                                        ))}
                                    </select>
                                    <button type="button" onClick={enterPictureInPicture} className="rounded-full p-2 hover:bg-white/10" title="Mini player"><MdPictureInPictureAlt className="text-xl" /></button>
                                    <a href={currentVideo.videoFile} download className="rounded-full p-2 hover:bg-white/10" title="Download"><AiOutlineDownload className="text-xl" /></a>
                                    <button type="button" onClick={toggleFullscreen} className="rounded-full p-2 hover:bg-white/10">
                                        {isFullscreen ? <AiOutlineFullscreenExit className="text-xl" /> : <AiOutlineExpandAlt className="text-xl" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[1.75rem] bg-white p-5 shadow-sm sm:p-6">
                        <div className="mb-3 flex flex-wrap gap-2 text-xs text-slate-500">
                            <span>`Space` play/pause</span>
                            <span>`←/→` seek</span>
                            <span>`↑/↓` volume</span>
                            <span>`F` fullscreen</span>
                            <span>`I` mini player</span>
                        </div>
                        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">{currentVideo.title}</h1>
                        <div className="mt-3 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                                <span>{(currentVideo.views || 0).toLocaleString()} views</span>
                                <span>{Math.floor((currentVideo.duration || 0) / 60)} min watch</span>
                                <span>{ownerHandle}</span>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <button type="button" onClick={handleLikeToggle} disabled={!authState.isLoggedIn} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${liked ? "bg-red-600 text-white" : "border border-slate-200 text-slate-700"} ${!authState.isLoggedIn ? "cursor-not-allowed opacity-60" : ""}`}>
                                    <AiOutlineLike />{likesCount} Like
                                </button>
                                <button type="button" onClick={handleDislikeToggle} disabled={!authState.isLoggedIn} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${disliked ? "bg-slate-900 text-white" : "border border-slate-200 text-slate-700"} ${!authState.isLoggedIn ? "cursor-not-allowed opacity-60" : ""}`}>
                                    <AiOutlineDislike />Dislike
                                </button>
                                <button type="button" onClick={handleWatchLaterToggle} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${isSavedForLater ? "bg-slate-900 text-white" : "border border-slate-200 text-slate-700"}`}>
                                    <MdOutlineWatchLater />{isSavedForLater ? "Saved" : "Watch later"}
                                </button>
                                <Link to="/playlist" className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
                                    <BiListPlus />Playlist
                                </Link>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col gap-4 rounded-3xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                                <img src={currentVideo.owner?.avatar || currentVideo.thumbnail} alt={ownerName} className="h-14 w-14 rounded-full object-cover" />
                                <div>
                                    <p className="text-base font-semibold text-slate-900">{ownerName}</p>
                                    <p className="text-sm text-slate-500">{ownerHandle}{subscribersCount ? ` • ${subscribersCount} subscribers` : ""}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <button type="button" onClick={handleSubscribeToggle} disabled={!authState.isLoggedIn} className={`rounded-full px-5 py-2 text-sm font-semibold ${isSubscribed ? "border border-slate-300 text-slate-700" : "bg-red-600 text-white"} ${!authState.isLoggedIn ? "cursor-not-allowed opacity-60" : ""}`}>
                                    {isSubscribed ? "Subscribed" : "Subscribe"}
                                </button>
                                <Link to={authState.isLoggedIn ? "/your-channel" : "/login"} className="inline-flex justify-center rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700">
                                    Visit channel
                                </Link>
                            </div>
                        </div>

                        <p className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-base">{currentVideo.description}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="rounded-3xl bg-white p-5 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900">Up next</h2>
                        <p className="mt-1 text-sm text-slate-500">More videos that match this channel and topic.</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-1">
                        {relatedVideos.map((video) => (
                            <Card key={video._id} video={video} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlayingVideos;
