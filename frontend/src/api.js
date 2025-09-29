import axios from 'axios';

// Create a pre-configured instance of axios
const api = axios.create({
  baseURL: 'https://syllabus-tracker-backend-7w7a.onrender.com/api', // Base URL for all requests
});

// This is an interceptor that runs before each request is sent
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // If the token exists, add it to the request headers
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
