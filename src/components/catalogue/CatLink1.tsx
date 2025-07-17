
import React from 'react';
import { Service } from '@/hooks/useCatalogues';
import { ArrowRight, Clock, Video, Users, Calendar, Heart, Tag, Star, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface CatLink1Props {
  services: Service[];
  onSelectService: (serviceId: string) => void;
  searchTerm: string;
  catalogueName?: string;
}

const CatLink1: React.FC<CatLink1Props> = ({ services, onSelectService, searchTerm, catalogueName }) => {
  const handleServiceClick = (serviceId: string) => {
    console.log("Service selected:", serviceId);
    onSelectService(serviceId);
  };

  // Function to determine which layout to display based on preferences
  // This could be expanded to use props, local storage or context to change layouts
  const getLayoutStyle = () => {
    // For demo purposes, you could modify this to allow switching between layouts
    // Options: 'crypto', 'profile', 'booking'
    return 'crypto';
  };

  const layoutStyle = getLayoutStyle();

  // Render appropriate layout based on style selection
  if (layoutStyle === 'crypto') {
    return (
      <CryptoMindsLayout 
        services={services} 
        onSelectService={handleServiceClick} 
        catalogueName={catalogueName} 
      />
    );
  } else if (layoutStyle === 'profile') {
    return (
      <ProfileLayout 
        services={services} 
        onSelectService={handleServiceClick} 
        catalogueName={catalogueName} 
      />
    );
  } else if (layoutStyle === 'booking') {
    return (
      <BookingLayout 
        services={services} 
        onSelectService={handleServiceClick} 
        catalogueName={catalogueName} 
      />
    );
  }

  // Default layout if no specific style is selected
  return (
    <CryptoMindsLayout 
      services={services} 
      onSelectService={handleServiceClick} 
      catalogueName={catalogueName} 
    />
  );
};

// Layout 1: CryptoMinds-inspired layout (inspired by the first image)
const CryptoMindsLayout = ({ services, onSelectService, catalogueName }) => {
  return (
    <div className="py-6 max-w-3xl mx-auto">
      {catalogueName && (
        <div className="flex items-center gap-4 mb-6 bg-amber-50 p-4 rounded-xl">
          <div className="h-12 w-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {catalogueName.substring(0, 2)}
          </div>
          <div>
            <h2 className="text-xl font-bold">{catalogueName}</h2>
            <div className="flex items-center gap-2 text-sm mt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                Online Now
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <Check className="w-3 h-3 mr-1" />
                Public
              </span>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-blue-50 px-4 py-3 rounded-lg mb-4 flex items-center">
        <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center mr-2">
          <Check className="h-3.5 w-3.5" />
        </div>
        <p className="text-sm text-blue-700">AI-Matched with your interests</p>
      </div>
      
      <div className="space-y-3">
        {Array.isArray(services) && services.length > 0 ? services.map((service) => (
          <div 
            key={service.id}
            className="bg-white border border-slate-100 hover:border-amber-200 hover:shadow-md transition-all duration-200 rounded-lg overflow-hidden"
            data-service-id={service.id}
          >
            <div className="p-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-slate-900">{service.name}</h3>
                <span className="text-purple-600 font-bold">${Math.floor(service.duration * 5)}</span>
              </div>
              
              <div className="flex items-center text-slate-500 text-sm mt-1.5">
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                <span>{service.duration} min</span>
              </div>
              
              <Button
                onClick={() => onSelectService(service.id)}
                className="w-full mt-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 justify-between"
              >
                Select
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </Button>
            </div>
          </div>
        )) : (
          <div className="text-center py-8 bg-white rounded-lg border border-slate-100">
            <p className="text-slate-500">No services available. Please try different search criteria.</p>
          </div>
        )}
      </div>
        
      {(!Array.isArray(services) || services.length === 0) && (
        <div className="flex flex-col items-center justify-center py-12 text-center px-4">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Calendar className="h-7 w-7 text-slate-400" />
          </div>
          <h3 className="text-xl font-medium text-slate-800 mb-2">No services available</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            We couldn't find any services matching your criteria. Please try a different search term or check back later.
          </p>
        </div>
      )}
    </div>
  );
};

// Layout 2: Profile-based services layout (inspired by the second image)
const ProfileLayout = ({ services, onSelectService, catalogueName }) => {
  return (
    <div className="py-6">
      {catalogueName && (
        <div className="flex flex-col md:flex-row bg-blue-100 rounded-xl overflow-hidden mb-8">
          <div className="bg-blue-400 md:w-2/5 p-8 flex flex-col">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full bg-blue-100 border-4 border-white shadow-lg overflow-hidden">
                <div className="flex items-center justify-center h-full text-blue-600 font-bold text-2xl">
                  {catalogueName.substring(0, 2).toUpperCase()}
                </div>
              </div>
              <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1.5">
                <Check className="h-4 w-4 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-1">{catalogueName}</h2>
            <p className="text-blue-100 mb-4">Professional Services</p>
            <div className="flex flex-wrap gap-2 mt-auto">
              <div className="bg-white/20 backdrop-blur-sm rounded-md px-2.5 py-1.5 text-xs text-white">Expert Guidance</div>
              <div className="bg-white/20 backdrop-blur-sm rounded-md px-2.5 py-1.5 text-xs text-white">Since 2021</div>
            </div>
          </div>
          
          <div className="p-6 md:p-8 md:w-3/5 bg-white">
            <div className="mb-5 flex gap-2">
              <Button variant="outline" className="rounded-full bg-slate-900 text-white border-slate-900 hover:bg-slate-800 hover:border-slate-800 px-5" size="sm">All</Button>
              <Button variant="outline" className="rounded-full" size="sm">1:1 Call</Button>
              <Button variant="outline" className="rounded-full" size="sm">Priority Support</Button>
            </div>
            
            <div className="space-y-4 mt-6">
              {Array.isArray(services) && services.length > 0 ? services.map((service) => (
                <div 
                  key={service.id}
                  className="group"
                  data-service-id={service.id}
                >
                  <div className="bg-white border border-slate-200 hover:border-blue-200 rounded-xl p-4 transition">
                    <div className="flex justify-between">
                      <div>
                        <Badge variant="outline" className="mb-2 bg-blue-50 text-blue-600 border-blue-100">Popular</Badge>
                        <h3 className="text-lg font-semibold">{service.name}</h3>
                        
                        <div className="flex items-center text-slate-500 text-sm mt-2 mb-3">
                          <div className="mr-4 flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            <span>Replies in 24hrs</span>
                          </div>
                          {service.meetingType === 'Video Call' ? (
                            <div className="flex items-center">
                              <Video className="h-3.5 w-3.5 mr-1" />
                              <span>{service.meetingType}</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <Users className="h-3.5 w-3.5 mr-1" />
                              <span>{service.meetingType}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center justify-end mb-7">
                          <Star className="h-4 w-4 text-amber-400 fill-amber-400 mr-1" />
                          <span className="font-medium">4.8</span>
                        </div>
                        <Button 
                          onClick={() => onSelectService(service.id)}
                          className="rounded-full px-5 flex items-center gap-2"
                          size="sm"
                        >
                          <span className="font-bold">₹{Math.floor(service.duration * 6)}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10">
                  <p className="text-slate-500">No services available.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {(!catalogueName && Array.isArray(services) && services.length > 0) && (
        <div className="space-y-4">
          {services.map((service) => (
            <div 
              key={service.id}
              className="bg-white border border-slate-200 hover:border-blue-200 rounded-xl p-4 transition"
              data-service-id={service.id}
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{service.name}</h3>
                  <div className="flex items-center text-slate-500 text-sm mt-2">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    <span>{service.duration} min</span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => onSelectService(service.id)}
                  className="rounded-full px-5"
                  size="sm"
                >
                  Book now
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {(!Array.isArray(services) || services.length === 0) && (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="text-xl font-medium text-slate-800 mb-2">No services available</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            We couldn't find any services matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
};

// Layout 3: Simple booking layout (inspired by the third image)
const BookingLayout = ({ services, onSelectService, catalogueName }) => {
  return (
    <div className="py-6 max-w-md mx-auto">
      {catalogueName && (
        <div className="mb-6 text-center">
          <div className="inline-flex mx-auto rounded-full overflow-hidden border-2 border-white shadow-md mb-2">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
              {catalogueName.substring(0, 2).toUpperCase()}
            </div>
          </div>
          <h2 className="text-lg font-bold">Book a meeting with {catalogueName}</h2>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow p-6 border border-slate-100">
        {Array.isArray(services) && services.length > 0 ? (
          <div className="space-y-6">
            {services.map((service) => (
              <div key={service.id} className="pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">{service.name}</h3>
                  {service.duration && (
                    <div className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded flex items-center">
                      <Clock className="h-3 w-3 mr-1.5" />
                      {service.duration} min
                    </div>
                  )}
                </div>
                
                <div className="text-sm text-slate-600 mb-4">
                  {service.description || service.subtitle || "Select this option to book your meeting."}
                </div>
                
                <Button
                  onClick={() => onSelectService(service.id)}
                  className="w-full justify-center bg-blue-600 hover:bg-blue-700"
                >
                  Select
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="h-10 w-10 mx-auto text-slate-400 mb-3" />
            <p className="text-slate-500">No available services</p>
          </div>
        )}
      </div>
        
      {(!Array.isArray(services) || services.length === 0) && (
        <div className="flex flex-col items-center justify-center pt-8 text-center px-4">
          <p className="text-slate-500 max-w-md mx-auto">
            No services are currently available. Please check back later.
          </p>
        </div>
      )}
    </div>
  );
};

export default CatLink1;
