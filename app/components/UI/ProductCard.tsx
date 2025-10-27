'use client'

import type { SpecificProduct } from '@/types/analysis'

interface ProductCardProps {
  product: SpecificProduct
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <div
      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
      style={{
        animationDelay: `${index * 100}ms`
      }}
    >
      <div className="space-y-2">
        {/* Brand Name */}
        <h4 className="font-bold text-lg text-gray-900">
          {product.brandName}
        </h4>

        {/* Product Name */}
        <p className="text-gray-700 font-medium">
          {product.productName}
        </p>

        {/* SPF Badge and Key Benefit */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-3">
          <span className="inline-flex items-center justify-center bg-yellow-100 px-3 py-1 rounded-full text-sm font-semibold text-yellow-800 whitespace-nowrap">
            {product.spf}
          </span>
          <span className="text-sm text-gray-600 leading-relaxed">
            {product.keyBenefit}
          </span>
        </div>

        {/* Optional recommended badge for first product */}
        {index === 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <span className="inline-flex items-center text-xs text-green-700 font-medium">
              <svg
                className="w-3 h-3 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Top Recommendation
            </span>
          </div>
        )}
      </div>
    </div>
  )
}