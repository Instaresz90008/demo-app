
import React from 'react';
import { useEnhancedAccessControl } from '@/hooks/useEnhancedAccessControl';
import UpgradePrompt from './UpgradePrompt';
import SoftLock from './SoftLock';

interface FeatureGateProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgrade?: boolean;
}

const FeatureGate: React.FC<FeatureGateProps> = ({
  feature,
  children,
  fallback,
  showUpgrade = true
}) => {
  const { checkFeatureAccess, getUpgradeNudge, checkRevenueCap } = useEnhancedAccessControl();

  // Check if feature is accessible
  const hasAccess = checkFeatureAccess(feature as any);
  
  // Check revenue cap for advanced trial users
  const { allowed: revenueAllowed, cappedOut, remaining } = checkRevenueCap();

  if (hasAccess && revenueAllowed) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgrade) {
    return null;
  }

  // Show revenue cap message if that's the blocker
  if (hasAccess && cappedOut) {
    return (
      <SoftLock
        type="revenue_cap"
        title="Revenue Cap Reached"
        message="You've reached your trial revenue limit. Upgrade to continue collecting payments."
        current={100 - remaining}
        limit={100}
        onUpgrade={() => console.log('Upgrade to remove revenue cap')}
      />
    );
  }

  // Show feature upgrade prompt
  const nudge = getUpgradeNudge();
  if (nudge) {
    return (
      <UpgradePrompt
        nudge={nudge}
        onUpgrade={() => console.log('Upgrade to unlock feature:', feature)}
        variant="card"
      />
    );
  }

  return null;
};

export default FeatureGate;
