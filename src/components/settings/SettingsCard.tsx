
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsCardProps {
  title: string;
  description: string;
  icon: string;
  planAccess: 'freemium' | 'advanced' | 'professional' | 'enterprise';
  status: 'configured' | 'not_set' | 'locked';
  locked: boolean;
  onClick: () => void;
  className?: string;
}

const SettingsCard: React.FC<SettingsCardProps> = ({
  title,
  description,
  icon,
  planAccess,
  status,
  locked,
  onClick,
  className
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'configured': return 'bg-green-100 text-green-800';
      case 'not_set': return 'bg-yellow-100 text-yellow-800';
      case 'locked': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'configured': return 'Configured';
      case 'not_set': return 'Not Set';
      case 'locked': return `${planAccess} Only`;
      default: return 'Unknown';
    }
  };

  const getPlanBadgeColor = () => {
    switch (planAccess) {
      case 'freemium': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      case 'professional': return 'bg-orange-100 text-orange-800';
      case 'enterprise': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <Card 
      className={cn(
        "min-h-44 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] rounded-2xl",
        locked && "opacity-60",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div className="text-2xl">{icon}</div>
          {locked && <Lock className="h-4 w-4 text-gray-400" />}
        </div>

        <div className="flex-1 space-y-2">
          <h3 className={cn(
            "font-semibold text-sm",
            locked && "blur-sm"
          )}>
            {title}
          </h3>
          <p className={cn(
            "text-xs text-muted-foreground line-clamp-2",
            locked && "blur-sm"
          )}>
            {description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-1">
            <Badge className={cn("text-xs px-2 py-1", getStatusColor())}>
              {getStatusText()}
            </Badge>
            {planAccess !== 'freemium' && (
              <Badge className={cn("text-xs px-2 py-1", getPlanBadgeColor())}>
                {planAccess}
              </Badge>
            )}
          </div>
          
          {!locked && (
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {locked && (
          <div className="mt-2">
            <Button size="sm" variant="outline" className="w-full text-xs">
              Upgrade to {planAccess}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SettingsCard;
