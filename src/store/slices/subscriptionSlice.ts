import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SubscriptionState {
  currentPlan: string;
  status: string;
  features: string[];
  billingCycle: string;
  nextBilling: string;
  plans: any[];
  subscribers: any[];
  analytics: any;
  isLoading: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: SubscriptionState = {
  currentPlan: 'freemium',
  status: 'active',
  features: [],
  billingCycle: 'monthly',
  nextBilling: '',
  plans: [],
  subscribers: [],
  analytics: {},
  isLoading: false,
  loading: false,
  error: null,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setCurrentPlan: (state, action: PayloadAction<string>) => {
      state.currentPlan = action.payload;
    },
    setStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload;
    },
    setFeatures: (state, action: PayloadAction<string[]>) => {
      state.features = action.payload;
    },
    setBillingCycle: (state, action: PayloadAction<string>) => {
      state.billingCycle = action.payload;
    },
    setPlans: (state, action: PayloadAction<any[]>) => {
      state.plans = action.payload;
    },
    setSubscribers: (state, action: PayloadAction<any[]>) => {
      state.subscribers = action.payload;
    },
    setAnalytics: (state, action: PayloadAction<any>) => {
      state.analytics = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    addSubscriber: (state, action: PayloadAction<any>) => {
      state.subscribers.push(action.payload);
    },
    addSubscriptionPlan: (state, action: PayloadAction<any>) => {
      state.plans.push(action.payload);
    },
    updateSubscriber: (state, action: PayloadAction<{ id: string; data: any }>) => {
      const index = state.subscribers.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.subscribers[index] = { ...state.subscribers[index], ...action.payload.data };
      }
    },
    calculateMRR: (state) => {
      const monthlyRevenue = state.subscribers.reduce((sum, sub) => {
        return sum + (sub.monthlyAmount || 0);
      }, 0);
      state.analytics = { ...state.analytics, mrr: monthlyRevenue };
    },
    pauseSubscription: (state, action: PayloadAction<string>) => {
      const subscriber = state.subscribers.find(s => s.id === action.payload);
      if (subscriber) {
        subscriber.status = 'paused';
      }
    },
    cancelSubscription: (state, action: PayloadAction<string>) => {
      const subscriber = state.subscribers.find(s => s.id === action.payload);
      if (subscriber) {
        subscriber.status = 'cancelled';
      }
    },
    recordSessionUsage: (state, action: PayloadAction<{ subscriberId: string; sessions: number }>) => {
      const subscriber = state.subscribers.find(s => s.id === action.payload.subscriberId);
      if (subscriber) {
        subscriber.usedSessions = (subscriber.usedSessions || 0) + action.payload.sessions;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { 
  setCurrentPlan, 
  setStatus, 
  setFeatures, 
  setBillingCycle, 
  setPlans,
  setSubscribers,
  setAnalytics,
  setIsLoading,
  addSubscriber,
  addSubscriptionPlan,
  updateSubscriber,
  calculateMRR,
  pauseSubscription,
  cancelSubscription,
  recordSessionUsage,
  setLoading, 
  setError 
} = subscriptionSlice.actions;
export default subscriptionSlice.reducer;