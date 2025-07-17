
import React from 'react';
import { Button } from '@/components/ui/button';
import { useFeature } from '@/hooks/useFeature';
import { useAccessControl } from '@/context/AccessControlContext';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface GlobalActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon?: React.ReactNode;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost';
  featureKey?: string;
  requiredRoles?: string[];
  fullWidth?: boolean;
  tooltip?: string;
  disabledReason?: string;
}

export const GlobalActionButton: React.FC<GlobalActionButtonProps> = ({
  label,
  icon,
  loading = false,
  variant = 'primary',
  featureKey,
  requiredRoles,
  fullWidth = false,
  tooltip,
  disabledReason,
  className,
  onClick,
  ...props
}) => {
  const { canAccess } = useFeature();
  const { getCurrentUser } = useAccessControl();
  
  const currentUser = getCurrentUser();
  const userRoles = currentUser?.roles || [];

  // Check feature access
  const hasFeatureAccess = featureKey ? canAccess(featureKey) : true;
  
  // Check role access
  const hasRoleAccess = requiredRoles ? requiredRoles.some(role => userRoles.includes(role)) : true;
  
  const allowed = hasFeatureAccess && hasRoleAccess;
  const isDisabled = !allowed || props.disabled;

  const buttonVariant = (() => {
    switch (variant) {
      case 'primary': return 'default';
      case 'secondary': return 'secondary';
      case 'destructive': return 'destructive';
      case 'outline': return 'outline';
      case 'ghost': return 'ghost';
      default: return 'default';
    }
  })();

  const button = (
    <Button
      {...props}
      onClick={(e) => {
        if (!isDisabled && onClick) onClick(e);
      }}
      disabled={isDisabled || loading}
      variant={buttonVariant}
      className={cn(
        'flex items-center gap-2',
        fullWidth && 'w-full justify-center',
        className
      )}
    >
      {loading && <span className="loader h-4 w-4 animate-spin" />}
      {!loading && icon}
      {label}
    </Button>
  );

  if (tooltip || disabledReason) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>{tooltip || disabledReason}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
};

export default GlobalActionButton;
