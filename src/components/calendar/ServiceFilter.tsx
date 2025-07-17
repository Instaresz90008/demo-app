
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Settings, Scale, DollarSign, GraduationCap, Clock } from "lucide-react";

interface ServiceFilterProps {
  services: { name: string; color: string }[];
  selectedServices: string[];
  onServiceToggle: (service: string) => void;
}

const SERVICE_ICONS = {
  'Business Consultation': Briefcase,
  'Technical Support': Settings,
  'Legal Advice': Scale,
  'Financial Planning': DollarSign,
  'Career Coaching': GraduationCap,
  'Available Slot': Clock
};

const ServiceFilter: React.FC<ServiceFilterProps> = ({
  services,
  selectedServices,
  onServiceToggle
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-muted/50 rounded-lg">
      <span className="text-sm font-medium">Filter by Service:</span>
      {services.map((service) => {
        const isSelected = selectedServices.includes(service.name);
        const IconComponent = SERVICE_ICONS[service.name as keyof typeof SERVICE_ICONS] || Clock;
        
        return (
          <Button
            key={service.name}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={() => onServiceToggle(service.name)}
            className="flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <div 
              className="w-3 h-3 rounded-full border border-white shadow-sm flex-shrink-0"
              style={{ backgroundColor: service.color }}
            />
            <IconComponent className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{service.name}</span>
            {isSelected && <Badge variant="secondary" className="ml-1 text-xs">✓</Badge>}
          </Button>
        );
      })}
    </div>
  );
};

export default ServiceFilter;
