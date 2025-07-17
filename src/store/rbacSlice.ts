import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Role {
  id: string;
  name: string;
  permissions: string[];
  description: string;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string;
}

interface RBACState {
  roles: Role[];
  permissions: Permission[];
  userRoles: Record<string, string[]>; // userId -> roleIds
  isLoading: boolean;
  error: string | null;
}

const initialState: RBACState = {
  roles: [
    {
      id: 'end_user',
      name: 'End User',
      permissions: ['calendar:read', 'calendar:write', 'booking:create', 'profile:edit'],
      description: 'Basic user with limited access'
    },
    {
      id: 'team_admin',
      name: 'Team Admin',
      permissions: ['calendar:read', 'calendar:write', 'booking:create', 'booking:manage', 'team:manage', 'reports:read'],
      description: 'Can manage team members and advanced features'
    },
    {
      id: 'org_admin',
      name: 'Organization Admin',
      permissions: ['calendar:read', 'calendar:write', 'booking:create', 'booking:manage', 'team:manage', 'org:manage', 'reports:read', 'analytics:read'],
      description: 'Full organizational control'
    },
    {
      id: 'platform_admin',
      name: 'Platform Admin',
      permissions: ['*'], // All permissions
      description: 'Full platform access'
    }
  ],
  permissions: [
    { id: 'calendar:read', name: 'Read Calendar', resource: 'calendar', action: 'read', description: 'View calendar events' },
    { id: 'calendar:write', name: 'Write Calendar', resource: 'calendar', action: 'write', description: 'Create/edit calendar events' },
    { id: 'booking:create', name: 'Create Booking', resource: 'booking', action: 'create', description: 'Create new bookings' },
    { id: 'booking:manage', name: 'Manage Bookings', resource: 'booking', action: 'manage', description: 'Manage all bookings' },
    { id: 'team:manage', name: 'Manage Team', resource: 'team', action: 'manage', description: 'Manage team members' },
    { id: 'org:manage', name: 'Manage Organization', resource: 'organization', action: 'manage', description: 'Manage organization settings' },
    { id: 'reports:read', name: 'Read Reports', resource: 'reports', action: 'read', description: 'View reports and analytics' },
    { id: 'analytics:read', name: 'Read Analytics', resource: 'analytics', action: 'read', description: 'View advanced analytics' },
    { id: 'profile:edit', name: 'Edit Profile', resource: 'profile', action: 'edit', description: 'Edit user profile' }
  ],
  userRoles: {},
  isLoading: false,
  error: null
};

const rbacSlice = createSlice({
  name: 'rbac',
  initialState,
  reducers: {
    setUserRoles: (state, action: PayloadAction<{ userId: string; roleIds: string[] }>) => {
      state.userRoles[action.payload.userId] = action.payload.roleIds;
    },
    addRole: (state, action: PayloadAction<Role>) => {
      state.roles.push(action.payload);
    },
    updateRole: (state, action: PayloadAction<Role>) => {
      const index = state.roles.findIndex(role => role.id === action.payload.id);
      if (index !== -1) {
        state.roles[index] = action.payload;
      }
    },
    removeRole: (state, action: PayloadAction<string>) => {
      state.roles = state.roles.filter(role => role.id !== action.payload);
    },
    addPermission: (state, action: PayloadAction<Permission>) => {
      state.permissions.push(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const {
  setUserRoles,
  addRole,
  updateRole,
  removeRole,
  addPermission,
  setLoading,
  setError
} = rbacSlice.actions;

export default rbacSlice.reducer;