import React from 'react';
import { useFeatureGating } from '@/hooks/useFeatureGating';
import RequireRole from '@/components/auth/RequireRole';
import RequireSubscription from '@/components/auth/RequireSubscription';
import RequireFeature from '@/components/auth/RequireFeature';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface FeatureGatedComponentProps {
  feature: string;
  requiredRole?: string[];
  requiredPlan?: 'freemium' | 'advanced' | 'professional' | 'enterprise';
  requiredFeature?: string;
  usageLimit?: number;
  usagePeriod?: 'day' | 'month' | 'year';
  children: React.ReactNode;
  fallback?: React.ReactNode;
  trackUsage?: boolean;
}

/**
 * Comprehensive feature gating component that combines all access controls
 */
const FeatureGatedComponent: React.FC<FeatureGatedComponentProps> = ({
  feature,
  requiredRole,
  requiredPlan,
  requiredFeature,
  usageLimit,
  usagePeriod = 'month',
  children,
  fallback,
  trackUsage = true
}) => {
  const { checkFeatureGate, trackFeatureUsage, getFeatureUsageStats } = useFeatureGating();

  const gateResult = checkFeatureGate({
    feature,
    requiredRole,
    requiredPlan,
    usageLimit,
    usagePeriod
  });

  const usageStats = getFeatureUsageStats(feature);

  React.useEffect(() => {
    if (gateResult.allowed && trackUsage) {
      trackFeatureUsage(feature, usagePeriod);
    }
  }, [gateResult.allowed, trackUsage, feature, usagePeriod, trackFeatureUsage]);

  // If not allowed, show reason
  if (!gateResult.allowed) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Card className="border-dashed border-2 border-yellow-500/20">
        <CardHeader className="text-center pb-3">
          <div className="mx-auto w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center mb-2">
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
          </div>
          <CardTitle className="text-lg">Feature Restricted</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4">
            {gateResult.reason}
          </p>
          {usageStats && usageLimit && (
            <p className="text-sm text-muted-foreground">
              Usage: {usageStats.count}/{usageLimit} this {usagePeriod}
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  // Apply nested access controls
  let component = <>{children}</>;

  if (requiredFeature) {
    component = <RequireFeature feature={requiredFeature}>{component}</RequireFeature>;
  }

  if (requiredPlan) {
    component = <RequireSubscription plan={requiredPlan}>{component}</RequireSubscription>;
  }

  if (requiredRole) {
    component = <RequireRole role={requiredRole}>{component}</RequireRole>;
  }

  return component;
};

export default FeatureGatedComponent;