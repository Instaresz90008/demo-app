
import { useState, useEffect } from "react";
import { addWeeks, startOfWeek, isAfter, isBefore, isSameDay } from "date-fns";

interface Week {
  id: number;
  startDate: Date;
  days: { [key: string]: boolean };
}

export const useWeeksData = (weekCount: number = 4) => {
  // Initialize weeks with default values
  const initializeWeeks = (startDate: Date = new Date()): Week[] => {
    // Make sure startDate begins at midnight for consistent comparisons
    const normalizedStartDate = new Date(startDate);
    normalizedStartDate.setHours(0, 0, 0, 0);
    
    return Array.from({ length: weekCount }, (_, index) => {
      const weekStartDate = startOfWeek(addWeeks(normalizedStartDate, index), { weekStartsOn: 1 });
      
      // Create days object with dates as keys
      const days: { [key: string]: boolean } = {};
      for (let i = 0; i < 7; i++) {
        const date = new Date(weekStartDate);
        date.setDate(weekStartDate.getDate() + i);
        
        // Only include days that are on or after the startDate
        if (isAfter(date, normalizedStartDate) || isSameDay(date, normalizedStartDate)) {
          const dateStr = date.toISOString().split('T')[0];
          days[dateStr] = false;
        }
      }
      
      return {
        id: index + 1,
        startDate: weekStartDate,
        days
      };
    });
  };

  const [weeks, setWeeks] = useState<Week[]>(initializeWeeks());
  
  // Function to regenerate weeks based on a new start date
  const regenerateWeeks = (startDate: Date = new Date()) => {
    setWeeks(initializeWeeks(startDate));
  };
  
  // Effect to handle persistence
  useEffect(() => {
    try {
      const savedWeeks = localStorage.getItem('selectedWeeks');
      if (savedWeeks) {
        // Parse the saved weeks, but recreate Date objects
        const parsedWeeks = JSON.parse(savedWeeks, (key, value) => {
          if (key === 'startDate') {
            return new Date(value);
          }
          return value;
        });
        setWeeks(parsedWeeks);
      }
    } catch (error) {
      console.error('Error loading weeks from localStorage:', error);
    }
  }, []);
  
  // Save weeks to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('selectedWeeks', JSON.stringify(weeks));
    } catch (error) {
      console.error('Error saving weeks to localStorage:', error);
    }
  }, [weeks]);

  return {
    weeks,
    setWeeks,
    regenerateWeeks
  };
};
