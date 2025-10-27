'use client'

import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import { validateFile, formatFileSize, ALLOWED_EXTENSIONS } from '@/lib/utils'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  isDisabled: boolean
  isAnalyzing: boolean
}

export function FileUpload({
  onFileSelect,
  isDisabled,
  isAnalyzing
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    // Clear previous error
    setError(null)

    // Validate file
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    // Set file name and trigger analysis
    setSelectedFileName(file.name)
    onFileSelect(file)
  }

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isDisabled && !isAnalyzing) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (isDisabled || isAnalyzing) return

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleButtonClick = () => {
    if (!isDisabled && !isAnalyzing) {
      fileInputRef.current?.click()
    }
  }

  // Determine the current state
  const getStateStyles = () => {
    if (isAnalyzing) {
      return 'border-blue-300 bg-blue-50 cursor-wait'
    }
    if (isDisabled) {
      return 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
    }
    if (isDragging) {
      return 'border-blue-400 bg-blue-50 scale-[1.02]'
    }
    if (error) {
      return 'border-red-300 bg-red-50'
    }
    return 'border-gray-300 hover:border-gray-400 cursor-pointer'
  }

  return (
    <div className="mt-6">
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8
          transition-all duration-200 ease-in-out
          ${getStateStyles()}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_EXTENSIONS.join(',')}
          onChange={handleFileInput}
          className="hidden"
          disabled={isDisabled || isAnalyzing}
          aria-label="Choose file to upload"
        />

        <div className="text-center">
          {/* Icon */}
          <svg
            className={`mx-auto h-12 w-12 ${
              error ? 'text-red-400' : 'text-gray-400'
            }`}
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Main text */}
          {isAnalyzing ? (
            <p className="mt-2 text-sm font-medium text-blue-600">
              Preparing image for analysis...
            </p>
          ) : selectedFileName ? (
            <p className="mt-2 text-sm font-medium text-gray-900">
              Selected: {selectedFileName}
            </p>
          ) : (
            <>
              <p className="mt-2 text-sm font-medium text-gray-900">
                {isDragging
                  ? 'Drop your photo here'
                  : isDisabled
                  ? 'Please accept the disclaimer first'
                  : 'Drop a photo here, or click to select'}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                JPEG or PNG, up to 5MB
              </p>
            </>
          )}

          {/* Error message */}
          {error && (
            <p className="mt-2 text-sm text-red-600 font-medium">
              {error}
            </p>
          )}

          {/* Upload button */}
          {!isAnalyzing && (
            <button
              type="button"
              onClick={handleButtonClick}
              disabled={isDisabled}
              className={`
                mt-4 px-4 py-2 rounded-md font-medium text-sm
                transition-colors duration-200
                ${
                  isDisabled
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                }
              `}
            >
              {isDisabled
                ? 'Accept Disclaimer to Upload'
                : selectedFileName
                ? 'Choose Another Photo'
                : 'Choose Photo'}
            </button>
          )}
        </div>

        {/* Tooltip for disabled state */}
        {isDisabled && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 hover:opacity-100 transition-opacity">
              Please accept the disclaimer below to continue
            </div>
          </div>
        )}
      </div>

      {/* File requirements reminder */}
      <div className="mt-3 text-xs text-gray-500">
        <p className="font-medium">Best results with:</p>
        <ul className="mt-1 list-disc list-inside space-y-0.5">
          <li>Clear, well-lit photo of your face</li>
          <li>Natural lighting preferred</li>
          <li>No filters or heavy makeup</li>
        </ul>
      </div>
    </div>
  )
}
