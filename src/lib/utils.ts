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
