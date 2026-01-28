import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Full date formatter with weekday e.g., "Nov 27, 2025 (Thu)"
export const formatFullDate = (dateString: string): string => {
  const date = new Date(dateString)

  const monthDayYear = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  const weekday = date.toLocaleDateString("en-US", {
    weekday: "short",
  })

  return `${monthDayYear} (${weekday})`
}

/**
 * Format a date into "Month day, year" (e.g. January 16, 2026).
 */
export function formatMonthDayYear(date: string | Date): string {
  return format(new Date(date), "MMMM d, yyyy");
}

// Example usage:
// (formatMonthDayYear("2026-01-16")); 
// → "January 16, 2026"


// 12-hour formatter
export const formatDisplayTime = (time: string): string => {
  const [hours, minutes] = time.split(":")
  const date = new Date()
  date.setHours(parseInt(hours, 10))
  date.setMinutes(parseInt(minutes, 10))
  date.setSeconds(0)

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}
