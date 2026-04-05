import { useEffect, useState } from "react";
import { fetchData } from "../utils/rapidapi";

export function useVideos(query = "") {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function loadVideos() {
            setLoading(true);
            setError("");

            try {
                const response = await fetchData("videos", query ? { query } : {});
                const nextVideos = response?.data?.videos || [];

                if (isMounted) {
                    setVideos(nextVideos);
                    setError(nextVideos.length ? "" : "No videos found");
                }
            } catch (loadError) {
                if (isMounted) {
                    setError("We couldn't load videos right now.");
                    setVideos([]);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadVideos();

        return () => {
            isMounted = false;
        };
    }, [query]);

    return { videos, loading, error, setVideos };
}
