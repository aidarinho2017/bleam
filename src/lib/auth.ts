import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/auth';

export interface RegisterData {
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Configure axios defaults
axios.defaults.headers.common['Content-Type'] = 'application/json';

export const authAPI = {
  register: async (data: RegisterData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, data);
      return { success: true, message: response.data };
    } catch (error: any) {
      throw new Error(error.response?.data || 'Registration failed');
    }
  },

  login: async (data: LoginData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, data);
      const token = response.data;
      
      // Store token in localStorage
      localStorage.setItem('auth_token', token);
      
      return { success: true, token };
    } catch (error: any) {
      throw new Error(error.response?.data || 'Login failed');
    }
  },

  logout: () => {
    localStorage.removeItem('auth_token');
  },

  getToken: () => {
    return localStorage.getItem('auth_token');
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('auth_token');
    return !!token;
  }
};

// Add token to requests if available
axios.interceptors.request.use((config) => {
  const token = authAPI.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});