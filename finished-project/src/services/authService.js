/**
 * Authentication Service (Frontend)
 * 
 * Service untuk handle login, register, dan profile management
 * Backend API: POST /api/auth/login, POST /api/auth/register, GET /api/auth/profile
 */

import apiClient from './api';

/**
 * Register new user
 * @param {Object} userData - User data {name, email, password}
 * @returns {Promise} User data dan token
 */
export const register = async (userData) => {
  try {
    const response = await apiClient.post('/api/auth/register', userData);
    
    if (response.data.success && response.data.token) {
      // Save token to localStorage
      localStorage.setItem('auth_token', response.data.token);
      
      // Save user data
      if (response.data.user) {
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
      }
      
      return response.data;
    }
    
    throw new Error(response.data.message || 'Registrasi gagal');
  } catch (error) {
    console.error('Register Error:', error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Registrasi gagal. Silakan coba lagi.'
    );
  }
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} User data dan token
 */
export const login = async (email, password) => {
  try {
    const response = await apiClient.post('/api/auth/login', {
      email,
      password
    });
    
    if (response.data.success && response.data.token) {
      // Save token to localStorage
      localStorage.setItem('auth_token', response.data.token);
      
      // Save user data
      if (response.data.user) {
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
      }
      
      return response.data;
    }
    
    throw new Error(response.data.message || 'Login gagal');
  } catch (error) {
    console.error('Login Error:', error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Login gagal. Periksa email dan password Anda.'
    );
  }
};

/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');
};

/**
 * Get current user profile from backend
 * @returns {Promise} User profile data
 */
export const getProfile = async () => {
  try {
    const response = await apiClient.get('/api/auth/profile');
    
    if (response.data.success && response.data.data) {
      // Update user data in localStorage
      localStorage.setItem('user_data', JSON.stringify(response.data.data));
      return response.data.data;
    }
    
    throw new Error('Failed to get profile');
  } catch (error) {
    console.error('Get Profile Error:', error);
    throw error;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('auth_token');
  return !!token;
};

/**
 * Get current user from localStorage
 * @returns {Object|null} User data or null
 */
export const getCurrentUser = () => {
  const userData = localStorage.getItem('user_data');
  return userData ? JSON.parse(userData) : null;
};

