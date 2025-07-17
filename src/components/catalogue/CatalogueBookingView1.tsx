
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Info, ChevronRight } from 'lucide-react';
import { Service } from '@/hooks/useCatalogues';

interface CatalogueBookingViewProps {
  services: Service[];
  onSelectService: (serviceId: string) => void;
  searchTerm: string;
}

const CatalogueBookingView1: React.FC<CatalogueBookingViewProps> = ({ 
  services, 
  onSelectService,
  searchTerm
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="grid" aria-label="Service catalogue">
      {services.length > 0 ? (
        services.map((service, index) => {
          const isEven = index % 2 === 0;
          return (
            <Card 
              key={service.id} 
              className={`h-full flex flex-col transition-all duration-300 hover:shadow-lg enhanced-card border-purple-500/30 hover:border-purple-400/50 animate-fade-in`}
              role="gridcell"
              tabIndex={0}
              aria-labelledby={`service-title-${service.id}`}
              aria-describedby={`service-desc-${service.id}`}
            >
              <CardHeader className="bg-gradient-to-r from-purple-600/10 to-purple-800/5 rounded-t-lg">
                <CardTitle 
                  id={`service-title-${service.id}`}
                  className="flex items-center justify-between text-purple-200"
                >
                  {service.name}
                  {service.duration > 60 && (
                    <span className="text-xs px-2 py-1 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30">
                      Extended
                    </span>
                  )}
                </CardTitle>
                <CardDescription className="text-purple-300">{service.subtitle}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow pt-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-purple-300">
                    <Clock className="h-4 w-4 mr-2 text-purple-400" aria-hidden="true" />
                    <span>{service.duration} minutes</span>
                  </div>
                  <div className="flex items-center text-sm text-purple-300">
                    <Info className="h-4 w-4 mr-2 text-purple-400" aria-hidden="true" />
                    <span>{service.meetingType || "Virtual Meeting"}</span>
                  </div>
                  <p 
                    id={`service-desc-${service.id}`}
                    className="text-sm text-purple-300 mt-2 line-clamp-3"
                  >
                    {service.description || "No description available."}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="pt-2 pb-4">
                <Button 
                  onClick={() => onSelectService(service.id)} 
                  className="w-full group transition-all btn-rich focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-purple-900"
                  aria-label={`Book ${service.name} service`}
                >
                  <span>Book This Service</span>
                  <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Button>
              </CardFooter>
            </Card>
          );
        })
      ) : (
        <div 
          className="col-span-2 text-center py-12 enhanced-card rounded-lg border-purple-500/30"
          role="status"
          aria-live="polite"
        >
          {searchTerm ? (
            <p className="text-purple-300">No services match your search criteria.</p>
          ) : (
            <p className="text-purple-300">No services available in this catalogue.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CatalogueBookingView1;
