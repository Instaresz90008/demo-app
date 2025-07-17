
import { useCallback } from 'react';
import { Catalogue, CreateCatalogueParams } from './catalogue/types';
import { useCatalogueStorage } from './catalogue/useCatalogueStorage';
import { useServices } from './catalogue/useServices';
import { createCatalogueObject } from './catalogue/catalogueUtils';

/**
 * Main hook for catalogue operations
 */
export function useCatalogues() {
  const { catalogues, setCatalogues } = useCatalogueStorage();
  const { services, getServicesForCatalogue } = useServices();

  // Create a demo catalogue if none exist
  if (catalogues.length === 0) {
    console.log("Creating demo catalogue");
    const demoCatalogue = createCatalogueObject({
      name: 'Sample Service Catalogue',
      serviceIds: ['1', '2', '3', '4'],
      viewMode: 1
    });
    
    // Override the slug for the demo catalogue
    demoCatalogue.slug = 'demo-catalogue';
    
    setCatalogues([demoCatalogue]);
  }

  // Create a new catalogue
  const createCatalogue = useCallback((params: CreateCatalogueParams): Catalogue => {
    const newCatalogue = createCatalogueObject(params);
    setCatalogues(prev => [...prev, newCatalogue]);
    return newCatalogue;
  }, [setCatalogues]);

  // Update a catalogue
  const updateCatalogue = useCallback((catalogueId: string, updates: Partial<Catalogue>) => {
    setCatalogues(prev => prev.map(cat => 
      cat.id === catalogueId ? { ...cat, ...updates } : cat
    ));
  }, [setCatalogues]);

  // Delete a catalogue
  const deleteCatalogue = useCallback((catalogueId: string) => {
    setCatalogues(prev => prev.filter(cat => cat.id !== catalogueId));
  }, [setCatalogues]);

  // Get a catalogue by its slug
  const getCatalogueBySlug = useCallback((slug: string): Catalogue | undefined => {
    if (!slug) {
      console.error("Cannot find catalogue: slug is empty");
      return undefined;
    }
    
    // Normalize both the input slug and the stored slugs for comparison
    const normalizedSlug = slug.toLowerCase().trim();
    
    // First try exact match
    let result = catalogues.find(cat => 
      cat.slug && cat.slug.toLowerCase().trim() === normalizedSlug
    );
    
    // If not found, try more permissive matching (e.g., without URL encoding issues)
    if (!result) {
      result = catalogues.find(cat => 
        cat.slug && normalizedSlug.includes(cat.slug.toLowerCase().trim())
      );
    }
    
    console.log(`Looking for catalogue with slug '${slug}':`, result ? "Found" : "Not found");
    
    if (!result) {
      console.error(`No catalogue found with slug: ${slug}`);
      console.log("Available catalogues:", catalogues.map(c => ({ id: c.id, slug: c.slug })));
    }
    
    return result;
  }, [catalogues]);

  return {
    catalogues,
    services,
    createCatalogue,
    updateCatalogue,
    deleteCatalogue,
    getCatalogueBySlug,
    getServicesForCatalogue: (catalogueId: string) => getServicesForCatalogue(catalogueId, catalogues)
  };
}

// Re-export types for backward compatibility
export type { Service, Catalogue, CreateCatalogueParams } from './catalogue/types';
