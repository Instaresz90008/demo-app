
import { useState, useEffect } from 'react';

interface BookingPreferences {
  timezone: string;
  countryCode: string;
  preferredTimes: string[];
  name?: string;
  email?: string;
}

interface SmartBookingState {
  preferences: BookingPreferences;
  recentBookings: number;
  popularTimes: string[];
  isReturningUser: boolean;
  suggestedAlternatives: string[];
}

export const useSmartBooking = () => {
  const [smartState, setSmartState] = useState<SmartBookingState>({
    preferences: {
      timezone: 'America/Los_Angeles',
      countryCode: '+1',
      preferredTimes: []
    },
    recentBookings: 0,
    popularTimes: ['09:00 AM', '10:00 AM', '02:00 PM'],
    isReturningUser: false,
    suggestedAlternatives: []
  });

  // Auto-detect timezone and location
  useEffect(() => {
    const detectUserPreferences = () => {
      // Detect timezone
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      // Detect country from timezone for phone code
      const countryMap: Record<string, string> = {
        'America/New_York': '+1',
        'America/Chicago': '+1',
        'America/Denver': '+1',
        'America/Los_Angeles': '+1',
        'Europe/London': '+44',
        'Europe/Paris': '+33',
        'Europe/Berlin': '+49',
        'Asia/Tokyo': '+81'
      };
      
      const countryCode = countryMap[userTimezone] || '+1';

      // Load saved preferences
      const savedPrefs = localStorage.getItem('jusbook_preferences');
      const isReturning = localStorage.getItem('jusbook_returning_user') === 'true';
      
      let preferences = { timezone: userTimezone, countryCode, preferredTimes: [] };
      
      if (savedPrefs) {
        try {
          preferences = { ...preferences, ...JSON.parse(savedPrefs) };
        } catch (e) {
          console.log('Error loading preferences');
        }
      }

      setSmartState(prev => ({
        ...prev,
        preferences,
        isReturningUser: isReturning,
        recentBookings: isReturning ? Math.floor(Math.random() * 15) + 3 : 0
      }));
    };

    detectUserPreferences();
  }, []);

  const savePreferences = (newPrefs: Partial<BookingPreferences>) => {
    const updatedPrefs = { ...smartState.preferences, ...newPrefs };
    setSmartState(prev => ({ ...prev, preferences: updatedPrefs }));
    localStorage.setItem('jusbook_preferences', JSON.stringify(updatedPrefs));
    localStorage.setItem('jusbook_returning_user', 'true');
  };

  const getSuggestedTimes = (selectedDate: Date | undefined) => {
    if (!selectedDate) return [];
    
    const dayOfWeek = selectedDate.getDay();
    
    // Business logic for popular times based on day
    if (dayOfWeek === 1 || dayOfWeek === 2) { // Monday/Tuesday
      return ['09:00 AM', '10:00 AM', '11:00 AM'];
    } else if (dayOfWeek === 5) { // Friday
      return ['10:00 AM', '02:00 PM', '03:00 PM'];
    }
    
    return smartState.popularTimes;
  };

  return {
    ...smartState,
    savePreferences,
    getSuggestedTimes
  };
};
