
import { useAccessControl } from '@/context/AccessControlContext';

interface FeatureMetadata {
  isEnterpriseOnly: boolean;
  category: string;
  minimumTier: string;
  description?: string;
}

/**
 * Centralized hook for feature access control
 */
export function useFeature(featureKey: string): boolean;
export function useFeature(): {
  canAccess: (featureId: string) => boolean;
  getTier: () => string;
  featureMetadata: (featureId: string) => FeatureMetadata | null;
};
export function useFeature(featureKey?: string): boolean | {
  canAccess: (featureId: string) => boolean;
  getTier: () => string;
  featureMetadata: (featureId: string) => FeatureMetadata | null;
} {
  const { isFeatureEnabled, getCurrentPlan, getCurrentUserRole } = useAccessControl();
  
  // If featureKey is provided, return boolean (original behavior)
  if (featureKey) {
    try {
      return isFeatureEnabled(featureKey);
    } catch (error) {
      console.warn(`Feature check failed for ${featureKey}:`, error);
      return false;
    }
  }

  // If no featureKey, return object with helper methods
  const canAccess = (featureId: string): boolean => {
    try {
      return isFeatureEnabled(featureId);
    } catch (error) {
      console.warn(`Feature check failed for ${featureId}:`, error);
      return false;
    }
  };

  const getTier = (): string => {
    return getCurrentPlan();
  };

  const featureMetadata = (featureId: string): FeatureMetadata | null => {
    // Mock metadata - in a real app this would come from your feature config
    const featureConfigs: Record<string, FeatureMetadata> = {
      'exportCSV': {
        isEnterpriseOnly: false,
        category: 'data',
        minimumTier: 'professional',
        description: 'Export table data to CSV format'
      },
      'columnReorder': {
        isEnterpriseOnly: false,
        category: 'ui',
        minimumTier: 'advanced',
        description: 'Reorder and hide table columns'
      },
      'asyncDataSource': {
        isEnterpriseOnly: true,
        category: 'data',
        minimumTier: 'enterprise',
        description: 'Async data loading for large datasets'
      },
      'platform_admin_access': {
        isEnterpriseOnly: true,
        category: 'admin',
        minimumTier: 'enterprise',
        description: 'Platform administration features'
      }
    };

    return featureConfigs[featureId] || null;
  };

  return {
    canAccess,
    getTier,
    featureMetadata
  };
}
