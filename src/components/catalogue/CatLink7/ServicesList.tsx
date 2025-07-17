
import React, { useState } from 'react';
import { Service } from '@/hooks/catalogue';
import { ArrowRight, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ServicesListProps {
  services: Service[];
  onSelectService: (serviceId: string) => void;
}

const ServicesList: React.FC<ServicesListProps> = ({ services, onSelectService }) => {
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);
  
  // Categorize services
  const categories = Array.from(
    new Set(services.map(service => service.category || 'General'))
  );

  // Toggle service expansion
  const toggleServiceExpansion = (serviceId: string) => {
    if (expandedServiceId === serviceId) {
      setExpandedServiceId(null);
    } else {
      setExpandedServiceId(serviceId);
    }
  };

  return (
    <>
      {/* Categories Filter */}
      {categories.length > 1 && (
        <div className="mb-5 overflow-x-auto whitespace-nowrap pb-2 -mx-4 px-4">
          <div className="flex gap-2">
            <Badge 
              variant="outline" 
              className="cursor-pointer bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
            >
              All Services
            </Badge>
            {categories.map((category) => (
              <Badge 
                key={category}
                variant="outline" 
                className="cursor-pointer hover:bg-gray-100"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        {services.map((service) => (
          <Card 
            key={service.id} 
            className={`overflow-hidden transition-all duration-300 ${
              expandedServiceId === service.id ? 'shadow-md ring-1 ring-purple-100' : 'shadow-sm hover:shadow'
            }`}
          >
            <div 
              className="p-4 cursor-pointer" 
              onClick={() => toggleServiceExpansion(service.id)}
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-medium text-lg text-gray-800">{service.name}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{service.subtitle}</p>
                </div>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 whitespace-nowrap">
                  {service.duration} min
                </Badge>
              </div>
              
              {service.price && (
                <div className="mt-2 text-sm font-medium text-gray-700">
                  ${typeof service.price === 'number' ? service.price.toFixed(2) : service.price}
                </div>
              )}
            </div>
            
            {/* Expanded content */}
            {expandedServiceId === service.id && (
              <CardContent className="bg-gray-50 pt-4 pb-5 px-4 border-t">
                <div className="flex flex-col gap-3">
                  {service.description && (
                    <p className="text-gray-700 text-sm">{service.description}</p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{service.duration} minutes</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-gray-300" aria-hidden="true" />
                    <span>{service.meetingType}</span>
                    {service.category && (
                      <>
                        <div className="w-1 h-1 rounded-full bg-gray-300" aria-hidden="true" />
                        <Badge variant="secondary" className="text-xs px-1.5 py-0 bg-gray-100">
                          {service.category}
                        </Badge>
                      </>
                    )}
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectService(service.id);
                      }}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      Book Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </>
  );
};

export default ServicesList;
