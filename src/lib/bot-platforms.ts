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
            console.log(`[startBot] Trying to start ${platformType} bot with data:`, data);
            const api = createAuthenticatedRequest();
            const response = await api.post(`${API_BASE_URL}/${platformType}/start`, data);

            console.log(`[startBot] ${platformType} bot started successfully. Status:`, response.status);
            console.log(`[startBot] Response data:`, response.data);

            return { success: true, data: response.data };
        } catch (error: any) {
            console.error(`[startBot] Failed to start ${platformType} bot`);

            if (error.response) {
                console.error(`[startBot] Server responded with status: ${error.response.status}`);
                console.error(`[startBot] Response data:`, error.response.data);

                const status = error.response.status;
                let message = error.response.data || error.message || `Failed to start ${platformType} bot`;

                if (typeof message === 'object' && message.error) {
                    message = message.error;
                }

                if (status === 500) {
                    throw new Error(`Server error: ${message}`);
                } else if (status === 409) {
                    throw new Error(`Platform already running: ${message}`);
                } else {
                    throw new Error(`HTTP ${status}: ${message}`);
                }
            } else if (error.request) {
                console.error(`[startBot] No response received from server`, error.request);
                throw new Error(`Network error: Unable to reach server`);
            } else {
                console.error(`[startBot] Unknown error:`, error.message);
                throw new Error(error.message || `Failed to start ${platformType} bot`);
            }
        }
    },

    stopBot: async (platformType: 'TELEGRAM' | 'WHATSAPP') => {
        try {
            console.log(`[stopBot] Trying to stop ${platformType} bot...`);
            const api = createAuthenticatedRequest();
            const response = await api.post(`${API_BASE_URL}/${platformType}/stop`);

            console.log(`[stopBot] ${platformType} bot stopped successfully. Status:`, response.status);
            console.log(`[stopBot] Response data:`, response.data);

            return { success: true, data: response.data };
        } catch (error: any) {
            console.error(`[stopBot] Failed to stop ${platformType} bot`);
            console.error(`[stopBot] Error details:`, error.response?.data || error.message);

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
  },

  getAiModel: async (): Promise<'GEMINI' | 'GPT'> => {
    try {
      const api = createAuthenticatedRequest();
      const response = await api.get(`${API_BASE_URL}/aiModelType`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data || 'Failed to get AI model');
    }
  },

  getPlatformStatus: async (platformType: 'TELEGRAM' | 'WHATSAPP'): Promise<'ACTIVE' | 'INACTIVE' | null> => {
    try {
      const api = createAuthenticatedRequest();
      const response = await api.get(`${API_BASE_URL}/${platformType}/status`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data || 'Failed to get platform status');
    }
  }
};