// client/src/utils/date.utils.ts

/**
 * Returns a date string (YYYY-MM-DD) relative to the user's local timezone.
 * This ensures the 'streak' logic matches the user's wall-clock time, not UTC.
 */
export const getLocalDateString = (date: Date = new Date()): string => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().split('T')[0];
};

/**
 * Generates an array of date strings for the past N days (including today).
 */
export const getPastDates = (days: number): string[] => {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(getLocalDateString(d));
  }
  return dates;
};

/**
 * Format a date string (YYYY-MM-DD) into a human-readable format (e.g., "Feb 14").
 */
export const formatReadableDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
};