import { mockVideos } from "./mockData";

const collectionsKey = "youtubeCollections";
const subscribedChannelsKey = "youtubeSubscribedChannels";

export function loadAuthState() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const user = JSON.parse(localStorage.getItem("user") || "null");

    return {
        isLoggedIn,
        user: isLoggedIn ? user : null,
    };
}

export function persistAuthState(user) {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify(user));
}

export function clearAuthState() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
}

export function getCollections() {
    const raw = localStorage.getItem(collectionsKey);

    if (raw) {
        return JSON.parse(raw);
    }

    const initialCollections = {
        liked: [mockVideos[0]._id, mockVideos[2]._id],
        watchLater: [mockVideos[1]._id, mockVideos[4]._id],
        history: [mockVideos[5]._id, mockVideos[0]._id, mockVideos[3]._id],
        playlists: [
            {
                id: "playlist-1",
                name: "Frontend Builds",
                description: "UI and React videos I want to revisit.",
                videoIds: [mockVideos[0]._id, mockVideos[2]._id, mockVideos[4]._id],
            },
            {
                id: "playlist-2",
                name: "Backend Systems",
                description: "Auth, APIs, uploads, and database lessons.",
                videoIds: [mockVideos[1]._id, mockVideos[5]._id],
            },
        ],
    };

    localStorage.setItem(collectionsKey, JSON.stringify(initialCollections));
    return initialCollections;
}

export function saveCollections(collections) {
    localStorage.setItem(collectionsKey, JSON.stringify(collections));
}

export function getVideosByIds(videoIds, videos) {
    const map = new Map(videos.map((video) => [video._id, video]));
    const matchedVideos = videoIds.map((id) => map.get(id)).filter(Boolean);

    if (matchedVideos.length > 0) {
        return matchedVideos;
    }

    return videos.slice(0, Math.max(videoIds.length, 3));
}

export function getSubscribedChannels() {
    return JSON.parse(localStorage.getItem(subscribedChannelsKey) || "[]");
}

export function setSubscribedChannels(channelIds) {
    localStorage.setItem(subscribedChannelsKey, JSON.stringify(channelIds));
}

export function toggleSubscribedChannel(channelId) {
    const current = getSubscribedChannels();
    const next = current.includes(channelId)
        ? current.filter((id) => id !== channelId)
        : [...current, channelId];

    setSubscribedChannels(next);
    return next;
}
