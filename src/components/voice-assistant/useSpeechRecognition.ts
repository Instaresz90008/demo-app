
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface SpeechRecognitionHook {
  isListening: boolean;
  transcript: string;
  confidence: number;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  isSupported: boolean;
}

/**
 * Custom hook for speech recognition functionality
 */
export const useSpeechRecognition = (): SpeechRecognitionHook => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [isSupported, setIsSupported] = useState(true);
  const { toast } = useToast();

  // Check browser support for speech recognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
      toast({
        title: "Voice Recognition Not Supported",
        description: "Your browser doesn't support voice recognition. Try using Chrome.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const startListening = () => {
    if (!isSupported) return;
    
    setIsListening(true);
    setTranscript("");
    setConfidence(0);
    
    toast({
      title: "Listening...",
      description: "Say something and I'll try to understand.",
    });
    
    // Simulate voice recognition progress
    const confidenceInterval = setInterval(() => {
      setConfidence(prev => {
        const newValue = prev + Math.random() * 10;
        return newValue > 100 ? 100 : newValue;
      });
    }, 200);
    
    // Simulate receiving speech after 3 seconds
    setTimeout(() => {
      clearInterval(confidenceInterval);
      setConfidence(100);
      setTranscript("Show me my calendar for next week");
      
      setTimeout(() => setIsListening(false), 500);
    }, 3000);
  };

  const stopListening = () => {
    setIsListening(false);
    setConfidence(0);
    
    toast({
      title: "Stopped Listening",
      description: "Tara is no longer listening."
    });
  };

  const resetTranscript = () => {
    setTranscript("");
  };

  return {
    isListening,
    transcript,
    confidence,
    startListening,
    stopListening,
    resetTranscript,
    isSupported
  };
};
