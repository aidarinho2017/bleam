import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/sessions';

export interface Session {
  id: number;
  chatUserId: string;
  platformType: string;
  startedAt: string;
  endedAt: string;
}

export interface Message {
  id: number;
  text: string;
  sender: 'USER' | 'BOT';
  timestamp: string;
}

export const sessionsAPI = {

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