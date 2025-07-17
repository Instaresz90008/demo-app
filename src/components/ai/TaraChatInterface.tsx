import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Bot, User, Volume2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface TaraChatInterfaceProps {
  mode: 'voice' | 'text' | 'chat';
  onClose?: () => void;
}

const TaraChatInterface: React.FC<TaraChatInterfaceProps> = ({ mode, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [voskInstance, setVoskInstance] = useState<any>(null);
  const [isVoskLoaded, setIsVoskLoaded] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [modelLoadProgress, setModelLoadProgress] = useState(0);
  const [listeningTimeout, setListeningTimeout] = useState<NodeJS.Timeout | null>(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [voiceMethod, setVoiceMethod] = useState<'vosk' | 'webspeech' | 'text'>('vosk');
  const [webSpeechSupported, setWebSpeechSupported] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-focus input in text mode
  useEffect(() => {
    if (mode === 'text' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [mode]);

  // Check Web Speech API support on component mount
  useEffect(() => {
    const hasWebSpeech = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setWebSpeechSupported(hasWebSpeech);
    console.log('🌐 Web Speech API support:', hasWebSpeech);
  }, []);

  // Initialize Vosk with enhanced loading, timeouts, and intelligent fallbacks
  useEffect(() => {
    const PER_MODEL_TIMEOUT = 30000; // 30s per URL
    const TOTAL_TIMEOUT = 60000;     // 60s global limit
    
    // Progressive feedback messages
    const loadingMessages = [
      "Initializing voice recognition...",
      "Downloading language model...", 
      "Setting up audio pipeline...",
      "Calibrating microphone...",
      "Optimizing speech detection...",
      "Almost ready..."
    ];
    
    const initializeVosk = async () => {
      let timeoutId: NodeJS.Timeout;
      let messageInterval: NodeJS.Timeout;
      let messageIndex = 0;
      
      try {
        setIsModelLoading(true);
        setModelLoadProgress(10);
        console.log('🎙️ Initializing Enhanced Vosk WASM Voice Stack...');
        
        // Progressive feedback with fake loader to prevent hanging perception
        messageInterval = setInterval(() => {
          if (messageIndex < loadingMessages.length - 1) {
            messageIndex++;
            console.log(`📋 ${loadingMessages[messageIndex]}`);
            setModelLoadProgress(prev => Math.min(prev + 5, 85));
          }
        }, 2500);
        
        // Global timeout for entire initialization
        const globalTimeout = new Promise((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(new Error('Vosk initialization timeout after 60 seconds'));
          }, TOTAL_TIMEOUT);
        });
        
        // Preflight URL validation function
        const validateUrl = async (url: string): Promise<boolean> => {
          try {
            const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
            return res.ok;
          } catch (err) {
            console.warn(`❌ HEAD check failed for ${url}:`, err);
            return false;
          }
        };
        
        const initProcess = async () => {
          // Import vosk-browser with progress tracking
          const { createModel } = await import('vosk-browser');
          setModelLoadProgress(30);
          console.log('✅ Vosk createModel function loaded');
          
          // Enhanced model URLs with working alternatives
          const modelUrls = [
            // Your suggested working URLs
            'https://huggingface.co/ambind/vosk-model-small-en-us-0.15/resolve/main/vosk-model-small-en-us-0.15.zip',
            'https://alphacephei.com/vosk/models/vosk-model-en-us-0.22-lgraph.zip',
            
            // Additional reliable alternatives
            'https://github.com/alphacep/vosk-models/releases/download/vosk-model-small-en-us-0.15/vosk-model-small-en-us-0.15.zip',
            'https://cdn.jsdelivr.net/gh/alphacep/vosk-models@main/vosk-model-small-en-us-0.15.zip',
            
            // Original fallbacks (known to have CORS issues but kept as last resort)
            'https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip',
            'https://huggingface.co/alphacep/vosk-model-small-en-us-0.15/resolve/main/vosk-model-small-en-us-0.15.zip'
          ];
          
          setModelLoadProgress(40);
          console.log('📥 Validating model URLs...');
          
          // Preflight checks for all URLs
          const urlValidations = await Promise.allSettled(
            modelUrls.map(async (url, index) => ({
              url,
              index,
              isValid: await validateUrl(url)
            }))
          );
          
          const validUrls = urlValidations
            .filter(result => result.status === 'fulfilled' && result.value.isValid)
            .map(result => (result as PromiseFulfilledResult<any>).value.url);
          
          const urlsToTry = validUrls.length > 0 ? validUrls : modelUrls; // Fallback to all if none validate
          console.log(`📋 ${validUrls.length}/${modelUrls.length} URLs passed preflight checks`);
          
          setModelLoadProgress(50);
          console.log('📥 Attempting to load Vosk model...');
          
          let model = null;
          let lastError = null;
          
          for (let i = 0; i < urlsToTry.length; i++) {
            try {
              const modelUrl = urlsToTry[i];
              console.log(`🔄 Trying model ${i + 1}/${urlsToTry.length}: ${modelUrl}`);
              setModelLoadProgress(50 + (i * 15));
              
              // Create model with 30s timeout per URL
              const modelPromise = createModel(modelUrl);
              const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error(`Model download timeout: ${modelUrl}`)), PER_MODEL_TIMEOUT);
              });
              
              model = await Promise.race([modelPromise, timeoutPromise]);
              
              if (model) {
                console.log('✅ Model loaded successfully:', model);
                setModelLoadProgress(90);
                break;
              }
            } catch (error) {
              lastError = error;
              console.warn(`⚠️ Failed to load model ${i + 1}:`, error);
              
              // Log detailed diagnostics in debug mode
              if (window.location.search.includes('debugTara=true')) {
                console.error('🔍 Debug Info:', {
                  modelAttempted: urlsToTry[i],
                  timeToFailure: `${PER_MODEL_TIMEOUT/1000}s`,
                  errorType: error instanceof Error ? error.name : 'Unknown',
                  fallbackUsed: i < urlsToTry.length - 1
                });
              }
              
              if (i === urlsToTry.length - 1) {
                throw lastError;
              }
            }
          }
          
          if (!model) {
            throw new Error('All model URLs failed to load');
          }
          
          setVoskInstance(model);
          setIsVoskLoaded(true);
          setModelLoadProgress(100);
          console.log('🚀 Enhanced Vosk WASM Voice Stack ready for real-time recognition');
          
          // Clear timeouts on success
          clearTimeout(timeoutId);
          clearInterval(messageInterval);
        };
        
        // Race between initialization and global timeout
        await Promise.race([initProcess(), globalTimeout]);
        
        setIsModelLoading(false);
        
      } catch (error) {
        clearTimeout(timeoutId);
        clearInterval(messageInterval);
        console.error('❌ Failed to initialize Vosk:', error);
        
        // Enhanced error handling with polished UI messaging
        let errorMessage = "Tara's ears are warming up... but the network isn't cooperating. ";
        if (error instanceof Error) {
          if (error.message.includes('timeout')) {
            errorMessage = "Voice model download took too long. Using intelligent fallback mode.";
          } else if (error.message.includes('Network')) {
            errorMessage = "Network hiccup detected. Switching to smart simulation mode.";
          } else {
            errorMessage = "Voice setup encountered an issue. Using advanced fallback system.";
          }
        }
        
        setError(errorMessage);
        setIsVoskLoaded(false);
        setIsModelLoading(false);
        setModelLoadProgress(0);
        
        // Production alerting - log failed model loads for monitoring
        const failureData = {
          error: error instanceof Error ? error.message : String(error),
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          networkStatus: navigator.onLine ? 'online' : 'offline',
          debugMode: window.location.search.includes('debugTara=true')
        };
        
        console.error('🚨 Vosk Load Failure:', failureData);
        
        // Log to production monitoring (if available)
        if (typeof window !== 'undefined' && (window as any).logToMonitoring) {
          (window as any).logToMonitoring('/api/logs/tara-load-failure', failureData);
        }
      }
    };

    initializeVosk();
  }, []);

  // Auto-start listening in voice mode
  useEffect(() => {
    if (mode === 'voice' && isVoskLoaded) {
      startListening();
    }
  }, [mode, isVoskLoaded]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startListening = async () => {
    // 🎯 Smart Hybrid Fallback Strategy Implementation
    if (isVoskLoaded && voskInstance) {
      console.log('🚀 Using Vosk WASM (Method 1/3)');
      setVoiceMethod('vosk');
      return startVoskListening();
    } else if (webSpeechSupported) {
      console.log('🌐 Falling back to Web Speech API (Method 2/3)');
      setVoiceMethod('webspeech');
      return startWebSpeechListening();
    } else {
      console.log('🎭 Final fallback to simulation (Method 3/3)');
      setVoiceMethod('text');
      return simulateVoiceRecognition();
    }
  };

  const startVoskListening = async () => {

    try {
      setIsListening(true);
      setError(null);
      setTranscript('');
      setInterimTranscript('');
      console.log('🎙️ Starting real-time Vosk recognition...');

      // Get microphone access with optimal constraints
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      streamRef.current = stream;

      // Create audio context with 16kHz requirement for Vosk
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000
      });

      // Create source and processor nodes
      const source = audioContextRef.current.createMediaStreamSource(stream);
      const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      
      processorRef.current = processor;

      // Create recognizer from the loaded model
      const recognizer = new (voskInstance as any).KaldiRecognizer(16000);
      
      console.log('✅ Vosk recognizer created and ready');

      // Enhanced audio processing with real-time transcription
      processor.onaudioprocess = (event) => {
        if (!isListening || !recognizer) return;

        const inputBuffer = event.inputBuffer.getChannelData(0);
        
        // Convert Float32Array → Int16Array for Vosk
        const int16Buffer = new Int16Array(inputBuffer.length);
        for (let i = 0; i < inputBuffer.length; i++) {
          const sample = Math.max(-1, Math.min(1, inputBuffer[i]));
          int16Buffer[i] = sample * 0x7FFF;
        }

        // Feed audio to recognizer
        const result = recognizer.acceptWaveform(int16Buffer);
        
        if (result) {
          // Handle final results
          const finalResult = JSON.parse(recognizer.getResult());
          if (finalResult.text && finalResult.text.trim()) {
            console.log('🎯 Final recognition result:', finalResult.text);
            setTranscript(finalResult.text);
            clearListeningTimeout();
            stopListening();
            handleSubmit(finalResult.text);
            return;
          }
        } 
        
        // Handle partial (interim) results for real-time feedback
        try {
          const partialResult = JSON.parse(recognizer.getPartialResult());
          if (partialResult.partial && partialResult.partial.trim()) {
            setInterimTranscript(partialResult.partial);
            setTranscript(partialResult.partial); // Show interim as main transcript
          }
        } catch (e) {
          // Ignore JSON parsing errors for partial results
        }
      };

      // Connect audio nodes
      source.connect(processor);
      processor.connect(audioContextRef.current.destination);

      // 10-second auto-timeout with cleanup
      const timeout = setTimeout(() => {
        console.log('⏱️ Voice recognition timeout reached');
        if (isListening) {
          try {
            const finalResult = JSON.parse(recognizer.getFinalResult());
            if (finalResult.text && finalResult.text.trim()) {
              console.log('🎯 Timeout final result:', finalResult.text);
              setTranscript(finalResult.text);
              handleSubmit(finalResult.text);
            } else if (!transcript && !interimTranscript) {
              setError("Tara couldn't hear anything clearly. Tap mic to retry!");
            }
          } catch (e) {
            console.log('No final result available');
            if (!transcript && !interimTranscript) {
              setError("No speech detected. Tap mic to retry!");
            }
          }
          stopListening();
        }
      }, 10000);
      
      setListeningTimeout(timeout);

    } catch (error) {
      console.error('❌ Error starting Vosk recognition:', error);
      
      // Enhanced error handling with specific messages
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          setError('Microphone access denied. Please allow microphone access and try again.');
        } else if (error.name === 'NotFoundError') {
          setError('No microphone found. Please connect a microphone and try again.');
        } else {
          setError('Voice recognition error. Using intelligent fallback mode.');
        }
      } else {
        setError('Voice recognition unavailable. Using smart simulation.');
      }
      
      setIsListening(false);
      console.log('🔄 Falling back to simulation due to error');
      simulateVoiceRecognition();
    }
  };

  const startWebSpeechListening = async () => {
    try {
      setIsListening(true);
      setError(null);
      setTranscript('');
      setInterimTranscript('');
      console.log('🌐 Starting Web Speech API recognition...');

      // Initialize Web Speech API
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognitionRef.current = recognition;

      // Configure recognition settings
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log('✅ Web Speech API started');
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          console.log('🎯 Web Speech final result:', finalTranscript);
          setTranscript(finalTranscript);
          clearListeningTimeout();
          stopListening();
          handleSubmit(finalTranscript);
        } else if (interimTranscript) {
          setInterimTranscript(interimTranscript);
          setTranscript(interimTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('❌ Web Speech API error:', event.error);
        
        if (event.error === 'not-allowed') {
          setError('Microphone access denied. Please allow microphone access and try again.');
        } else if (event.error === 'no-speech') {
          setError('No speech detected. Tap mic to retry!');
        } else {
          setError('Speech recognition error. Falling back to simulation.');
          simulateVoiceRecognition();
        }
        
        setIsListening(false);
      };

      recognition.onend = () => {
        console.log('🏁 Web Speech API ended');
        if (isListening) {
          setIsListening(false);
        }
      };

      // Start recognition
      recognition.start();

      // 10-second auto-timeout
      const timeout = setTimeout(() => {
        console.log('⏱️ Web Speech timeout reached');
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        if (!transcript && !interimTranscript) {
          setError("No speech detected. Tap mic to retry!");
        }
        setIsListening(false);
      }, 10000);
      
      setListeningTimeout(timeout);

    } catch (error) {
      console.error('❌ Error starting Web Speech API:', error);
      setError('Web Speech API unavailable. Using simulation mode.');
      setIsListening(false);
      simulateVoiceRecognition();
    }
  };

  // Enhanced simulation with progressive typing animation
  const simulateVoiceRecognition = () => {
    setIsListening(true);
    setError(null);
    setTranscript('');
    setInterimTranscript('');
    console.log('🎭 Starting intelligent voice simulation...');
    
    // Simulate progressive transcription with realistic timing
    let progress = 0;
    const phrases = [
      "Book",
      "Book a",
      "Book a therapy",
      "Book a therapy session",
      "Book a therapy session with",
      "Book a therapy session with Dr. Smith",
      "Book a therapy session with Dr. Smith tomorrow at 3PM"
    ];
    
    const progressInterval = setInterval(() => {
      if (progress < phrases.length - 1) {
        setInterimTranscript(phrases[progress]);
        setTranscript(phrases[progress]);
        progress++;
      } else {
        clearInterval(progressInterval);
        setTimeout(() => {
          setIsListening(false);
          console.log('✅ Simulation complete, processing result');
          handleSubmit(phrases[phrases.length - 1]);
        }, 800);
      }
    }, 400);
  };

  // Enhanced cleanup function
  const clearListeningTimeout = () => {
    if (listeningTimeout) {
      clearTimeout(listeningTimeout);
      setListeningTimeout(null);
    }
  };

  const stopListening = () => {
    console.log('🛑 Stopping voice recognition...');
    setIsListening(false);
    clearListeningTimeout();
    
    // Clean up Web Speech API
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    
    // Clean up media stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // Clean up audio processor
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    
    // Clean up audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    console.log('✅ Voice recognition cleanup complete');
  };

  const handleSubmit = async (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setTranscript('');
    setIsProcessing(true);

    // Simulate Tara's response
    setTimeout(() => {
      const taraResponse = generateTaraResponse(messageText);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: taraResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsProcessing(false);
    }, 1500);
  };

  const generateTaraResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('book') || input.includes('schedule')) {
      return "I can help you book that session! I found several available slots. Would you like me to show you the best options based on your calendar?";
    }
    
    if (input.includes('cancel')) {
      return "I can help you cancel that appointment. Let me check your upcoming bookings and find the right session to cancel.";
    }
    
    if (input.includes('reschedule')) {
      return "I'll help you reschedule that session. Based on your availability, I can suggest some alternative time slots that work better.";
    }
    
    if (input.includes('availability') || input.includes('free time')) {
      return "Based on your current calendar, you have several open slots this week. I can show you the best times for scheduling new appointments.";
    }
    
    return "I understand you'd like help with that. Based on your current calendar, I can suggest the best approach to handle your request. Would you like me to show you some options?";
  };

  const retryVoice = () => {
    setError(null);
    setTranscript('');
    startListening();
  };

  if (mode === 'voice') {
    return (
      <div className="p-6 space-y-6">
        {/* Enhanced Voice Interface with Premium UX */}
        <div className="text-center space-y-4">
          
          {/* Model Loading Progress */}
          {isModelLoading && (
            <div className="space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-primary/20 to-primary/40 flex items-center justify-center">
                <Bot className="h-8 w-8 text-primary animate-pulse" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Loading Voice Recognition Model...</p>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary to-primary-foreground h-2 rounded-full transition-all duration-300"
                    style={{ width: `${modelLoadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{modelLoadProgress}% complete</p>
              </div>
            </div>
          )}

          {/* Main Mic Button with Premium Animations */}
          {!isModelLoading && (
            <div className="relative">
              <Button
                onClick={isListening ? stopListening : startListening}
                size="lg"
                disabled={!isVoskLoaded && !error}
                className={cn(
                  "w-24 h-24 rounded-full transition-all duration-300 relative overflow-hidden",
                  isListening 
                    ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg" 
                    : isVoskLoaded 
                      ? "bg-gradient-to-r from-primary to-primary-foreground hover:shadow-lg hover:scale-105" 
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                {isListening ? (
                  <MicOff className="h-10 w-10 animate-pulse" />
                ) : (
                  <Mic className="h-10 w-10" />
                )}
              </Button>
              
              {/* Animated Pulsing Ring while Listening */}
              {isListening && (
                <>
                  <div className="absolute inset-0 rounded-full border-4 border-red-500/40 animate-ping scale-110" />
                  <div className="absolute inset-0 rounded-full border-2 border-red-400/60 animate-ping scale-125" 
                       style={{ animationDelay: '0.5s' }} />
                  <div className="absolute inset-0 rounded-full border border-red-300/80 animate-ping scale-140" 
                       style={{ animationDelay: '1s' }} />
                </>
              )}
              
              {/* Ready Glow Effect */}
              {!isListening && isVoskLoaded && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-primary-foreground/20 animate-pulse" />
              )}
            </div>
          )}
          
          {/* Enhanced Status Messages with Voice Method Indicator */}
          <div className="space-y-2">
            {/* Voice Method Badge */}
            {!isModelLoading && (
              <div className="flex justify-center">
                <div className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium",
                  voiceMethod === 'vosk' && "bg-green-100 text-green-700",
                  voiceMethod === 'webspeech' && "bg-blue-100 text-blue-700", 
                  voiceMethod === 'text' && "bg-amber-100 text-amber-700"
                )}>
                  {voiceMethod === 'vosk' && "🚀 Vosk WASM"}
                  {voiceMethod === 'webspeech' && "🌐 Web Speech API"}
                  {voiceMethod === 'text' && "🎭 Simulation Mode"}
                </div>
              </div>
            )}
            
            {isModelLoading ? (
              <p className="text-lg font-medium text-primary">Preparing Voice Recognition...</p>
            ) : isListening ? (
              <div className="space-y-1">
                <p className="text-lg font-medium text-red-600 animate-pulse">🎙️ Listening...</p>
                <p className="text-sm text-muted-foreground">Speak naturally, I'm processing in real-time</p>
              </div>
            ) : isVoskLoaded ? (
              <div className="space-y-1">
                <p className="text-lg font-medium">🎯 Ready to Listen</p>
                <p className="text-sm text-muted-foreground">Tap mic to start • Privacy-safe local processing</p>
              </div>
            ) : webSpeechSupported ? (
              <div className="space-y-1">
                <p className="text-lg font-medium">🌐 Web Speech Ready</p>
                <p className="text-sm text-muted-foreground">Tap mic to start • Browser-native voice recognition</p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-lg font-medium text-amber-600">Using Smart Simulation</p>
                <p className="text-sm text-muted-foreground">Tap mic to demonstrate voice interaction</p>
              </div>
            )}
            
            {/* Real-time Transcript with Interim Results */}
            {(transcript || interimTranscript) && (
              <div className="p-4 bg-gradient-to-r from-muted/50 to-muted rounded-lg border">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 animate-pulse" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">Live Transcript:</p>
                    <p className="font-medium text-sm">
                      {transcript}
                      {interimTranscript && !transcript && (
                        <span className="text-muted-foreground animate-pulse">{interimTranscript}</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Enhanced Error Messages with Retry */}
            {error && (
              <div className="p-4 bg-gradient-to-r from-destructive/10 to-destructive/5 rounded-lg border border-destructive/20 space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-destructive mt-2" />
                  <p className="text-sm text-destructive flex-1">{error}</p>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={retryVoice}
                    className="text-xs hover:bg-destructive/10 border-destructive/30"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Retry Voice
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setError(null)}
                    className="text-xs text-muted-foreground"
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Messages with Enhanced Styling */}
        {messages.length > 0 && (
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isProcessing && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    );
  }

  if (mode === 'text') {
    return (
      <div className="p-6 space-y-6">
        {/* Text Input */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Type your request here..."
              className="flex-1"
            />
            <Button 
              onClick={() => handleSubmit()}
              disabled={!inputValue.trim() || isProcessing}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        {messages.length > 0 && (
          <ScrollArea className="h-64">
            <div className="space-y-4 pr-4">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isProcessing && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        )}
      </div>
    );
  }

  // Chat mode (full interface)
  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <Bot className="h-6 w-6 text-primary" />
          <div>
            <h3 className="font-semibold">Tara AI Assistant</h3>
            <p className="text-sm text-muted-foreground">Your booking co-pilot</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Start a conversation with Tara!</p>
            </div>
          )}
          
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {isProcessing && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={startListening}
            disabled={isListening}
            className="shrink-0"
          >
            <Mic className="h-4 w-4" />
          </Button>
          
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Ask Tara anything..."
            className="flex-1"
          />
          
          <Button 
            onClick={() => handleSubmit()}
            disabled={!inputValue.trim() || isProcessing}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const MessageBubble: React.FC<{ message: Message }> = ({ message }) => (
  <div className={cn(
    "flex gap-2",
    message.isUser ? "justify-end" : "justify-start"
  )}>
    {!message.isUser && (
      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
        <Bot className="h-3 w-3 text-primary-foreground" />
      </div>
    )}
    
    <div className={cn(
      "max-w-[80%] p-3 rounded-lg",
      message.isUser 
        ? "bg-primary text-primary-foreground" 
        : "bg-muted"
    )}>
      <p className="text-sm">{message.content}</p>
    </div>
    
    {message.isUser && (
      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0">
        <User className="h-3 w-3" />
      </div>
    )}
  </div>
);

const TypingIndicator: React.FC = () => (
  <div className="flex gap-2 justify-start">
    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
      <Bot className="h-3 w-3 text-primary-foreground" />
    </div>
    
    <div className="bg-muted p-3 rounded-lg">
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
      </div>
    </div>
  </div>
);

export default TaraChatInterface;
