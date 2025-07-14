import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string to a more readable format
 * @param dateString - ISO date string
 * @returns Formatted date (e.g. "30 April, 2025")
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return format(date, 'd MMMM, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

/**
 * Available date range options for filtering data
 */
export type DateRangeOption = 
  | 'last_7_days'
  | 'last_30_days'
  | 'last_90_days'
  | 'this_month'
  | 'this_year'
  | 'custom_date_range';

/**
 * Date range interface with start and end dates
 */
export interface DateRange {
  startDate: Date;
  endDate: Date;
}

/**
 * Get start and end dates based on a predefined date range option
 * @param option - The date range option to calculate dates for
 * @returns Object containing startDate and endDate
 * 
 * @example
 * ```typescript
 * const { startDate, endDate } = getDateRangeOption('last_30_days');
 * console.log(startDate); // Date object for 30 days ago
 * console.log(endDate);   // Date object for today
 * ```
 */
export function getDateRangeOption(option: DateRangeOption): DateRange {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  switch (option) {
    case 'last_7_days':
      return {
        startDate: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
        endDate: today
      };
    
    case 'last_30_days':
      return {
        startDate: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
        endDate: today
      };
    
    case 'last_90_days':
      return {
        startDate: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000),
        endDate: today
      };
    
    case 'this_month':
      return {
        startDate: new Date(now.getFullYear(), now.getMonth(), 1),
        endDate: today
      };
    
    case 'this_year':
      return {
        startDate: new Date(now.getFullYear(), 0, 1),
        endDate: new Date(now.getFullYear(), 11, 31)
      };
    
    default:
      return {
        startDate: new Date(now.getFullYear(), 0, 1),
        endDate: new Date(now.getFullYear(), 11, 31)
      };
  }
}

/**
 * Get the display label for a date range option
 * @param option - The date range option
 * @returns Human-readable label for the option
 * 
 * @example
 * ```typescript
 * const label = getDateRangeLabel('last_30_days');
 * console.log(label); // "Last 30 days"
 * ```
 */
export function getDateRangeLabel(option: DateRangeOption): string {
  switch (option) {
    case 'last_7_days':
      return 'Last 7 days';
    case 'last_30_days':
      return 'Last 30 days';
    case 'last_90_days':
      return 'Last 90 days';
    case 'this_month':
      return 'This Month';
    case 'this_year':
      return 'This Year';
    case 'custom_date_range':
      return 'Custom Date Range';
    default:
      return 'This Year';
  }
}
