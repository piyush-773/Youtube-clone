import axios from "axios";
import { mockVideos } from "./mockData";

const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:8000/api/v1/";

export const fetchData = async (url, params = {}) => {
    try {
        const { data } = await axios.get(`${baseUrl}${url}`, { params });
        return data;
    } catch (error) {
        const normalizedUrl = url.replace(/^\/+/, "");
        const singleVideoMatch = normalizedUrl.match(/^videos\/([^/]+)$/);

        if (singleVideoMatch) {
            const fallbackVideo =
                mockVideos.find((video) => video._id === singleVideoMatch[1]) || mockVideos[0];

            return {
                success: true,
                data: {
                    ...fallbackVideo,
                    likesCount: fallbackVideo.likesCount || 0,
                },
                message: error.response?.data?.message || "Using mock video",
            };
        }

        const filteredVideos = params.query
            ? mockVideos.filter((video) => {
                  const search = params.query.toLowerCase();
                  return (
                      video.title.toLowerCase().includes(search) ||
                      video.description.toLowerCase().includes(search)
                  );
              })
            : mockVideos;

        return {
            success: true,
            data: {
                videos: filteredVideos,
                pagination: {
                    totalVideos: filteredVideos.length,
                    currentPage: 1,
                    totalPages: 1,
                },
            },
            message: error.response?.data?.message || "Using mock videos",
        };
    }
};
