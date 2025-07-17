
import { OnboardingState, ServiceTemplate } from './types';

const mockTemplates: ServiceTemplate[] = [
  {
    id: '1',
    name: 'Business Consultation',
    description: 'One-on-one strategic business consultation',
    category: 'consulting',
    industry: 'business',
    bookingType: 'one-to-one',
    duration: 60,
    suggestedPrice: 150,
    maxParticipants: 1,
    tags: ['business', 'strategy', 'consultation'],
    isPopular: true
  },
  {
    id: '2',
    name: 'Team Workshop',
    description: 'Interactive group workshop for teams',
    category: 'workshop',
    industry: 'business',
    bookingType: 'group',
    duration: 120,
    suggestedPrice: 300,
    maxParticipants: 10,
    tags: ['team', 'workshop', 'collaboration'],
    isPopular: true
  },
  {
    id: '3',
    name: 'Webinar Series',
    description: 'Educational webinar for large audiences',
    category: 'education',
    industry: 'education',
    bookingType: 'webinar',
    duration: 90,
    suggestedPrice: 50,
    maxParticipants: 100,
    tags: ['webinar', 'education', 'online']
  },
  {
    id: '4',
    name: 'Quick Chat',
    description: 'Brief 15-minute consultation call',
    category: 'consultation',
    industry: 'general',
    bookingType: 'one-to-one',
    duration: 15,
    suggestedPrice: 25,
    maxParticipants: 1,
    tags: ['quick', 'consultation', 'brief']
  }
];

export const initialState: OnboardingState = {
  data: {
    currentStep: 1,
    userType: 'solo',
    bookingType: 'one-to-one',
    pricingModel: 'per-session',
    eventType: 'one-time',
    serviceDetails: {
      name: '',
      description: '',
      duration: 60,
      price: 0,
      maxParticipants: 1,
      category: '',
      slots: []
    },
    isCompleted: false
  },
  templates: mockTemplates,
  loading: false,
  error: null,
  showOnboarding: false
};
