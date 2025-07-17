
import React from 'react';
import { Service } from '@/hooks/useCatalogues';
import { ArrowRight, Clock, Video, Calendar, Check, Tag, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface CatLink6Props {
  services: Service[];
  onSelectService: (serviceId: string) => void;
  searchTerm: string;
  catalogueName?: string;
}

const CatLink6: React.FC<CatLink6Props> = ({ services, onSelectService, searchTerm, catalogueName }) => {
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h${mins ? ` ${mins}m` : ''}`;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      {catalogueName && (
        <div className="relative mb-12">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-purple-600/20 to-purple-800/15 rounded-lg -z-10 border border-purple-500/30"></div>
          <div className="pt-10 pb-8 px-10">
            <Badge className="mb-2 bg-purple-600 text-white hover:bg-purple-700 border-purple-500">
              {Array.isArray(services) ? services.length : 0} Services Available
            </Badge>
            <h1 className="text-3xl font-bold text-purple-200 mb-1">{catalogueName}</h1>
            <p className="text-purple-300">Choose the service that best fits your needs</p>
          </div>
          <div className="absolute -bottom-6 left-10">
            <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center shadow-md border border-purple-500/30">
              <Check className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      )}

      {Array.isArray(services) && services.length > 0 ? (
        <div className="space-y-6" role="list" aria-label="Service list">
          {services.map((service) => (
            <div 
              key={service.id}
              className="group border border-purple-500/30 hover:border-purple-400/50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 enhanced-card"
              data-service-id={service.id}
              role="listitem"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/40 hover:bg-purple-600/30">
                        {service.meetingType || 'Meeting'}
                      </Badge>
                      {service.duration && (
                        <div className="text-sm text-purple-300 flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                          {formatDuration(service.duration)}
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-1 text-purple-200">{service.name}</h3>
                    <p className="text-purple-300 text-sm mb-4">
                      {service.description || service.subtitle || "Professional service tailored to your needs."}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center text-xs px-2.5 py-1 rounded-full bg-purple-600/10 border border-purple-500/30 text-purple-300">
                        <Calendar className="h-3 w-3 mr-1.5" aria-hidden="true" />
                        Schedule Anytime
                      </div>
                      {service.meetingType === 'Video Call' ? (
                        <div className="flex items-center text-xs px-2.5 py-1 rounded-full bg-purple-600/10 border border-purple-500/30 text-purple-300">
                          <Video className="h-3 w-3 mr-1.5" aria-hidden="true" />
                          Remote Session
                        </div>
                      ) : (
                        <div className="flex items-center text-xs px-2.5 py-1 rounded-full bg-purple-600/10 border border-purple-500/30 text-purple-300">
                          <Users className="h-3 w-3 mr-1.5" aria-hidden="true" />
                          In-Person
                        </div>
                      )}
                      <div className="flex items-center text-xs px-2.5 py-1 rounded-full bg-purple-600/10 border border-purple-500/30 text-purple-300">
                        <Tag className="h-3 w-3 mr-1.5" aria-hidden="true" />
                        {service.category || 'Professional'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-purple-300 text-2xl font-bold">
                      ${service.price || Math.floor(service.duration * 3)}
                    </div>
                    <Button 
                      onClick={() => onSelectService(service.id)}
                      className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-purple-900"
                      aria-label={`Select ${service.name} service`}
                    >
                      Select
                      <ArrowRight className="ml-2 h-4 w-4 opacity-70 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div 
          className="enhanced-card rounded-xl border-purple-500/30 text-center py-12 px-6"
          role="status"
          aria-live="polite"
        >
          <div className="w-16 h-16 bg-purple-600/20 border border-purple-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-purple-200">No Services Available</h3>
          <p className="text-purple-300 max-w-md mx-auto">
            We couldn't find any services matching your search criteria. Please try a different search term.
          </p>
          {searchTerm && (
            <Button
              variant="outline"
              className="mt-4 border-purple-500/40 text-purple-300 hover:bg-purple-600/20"
              onClick={() => {
                window.location.reload();
              }}
            >
              Clear Search
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default CatLink6;
