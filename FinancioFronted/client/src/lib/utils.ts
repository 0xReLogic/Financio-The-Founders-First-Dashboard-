import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Color mapping for category colors
export const COLOR_MAP: Record<string, string> = {
  green: '#65a30d',
  yellow: '#facc15',
  blue: '#3b82f6',
  purple: '#a855f7',
  pink: '#ec4899',
  orange: '#f97316',
  red: '#dc2626',
  cyan: '#06b6d4',
  emerald: '#10b981',
  indigo: '#6366f1',
  lime: '#84cc16',
  teal: '#14b8a6',
  amber: '#f59e0b',
  rose: '#f43f5e',
};

/**
 * Convert color name to hex code
 * @param color - Color name or hex code
 * @returns Hex color code
 */
export function getColorHex(color: string): string {
  // If already a hex code, return as is
  if (color.startsWith('#')) return color;
  
  // Convert color name to lowercase and get from map
  const hexColor = COLOR_MAP[color.toLowerCase()];
  
  // Return mapped color or default gray if not found
  return hexColor || '#6b7280';
}
