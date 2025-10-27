'use client'

interface AnalysisSectionProps {
  analysis: {
    observedCharacteristics: string[]
    skinTypeExplanation: string
  }
}

export function AnalysisSection({ analysis }: AnalysisSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Skin Analysis</h2>

      {/* Skin Type Explanation */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Assessment</h3>
        <p className="text-gray-600 leading-relaxed">
          {analysis.skinTypeExplanation}
        </p>
      </div>

      {/* Observed Characteristics */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Observed Characteristics
        </h3>
        <ul className="space-y-2">
          {analysis.observedCharacteristics.map((characteristic, index) => (
            <li
              key={index}
              className="flex items-start gap-3 animate-slide-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="flex-shrink-0 mt-0.5">
                <svg
                  className="w-4 h-4 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <span className="text-gray-600 text-sm leading-relaxed">
                {characteristic}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Additional insights section */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex items-start gap-2">
          <span className="text-blue-600">
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <div className="flex-1">
            <p className="text-sm text-blue-800 font-medium">Tip</p>
            <p className="text-sm text-blue-700 mt-1">
              Understanding your skin type helps you choose products that work best for your unique needs.
              Remember that skin type can change with seasons, age, and lifestyle factors.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}