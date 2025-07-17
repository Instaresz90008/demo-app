
import React, { createContext, useContext, ReactNode } from 'react';
import { useAccessControl } from './AccessControlContext';

interface FeatureContextValue {
  isFeatureEnabled: (featureKey: string) => boolean;
  canAccess: (featureKey: string) => boolean;
}

const FeatureContext = createContext<FeatureContextValue | undefined>(undefined);

export const useFeatureContext = () => {
  const context = useContext(FeatureContext);
  if (context === undefined) {
    throw new Error('useFeatureContext must be used within a FeatureProvider');
  }
  return context;
};

interface FeatureProviderProps {
  children: ReactNode;
}

export const FeatureProvider: React.FC<FeatureProviderProps> = ({ children }) => {
  const { isFeatureEnabled } = useAccessControl();

  const canAccess = (featureKey: string): boolean => {
    return isFeatureEnabled(featureKey);
  };

  const value: FeatureContextValue = {
    isFeatureEnabled,
    canAccess
  };

  return (
    <FeatureContext.Provider value={value}>
      {children}
    </FeatureContext.Provider>
  );
};
