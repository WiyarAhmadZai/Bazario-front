import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  // Remove the default Content-Type header so FormData can set it correctly
  headers: {},
  timeout: 10000, // 10 second timeout
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Only set Content-Type to application/json if it's not FormData
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
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
    // Handle network errors specifically
    if (!error.response) {
      // Network error (no response from server)
      console.error('Network error: No response from server. Please check your connection and ensure the server is running.');
      throw new Error('Failed to connect to the server. Please make sure the backend server is running.');
    }
    
    // Log the error for debugging
    console.error('API Error:', error.response?.status, error.response?.data);
    
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