import axios from 'axios';
import { API_ENDPOINTS } from '@/config/api';

const API_BASE_URL = API_ENDPOINTS.BOT_PLATFORMS;

// Create axios instance with authentication
const createAuthenticatedRequest = () => {
  const token = localStorage.getItem('auth_token');
  return axios.create({
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
};

export interface TelegramBotData {
  apiToken: string;
  webhookUrl: string;
}

export interface TelegramBot {
  id: string;
  name?: string;
  token: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface WhatsAppSession {
  id: string;
  nickname?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export const botPlatformsAPI = {
  // Telegram APIs
  connectTelegram: async (data: TelegramBotData) => {
    try {
      const api = createAuthenticatedRequest();
      const response = await api.post(`${API_BASE_URL}/TELEGRAM`, data);
      return { success: true, data: response.data };
    } catch (error: any) {
      throw new Error(error.response?.data || 'Failed to connect Telegram bot');
    }
  },

  getTelegramBots: async (): Promise<TelegramBot[]> => {
    try {
      const api = createAuthenticatedRequest();
      const response = await api.get(`${API_BASE_URL}/telegram-ids`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data || 'Failed to fetch Telegram bots');
    }
  },

  getWhatsAppSessions: async (): Promise<WhatsAppSession[]> => {
    try {
      const api = createAuthenticatedRequest();
      const response = await api.get(`${API_BASE_URL}/whatsapp-ids`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data || 'Failed to fetch WhatsApp sessions');
    }
  },

  // Bot control APIs
  startBot: async (platformType: 'TELEGRAM' | 'WHATSAPP', data?: any) => {
    try {
      const api = createAuthenticatedRequest();
      const response = await api.post(`${API_BASE_URL}/${platformType}/start`, data);
      return { success: true, data: response.data };
    } catch (error: any) {
      // Handle different error types
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const message = error.response.data || error.message || `Failed to start ${platformType} bot`;
        
        if (status === 500) {
          throw new Error(`Server error: ${message}`);
        } else if (status === 409) {
          throw new Error(`Platform already running: ${message}`);
        } else {
          throw new Error(`HTTP ${status}: ${message}`);
        }
      } else if (error.request) {
        // Request made but no response received
        throw new Error(`Network error: Unable to reach server`);
      } else {
        // Something else happened
        throw new Error(error.message || `Failed to start ${platformType} bot`);
      }
    }
  },

  stopBot: async (platformType: 'TELEGRAM' | 'WHATSAPP') => {
    try {
      const api = createAuthenticatedRequest();
      const response = await api.post(`${API_BASE_URL}/${platformType}/stop`);
      return { success: true, data: response.data };
    } catch (error: any) {
      throw new Error(error.response?.data || `Failed to stop ${platformType} bot`);
    }
  },

  // AI Model selection API
  selectAiModel: async (aiModelType: 'GEMINI' | 'GPT') => {
    try {
      const api = createAuthenticatedRequest();
      const response = await api.post(`${API_BASE_URL}/${aiModelType}`);
      return { success: true, data: response.data };
    } catch (error: any) {
      throw new Error(error.response?.data || 'Failed to select AI model');
    }
  }
};