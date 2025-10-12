import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export const formatters = {
  currency: (value: number, locale = 'ko-KR', currency = 'KRW') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(value)
  },

  date: (date: Date | string, locale = 'ko-KR') => {
    return new Intl.DateTimeFormat(locale).format(new Date(date))
  },

  dateTime: (date: Date | string, locale = 'ko-KR') => {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date))
  },

  compactNumber: (value: number, locale = 'ko-KR') => {
    return new Intl.NumberFormat(locale, {
      notation: 'compact',
      compactDisplay: 'short',
    }).format(value)
  },
}

export function generateId(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

    
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array))
}

    
export function camelCaseKeys(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((v) => camelCaseKeys(v))
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [key.replace(/([-_][a-z])/gi, ($1) =>
          $1.toUpperCase().replace('-', '').replace('_', '')
        )]: camelCaseKeys(obj[key]),
      }),
      {}
    )
  }
  return obj
}

    
export function snakeCaseKeys(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((v) => snakeCaseKeys(v))
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [key.replace(/([A-Z])/g, ($1) => `_${$1.toLowerCase()}`)]: snakeCaseKeys(
          obj[key]
        ),
      }),
      {}
    )
  }
  return obj
}