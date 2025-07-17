import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ReferralState {
  referrals: any[];
  totalEarnings: number;
  referralCode: string;
  codes: any[];
  referredClients: any[];
  analytics: any;
  leaderboard: any[];
  isLoading: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: ReferralState = {
  referrals: [],
  totalEarnings: 0,
  referralCode: '',
  codes: [],
  referredClients: [],
  analytics: {},
  leaderboard: [],
  isLoading: false,
  loading: false,
  error: null,
};

const referralSlice = createSlice({
  name: 'referral',
  initialState,
  reducers: {
    setReferrals: (state, action: PayloadAction<any[]>) => {
      state.referrals = action.payload;
    },
    setTotalEarnings: (state, action: PayloadAction<number>) => {
      state.totalEarnings = action.payload;
    },
    setReferralCode: (state, action: PayloadAction<string>) => {
      state.referralCode = action.payload;
    },
    setCodes: (state, action: PayloadAction<any[]>) => {
      state.codes = action.payload;
    },
    setReferredClients: (state, action: PayloadAction<any[]>) => {
      state.referredClients = action.payload;
    },
    setAnalytics: (state, action: PayloadAction<any>) => {
      state.analytics = action.payload;
    },
    setLeaderboard: (state, action: PayloadAction<any[]>) => {
      state.leaderboard = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    generateReferralCode: (state, action: PayloadAction<any>) => {
      const code = typeof action.payload === 'string' ? action.payload : `REF${Date.now()}`;
      state.referralCode = code;
      state.codes.push({ code, createdAt: new Date().toISOString() });
    },
    addReferredClient: (state, action: PayloadAction<any>) => {
      state.referredClients.push(action.payload);
    },
    updateReferralStatus: (state, action: PayloadAction<{ clientId: string; status: string; rewardEarned?: number }>) => {
      const client = state.referredClients.find(c => c.id === action.payload.clientId);
      if (client) {
        client.status = action.payload.status;
        if (action.payload.rewardEarned) {
          client.rewardEarned = action.payload.rewardEarned;
          state.totalEarnings += action.payload.rewardEarned;
        }
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
  setReferrals, 
  setTotalEarnings, 
  setReferralCode, 
  setCodes,
  setReferredClients,
  setAnalytics,
  setLeaderboard,
  setIsLoading,
  generateReferralCode,
  addReferredClient,
  updateReferralStatus,
  setLoading, 
  setError 
} = referralSlice.actions;
export default referralSlice.reducer;