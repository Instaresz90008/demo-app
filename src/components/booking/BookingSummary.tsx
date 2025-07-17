
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, User } from 'lucide-react';

interface BookingSummaryProps {
  date: Date;
  time: string;
  providerName: string;
  duration: string;
  variant?: 'default' | 'compact';
  compact?: boolean;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  date,
  time,
  providerName,
  duration,
  variant = 'default',
  compact = false
}) => {
  return (
    <Card className={compact ? 'p-3' : 'p-4'}>
      <CardContent className={compact ? 'p-0' : 'p-2'}>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span>{date.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-green-500" />
            <span>{time} • {duration}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-purple-500" />
            <span>with {providerName}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingSummary;
