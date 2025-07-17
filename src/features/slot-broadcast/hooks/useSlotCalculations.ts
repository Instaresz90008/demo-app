
interface SlotCalculationParams {
  startTime: string;
  endTime: string;
  duration: string;
  selectedDays: string[];
}

export const useSlotCalculations = ({ startTime, endTime, duration, selectedDays }: SlotCalculationParams) => {
  const calculateTotalSlots = () => {
    if (!startTime || !endTime || !duration || selectedDays.length === 0) {
      return 0;
    }

    // Parse time strings
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    // Calculate total minutes
    const startTotalMin = startHour * 60 + startMin;
    const endTotalMin = endHour * 60 + endMin;
    const totalMinutes = endTotalMin - startTotalMin;
    
    // Parse duration
    const durationMinutes = parseInt(duration.replace(/\D/g, ''));
    
    // Calculate slots per day
    const slotsPerDay = Math.floor(totalMinutes / durationMinutes);
    
    // Total slots across all selected days
    return slotsPerDay * selectedDays.length;
  };

  return {
    calculateTotalSlots
  };
};
