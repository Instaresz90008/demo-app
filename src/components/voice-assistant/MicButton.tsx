
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface MicButtonProps {
  isListening: boolean;
  onToggle: () => void;
}

const MicButton = ({ isListening, onToggle }: MicButtonProps) => {
  return (
    <div className="relative">
      {/* Enhanced ripple animation when listening */}
      {isListening && (
        <>
          <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping scale-150"></div>
          <div className="absolute inset-0 rounded-full bg-red-500/10 animate-pulse scale-[1.8]"></div>
          <div className="absolute inset-0 rounded-full bg-red-500/5 animate-ping scale-[2.2] animation-delay-500"></div>
        </>
      )}
      
      <Button
        onClick={onToggle}
        size="lg"
        className={cn(
          "relative rounded-full w-28 h-28 lg:w-32 lg:h-32 transition-all duration-500 shadow-2xl border-none outline-none focus:outline-none focus:ring-0 focus:border-none hover:scale-110 transform-gpu",
          isListening 
            ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/60' 
            : 'bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 shadow-purple-500/50 hover:shadow-purple-500/70'
        )}
        style={{ 
          boxShadow: isListening 
            ? '0 0 40px rgba(239, 68, 68, 0.6), 0 0 80px rgba(239, 68, 68, 0.3)' 
            : '0 0 30px rgba(147, 51, 234, 0.5), 0 0 60px rgba(147, 51, 234, 0.2)'
        }}
      >
        {isListening ? (
          <MicOff className="h-12 w-12 lg:h-14 lg:w-14 text-white drop-shadow-lg" />
        ) : (
          <Mic className="h-12 w-12 lg:h-14 lg:w-14 text-white drop-shadow-lg" />
        )}
      </Button>
    </div>
  );
};

export default MicButton;
