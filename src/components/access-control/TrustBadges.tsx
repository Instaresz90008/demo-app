
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, Star, Shield, TrendingUp } from 'lucide-react';
import { TrustSignals } from '@/types/access-control-enhanced';

interface TrustBadgesProps {
  trustData: TrustSignals;
  plan: string;
  variant?: 'compact' | 'detailed' | 'inline';
}

const TrustBadges: React.FC<TrustBadgesProps> = ({
  trustData,
  plan,
  variant = 'compact'
}) => {
  const showBadges = ['advanced_trial', 'advanced', 'professional', 'enterprise'].includes(plan);
  
  if (!showBadges) return null;

  const badges = [
    {
      condition: trustData.verifiedHost,
      icon: <CheckCircle className="h-3 w-3" />,
      label: "Verified Host",
      variant: "default" as const
    },
    {
      condition: trustData.responseTime <= 2,
      icon: <Clock className="h-3 w-3" />,
      label: `${trustData.responseTime}h response`,
      variant: "secondary" as const
    },
    {
      condition: trustData.bookingStats >= 10,
      icon: <TrendingUp className="h-3 w-3" />,
      label: `${trustData.bookingStats} bookings`,
      variant: "outline" as const
    },
    {
      condition: trustData.rating >= 4.5,
      icon: <Star className="h-3 w-3" />,
      label: `${trustData.rating}/5`,
      variant: "default" as const
    },
    {
      condition: trustData.completionRate >= 95,
      icon: <Shield className="h-3 w-3" />,
      label: `${trustData.completionRate}% completion`,
      variant: "secondary" as const
    }
  ];

  const visibleBadges = badges.filter(badge => badge.condition);

  if (variant === 'inline') {
    return (
      <div className="flex flex-wrap gap-1">
        {visibleBadges.map((badge, index) => (
          <Badge key={index} variant={badge.variant} className="text-xs">
            {badge.icon}
            <span className="ml-1">{badge.label}</span>
          </Badge>
        ))}
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
        <CardContent className="p-4">
          <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Trust Signals
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {visibleBadges.map((badge, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                {badge.icon}
                <span>{badge.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {visibleBadges.slice(0, 3).map((badge, index) => (
        <Badge key={index} variant={badge.variant} className="text-xs">
          {badge.icon}
          <span className="ml-1">{badge.label}</span>
        </Badge>
      ))}
      {visibleBadges.length > 3 && (
        <Badge variant="outline" className="text-xs">
          +{visibleBadges.length - 3} more
        </Badge>
      )}
    </div>
  );
};

export default TrustBadges;
