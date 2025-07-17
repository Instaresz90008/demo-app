
import React from 'react';
import { Service } from '@/hooks/catalogue';
import CatalogueBookingView1 from './CatalogueBookingView1';
import CatalogueBookingView2 from './CatalogueBookingView2';
import CatalogueBookingView3 from './CatalogueBookingView3';
import CatLink1 from './CatLink1';
import CatLink2 from './CatLink2';
import CatLink5 from './CatLink5';
import CatLink6 from './CatLink6';
import CatLink7 from './CatLink7';
import SearchResults from './SearchResults';

interface CatalogueContentProps {
  currentView: number;
  filteredServices: Service[];
  searchTerm: string;
  handleServiceSelect: (serviceId: string) => void;
  clearSearch: () => void;
  catalogueName: string;
  catalogueId?: string;
}

const CatalogueContent: React.FC<CatalogueContentProps> = ({ 
  currentView, 
  filteredServices, 
  searchTerm, 
  handleServiceSelect,
  clearSearch,
  catalogueName
}) => {
  const services = Array.isArray(filteredServices) ? filteredServices : [];
  
  if (services.length === 0 && searchTerm) {
    return <SearchResults searchTerm={searchTerm} clearSearch={clearSearch} />;
  }
  
  switch (currentView) {
    case 1:
      return (
        <CatalogueBookingView1 
          services={services}
          onSelectService={handleServiceSelect}
          searchTerm={searchTerm}
        />
      );
    
    case 2:
      return (
        <CatalogueBookingView2 
          services={services}
          onSelectService={handleServiceSelect}
          searchTerm={searchTerm}
          catalogueName={catalogueName}
        />
      );
    
    case 3:
      return (
        <CatalogueBookingView3 
          services={services}
          onSelectService={handleServiceSelect}
          searchTerm={searchTerm}
          catalogueName={catalogueName}
        />
      );
      
    case 4:
      return (
        <CatLink1 
          services={services}
          onSelectService={handleServiceSelect}
          searchTerm={searchTerm}
          catalogueName={catalogueName}
        />
      );
      
    case 5:
      return (
        <CatLink2 
          services={services}
          onSelectService={handleServiceSelect}
          searchTerm={searchTerm}
          catalogueName={catalogueName}
        />
      );
      
    case 6:
      // CatLink3 archived - redirect to default view
      return (
        <CatalogueBookingView1 
          services={services}
          onSelectService={handleServiceSelect}
          searchTerm={searchTerm}
        />
      );
    
    case 7:
      return (
        <CatLink7
          services={services}
          onSelectService={handleServiceSelect}
          searchTerm={searchTerm}
          catalogueName={catalogueName}
        />
      );
      
    case 8:
      return (
        <CatLink5 
          services={services}
          onSelectService={handleServiceSelect}
          searchTerm={searchTerm}
          catalogueName={catalogueName}
        />
      );
      
    case 9:
      return (
        <CatLink6 
          services={services}
          onSelectService={handleServiceSelect}
          searchTerm={searchTerm}
          catalogueName={catalogueName}
        />
      );
    
    default:
      return (
        <CatalogueBookingView1 
          services={services}
          onSelectService={handleServiceSelect}
          searchTerm={searchTerm}
        />
      );
  }
};

export default CatalogueContent;
