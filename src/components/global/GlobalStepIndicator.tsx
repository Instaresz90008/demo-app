
import React from 'react';
import { CheckCircle, Circle, AlertTriangle } from 'lucide-react';
import { useAccessControl } from '@/context/AccessControlContext';
import { useFeature } from '@/hooks/useFeature';
import { cn } from '@/lib/utils';
import { broadcastEvent } from '@/utils/eventBus';

export interface Step {
  id: string;
  label: string;
  optional?: boolean;
  featureKey?: string;
  requiredRoles?: string[];
  group?: string;
}

interface GlobalStepIndicatorProps {
  steps: Step[];
  currentStepId: string;
  onStepChange?: (stepId: string) => void;
  variant?: 'horizontal' | 'vertical' | 'progress';
  contextGroup?: string;
  showStepNumbers?: boolean;
  debugMode?: boolean;
  completedStepIds?: string[];
}

export const GlobalStepIndicator: React.FC<GlobalStepIndicatorProps> = ({
  steps,
  currentStepId,
  onStepChange,
  variant = 'horizontal',
  contextGroup,
  showStepNumbers = true,
  debugMode = false,
  completedStepIds = []
}) => {
  const { canAccess } = useFeature();
  const { getCurrentUser } = useAccessControl();
  
  const currentUser = getCurrentUser();
  const userRoles = currentUser?.roles || [];

  const filteredSteps = steps.filter(step => {
    const featureAllowed = step.featureKey ? canAccess(step.featureKey) : true;
    const rolesAllowed = step.requiredRoles ? step.requiredRoles.every(role => userRoles.includes(role)) : true;
    return featureAllowed && rolesAllowed;
  });

  const handleClick = (step: Step) => {
    onStepChange?.(step.id);
    if (contextGroup) {
      broadcastEvent('stepChanged', { group: contextGroup, stepId: step.id });
    }
  };

  return (
    <div
      className={cn(
        'flex w-full gap-4 items-start',
        variant === 'vertical' ? 'flex-col' : 'flex-row'
      )}
    >
      {filteredSteps.map((step, index) => {
        const isActive = step.id === currentStepId;
        const isCompleted = completedStepIds.includes(step.id);
        const Icon = isCompleted ? CheckCircle : Circle;

        return (
          <div
            key={step.id}
            className={cn(
              'flex items-center gap-2 cursor-pointer transition-colors',
              isActive ? 'text-primary font-semibold' : 'text-muted-foreground',
              variant === 'vertical' ? 'flex-row' : 'flex-col items-center'
            )}
            onClick={() => handleClick(step)}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <div className="flex flex-col items-start">
              <span className="text-sm">
                {showStepNumbers && `${index + 1}. `}{step.label}
              </span>
              {debugMode && step.optional && (
                <span className="text-xs text-amber-600 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Optional
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GlobalStepIndicator;
