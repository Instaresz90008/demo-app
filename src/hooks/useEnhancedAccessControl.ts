
// This file is now deprecated in favor of useUnifiedAccessControl
// Keeping for backward compatibility, but forwarding to unified system

import { useUnifiedAccessControl } from './useUnifiedAccessControl';

export const useEnhancedAccessControl = () => {
  const unified = useUnifiedAccessControl();
  
  return {
    capabilities: unified.capabilities,
    checkFeatureAccess: (feature: string) => unified.checkFeature(feature as any).allowed,
    checkLimit: (feature: string, currentUsage: number) => {
      const capabilities = unified.capabilities;
      if (!capabilities) return false;
      const limit = capabilities[feature as keyof typeof capabilities];
      // Fix the type conversion issue by properly handling boolean and number types
      if (typeof limit === 'number') {
        return currentUsage < limit;
      } else if (typeof limit === 'boolean') {
        return limit; // If it's a boolean, return the boolean value directly
      }
      return true; // Default to true for undefined values
    },
    checkRevenueCap: () => ({ allowed: true, remaining: Infinity, cappedOut: false }),
    getUpgradeNudge: () => null,
    isPlatformAdmin: unified.isPlatformAdmin,
    canImpersonateUser: unified.isPlatformAdmin,
    revenueData: null,
    loading: false,
    refreshRevenue: async () => {}
  };
};
