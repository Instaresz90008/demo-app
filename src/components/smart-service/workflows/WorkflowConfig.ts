
import { BookingType, PricingModel } from '@/types/smartService';

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  component: string;
  fields: string[];
  validations?: Record<string, any>;
  microcopy?: string;
}

export interface WorkflowConfig {
  id: string;
  bookingTypeId: string;
  pricingModelId: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  availabilityMode: 'slot-selection' | 'recurring-calendar' | 'auto-scheduling' | 'collective-sync' | 'custom-mapping';
  specialFeatures: string[];
}

// Comprehensive workflows for all combinations
export const WORKFLOW_CONFIGS: WorkflowConfig[] = [
  // 1-One + Fixed Price
  {
    id: '1-one-fixed',
    bookingTypeId: '1',
    pricingModelId: 'fixed',
    name: '1-on-1 Fixed Price Session',
    description: 'Perfect for consultations, coaching sessions, or expert advice',
    availabilityMode: 'slot-selection',
    specialFeatures: ['buffer-time', 'preparation-notes', 'follow-up-templates'],
    steps: [
      {
        id: 'service-setup',
        title: 'Session Details',
        description: 'Define your 1-on-1 service offering',
        component: 'ServiceConfigForm',
        fields: ['title', 'description', 'duration', 'price', 'preparation_required'],
        microcopy: 'What expertise are you offering in this private session?'
      },
      {
        id: 'availability',
        title: 'Available Times',
        description: 'When can clients book with you?',
        component: 'SlotAvailabilityPicker',
        fields: ['time_slots', 'buffer_time', 'advance_booking'],
        microcopy: 'Set your preferred meeting times and buffer between sessions'
      }
    ]
  },

  // 1-One + Time-Based
  {
    id: '1-one-time-based',
    bookingTypeId: '1',
    pricingModelId: 'time-based',
    name: '1-on-1 Hourly Rate Session',
    description: 'Flexible duration sessions with hourly pricing',
    availabilityMode: 'slot-selection',
    specialFeatures: ['flexible-duration', 'time-tracking'],
    steps: [
      {
        id: 'service-setup',
        title: 'Session Configuration',
        description: 'Set up your hourly rate service',
        component: 'ServiceConfigForm',
        fields: ['title', 'description', 'hourlyRate', 'minimumDuration'],
        microcopy: 'How much do you charge per hour for your expertise?'
      },
      {
        id: 'availability',
        title: 'Time Blocks',
        description: 'Set your available time blocks',
        component: 'SlotAvailabilityPicker',
        fields: ['time_blocks', 'duration_options'],
        microcopy: 'Clients can book flexible durations within your available blocks'
      }
    ]
  },

  // 1-Many + Per Participant
  {
    id: '1-many-per-participant',
    bookingTypeId: '2',
    pricingModelId: 'per-participant',
    name: 'Webinar/Workshop Per Person',
    description: 'Scale your expertise to multiple participants',
    availabilityMode: 'slot-selection',
    specialFeatures: ['participant-management', 'recording', 'materials-sharing'],
    steps: [
      {
        id: 'event-setup',
        title: 'Event Configuration',
        description: 'Set up your broadcast session',
        component: 'ServiceConfigForm',
        fields: ['title', 'description', 'duration', 'max_participants', 'price_per_person'],
        microcopy: 'How many people can benefit from your expertise at once?'
      },
      {
        id: 'scheduling',
        title: 'Event Schedule',
        description: 'When will you host this session?',
        component: 'SlotAvailabilityPicker',
        fields: ['event_dates', 'registration_deadline'],
        microcopy: 'Give participants enough time to prepare and join'
      }
    ]
  },

  // Group + Hybrid Pricing
  {
    id: 'group-hybrid',
    bookingTypeId: '3',
    pricingModelId: 'hybrid',
    name: 'Interactive Group Session',
    description: 'Collaborative sessions with base fee + per person',
    availabilityMode: 'slot-selection',
    specialFeatures: ['group-dynamics', 'breakout-rooms', 'collaborative-tools'],
    steps: [
      {
        id: 'group-config',
        title: 'Group Settings',
        description: 'Configure your interactive group session',
        component: 'ServiceConfigForm',
        fields: ['title', 'description', 'min_participants', 'max_participants', 'base_price', 'price_per_person'],
        microcopy: 'Balance fixed costs with per-person value'
      },
      {
        id: 'availability',
        title: 'Group Schedule',
        description: 'When will groups meet?',
        component: 'SlotAvailabilityPicker',
        fields: ['group_slots', 'participant_limits'],
        microcopy: 'Set up recurring or one-time group sessions'
      }
    ]
  },

  // Round Robin + Fixed
  {
    id: 'round-robin-fixed',
    bookingTypeId: '4',
    pricingModelId: 'fixed',
    name: 'Team Round Robin Service',
    description: 'Distribute bookings evenly among team members',
    availabilityMode: 'collective-sync',
    specialFeatures: ['load-balancing', 'team-management', 'unified-pricing'],
    steps: [
      {
        id: 'team-setup',
        title: 'Team Configuration',
        description: 'Set up your team and pricing',
        component: 'ServiceConfigForm',
        fields: ['title', 'description', 'price', 'team_members'],
        microcopy: 'All team members provide the same service at the same price'
      },
      {
        id: 'collective-availability',
        title: 'Team Availability',
        description: 'Sync team schedules',
        component: 'CollectiveAvailabilityPicker',
        fields: ['team_schedules', 'rotation_rules'],
        microcopy: 'Bookings will be distributed fairly among available team members'
      }
    ]
  },

  // Add more comprehensive mappings for all other combinations
  {
    id: 'default-workflow',
    bookingTypeId: 'default',
    pricingModelId: 'default',
    name: 'Standard Service Setup',
    description: 'Basic service configuration workflow',
    availabilityMode: 'slot-selection',
    specialFeatures: ['basic-setup'],
    steps: [
      {
        id: 'service-setup',
        title: 'Service Details',
        description: 'Configure your service',
        component: 'ServiceConfigForm',
        fields: ['title', 'description', 'duration', 'pricing'],
        microcopy: 'Set up the basic details for your service'
      },
      {
        id: 'availability',
        title: 'Availability',
        description: 'Set your available times',
        component: 'SlotAvailabilityPicker',
        fields: ['time_slots'],
        microcopy: 'When are you available to provide this service?'
      }
    ]
  }
];

