'use client'

import type { SkinType } from '@/types/analysis'

interface SkinTypeSectionProps {
  skinType: SkinType
  confidence: number
}

export function SkinTypeSection({ skinType, confidence }: SkinTypeSectionProps) {
  // Get confidence color and styling
  const getConfidenceStyles = () => {
    if (confidence >= 0.8) {
      return {
        color: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-200',
        label: 'High Confidence'
      }
    }
    if (confidence >= 0.5) {
      return {
        color: 'text-yellow-600',
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        label: 'Moderate Confidence'
      }
    }
    return {
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      label: 'Low Confidence'
    }
  }

  const styles = getConfidenceStyles()
  const confidencePercent = Math.round(confidence * 100)

  // Skin type descriptions
  const skinTypeDescriptions: Record<SkinType, string> = {
    oily: 'Produces excess sebum, prone to shine and enlarged pores',
    dry: 'Lacks moisture, may feel tight or flaky',
    combination: 'Oily in some areas (T-zone) and dry in others',
    normal: 'Well-balanced, neither too oily nor too dry',
    sensitive: 'Easily irritated, prone to redness and reactions'
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Your Skin Type</h2>
        <div className={`flex items-center gap-2`}>
          <span className={`text-sm font-medium ${styles.color}`}>
            {styles.label}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Main skin type display */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900 capitalize">
                {skinType}
              </span>
              <span className="text-lg text-gray-500">Skin</span>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              {skinTypeDescriptions[skinType]}
            </p>
          </div>

          {/* Confidence badge */}
          <div className="ml-6">
            <div
              className={`
                flex flex-col items-center justify-center
                px-4 py-3 rounded-lg border
                ${styles.bg} ${styles.border}
              `}
            >
              <span className={`text-2xl font-bold ${styles.color}`}>
                {confidencePercent}%
              </span>
              <span className={`text-xs ${styles.color}`}>
                confidence
              </span>
            </div>
          </div>
        </div>

        {/* Visual confidence indicator */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Analysis Confidence</span>
            <span>{confidencePercent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                confidence >= 0.8
                  ? 'bg-green-500'
                  : confidence >= 0.5
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${confidencePercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}