'use client'

interface LoadingSpinnerProps {
  fullScreen?: boolean
  message?: string
}

export function LoadingSpinner({
  fullScreen = true,
  message = 'Analyzing your skin...'
}: LoadingSpinnerProps) {
  const containerClass = fullScreen
    ? 'fixed inset-0 bg-black/50 flex items-center justify-center z-50'
    : 'flex items-center justify-center p-8'

  return (
    <div className={containerClass}>
      <div className="bg-white rounded-lg p-8 flex flex-col items-center shadow-xl">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-300 absolute inset-0 animation-delay-150"></div>
        </div>
        <p className="mt-4 text-gray-700 font-medium">{message}</p>
        <p className="text-sm text-gray-500 mt-1">This may take a moment...</p>
      </div>
    </div>
  )
}