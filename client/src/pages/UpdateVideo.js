import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../components/AxiosInstance";
import Loader from "../components/Loader";

const UpdateVideo = () => {
    const { videoId } = useParams();
    const navigate = useNavigate();
    const [video, setVideo] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [thumbnail, setThumbnail] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function loadVideo() {
            try {
                const response = await axiosInstance.get(`videos/${videoId}`);
                const nextVideo = response.data?.data || null;

                if (isMounted) {
                    setVideo(nextVideo);
                    setTitle(nextVideo?.title || "");
                    setDescription(nextVideo?.description || "");
                }
            } catch (apiError) {
                if (isMounted) {
                    setError(apiError.response?.data?.message || "Unable to load video.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadVideo();

        return () => {
            isMounted = false;
        };
    }, [videoId]);

    async function handleSubmit(event) {
        event.preventDefault();
        setSaving(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);

            if (thumbnail) {
                formData.append("thumbnail", thumbnail);
            }

            if (videoFile) {
                formData.append("videoFile", videoFile);
            }

            await axiosInstance.patch(`videos/${videoId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            navigate("/your-videos");
        } catch (apiError) {
            setError(apiError.response?.data?.message || "Unable to update the video.");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        const confirmed = window.confirm("Delete this video permanently?");

        if (!confirmed) {
            return;
        }

        setDeleting(true);
        setError("");

        try {
            await axiosInstance.delete(`videos/${videoId}`);
            navigate("/your-videos");
        } catch (apiError) {
            setError(apiError.response?.data?.message || "Unable to delete the video.");
        } finally {
            setDeleting(false);
        }
    }

    if (loading) {
        return <Loader label="Loading video editor..." />;
    }

    if (!video) {
        return <div className="flex-1 p-8 text-slate-600">Video not found.</div>;
    }

    return (
        <div className="flex-1 bg-slate-50 p-4 sm:p-6 md:p-8">
            <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
                <h1 className="text-3xl font-bold text-slate-900">Edit video</h1>
                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    <input
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        className="w-full rounded-2xl border border-slate-300 bg-slate-50 p-3"
                        placeholder="Video title"
                        required
                    />
                    <textarea
                        rows="5"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        className="w-full rounded-2xl border border-slate-300 bg-slate-50 p-3"
                        placeholder="Video description"
                        required
                    />
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="rounded-2xl border border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                            Replace thumbnail
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(event) => setThumbnail(event.target.files?.[0] || null)}
                                className="mt-2 block w-full"
                            />
                        </label>
                        <label className="rounded-2xl border border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                            Replace video file
                            <input
                                type="file"
                                accept="video/*"
                                onChange={(event) => setVideoFile(event.target.files?.[0] || null)}
                                className="mt-2 block w-full"
                            />
                        </label>
                    </div>
                    {error ? <p className="text-sm text-red-600">{error}</p> : null}
                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-2xl bg-red-600 px-6 py-3 font-semibold text-white disabled:opacity-60"
                        >
                            {saving ? "Updating..." : "Update video"}
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={deleting}
                            className="rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white disabled:opacity-60"
                        >
                            {deleting ? "Deleting..." : "Delete video"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="rounded-2xl border border-slate-300 px-6 py-3 font-semibold text-slate-700"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateVideo;
