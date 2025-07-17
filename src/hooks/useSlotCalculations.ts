
import { useMemo } from 'react';

interface UseSlotCalculationsProps {
  startTime: string;
  endTime: string;
  duration: string;
  selectedDays: string[];
}

export const useSlotCalculations = ({
  startTime,
  endTime,
  duration,
  selectedDays
}: UseSlotCalculationsProps) => {
  
  const calculateTotalSlots = useMemo(() => {
    return () => {
      // If there are no selected days, return 0
      if (selectedDays.length === 0) return 0;
      
      // Parse the duration to get number of minutes
      const durationMinutes = parseInt(duration.match(/\d+/)?.[0] || "30");
      
      // Parse start and end times to calculate total minutes
      let startHour = parseInt(startTime.split(':')[0]);
      const startMinute = parseInt(startTime.split(':')[1].split(' ')[0]);
      const startPeriod = startTime.split(' ')[1]?.toUpperCase();
      
      let endHour = parseInt(endTime.split(':')[0]);
      const endMinute = parseInt(endTime.split(':')[1].split(' ')[0]);
      const endPeriod = endTime.split(' ')[1]?.toUpperCase();
      
      // Convert to 24-hour format if needed
      if (startPeriod === 'PM' && startHour < 12) startHour += 12;
      if (startPeriod === 'AM' && startHour === 12) startHour = 0;
      if (endPeriod === 'PM' && endHour < 12) endHour += 12;
      if (endPeriod === 'AM' && endHour === 12) endHour = 0;
      
      // Calculate total minutes
      const totalMinutes = ((endHour - startHour) * 60) + (endMinute - startMinute);
      
      // Calculate slots per day and total slots
      const slotsPerDay = Math.floor(totalMinutes / durationMinutes);
      return slotsPerDay * selectedDays.length;
    };
  }, [startTime, endTime, duration, selectedDays]);
  
  return {
    calculateTotalSlots
  };
};
