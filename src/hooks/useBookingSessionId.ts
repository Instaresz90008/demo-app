
import { useMemo } from 'react';

export const useBookingSessionId = () => {
  const bookingSessionId = useMemo(() => {
    // Use crypto.randomUUID() for modern browsers, fallback to nanoid-style generation
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    
    // Fallback for older browsers - better than Math.random()
    return 'xxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }, []);

  return bookingSessionId;
};
