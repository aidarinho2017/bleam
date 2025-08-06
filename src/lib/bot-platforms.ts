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
      const response = await api.post(`${API_BASE_URL}/telegram`, data);
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

  // WhatsApp APIs
  connectWhatsApp: async () => {
    try {
      const api = createAuthenticatedRequest();
      const response = await api.post(`${API_BASE_URL}/whatsapp`);
      return { success: true, qrCode: response.data };
    } catch (error: any) {
      throw new Error(error.response?.data || 'Failed to connect WhatsApp bot');
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
  startBot: async (platformType: 'telegram' | 'whatsapp' | 'WHATSAPP') => {
    try {
      const api = createAuthenticatedRequest();
      const response = await api.post(`${API_BASE_URL}/${platformType}/start`);
      return { success: true, data: response.data };
    } catch (error: any) {
      throw new Error(error.response?.data || `Failed to start ${platformType} bot`);
    }
  },

  stopBot: async (platformType: 'telegram' | 'whatsapp' | 'WHATSAPP') => {
    try {
      const api = createAuthenticatedRequest();
      const response = await api.post(`${API_BASE_URL}/${platformType}/stop`);
      return { success: true, data: response.data };
    } catch (error: any) {
      throw new Error(error.response?.data || `Failed to stop ${platformType} bot`);
    }
  }
};