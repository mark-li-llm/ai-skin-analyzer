/**
 * File validation utilities
 */

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
export const ALLOWED_TYPES = ['image/jpeg', 'image/png']
export const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png']

/**
 * Validate file size and type
 */
export function validateFile(file: File): string | null {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return 'File must be under 5MB'
  }

  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    // Fallback to extension check if MIME type is not set
    const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return 'Only JPEG and PNG files are supported'
    }
  }

  return null // File is valid
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Get file extension
 */
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2)
}

/**
 * Check if file is an image based on extension
 */
export function isImageFile(filename: string): boolean {
  const ext = '.' + getFileExtension(filename).toLowerCase()
  return ALLOWED_EXTENSIONS.includes(ext)
}