// Add all missing combinations dynamically
const BOOKING_TYPE_IDS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
const PRICING_MODEL_IDS = ['fixed', 'time-based', 'subscription', 'tiered', 'pay-what-you-want', 
  'free-rsvp', 'per-participant', 'tiered-access', 'group-fixed', 'hybrid', 'minimum-payout',
  'bundled-price', 'tiered-package', 'full-program-fee', 'entry-fee', 'free'];

// Generate missing combinations using the default workflow template
BOOKING_TYPE_IDS.forEach(bookingTypeId => {
  PRICING_MODEL_IDS.forEach(pricingModelId => {
    const exists = WORKFLOW_CONFIGS.find(
      config => config.bookingTypeId === bookingTypeId && config.pricingModelId === pricingModelId
    );
    
    if (!exists) {
      WORKFLOW_CONFIGS.push({
        id: `${bookingTypeId}-${pricingModelId}`,
        bookingTypeId,
        pricingModelId,
        name: `Custom ${bookingTypeId} + ${pricingModelId} Service`,
        description: 'Tailored service configuration for your specific needs',
        availabilityMode: 'slot-selection',
        specialFeatures: ['custom-configuration'],
        steps: [
          {
            id: 'service-setup',
            title: 'Service Configuration',
            description: 'Set up your service details',
            component: 'ServiceConfigForm',
            fields: ['title', 'description', 'duration', 'pricing'],
            microcopy: 'Configure your service according to your specific requirements'
          },
          {
            id: 'availability',
            title: 'Availability Setup',
            description: 'Define when you\'re available',
            component: 'SlotAvailabilityPicker',
            fields: ['availability'],
            microcopy: 'Set up your availability schedule'
          }
        ]
      });
    }
  });
});

export const getWorkflowConfig = (bookingTypeId: string, pricingModelId: string): WorkflowConfig => {
  return WORKFLOW_CONFIGS.find(
    config => config.bookingTypeId === bookingTypeId && config.pricingModelId === pricingModelId
  ) || WORKFLOW_CONFIGS.find(config => config.id === 'default-workflow')!;
};
