import type { SkinAnalysisResult, ApiError, ApiErrorCode } from '@/types/analysis'

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === '1'
const API_TIMEOUT = 60000 // 60 seconds

/**
 * Analyze skin from uploaded image file
 */
export async function analyzeSkin(file: File): Promise<SkinAnalysisResult> {
  if (USE_MOCKS) {
    return analyzeSkinMock(file)
  }

  return analyzeSkinAPI(file)
}

/**
 * Mock implementation for development
 */
async function analyzeSkinMock(file: File): Promise<SkinAnalysisResult> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Simulate validation errors
  if (file.size > 5 * 1024 * 1024) {
    throw { error: 'FileTooLarge' } as ApiError
  }

  if (!['image/jpeg', 'image/png'].includes(file.type)) {
    throw { error: 'UnsupportedType' } as ApiError
  }

  // Randomly return success or error for testing (20% error rate)
  if (Math.random() > 0.8) {
    const errors: ApiErrorCode[] = ['OpenAIError', 'Timeout', 'RateLimited']
    const randomError = errors[Math.floor(Math.random() * errors.length)]
    throw { error: randomError } as ApiError
  }

  // Fetch mock data from public directory
  try {
    const response = await fetch('/mocks/analysis-success.json')
    if (!response.ok) {
      throw new Error('Failed to load mock data')
    }
    const data = await response.json()
    return data as SkinAnalysisResult
  } catch (error) {
    console.error('Failed to load mock data:', error)
    // Return a fallback mock response
    return {
      skinType: 'combination',
      confidence: 0.75,
      analysis: {
        observedCharacteristics: [
          'Oily T-zone (forehead and nose)',
          'Dry cheeks',
          'Visible pores in center of face',
          'Occasional shine'
        ],
        skinTypeExplanation: 'Your skin shows characteristics of combination skin, with both oily and dry areas.'
      },
      productRecommendation: {
        formulationType: 'Lightweight Broad-Spectrum SPF 30+',
        formulationReasoning: 'A balanced formula that hydrates dry areas without adding excess oil to the T-zone.',
        specificProducts: [
          {
            brandName: 'La Roche-Posay',
            productName: 'Anthelios Ultra-Light Fluid SPF 50+',
            spf: 'SPF 50+',
            keyBenefit: 'Ultra-light, non-greasy formula perfect for combination skin'
          }
        ]
      },
      additionalNotes: 'Consider using a mattifying primer on your T-zone before applying sunscreen for all-day shine control.'
    }
  }
}

/**
 * Real API implementation
 */
async function analyzeSkinAPI(file: File): Promise<SkinAnalysisResult> {
  const formData = new FormData()
  formData.append('file', file)

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

  try {
    const response = await fetch('/api/analyze-skin', {
      method: 'POST',
      body: formData,
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const error = await response.json()
      throw error
    }

    return await response.json()
  } catch (error) {
    clearTimeout(timeoutId)

    // Handle abort/timeout
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw { error: 'Timeout', message: 'Request timed out after 60 seconds' } as ApiError
    }

    // Re-throw API errors
    if (error && typeof error === 'object' && 'error' in error) {
      throw error
    }

    // Handle network errors
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw { error: 'OpenAIError', message: 'Network error. Please check your connection.' } as ApiError
    }

    // Generic error fallback
    throw { error: 'OpenAIError', message: 'An unexpected error occurred' } as ApiError
  }
}

/**
 * Helper to check if we're in mock mode
 */
export function isMockMode(): boolean {
  return USE_MOCKS
}