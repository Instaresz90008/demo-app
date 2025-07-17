// Meeting type configuration interface
export interface MeetingTypeConfig {
  id: string;
  enabled: boolean;
  price: string;
  meetingLink: string;
  location: string;
  phoneNumber: string;
  maxParticipants: string;
  parkingAvailable: boolean;
  meetingPasscode: string;
  bridgeNumber: string;
  refreshments: string;
}

// Service question configuration
export interface ServiceQuestion {
  id: string;
  text: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox';
  required: boolean;
  options?: string[]; // For select/checkbox types
  placeholder?: string;
}