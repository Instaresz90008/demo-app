
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  nextStep,
  previousStep,
  completeOnboarding,
  createServiceFromOnboarding,
  resetOnboarding,
} from "@/store/slices/onboardingSlice";
import { useToast } from "@/hooks/use-toast";
import UserIntentStep from "./steps/UserIntentStep";
import BusinessComplianceStep from "./steps/BusinessComplianceStep";
import GuidedDiscoveryStep from "./steps/GuidedDiscoveryStep";
import TemplateRecommendationStep from "./steps/TemplateRecommendationStep";
import ServiceDetailsStep from "./steps/ServiceDetailsStep";
import PricingStep from "./steps/PricingStep";
import SlotCreationStep from "./steps/SlotCreationStep";
import PreviewStep from "./steps/PreviewStep";
import BookingLinkStep from "./steps/BookingLinkStep";
import CompletionStep from "./steps/CompletionStep";

interface Props {
  onComplete: () => void;
}

const OnboardingWorkflow: React.FC<Props> = ({ onComplete }) => {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.onboarding);
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleNext = () => {
    dispatch(nextStep());
  };

  const handlePrevious = () => {
    dispatch(previousStep());
  };

  const handleComplete = async () => {
    try {
      // Create the service first
      const resultAction = await dispatch(createServiceFromOnboarding(data));
      
      if (createServiceFromOnboarding.fulfilled.match(resultAction)) {
        // Then complete the onboarding
        await dispatch(completeOnboarding(data));
        
        toast({
          title: "Success! 🎉",
          description: "Your service has been created and is ready for bookings!",
        });
        
        onComplete();
      } else {
        throw new Error('Failed to create service');
      }
    } catch (error) {
      console.error('Onboarding completion error:', error);
      toast({
        title: "Error",
        description: "Failed to complete setup. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderStep = () => {
    switch (data.currentStep) {
      case 1:
        return <UserIntentStep />;
      case 2:
        return (
          <BusinessComplianceStep />
        );
      case 3:
        return (
          <GuidedDiscoveryStep />
        );
      case 4:
        return (
          <TemplateRecommendationStep />
        );
      case 5:
        return (
          <ServiceDetailsStep
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 6:
        return (
          <PricingStep onNext={handleNext} onPrevious={handlePrevious} />
        );
      case 7:
        return (
          <SlotCreationStep 
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 8:
        return (
          <PreviewStep onNext={handleNext} onPrevious={handlePrevious} />
        );
      case 9:
        return (
          <BookingLinkStep onNext={handleNext} onPrevious={handlePrevious} />
        );
      case 10:
        return (
          <CompletionStep
            values={data}
            onComplete={handleComplete}
            onPrevious={handlePrevious}
          />
        );
      default:
        return <UserIntentStep />;
    }
  };

  // Show loading state during service creation
  if (loading && data.currentStep === 10) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <h3 className="text-lg font-semibold">Creating your service...</h3>
          <p className="text-muted-foreground">This will just take a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{data.currentStep}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Setup Progress
                  </span>
                  <div className="text-xs text-muted-foreground">
                    Step {data.currentStep} of 10
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 mx-8">
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${(data.currentStep / 10) * 100}%` }}
                />
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-medium text-primary">
                {Math.round((data.currentStep / 10) * 100)}%
              </span>
              <div className="text-xs text-muted-foreground">
                Complete
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content with top padding for fixed header */}
      <div className="pt-20 animate-fade-in">
        {renderStep()}
      </div>
    </div>
  );
};

export default OnboardingWorkflow;
