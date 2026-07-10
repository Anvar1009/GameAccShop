import axios, { AxiosError } from "axios";
import { clearToken, getToken } from "./token";

/**
 * All requests go to /api and are forwarded to the ASP.NET Core backend by the
 * Vite dev proxy (see vite.config.ts). In production, set VITE_API_BASE_URL to
 * the backend origin.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Broadcast auth loss so the AuthProvider can react (redirect to login).
export const AUTH_ERROR_EVENT = "gameaccshop:auth-error";

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      clearToken();
      window.dispatchEvent(new CustomEvent(AUTH_ERROR_EVENT));
    }
    return Promise.reject(error);
  }
);

/** Extract a human-readable message from a backend error response. */
export function getErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; error?: string; title?: string; errors?: Record<string, string[]> }
      | string
      | undefined;

    if (typeof data === "string") {
      if (data.trim()) return data;
    } else if (data && typeof data === "object") {
      if (data.message) return data.message;
      if (data.error) return data.error;
      if (data.errors) {
        const first = Object.values(data.errors).flat()[0];
        if (first) return String(first);
      }
      if (data.title) return data.title;
    }
    if (error.code === "ERR_NETWORK") {
      return "Cannot reach the server. Make sure the backend is running.";
    }
    if (error.response?.status === 403) return "You do not have permission to do that.";
    if (error.response?.status === 401) return "Please sign in to continue.";
  }
  return fallback;
}
