
import React, { useState } from 'react';
import { Bot, Mic, MessageSquare, X, Calendar, Clock, Globe, RotateCcw } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TaraChatInterface from './TaraChatInterface';

interface TaraAIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TaraAIModal: React.FC<TaraAIModalProps> = ({ isOpen, onClose }) => {
  const [currentMode, setCurrentMode] = useState<'intro' | 'voice' | 'text' | 'chat'>('intro');

  const suggestions = [
    "Book a therapy session with Riya this Friday",
    "Cancel my 4PM slot with Alex", 
    "Find a 1-hour gap on Tuesday after 3PM"
  ];

  const capabilities = [
    { icon: Calendar, text: "Book or cancel sessions", color: "text-blue-600" },
    { icon: Clock, text: "Manage your day based on availability", color: "text-green-600" },
    { icon: Globe, text: "Find services across timezones", color: "text-purple-600" },
    { icon: RotateCcw, text: "Reschedule or find better slots", color: "text-orange-600" }
  ];

  const handleModeSelect = (mode: 'voice' | 'text' | 'chat') => {
    setCurrentMode(mode);
  };

  const handleBack = () => {
    setCurrentMode('intro');
  };

  const renderContent = () => {
    if (currentMode === 'intro') {
      return (
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="px-6 py-4 border-b bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <SheetTitle className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  🧠 Meet Tara — Your AI Booking Assistant
                </SheetTitle>
              </div>
            </div>
            <SheetClose asChild>
              <Button variant="ghost" size="sm" className="absolute right-4 top-4">
                <X className="h-4 w-4" />
              </Button>
            </SheetClose>
          </SheetHeader>

          {/* Content */}
          <div className="flex-1 overflow-auto px-6 py-6 space-y-6">
            {/* Introduction */}
            <div className="text-center space-y-3">
              <div className="text-6xl">🤖</div>
              <p className="text-muted-foreground leading-relaxed">
                Tara is your personal co-pilot inside JusBook. She's here to help you book, cancel, reschedule, or optimize your schedule — effortlessly.
              </p>
            </div>

            {/* Capabilities */}
            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Tara can help you:</h3>
              <div className="grid gap-3">
                {capabilities.map((capability, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <capability.icon className={`h-5 w-5 ${capability.color}`} />
                    <span className="text-sm">{capability.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Input Mode Toggle */}
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Just speak or type your request below 👇
              </p>
              
              <div className="flex gap-2 p-1 bg-muted rounded-lg">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleModeSelect('voice')}
                >
                  <Mic className="h-4 w-4 mr-2" />
                  🎙️ Speak
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleModeSelect('text')}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  ✍️ Type & Ask
                </Button>
              </div>
            </div>

            {/* Suggestions */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Try saying:</h4>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <Badge 
                    key={index}
                    variant="outline" 
                    className="block w-full text-left p-3 h-auto whitespace-normal cursor-pointer hover:bg-primary/5 hover:border-primary/20"
                    onClick={() => handleModeSelect('text')}
                  >
                    "{suggestion}"
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t p-6">
            <Button 
              className="w-full" 
              size="lg"
              onClick={() => handleModeSelect('chat')}
            >
              <Bot className="h-4 w-4 mr-2" />
              Start Chatting with Tara
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full">
        {/* Chat Interface Header */}
        <div className="px-4 py-3 border-b flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <span className="font-medium">Tara AI</span>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 min-h-0">
          <TaraChatInterface mode={currentMode as 'voice' | 'text' | 'chat'} />
        </div>
      </div>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[440px] p-0 flex flex-col">
        {renderContent()}
      </SheetContent>
    </Sheet>
  );
};

export default TaraAIModal;
