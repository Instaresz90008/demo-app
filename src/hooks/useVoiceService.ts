
import { useState } from 'react';
import { voiceApi } from '../services/api';
import { Conversation } from '../services/api/types';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export const useVoiceService = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const processVoiceQuery = async (query: string) => {
    if (!query.trim()) {
      toast({
        title: "Empty Query",
        description: "Please provide a voice command to process",
        variant: "destructive"
      });
      return null;
    }

    setIsProcessing(true);
    
    try {
      const userId = user?.id.toString() || 'anonymous';
      const response = await voiceApi.processQuery(query, userId);
      
      setCurrentConversation(response);
      
      // Update history if we have a conversation
      if (response) {
        setConversationHistory(prev => [response, ...prev]);
      }
      
      return response;
    } catch (error) {
      toast({
        title: "Processing Error",
        description: error instanceof Error ? error.message : "Failed to process voice query",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const fetchConversationHistory = async (limit = 10) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to view conversation history",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const userId = user.id.toString();
      const history = await voiceApi.getConversationHistory(userId, limit);
      setConversationHistory(history);
    } catch (error) {
      toast({
        title: "History Error",
        description: error instanceof Error ? error.message : "Failed to fetch conversation history",
        variant: "destructive"
      });
    }
  };

  return {
    isProcessing,
    currentConversation,
    conversationHistory,
    processVoiceQuery,
    fetchConversationHistory,
    clearCurrentConversation: () => setCurrentConversation(null),
  };
};

export default useVoiceService;
