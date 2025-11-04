/**
 * API Client Configuration
 * Centralized axios instance untuk semua API calls
 */

import axios from 'axios';

// Base URL dari environment variable atau fallback ke localhost
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance dengan config
const apiClient = axios.create({
  baseURL,
  timeout: 15000, // 15 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (untuk add auth token jika ada)
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage if exists
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (untuk handle errors globally)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject({
        message: 'Tidak dapat terhubung ke server. Pastikan backend berjalan di ' + baseURL
      });
    }

    // Handle HTTP errors
    const { status, data } = error.response;
    
    if (status === 401) {
      // Unauthorized - clear token dan redirect ke login
      localStorage.removeItem('auth_token');
      // window.location.href = '/login'; // Uncomment jika ada login page
    }

    return Promise.reject(data || error);
  }
);

export default apiClient;

