
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EyeIcon } from 'lucide-react';
import { Catalogue } from '@/hooks/catalogue/types';
import { openCataloguePreview } from '@/utils/previewUtils';
import { toast } from '@/components/ui/use-toast';

interface ViewModeSettingsProps {
  catalogues: Catalogue[];
  onViewModeChange: (catalogueId: string, viewMode: number) => void;
  onPreviewClick: (slug: string) => void;
}

const ViewModeSettings: React.FC<ViewModeSettingsProps> = ({
  catalogues,
  onViewModeChange,
  onPreviewClick
}) => {
  if (catalogues.length === 0) return null;

  const handlePreviewClick = (catalogue: Catalogue) => {
    if (!catalogue.slug) {
      toast({
        title: "Error",
        description: "This catalogue cannot be previewed because it has no slug.",
        variant: "destructive",
      });
      return;
    }
    
    // Use the utility function to open the preview
    const success = openCataloguePreview(catalogue.slug);
    
    // Only call the parent handler if the preview was successfully opened
    if (success) {
      onPreviewClick(catalogue.slug);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-lg font-medium mb-4">Client View Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {catalogues.map((catalogue) => (
          <Card key={`view-${catalogue.id}`} className="border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{catalogue.name}</CardTitle>
              <CardDescription>Choose how clients see this catalogue</CardDescription>
            </CardHeader>
            <CardContent>
              <Select 
                value={(catalogue.viewMode || 1).toString()} 
                onValueChange={(value) => onViewModeChange(catalogue.id, parseInt(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select view mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Card Grid Layout</SelectItem>
                  <SelectItem value="2">Modern Panel Layout</SelectItem>
                  <SelectItem value="3">Minimalist List Layout</SelectItem>
                  <SelectItem value="4">CatLink-1 Layout</SelectItem>
                  <SelectItem value="5">CatLink-2 Layout</SelectItem>
                  <SelectItem value="6">CatLink-3 Layout</SelectItem>
                  <SelectItem value="7">CatLink-7 Layout (Social Profile)</SelectItem>
                  <SelectItem value="8">CatLink-5 Layout</SelectItem>
                  <SelectItem value="9">CatLink-6 Layout</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
            <CardFooter className="pt-0">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => handlePreviewClick(catalogue)}
              >
                <EyeIcon className="h-3.5 w-3.5 mr-1.5" /> 
                Preview Client View
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ViewModeSettings;
