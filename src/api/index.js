import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, 
});


API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 && 
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        await API.post("/auth/refresh"); 

        return API(originalRequest); 
      } catch (err) {
        console.log("Refresh failed", err);

        
        if (typeof window !== "undefined") {
          window.location.href = "/authenticate/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default API;