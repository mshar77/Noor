import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format numbers to Arabic numerals
export function formatArabicNumber(num: number): string {
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/[0-9]/g, (d) => arabicNumbers[parseInt(d)]);
}

// Fallback image helper
export function getFallbackImage(keyword: string) {
  return `https://images.unsplash.com/photo-${keyword}?auto=format&fit=crop&q=80&w=800&h=600`;
}
