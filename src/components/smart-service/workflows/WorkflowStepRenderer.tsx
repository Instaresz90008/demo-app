import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { BookingType, PricingModel } from '@/types/smartService';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCurrentStepIndex, completeStep, setValidating, updateStepData } from '@/store/slices/workflowSlice';
import ServiceConfigForm from '../ServiceConfigForm';
import AvailabilityPicker from '../availability/AvailabilityPicker';
import AdvancedConfig from './steps/AdvancedConfig';
import ServiceSummaryStep from './steps/ServiceSummaryStep';
import { toast } from 'sonner';

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  component: string;
  fields: string[];
  microcopy?: string;
}

interface WorkflowStepRendererProps {
  steps: WorkflowStep[];
  bookingType: BookingType;
  pricingModel: PricingModel;
  onComplete: (data: any) => void;
  onBack: () => void;
}

const WorkflowStepRenderer: React.FC<WorkflowStepRendererProps> = ({
  steps,
  bookingType,
  pricingModel,
  onComplete,
  onBack
}) => {
  const dispatch = useAppDispatch();
  const { 
    currentStepIndex, 
    stepData, 
    completedSteps, 
    isValidating, 
    workflowConfig, 
    availabilityMode 
  } = useAppSelector((state) => state.workflow);

  const currentStep = steps[currentStepIndex];

  const validateStepData = useCallback((stepId: string, data: any): boolean => {
    if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) {
      return false;
    }

    switch (stepId) {
      case 'service-setup':
        return !!(data.name && data.description && data.duration_mins && (data.cost_factor || !pricingModel.configFields.includes('price')));
      case 'availability':
      case 'slots':
        return !!(data.slots && data.slots.length > 0);
      case 'advanced-config':
        return true;
      case 'summary':
        return true;
      default:
        return Object.keys(data).length > 0;
    }
  }, [pricingModel.configFields]);

  const handleStepComplete = useCallback(async (data: any) => {
    if (!validateStepData(currentStep.id, data)) {
      toast.error('Please complete all required fields before continuing');
      return;
    }

    dispatch(setValidating(true));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      dispatch(updateStepData({ 
        stepId: currentStep.id, 
        data 
      }));
      
      dispatch(completeStep(currentStepIndex));
      
      if (currentStepIndex < steps.length - 1) {
        const nextStepIndex = currentStepIndex + 1;
        dispatch(setCurrentStepIndex(nextStepIndex));
        toast.success(`${currentStep.title} completed! Moving to ${steps[nextStepIndex].title}`);
      } else {
        toast.success('Service published successfully!');
        onComplete({
          workflowId: workflowConfig?.id,
          bookingType,
          pricingModel,
          stepData,
          specialFeatures: workflowConfig?.specialFeatures || []
        });
      }
    } catch (error) {
      toast.error('There was an error processing your request. Please try again.');
    } finally {
      dispatch(setValidating(false));
    }
  }, [currentStep, currentStepIndex, steps, dispatch, validateStepData, workflowConfig, bookingType, pricingModel, stepData, onComplete]);

  const handleStepBack = useCallback(() => {
    if (currentStepIndex > 0) {
      dispatch(setCurrentStepIndex(currentStepIndex - 1));
    } else {
      onBack();
    }
  }, [currentStepIndex, dispatch, onBack]);

  const handleEditStep = useCallback((stepId: string) => {
    const stepIndex = steps.findIndex(step => step.id === stepId);
    if (stepIndex !== -1) {
      dispatch(setCurrentStepIndex(stepIndex));
    }
  }, [steps, dispatch]);

  // Memoized config change handler to prevent unnecessary re-renders
  const handleConfigChange = useCallback((config: any) => {
    dispatch(updateStepData({ 
      stepId: currentStep.id, 
      data: config 
    }));
  }, [dispatch, currentStep.id]);

  // Separate handler for availability changes with debouncing
  const handleAvailabilityChange = useCallback((availability: any) => {
    // Don't update if the data hasn't actually changed
    const currentData = stepData[currentStep.id];
    if (currentData && JSON.stringify(currentData) === JSON.stringify(availability)) {
      return;
    }
    
    // Debounce the update to prevent rapid successive calls
    setTimeout(() => {
      dispatch(updateStepData({ 
        stepId: currentStep.id, 
        data: availability 
      }));
    }, 200);
  }, [dispatch, currentStep.id, stepData]);

  const renderStepContent = () => {
    switch (currentStep.component) {
      case 'ServiceConfigForm':
        return (
          <ServiceConfigForm
            bookingType={bookingType}
            pricingModel={pricingModel}
            config={stepData[currentStep.id] || {}}
            onConfigChange={handleConfigChange}
            onNext={() => {
              const currentConfig = stepData[currentStep.id] || {};
              handleStepComplete(currentConfig);
            }}
            onBack={handleStepBack}
            isValidating={isValidating}
          />
        );
      
      case 'SlotAvailabilityPicker':
      case 'EventSchedulePicker':
      case 'RecurringSchedulePicker':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{currentStep.title}</CardTitle>
                <p className="text-muted-foreground">{currentStep.description}</p>
              </CardHeader>
              <CardContent>
                <AvailabilityPicker
                  mode={availabilityMode as 'slot-selection' | 'recurring-calendar' | 'auto-scheduling' | 'collective-sync' | 'custom-mapping'}
                  onAvailabilityChange={handleAvailabilityChange}
                  bookingType={bookingType.key}
                  maxCapacity={stepData['service-setup']?.capacity}
                />
                <div className="flex justify-between items-center mt-6">
                  <Button variant="outline" onClick={handleStepBack}>
                    Back
                  </Button>
                  <Button 
                    onClick={() => {
                      const availabilityData = stepData[currentStep.id];
                      if (availabilityData && availabilityData.slots && availabilityData.slots.length > 0) {
                        handleStepComplete(availabilityData);
                      } else {
                        toast.error('Please set up your availability before continuing');
                      }
                    }}
                    disabled={isValidating}
                  >
                    {isValidating ? 'Processing...' : 'Continue to Advanced Settings'}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'AdvancedConfigStep':
        return (
          <AdvancedConfig
            bookingType={bookingType}
            pricingModel={pricingModel}
            onNext={() => {
              const currentConfig = stepData[currentStep.id] || {};
              handleStepComplete(currentConfig);
            }}
            onBack={handleStepBack}
          />
        );

      case 'ServiceSummaryStep':
        return (
          <ServiceSummaryStep
            bookingType={bookingType}
            pricingModel={pricingModel}
            serviceConfig={stepData['service-setup'] || {}}
            availabilityData={stepData['availability'] || stepData['slots'] || {}}
            advancedConfig={stepData['advanced-config'] || {}}
            onSubmit={() => {
              handleStepComplete({ published: true, timestamp: new Date().toISOString() });
            }}
            onBack={handleStepBack}
            onEdit={handleEditStep}
          />
        );
      
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>{currentStep.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{currentStep.description}</p>
              {currentStep.microcopy && (
                <div className="p-3 bg-muted/50 rounded-lg mb-4">
                  <p className="text-sm">{currentStep.microcopy}</p>
                </div>
              )}
              <div className="flex gap-4">
                <Button variant="outline" onClick={handleStepBack}>
                  Back
                </Button>
                <Button 
                  onClick={() => handleStepComplete({ completed: true, timestamp: new Date().toISOString() })}
                  disabled={isValidating}
                >
                  {isValidating ? 'Processing...' : 'Continue'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <motion.div
      key={currentStepIndex}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {renderStepContent()}
    </motion.div>
  );
};

export default WorkflowStepRenderer;
