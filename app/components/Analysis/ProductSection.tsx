'use client'

import { ProductCard } from '@/app/components/UI'
import type { SpecificProduct } from '@/types/analysis'

interface ProductSectionProps {
  recommendation: {
    formulationType: string
    formulationReasoning: string
    specificProducts: SpecificProduct[]
  }
}

export function ProductSection({ recommendation }: ProductSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Recommended Sunscreen
      </h2>

      {/* Formulation Type */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {recommendation.formulationType}
          </span>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">
          {recommendation.formulationReasoning}
        </p>
      </div>

      {/* Product Recommendations */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          {recommendation.specificProducts.length === 1
            ? 'Recommended Product'
            : 'Recommended Products'}
        </h3>
        <div className="space-y-3">
          {recommendation.specificProducts.map((product, index) => (
            <ProductCard
              key={index}
              product={product}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Application tips */}
      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100">
        <h4 className="text-sm font-medium text-green-900 mb-2">
          Application Tips
        </h4>
        <ul className="space-y-1 text-sm text-green-800">
          <li className="flex items-start gap-2">
            <span className="mt-1">•</span>
            <span>Apply 15-30 minutes before sun exposure</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1">•</span>
            <span>Use about 1/4 teaspoon for face and neck</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1">•</span>
            <span>Reapply every 2 hours or after swimming/sweating</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1">•</span>
            <span>Don't forget often-missed areas: ears, lips, and around eyes</span>
          </li>
        </ul>
      </div>

      {/* Disclaimer */}
      <p className="mt-4 text-xs text-gray-500 italic">
        Product recommendations are based on your analyzed skin type.
        Individual results may vary. Always patch test new products.
      </p>
    </div>
  )
}