import axios from "axios";
import { config } from "../constants/config";
import { useAuthStore } from "../store/authStore";

export const api = axios.create({
  baseURL: config.apiUrl,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((req) => {
  const token = useAuthStore.getState().token;
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

api.interceptors.response.use(
  (res) => res,
  (error: unknown) => Promise.reject(error)
);
