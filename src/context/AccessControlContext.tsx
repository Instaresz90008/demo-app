import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AccessControlContextType {
  isFeatureEnabled: (featureId: string) => boolean;
  trackFeatureUsage: (featureId: string, action: string, metadata?: any) => void;
  getCurrentUserRole: () => string;
  hasRole: (role: string) => boolean;
  getCurrentUser: () => any;
  loading: boolean;
  getCurrentPlan: () => any;
  getAccessSnapshot: () => any;
  subscribeToAccessChanges: (callback: Function) => () => void;
  preloadFeatures: (features: string[]) => Promise<void>;
  refreshAccess: () => Promise<void>;
  checkFeatureAccess: (feature: string) => Promise<{ allowed: boolean }>;
  getFeatureUIStatus: (feature: string | string[]) => any;
}

const AccessControlContext = createContext<AccessControlContextType | null>(null);

interface AccessControlProviderProps {
  children: ReactNode;
}

export const AccessControlProvider: React.FC<AccessControlProviderProps> = ({ children }) => {
  const { user } = useAuth();

  const hasRole = (role: string): boolean => {
    return user?.roles?.includes(role) || false;
  };

  const getCurrentUser = () => user;

  const isFeatureEnabled = (featureId: string): boolean => {
    return true; // Simple feature access - all features enabled for demo
  };

  const trackFeatureUsage = (featureId: string, action: string, metadata?: any) => {
    console.log('Feature usage:', { featureId, action, metadata });
  };

  const getCurrentUserRole = (): string => {
    return user?.roles?.[0] || 'end_user';
  };

  // Simplified implementations for missing methods
  const getCurrentPlan = () => ({ name: 'freemium', features: [] });
  const getAccessSnapshot = () => ({});
  const subscribeToAccessChanges = () => () => {};
  const preloadFeatures = async () => {};
  const refreshAccess = async () => {};
  const checkFeatureAccess = async () => ({ allowed: true });
  const getFeatureUIStatus = (features: string | string[]) => ({ enabled: true, visible: true });

  return (
    <AccessControlContext.Provider value={{
      isFeatureEnabled,
      trackFeatureUsage,
      getCurrentUserRole,
      hasRole,
      getCurrentUser,
      loading: false,
      getCurrentPlan,
      getAccessSnapshot,
      subscribeToAccessChanges,
      preloadFeatures,
      refreshAccess,
      checkFeatureAccess,
      getFeatureUIStatus
    }}>
      {children}
    </AccessControlContext.Provider>
  );
};

export const useAccessControl = () => {
  const context = useContext(AccessControlContext);
  if (!context) {
    throw new Error('useAccessControl must be used within AccessControlProvider');
  }
  return context;
};