'use client'

import type { SkinAnalysisResult } from '@/types/analysis'
import { ConfidenceWarning } from '@/app/components/UI'
import { SkinTypeSection } from './SkinTypeSection'
import { AnalysisSection } from './AnalysisSection'
import { ProductSection } from './ProductSection'

interface AnalysisResultsProps {
  results: SkinAnalysisResult
  onReset: () => void
}

export function AnalysisResults({ results, onReset }: AnalysisResultsProps) {
  const hasLowConfidence = results.confidence < 0.5

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Low confidence warning if needed */}
      {hasLowConfidence && (
        <ConfidenceWarning
          confidence={results.confidence}
          className="animate-fade-in"
        />
      )}

      {/* Section 1: Skin Type */}
      <SkinTypeSection
        skinType={results.skinType}
        confidence={results.confidence}
      />

      {/* Section 2: Analysis */}
      <AnalysisSection analysis={results.analysis} />

      {/* Section 3: Products */}
      <ProductSection recommendation={results.productRecommendation} />

      {/* Additional Notes */}
      {results.additionalNotes && (
        <div
          className="p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fade-in"
          style={{ animationDelay: '300ms' }}
        >
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {results.additionalNotes}
          </p>
        </div>
      )}

      {/* Actions */}
      <div
        className="flex flex-col sm:flex-row gap-3 pt-4 animate-fade-in"
        style={{ animationDelay: '400ms' }}
      >
        <button
          onClick={onReset}
          className="flex-1 sm:flex-initial px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Analyze Another Photo
        </button>
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.print()
            }
          }}
          className="flex-1 sm:flex-initial px-6 py-3 bg-gray-100 text-gray-700 rounded-md font-medium hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Print Results
        </button>
      </div>

      {/* Final disclaimer */}
      <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-xs text-yellow-800">
          <strong>Remember:</strong> This AI-powered analysis is for informational purposes only.
          For medical concerns or professional skincare advice, please consult a licensed dermatologist.
          Results are based on image analysis and may not account for all skin conditions or concerns.
        </p>
      </div>
    </div>
  )
}