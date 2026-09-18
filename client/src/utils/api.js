import axios from 'axios';

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

// Add a response interceptor to handle unauthorized errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Token is invalid, expired, or not present
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');

      // Define public routes that shouldn't redirect to login on 401
      const publicRoutes = ['/', '/login', '/about', '/contact', '/experts', '/specialities'];
      const isPublicRoute = publicRoutes.some(route => window.location.pathname === route || window.location.pathname.startsWith(route + '/'));

      // Redirect to login page only if not on a public route
      if (!isPublicRoute) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;