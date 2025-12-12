import axios, { AxiosError } from "axios";
import { getAccessToken, setAccessToken } from "../utilities/tokenMemory";
import { triggerLogout } from "../utilities/authEvents";


const baseURL = import.meta.env.VITE_API_URL;

// 1. PUBLIC INSTANCE - For login, register, forgot-password, etc.
// No interceptors are needed here.
export const publicApiClient = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});
// 2. PRIVATE INSTANCE - For all authenticated API calls.
// This instance will have the interceptors to handle token logic.
export const privateApiClient  = axios.create({
  baseURL: baseURL,
  withCredentials: true // Required to send HttpOnly cookies
});

// Attach access token to every request made with privateApiClient
privateApiClient .interceptors.request.use((config) => {
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


privateApiClient.interceptors.response.use(
  (res) => res,//allow succesful response

  async (error) => {
    const originalRequest = error.config;

    // if the request was to logout, just let it fail, dont try to refresh
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
          return privateApiClient(originalRequest);
        });
      }
    
      //Start the Refresh Process
      isRefreshing = true;
      try {
        // Attempt to refresh (cookie sent automatically)
        const { data } = await publicApiClient.post("/auth/refresh");
        const newAccessToken = data.accessToken;

        setAccessToken(newAccessToken);
        processQueue(null, newAccessToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return privateApiClient(originalRequest);
      } catch (refreshError: AxiosError | any) {
        // Refresh failed (token expired/revoked)
        refreshError.response.data.message = "Session expired. Please log in again.";

        processQueue(refreshError, null);
        setAccessToken(null);
        if (window.location.pathname !== "/login") {
          
          triggerLogout();
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
