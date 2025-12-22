import axios from 'axios';

const API = axios.create({
  // baseURL: 'http://localhost:5001/api',
  baseURL: 'https://flipkart-1-n14g.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// List of routes that should not trigger redirection on 401
const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/products',
  '/categories',
];

// Request interceptor to add auth token to requests
API.interceptors.request.use(
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

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    const isPublicRoute = publicRoutes.some(route => originalRequest.url.includes(route));

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !isPublicRoute) {
      // Clear token and redirect to login if we have an invalid token
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default API;
