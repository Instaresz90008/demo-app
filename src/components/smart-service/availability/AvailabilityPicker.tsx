
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateStepData } from '@/store/slices/workflowSlice';
import SlotSummary from './SlotSummary';

interface AvailabilityPickerProps {
  mode: 'slot-selection' | 'recurring-calendar' | 'auto-scheduling' | 'collective-sync' | 'custom-mapping';
  onAvailabilityChange: (availability: any) => void;
  bookingType: string;
  maxCapacity?: number;
}

const AvailabilityPicker: React.FC<AvailabilityPickerProps> = ({
  mode,
  onAvailabilityChange,
  bookingType,
  maxCapacity
}) => {
  const dispatch = useAppDispatch();
  const [generatedSlots, setGeneratedSlots] = useState<any[]>([]);
  const [showSummary, setShowSummary] = useState(false);

  // Mock slot generation for demo
  const generateMockSlots = () => {
    const slots = [];
    const startDate = new Date();
    
    // Generate slots for next 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      // Skip weekends for business services
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      // Generate 4-8 slots per day
      const slotsPerDay = 4 + Math.floor(Math.random() * 5);
      for (let j = 0; j < slotsPerDay; j++) {
        const startHour = 9 + j * 2; // Start from 9 AM, 2 hour intervals
        const endHour = startHour + 1; // 1 hour slots
        
        if (startHour >= 17) break; // Stop at 5 PM
        
        slots.push({
          id: `slot-${i}-${j}`,
          date: date.toISOString().split('T')[0],
          startTime: `${startHour.toString().padStart(2, '0')}:00`,
          endTime: `${endHour.toString().padStart(2, '0')}:00`,
          isAvailable: true
        });
      }
    }
    
    return slots;
  };

  const handleGenerateSlots = () => {
    const slots = generateMockSlots();
    setGeneratedSlots(slots);
    setShowSummary(true);
    
    // Update the workflow data
    const availabilityData = {
      slots,
      mode,
      bookingType,
      totalSlots: slots.length,
      dateRange: {
        start: slots[0]?.date,
        end: slots[slots.length - 1]?.date
      }
    };
    
    onAvailabilityChange(availabilityData);
  };

  const handleContinue = () => {
    // This will be handled by the parent component
    console.log('Continue with generated slots:', generatedSlots.length);
  };

  if (showSummary && generatedSlots.length > 0) {
    return (
      <SlotSummary
        slots={generatedSlots}
        onContinue={handleContinue}
        onBack={() => setShowSummary(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Smart Availability Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Configure your availability for {bookingType} sessions
              {maxCapacity && ` (max ${maxCapacity} participants)`}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Service Type</h4>
                <p className="text-sm text-muted-foreground capitalize">{bookingType}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Mode</h4>
                <p className="text-sm text-muted-foreground capitalize">
                  {mode.replace('-', ' ')}
                </p>
              </div>
            </div>
            
            <Button onClick={handleGenerateSlots} size="lg" className="w-full md:w-auto">
              Generate Smart Availability
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AvailabilityPicker;
