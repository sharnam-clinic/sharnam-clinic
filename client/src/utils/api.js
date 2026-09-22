import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to inject the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRedirecting = false;

// Add a response interceptor to handle unauthorized errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      
      if (window.location.pathname.startsWith('/admin') && !isRedirecting) {
        isRedirecting = true;
        window.location.replace('/login');
      }
    } else if (!error.response || error.code === 'ERR_NETWORK') {
      // Global fallback message for API/Network failures instead of static mock data
      toast.error('Data is not loading. Cannot connect to the server.', {
        id: 'network-error', // Prevent duplicate toasts
      });
    }
    return Promise.reject(error);
  }
);

export default api;