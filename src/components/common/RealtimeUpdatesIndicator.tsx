
import React, { useEffect, useState, useCallback } from 'react';
import { useNotifications } from '@/context/NotificationsContext';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

interface RealtimeUpdatesIndicatorProps {
  className?: string;
  entityId?: string;
  entityType: 'service' | 'catalogue' | 'booking';
}

const RealtimeUpdatesIndicator: React.FC<RealtimeUpdatesIndicatorProps> = ({
  className,
  entityId,
  entityType
}) => {
  const { isRealTimeConnected, subscribeToEntity, unsubscribeFromEntity } = useNotifications();
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const { toast } = useToast();
  
  // Create a stable callback for the update handler
  const handleUpdate = useCallback((data: any) => {
    setIsUpdating(true);
    
    // Show a toast notification
    toast({
      title: `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} Updated`,
      description: `Real-time updates received.`,
    });
    
    // Update the last update time
    setLastUpdateTime(new Date());
    
    // Reset the updating state after a short delay
    setTimeout(() => {
      setIsUpdating(false);
    }, 2000);
  }, [entityType, toast]);
  
  useEffect(() => {
    if (!entityId || !isRealTimeConnected) return;
    
    // Subscribe to entity updates
    subscribeToEntity(entityType, entityId, handleUpdate);
    
    // Unsubscribe when component unmounts or dependencies change
    return () => {
      if (entityId) {
        unsubscribeFromEntity(entityType, entityId, handleUpdate);
      }
    };
  }, [entityId, entityType, isRealTimeConnected, subscribeToEntity, unsubscribeFromEntity, handleUpdate]);
  
  if (!isRealTimeConnected || !entityId) {
    return null;
  }
  
  return (
    <div className={cn("flex items-center space-x-1.5 text-xs", className)}>
      {isUpdating ? (
        <>
          <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
          <span className="text-blue-600">Updating...</span>
        </>
      ) : lastUpdateTime ? (
        <div className="text-gray-500">
          Last updated: {lastUpdateTime.toLocaleTimeString()}
        </div>
      ) : null}
    </div>
  );
};

export default RealtimeUpdatesIndicator;
