import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Only logout automatically on 401 if it's not related to email verification
    // and if it's a genuine authentication failure (not a temporary issue)
    if (error.response?.status === 401) {
      // Skip logout for email verification endpoints
      if (error.config?.url?.includes('verify-email')) {
        return Promise.reject(error);
      }
      
      // For other 401 errors, check if we should logout
      // Only logout if we have a token stored (meaning we think we're logged in)
      const token = localStorage.getItem('token');
      if (token) {
        // Clear auth data on unauthorized response
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;