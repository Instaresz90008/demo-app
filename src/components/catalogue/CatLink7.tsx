
import React, { useState } from 'react';
import { Service } from '@/hooks/catalogue';

// Import our new component files
import ProfileHeader from './CatLink7/ProfileHeader';
import TabNavigation from './CatLink7/TabNavigation';
import ServicesList from './CatLink7/ServicesList';
import AboutSection from './CatLink7/AboutSection';
import ReviewsSection from './CatLink7/ReviewsSection';
import SocialFooter from './CatLink7/SocialFooter';

interface CatLink7Props {
  services: Service[];
  onSelectService: (serviceId: string) => void;
  searchTerm: string;
  catalogueName?: string;
}

const CatLink7: React.FC<CatLink7Props> = ({ 
  services, 
  onSelectService, 
  catalogueName = "Service Catalogue" 
}) => {
  const [activeTab, setActiveTab] = useState<'services' | 'about' | 'reviews'>('services');
  
  if (!Array.isArray(services) || services.length === 0) {
    return (
      <div 
        className="flex flex-col items-center justify-center h-[400px] text-center px-6 enhanced-card rounded-xl border-purple-500/30 shadow-sm"
        role="status"
        aria-live="polite"
      >
        <div className="h-16 w-16 text-purple-400 mb-4">
          {/* Placeholder for empty state icon */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-purple-200">No services available</h3>
        <p className="text-purple-300 max-w-md mt-2">
          There are currently no services available in this catalogue.
        </p>
      </div>
    );
  }

  // Extract provider name from the first service
  const providerName = services[0]?.providerName || "Service Provider";

  const handleTabChange = (tab: 'services' | 'about' | 'reviews') => {
    setActiveTab(tab);
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in pb-12">
      {/* Profile Header Component */}
      <ProfileHeader 
        providerName={providerName}
        catalogueName={catalogueName}
        servicesCount={services.length}
      />
      
      {/* Tab Navigation */}
      <div className="enhanced-card rounded-xl shadow-md mt-4 overflow-hidden mx-5 border-purple-500/30">
        <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
        
        {/* Tab Content */}
        <div className="p-4">
          {/* Services Tab */}
          {activeTab === 'services' && (
            <ServicesList services={services} onSelectService={onSelectService} />
          )}
          
          {/* About Tab */}
          {activeTab === 'about' && (
            <AboutSection providerName={providerName} services={services} />
          )}
          
          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <ReviewsSection />
          )}
        </div>
      </div>
      
      {/* Footer */}
      <SocialFooter />
    </div>
  );
};

export default CatLink7;
