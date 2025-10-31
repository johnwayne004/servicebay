import axios from 'axios';

// --- THIS IS THE DEFINITIVE FIX ---

// 1. Check if the frontend is being viewed on localhost.
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// 2. Get the computer's CURRENT network IP address.
const networkIp = '192.168.1.102'; // <-- UPDATED to your new IP

// 3. Intelligently choose the correct backend API address.
const API_BASE_URL = isLocalhost
  ? `http://127.0.0.1:8000/api` // Use this for PC (localhost)
  : `http://${networkIp}:8000/api`; // Use this for Phone (network)

console.log(`API Base URL set to: ${API_BASE_URL}`); // For debugging

// ----------------------------------

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
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

