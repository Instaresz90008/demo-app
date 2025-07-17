
import { useState } from 'react';
import { Service } from './types';
import { mockServices } from './mockData';

/**
 * Hook for handling services
 */
export const useServices = () => {
  const [services] = useState<Service[]>(mockServices);

  // Get services for a specific catalogue
  const getServicesForCatalogue = (catalogueId: string, allCatalogues: any[]): Service[] => {
    const catalogue = allCatalogues.find(cat => cat.id === catalogueId);
    if (!catalogue) return [];
    
    return services.filter(service => catalogue.serviceIds.includes(service.id));
  };

  return {
    services,
    getServicesForCatalogue
  };
};
