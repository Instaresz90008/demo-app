
import { v4 as uuidv4 } from 'uuid';
import { Catalogue, CreateCatalogueParams } from './types';

/**
 * Generate a URL-friendly slug from the catalogue name
 */
export const generateSlug = (name: string): string => {
  // Create a base slug from the name
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  // Add a unique identifier (first 8 chars of a UUID)
  const uniqueId = uuidv4().split('-')[0];
  
  return `${baseSlug}-${uniqueId}`;
};

/**
 * Create a new catalogue object from parameters
 */
export const createCatalogueObject = (params: CreateCatalogueParams): Catalogue => {
  const slug = generateSlug(params.name);
  
  return {
    id: uuidv4(),
    name: params.name,
    slug,
    serviceIds: params.serviceIds,
    createdAt: new Date(),
    viewMode: params.viewMode || 1,
  };
};
