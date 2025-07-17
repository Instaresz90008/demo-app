import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Zap } from 'lucide-react';

interface RequireSubscriptionProps {
  plan: 'freemium' | 'advanced' | 'professional' | 'enterprise';
  children: React.ReactNode;
  feature?: string;
  showUpgrade?: boolean;
}

const PLAN_HIERARCHY = {
  freemium: 0,
  advanced: 1,
  professional: 2,
  enterprise: 3
};

const RequireSubscription: React.FC<RequireSubscriptionProps> = ({ 
  plan, 
  children, 
  feature,
  showUpgrade = true 
}) => {
  const { user } = useAuth();
  
  if (!user) {
    return null;
  }

  // Platform admin bypasses subscription restrictions
  if (user.roles?.includes('platform_admin')) {
    return <>{children}</>;
  }

  const userPlanLevel = PLAN_HIERARCHY[user.planType as keyof typeof PLAN_HIERARCHY] ?? 0;
  const requiredPlanLevel = PLAN_HIERARCHY[plan];

  if (userPlanLevel >= requiredPlanLevel) {
    return <>{children}</>;
  }

  if (!showUpgrade) {
    return null;
  }

  return (
    <Card className="border-dashed border-2 border-primary/20">
      <CardHeader className="text-center pb-3">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
          {plan === 'enterprise' ? <Crown className="w-6 h-6 text-primary" /> : <Zap className="w-6 h-6 text-primary" />}
        </div>
        <CardTitle className="text-lg">
          {plan === 'enterprise' ? 'Enterprise Feature' : `${plan.charAt(0).toUpperCase() + plan.slice(1)} Feature`}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-muted-foreground mb-4">
          {feature ? `${feature} requires` : 'This feature requires'} a {plan} subscription.
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Your current plan: {user.planType}
        </p>
        <Button className="w-full">
          Upgrade to {plan.charAt(0).toUpperCase() + plan.slice(1)}
        </Button>
      </CardContent>
    </Card>
  );
};

export default RequireSubscription;