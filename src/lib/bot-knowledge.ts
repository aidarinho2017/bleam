import axios from 'axios';
import { authAPI } from './auth';

const API_BASE_URL = 'http://localhost:8080/api/bot-knowledge';

export interface BotKnowledgeData {
  sourceType: 'MANUAL_INPUT' | 'FILE';
  content: string;
}

export const botKnowledgeAPI = {
  getKnowledge: async () => {
    try {
      const token = authAPI.getToken();
      if (!token) throw new Error('No authentication token');
      
      const response = await axios.get(API_BASE_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data || 'Failed to fetch knowledge');
    }
  },

  createKnowledge: async (data: BotKnowledgeData) => {
    try {
      const token = authAPI.getToken();
      if (!token) throw new Error('No authentication token');
      
      const response = await axios.post(API_BASE_URL, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data || 'Failed to create knowledge');
    }
  },

  updateKnowledge: async (content: string) => {
    try {
      const token = authAPI.getToken();
      if (!token) throw new Error('No authentication token');
      
      const response = await axios.put(API_BASE_URL, content, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'text/plain'
        }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data || 'Failed to update knowledge');
    }
  },

  deleteKnowledge: async () => {
    try {
      const token = authAPI.getToken();
      if (!token) throw new Error('No authentication token');
      
      const response = await axios.delete(API_BASE_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data || 'Failed to delete knowledge');
    }
  }
};