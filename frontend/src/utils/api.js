import axios from 'axios';

// Create an Axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle token expiry or global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we receive a 401 Unauthorized, we could clear local storage and redirect to login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Optional: window.location.href = '/login'; 
      // But we will handle this in AuthContext to be React-friendly
    }
    return Promise.reject(error);
  }
);
