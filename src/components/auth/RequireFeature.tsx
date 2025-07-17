import React from 'react';
import { useFeature } from '@/hooks/useFeature';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

interface RequireFeatureProps {
  feature: string | string[];
  children: React.ReactNode;
  showUpgrade?: boolean;
  fallback?: React.ReactNode;
}

const RequireFeature: React.FC<RequireFeatureProps> = ({ 
  feature, 
  children, 
  showUpgrade = true,
  fallback 
}) => {
  const { canAccess } = useFeature();
  
  const requiredFeatures = Array.isArray(feature) ? feature : [feature];
  const hasAccess = requiredFeatures.every(f => canAccess(f));

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgrade) {
    return null;
  }

  return (
    <Card className="border-dashed border-2 border-muted-foreground/20">
      <CardHeader className="text-center pb-3">
        <div className="mx-auto w-12 h-12 rounded-full bg-muted/10 flex items-center justify-center mb-2">
          <Lock className="w-6 h-6 text-muted-foreground" />
        </div>
        <CardTitle className="text-lg">Feature Locked</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-muted-foreground mb-4">
          This feature requires additional permissions or a higher subscription plan.
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Required: {requiredFeatures.join(', ')}
        </p>
        <Button variant="outline" className="w-full">
          Contact Support
        </Button>
      </CardContent>
    </Card>
  );
};

export default RequireFeature;