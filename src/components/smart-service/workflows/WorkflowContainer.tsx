
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { BookingType, PricingModel } from '@/types/smartService';
import { getWorkflowConfig } from './WorkflowConfig';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setWorkflowConfig, resetWorkflow } from '@/store/slices/workflowSlice';
import WorkflowNavigation from './WorkflowNavigation';
import WorkflowStepRenderer from './WorkflowStepRenderer';

interface WorkflowContainerProps {
  bookingType: BookingType;
  pricingModel: PricingModel;
  onComplete: (data: any) => void;
  onBack: () => void;
}

const WorkflowContainer: React.FC<WorkflowContainerProps> = ({
  bookingType,
  pricingModel,
  onComplete,
  onBack
}) => {
  const dispatch = useAppDispatch();
  const { 
    workflowConfig, 
    currentStepIndex, 
    completedSteps 
  } = useAppSelector((state) => state.workflow);

  const enhancedSteps = workflowConfig ? [
    ...workflowConfig.steps,
    {
      id: 'advanced-config',
      title: 'Advanced Settings',
      description: 'Configure advanced booking options',
      component: 'AdvancedConfigStep',
      fields: ['advanced_settings'],
      microcopy: 'Fine-tune your service with advanced configuration options'
    },
    {
      id: 'summary',
      title: 'Review & Publish',
      description: 'Review your service and publish',
      component: 'ServiceSummaryStep',
      fields: ['final_review'],
      microcopy: 'Review all settings before publishing your service'
    }
  ] : [];

  useEffect(() => {
    const config = getWorkflowConfig(bookingType.id, pricingModel.id);
    if (config) {
      dispatch(setWorkflowConfig(config));
    }
    
    return () => {
      dispatch(resetWorkflow());
    };
  }, [bookingType.id, pricingModel.id, dispatch]);

  if (!workflowConfig) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No specific workflow configured for this combination. Using default flow.
        </p>
        <Button onClick={onBack} variant="outline" className="mt-4">
          Back to Selection
        </Button>
      </div>
    );
  }

  const progress = ((currentStepIndex + 1) / enhancedSteps.length) * 100;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Workflow Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            ← Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              {workflowConfig.name}
            </h1>
            <p className="text-muted-foreground">{workflowConfig.description}</p>
          </div>
        </div>

        {/* Special Features */}
        {workflowConfig.specialFeatures.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {workflowConfig.specialFeatures.map((feature, index) => (
              <Badge key={index} variant="secondary">
                {feature.replace('-', ' ')}
              </Badge>
            ))}
          </div>
        )}

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Step {currentStepIndex + 1} of {enhancedSteps.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Step Navigation */}
        <div className="lg:col-span-1">
          <WorkflowNavigation steps={enhancedSteps} />
        </div>

        {/* Step Content */}
        <div className="lg:col-span-3">
          <WorkflowStepRenderer
            steps={enhancedSteps}
            bookingType={bookingType}
            pricingModel={pricingModel}
            onComplete={onComplete}
            onBack={onBack}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkflowContainer;
