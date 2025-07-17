
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Lock, DollarSign, AlertTriangle } from 'lucide-react';

interface SoftLockProps {
  type: 'revenue_cap' | 'usage_limit' | 'feature_lock';
  title: string;
  message: string;
  current?: number;
  limit?: number;
  onUpgrade: () => void;
  onLearnMore?: () => void;
}

const SoftLock: React.FC<SoftLockProps> = ({
  type,
  title,
  message,
  current = 0,
  limit = 100,
  onUpgrade,
  onLearnMore
}) => {
  const getIcon = () => {
    switch (type) {
      case 'revenue_cap': return <DollarSign className="h-6 w-6 text-amber-500" />;
      case 'usage_limit': return <AlertTriangle className="h-6 w-6 text-orange-500" />;
      default: return <Lock className="h-6 w-6 text-red-500" />;
    }
  };

  const progress = limit > 0 ? (current / limit) * 100 : 0;

  return (
    <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
      <CardHeader className="text-center pb-3">
        <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mb-2">
          {getIcon()}
        </div>
        <CardTitle className="text-lg text-amber-800 dark:text-amber-200">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {type === 'revenue_cap' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Revenue Collected</span>
              <span className="font-semibold">${current.toFixed(2)} / ${limit.toFixed(2)}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        {type === 'usage_limit' && limit > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Usage</span>
              <span className="font-semibold">{current} / {limit}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        <p className="text-amber-700 dark:text-amber-300 text-sm text-center">
          {message}
        </p>
        
        <div className="flex gap-2">
          <Button onClick={onUpgrade} className="flex-1">
            Upgrade Now
          </Button>
          {onLearnMore && (
            <Button variant="outline" onClick={onLearnMore} className="flex-1">
              Learn More
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SoftLock;
