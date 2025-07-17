
import React from 'react';
import { Service } from '@/hooks/useCatalogues';
import { ArrowRight, Clock, Video, Calendar, User, Tag, Check, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface CatLink5Props {
  services: Service[];
  onSelectService: (serviceId: string) => void;
  searchTerm: string;
  catalogueName?: string;
}

const CatLink5: React.FC<CatLink5Props> = ({ services, onSelectService, searchTerm, catalogueName }) => {
  return (
    <div className="max-w-5xl mx-auto py-6">
      {catalogueName && (
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mx-auto bg-purple-600 text-white rounded-full mb-3 shadow-lg">
            <span className="font-bold text-lg">{catalogueName.substring(0, 2).toUpperCase()}</span>
          </div>
          <h1 className="text-3xl font-bold mb-1 font-playfair gradient-text">{catalogueName}</h1>
          <p className="text-purple-300 max-w-md mx-auto">
            Browse and book available services with just a few clicks
          </p>
        </div>
      )}

      {Array.isArray(services) && services.length > 0 ? (
        <div className="space-y-5" role="list" aria-label="Available services">
          {services.map((service) => (
            <div 
              key={service.id}
              className="enhanced-card border-purple-500/30 hover:border-purple-400/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
              data-service-id={service.id}
              role="listitem"
            >
              <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="bg-purple-600/10 p-6 border-b md:border-b-0 md:border-r border-purple-500/20">
                  <Badge className="mb-3 bg-purple-600/20 text-purple-300 border-purple-500/40 uppercase text-xs tracking-wide hover:bg-purple-600/30">
                    {service.meetingType || 'Premium'}
                  </Badge>
                  <h3 className="text-xl font-bold mb-1 text-purple-200">{service.name}</h3>
                  <p className="text-purple-300 mb-4 text-sm">
                    {service.description || 'Book this service for a professional consultation.'}
                  </p>
                  <div className="flex items-center space-x-1 text-amber-400 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-amber-400" />
                    ))}
                    <span className="text-xs text-purple-400 ml-1">5.0</span>
                  </div>
                  <div className="text-xs text-purple-400">
                    Based on client feedback
                  </div>
                </div>

                <div className="col-span-2 p-6">
                  <div className="flex flex-wrap gap-3 mb-4">
                    <div className="flex items-center px-3 py-1.5 bg-purple-600/10 border border-purple-500/30 rounded-lg text-sm text-purple-300">
                      <Clock className="h-4 w-4 mr-2 text-purple-400" aria-hidden="true" />
                      <span>{service.duration} minutes</span>
                    </div>
                    <div className="flex items-center px-3 py-1.5 bg-purple-600/10 border border-purple-500/30 rounded-lg text-sm text-purple-300">
                      <Video className="h-4 w-4 mr-2 text-purple-400" aria-hidden="true" />
                      <span>{service.meetingType || 'Online Meeting'}</span>
                    </div>
                    <div className="flex items-center px-3 py-1.5 bg-purple-600/10 border border-purple-500/30 rounded-lg text-sm text-purple-300">
                      <Calendar className="h-4 w-4 mr-2 text-purple-400" aria-hidden="true" />
                      <span>Available Now</span>
                    </div>
                    <div className="flex items-center px-3 py-1.5 bg-purple-600/10 border border-purple-500/30 rounded-lg text-sm text-purple-300">
                      <User className="h-4 w-4 mr-2 text-purple-400" aria-hidden="true" />
                      <span>1:1 Session</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-between pt-2">
                    <div className="mb-4 md:mb-0">
                      <div className="font-medium text-purple-400 mb-1">Session cost</div>
                      <div className="text-3xl font-bold text-purple-300">
                        ${service.price || Math.floor(service.duration * 2.5)}
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => onSelectService(service.id)}
                      className="px-8 rounded-full transition-all btn-rich group-hover:shadow-md focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-purple-900"
                      size="lg"
                      aria-label={`Book ${service.name} session`}
                    >
                      Book Session
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div 
          className="enhanced-card rounded-xl border-purple-500/30 shadow py-10 px-6 text-center"
          role="status"
          aria-live="polite"
        >
          <div className="bg-purple-600/20 h-16 w-16 rounded-full mx-auto flex items-center justify-center mb-4 border border-purple-500/30">
            <Calendar className="h-7 w-7 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-purple-200">No Services Available</h3>
          <p className="text-purple-300 max-w-md mx-auto">
            We couldn't find any services matching your criteria. Please try a different search or check back later.
          </p>
        </div>
      )}
    </div>
  );
};

export default CatLink5;
