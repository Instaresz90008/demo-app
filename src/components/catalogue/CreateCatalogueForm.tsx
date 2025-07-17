
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Service } from '@/hooks/useCatalogues';

interface CreateCatalogueFormProps {
  services: Service[];
  onCreateCatalogue: (name: string, serviceIds: string[], viewMode: number) => void;
}

const CreateCatalogueForm: React.FC<CreateCatalogueFormProps> = ({ 
  services, 
  onCreateCatalogue 
}) => {
  const [newCatalogueName, setNewCatalogueName] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedViewMode, setSelectedViewMode] = useState<number>(1);
  
  const handleCreateCatalogue = () => {
    if (newCatalogueName.trim() === '') {
      toast({
        title: 'Validation Error',
        description: 'Please provide a name for your catalogue.',
        variant: 'destructive',
      });
      return;
    }

    if (selectedServices.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please select at least one service for your catalogue.',
        variant: 'destructive',
      });
      return;
    }

    onCreateCatalogue(newCatalogueName, selectedServices, selectedViewMode);

    // Reset form
    setNewCatalogueName('');
    setSelectedServices([]);
  };

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const filteredServices = searchTerm 
    ? services.filter(service => 
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : services;
    
  return (
    <Card className="border-primary/30 shadow-md animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
        <CardTitle>Create New Catalogue</CardTitle>
        <CardDescription>Group your services into a shareable catalogue.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-5">
        <div className="space-y-2">
          <Label htmlFor="catalogue-name">Catalogue Name</Label>
          <Input 
            id="catalogue-name" 
            placeholder="e.g., Professional Services" 
            value={newCatalogueName}
            onChange={(e) => setNewCatalogueName(e.target.value)}
            className="border-primary/20 focus-visible:ring-primary/30"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="view-mode">Client View Mode</Label>
          <Select 
            value={selectedViewMode.toString()} 
            onValueChange={(value) => setSelectedViewMode(parseInt(value))}
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
              <SelectItem value="7">CatLink-7 Layout (Modern)</SelectItem>
              <SelectItem value="8">CatLink-5 Layout</SelectItem>
              <SelectItem value="9">CatLink-6 Layout</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            This determines how your catalogue will appear to clients when shared.
          </p>
        </div>
        
        <div className="space-y-2">
          <Label className="flex items-center justify-between">
            <span>Select Services</span>
            {filteredServices.length > 5 && (
              <div className="relative w-60">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input 
                  className="pl-8 py-1 h-8 text-sm"
                  placeholder="Filter services..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            )}
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 max-h-[320px] overflow-y-auto pr-1">
            {filteredServices.map((service) => (
              <div 
                key={service.id} 
                className={`flex items-start space-x-2 border rounded-md p-3 transition-colors ${
                  selectedServices.includes(service.id) 
                    ? 'bg-primary/5 border-primary/30' 
                    : 'hover:border-primary/20'
                }`}
              >
                <Checkbox 
                  id={`service-${service.id}`} 
                  checked={selectedServices.includes(service.id)}
                  onCheckedChange={() => handleServiceToggle(service.id)}
                  className="mt-0.5"
                />
                <div className="grid gap-1.5 leading-none">
                  <Label 
                    htmlFor={`service-${service.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {service.name}
                  </Label>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>{service.duration} min</span>
                    <span className="mx-1">·</span>
                    <span>{service.meetingType}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {searchTerm && filteredServices.length === 0 && (
            <p className="text-sm text-center py-4 text-muted-foreground">
              No services match your search. Try a different term.
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-slate-50">
        <Button onClick={handleCreateCatalogue} className="group">
          Create Catalogue
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreateCatalogueForm;
