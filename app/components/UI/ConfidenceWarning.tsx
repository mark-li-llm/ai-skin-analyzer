'use client'

interface ConfidenceWarningProps {
  confidence?: number
  className?: string
}

export function ConfidenceWarning({
  confidence,
  className = ''
}: ConfidenceWarningProps) {
  const confidencePercent = confidence ? Math.round(confidence * 100) : 0

  return (
    <div className={`bg-yellow-50 border-l-4 border-yellow-400 p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <span className="text-2xl" aria-hidden="true">⚠️</span>
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            <strong>Low confidence result</strong>
            {confidence && (
              <span className="ml-1">
                ({confidencePercent}% confidence)
              </span>
            )}
          </p>
          <p className="mt-1 text-sm text-yellow-600">
            The analysis may not be accurate. Consider taking a clearer photo in good lighting for better results.
          </p>
          <div className="mt-2">
            <details className="text-sm text-yellow-600">
              <summary className="cursor-pointer hover:text-yellow-700">
                Tips for better results
              </summary>
              <ul className="mt-2 ml-4 list-disc space-y-1">
                <li>Use natural daylight or bright, even lighting</li>
                <li>Ensure your face is clearly visible</li>
                <li>Avoid shadows or harsh lighting</li>
                <li>Keep the camera steady</li>
                <li>Clean your camera lens</li>
              </ul>
            </details>
          </div>
        </div>
      </div>
    </div>
  )
}