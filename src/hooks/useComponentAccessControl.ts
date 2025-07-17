
import { useAccessControl } from '@/context/AccessControlContext';
import { useEffect, useState } from 'react';

interface UseComponentAccessControlOptions {
  requiredFeatures: string[];
  optionalFeatures?: string[];
  componentName: string;
  trackUsage?: boolean;
}

interface UseComponentAccessControlReturn {
  loading: boolean;
  hasRequiredAccess: boolean;
  hasFeature: (featureId: string) => boolean;
  trackComponentFeatureUsage: (featureId: string, action: string) => Promise<void>;
}

export const useComponentAccessControl = ({
  requiredFeatures,
  optionalFeatures = [],
  componentName,
  trackUsage = false
}: UseComponentAccessControlOptions): UseComponentAccessControlReturn => {
  const { isFeatureEnabled, trackFeatureUsage, loading: accessLoading } = useAccessControl();
  const [loading, setLoading] = useState(true);
  const [hasRequiredAccess, setHasRequiredAccess] = useState(false);

  useEffect(() => {
    const checkAccess = () => {
      const hasAccess = requiredFeatures.every(feature => isFeatureEnabled(feature));
      setHasRequiredAccess(hasAccess);
      setLoading(false);

      if (trackUsage && hasAccess) {
        trackComponentFeatureUsage(requiredFeatures[0], 'component_mount');
      }
    };

    if (!accessLoading) {
      checkAccess();
    }
  }, [requiredFeatures, isFeatureEnabled, accessLoading, trackUsage]);

  const hasFeature = (featureId: string): boolean => {
    return isFeatureEnabled(featureId);
  };

  const trackComponentFeatureUsage = async (featureId: string, action: string) => {
    try {
      await trackFeatureUsage(featureId, action, {
        component: componentName,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.warn(`Failed to track feature usage for ${featureId}:`, error);
    }
  };

  return {
    loading: loading || accessLoading,
    hasRequiredAccess,
    hasFeature,
    trackComponentFeatureUsage
  };
};

export default useComponentAccessControl;
