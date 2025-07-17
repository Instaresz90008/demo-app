
import { useState } from 'react';

export const useStepNavigation = (initialStep: number, totalSteps: number) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setDirection('forward');
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setDirection('backward');
      setCurrentStep(currentStep - 1);
    }
  };

  return {
    currentStep,
    totalSteps,
    direction,
    goToNextStep,
    goToPreviousStep,
    setCurrentStep
  };
};
