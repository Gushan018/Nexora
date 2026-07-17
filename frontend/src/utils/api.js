import axios from 'axios';

// Create an Axios instance
const apiBaseUrl = String(import.meta.env.VITE_API_URL || 'http://localhost:5000/api')
  .trim()
  .replace(/^"|"$/g, '');

export const getBackendBaseUrl = () => {
  const base = apiBaseUrl.replace(/\/api$/i, '');
  return base || 'http://localhost:5000';
};

export const DEFAULT_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1572297126131-ebfb1c53cc6f?w=500&q=80';

export const resolveAssetUrl = (url, fallback = '/logo.png') => {
  if (!url || typeof url !== 'string' || !url.trim()) return fallback;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;
  if (url.startsWith('/uploads')) return `${getBackendBaseUrl()}${url}`;
  if (url.startsWith('uploads/')) return `${getBackendBaseUrl()}/${url}`;
  if (url.startsWith('/')) return url;
  return `${getBackendBaseUrl()}/${url}`;
};

export const getImageUrl = (url) => {
  return resolveAssetUrl(url, DEFAULT_PRODUCT_IMAGE);
};

export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the JWT token and handle FormData Content-Type
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
      delete config.headers['content-type'];
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

