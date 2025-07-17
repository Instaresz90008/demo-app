
export interface ServiceSlot {
  id?: string;
  date: string;
  startTime: string;
  endTime: string;
  isRecurring?: boolean;
  recurrencePattern?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: string;
  };
  isAvailable?: boolean;
}

export interface ServiceTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  industry?: string;
  duration: number;
  suggestedPrice: number;
  maxParticipants: number;
  bookingType: 'one-to-one' | 'group' | 'webinar';
  features?: string[];
  tags?: string[];
  isPopular?: boolean;
}

export interface ProviderInfo {
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
  timezone?: string;
  bio?: string;
  website?: string;
  company?: string;
}

export interface OnboardingData {
  currentStep: number;
  userType: 'solo' | 'team' | 'business';
  businessCompliance?: {
    businessName?: string;
    businessType?: string;
    license?: string;
    complianceStatus?: 'pending' | 'approved' | 'rejected';
  };
  bookingType: 'one-to-one' | 'group' | 'webinar';
  pricingModel: 'per-person' | 'per-session' | 'donation';
  eventType: 'one-time' | 'package' | 'subscription';
  templateId?: string;
  selectedTemplate?: ServiceTemplate;
  providerInfo?: ProviderInfo;
  serviceDetails: {
    name: string;
    description: string;
    duration: number;
    price: number;
    maxParticipants: number;
    category: string;
    slots?: ServiceSlot[];
    bookingLink?: string;
    hostInfo?: ProviderInfo;
    linkGeneratedAt?: string;
    publicBookingConfig?: any;
  };
  createdServiceId?: string;
  isCompleted?: boolean;
}

export interface OnboardingState {
  data: OnboardingData;
  templates: ServiceTemplate[];
  loading: boolean;
  error: string | null;
  showOnboarding: boolean;
}
