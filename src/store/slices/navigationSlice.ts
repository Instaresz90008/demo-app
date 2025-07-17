import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NavigationState {
  activeRoute: string;
  currentRoute: string;
  navigationHistory: string[];
  lastVisited: Record<string, string>;
  breadcrumbs: { label: string; path: string }[];
  sidebarCollapsed: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: NavigationState = {
  activeRoute: '/',
  currentRoute: '/',
  navigationHistory: [],
  lastVisited: {},
  breadcrumbs: [],
  sidebarCollapsed: false,
  loading: false,
  error: null,
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setActiveRoute: (state, action: PayloadAction<string>) => {
      state.activeRoute = action.payload;
      state.navigationHistory.push(action.payload);
    },
    setCurrentRoute: (state, action: PayloadAction<string>) => {
      state.currentRoute = action.payload;
    },
    setBreadcrumbs: (state, action: PayloadAction<{ label: string; path: string }[]>) => {
      state.breadcrumbs = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
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
  setActiveRoute,
  setCurrentRoute,
  setBreadcrumbs,
  toggleSidebar,
  setSidebarCollapsed,
  setLoading,
  setError,
} = navigationSlice.actions;

export default navigationSlice.reducer;