import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateRange(start: string, end: string | null | undefined): string {
  if (!start) return '';
  const startDate = format(parseISO(start), 'MMM yyyy');
  const endDate = end ? format(parseISO(end), 'MMM yyyy') : 'Present';
  return `${startDate} - ${endDate}`;
}
