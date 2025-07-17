
import React from 'react';
import { Shield, Clock, Users, Star, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TrustIndicatorsProps {
  recentBookings?: number;
  responseTime?: string;
  rating?: number;
  isLiveAvailability?: boolean;
}

export const TrustIndicators: React.FC<TrustIndicatorsProps> = ({
  recentBookings = 0,
  responseTime = "< 2 hours",
  rating = 4.9,
  isLiveAvailability = true
}) => {
  return (
    <div className="space-y-2">
      {recentBookings > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-lg hover:scale-105 transition-transform duration-200">
          <Users className="w-3 h-3" />
          <span className="font-medium">{recentBookings} booked this week</span>
        </div>
      )}
      
      <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-lg hover:scale-105 transition-transform duration-200">
        <Star className="w-3 h-3 fill-current" />
        <span className="font-medium">{rating} rating</span>
      </div>
    </div>
  );
};

export const PopularTimeBadge = () => (
  <Badge className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-1.5 py-0.5 animate-pulse">
    🔥 Popular
  </Badge>
);

export const RecommendedBadge = () => (
  <Badge className="absolute -top-1 -right-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-1.5 py-0.5">
    ⭐ Best
  </Badge>
);
