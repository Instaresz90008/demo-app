
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Zap, TrendingUp, Shield } from 'lucide-react';
import { UpgradeNudge } from '@/types/access-control-enhanced';

interface UpgradePromptProps {
  nudge: UpgradeNudge;
  onUpgrade: () => void;
  onDismiss?: () => void;
  variant?: 'card' | 'banner' | 'modal';
}

const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  nudge,
  onUpgrade,
  onDismiss,
  variant = 'card'
}) => {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getIcon = (feature: string) => {
    switch (feature) {
      case 'aiAccess': return <Zap className="h-5 w-5" />;
      case 'revenueCap': return <TrendingUp className="h-5 w-5" />;
      case 'maxServices': return <Shield className="h-5 w-5" />;
      default: return <Crown className="h-5 w-5" />;
    }
  };

  if (variant === 'banner') {
    return (
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getIcon(nudge.feature)}
            <div>
              <h4 className="font-semibold text-sm">{nudge.title}</h4>
              <p className="text-xs text-muted-foreground">{nudge.message}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getUrgencyColor(nudge.urgency)} className="text-xs">
              {nudge.urgency.toUpperCase()}
            </Badge>
            <Button size="sm" onClick={onUpgrade}>
              {nudge.ctaText}
            </Button>
            {onDismiss && (
              <Button size="sm" variant="ghost" onClick={onDismiss}>
                ×
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="border-dashed border-2 border-primary/20">
      <CardHeader className="text-center pb-3">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
          {getIcon(nudge.feature)}
        </div>
        <CardTitle className="text-lg">{nudge.title}</CardTitle>
        <Badge variant={getUrgencyColor(nudge.urgency)} className="text-xs w-fit mx-auto">
          {nudge.urgency.toUpperCase()} PRIORITY
        </Badge>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-muted-foreground">{nudge.message}</p>
        <div className="flex gap-2">
          <Button onClick={onUpgrade} className="flex-1">
            <Crown className="w-4 h-4 mr-2" />
            {nudge.ctaText}
          </Button>
          {onDismiss && (
            <Button variant="outline" onClick={onDismiss} className="flex-1">
              Maybe Later
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpgradePrompt;
