import axios from "axios";

const normalizedBaseUrl = (
    process.env.REACT_APP_BASE_URL?.trim() || "http://localhost:8000/api/v1/"
).replace(/\/?$/, "/");

export const axiosInstance = axios.create({
    baseURL: normalizedBaseUrl,
    withCredentials: true,
});
