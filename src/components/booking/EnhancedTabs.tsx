
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface EnhancedTabsProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

interface EnhancedTabsListProps {
  className?: string;
  children: React.ReactNode;
}

interface EnhancedTabsTriggerProps {
  value: string;
  icon?: React.ReactNode;
  badge?: string;
  badgeVariant?: 'default' | 'popular';
  children: React.ReactNode;
}

interface EnhancedTabsContentProps {
  value: string;
  children: React.ReactNode;
}

export const EnhancedTabs: React.FC<EnhancedTabsProps> = ({ value, onValueChange, className, children }) => {
  return (
    <Tabs value={value} onValueChange={onValueChange} className={className}>
      {children}
    </Tabs>
  );
};

export const EnhancedTabsList: React.FC<EnhancedTabsListProps> = ({ className, children }) => {
  return (
    <TabsList className={className}>
      {children}
    </TabsList>
  );
};

export const EnhancedTabsTrigger: React.FC<EnhancedTabsTriggerProps> = ({ 
  value, 
  icon, 
  badge, 
  badgeVariant = 'default',
  children 
}) => {
  return (
    <TabsTrigger value={value} className="relative">
      <div className="flex items-center gap-2">
        {icon}
        {children}
      </div>
      {badge && (
        <Badge 
          variant={badgeVariant === 'popular' ? 'default' : 'outline'} 
          className="ml-2 text-xs"
        >
          {badge}
        </Badge>
      )}
    </TabsTrigger>
  );
};

export const EnhancedTabsContent: React.FC<EnhancedTabsContentProps> = ({ value, children }) => {
  return (
    <TabsContent value={value}>
      {children}
    </TabsContent>
  );
};
