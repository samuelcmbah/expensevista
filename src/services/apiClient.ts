import axios, { AxiosError } from "axios";
import { getAccessToken, setAccessToken } from "../utilities/tokenMemory";
import { triggerLogout } from "../utilities/authEvents";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true // Required to send HttpOnly cookies
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Queue to handle concurrent refreshes
let isRefreshing = false;
let failedQueue: Array<{ resolve: Function; reject: Function }> = [];
//iterates throuth the failedQueue and resolves(if new token) or rejects(if refresh fails) each promise
const processQueue = (error: any, token: string | null) => {
  failedQueue.forEach((prom) => {
    error ? prom.reject(error) : prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,//allow succesful response

  async (error) => {
    const originalRequest = error.config;

    // If the request that failed is the refresh token or logout request, do not retry.
    if (originalRequest.url?.includes("/auth/refresh") && error.response?.status === 401) {
      return Promise.reject(error);
    }
    if(originalRequest.url?.includes("/auth/logout") && error.response?.status === 401){
      return Promise.reject(error);
    }

   // Handle expired access token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Queue requests while refreshing
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }
    
      //Start the Refresh Process
      isRefreshing = true;
      try {
        // Attempt to refresh (cookie sent automatically)
        const { data } = await api.post("/auth/refresh");
        const newAccessToken = data.accessToken;

        setAccessToken(newAccessToken);
        processQueue(null, newAccessToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError: AxiosError | any) {
        // Refresh failed (token expired/revoked)
        refreshError.response.data.message = "Session expired. Please log in again.";

        processQueue(refreshError, null);
        setAccessToken(null);
        if (window.location.pathname !== "/login") {
          
          triggerLogout();
        }
        console.log("message for refresh error", refreshError)

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;