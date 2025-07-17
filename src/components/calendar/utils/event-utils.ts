
import { parseISO, isSameDay, format } from "date-fns";
import { Event, Service } from "../types";

// Format the time label (e.g., "9 AM")
export const formatTimeLabel = (hour: number): string => {
  if (hour === 0) return '12 AM';
  if (hour === 12) return '12 PM';
  return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
};

// Get status color
export const getStatusColor = (status: string): string => {
  switch (status) {
    case "scheduled": return "bg-blue-100 text-blue-800 border-blue-300";
    case "completed": return "bg-green-100 text-green-800 border-green-300";
    case "cancelled": return "bg-red-100 text-red-800 border-red-300";
    case "no-show": return "bg-amber-100 text-amber-800 border-amber-300";
    default: return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

// Get events for a specific date
export const getEventsForDate = (events: Event[], date: Date): Event[] => {
  return events.filter(event => {
    const eventDate = parseISO(event.start);
    return isSameDay(eventDate, date);
  });
};

// Get events for a specific date and time slot
export const getEventsForTimeSlot = (events: Event[], date: Date, hour: number): Event[] => {
  return events.filter(event => {
    const eventStart = parseISO(event.start);
    const eventEnd = parseISO(event.end);
    
    // Check if this event falls within this hour
    return (
      isSameDay(eventStart, date) && 
      (eventStart.getHours() === hour || 
      (eventStart.getHours() < hour && eventEnd.getHours() > hour) ||
      (eventStart.getHours() < hour && hour < eventEnd.getHours()))
    );
  });
};

// Calculate the position and height of an event in the time grid
export const calculateEventPosition = (event: Event, colWidth: number = 100, colIndex: number = 0) => {
  const startTime = parseISO(event.start);
  const endTime = parseISO(event.end);
  
  const startHour = startTime.getHours();
  const startMinutes = startTime.getMinutes();
  const endHour = endTime.getHours();
  const endMinutes = endTime.getMinutes();
  
  // Calculate top position (60px per hour)
  const top = (startHour * 60) + startMinutes;
  
  // Calculate height (duration in minutes)
  const durationMinutes = ((endHour - startHour) * 60) + (endMinutes - startMinutes);
  
  return {
    top: `${top}px`,
    height: `${durationMinutes}px`,
    left: `${colIndex * colWidth}%`,
    width: `${colWidth}%`
  };
};
