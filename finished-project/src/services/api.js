/**
 * HTTP Client Configuration (Frontend)
 * 
 * CATATAN PENTING:
 * - Ini BUKAN API Server, ini adalah HTTP Client untuk call backend API
 * - React/Frontend TIDAK membuat API, hanya melakukan HTTP requests
 * - Semua API endpoints ada di backend (Node.js/Express) di folder:
 *   health-ecommerce-external-integration/finished-project/
 * 
 * Tujuan:
 * - Centralized axios instance untuk semua HTTP calls ke backend
 * - Handle authentication (Bearer token)
 * - Handle errors secara global
 */

import axios from 'axios';

// Base URL backend API (BUKAN frontend!)
// Backend berjalan di: http://localhost:5000
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create HTTP client instance (untuk call backend API)
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
      localStorage.removeItem('user_data');
      
      // Redirect ke login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(data || error);
  }
);

export default apiClient;

