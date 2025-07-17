
import { useState, useEffect } from 'react';
import { Catalogue } from './types';

// Helper function to deserialize dates from localStorage
const deserializeCatalogues = (catalogues: any[]): Catalogue[] => {
  return catalogues.map(catalogue => ({
    ...catalogue,
    createdAt: catalogue.createdAt?._type === 'Date' 
      ? new Date(catalogue.createdAt.value.iso) 
      : new Date(catalogue.createdAt || Date.now())
  }));
};

// Helper function to serialize dates for localStorage
const serializeCatalogues = (catalogues: Catalogue[]): any[] => {
  return catalogues.map(catalogue => ({
    ...catalogue,
    createdAt: catalogue.createdAt instanceof Date ? {
      _type: 'Date',
      value: {
        iso: catalogue.createdAt.toISOString(),
        value: catalogue.createdAt.getTime(),
        local: catalogue.createdAt.toString()
      }
    } : catalogue.createdAt
  }));
};

/**
 * Hook for localStorage management of catalogues
 */
export const useCatalogueStorage = () => {
  const [catalogues, setCataloguesState] = useState<Catalogue[]>([]);
  
  // Load catalogues from localStorage on initial mount
  useEffect(() => {
    try {
      const storedCatalogues = localStorage.getItem('catalogues');
      if (storedCatalogues) {
        const parsedCatalogues = JSON.parse(storedCatalogues);
        console.log("Loaded catalogues from localStorage:", parsedCatalogues);
        setCataloguesState(deserializeCatalogues(parsedCatalogues));
      }
    } catch (error) {
      console.error("Failed to load catalogues from localStorage:", error);
      // Initialize with empty array if loading fails
      setCataloguesState([]);
    }
  }, []);
  
  // Update function that saves to localStorage
  const setCatalogues = (newCatalogues: Catalogue[] | ((prev: Catalogue[]) => Catalogue[])) => {
    setCataloguesState(prev => {
      const nextCatalogues = typeof newCatalogues === 'function' ? newCatalogues(prev) : newCatalogues;
      try {
        // Save to localStorage
        const serialized = serializeCatalogues(nextCatalogues);
        console.log("Saving catalogues to localStorage:", serialized);
        localStorage.setItem('catalogues', JSON.stringify(serialized));
      } catch (error) {
        console.error("Failed to save catalogues to localStorage:", error);
      }
      return nextCatalogues;
    });
  };

  return {
    catalogues,
    setCatalogues
  };
};
