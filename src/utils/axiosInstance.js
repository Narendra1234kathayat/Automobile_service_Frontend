import axios from "axios";


export const BASE_URL = "http://localhost:5000/"; // Replace with your backend base URL
// Create axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/", // Replace with your backend base URL
  timeout: 5000,
  
  headers: {
    "Content-Type": "application/json",
    
  },
});

// REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use(
  (config) => {
    // Add token if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("🚀 Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ Response:", response);
    return response;
  },
  (error) => {
    console.error("❌ Response Error:", error.response || error.message);

    if (error.response?.status === 401) {
      // Token expired or unauthorized
      // alert("Session expired. Please log in again. 
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
