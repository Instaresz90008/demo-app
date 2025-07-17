
import React from 'react';
import AvailabilityPicker from './AvailabilityPicker';

interface EnhancedAvailabilityPickerProps {
  mode: 'slot-selection' | 'recurring-calendar' | 'auto-scheduling' | 'collective-sync' | 'custom-mapping';
  onAvailabilityChange: (availability: any) => void;
  bookingType: string;
  maxCapacity?: number;
}

const EnhancedAvailabilityPicker: React.FC<EnhancedAvailabilityPickerProps> = (props) => {
  return <AvailabilityPicker {...props} />;
};

export default EnhancedAvailabilityPicker;
