import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
// Theme system removed - using simple light theme
import { useAuth } from "@/hooks/useAuth";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Import components
import MicButton from "./MicButton";
import AudioVisualizer from "./AudioVisualizer";
import ConfidenceIndicator from "./ConfidenceIndicator";
import TranscriptDisplay from "./TranscriptDisplay";
import ResponseDisplay from "./ResponseDisplay";
import ListeningStatus from "./ListeningStatus";
import TaraHeader from "./TaraHeader";
import VoicePromptSuggestions from "./VoicePromptSuggestions";
import NextStepPrompt from "./NextStepPrompt";

const TaraVoiceAssistant = () => {
  const { toast } = useToast();
  // Theme system removed - using simple light theme
  const { user } = useAuth();
  
  // Local state
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentResponse, setCurrentResponse] = useState("");
  const [responseAnimating, setResponseAnimating] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [credits, setCredits] = useState(1);
  const [showNextStep, setShowNextStep] = useState(false);
  const maxCredits = 50;

  const animationEnabled = false; // Simple theme - no animations

  // Simulate speech recognition with realistic behavior
  const startListening = () => {
    if (isListening) return;
    
    setIsListening(true);
    setHasStarted(true);
    setTranscript("");
    setConfidence(0);
    
    toast({
      title: "Listening...",
      description: "Tara is now listening. Speak clearly into your microphone.",
    });

    // Simulate confidence building
    const confidenceInterval = setInterval(() => {
      setConfidence(prev => {
        const increment = Math.random() * 15 + 5;
        const newValue = prev + increment;
        return newValue > 100 ? 100 : newValue;
      });
    }, 100);

    // Simulate speech recognition after 3-4 seconds
    setTimeout(() => {
      clearInterval(confidenceInterval);
      
      const sampleQueries = [
        "Show me my calendar for next week",
        "Schedule a meeting with John tomorrow",
        "What meetings do I have today?",
        "Block my calendar for lunch",
        "Find available time slots this afternoon"
      ];
      
      const randomQuery = sampleQueries[Math.floor(Math.random() * sampleQueries.length)];
      setTranscript(randomQuery);
      setConfidence(95);
      setIsListening(false);
      
      // Process the recognized speech
      setTimeout(() => {
        processCommand(randomQuery);
      }, 500);
      
    }, 3000 + Math.random() * 1000);
  };

  // Toggle listening state
  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      setConfidence(0);
      toast({
        title: "Stopped listening",
        description: "Tara has stopped listening.",
      });
    } else {
      startListening();
    }
  };

  // Process voice command with realistic responses
  const processCommand = async (command: string) => {
    setResponseAnimating(true);
    setIsProcessing(true);
    setShowNextStep(false);
    
    // Generate contextual response based on command
    let response = "I'd be happy to help you with that request.";
    
    if (command.toLowerCase().includes("calendar")) {
      response = "I can see your calendar is quite busy this week. You have 3 meetings scheduled for tomorrow and 2 open slots in the afternoon.";
    } else if (command.toLowerCase().includes("meeting") || command.toLowerCase().includes("schedule")) {
      response = "I've found several available time slots for your meeting. Would you like me to suggest the best times based on your preferences?";
    } else if (command.toLowerCase().includes("today")) {
      response = "Looking at today's schedule, you have a team standup at 10 AM and a client call at 2 PM. Your afternoon is relatively free.";
    } else if (command.toLowerCase().includes("lunch") || command.toLowerCase().includes("block")) {
      response = "I can block time in your calendar. What time would work best for you? I see 12:30 PM to 1:30 PM is available.";
    } else if (command.toLowerCase().includes("time slots") || command.toLowerCase().includes("available")) {
      response = "I found 4 available time slots this afternoon: 2:30 PM, 3:15 PM, 4:00 PM, and 4:45 PM. Each slot is 30 minutes long.";
    }
    
    // Simulate processing time
    setTimeout(() => {
      setCurrentResponse(response);
      setIsProcessing(false);
      setResponseAnimating(false);
      setCredits(prev => Math.min(prev + 1, maxCredits));
      
      // Show next step prompt after response
      setTimeout(() => {
        setShowNextStep(true);
      }, 1500);
      
      toast({
        title: "Response ready",
        description: "Tara has processed your request successfully.",
      });
    }, 2000 + Math.random() * 1000);
  };

  // Handle voice prompt suggestion clicks
  const handlePromptClick = (prompt: string) => {
    setHasStarted(true);
    setTranscript(prompt);
    processCommand(prompt);
  };

  // Handle next step action
  const handleNextStepAction = (action: string) => {
    setTranscript(action);
    setShowNextStep(false);
    processCommand(action);
  };

  // Reset to initial state
  const resetToInitial = () => {
    setTranscript("");
    setCurrentResponse("");
    setShowNextStep(false);
    setHasStarted(false);
    setConfidence(0);
    setIsListening(false);
    setIsProcessing(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-2">
      {/* Enhanced Header Section with better space utilization */}
      <div className="flex flex-col items-center mb-6">
        <TaraHeader animationEnabled={animationEnabled} />
        
        {/* Credits Display with Tooltip */}
        <div className="mb-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm rounded-full px-4 py-2 cursor-help">
                  <span className="text-sm font-medium text-purple-300">
                    Credits: {credits}/{maxCredits}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>You can make {maxCredits} AI requests per month. Upgrade for more.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {!hasStarted && !isListening && !transcript && (
          <div className="text-center mb-8">
            <p className="text-xl font-semibold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Hey, I'm Tara – your smart scheduler 👋
            </p>
          </div>
        )}
        
        {/* Super Visible Mic Button */}
        <div className="mb-6">
          <MicButton 
            isListening={isListening}
            onToggle={toggleListening}
          />
        </div>

        {/* Microcopy */}
        {!hasStarted && !isListening && !transcript && (
          <div className="text-center mb-12">
            <p className="text-lg text-muted-foreground font-medium">
              Tap to talk to Tara
            </p>
          </div>
        )}
        
        <AudioVisualizer 
          visualizeAudio={true}
          isListening={isListening}
          hasTranscript={!!transcript}
        />
        
        <ConfidenceIndicator 
          isListening={isListening}
          confidence={confidence}
        />
        
        <ListeningStatus 
          isListening={isListening}
          animationEnabled={animationEnabled}
        />
      </div>

      {/* Voice Prompt Suggestions with Ample Spacing */}
      {!hasStarted && !isListening && !transcript && (
        <div className="mb-8">
          <VoicePromptSuggestions onPromptClick={handlePromptClick} />
        </div>
      )}

      {/* Transcript and Response */}
      <div className="space-y-4">
        <TranscriptDisplay 
          transcript={transcript}
          animationEnabled={animationEnabled}
        />

        <ResponseDisplay 
          response={currentResponse}
          processingResponse={isProcessing}
          responseAnimating={responseAnimating}
          animationEnabled={animationEnabled}
        />

        {/* Next Step Prompt */}
        {showNextStep && currentResponse && !isProcessing && (
          <NextStepPrompt 
            onAction={handleNextStepAction}
            onReset={resetToInitial}
            animationEnabled={animationEnabled}
          />
        )}
      </div>
    </div>
  );
};

export default TaraVoiceAssistant;
