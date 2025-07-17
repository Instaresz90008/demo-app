
import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  id: number;
  label: string;
}

const steps: Step[] = [
  { id: 1, label: "Basic Info" },
  { id: 2, label: "Meeting Types" },
  { id: 3, label: "Additional Settings" },
  { id: 4, label: "Summary" },
];

interface Props {
  step: number;
  onStepChange: (step: number) => void;
  progressPercentage: number;
  completedSteps: number[];
}

const CreateServiceStepIndicator: React.FC<Props> = ({
  step,
  onStepChange,
  progressPercentage,
  completedSteps,
}) => {
  return (
    <div className="w-64 bg-card border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-semibold text-foreground mb-1">Create Service</h1>
        <p className="text-sm text-muted-foreground">Step {step} of {steps.length}</p>
      </div>

      {/* Steps */}
      <div className="flex-1 p-6">
        <div className="space-y-1">
          {steps.map((s, index) => {
            const isActive = step === s.id;
            const isCompleted = completedSteps.includes(s.id);
            const isClickable = s.id <= step || isCompleted;

            return (
              <button
                key={s.id}
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepChange(s.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : isCompleted
                    ? "text-foreground hover:bg-accent"
                    : "text-muted-foreground cursor-not-allowed"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isCompleted
                      ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : s.id}
                </div>
                <span className={cn("font-medium", isActive && "text-primary")}>
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress */}
      <div className="p-6 border-t border-border">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Progress</span>
          <span>{progressPercentage}% complete</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateServiceStepIndicator;
