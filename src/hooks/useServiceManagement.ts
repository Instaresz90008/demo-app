
import { useState, useCallback } from 'react';
import { Service } from '@/services/api/serviceApi';
import { UserSubscription } from '@/types/subscription';
import { useToast } from '@/hooks/use-toast';
import { 
  ServiceManagementService, 
  ServiceCatalog, 
  ServicePublication 
} from '@/services/serviceManagement';

export const useServiceManagement = () => {
  const [publishedServices, setPublishedServices] = useState<ServicePublication[]>([]);
  const [catalogs, setCatalogs] = useState<ServiceCatalog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const publishService = useCallback((service: Service, userId: string) => {
    setIsLoading(true);
    try {
      const publication = ServiceManagementService.publishService(service, userId);
      setPublishedServices(prev => [...prev, publication]);
      
      toast({
        title: "Service Published",
        description: `${service.name} is now publicly available for booking`,
      });

      return publication;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish service",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const unpublishService = useCallback((publicationId: string) => {
    setPublishedServices(prev => prev.filter(pub => pub.id !== publicationId));
    toast({
      title: "Service Unpublished",
      description: "Service is no longer publicly available",
    });
  }, [toast]);

  const createCatalog = useCallback((
    services: Service[], 
    userId: string, 
    catalogName: string,
    description?: string
  ) => {
    setIsLoading(true);
    try {
      const catalog = ServiceManagementService.createServiceCatalog(
        services, 
        userId, 
        catalogName, 
        description
      );
      setCatalogs(prev => [...prev, catalog]);
      
      toast({
        title: "Catalog Created",
        description: `${catalogName} catalog is now available with ${services.length} services`,
      });

      return catalog;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create catalog",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const updateCatalog = useCallback((
    catalogId: string, 
    updates: Partial<ServiceCatalog>
  ) => {
    setCatalogs(prev => prev.map(catalog => 
      catalog.id === catalogId 
        ? { ...catalog, ...updates, metadata: { ...catalog.metadata, updatedAt: new Date().toISOString() }}
        : catalog
    ));
    
    toast({
      title: "Catalog Updated",
      description: "Your changes have been saved",
    });
  }, [toast]);

  const deleteCatalog = useCallback((catalogId: string) => {
    setCatalogs(prev => prev.filter(catalog => catalog.id !== catalogId));
    toast({
      title: "Catalog Deleted",
      description: "Catalog has been removed",
    });
  }, [toast]);

  const getServiceLimits = useCallback((subscription: UserSubscription | null) => {
    return ServiceManagementService.getServiceLimits(subscription);
  }, []);

  const canCreateService = useCallback((
    currentServices: Service[], 
    subscription: UserSubscription | null
  ) => {
    return ServiceManagementService.canCreateService(currentServices, subscription);
  }, []);

  const getAnalytics = useCallback(() => {
    return ServiceManagementService.getServiceAnalytics(publishedServices);
  }, [publishedServices]);

  const generateEmbedCode = useCallback((
    type: 'service' | 'catalog',
    item: Service | ServiceCatalog,
    customization?: { width?: string; height?: string; theme?: string }
  ) => {
    if (type === 'service') {
      return ServiceManagementService.generateServiceEmbedCode(item as Service, customization);
    } else {
      return ServiceManagementService.generateCatalogEmbedCode(item as ServiceCatalog, customization);
    }
  }, []);

  return {
    publishedServices,
    catalogs,
    isLoading,
    publishService,
    unpublishService,
    createCatalog,
    updateCatalog,
    deleteCatalog,
    getServiceLimits,
    canCreateService,
    getAnalytics,
    generateEmbedCode,
    // Helper functions
    getServiceBookingLink: ServiceManagementService.getServiceBookingLink,
    getCatalogBookingLink: ServiceManagementService.getCatalogBookingLink
  };
};
