
export interface BookingType {
  id: string;
  key: string;
  name: string;
  description: string;
  icon: string;
  supportedPricingModels: string[];
  availabilityType: 'slot-selection' | 'auto-scheduling' | 'recurring-calendar' | 'collective-sync' | 'custom-mapping';
}

export interface PricingModel {
  id: string;
  name: string;
  description: string;
  icon: string;
  configFields: string[];
}

export interface ServiceConfig {
  title: string;
  description: string;
  duration: number;
  capacity?: number;
  pricingConfig: Record<string, any>;
  visibility: 'public' | 'private' | 'unlisted';
  tags: string[];
}

export interface AvailabilityBlock {
  type: 'recurring' | 'specific' | 'open-hours';
  startDate: string;
  endDate?: string;
  timeSlots: Array<{
    dayOfWeek?: number;
    startTime: string;
    endTime: string;
  }>;
}

export interface ServiceDraft {
  bookingType: BookingType;
  pricingModel: PricingModel;
  config: ServiceConfig;
  availabilityBlocks: AvailabilityBlock[];
  status: 'draft' | 'published';
}
