import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/sessions';

export interface Platform {
  type: 'WHATSAPP' | 'TELEGRAM';
  name: string;
  botCount: number;
}

export interface Session {
  sessionId: string;
  nickname?: string;
  status: 'ACTIVE' | 'INACTIVE';
  lastMessageAt?: string;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

export const sessionsAPI = {
  getPlatforms: async (): Promise<Platform[]> => {
    try {
      const response = await axios.get(API_BASE_URL);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data || 'Failed to fetch platforms');
    }
  },

  getSessions: async (platformType: string): Promise<Session[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${platformType}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data || 'Failed to fetch sessions');
    }
  },

  getMessages: async (sessionId: string): Promise<Message[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${sessionId}/messages`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data || 'Failed to fetch messages');
    }
  }
};