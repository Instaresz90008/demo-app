
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Role {
  id: string;
  name: string;
  permissions: string[];
}

interface Permission {
  id: string;
  name: string;
  description: string;
}

interface RBACState {
  roles: Role[];
  permissions: Permission[];
  userRoles: string[];
}

const initialState: RBACState = {
  roles: [],
  permissions: [],
  userRoles: [],
};

const rbacSlice = createSlice({
  name: 'rbac',
  initialState,
  reducers: {
    setRoles: (state, action: PayloadAction<Role[]>) => {
      state.roles = action.payload;
    },
    setPermissions: (state, action: PayloadAction<Permission[]>) => {
      state.permissions = action.payload;
    },
    setUserRoles: (state, action: PayloadAction<string[]>) => {
      state.userRoles = action.payload;
    },
  },
});

export const { setRoles, setPermissions, setUserRoles } = rbacSlice.actions;
export default rbacSlice.reducer;
