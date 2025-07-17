
import React from 'react';
import { Service } from '@/hooks/useCatalogues';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, ExternalLink, Info } from 'lucide-react';

interface CatalogueBookingViewProps {
  services: Service[];
  onSelectService: (serviceId: string) => void;
  searchTerm: string;
  catalogueName: string;
}

const CatalogueBookingView3: React.FC<CatalogueBookingViewProps> = ({ 
  services, 
  onSelectService,
  searchTerm,
  catalogueName
}) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-black text-white rounded-2xl overflow-hidden mb-10">
        <div className="px-8 py-12 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
          <h2 className="text-4xl font-bold mb-4">{catalogueName}</h2>
          <p className="text-slate-300 text-lg">
            Select a service from the options below to proceed with booking
          </p>
        </div>
      </div>

      {services.length > 0 ? (
        <div className="space-y-6">
          {services.map((service, index) => (
            <div 
              key={service.id}
              className="flex flex-col md:flex-row border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in"
            >
              {/* Left side color bar */}
              <div 
                className={`w-full md:w-2 flex-shrink-0 ${
                  index % 3 === 0 ? 'bg-blue-500' : 
                  index % 3 === 1 ? 'bg-purple-500' : 
                  'bg-teal-500'
                }`}
              />
              
              {/* Content */}
              <div className="flex-grow p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{service.name}</h3>
                    <p className="text-slate-500">{service.subtitle}</p>
                    
                    <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
                      <div className="flex items-center text-sm text-slate-600">
                        <Clock className="h-4 w-4 mr-2 text-slate-400" />
                        {service.duration} minutes
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                        {service.meetingType}
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <Info className="h-4 w-4 mr-2 text-slate-400" />
                        {service.providerName}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Button
                      onClick={() => onSelectService(service.id)}
                      className={`px-6 whitespace-nowrap ${
                        index % 3 === 0 ? 'bg-blue-500 hover:bg-blue-600' : 
                        index % 3 === 1 ? 'bg-purple-500 hover:bg-purple-600' : 
                        'bg-teal-500 hover:bg-teal-600'
                      }`}
                    >
                      Book Now
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {service.description && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-slate-600 text-sm">{service.description}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-16 border border-slate-200 rounded-xl bg-slate-50">
          <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <Calendar className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="text-2xl font-semibold text-slate-800 mb-2">No Services Available</h3>
          {searchTerm ? (
            <p className="text-slate-600 max-w-md mx-auto">We couldn't find any services matching your search criteria.</p>
          ) : (
            <p className="text-slate-600 max-w-md mx-auto">This catalogue doesn't have any available services at the moment.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CatalogueBookingView3;
