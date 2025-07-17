
import { configureStore } from '@reduxjs/toolkit';
import serviceReducer from './slices/serviceSlice';
import onboardingReducer from './slices/onboardingSlice';
import rbacReducer from './slices/rbacSlice';
import smartTemplatesReducer from './slices/smartTemplatesSlice';
import loyaltyReducer from './slices/loyaltySlice';
import referralReducer from './slices/referralSlice';
import subscriptionReducer from './slices/subscriptionSlice';
import subscriptionManagerReducer from './slices/subscriptionManagerSlice';
import serviceCreationReducer from './slices/serviceCreationSlice';
import smartServiceReducer from './slices/smartServiceSlice';
import workflowReducer from './slices/workflowSlice';
import navigationReducer from './slices/navigationSlice';
import dashboardReducer from './slices/dashboardSlice';
import platformAdminReducer from './slices/platformAdminSlice';
import reportsReducer from './slices/reportsSlice';

export const store = configureStore({
  reducer: {
    service: serviceReducer,
    onboarding: onboardingReducer,
    rbac: rbacReducer,
    smartTemplates: smartTemplatesReducer,
    loyalty: loyaltyReducer,
    referral: referralReducer,
    subscription: subscriptionReducer,
    subscriptionManager: subscriptionManagerReducer,
    serviceCreation: serviceCreationReducer,
    smartService: smartServiceReducer,
    workflow: workflowReducer,
    navigation: navigationReducer,
    dashboard: dashboardReducer,
    platformAdmin: platformAdminReducer,
    reports: reportsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
