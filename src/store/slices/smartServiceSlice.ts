
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BookingType {
  id: string;
  key: string;
  name: string;
  description: string;
  icon: string;
}

interface ServiceTemplate {
  id: string;
  title: string;
  description: string;
  default_config: any;
  tags: string[];
  booking_type_name: string;
  booking_type_icon: string;
  popularity_score: number;
}

interface CreatedService {
  id: string;
  title: string;
  description: string;
  bookingType: string;
  createdAt: string;
}

interface SmartServiceState {
  currentStep: 'booking-types' | 'templates' | 'form' | 'success';
  selectedBookingType: BookingType | null;
  selectedTemplate: ServiceTemplate | null;
  bookingTypes: BookingType[];
  templates: ServiceTemplate[];
  createdServices: CreatedService[];
  loading: boolean;
  error: string | null;
}

const initialState: SmartServiceState = {
  currentStep: 'booking-types',
  selectedBookingType: null,
  selectedTemplate: null,
  bookingTypes: [],
  templates: [],
  createdServices: [],
  loading: false,
  error: null,
};

const smartServiceSlice = createSlice({
  name: 'smartService',
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<SmartServiceState['currentStep']>) => {
      state.currentStep = action.payload;
    },
    
    setSelectedBookingType: (state, action: PayloadAction<BookingType | null>) => {
      state.selectedBookingType = action.payload;
    },
    
    setSelectedTemplate: (state, action: PayloadAction<ServiceTemplate | null>) => {
      state.selectedTemplate = action.payload;
    },
    
    setBookingTypes: (state, action: PayloadAction<BookingType[]>) => {
      state.bookingTypes = action.payload;
    },
    
    setTemplates: (state, action: PayloadAction<ServiceTemplate[]>) => {
      state.templates = action.payload;
    },
    
    addCreatedService: (state, action: PayloadAction<CreatedService>) => {
      state.createdServices.push(action.payload);
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    resetSmartService: (state) => {
      state.currentStep = 'booking-types';
      state.selectedBookingType = null;
      state.selectedTemplate = null;
      state.error = null;
    },
  },
});

export const {
  setCurrentStep,
  setSelectedBookingType,
  setSelectedTemplate,
  setBookingTypes,
  setTemplates,
  addCreatedService,
  setLoading,
  setError,
  resetSmartService,
} = smartServiceSlice.actions;

export default smartServiceSlice.reducer;
