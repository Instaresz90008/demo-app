import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Eye, 
  Copy, 
  ExternalLink,
  Calendar,
  Clock,
  Users,
  Palette,
  Layout,
  Smartphone,
  Monitor,
  Grid3X3,
  List,
  BookOpen,
  Star,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

// Import template components
import N9IZV1Mobile from '@/components/booking/N9IZ-V1-Mobile';
import CatalogueBookingView1 from '@/components/catalogue/CatalogueBookingView1';
import CatLink1 from '@/components/catalogue/CatLink1';
import CatLink5 from '@/components/catalogue/CatLink5';
import CatLink7 from '@/components/catalogue/CatLink7';

// Fallback component for when templates fail to load
const TemplateErrorFallback: React.FC<{ templateName: string }> = ({ templateName }) => (
  <div className="flex items-center justify-center h-64 bg-muted/10 rounded-lg border border-dashed">
    <div className="text-center">
      <Palette className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
      <h3 className="font-medium text-muted-foreground">Template Preview Unavailable</h3>
      <p className="text-sm text-muted-foreground/80 mt-1">{templateName}</p>
    </div>
  </div>
);

interface BookingTemplate {
  id: string;
  name: string;
  description: string;
  type: 'booking' | 'catalogue';
  category: 'modern' | 'classic' | 'minimal' | 'premium';
  icon: React.ReactNode;
  preview: string;
  component: React.ComponentType<any>;
  responsive: boolean;
  features: string[];
}

const BOOKING_TEMPLATES: BookingTemplate[] = [
  {
    id: 'n9iz-mobile',
    name: 'N9IZ Mobile Optimized',
    description: 'Mobile-first booking experience with touch-friendly interface',
    type: 'booking',
    category: 'modern',
    icon: <Smartphone className="h-5 w-5" />,
    preview: '/api/templates/n9iz-mobile.jpg',
    component: N9IZV1Mobile,
    responsive: true,
    features: ['Mobile Optimized', 'Touch Friendly', 'Swipe Navigation', 'Fast Loading']
  },
  {
    id: 'catalogue-booking-view1',
    name: 'Catalogue Booking View',
    description: 'Combined catalogue and booking interface',
    type: 'catalogue',
    category: 'modern',
    icon: <BookOpen className="h-5 w-5" />,
    preview: '/api/templates/catalogue-booking-view1.jpg',
    component: CatalogueBookingView1,
    responsive: true,
    features: ['Service Catalogue', 'Integrated Booking', 'Combined View', 'Modern Design']
  },
  {
    id: 'catlink-1',
    name: 'Classic Grid Catalogue',
    description: 'Clean grid layout with search and filtering capabilities',
    type: 'catalogue',
    category: 'classic',
    icon: <Grid3X3 className="h-5 w-5" />,
    preview: '/api/templates/catlink-1.jpg',
    component: CatLink1,
    responsive: true,
    features: ['Grid Layout', 'Search Filter', 'Service Cards', 'Quick Book']
  },
  {
    id: 'catlink-5',
    name: 'Featured Services',
    description: 'Highlighted services with detailed descriptions',
    type: 'catalogue',
    category: 'premium',
    icon: <Star className="h-5 w-5" />,
    preview: '/api/templates/catlink-5.jpg',
    component: CatLink5,
    responsive: true,
    features: ['Featured Layout', 'Rich Content', 'Service Highlights', 'Call-to-Actions']
  },
  {
    id: 'catlink-7',
    name: 'Professional Profile',
    description: 'Complete profile with tabs, about section, and reviews',
    type: 'catalogue',
    category: 'premium',
    icon: <Monitor className="h-5 w-5" />,
    preview: '/api/templates/catlink-7.jpg',
    component: CatLink7,
    responsive: true,
    features: ['Profile Header', 'Tab Navigation', 'About Section', 'Reviews & Social']
  }
];

// Mock service data for previews
const MOCK_SERVICE_DATA = {
  id: 'svc-1',
  name: '30-min Business Consultation',
  description: 'Expert business consultation to help grow your business and strategic planning',
  duration_mins: 30,
  cost_factor: 50,
  serviceType: 'one-to-one',
  meetingType: 'video',
  additionalSettings: {
    meetingTypesConfig: [{
      id: 'video',
      enabled: true,
      price: '50',
      meetingLink: 'https://meet.google.com/abc-def-ghi'
    }]
  }
};

const MOCK_AVAILABLE_SLOTS = [
  { id: '1', date: '2024-12-15', time: '09:00', available: true },
  { id: '2', date: '2024-12-15', time: '10:00', available: true },
  { id: '3', date: '2024-12-16', time: '14:00', available: true },
  { id: '4', date: '2024-12-18', time: '15:00', available: true },
];

