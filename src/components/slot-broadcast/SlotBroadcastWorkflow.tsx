import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import SlotBroadcastStepIndicator from "./SlotBroadcastStepIndicator";
import ServiceSelectionStep from "./steps/ServiceSelectionStep";
import DateSelectionStep from "./steps/DateSelectionStep";
import AdvancedConfigStep from "./steps/AdvancedConfigStep";
import ConfirmationStep from "./steps/ConfirmationStep";

export interface SlotBroadcastFormValues {
  // Step 1: Service Selection
  selectedService: string;
  title: string;
  description: string;
  duration: string;
  quickTimeTemplate: string;
  
  // Step 2: Date Selection
  selectedDates: Date[];
  timeSlots: string[];
  dateTemplate: string;
  
  // Step 3: Advanced Configuration
  maxBookingsPerSlot: string;
  bufferTime: string;
  reminderSettings: {
    enabled: boolean;
    reminderTime: string;
  };
  notificationSettings: {
    email: boolean;
    sms: boolean;
    calendar: boolean;
  };
  
  // Step 4: Confirmation & Link Generation
  bookingLink: string;
  tags: string[];
}

const defaultFormValues: SlotBroadcastFormValues = {
  selectedService: "",
  title: "",
  description: "",
  duration: "30",
  quickTimeTemplate: "",
  selectedDates: [],
  timeSlots: [],
  dateTemplate: "",
  maxBookingsPerSlot: "1",
  bufferTime: "15",
  reminderSettings: {
    enabled: true,
    reminderTime: "24"
  },
  notificationSettings: {
    email: true,
    sms: false,
    calendar: true
  },
  bookingLink: "",
  tags: []
};

interface Props {
  onComplete: (data: SlotBroadcastFormValues) => void;
  onCancel: () => void;
  initialValues?: Partial<SlotBroadcastFormValues>;
}

const STORAGE_KEY = 'slot-broadcast-draft';

const SlotBroadcastWorkflow: React.FC<Props> = ({ onComplete, onCancel, initialValues }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<SlotBroadcastFormValues>({
    ...defaultFormValues,
    ...initialValues,
  });
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Load persisted data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData && !initialValues) {
      try {
        const parsedData = JSON.parse(savedData);
        // Parse dates back from ISO strings
        if (parsedData.selectedDates) {
          parsedData.selectedDates = parsedData.selectedDates.map((date: string) => new Date(date));
        }
        setForm(prev => ({ ...prev, ...parsedData }));
      } catch (error) {
        console.error('Failed to load saved slot broadcast data:', error);
      }
    }
  }, [initialValues]);

  // Save data to localStorage whenever form changes
  useEffect(() => {
    const dataToSave = {
      ...form,
      // Convert dates to ISO strings for storage
      selectedDates: form.selectedDates.map(date => date.toISOString())
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [form]);

  const updateForm = (fields: Partial<SlotBroadcastFormValues>) => {
    setForm(prev => ({ ...prev, ...fields }));
  };

  const markStepCompleted = (stepNumber: number) => {
    setCompletedSteps(prev => 
      prev.includes(stepNumber) ? prev : [...prev, stepNumber]
    );
  };

  const goToStep = (stepNumber: number) => {
    setStep(stepNumber);
  };

  const nextStep = () => {
    markStepCompleted(step);
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = (data: SlotBroadcastFormValues) => {
    // Clear saved data on successful completion
    localStorage.removeItem(STORAGE_KEY);
    onComplete(data);
  };

  const handleCancel = () => {
    // Clear saved data on cancel
    localStorage.removeItem(STORAGE_KEY);
    onCancel();
  };

  const progressPercentage = Math.round(((step - 1) / 3) * 100);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <ServiceSelectionStep
            values={form}
            onChange={updateForm}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <DateSelectionStep
            values={form}
            onChange={updateForm}
            onPrevious={prevStep}
            onNext={nextStep}
          />
        );
      case 3:
        return (
          <AdvancedConfigStep
            values={form}
            onChange={updateForm}
            onPrevious={prevStep}
            onNext={nextStep}
          />
        );
      case 4:
        return (
          <ConfirmationStep
            values={form}
            onPrevious={prevStep}
            onSubmit={() => handleComplete(form)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-gradient-to-br from-background via-background to-muted/10 dark:to-card/5">
      <SlotBroadcastStepIndicator
        step={step}
        onStepChange={goToStep}
        progressPercentage={progressPercentage}
        completedSteps={completedSteps}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {renderStep()}
        </div>
        
        <div className="border-t border-border bg-background p-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <Button
              onClick={handleCancel}
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
            >
              Cancel & Exit
            </Button>
            <div className="text-sm text-muted-foreground">
              Progress automatically saved
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotBroadcastWorkflow;
