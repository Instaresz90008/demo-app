import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OnboardingData, OnboardingState } from './onboarding/types';
import { initialState } from './onboarding/initialState';
import { completeOnboarding, createServiceFromOnboarding, saveOnboardingProgress } from './onboarding/thunks';

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.data.currentStep = action.payload;
    },
    setUserType: (state, action: PayloadAction<'solo' | 'team' | 'business'>) => {
      state.data.userType = action.payload;
    },
    updateBusinessCompliance: (state, action: PayloadAction<any>) => {
      state.data.businessCompliance = {
        ...action.payload,
        complianceStatus: 'pending'
      };
    },
    setBookingType: (state, action: PayloadAction<'one-to-one' | 'group' | 'webinar'>) => {
      state.data.bookingType = action.payload;
      // Auto-suggest pricing model based on booking type
      if (action.payload === 'one-to-one') {
        state.data.pricingModel = 'per-session';
      } else if (action.payload === 'group') {
        state.data.pricingModel = 'per-person';
      } else if (action.payload === 'webinar') {
        state.data.pricingModel = 'per-person';
      }
    },
    setPricingModel: (state, action: PayloadAction<'per-person' | 'per-session' | 'donation'>) => {
      state.data.pricingModel = action.payload;
    },
    setEventType: (state, action: PayloadAction<'one-time' | 'package' | 'subscription'>) => {
      state.data.eventType = action.payload;
    },
    updateServiceDetails: (state, action: PayloadAction<Partial<OnboardingData['serviceDetails']>>) => {
      state.data.serviceDetails = { ...state.data.serviceDetails, ...action.payload };
    },
    selectTemplate: (state, action: PayloadAction<string>) => {
      const template = state.templates.find(t => t.id === action.payload);
      if (template) {
        state.data.templateId = action.payload;
        state.data.bookingType = template.bookingType;
        // Pre-populate service details from template
        state.data.serviceDetails = {
          ...state.data.serviceDetails,
          name: template.name,
          description: template.description || state.data.serviceDetails.description,
          duration: template.duration,
          price: template.suggestedPrice,
          maxParticipants: template.maxParticipants,
          category: template.category,
        };
        // Store the complete template data for later use
        state.data.selectedTemplate = {
          id: template.id,
          name: template.name,
          description: template.description,
          category: template.category,
          duration: template.duration,
          suggestedPrice: template.suggestedPrice,
          maxParticipants: template.maxParticipants,
          bookingType: template.bookingType,
          features: template.features || []
        };
      }
    },
    setShowOnboarding: (state, action: PayloadAction<boolean>) => {
      state.showOnboarding = action.payload;
    },
    setCreatedServiceId: (state, action: PayloadAction<string>) => {
      state.data.createdServiceId = action.payload;
    },
    resetOnboarding: (state) => {
      state.data = initialState.data;
      state.error = null;
      state.loading = false;
      // Keep showOnboarding true for new user flows
      state.showOnboarding = true;
    },
    nextStep: (state) => {
      const currentStep = state.data.currentStep;
      const userType = state.data.userType;

      // Step navigation logic based on user type
      if (currentStep === 1) {
        // From User Intent step
        if (userType === 'business') {
          // Business: User Intent → Business Compliance
          state.data.currentStep = 2;
        } else if (userType === 'team' || userType === 'solo') {
          // Team/Solo: User Intent → Guided Discovery
          state.data.currentStep = 3;
        }
      } else if (currentStep === 2 && userType === 'business') {
        // Business: Business Compliance → Guided Discovery
        state.data.currentStep = 3;
      } else if (currentStep === 3) {
        // From Guided Discovery → Template Recommendation
        state.data.currentStep = 4;
      } else if (currentStep < 10) {
        // Continue normal flow (now 10 steps total)
        state.data.currentStep += 1;
      }
    },
    previousStep: (state) => {
      const currentStep = state.data.currentStep;
      const userType = state.data.userType;

      if (currentStep === 3) {
        // From Guided Discovery
        if (userType === 'business') {
          // Business: Guided Discovery → Business Compliance
          state.data.currentStep = 2;
        } else {
          // Team/Solo: Guided Discovery → User Intent
          state.data.currentStep = 1;
        }
      } else if (currentStep === 2 && userType === 'business') {
        // Business: Business Compliance → User Intent
        state.data.currentStep = 1;
      } else if (currentStep > 1) {
        state.data.currentStep -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(completeOnboarding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeOnboarding.fulfilled, (state, action) => {
        state.loading = false;
        state.data = { ...action.payload, isCompleted: true };
        state.showOnboarding = false;
      })
      .addCase(completeOnboarding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to complete onboarding';
      })
      .addCase(createServiceFromOnboarding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createServiceFromOnboarding.fulfilled, (state, action) => {
        state.loading = false;
        state.data.createdServiceId = action.payload.id;
      })
      .addCase(createServiceFromOnboarding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create service';
      })
      .addCase(saveOnboardingProgress.fulfilled, (state, action) => {
        state.data.currentStep = action.payload.step;
        state.data = { ...state.data, ...action.payload.data };
      });
  },
});

export const {
  setCurrentStep,
  setUserType,
  updateBusinessCompliance,
  setBookingType,
  setPricingModel,
  setEventType,
  updateServiceDetails,
  selectTemplate,
  setShowOnboarding,
  setCreatedServiceId,
  resetOnboarding,
  nextStep,
  previousStep,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;

// Re-export types and thunks for convenience
export type { OnboardingData, OnboardingState, ServiceTemplate } from './onboarding/types';
export { completeOnboarding, createServiceFromOnboarding, saveOnboardingProgress } from './onboarding/thunks';
