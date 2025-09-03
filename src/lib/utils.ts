import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes safely
 * Combines clsx and tailwind-merge for optimal class handling
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format phone number for display
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
}

/**
 * Format email for display (truncate if too long)
 */
export function formatEmail(email: string, maxLength = 30): string {
  if (email.length <= maxLength) return email;
  const [name, domain] = email.split('@');
  if (!name) {
    return email;
  }
  const truncatedName = name.length > 15 ? `${name.slice(0, 15)}...` : name;
  return `${truncatedName}@${domain}`;
}

/**
 * Generate consistent color for strings (useful for avatars, etc)
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    'bg-brand-gray-500',
    'bg-brand-green-500', 
    'bg-brand-blue-500',
    'bg-red-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-brand-emerald-500',
    'bg-teal-500',
  ];
  
  return colors[Math.abs(hash) % colors.length]!;
}

/**
 * Debounce function for search and input handlers
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for scroll and resize handlers
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastRan = 0;
  
  return function executedFunction(...args: Parameters<T>) {
    if (Date.now() - lastRan >= limit) {
      func(...args);
      lastRan = Date.now();
    }
  };
}

/**
 * Safe localStorage access with fallback
 */
export const storage = {
  get: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('Failed to access localStorage:', error);
      return null;
    }
  },
  
  set: (key: string, value: string): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn('Failed to set localStorage:', error);
      return false;
    }
  },
  
  remove: (key: string): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
      return false;
    }
  },
};

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (error) {
    console.warn('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Format date for Brazilian locale
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };
  
  return new Intl.DateTimeFormat('pt-BR', options || defaultOptions).format(dateObj);
}

/**
 * Generate URL-friendly slug from string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Validate Brazilian CPF
 */
export function validateCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length !== 11) return false;
  if (/^(.)\1*$/.test(cleaned)) return false; // All same digits
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  
  let checkDigit = (sum * 10) % 11;
  if (checkDigit === 10 || checkDigit === 11) checkDigit = 0;
  if (checkDigit !== parseInt(cleaned.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  
  checkDigit = (sum * 10) % 11;
  if (checkDigit === 10 || checkDigit === 11) checkDigit = 0;
  if (checkDigit !== parseInt(cleaned.charAt(10))) return false;
  
  return true;
}

/**
 * Validate Brazilian CNPJ
 */
export function validateCNPJ(cnpj: string): boolean {
  const cleaned = cnpj.replace(/\D/g, '');
  
  if (cleaned.length !== 14) return false;
  if (/^(.)\1*$/.test(cleaned)) return false; // All same digits
  
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleaned.charAt(i)) * weights1[i]!;
  }
  
  let checkDigit1 = sum % 11;
  checkDigit1 = checkDigit1 < 2 ? 0 : 11 - checkDigit1;
  
  if (checkDigit1 !== parseInt(cleaned.charAt(12))) return false;
  
  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleaned.charAt(i)) * weights2[i]!;
  }
  
  let checkDigit2 = sum % 11;
  checkDigit2 = checkDigit2 < 2 ? 0 : 11 - checkDigit2;
  
  if (checkDigit2 !== parseInt(cleaned.charAt(13))) return false;
  
  return true;
}

/**
 * Get initials from name for avatars
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Check if device is mobile
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

/**
 * Smooth scroll to element
 */
export function scrollToElement(elementId: string, offset = 0): void {
  if (typeof window === 'undefined') return;
  
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = elementPosition - offset;
  
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  });
}