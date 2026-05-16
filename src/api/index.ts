import axios from "axios";
import type { AxiosError } from "axios";

// Create API instance
const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // REQUIRED for cookie-based auth
});

// Response interceptor (global error handling)
API.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // If unauthorized → redirect to login
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/authenticate/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;