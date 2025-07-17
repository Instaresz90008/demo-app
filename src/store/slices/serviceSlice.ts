import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ServiceState {
  services: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ServiceState = {
  services: [],
  loading: false,
  error: null,
};

const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {
    setServices: (state, action: PayloadAction<any[]>) => {
      state.services = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setServices, setLoading, setError } = serviceSlice.actions;
export default serviceSlice.reducer;