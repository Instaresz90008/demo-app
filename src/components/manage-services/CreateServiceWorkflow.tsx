import React, { useState } from "react";
import CreateServiceStepIndicator from "./CreateServiceStepIndicator";
import BasicInfoStep from "./steps/BasicInfoStep";
import MeetingTypesStep from "./steps/MeetingTypesStep";
import AdditionalSettingsStep from "./steps/AdditionalSettingsStep";
import SummaryStep from "./steps/SummaryStep";
import { MeetingTypeConfig, ServiceQuestion } from "./types/meetingTypes";

export interface CreateServiceFormValues {
  serviceName: string;
  description: string;
  serviceType: "one-to-one" | "one-to-many" | "group";
  meetingType: string;
  duration: string;
  price: string;
  meetingLink: string;
  additionalSettings: {
    bufferTime: string;
    maxAdvanceBooking: string;
    collectPayment?: boolean;
    meetingTypesConfig?: MeetingTypeConfig[];
    questions?: ServiceQuestion[];
  };
}

const defaultFormValues: CreateServiceFormValues = {
  serviceName: "",
  description: "",
  serviceType: "one-to-one",
  meetingType: "video",
  duration: "30",
  price: "50",
  meetingLink: "",
    additionalSettings: {
      bufferTime: "15",
      maxAdvanceBooking: "30",
      collectPayment: false,
      meetingTypesConfig: [],
      questions: []
    },
};

interface Props {
  onComplete: (data: CreateServiceFormValues) => void;
  onCancel: () => void;
  initialValues?: Partial<CreateServiceFormValues>;
}

const CreateServiceWorkflow: React.FC<Props> = ({ onComplete, onCancel, initialValues }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<CreateServiceFormValues>({
    ...defaultFormValues,
    ...initialValues,
    additionalSettings: {
      ...defaultFormValues.additionalSettings,
      ...(initialValues?.additionalSettings || {})
    }
  });
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const updateForm = (fields: Partial<CreateServiceFormValues>) => {
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

  const progressPercentage = Math.round(((step - 1) / 3) * 100);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <BasicInfoStep
            values={form}
            onChange={updateForm}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <MeetingTypesStep
            values={form}
            onChange={updateForm}
            onPrevious={prevStep}
            onNext={nextStep}
          />
        );
      case 3:
        return (
          <AdditionalSettingsStep
            values={form}
            onChange={updateForm}
            onPrevious={prevStep}
            onNext={nextStep}
          />
        );
      case 4:
        return (
          <SummaryStep
            values={form}
            onPrevious={prevStep}
            onSubmit={() => onComplete(form)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <CreateServiceStepIndicator
        step={step}
        onStepChange={goToStep}
        progressPercentage={progressPercentage}
        completedSteps={completedSteps}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default CreateServiceWorkflow;
