
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useCatalogues } from '@/hooks/catalogue';
import CatalogueView1 from '@/components/catalogue/CatalogueView1';
import CatalogueView2 from '@/components/catalogue/CatalogueView2';
import CatalogueView3 from '@/components/catalogue/CatalogueView3';
import ViewSelector from '@/components/catalogue/ViewSelector';
import CreateCatalogueForm from '@/components/catalogue/CreateCatalogueForm';
import ViewModeSettings from '@/components/catalogue/ViewModeSettings';
import { openCataloguePreview } from '@/utils/previewUtils';

const Catalogue = () => {
  const { catalogues, services, createCatalogue, updateCatalogue } = useCatalogues();
  const [isCreatingCatalogue, setIsCreatingCatalogue] = useState(false);
  const [currentView, setCurrentView] = useState(1);

  const handleCreateCatalogue = (name: string, serviceIds: string[], viewMode: number) => {
    createCatalogue({
      name: name,
      serviceIds: serviceIds,
      viewMode: viewMode,
    });

    setIsCreatingCatalogue(false);
    
    toast({
      title: 'Success!',
      description: 'Catalogue created successfully.',
    });
  };

  const handleCopyLink = (slug: string) => {
    const link = `${window.location.origin}/catalogue/${slug}`;
    navigator.clipboard.writeText(link);
    toast({
      title: 'Link Copied!',
      description: 'Catalogue link copied to clipboard.',
    });
  };

  const handleViewModeChange = (catalogueId: string, viewMode: number) => {
    updateCatalogue(catalogueId, { viewMode });
    toast({
      title: 'View mode updated',
      description: 'The catalogue view mode has been updated successfully.',
    });
  };

  const handlePreviewClick = (slug: string) => {
    if (!slug) {
      toast({
        title: 'Error',
        description: 'Cannot preview catalogue: missing slug.',
        variant: 'destructive',
      });
      return;
    }
    
    openCataloguePreview(slug);
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold gradient-text">Service Catalogues</h1>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <ViewSelector currentView={currentView} onChange={setCurrentView} />
          
          <Button 
            onClick={() => setIsCreatingCatalogue(!isCreatingCatalogue)}
            variant={isCreatingCatalogue ? "outline" : "default"}
            className={`transition-all duration-200 ${
              isCreatingCatalogue 
                ? "border-purple-500/40 text-purple-300 hover:bg-purple-600/20" 
                : "btn-rich"
            }`}
          >
            <Plus className="h-4 w-4 mr-2" />
            {isCreatingCatalogue ? 'Cancel' : 'Create Catalogue'}
          </Button>
        </div>
      </div>

      {isCreatingCatalogue && (
        <div className="enhanced-card p-6">
          <CreateCatalogueForm 
            services={services}
            onCreateCatalogue={handleCreateCatalogue}
          />
        </div>
      )}

      {currentView === 1 && (
        <div className="space-y-6">
          <CatalogueView1 
            catalogues={catalogues} 
            services={services} 
            onCopyLink={handleCopyLink} 
          />
          
          <ViewModeSettings 
            catalogues={catalogues}
            onViewModeChange={handleViewModeChange}
            onPreviewClick={handlePreviewClick}
          />
        </div>
      )}
      
      {currentView === 2 && (
        <CatalogueView2 
          catalogues={catalogues} 
          services={services} 
          onCopyLink={handleCopyLink} 
        />
      )}
      
      {currentView === 3 && (
        <CatalogueView3 
          catalogues={catalogues} 
          services={services} 
          onCopyLink={handleCopyLink} 
        />
      )}
    </div>
  );
};

export default Catalogue;
