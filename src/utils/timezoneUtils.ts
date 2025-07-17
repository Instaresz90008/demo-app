
import { format } from 'date-fns';

// Get user's current timezone
export const getUserTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.warn('Unable to detect timezone, falling back to UTC');
    return 'UTC';
  }
};

// Common timezones for selection
export const COMMON_TIMEZONES = [
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'UTC', label: 'UTC' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Central European Time' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time' }
];

// Format time with timezone
export const formatTimeWithTimezone = (date: Date, timezone: string): string => {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  } catch (error) {
    console.warn(`Invalid timezone: ${timezone}, falling back to local time`);
    return format(date, 'h:mm a');
  }
};

// Get timezone offset in hours
export const getTimezoneOffset = (timezone: string): number => {
  try {
    const now = new Date();
    const utc = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
    const targetTime = new Intl.DateTimeFormat('en', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).formatToParts(utc);
    
    const targetDate = new Date(
      parseInt(targetTime.find(part => part.type === 'year')?.value || '0'),
      parseInt(targetTime.find(part => part.type === 'month')?.value || '1') - 1,
      parseInt(targetTime.find(part => part.type === 'day')?.value || '1'),
      parseInt(targetTime.find(part => part.type === 'hour')?.value || '0'),
      parseInt(targetTime.find(part => part.type === 'minute')?.value || '0'),
      parseInt(targetTime.find(part => part.type === 'second')?.value || '0')
    );
    
    return (targetDate.getTime() - utc.getTime()) / (1000 * 60 * 60);
  } catch (error) {
    console.warn(`Error calculating timezone offset for ${timezone}`);
    return 0;
  }
};
