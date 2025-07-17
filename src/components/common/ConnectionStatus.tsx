
import React from 'react';
import { useNotifications } from '@/context/NotificationsContext';
import { Wifi, WifiOff } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ConnectionStatusProps {
  className?: string;
  showText?: boolean;
}

/**
 * Component to display real-time connection status
 * Uses the centralized connection state from NotificationsContext
 */
const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  className,
  showText = true
}) => {
  const { isRealTimeConnected } = useNotifications();
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("flex items-center text-xs gap-1", className)}>
            {isRealTimeConnected ? (
              <>
                <Wifi className="h-3.5 w-3.5 text-green-500" />
                {showText && <span className="text-green-500 hidden sm:inline-block">Real-time connected</span>}
              </>
            ) : (
              <>
                <WifiOff className="h-3.5 w-3.5 text-yellow-500 animate-pulse" />
                {showText && <span className="text-yellow-500 hidden sm:inline-block">Reconnecting...</span>}
              </>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {isRealTimeConnected ? 
            "Real-time updates are active" : 
            "Currently offline, attempting to reconnect..."}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ConnectionStatus;
