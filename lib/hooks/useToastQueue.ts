import { useState, useCallback, useEffect } from 'react'

export type ToastType = 'error' | 'warning' | 'info' | 'success'

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface UseToastQueueOptions {
  maxToasts?: number
  defaultDuration?: number
}

/**
 * Hook for managing a queue of toast notifications
 */
export function useToastQueue(options: UseToastQueueOptions = {}) {
  const { maxToasts = 3, defaultDuration = 5000 } = options
  const [toasts, setToasts] = useState<Toast[]>([])

  // Add a new toast to the queue
  const addToast = useCallback(
    (type: ToastType, message: string, duration?: number) => {
      const id = Date.now().toString()
      const newToast: Toast = {
        id,
        type,
        message,
        duration: duration || defaultDuration
      }

      setToasts(prev => {
        // Limit the number of toasts
        const updated = [...prev, newToast]
        return updated.slice(-maxToasts)
      })

      return id
    },
    [defaultDuration, maxToasts]
  )

  // Remove a toast by ID
  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  // Clear all toasts
  const clearToasts = useCallback(() => {
    setToasts([])
  }, [])

  // Helper methods for different toast types
  const showError = useCallback(
    (message: string, duration?: number) => addToast('error', message, duration),
    [addToast]
  )

  const showWarning = useCallback(
    (message: string, duration?: number) => addToast('warning', message, duration),
    [addToast]
  )

  const showInfo = useCallback(
    (message: string, duration?: number) => addToast('info', message, duration),
    [addToast]
  )

  const showSuccess = useCallback(
    (message: string, duration?: number) => addToast('success', message, duration),
    [addToast]
  )

  // Auto-remove toasts after their duration
  useEffect(() => {
    const timers: NodeJS.Timeout[] = []

    toasts.forEach(toast => {
      if (toast.duration && toast.duration > 0) {
        const timer = setTimeout(() => {
          removeToast(toast.id)
        }, toast.duration)
        timers.push(timer)
      }
    })

    return () => {
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [toasts, removeToast])

  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    showError,
    showWarning,
    showInfo,
    showSuccess
  }
}