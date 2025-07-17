
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setShowOnboarding } from '@/store/slices/onboardingSlice';
import OnboardingWorkflow from './OnboardingWorkflow';

const OnboardingFlow: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showOnboarding, data } = useAppSelector((state) => state.onboarding);

  useEffect(() => {
    // If user accesses /onboarding directly, enable onboarding
    if (!showOnboarding) {
      dispatch(setShowOnboarding(true));
    }
  }, [dispatch, showOnboarding]);

  const handleComplete = () => {
    // Navigate to dashboard after onboarding completion
    navigate('/dashboard');
  };

  // Always show onboarding workflow when on /onboarding route
  return <OnboardingWorkflow onComplete={handleComplete} />;
};

export default OnboardingFlow;
