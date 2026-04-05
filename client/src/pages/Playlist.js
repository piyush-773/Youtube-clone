import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import { axiosInstance } from "../components/AxiosInstance";
import { loadAuthState } from "../utils/storage";

const Playlist = () => {
    const authState = loadAuthState();
    const [playlists, setPlaylists] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function loadPlaylists() {
            if (!authState.user?._id) {
                if (isMounted) {
                    setPlaylists([]);
                    setLoading(false);
                }
                return;
            }

            try {
                const response = await axiosInstance.get(`playlist/user/${authState.user._id}`);
                if (isMounted) {
                    setPlaylists(response.data?.data || []);
                }
            } catch (apiError) {
                if (isMounted) {
                    setError(apiError.response?.data?.message || "Unable to load playlists.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadPlaylists();

        return () => {
            isMounted = false;
        };
    }, [authState.user?._id]);

    async function reloadPlaylists() {
        if (!authState.user?._id) {
            setPlaylists([]);
            setLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.get(`playlist/user/${authState.user._id}`);
            setPlaylists(response.data?.data || []);
        } catch (apiError) {
            setError(apiError.response?.data?.message || "Unable to load playlists.");
        }
    }

    async function handleCreatePlaylist(event) {
        event.preventDefault();
        setCreating(true);
        setError("");

        try {
            await axiosInstance.post("playlist", { name, description });
            setName("");
            setDescription("");
            await reloadPlaylists();
        } catch (apiError) {
            setError(apiError.response?.data?.message || "Unable to create playlist.");
        } finally {
            setCreating(false);
        }
    }

    if (loading) {
        return <Loader label="Loading playlists..." />;
    }

    return (
        <div className="flex-1 bg-slate-50 p-4 sm:p-6 md:p-8">
            <div className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Playlists</h1>
                        <p className="mt-2 text-slate-500">
                            Create and manage your own saved collections.
                        </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                        <p className="text-xs text-slate-500">Total playlists</p>
                        <p className="mt-1 text-xl font-bold text-slate-900">{playlists.length}</p>
                    </div>
                </div>

                <form
                    onSubmit={handleCreatePlaylist}
                    className="mb-8 grid gap-4 rounded-3xl border border-slate-200 p-5 md:grid-cols-2"
                >
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-900">
                            Playlist name <span className="text-red-500">*</span>
                        </label>
                        <input
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            className="w-full rounded-2xl border border-slate-300 bg-slate-50 p-3"
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-900">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <input
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            className="w-full rounded-2xl border border-slate-300 bg-slate-50 p-3"
                            required
                        />
                    </div>
                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            disabled={creating}
                            className="rounded-2xl bg-red-600 px-6 py-3 font-semibold text-white disabled:opacity-60"
                        >
                            {creating ? "Processing..." : "Create playlist"}
                        </button>
                    </div>
                </form>

                {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

                {playlists.length ? (
                    <div className="grid gap-5 lg:grid-cols-2">
                        {playlists.map((playlist) => (
                            <div key={playlist._id} className="rounded-3xl border border-slate-200 p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-xl font-semibold text-slate-900">
                                            {playlist.name}
                                        </h2>
                                        <p className="mt-2 text-sm text-slate-600">
                                            {playlist.description}
                                        </p>
                                    </div>
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                        {playlist.videos?.length || 0} videos
                                    </span>
                                </div>
                                <div className="mt-5 space-y-3">
                                    {(playlist.videos || []).map((video) => (
                                        <div
                                            key={video._id}
                                            className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3"
                                        >
                                            <img
                                                src={video.thumbnail}
                                                alt={video.title}
                                                className="h-16 w-28 rounded-xl object-cover"
                                            />
                                            <div className="min-w-0">
                                                <p className="line-clamp-1 font-medium text-slate-900">
                                                    {video.title}
                                                </p>
                                                <p className="text-sm text-slate-500">
                                                    {video.owner?.fullName}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <ErrorState
                        title="No playlists yet"
                        message="Create your first playlist to organize saved videos."
                    />
                )}
            </div>
        </div>
    );
};

export default Playlist;
