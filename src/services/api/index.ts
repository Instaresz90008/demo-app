
// Export type definitions
export * from './types';

// Export API utilities
export * from './utils';

// Import and export all API services in a cleaner way
import authApi from './authApi';
import voiceApi from './voiceApi';
import slotApi from './slotApi';
import serviceApi from './serviceApi';
import bookingApi from './bookingApi';
import { notificationsApi } from './notificationsApi';
import billingApi from './billingApi';
import teamApi from './teamApi';
import policiesApi from './policiesApi';
import securityApi from './securityApi';
import paymentApi from './paymentApi';
import serviceTemplateApi from './serviceTemplateApi';

// Export individual APIs
export { 
  authApi, 
  voiceApi, 
  slotApi, 
  serviceApi, 
  bookingApi,
  notificationsApi,
  billingApi,
  teamApi,
  policiesApi,
  securityApi,
  paymentApi,
  serviceTemplateApi
};

// Export a default API object
export default {
  auth: authApi,
  voice: voiceApi,
  slot: slotApi,
  service: serviceApi,
  booking: bookingApi,
  notifications: notificationsApi,
  billing: billingApi,
  team: teamApi,
  policies: policiesApi,
  security: securityApi,
  payment: paymentApi,
  serviceTemplate: serviceTemplateApi
};
