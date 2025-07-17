
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Crown } from 'lucide-react';

interface UnifiedFeatureGateProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const FEATURE_REQUIREMENTS = {
  'dashboard': { minPlan: 'freemium', roles: ['end_user', 'team_admin', 'org_admin', 'platform_admin'] },
  'manageServices': { minPlan: 'freemium', roles: ['end_user', 'team_admin', 'org_admin', 'platform_admin'] },
  'bookingLinks': { minPlan: 'freemium', roles: ['end_user', 'team_admin', 'org_admin', 'platform_admin'] },
  'settings': { minPlan: 'freemium', roles: ['end_user', 'team_admin', 'org_admin', 'platform_admin'] },
  'aiSettings': { minPlan: 'professional', roles: ['end_user', 'team_admin', 'org_admin', 'platform_admin'] },
  'integrationsWebhooks': { minPlan: 'professional', roles: ['end_user', 'team_admin', 'org_admin', 'platform_admin'] },
  'apiManagement': { minPlan: 'professional', roles: ['end_user', 'team_admin', 'org_admin', 'platform_admin'] },
  'customDomain': { minPlan: 'enterprise', roles: ['org_admin', 'platform_admin'] },
  'betaFeatures': { minPlan: 'professional', roles: ['end_user', 'team_admin', 'org_admin', 'platform_admin'] }
};

const PLAN_HIERARCHY = {
  freemium: 0,
  advanced: 1,
  professional: 2,
  enterprise: 3
};

const UnifiedFeatureGate: React.FC<UnifiedFeatureGateProps> = ({ 
  feature, 
  children, 
  fallback 
}) => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  // Platform admin bypasses all restrictions
  if (user.roles?.includes('platform_admin')) {
    return <>{children}</>;
  }

  const featureConfig = FEATURE_REQUIREMENTS[feature as keyof typeof FEATURE_REQUIREMENTS];
  
  if (!featureConfig) {
    console.warn(`Feature "${feature}" not found in requirements`);
    return <>{children}</>;
  }

  const userPlanLevel = PLAN_HIERARCHY[user.planType as keyof typeof PLAN_HIERARCHY] ?? 0;
  const requiredPlanLevel = PLAN_HIERARCHY[featureConfig.minPlan as keyof typeof PLAN_HIERARCHY];

  // Check plan access
  if (userPlanLevel < requiredPlanLevel) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Card className="border-dashed border-2 border-primary/20">
        <CardHeader className="text-center pb-3">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            {featureConfig.minPlan === 'enterprise' ? 
              <Crown className="w-6 h-6 text-primary" /> : 
              <Lock className="w-6 h-6 text-primary" />
            }
          </div>
          <CardTitle className="text-lg">
            {featureConfig.minPlan === 'enterprise' ? 'Enterprise Feature' : 'Upgrade Required'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4">
            This feature requires a {featureConfig.minPlan} subscription.
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Your current plan: {user.planType}
          </p>
          <Button className="w-full">
            Upgrade to {featureConfig.minPlan.charAt(0).toUpperCase() + featureConfig.minPlan.slice(1)}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Check role access
  const hasRequiredRole = featureConfig.roles.some(role => user.roles?.includes(role));
  if (!hasRequiredRole) {
    return (
      <Card className="border-destructive/20">
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">
            You don't have permission to access this feature.
          </p>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};

export default UnifiedFeatureGate;
