
import { cn } from "@/lib/utils";

interface ConfidenceIndicatorProps {
  isListening: boolean;
  confidence: number;
}

const ConfidenceIndicator = ({ isListening, confidence }: ConfidenceIndicatorProps) => {
  if (!isListening || confidence <= 0) return null;
  
  return (
    <div className="w-48 mt-2 mb-1">
      <div className="h-1 w-full bg-gray-200/30 dark:bg-gray-700/30 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary/70 rounded-full transition-all duration-300"
          style={{ width: `${confidence}%` }}
        ></div>
      </div>
      <p className="text-xs text-center mt-1 text-muted-foreground">Recognition confidence</p>
    </div>
  );
};

export default ConfidenceIndicator;
