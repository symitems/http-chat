import axios from "axios";

export const backend_api = axios.create({
    baseURL: "/api/",
    withCredentials: true,
});
