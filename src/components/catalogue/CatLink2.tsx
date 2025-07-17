
import React from 'react';
import { Service } from '@/hooks/useCatalogues';
import { ArrowRight, Clock, Video, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CatLink2Props {
  services: Service[];
  onSelectService: (serviceId: string) => void;
  searchTerm: string;
  catalogueName?: string;
}

const CatLink2: React.FC<CatLink2Props> = ({ services, onSelectService, catalogueName }) => {
  return (
    <div className="space-y-8 py-4">
      {catalogueName && (
        <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-purple-500 to-purple-700 p-1 shadow-lg">
          <div className="enhanced-card rounded-xl p-6 sm:p-8">
            <h2 className="text-3xl sm:text-4xl font-bold gradient-text">
              {catalogueName}
            </h2>
            <p className="mt-2 text-lg text-purple-300">
              Choose your perfect service experience
            </p>
          </div>
        </div>
      )}
      
      <div className="space-y-8" role="list" aria-label="Available services">
        {services.map((service) => (
          <div 
            key={service.id}
            className="group rounded-2xl overflow-hidden bg-gradient-to-r from-purple-500/80 to-purple-700/80 p-1 transition-all duration-300 hover:from-purple-500 hover:to-purple-700 shadow-lg hover:shadow-xl"
            role="listitem"
          >
            <div className="enhanced-card rounded-xl p-6">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-200">{service.name}</h3>
                    <p className="text-sm text-purple-300">{service.subtitle}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-purple-300">
                      <Clock className="h-4 w-4" aria-hidden="true" />
                      <span>{service.duration} min</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-sm font-medium text-purple-300">
                      {service.meetingType === 'Video Call' ? 
                        <Video className="h-4 w-4" aria-hidden="true" /> : 
                        <Users className="h-4 w-4" aria-hidden="true" />
                      }
                      <span>{service.meetingType}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-purple-300">
                  {service.description || "Experience our premium service tailored to your needs."}
                </p>
                
                <div className="flex justify-between items-end pt-4">
                  <div>
                    <div className="text-sm text-purple-400">Provider</div>
                    <div className="font-medium text-purple-200">{service.providerName}</div>
                  </div>
                  <Button
                    onClick={() => onSelectService(service.id)}
                    className="rounded-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 flex items-center gap-2"
                  >
                    Select
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatLink2;
