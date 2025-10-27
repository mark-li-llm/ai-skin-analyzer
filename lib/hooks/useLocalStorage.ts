import { useState, useEffect, useCallback } from 'react'

/**
 * SSR-safe localStorage hook with proper hydration handling
 *
 * @param key - localStorage key
 * @param initialValue - initial value (used on server and before hydration)
 * @returns [value, setValue, isLoaded] - value, setter, and loading state
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  // Start with consistent initial value for SSR
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isLoaded, setIsLoaded] = useState(false)

  // Client-side only: Load actual value from localStorage
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item !== null) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
    } finally {
      setIsLoaded(true)
    }
  }, [key])

  // Safe setter with error handling
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      setStoredValue(prev => {
        const newValue = value instanceof Function ? value(prev) : value
        // Only try to save to localStorage if window is available
        if (typeof window !== 'undefined') {
          try {
            window.localStorage.setItem(key, JSON.stringify(newValue))
          } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error)
            // Still update in-memory state even if localStorage fails
          }
        }
        return newValue
      })
    } catch (error) {
      console.warn(`Error updating state for key "${key}":`, error)
      // If state update fails, try setting directly
      const finalValue = value instanceof Function ? value : value
      setStoredValue(finalValue as T)
    }
  }, [key])

  return [storedValue, setValue, isLoaded]
}

/**
 * SSR-safe localStorage hook for boolean values
 * Simplified version for checkbox states
 */
export function useLocalStorageBoolean(
  key: string,
  initialValue: boolean = false
): [boolean, (value: boolean) => void, boolean] {
  const [value, setValue, isLoaded] = useLocalStorage(key, initialValue)

  const setBooleanValue = useCallback((newValue: boolean) => {
    setValue(newValue)
  }, [setValue])

  return [value, setBooleanValue, isLoaded]
}