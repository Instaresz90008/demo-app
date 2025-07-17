
import { cn } from "@/lib/utils";

interface ListeningStatusProps {
  isListening: boolean;
  animationEnabled: boolean;
}

const ListeningStatus = ({ isListening, animationEnabled }: ListeningStatusProps) => {
  return (
    <div className="w-full max-w-[250px] h-8 flex justify-center items-center mt-2">
      <p className={cn(
        "text-sm font-medium",
        isListening ? "text-primary/80" : "text-muted-foreground"
      )}>
        {isListening ? 'Listening...' : 'Click to start'}
      </p>
    </div>
  );
};

export default ListeningStatus;