const MOCK_SERVICES = [
  {
    id: '1',
    name: 'Business Consultation',
    description: 'Strategic business advice and planning',
    duration: 30,
    price: 50,
    category: 'Consulting',
    providerName: 'John Smith'
  },
  {
    id: '2',
    name: 'Product Strategy Session',
    description: 'Product roadmap and strategy development',
    duration: 60,
    price: 150,
    category: 'Strategy',
    providerName: 'John Smith'
  },
  {
    id: '3',
    name: 'Quick Call',
    description: '15-minute quick consultation call',
    duration: 15,
    price: 25,
    category: 'Support',
    providerName: 'John Smith'
  }
];

const BookingTemplatePreview: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [selectedTemplate, setSelectedTemplate] = useState<BookingTemplate | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredTemplates = BOOKING_TEMPLATES.filter(template => {
    const categoryMatch = filterCategory === 'all' || template.category === filterCategory;
    const typeMatch = filterType === 'all' || template.type === filterType;
    return categoryMatch && typeMatch;
  });

  const copyTemplateLink = (template: BookingTemplate) => {
    const mockUrl = `${window.location.origin}/public/${template.id}/preview`;
    navigator.clipboard.writeText(mockUrl);
    toast({
      title: "Template Link Copied!",
      description: `Preview link for "${template.name}" copied to clipboard.`,
    });
  };

  const useTemplate = (template: BookingTemplate) => {
    toast({
      title: "Template Applied!",
      description: `"${template.name}" template has been set as your default booking interface.`,
    });
    // In real app, this would update user's template preference
  };

  const renderTemplatePreview = (template: BookingTemplate) => {
    const TemplateComponent = template.component;
    
    const commonProps = template.type === 'booking' 
      ? {
          serviceData: MOCK_SERVICE_DATA,
          availableSlots: MOCK_AVAILABLE_SLOTS
        }
      : {
          services: MOCK_SERVICES,
          onSelectService: () => {},
          searchTerm: '',
          catalogueName: 'My Services'
        };

    return (
      <div className={cn(
        "transition-all duration-300",
        previewDevice === 'mobile' 
          ? "max-w-sm mx-auto" 
          : "w-full"
      )}>
        <div className={cn(
          "border rounded-lg overflow-hidden bg-background",
          previewDevice === 'mobile' 
            ? "aspect-[9/16] max-h-[600px]" 
            : "aspect-video"
        )}>
          <div className="w-full h-full overflow-auto">
            <React.Suspense fallback={<TemplateErrorFallback templateName={template.name} />}>
              <TemplateComponent {...commonProps} />
            </React.Suspense>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Booking Templates</h1>
          <p className="text-muted-foreground">Preview how your services look to external clients</p>
        </div>
        <Button onClick={() => navigate('/slot-broadcast')}>
          Create New Booking Link
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex gap-2">
          <Button
            variant={filterType === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('all')}
          >
            All Templates
          </Button>
          <Button
            variant={filterType === 'booking' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('booking')}
          >
            Booking Forms
          </Button>
          <Button
            variant={filterType === 'catalogue' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('catalogue')}
          >
            Service Catalogues
          </Button>
        </div>
        
        <div className="flex gap-2">
          {['modern', 'classic', 'minimal', 'premium'].map(category => (
            <Button
              key={category}
              variant={filterCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterCategory(category)}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {template.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {template.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {template.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {template.description}
              </p>
            </CardHeader>
            
            <CardContent className="pt-0">
              {/* Features */}
              <div className="flex flex-wrap gap-1 mb-4">
                {template.features.slice(0, 3).map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {template.features.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{template.features.length - 3} more
                  </Badge>
                )}
              </div>
              
              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedTemplate(template)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyTemplateLink(template)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => useTemplate(template)}
                >
                  Use Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Preview Modal */}
      <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="flex items-center gap-3">
                  {selectedTemplate?.icon}
                  {selectedTemplate?.name}
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedTemplate?.description}
                </p>
              </div>
              
              {/* Device Toggle */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={previewDevice === 'desktop' ? 'default' : 'outline'}
                  onClick={() => setPreviewDevice('desktop')}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={previewDevice === 'mobile' ? 'default' : 'outline'}
                  onClick={() => setPreviewDevice('mobile')}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          <div className="mt-6">
            {selectedTemplate && renderTemplatePreview(selectedTemplate)}
          </div>
          
          {/* Template Actions */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t">
            <div className="flex flex-wrap gap-1">
              {selectedTemplate?.features.map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => selectedTemplate && copyTemplateLink(selectedTemplate)}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
              <Button
                onClick={() => {
                  if (selectedTemplate) {
                    useTemplate(selectedTemplate);
                    setSelectedTemplate(null);
                  }
                }}
              >
                Use This Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingTemplatePreview;