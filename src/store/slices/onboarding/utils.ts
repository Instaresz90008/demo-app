
import { OnboardingData } from './types';

// Map booking type to service type with proper typing
export const getServiceType = (bookingType: string | null): "one-to-one" | "one-to-many" => {
  if (bookingType === 'one-to-one') return 'one-to-one';
  return 'one-to-many'; // For both 'group' and 'webinar'
};

// Map onboarding data to service API format
export const mapOnboardingToServiceData = (onboardingData: OnboardingData) => {
  return {
    name: onboardingData.serviceDetails.name,
    description: onboardingData.serviceDetails.description,
    duration_mins: onboardingData.serviceDetails.duration,
    cost_factor: onboardingData.serviceDetails.price,
    serviceType: getServiceType(onboardingData.bookingType),
    meetingType: 'video', // Default to video
    is_active: true,
    max_attendees: onboardingData.serviceDetails.maxParticipants,
    createdAt: new Date().toISOString(),
    additionalSettings: {
      meetingTypesConfig: [
        { 
          id: "video", 
          enabled: true, 
          price: onboardingData.serviceDetails.price.toString(),
          maxParticipants: onboardingData.serviceDetails.maxParticipants.toString()
        }
      ]
    }
  };
};
