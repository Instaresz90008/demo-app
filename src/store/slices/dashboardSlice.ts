import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DashboardState {
  kpiData: any;
  pendingRequests: any[];
  stats: {
    totalServices: number;
    activeBookings: number;
    totalRevenue: number;
    growthRate: number;
  };
  recentActivity: any[];
  upcomingEvents: any[];
  notifications: any[];
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  kpiData: null,
  pendingRequests: [],
  stats: {
    totalServices: 0,
    activeBookings: 0,
    totalRevenue: 0,
    growthRate: 0,
  },
  recentActivity: [],
  upcomingEvents: [],
  notifications: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setKpiData: (state, action: PayloadAction<any>) => {
      state.kpiData = action.payload;
    },
    setPendingRequests: (state, action: PayloadAction<any[]>) => {
      state.pendingRequests = action.payload;
    },
    fetchDashboardData: (state) => {
      state.loading = true;
    },
    approvePendingRequest: (state, action: PayloadAction<string>) => {
      state.pendingRequests = state.pendingRequests.filter(req => req.id !== action.payload);
    },
    rejectPendingRequest: (state, action: PayloadAction<string>) => {
      state.pendingRequests = state.pendingRequests.filter(req => req.id !== action.payload);
    },
    setStats: (state, action: PayloadAction<Partial<DashboardState['stats']>>) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    setRecentActivity: (state, action: PayloadAction<any[]>) => {
      state.recentActivity = action.payload;
    },
    setUpcomingEvents: (state, action: PayloadAction<any[]>) => {
      state.upcomingEvents = action.payload;
    },
    setNotifications: (state, action: PayloadAction<any[]>) => {
      state.notifications = action.payload;
    },
    addNotification: (state, action: PayloadAction<any>) => {
      state.notifications.unshift(action.payload);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
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
  setKpiData,
  setPendingRequests,
  fetchDashboardData,
  approvePendingRequest,
  rejectPendingRequest,
  setStats,
  setRecentActivity,
  setUpcomingEvents,
  setNotifications,
  addNotification,
  removeNotification,
  setLoading,
  setError,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;