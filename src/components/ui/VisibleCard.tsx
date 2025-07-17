
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface VisibleCardProps extends React.ComponentPropsWithoutRef<typeof Card> {
  variant?: 'default' | 'elevated' | 'bordered';
  children?: React.ReactNode;
}

export const VisibleCard: React.FC<VisibleCardProps> = ({ 
  className, 
  variant = 'default',
  children,
  ...props 
}) => {
  const variantClasses = {
    default: '',
    elevated: 'shadow-lg border-border/50',
    bordered: 'border-2 border-border'
  };

  return (
    <Card 
      className={cn(
        'bg-card text-card-foreground',
        variantClasses[variant],
        className
      )} 
      {...props} 
    >
      {children}
    </Card>
  );
};
