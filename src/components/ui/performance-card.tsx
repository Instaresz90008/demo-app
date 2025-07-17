import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface PerformanceCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'flat';
}

/**
 * Ultra-performance optimized card component
 * Zero animations, minimal shadows, maximum performance
 */
export const PerformanceCard: React.FC<PerformanceCardProps> = ({ 
  children, 
  className = '', 
  variant = 'default' 
}) => {
  const variants = {
    default: 'bg-card border',
    elevated: 'bg-card border shadow-sm',
    flat: 'bg-muted border-0'
  };

  return (
    <Card className={cn(
      variants[variant],
      'rounded-lg overflow-hidden',
      className
    )}>
      <CardContent className="p-0">
        {children}
      </CardContent>
    </Card>
  );
};