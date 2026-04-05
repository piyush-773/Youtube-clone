import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import { axiosInstance } from "../components/AxiosInstance";
import { loadAuthState } from "../utils/storage";

const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024;

const initialForm = {
    title: "",
    description: "",
    thumbnail: null,
    videoFile: null,
};

const YourVideos = () => {
    const authState = loadAuthState();
    const [uploads, setUploads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [form, setForm] = useState(initialForm);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function loadUploads() {
            if (!authState.user?._id) {
                if (isMounted) {
                    setUploads([]);
                    setLoading(false);
                }
                return;
            }

            try {
                const response = await axiosInstance.get("/videos/", {
                    params: { userId: authState.user._id },
                });
                if (isMounted) {
                    setUploads(response.data?.data?.videos || []);
                }
            } catch (apiError) {
                if (isMounted) {
                    setError(apiError.response?.data?.message || "Unable to load your uploads.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadUploads();

        return () => {
            isMounted = false;
        };
    }, [authState.user?._id]);

    async function reloadUploads() {
        if (!authState.user?._id) {
            setUploads([]);
            setLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.get("/videos/", {
                params: { userId: authState.user._id },
            });
            setUploads(response.data?.data?.videos || []);
        } catch (apiError) {
            setError(apiError.response?.data?.message || "Unable to load your uploads.");
        }
    }

    async function handleUpload(event) {
        event.preventDefault();
        setUploading(true);
        setUploadProgress(0);
        setError("");

        try {
            if (form.videoFile && form.videoFile.size > MAX_VIDEO_SIZE_BYTES) {
                setError("Video size must be 100MB or less.");
                setUploading(false);
                return;
            }

            const formData = new FormData();
            formData.append("title", form.title);
            formData.append("description", form.description);
            if (form.thumbnail) formData.append("thumbnail", form.thumbnail);
            if (form.videoFile) formData.append("videoFile", form.videoFile);

            await axiosInstance.post("/videos/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(percent);
                    }
                },
            });

            setForm(initialForm);
            setShowUploadForm(false);
            setUploadProgress(100);
            await reloadUploads();
        } catch (apiError) {
            setError(apiError.response?.data?.message || "Unable to upload video.");
        } finally {
            setUploading(false);
            setTimeout(() => setUploadProgress(0), 500);
        }
    }

    if (loading) return <Loader label="Loading uploads..." />;
    if (error && !uploads.length) return <ErrorState title="Couldn't load studio" message={error} />;

    return (
        <div className="flex-1 bg-slate-50 p-4 sm:p-6 md:p-8">
            <div className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
                            Studio
                        </p>
                        <h1 className="mt-2 text-3xl font-bold text-slate-900">Video manager</h1>
                        <p className="mt-2 text-slate-500">
                            Review performance, upload new videos, and manage your library.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowUploadForm((previous) => !previous)}
                        className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white"
                    >
                        {showUploadForm ? "Close upload" : "Upload video"}
                    </button>
                </div>

                {showUploadForm ? (
                    <form onSubmit={handleUpload} className="mb-8 grid gap-4 rounded-3xl border border-slate-200 p-5 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-900">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input value={form.title} onChange={(event) => setForm((previous) => ({ ...previous, title: event.target.value }))} className="w-full rounded-2xl border border-slate-300 bg-slate-50 p-3" required />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-900">
                                Thumbnail <span className="text-red-500">*</span>
                            </label>
                            <input type="file" accept="image/*" onChange={(event) => setForm((previous) => ({ ...previous, thumbnail: event.target.files?.[0] || null }))} className="w-full rounded-2xl border border-slate-300 bg-slate-50 p-3" required />
                        </div>
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-slate-900">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea rows="4" value={form.description} onChange={(event) => setForm((previous) => ({ ...previous, description: event.target.value }))} className="w-full rounded-2xl border border-slate-300 bg-slate-50 p-3" required />
                        </div>
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-slate-900">
                                Video file <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="file"
                                accept="video/*"
                                onChange={(event) => {
                                    const nextVideoFile = event.target.files?.[0] || null;

                                    if (nextVideoFile && nextVideoFile.size > MAX_VIDEO_SIZE_BYTES) {
                                        setError("Video size must be 100MB or less.");
                                        event.target.value = "";
                                        setForm((previous) => ({ ...previous, videoFile: null }));
                                        return;
                                    }

                                    setError("");
                                    setForm((previous) => ({ ...previous, videoFile: nextVideoFile }));
                                }}
                                className="w-full rounded-2xl border border-slate-300 bg-slate-50 p-3"
                                required
                            />
                            <p className="mt-2 text-xs text-slate-500">
                                Maximum video size: 100MB.
                            </p>
                        </div>
                        <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row">
                            <button type="submit" disabled={uploading} className="rounded-2xl bg-red-600 px-6 py-3 font-semibold text-white disabled:opacity-60">
                                {uploading ? `Uploading ${uploadProgress}%` : "Publish video"}
                            </button>
                            <button type="button" onClick={() => setShowUploadForm(false)} className="rounded-2xl border border-slate-300 px-6 py-3 font-semibold text-slate-700">
                                Cancel
                            </button>
                        </div>
                        {uploading ? (
                            <div className="md:col-span-2">
                                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
                                    <div
                                        className="h-full rounded-full bg-red-600 transition-all duration-200"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                                <p className="mt-2 text-xs text-slate-500">
                                    Uploading your video... {uploadProgress}%
                                </p>
                            </div>
                        ) : null}
                    </form>
                ) : null}

                {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

                {uploads.length ? (
                    <div className="overflow-hidden rounded-3xl border border-slate-200">
                        <div className="hidden grid-cols-[2.2fr_0.9fr_0.8fr_0.7fr] gap-4 bg-slate-50 px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 md:grid">
                            <span>Video</span>
                            <span>Status</span>
                            <span>Views</span>
                            <span>Actions</span>
                        </div>
                        <div className="divide-y divide-slate-200">
                            {uploads.map((video) => (
                                <div key={video._id} className="grid gap-4 px-5 py-5 md:grid-cols-[2.2fr_0.9fr_0.8fr_0.7fr] md:items-center">
                                    <div className="flex gap-4">
                                        <img src={video.thumbnail} alt={video.title} className="h-24 w-40 rounded-2xl object-cover" />
                                        <div className="min-w-0">
                                            <h2 className="line-clamp-2 text-lg font-semibold text-slate-900">{video.title}</h2>
                                            <p className="mt-2 line-clamp-2 text-sm text-slate-600">{video.description}</p>
                                        </div>
                                    </div>
                                    <div><span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">Published</span></div>
                                    <p className="text-sm font-medium text-slate-700">{(video.views || 0).toLocaleString()}</p>
                                    <div className="flex gap-3">
                                        <Link to={`/watch/${video._id}`} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">View</Link>
                                        <Link to={`/videos/${video._id}/edit`} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">Edit</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <ErrorState title="No uploads yet" message="Upload your first video from the studio form above." />
                )}
            </div>
        </div>
    );
};

export default YourVideos;
