'use client'

import { useEffect } from 'react'

export type ToastType = 'error' | 'warning' | 'info' | 'success'

interface ToastProps {
  type: ToastType
  message: string
  onClose: () => void
  duration?: number
  id?: string
}

export function Toast({
  type,
  message,
  onClose,
  duration = 5000,
  id
}: ToastProps) {
  // Auto-dismiss after duration
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  // Get styling based on type
  const getTypeStyles = () => {
    switch (type) {
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: '❌'
        }
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          icon: '⚠️'
        }
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          icon: '✅'
        }
      case 'info':
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: 'ℹ️'
        }
    }
  }

  const styles = getTypeStyles()

  return (
    <div
      className={`fixed top-4 right-4 z-50 animate-slide-in-right max-w-sm w-full sm:w-auto`}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className={`${styles.bg} border ${styles.border} rounded-lg p-4 shadow-lg`}>
        <div className="flex items-start">
          <span className="flex-shrink-0 text-lg mr-3" aria-hidden="true">
            {styles.icon}
          </span>
          <div className="flex-1">
            <p className={`text-sm font-medium ${styles.text}`}>
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`flex-shrink-0 ml-3 ${styles.text} hover:opacity-70 transition-opacity`}
            aria-label="Dismiss notification"
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// Toast container for managing multiple toasts
interface ToastContainerProps {
  toasts: Array<{
    id: string
    type: ToastType
    message: string
    duration?: number
  }>
  onClose: (id: string) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            transform: `translateY(${index * 10}px)`,
            opacity: 1 - index * 0.1
          }}
        >
          <Toast
            {...toast}
            onClose={() => onClose(toast.id)}
          />
        </div>
      ))}
    </div>
  )
}