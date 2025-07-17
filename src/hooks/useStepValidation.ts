
import { useMemo } from 'react';

interface BookingData {
  customerName: string;
  customerEmail: string;
  discussionTopics: string;
  selectedDate: string | null;
  selectedTime: string | null;
}

export const useStepValidation = (bookingData: BookingData, currentStep: number) => {
  const validateStep = useMemo(() => {
    const validators = {
      1: () => {
        return !!(bookingData.selectedDate && bookingData.selectedTime);
      },
      2: () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !!(
          bookingData.customerName.trim().length >= 2 &&
          emailRegex.test(bookingData.customerEmail) &&
          bookingData.discussionTopics.trim().length >= 10
        );
      },
      3: () => {
        // All validations for final step
        return validators[1]() && validators[2]();
      }
    };

    return validators[currentStep as keyof typeof validators] || (() => true);
  }, [bookingData, currentStep]);

  const validateCurrentStep = () => validateStep();
  
  const getStepErrors = () => {
    const errors: string[] = [];
    
    if (currentStep >= 1 && !bookingData.selectedDate) {
      errors.push('Please select a date');
    }
    if (currentStep >= 1 && !bookingData.selectedTime) {
      errors.push('Please select a time');
    }
    if (currentStep >= 2 && bookingData.customerName.trim().length < 2) {
      errors.push('Name must be at least 2 characters');
    }
    if (currentStep >= 2 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingData.customerEmail)) {
      errors.push('Please enter a valid email address');
    }
    if (currentStep >= 2 && bookingData.discussionTopics.trim().length < 10) {
      errors.push('Please provide at least 10 characters for discussion topics');
    }

    return errors;
  };

  return {
    validateCurrentStep,
    getStepErrors,
    isStepValid: validateCurrentStep()
  };
};
