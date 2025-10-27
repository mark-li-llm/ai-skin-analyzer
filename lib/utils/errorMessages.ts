/**
 * Error message utilities and mappings
 */

import type { ApiError, ApiErrorCode } from '@/types/analysis'

/**
 * Map error codes to user-friendly messages
 */
export const ERROR_MESSAGES: Record<ApiErrorCode, string> = {
  InvalidImage: 'Please upload a valid image file',
  FileTooLarge: 'File must be under 5MB',
  UnsupportedType: 'Only JPEG and PNG files are supported',
  OpenAIError: 'Analysis failed. Please try again',
  Timeout: 'Request timed out. Please try again',
  RateLimited: 'Too many requests. Please try again later'
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: ApiError | ApiErrorCode | unknown): string {
  // Handle ApiError object
  if (error && typeof error === 'object' && 'error' in error) {
    const apiError = error as ApiError
    return ERROR_MESSAGES[apiError.error] || apiError.message || 'An error occurred'
  }

  // Handle ApiErrorCode string
  if (typeof error === 'string' && error in ERROR_MESSAGES) {
    return ERROR_MESSAGES[error as ApiErrorCode]
  }

  // Handle generic errors
  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred'
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: ApiError | ApiErrorCode): boolean {
  const retryableErrors: ApiErrorCode[] = ['OpenAIError', 'Timeout']

  if (typeof error === 'string') {
    return retryableErrors.includes(error)
  }

  return retryableErrors.includes(error.error)
}