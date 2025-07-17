
import React from 'react';
import { useFeature } from '@/hooks/useFeature';
import { useAccessControl } from '@/context/AccessControlContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GlobalEmptyStateProps {
  icon?: React.ReactNode | (() => JSX.Element);
  title?: string;
  description?: string;
  actionLabel?: string;
  onActionClick?: () => void;
  actionHref?: string;
  className?: string;
  centerAlign?: boolean;
  fullHeight?: boolean;
  requiredRoles?: string[];
  featureKey?: string;
  variant?: 'default' | 'minimal' | 'compact';
  children?: React.ReactNode;
}

export const GlobalEmptyState: React.FC<GlobalEmptyStateProps> = ({
  icon,
  title = 'No Data Found',
  description = 'There is nothing to show here yet.',
  actionLabel,
  onActionClick,
  actionHref,
  className,
  centerAlign = true,
  fullHeight = false,
  requiredRoles = [],
  featureKey,
  variant = 'default',
  children
}) => {
  const { getCurrentUser } = useAccessControl();
  const { canAccess } = useFeature();
  
  const currentUser = getCurrentUser();
  const userRoles = currentUser?.roles || [];
  const hasRoleAccess = requiredRoles.length === 0 || requiredRoles.some(role => userRoles.includes(role));
  const hasFeatureAccess = !featureKey || canAccess(featureKey);

  if (!hasRoleAccess || !hasFeatureAccess) return null;

  const renderIcon = () => {
    if (typeof icon === 'function') return icon();
    return icon || (
      <svg className="h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6a4 4 0 118 0v6m-4 4a4 4 0 01-4-4h8a4 4 0 01-4 4z" />
      </svg>
    );
  };

  const layoutClasses = cn(
    'flex flex-col items-center justify-center px-6 py-8 border border-dashed border-border rounded-lg',
    fullHeight && 'min-h-[50vh]',
    centerAlign ? 'text-center' : 'text-left',
    variant === 'minimal' && 'bg-muted/10 text-muted-foreground p-4',
    variant === 'compact' && 'px-2 py-4 text-sm gap-2',
    className
  );

  return (
    <div className={layoutClasses}>
      {renderIcon()}
      <div className="mt-4 space-y-1">
        <h3 className="text-lg font-semibold leading-none">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      {children && <div className="mt-4 w-full">{children}</div>}
      {actionLabel && (actionHref || onActionClick) && (
        <div className="mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={onActionClick}
            asChild={!!actionHref}
          >
            {actionHref ? <a href={actionHref}>{actionLabel}</a> : actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default GlobalEmptyState;
