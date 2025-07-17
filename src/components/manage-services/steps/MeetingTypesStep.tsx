
import React, { useState, useEffect } from "react";
import MeetingTypeSelection from "./MeetingTypeSelection";
import { CreateServiceFormValues } from "../CreateServiceWorkflow";
import { MeetingTypeConfig } from "../types/meetingTypes";

interface Props {
  values: CreateServiceFormValues;
  onChange: (fields: Partial<CreateServiceFormValues>) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const MeetingTypesStep: React.FC<Props> = ({
  values,
  onChange,
  onPrevious,
  onNext,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [collectPayment, setCollectPayment] = useState(
    values.additionalSettings?.collectPayment ?? true
  );
  const [meetingTypes, setMeetingTypes] = useState<MeetingTypeConfig[]>(() => {
    // Initialize from existing data or create default
    if (values.additionalSettings?.meetingTypesConfig?.length) {
      return values.additionalSettings.meetingTypesConfig.map(config => ({
        id: config.id,
        enabled: config.enabled,
        price: config.price || "",
        meetingLink: config.meetingLink || "",
        location: config.location || "",
        phoneNumber: config.phoneNumber || "",
        maxParticipants: config.maxParticipants || "10",
        
        parkingAvailable: config.parkingAvailable || false,
        meetingPasscode: config.meetingPasscode || "",
        bridgeNumber: config.bridgeNumber || "",
        refreshments: config.refreshments || ""
      }));
    }
    
    return [
      { 
        id: "video", 
        enabled: false, 
        price: "", 
        meetingLink: "", 
        location: "", 
        phoneNumber: "", 
        maxParticipants: "10", 
        parkingAvailable: false,
        meetingPasscode: "",
        bridgeNumber: "",
        refreshments: ""
      },
      { 
        id: "phone", 
        enabled: false, 
        price: "", 
        meetingLink: "", 
        location: "", 
        phoneNumber: "", 
        maxParticipants: "5", 
        parkingAvailable: false,
        meetingPasscode: "",
        bridgeNumber: "",
        refreshments: ""
      },
      { 
        id: "in-person", 
        enabled: false, 
        price: "", 
        meetingLink: "", 
        location: "", 
        phoneNumber: "", 
        maxParticipants: "8", 
        parkingAvailable: true,
        meetingPasscode: "",
        bridgeNumber: "",
        refreshments: ""
      },
    ];
  });
  
  const { duration } = values;

  const handleDurationChange = (newDuration: string) => {
    onChange({ duration: newDuration });
    if (errors.duration) {
      setErrors(prev => ({ ...prev, duration: "" }));
    }
  };

  const handlePaymentToggle = (enabled: boolean) => {
    setCollectPayment(enabled);
    onChange({
      additionalSettings: {
        ...values.additionalSettings,
        collectPayment: enabled
      }
    });
  };

  const handleToggleMeetingType = (typeId: string) => {
    const updatedTypes = meetingTypes.map(type => 
      type.id === typeId ? { ...type, enabled: !type.enabled } : type
    );
    setMeetingTypes(updatedTypes);
    
    if (errors.meetingTypes) {
      setErrors(prev => ({ ...prev, meetingTypes: "" }));
    }
  };

  const handleConfigureType = (typeId: string) => {
    // This will be handled by the MeetingTypeSelection component
    console.log('Configure type:', typeId);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!duration || parseInt(duration) < 5) {
      newErrors.duration = "Duration must be at least 5 minutes";
    }
    
    const enabledTypes = meetingTypes.filter(type => type.enabled);
    if (enabledTypes.length === 0) {
      newErrors.meetingTypes = "Please select at least one meeting type";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateForm()) {
      return;
    }

    const enabledTypes = meetingTypes.filter(type => type.enabled);
    const primaryType = enabledTypes[0];
    
    onChange({
      meetingType: primaryType?.id || "video",
      price: collectPayment ? primaryType?.price || "0" : "0",
      meetingLink: primaryType?.meetingLink || "",
      additionalSettings: {
        ...values.additionalSettings,
        collectPayment,
        meetingTypesConfig: enabledTypes
      }
    });
    
    onNext();
  };

  return (
    <MeetingTypeSelection
      duration={duration}
      collectPayment={collectPayment}
      meetingTypes={meetingTypes}
      errors={errors}
      values={values}
      onDurationChange={handleDurationChange}
      onPaymentToggle={handlePaymentToggle}
      onToggleMeetingType={handleToggleMeetingType}
      onConfigureType={handleConfigureType}
      onPrevious={onPrevious}
      onNext={handleNext}
    />
  );
};

export default MeetingTypesStep;
