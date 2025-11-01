import axios from 'axios';

// --- THIS IS THE DEFINITIVE PRODUCTION CONFIG ---

// 1. This is the live, public URL for your backend from Render.
//    You MUST replace the placeholder with your real URL.
const PRODUCTION_API_URL = 'https://service-bay-api.onrender.com/api'; // <-- PASTE YOUR RENDER URL HERE

// 2. This is the local URL for development (when you run on your PC).
const DEVELOPMENT_API_URL = 'http://127.0.0.1:8000/api';

// 3. This logic automatically chooses the correct URL.
const API_BASE_URL = window.location.hostname === 'localhost'
  ? DEVELOPMENT_API_URL
  : PRODUCTION_API_URL;

console.log(`API Base URL set to: ${API_BASE_URL}`); // For debugging

// ----------------------------------

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Increased timeout for live servers
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// --- Interceptors (No changes needed below) ---
axiosInstance.interceptors.request.use(
  (config) => {
    const authTokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null;
    if (authTokens?.access) {
      config.headers.Authorization = `Bearer ${authTokens.access}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const authTokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null;

    if (error.response && error.response.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/token/')) {
      originalRequest._retry = true;
      if (authTokens?.refresh) {
        try {
          // Use the dynamic API_BASE_URL for the refresh request
          const res = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: authTokens.refresh,
          });
          localStorage.setItem('authTokens', JSON.stringify(res.data));
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;
          originalRequest.headers['Authorization'] = `Bearer ${res.data.access}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error('Refresh token expired or invalid.', refreshError);
          localStorage.removeItem('authTokens');
          localStorage.removeItem('userRole');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        localStorage.removeItem('authTokens');
        localStorage.removeItem('userRole');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

