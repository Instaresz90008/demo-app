
import { addDays, addMonths, endOfMonth, format, startOfMonth, startOfWeek, subMonths } from "date-fns";
import { CalendarView } from "../types";

// Generate time slots for day/week views
export const getTimeSlots = (): number[] => {
  // Create 24 hour slots (0-23)
  return Array.from({ length: 24 }, (_, i) => i);
};

// Generate days for the current view
export const getDaysToDisplay = (currentDate: Date, currentView: CalendarView): Date[] => {
  if (currentView === "day") {
    return [currentDate];
  } else if (currentView === "week") {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  } else {
    // Month view
    const firstDay = startOfMonth(currentDate);
    const firstDayOfWeek = firstDay.getDay();
    const daysInPrevMonth = firstDayOfWeek;
    
    const lastDay = endOfMonth(currentDate);
    const daysInMonth = lastDay.getDate();
    
    const daysInNextMonth = 42 - (daysInPrevMonth + daysInMonth);
    
    const days = [];
    
    // Add days from previous month
    for (let i = daysInPrevMonth - 1; i >= 0; i--) {
      days.push(addDays(firstDay, -i - 1));
    }
    
    // Add days from current month
    for (let i = 0; i < daysInMonth; i++) {
      days.push(addDays(firstDay, i));
    }
    
    // Add days from next month
    for (let i = 0; i < daysInNextMonth; i++) {
      days.push(addDays(lastDay, i + 1));
    }
    
    return days;
  }
};

// Navigation functions
export const goToPrevious = (currentDate: Date, currentView: CalendarView, setCurrentDate: React.Dispatch<React.SetStateAction<Date>>) => {
  if (currentView === "day") {
    setCurrentDate(prev => addDays(prev, -1));
  } else if (currentView === "week") {
    setCurrentDate(prev => addDays(prev, -7));
  } else {
    setCurrentDate(prev => subMonths(prev, 1));
  }
};

export const goToNext = (currentDate: Date, currentView: CalendarView, setCurrentDate: React.Dispatch<React.SetStateAction<Date>>) => {
  if (currentView === "day") {
    setCurrentDate(prev => addDays(prev, 1));
  } else if (currentView === "week") {
    setCurrentDate(prev => addDays(prev, 7));
  } else {
    setCurrentDate(prev => addMonths(prev, 1));
  }
};
