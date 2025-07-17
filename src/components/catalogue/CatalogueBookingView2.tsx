
import React from 'react';
import { Service } from '@/hooks/useCatalogues';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, ChevronRight, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CatalogueBookingViewProps {
  services: Service[];
  onSelectService: (serviceId: string) => void;
  searchTerm: string;
  catalogueName: string;
}

const CatalogueBookingView2: React.FC<CatalogueBookingViewProps> = ({ 
  services, 
  onSelectService,
  searchTerm,
  catalogueName
}) => {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl p-6 shadow-lg enhanced-card border-purple-500/30">
        <h2 className="text-2xl font-bold mb-2 text-white">
          {catalogueName}
        </h2>
        <p className="text-purple-100">
          Select a service below to book your appointment
        </p>
      </div>
      
      {services.length > 0 ? (
        services.map((service) => (
          <div 
            key={service.id}
            className="enhanced-card rounded-xl overflow-hidden shadow border-purple-500/30 hover:shadow-xl hover:border-purple-400/50 transition-all duration-300 animate-fade-in"
            role="article"
            aria-labelledby={`service-heading-${service.id}`}
          >
            <div className="bg-gradient-to-r from-purple-600/15 to-purple-800/10 p-4 border-b border-purple-500/20">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                <div>
                  <h3 
                    id={`service-heading-${service.id}`}
                    className="text-lg font-medium text-purple-200"
                  >
                    {service.name}
                  </h3>
                  <p className="text-purple-300 text-sm">{service.subtitle}</p>
                </div>
                <Badge 
                  variant="outline" 
                  className="bg-purple-600/20 text-purple-300 border-purple-500/40 self-start md:self-center"
                >
                  {service.meetingType}
                </Badge>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-purple-300 mb-4">{service.description || "No description available."}</p>
              
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-1.5 text-sm text-purple-300 bg-purple-600/10 px-3 py-1 rounded-full border border-purple-500/30">
                  <Clock className="h-4 w-4 text-purple-400" aria-hidden="true" />
                  <span>{service.duration} minutes</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-purple-300 bg-purple-600/10 px-3 py-1 rounded-full border border-purple-500/30">
                  <Calendar className="h-4 w-4 text-purple-400" aria-hidden="true" />
                  <span>With {service.providerName}</span>
                </div>
              </div>
              
              <Button
                onClick={() => onSelectService(service.id)}
                className="w-full btn-rich group focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-purple-900"
                aria-label={`Book ${service.name} service`}
              >
                <span>Book This Service</span>
                <ChevronRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Button>
            </div>
          </div>
        ))
      ) : (
        <div 
          className="enhanced-card rounded-xl text-center py-12 px-6 border-purple-500/30"
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

export default CatalogueBookingView2;
