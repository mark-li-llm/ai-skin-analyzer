/**
 * Safe localStorage utilities with SSR compatibility
 */

/**
 * Safely get item from localStorage (SSR-safe)
 */
export function getLocalStorageItem(key: string): string | null {
  if (typeof window === 'undefined') return null

  try {
    return window.localStorage.getItem(key)
  } catch (error) {
    console.warn(`localStorage.getItem("${key}") failed:`, error)
    return null
  }
}

/**
 * Safely set item in localStorage (SSR-safe)
 */
export function setLocalStorageItem(key: string, value: string): boolean {
  if (typeof window === 'undefined') return false

  try {
    window.localStorage.setItem(key, value)
    return true
  } catch (error) {
    console.warn(`localStorage.setItem("${key}") failed:`, error)
    return false
  }
}

/**
 * Safely remove item from localStorage (SSR-safe)
 */
export function removeLocalStorageItem(key: string): boolean {
  if (typeof window === 'undefined') return false

  try {
    window.localStorage.removeItem(key)
    return true
  } catch (error) {
    console.warn(`localStorage.removeItem("${key}") failed:`, error)
    return false
  }
}

/**
 * Check if localStorage is available
 */
export function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false

  try {
    const testKey = '__localStorage_test__'
    window.localStorage.setItem(testKey, 'test')
    window.localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}