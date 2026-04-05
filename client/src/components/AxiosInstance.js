import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL || "http://localhost:8000/api/v1/",
    withCredentials: true,
});
