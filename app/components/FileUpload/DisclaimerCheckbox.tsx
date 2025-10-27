'use client'

interface DisclaimerCheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  isLoading?: boolean
}

export function DisclaimerCheckbox({
  checked,
  onChange,
  isLoading = false
}: DisclaimerCheckboxProps) {
  // Show loading skeleton during hydration
  if (isLoading) {
    return (
      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="flex items-start gap-3">
          <div className="mt-1 w-4 h-4 bg-gray-200 animate-pulse rounded" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
            <div className="h-4 bg-gray-200 animate-pulse rounded w-full" />
            <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500 cursor-pointer"
          aria-describedby="disclaimer-text"
        />
        <div className="flex-1">
          <span
            id="disclaimer-text"
            className="text-sm text-gray-700 leading-relaxed select-none"
          >
            I understand this analysis is for <strong>informational purposes only</strong> and not medical advice.
            Results are AI-generated and may not be accurate.
            Please consult a dermatologist for professional advice.
          </span>
          <div className="mt-2">
            <details className="text-xs text-gray-600">
              <summary className="cursor-pointer hover:text-gray-700">
                Learn more about AI skin analysis
              </summary>
              <div className="mt-2 p-2 bg-white rounded border border-yellow-100">
                <p className="mb-1">
                  This tool uses computer vision to analyze skin characteristics from photos.
                  While it can provide helpful insights, it cannot replace professional medical evaluation.
                </p>
                <p>
                  Factors like lighting, camera quality, and image clarity can affect results.
                  Always seek professional medical advice for skin concerns.
                </p>
              </div>
            </details>
          </div>
        </div>
      </label>
    </div>
  )
}