import React from "react";
import { cn } from "@/lib/utils";
import { Check, Calendar, Users, Settings, LinkIcon } from "lucide-react";

interface Step {
  id: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const steps: Step[] = [
  { id: 1, label: "Service Selection", icon: Settings },
  { id: 2, label: "Date & Time", icon: Calendar },
  { id: 3, label: "Configuration", icon: Users },
  { id: 4, label: "Confirmation", icon: LinkIcon },
];

interface Props {
  step: number;
  onStepChange: (step: number) => void;
  progressPercentage: number;
  completedSteps: number[];
}

const SlotBroadcastStepIndicator: React.FC<Props> = ({
  step,
  onStepChange,
  progressPercentage,
  completedSteps,
}) => {
  return (
    <div className="w-80 bg-card/80 backdrop-blur-sm border-r border-border/50 flex flex-col h-full shadow-xl">
      {/* Header */}
      <div className="p-8 border-b border-border/50 bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 dark:bg-primary/30 flex items-center justify-center backdrop-blur-sm">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Slot Broadcast</h1>
            <p className="text-sm text-muted-foreground">Create availability slots</p>
          </div>
        </div>
        <div className="text-xs text-muted-foreground font-medium">
          Step {step} of {steps.length}
        </div>
      </div>

      {/* Steps */}
      <div className="flex-1 p-6">
        <div className="space-y-2">
          {steps.map((s, index) => {
            const isActive = step === s.id;
            const isCompleted = completedSteps.includes(s.id);
            const isClickable = s.id <= step || isCompleted;
            const StepIcon = s.icon;

            return (
              <button
                key={s.id}
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepChange(s.id)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 group relative overflow-hidden",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5"
                    : isCompleted
                    ? "text-foreground hover:bg-accent/50 border border-transparent hover:border-border/50"
                    : "text-muted-foreground cursor-not-allowed opacity-60",
                  !isActive && !isCompleted && "hover:bg-muted/30"
                )}
              >
                {/* Background gradient for active state */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 rounded-xl" />
                )}
                
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 relative z-10",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : isCompleted
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                </div>
                
                <div className="flex-1 relative z-10">
                  <div className={cn(
                    "font-semibold text-sm transition-colors duration-300",
                    isActive && "text-primary"
                  )}>
                    {s.label}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {s.id === 1 && "Choose service & templates"}
                    {s.id === 2 && "Select dates & time slots"}
                    {s.id === 3 && "Advanced settings"}
                    {s.id === 4 && "Review & generate link"}
                  </div>
                </div>
                
                {/* Step number indicator */}
                <div className={cn(
                  "text-xs font-bold px-2 py-1 rounded-full transition-all duration-300 relative z-10",
                  isActive 
                    ? "bg-primary/20 text-primary" 
                    : "bg-muted/50 text-muted-foreground"
                )}>
                  {s.id}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress */}
      <div className="p-6 border-t border-border/50 bg-muted/30 dark:bg-card/30">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <span className="font-medium">Progress</span>
          <span className="font-bold text-foreground">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="mt-3 text-xs text-muted-foreground text-center">
          {step === 4 ? "Ready to broadcast!" : `${4 - step} steps remaining`}
        </div>
      </div>
    </div>
  );
};

export default SlotBroadcastStepIndicator;