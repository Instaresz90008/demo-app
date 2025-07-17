import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoyaltyState {
  points: number;
  tier: string;
  rewards: any[];
  tiers: any[];
  clients: any[];
  analytics: any;
  isLoading: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: LoyaltyState = {
  points: 0,
  tier: 'bronze',
  rewards: [],
  tiers: [],
  clients: [],
  analytics: {},
  isLoading: false,
  loading: false,
  error: null,
};

const loyaltySlice = createSlice({
  name: 'loyalty',
  initialState,
  reducers: {
    setPoints: (state, action: PayloadAction<number>) => {
      state.points = action.payload;
    },
    setTier: (state, action: PayloadAction<string>) => {
      state.tier = action.payload;
    },
    setRewards: (state, action: PayloadAction<any[]>) => {
      state.rewards = action.payload;
    },
    setTiers: (state, action: PayloadAction<any[]>) => {
      state.tiers = action.payload;
    },
    setClients: (state, action: PayloadAction<any[]>) => {
      state.clients = action.payload;
    },
    setAnalytics: (state, action: PayloadAction<any>) => {
      state.analytics = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    addLoyaltyClient: (state, action: PayloadAction<any>) => {
      state.clients.push(action.payload);
    },
    updateClientSessions: (state, action: PayloadAction<{ clientId: string; sessions: number }>) => {
      const client = state.clients.find(c => c.id === action.payload.clientId);
      if (client) {
        client.sessions = action.payload.sessions;
      }
    },
    unlockTier: (state, action: PayloadAction<{ clientId: string; tier: string }>) => {
      const client = state.clients.find(c => c.id === action.payload.clientId);
      if (client) {
        client.tier = action.payload.tier;
      }
    },
    calculateAnalytics: (state) => {
      // Mock calculation
      state.analytics = {
        totalClients: state.clients.length,
        averagePoints: state.clients.reduce((sum, c) => sum + (c.points || 0), 0) / state.clients.length || 0
      };
    },
    addLoyaltyTier: (state, action: PayloadAction<any>) => {
      state.tiers.push(action.payload);
    },
    updateLoyaltyTier: (state, action: PayloadAction<{ id: string; data: any }>) => {
      const index = state.tiers.findIndex(tier => tier.id === action.payload.id);
      if (index !== -1) {
        state.tiers[index] = { ...state.tiers[index], ...action.payload.data };
      }
    },
    addLoyaltyReward: (state, action: PayloadAction<any>) => {
      state.rewards.push(action.payload);
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
  setPoints, 
  setTier, 
  setRewards, 
  setTiers,
  setClients,
  setAnalytics,
  setIsLoading,
  addLoyaltyClient,
  updateClientSessions,
  unlockTier,
  calculateAnalytics,
  addLoyaltyTier,
  updateLoyaltyTier,
  addLoyaltyReward,
  setLoading, 
  setError 
} = loyaltySlice.actions;
export default loyaltySlice.reducer;