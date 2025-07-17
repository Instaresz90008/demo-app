
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { goToStep } from '@/store/slices/workflowSlice';
import { toast } from 'sonner';

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  component: string;
  fields: string[];
  microcopy?: string;
}

interface WorkflowNavigationProps {
  steps: WorkflowStep[];
}

const WorkflowNavigation: React.FC<WorkflowNavigationProps> = ({ steps }) => {
  const dispatch = useAppDispatch();
  const { currentStepIndex, completedSteps } = useAppSelector((state) => state.workflow);

  const handleStepClick = (stepIndex: number) => {
    const maxAllowedStep = Math.max(...completedSteps, -1) + 1;
    
    if (stepIndex <= maxAllowedStep || stepIndex <= currentStepIndex) {
      dispatch(goToStep(stepIndex));
    } else {
      toast.error('Please complete the current step before proceeding');
    }
  };

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-sm">Workflow Steps</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {steps.map((step, index) => (
          <motion.button
            key={step.id}
            onClick={() => handleStepClick(index)}
            disabled={index > Math.max(...completedSteps, -1) + 1 && index > currentStepIndex}
            className={`w-full p-3 rounded-lg text-left transition-all ${
              index === currentStepIndex
                ? 'bg-primary text-primary-foreground'
                : completedSteps.includes(index)
                ? 'bg-green-50 text-green-700 border border-green-200'
                : index <= Math.max(...completedSteps, -1) + 1 || index <= currentStepIndex
                ? 'bg-muted hover:bg-muted/80'
                : 'bg-muted/50 text-muted-foreground cursor-not-allowed'
            }`}
            whileHover={index <= Math.max(...completedSteps, -1) + 1 || index <= currentStepIndex ? { scale: 1.02 } : {}}
            whileTap={index <= Math.max(...completedSteps, -1) + 1 || index <= currentStepIndex ? { scale: 0.98 } : {}}
          >
            <div className="flex items-center gap-2">
              {completedSteps.includes(index) ? (
                <CheckCircle className="h-4 w-4" />
              ) : index === currentStepIndex ? (
                <ArrowRight className="h-4 w-4" />
              ) : (
                <div className="h-4 w-4 rounded-full bg-current opacity-50" />
              )}
              <div>
                <p className="font-medium text-sm">{step.title}</p>
                <p className="text-xs opacity-75">{step.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </CardContent>
    </Card>
  );
};

export default WorkflowNavigation;
