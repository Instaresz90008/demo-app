
import { useState, useEffect } from "react";
import { addWeeks, startOfWeek, format, addDays, isBefore, isToday } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export interface DayRecord {
  [day: string]: boolean;
}

export interface SelectedDaysRecord {
  currentWeek: DayRecord;
  nextWeek: DayRecord;
}

export interface Template {
  id: string;
  name: string;
  days: {
    [day: string]: boolean;
  };
  startTime: string;
  endTime: string;
}

const templates = {
  regular: {
    id: "regular",
    name: "Regular Work Hours",
    days: {
      Monday: true,
      Tuesday: true,
      Wednesday: true,
      Thursday: true,
      Friday: true,
      Saturday: false,
      Sunday: false
    },
    startTime: "09:00 AM",
    endTime: "05:00 PM"
  },
  weekend: {
    id: "weekend",
    name: "Weekend Hours",
    days: {
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false,
      Saturday: true,
      Sunday: true
    },
    startTime: "10:00 AM",
    endTime: "04:00 PM"
  },
  evening: {
    id: "evening",
    name: "Evening Sessions",
    days: {
      Monday: true,
      Tuesday: true,
      Wednesday: true,
      Thursday: true,
      Friday: true,
      Saturday: false,
      Sunday: false
    },
    startTime: "06:00 PM",
    endTime: "09:00 PM"
  },
  morning: {
    id: "morning",
    name: "Morning Only",
    days: {
      Monday: true,
      Tuesday: true,
      Wednesday: true, 
      Thursday: true,
      Friday: true,
      Saturday: false,
      Sunday: false
    },
    startTime: "07:00 AM",
    endTime: "12:00 PM"
  }
};

// Map day names to their index in a week (0-based, Monday is 0)
const dayIndices: { [key: string]: number } = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5,
  Sunday: 6,
};

export const useWeekSelection = (
  initialSelectedDays: SelectedDaysRecord,
  onSelectedDaysChange: (days: SelectedDaysRecord) => void,
  initialStartTime?: string,
  onStartTimeChange?: (time: string) => void,
  initialEndTime?: string,
  onEndTimeChange?: (time: string) => void
) => {
  const { toast } = useToast();
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
  
  const [currentWeekStartDate, setCurrentWeekStartDate] = useState(() => {
    // Start week from Monday (1) instead of Sunday (0)
    return startOfWeek(new Date(), { weekStartsOn: 1 });
  });
  
  const [showCurrentWeek, setShowCurrentWeek] = useState(true);
  const [showNextWeek, setShowNextWeek] = useState(true);
  
  // Helper to check if a day is in the past
  const isDayInPast = (day: string): boolean => {
    const dayIndex = dayIndices[day];
    if (dayIndex === undefined) return false;
    
    // Calculate the date for this day
    const dayDate = addDays(currentWeekStartDate, dayIndex);
    
    return isBefore(dayDate, today) && !isToday(dayDate);
  };
  
  const handleDayToggle = (week: 'currentWeek' | 'nextWeek', day: string) => {
    // For current week, don't allow toggling past days
    if (week === 'currentWeek' && isDayInPast(day)) {
      return;
    }
    
    onSelectedDaysChange({
      ...initialSelectedDays,
      [week]: {
        ...initialSelectedDays[week],
        [day]: !initialSelectedDays[week][day],
      }
    });
  };
  
  const handleBothToggle = (day: string) => {
    // Don't allow toggling past days
    if (isDayInPast(day)) {
      return;
    }
    
    const currentState = initialSelectedDays.currentWeek[day] && initialSelectedDays.nextWeek[day];
    onSelectedDaysChange({
      currentWeek: { ...initialSelectedDays.currentWeek, [day]: !currentState },
      nextWeek: { ...initialSelectedDays.nextWeek, [day]: !currentState },
    });
  };

  const toggleWeekVisibility = (week: 'currentWeek' | 'nextWeek') => {
    if (week === 'currentWeek') {
      setShowCurrentWeek(!showCurrentWeek);
    } else {
      setShowNextWeek(!showNextWeek);
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeekStartDate(prev => 
      direction === 'next' ? addWeeks(prev, 1) : addWeeks(prev, -1)
    );
  };

  const applyTemplate = (templateId: string) => {
    const template = templates[templateId as keyof typeof templates];
    if (!template) return;
    
    // For current week, respect the current day constraint
    const currentWeekDays = { ...template.days };
    const orderedDayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    
    // Find today's day name and filter past days
    const todayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1; // Convert to 0-based Monday-start
    const todayName = orderedDayNames[todayIndex];
    
    // Set days before today to false for current week
    for (let i = 0; i < todayIndex; i++) {
      const dayName = orderedDayNames[i];
      currentWeekDays[dayName] = false;
    }
    
    onSelectedDaysChange({
      currentWeek: currentWeekDays,
      nextWeek: { ...template.days }
    });
    
    // Update times if the hooks are provided
    if (onStartTimeChange && template.startTime) {
      onStartTimeChange(template.startTime);
    }
    
    if (onEndTimeChange && template.endTime) {
      onEndTimeChange(template.endTime);
    }
    
    toast({
      title: "Template Applied",
      description: `Applied the ${template.name} template successfully.`
    });
  };

  const clearAllSelections = () => {
    onSelectedDaysChange({
      currentWeek: {
        Sunday: false,
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false,
        Saturday: false,
      },
      nextWeek: {
        Sunday: false,
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false,
        Saturday: false,
      }
    });

    toast({
      description: "All day selections have been cleared.",
    });
  };

  // Format the current week date display
  const formatCurrentWeekDisplay = () => {
    return `(${format(currentWeekStartDate, "MMM d")} - ${format(addDays(currentWeekStartDate, 6), "MMM d")})`;
  };

  // Format the next week date display
  const formatNextWeekDisplay = () => {
    const nextWeekStart = addWeeks(currentWeekStartDate, 1);
    return `(${format(nextWeekStart, "MMM d")} - ${format(addDays(nextWeekStart, 6), "MMM d")})`;
  };

  // Effect to adjust selected days when today changes or component mounts
  useEffect(() => {
    // Update selected days to ensure past days in current week are not selected
    const updatedCurrentWeek = { ...initialSelectedDays.currentWeek };
    
    Object.keys(updatedCurrentWeek).forEach(day => {
      if (isDayInPast(day)) {
        updatedCurrentWeek[day] = false;
      }
    });
    
    // Only update if there were changes
    const hasPastDaysSelected = Object.keys(updatedCurrentWeek).some(day => 
      isDayInPast(day) && initialSelectedDays.currentWeek[day]
    );
    
    if (hasPastDaysSelected) {
      onSelectedDaysChange({
        ...initialSelectedDays,
        currentWeek: updatedCurrentWeek
      });
    }
  }, [currentWeekStartDate]);

  return {
    currentWeekStartDate,
    showCurrentWeek,
    showNextWeek,
    handleDayToggle,
    handleBothToggle,
    toggleWeekVisibility,
    navigateWeek,
    clearAllSelections,
    applyTemplate,
    formatCurrentWeekDisplay,
    formatNextWeekDisplay
  };
};
