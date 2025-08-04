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
  },

  googleSignIn: async (credential: string) => {
    try {
      // Send the Google credential to your backend
      const response = await axios.post(`${API_BASE_URL}/google`, {
        credential: credential
      });
      
      const token = response.data;
      
      // Store token in localStorage
      localStorage.setItem('auth_token', token);
      
      return { success: true, token };
    } catch (error: any) {
      throw new Error(error.response?.data || 'Google sign-in failed');
    }
  },

  forgotPassword: async (email: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/forgot-password`, {
        email
      });
      return { success: true, message: response.data };
    } catch (error: any) {
      throw new Error(error.response?.data || 'Failed to send reset email');
    }
  },

  validateResetToken: async (token: string) => {
    try {
      await axios.get(`${API_BASE_URL}/validate-reset-token`, {
        params: { token }
      });
      return { success: true };
    } catch (error: any) {
      if (error.response?.status === 410) {
        throw new Error('Reset link has expired or is invalid');
      }
      throw new Error(error.response?.data || 'Invalid reset token');
    }
  },

  resetPassword: async (token: string, newPassword: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/reset-password`, {
        token,
        newPassword
      });
      return { success: true, message: response.data };
    } catch (error: any) {
      throw new Error(error.response?.data || 'Failed to reset password');
    }
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