import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// In a real application, this would be more robust and handle dynamic routes.
// For this mock, it simply returns a path based on the page name.
export function createPageUrl(pageName) {
  switch (pageName) {
    case 'Home':
      return '/';
    case 'Dashboard':
      return '/dashboard';
    case 'Admin':
      return '/admin';
    case 'Certificate':
      return '/certificate';
    default:
      return '/';
  }
}