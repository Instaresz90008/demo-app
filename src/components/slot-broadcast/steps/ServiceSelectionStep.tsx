
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock, Video, Phone, MapPin, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SlotBroadcastFormValues } from "../SlotBroadcastWorkflow";
import serviceApi, { Service } from "@/services/api/serviceApi";

interface Props {
  values: SlotBroadcastFormValues;
  onChange: (fields: Partial<SlotBroadcastFormValues>) => void;
  onNext: () => void;
}

const ServiceSelectionStep: React.FC<Props> = ({ values, onChange, onNext }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActiveServices();
  }, []);

  const loadActiveServices = async () => {
    try {
      setLoading(true);
      const allServices = await serviceApi.getUserServices();
      // Filter to show only active services
      const activeServices = allServices.filter(service => service.is_active);
      setServices(activeServices);
    } catch (error) {
      console.error('Failed to load services:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!values.selectedService) {
      newErrors.selectedService = "Please select a service";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case "video": return Video;
      case "phone": return Phone;
      case "in-person": return MapPin;
      default: return Video;
    }
  };

  const handleServiceSelect = (service: Service) => {
    onChange({ 
      selectedService: service.id,
      title: service.name,
      description: service.description || '',
      duration: String(service.duration_mins || 30)
    });
    if (errors.selectedService) {
      setErrors(prev => ({ ...prev, selectedService: "" }));
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading your services...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Select Service</h1>
            <p className="text-muted-foreground">Choose an active service to create slot broadcasts</p>
          </div>
        </div>
      </div>

      {/* Service Selection */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            Active Services
            <Badge variant="secondary" className="text-xs">{services.length}</Badge>
          </h2>
          
          {services.length === 0 ? (
            <Card className="border-2 border-dashed border-border">
              <CardContent className="py-12 text-center">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No active services found</h3>
                <p className="text-muted-foreground">Create and activate services in Manage Services to get started.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => {
                const isSelected = values.selectedService === service.id;
                const ServiceIcon = getServiceIcon(service.meetingType || 'video');
                
                return (
                  <Card
                    key={service.id}
                    className={cn(
                      "cursor-pointer transition-all duration-300 hover:scale-[1.02] border-2",
                      isSelected
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                        : "border-border hover:border-primary/50 hover:shadow-md"
                    )}
                    onClick={() => handleServiceSelect(service)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300",
                            isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                          )}>
                            <ServiceIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{service.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {service.description || 'No description available'}
                            </p>
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-6 h-6 text-green-500 animate-scale-in flex-shrink-0" />
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {service.duration_mins || 30}min
                          </span>
                          <Badge variant={service.cost_factor === 0 ? "secondary" : "default"} className="text-xs">
                            ${service.cost_factor || 0}
                          </Badge>
                        </div>
                        <Badge variant="outline" className="text-xs capitalize">
                          {service.serviceType || 'one-to-one'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
          
          {errors.selectedService && (
            <p className="text-destructive text-sm mt-2 animate-fade-in">{errors.selectedService}</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end pt-8 border-t border-border">
        <Button
          onClick={handleNext}
          disabled={!values.selectedService || services.length === 0}
          className={cn(
            "px-8 py-3 h-auto font-semibold text-base rounded-xl transition-all duration-300",
            values.selectedService && services.length > 0
              ? "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl hover:scale-[1.02]"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          Next: Select Dates →
        </Button>
      </div>
    </div>
  );
};

export default ServiceSelectionStep;
