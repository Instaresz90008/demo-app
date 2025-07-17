
import React from 'react';
import { Service } from '@/hooks/catalogue';
import { Clock, MapPin, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AboutSectionProps {
  providerName: string;
  services: Service[];
}

const AboutSection: React.FC<AboutSectionProps> = ({ providerName, services }) => {
  // Calculate average service duration
  const averageDuration = Math.round(
    services.reduce((total, service) => total + service.duration, 0) / services.length
  );

  // Categorize services
  const categories = Array.from(
    new Set(services.map(service => service.category || 'General'))
  );

  return (
    <div className="space-y-5 text-sm">
      <div>
        <h3 className="font-semibold text-gray-800 mb-2">About {providerName}</h3>
        <p className="text-gray-600">
          Professional with over 10 years of experience, dedicated to providing exceptional service 
          and ensuring client satisfaction through personalized attention to detail.
        </p>
      </div>
      
      <div>
        <h3 className="font-semibold text-gray-800 mb-2">Expertise</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge key={category} variant="secondary" className="bg-gray-100">
              {category}
            </Badge>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="font-semibold text-gray-800 mb-2">Details</h3>
        <div className="space-y-2.5">
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-gray-500 mt-0.5" />
            <div>
              <p className="font-medium">Average session</p>
              <p className="text-gray-500">{averageDuration} minutes</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
            <div>
              <p className="font-medium">Location</p>
              <p className="text-gray-500">San Francisco, CA & Remote Services</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Globe className="h-4 w-4 text-gray-500 mt-0.5" />
            <div>
              <p className="font-medium">Languages</p>
              <p className="text-gray-500">English, Spanish</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
