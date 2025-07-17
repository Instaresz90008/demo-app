
import { useEffect, useCallback } from 'react';
import { useNotifications } from '@/context/NotificationsContext';
import { toast } from '@/components/ui/use-toast';

/**
 * Hook to subscribe to real-time updates for a specific catalogue
 * Uses the centralized notification context for socket management
 */
export const useRealtimeCatalogue = (
  catalogueId: string | undefined,
  onCatalogueUpdate?: () => void
) => {
  const { subscribeToEntity, unsubscribeFromEntity } = useNotifications();
  
  // Create a stable callback for the event handler
  const handleCatalogueUpdate = useCallback((data: any) => {
    console.log('Received catalogue update:', data);
    
    toast({
      title: "Catalogue Updated",
      description: "The catalogue has been updated with new information.",
    });
    
    if (onCatalogueUpdate) {
      onCatalogueUpdate();
    }
  }, [onCatalogueUpdate]);
  
  useEffect(() => {
    if (!catalogueId) return;
    
    // Subscribe to catalogue updates using the centralized system
    subscribeToEntity('catalogue', catalogueId, handleCatalogueUpdate);
    
    // Cleanup: unsubscribe when component unmounts or catalogueId changes
    return () => {
      if (catalogueId) {
        unsubscribeFromEntity('catalogue', catalogueId, handleCatalogueUpdate);
      }
    };
  }, [catalogueId, subscribeToEntity, unsubscribeFromEntity, handleCatalogueUpdate]);
};
