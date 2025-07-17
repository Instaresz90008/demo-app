
import { useState, useEffect } from 'react';

interface TrialState {
  isActive: boolean;
  daysLeft: number;
  planType: 'freemium' | 'advanced' | 'professional' | 'enterprise';
  hasExpired: boolean;
}

export const useTrialManager = () => {
  const [trialState, setTrialState] = useState<TrialState>({
    isActive: false,
    daysLeft: 0,
    planType: 'freemium',
    hasExpired: false
  });

  // Check trial status
  const checkTrialStatus = () => {
    const trialData = localStorage.getItem('user_trial');
    if (!trialData) return;

    try {
      const trial = JSON.parse(trialData);
      const now = new Date();
      const endDate = new Date(trial.endDate);
      const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      setTrialState({
        isActive: trial.isActive && daysLeft > 0,
        daysLeft: Math.max(0, daysLeft),
        planType: trial.planType || 'advanced',
        hasExpired: daysLeft <= 0 && trial.isActive
      });

      if (daysLeft <= 0 && trial.isActive) {
        handleTrialExpiration();
      }
    } catch (error) {
      console.error('Error checking trial status:', error);
    }
  };

  // Start trial
  const startTrial = (planType: 'advanced' | 'professional' = 'advanced') => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const trialData = {
      isActive: true,
      planType,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };

    localStorage.setItem('user_trial', JSON.stringify(trialData));
    checkTrialStatus();
  };

  // Handle trial expiration
  const handleTrialExpiration = () => {
    const trialData = localStorage.getItem('user_trial');
    if (trialData) {
      const trial = JSON.parse(trialData);
      trial.isActive = false;
      localStorage.setItem('user_trial', JSON.stringify(trial));
      
      // Downgrade user plan
      const userData = localStorage.getItem('current_user');
      if (userData) {
        const user = JSON.parse(userData);
        user.planType = 'freemium';
        localStorage.setItem('current_user', JSON.stringify(user));
      }
    }
  };

  useEffect(() => {
    checkTrialStatus();
    const interval = setInterval(checkTrialStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return {
    trialState,
    startTrial,
    checkTrialStatus
  };
};
