import axios from "axios";
import { getToken } from "./handleJWT";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL?.replace(/\/+$/, ""), // clean trailing slash
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response interceptor for 401
apiClient.interceptors.response.use(
  (response) => response, // pass through successful responses
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optional: remove stored token
      localStorage.removeItem("expensevista_token");
      // Redirect to login page
      window.location.href = "/login";
    }
    return Promise.reject(error); // Propagates the error to the code that made the request.
  }
);

export default apiClient;
