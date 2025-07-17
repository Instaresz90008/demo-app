
import { API_URL, handleConversationApiError } from './utils';
import { Conversation } from './types';

// Voice assistant API functions
const voiceApi = {
  // N9IZ-API - Process User Voice Query
  processQuery: async (query: string, userId?: string): Promise<Conversation> => {
    try {
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_URL}/conversations/query`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          query, 
          userId: userId || 'anonymous' 
        }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to process query');
      
      return data.data;
    } catch (error) {
      return handleConversationApiError(error, false) as Conversation;
    }
  },
  
  // N9IZ-API - Get Conversation History
  getConversationHistory: async (userId: string, limit = 10): Promise<Conversation[]> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/conversations/history/${userId}?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch conversation history');
      
      return data.data;
    } catch (error) {
      return handleConversationApiError(error, true) as Conversation[];
    }
  },
  
  // N9IZ-API - Get Single Conversation
  getConversation: async (id: number): Promise<Conversation> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/conversations/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch conversation');
      
      return data.data;
    } catch (error) {
      return handleConversationApiError(error, false) as Conversation;
    }
  }
};

export default voiceApi;
