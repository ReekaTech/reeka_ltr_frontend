import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string to a more readable format
 * @param dateString - ISO date string
 * @returns Formatted date (DD-MM-YYYY)
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date
      .toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      .replace(/\//g, '-');
  } catch (error) {
    return 'Invalid date';
  }
}
