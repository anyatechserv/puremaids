import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`;
}

export function formatPhone(phone: string): string {
  return phone.replace(/(\d{5})(\d{6})/, '$1 $2');
}
