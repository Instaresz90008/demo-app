
import { useState } from "react";
import { format, parseISO, addMinutes } from "date-fns";
import { Event } from "../types";

export function useDraggableEvents(
  events: Event[], 
  onEventUpdate?: (updatedEvent: Event) => void
) {
  const [isDragging, setIsDragging] = useState(false);
  
  // Calculate new event times based on drop coordinates
  const calculateNewEventTimes = (event: Event, dropHour: number, dropDate: Date) => {
    const startTime = parseISO(event.start);
    const endTime = parseISO(event.end);
    const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60); // in minutes
    
    // Create new date with the drop date and hour
    const newStartDate = new Date(dropDate);
    newStartDate.setHours(dropHour);
    newStartDate.setMinutes(0);
    
    // Calculate new end date based on duration
    const newEndDate = addMinutes(newStartDate, duration);
    
    return {
      start: newStartDate.toISOString(),
      end: newEndDate.toISOString()
    };
  };

  // Handle event drop
  const handleEventDrop = (event: Event, dropHour: number, dropDate: Date) => {
    if (!onEventUpdate) return;
    
    const { start, end } = calculateNewEventTimes(event, dropHour, dropDate);
    
    const updatedEvent = {
      ...event,
      start,
      end
    };
    
    onEventUpdate(updatedEvent);
  };
  
  return {
    isDragging,
    setIsDragging,
    handleEventDrop
  };
}
