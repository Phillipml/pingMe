import { API_BASE_URL } from "@/utils/api-utils";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Contente-Type": "application/json",
  },
});

export const axiosAuthInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
axiosAuthInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosAuthInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 402 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token");
        }
        const response = await axiosInstance.post("/auth/token/refresh/", {
          refresh: refreshToken,
        });
        const { access } = response.data;
        localStorage.setItem("accessToken", access);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return axiosAuthInstance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
