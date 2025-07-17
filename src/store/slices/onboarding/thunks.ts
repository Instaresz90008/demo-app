
import { createAsyncThunk } from '@reduxjs/toolkit';
import { OnboardingData } from './types';

export const completeOnboarding = createAsyncThunk(
  'onboarding/complete',
  async (data: OnboardingData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Store completion in localStorage for demo
    localStorage.setItem('onboarding_completed', 'true');
    
    return data;
  }
);

export const createServiceFromOnboarding = createAsyncThunk(
  'onboarding/createService',
  async (data: OnboardingData) => {
    // Simulate API call to create service
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newService = {
      id: Date.now().toString(),
      name: data.serviceDetails.name,
      description: data.serviceDetails.description,
      duration: data.serviceDetails.duration,
      price: data.serviceDetails.price,
      maxParticipants: data.serviceDetails.maxParticipants,
      category: data.serviceDetails.category,
      bookingType: data.bookingType,
      pricingModel: data.pricingModel,
      eventType: data.eventType,
      createdAt: new Date().toISOString(),
    };
    
    // Store in localStorage for demo
    const existingServices = JSON.parse(localStorage.getItem('demo_services') || '[]');
    existingServices.push(newService);
    localStorage.setItem('demo_services', JSON.stringify(existingServices));
    
    return newService;
  }
);

export const saveOnboardingProgress = createAsyncThunk(
  'onboarding/saveProgress',
  async ({ step, data }: { step: number; data: Partial<OnboardingData> }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Store progress in localStorage for demo
    localStorage.setItem('onboarding_progress', JSON.stringify({ step, data }));
    
    return { step, data };
  }
);
