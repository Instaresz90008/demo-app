
import { useState, useCallback } from 'react';

export const useStepNavigation = (initialStep: number = 1, totalSteps: number = 4) => {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const goToNextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, totalSteps]);

  const goToPreviousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  }, [totalSteps]);

  const resetSteps = useCallback(() => {
    setCurrentStep(initialStep);
  }, [initialStep]);

  return {
    currentStep,
    totalSteps,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    resetSteps,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === totalSteps,
  };
};
