
export interface Service {
  id: string;
  name: string;
  subtitle: string;
  description?: string;
  duration: number;
  meetingType: string;
  providerName: string;
  price?: number;
  category?: string;
}

export interface Catalogue {
  id: string;
  name: string;
  slug: string;
  serviceIds: string[];
  createdAt: Date;
  viewMode?: number;
}

export interface CreateCatalogueParams {
  name: string;
  serviceIds: string[];
  viewMode?: number;
}

export interface CatalogueViewProps {
  currentView: number;
  searchTerm: string;
  catalogueName?: string;
  services: Service[];
  onSelectService: (serviceId: string) => void;
}

export interface SearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

/**
 * Maps numeric view mode values to their string representations
 * This ensures consistency between the UI selection and the actual views
 */
export const ViewModeMapping = {
  1: 'grid',       // Card Grid Layout
  2: 'panels',     // Modern Panel Layout
  3: 'list',       // Minimalist List Layout
  4: 'catlink1',   // CatLink-1 Layout
  5: 'catlink2',   // CatLink-2 Layout
  6: 'catlink3',   // CatLink-3 Layout 
  7: 'catlink7',   // CatLink-7 Layout (Social Profile)
  8: 'catlink5',   // CatLink-5 Layout
  9: 'catlink6',   // CatLink-6 Layout
};

export type ViewMode = 
  | 'grid' 
  | 'panels' 
  | 'list' 
  | 'catlink1' 
  | 'catlink2' 
  | 'catlink3' 
  | 'catlink7' 
  | 'catlink5' 
  | 'catlink6';
