
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ServiceDraft } from '@/types/smartService';
import { CheckCircle, Clock, Users, DollarSign, Calendar } from 'lucide-react';

interface ServicePreviewProps {
  serviceDraft: ServiceDraft;
  onPublish: () => void;
  onSaveDraft: () => void;
  onBack: () => void;
}

const ServicePreview: React.FC<ServicePreviewProps> = ({
  serviceDraft,
  onPublish,
  onSaveDraft,
  onBack
}) => {
  const { bookingType, pricingModel, config, availabilityBlocks } = serviceDraft;

  const getPriceDisplay = () => {
    const { pricingConfig } = config;
    
    switch (pricingModel.id) {
      case 'fixed':
        return `$${pricingConfig.price || 0}`;
      case 'time-based':
        return `$${pricingConfig.hourlyRate || 0}/hour`;
      case 'per-participant':
        return `$${pricingConfig.pricePerPerson || 0}/person`;
      case 'free':
      case 'free-rsvp':
        return 'Free';
      default:
        return 'Custom pricing';
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          ← Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Preview & Publish</h2>
          <p className="text-muted-foreground">
            Review your service before publishing
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-xl">{config.title}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {bookingType.icon} {bookingType.name}
                </Badge>
                <Badge variant="outline">
                  {pricingModel.icon} {pricingModel.name}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{getPriceDisplay()}</div>
              <div className="text-sm text-muted-foreground">
                {config.visibility.charAt(0).toUpperCase() + config.visibility.slice(1)}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-muted-foreground">{config.description}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{config.duration} min</span>
            </div>
            
            {config.capacity && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Max {config.capacity}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{pricingModel.name}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{availabilityBlocks.length} slots</span>
            </div>
          </div>

          {config.tags.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {config.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="font-medium mb-2">Availability</h4>
            <div className="space-y-2">
              {availabilityBlocks.map((block, index) => (
                <div key={index} className="p-3 bg-muted rounded-lg text-sm">
                  <strong>{block.type === 'recurring' ? 'Weekly Schedule:' : 'Specific Dates:'}</strong>
                  <div className="mt-1">
                    {block.timeSlots.map((slot, slotIndex) => (
                      <div key={slotIndex}>
                        {slot.dayOfWeek !== undefined ? 
                          ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][slot.dayOfWeek] + ': ' : ''}
                        {slot.startTime} - {slot.endTime}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button onClick={onSaveDraft} variant="outline" className="flex-1">
              Save as Draft
            </Button>
            <Button onClick={onPublish} className="flex-1">
              <CheckCircle className="h-4 w-4 mr-2" />
              Publish Service
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicePreview;
