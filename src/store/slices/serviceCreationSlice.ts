import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ServiceCreationState {
  currentStep: number;
  creationStep: number;
  currentService: any;
  availabilityData: any;
  bookingLink: string;
  embedCode: string;
  formData: any;
  isPublishing: boolean;
  publishedService: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: ServiceCreationState = {
  currentStep: 1,
  creationStep: 1,
  currentService: null,
  availabilityData: null,
  bookingLink: '',
  embedCode: '',
  formData: {},
  isPublishing: false,
  publishedService: null,
  loading: false,
  error: null,
};

const serviceCreationSlice = createSlice({
  name: 'serviceCreation',
  initialState,
  reducers: {
    setCreationStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    setCurrentService: (state, action: PayloadAction<any>) => {
      state.currentService = action.payload;
    },
    setAvailabilityData: (state, action: PayloadAction<any>) => {
      state.availabilityData = action.payload;
    },
    setBookingLink: (state, action: PayloadAction<string>) => {
      state.bookingLink = action.payload;
    },
    setEmbedCode: (state, action: PayloadAction<string>) => {
      state.embedCode = action.payload;
    },
    updateServiceConfig: (state, action: PayloadAction<any>) => {
      state.currentService = { ...state.currentService, ...action.payload };
    },
    setFormData: (state, action: PayloadAction<any>) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    setIsPublishing: (state, action: PayloadAction<boolean>) => {
      state.isPublishing = action.payload;
    },
    setPublishedService: (state, action: PayloadAction<any | null>) => {
      state.publishedService = action.payload;
    },
    resetServiceCreation: (state) => {
      state.currentStep = 1;
      state.formData = {};
      state.isPublishing = false;
      state.publishedService = null;
      state.error = null;
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
  setCreationStep, 
  setCurrentService,
  setAvailabilityData,
  setBookingLink,
  setEmbedCode,
  updateServiceConfig,
  setFormData, 
  setIsPublishing, 
  setPublishedService, 
  resetServiceCreation, 
  setLoading, 
  setError 
} = serviceCreationSlice.actions;

// Async thunk function
export const createAndPublishService = (serviceData: any) => (dispatch: any) => {
  dispatch(setIsPublishing(true));
  // Mock implementation
  setTimeout(() => {
    dispatch(setPublishedService(serviceData));
    dispatch(setIsPublishing(false));
  }, 2000);
};

export default serviceCreationSlice.reducer;