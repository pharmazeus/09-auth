import axios from "axios";

const isServer = typeof window === "undefined";
const baseURL = isServer
  ? (process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:3000") + "/api"
  : "/api";

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});
