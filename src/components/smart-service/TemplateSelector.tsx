
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Crown, Zap, Clock, Users, Loader2 } from 'lucide-react';
import { BookingType } from '@/types/smartService';
import { useServiceTemplates } from '@/hooks/useServiceTemplates';
import { ServiceTemplate } from '@/services/api/serviceTemplateApi';

interface TemplateSelectorProps {
  bookingType: BookingType;
  industry?: string;
  subcategory?: string;
  onTemplateSelect: (template: ServiceTemplate) => void;
  onSkip: () => void;
  onBack: () => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  bookingType,
  industry,
  subcategory,
  onTemplateSelect,
  onSkip,
  onBack
}) => {
  const { data: templates = [], isLoading, error } = useServiceTemplates({
    bookingType: bookingType.key,
    industry,
    subcategory,
  });

  const getPricingIcon = (template: ServiceTemplate) => {
    const config = template.default_config?.pricing_config;
    if (!config) return '🆓';
    
    if (config.price) return '💰';
    if (config.hourly_rate) return '⏱️';
    if (config.monthly_price) return '🔄';
    if (config.price_per_person) return '👥';
    if (config.bundle_price) return '📦';
    return '💵';
  };

  const formatDuration = (duration?: number) => {
    if (!duration || duration === 0) return 'Variable';
    if (duration >= 60) {
      const hours = Math.floor(duration / 60);
      const mins = duration % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${duration}m`;
  };

  const formatPrice = (template: ServiceTemplate) => {
    // Use dynamic price if available (from backend with location overlay)
    if (template.display_price) {
      return template.display_price.label;
    }

    // Fallback to config price
    const config = template.default_config?.pricing_config;
    if (!config) return 'Free';
    
    if (config.price) return `$${config.price}`;
    if (config.hourly_rate) return `$${config.hourly_rate}/hour`;
    if (config.monthly_price) return `$${config.monthly_price}/month`;
    if (config.price_per_person) return `$${config.price_per_person}/person`;
    if (config.bundle_price) return `$${config.bundle_price} bundle`;
    return 'Free';
  };

  if (error) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-4">Failed to load templates</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div className="text-2xl">{bookingType.icon}</div>
            <div>
              <h1 className="text-2xl font-bold">{bookingType.name} Templates</h1>
              <p className="text-muted-foreground">{bookingType.description}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Choose a template to get started quickly, or skip to create from scratch
          </p>
          <Button variant="outline" onClick={onSkip}>
            Skip Templates
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="text-lg">Loading templates...</p>
          </div>
        </div>
      )}

      {/* Templates Grid */}
      {!isLoading && templates.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card 
              key={template.id}
              className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 hover:border-primary/30"
              onClick={() => onTemplateSelect(template)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getPricingIcon(template)}</span>
                      <CardTitle className="text-lg">{template.title}</CardTitle>
                    </div>
                    <CardDescription className="text-sm">
                      {template.description}
                    </CardDescription>
                  </div>
                  {template.popularity_score >= 85 && (
                    <Badge variant="default" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                      <Crown className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Template Details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{formatDuration(template.default_config?.duration_mins)}</span>
                    {template.default_config?.capacity && (
                      <>
                        <Users className="h-4 w-4 ml-2" />
                        <span>Max {template.default_config.capacity}</span>
                      </>
                    )}
                  </div>
                  
                  {/* Dynamic Pricing Display */}
                  <div className="text-sm font-medium text-primary">
                    {formatPrice(template)}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {template.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {template.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{template.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Use Button */}
                <Button 
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTemplateSelect(template);
                  }}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Use This Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Templates Message */}
      {!isLoading && templates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            <p className="text-lg mb-2">No templates available for this service type yet.</p>
            <p className="text-sm">Click "Skip Templates" to create your service from scratch.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
