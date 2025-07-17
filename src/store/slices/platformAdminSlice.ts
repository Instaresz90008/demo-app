import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PlatformAdminState {
  users: any[];
  organizations: any[];
  stats: any;
  systemStats: {
    totalUsers: number;
    totalOrganizations: number;
    systemHealth: string;
    activeConnections: number;
  };
  auditLogs: any[];
  securityAlerts: any[];
  loading: boolean;
  error: string | null;
}

const initialState: PlatformAdminState = {
  users: [],
  organizations: [],
  stats: {},
  systemStats: {
    totalUsers: 0,
    totalOrganizations: 0,
    systemHealth: 'healthy',
    activeConnections: 0,
  },
  auditLogs: [],
  securityAlerts: [],
  loading: false,
  error: null,
};

const platformAdminSlice = createSlice({
  name: 'platformAdmin',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<any[]>) => {
      state.users = action.payload;
    },
    setOrganizations: (state, action: PayloadAction<any[]>) => {
      state.organizations = action.payload;
    },
    setStats: (state, action: PayloadAction<any>) => {
      state.stats = action.payload;
    },
    setSystemStats: (state, action: PayloadAction<Partial<PlatformAdminState['systemStats']>>) => {
      state.systemStats = { ...state.systemStats, ...action.payload };
    },
    setAuditLogs: (state, action: PayloadAction<any[]>) => {
      state.auditLogs = action.payload;
    },
    setSecurityAlerts: (state, action: PayloadAction<any[]>) => {
      state.securityAlerts = action.payload;
    },
    addUser: (state, action: PayloadAction<any>) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<{ id: string; data: any }>) => {
      const index = state.users.findIndex(u => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...action.payload.data };
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter(u => u.id !== action.payload);
    },
    updateOrganization: (state, action: PayloadAction<{ id: string; data: any }>) => {
      const index = state.organizations.findIndex(o => o.id === action.payload.id);
      if (index !== -1) {
        state.organizations[index] = { ...state.organizations[index], ...action.payload.data };
      }
    },
    deleteOrganization: (state, action: PayloadAction<string>) => {
      state.organizations = state.organizations.filter(o => o.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    fetchStats: (state) => {
      state.loading = true;
    },
    fetchOrganizations: (state) => {
      state.loading = true;
    },
    createOrganization: (state, action: PayloadAction<any>) => {
      state.organizations.push(action.payload);
    },
    clearErrors: (state) => {
      state.error = null;
    },
    fetchUsers: (state) => {
      state.loading = true;
    },
    createUser: (state, action: PayloadAction<any>) => {
      state.users.push(action.payload);
    },
  },
});

export const {
  setUsers,
  setOrganizations,
  setStats,
  setSystemStats,
  setAuditLogs,
  setSecurityAlerts,
  addUser,
  updateUser,
  deleteUser,
  updateOrganization,
  deleteOrganization,
  setLoading,
  setError,
  fetchStats,
  fetchOrganizations,
  createOrganization,
  fetchUsers,
  createUser,
  clearErrors,
} = platformAdminSlice.actions;

export default platformAdminSlice.reducer;