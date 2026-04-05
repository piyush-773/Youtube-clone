import { mockVideos } from "./mockData";

const collectionsKey = "youtubeCollections";
const subscribedChannelsKey = "youtubeSubscribedChannels";

function getUserStorageKey(baseKey, userId = "guest") {
    return `${baseKey}:${userId}`;
}

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

export function getCollections(userId = loadAuthState().user?._id || loadAuthState().user?.username || "guest") {
    const storageKey = getUserStorageKey(collectionsKey, userId);
    const raw = localStorage.getItem(storageKey);

    if (raw) {
        return JSON.parse(raw);
    }

    const initialCollections = {
        liked: [mockVideos[0]._id, mockVideos[2]._id],
        watchLater: [],
        history: [],
        playlists: [],
    };

    localStorage.setItem(storageKey, JSON.stringify(initialCollections));
    return initialCollections;
}

export function saveCollections(collections, userId = loadAuthState().user?._id || loadAuthState().user?.username || "guest") {
    const storageKey = getUserStorageKey(collectionsKey, userId);
    localStorage.setItem(storageKey, JSON.stringify(collections));
}

export function getVideosByIds(videoIds, videos) {
    const map = new Map(videos.map((video) => [video._id, video]));
    return videoIds.map((id) => map.get(id)).filter(Boolean);
}

export function updateCollectionIds(collectionName, videoId, userId) {
    const collections = getCollections(userId);
    const ids = collections[collectionName] || [];
    const nextIds = ids.includes(videoId)
        ? ids.filter((id) => id !== videoId)
        : [videoId, ...ids];

    const nextCollections = {
        ...collections,
        [collectionName]: nextIds,
    };

    saveCollections(nextCollections, userId);
    return nextCollections;
}

export function setHistory(videoId, userId) {
    const collections = getCollections(userId);
    const nextCollections = {
        ...collections,
        history: [videoId, ...collections.history.filter((id) => id !== videoId)].slice(0, 30),
    };

    saveCollections(nextCollections, userId);
    return nextCollections;
}

export function getSubscribedChannels(userId = loadAuthState().user?._id || loadAuthState().user?.username || "guest") {
    const storageKey = getUserStorageKey(subscribedChannelsKey, userId);
    return JSON.parse(localStorage.getItem(storageKey) || "[]");
}

export function setSubscribedChannels(channelIds, userId = loadAuthState().user?._id || loadAuthState().user?.username || "guest") {
    const storageKey = getUserStorageKey(subscribedChannelsKey, userId);
    localStorage.setItem(storageKey, JSON.stringify(channelIds));
}

export function toggleSubscribedChannel(channelId, userId) {
    const current = getSubscribedChannels(userId);
    const next = current.includes(channelId)
        ? current.filter((id) => id !== channelId)
        : [...current, channelId];

    setSubscribedChannels(next, userId);
    return next;
}
