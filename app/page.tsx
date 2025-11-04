'use client'

import { useState, useEffect } from 'react'
import type { SkinAnalysisResult, ApiError } from '@/types/analysis'
import { FileUpload, DisclaimerCheckbox } from '@/app/components/FileUpload'
import { AnalysisResults } from '@/app/components/Analysis'
import { LoadingSpinner, Toast } from '@/app/components/UI'
import { analyzeSkin, isMockMode } from '@/lib/api/skinAnalysis'
import { getErrorMessage } from '@/lib/utils'
import { useLocalStorageBoolean, useLocalStorage } from '@/lib/hooks'

export default function Home() {
  // State management
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<SkinAnalysisResult | null>(null)
  const [error, setError] = useState<ApiError | null>(null)

  // SSR-safe localStorage for disclaimer
  const [disclaimerAccepted, setDisclaimerAccepted, isLoaded] = useLocalStorageBoolean(
    'ai-skin-analyzer-disclaimer-accepted',
    false
  )

  // User identification with localStorage persistence
  const [userName, setUserName, isUserNameLoaded] = useLocalStorage<string>(
    'ai-skin-analyzer-user-name',
    ''
  )

  // Store anonymous ID in localStorage for persistence
  const [anonId, setAnonId, isAnonIdLoaded] = useLocalStorage<string>(
    'ai-skin-analyzer-anon-id',
    ''
  )

  // Generate anonymous ID if needed (only once)
  const getUserIdentifier = () => {
    if (userName && userName.trim()) {
      return userName.trim()
    }

    // Use existing anonymous ID or generate new one
    if (anonId) {
      return anonId
    }

    // Generate new anonymous ID: anon-XXXXXX (6 random chars)
    const newAnonId = 'anon-' + Math.random().toString(36).substring(2, 8)
    setAnonId(newAnonId)
    return newAnonId
  }

  // Handle file selection and analysis
  const handleFileSelect = async (file: File) => {
    setSelectedFile(file)
    setError(null)
    setIsAnalyzing(true)

    const userId = getUserIdentifier() // Get user ID

    try {
      const result = await analyzeSkin(file, userId) // Pass userId
      setResults(result)
    } catch (err) {
      setError(err as ApiError)
      console.error('Analysis failed:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Reset for new analysis
  const handleReset = () => {
    setSelectedFile(null)
    setResults(null)
    setError(null)
  }

  // Clear error
  const handleClearError = () => {
    setError(null)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              AI Skin Analyzer
            </h1>
            <p className="mt-2 text-gray-600">
              Discover your skin type and get personalized sunscreen recommendations
            </p>
            {isMockMode() && (
              <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
                <span className="mr-1">🧪</span>
                Development Mode (Using Mock Data)
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {!results ? (
          // Upload Flow
          <div className="space-y-6">
            {/* Instructions */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h2 className="text-sm font-semibold text-blue-900 mb-2">
                How it works
              </h2>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Accept the disclaimer below</li>
                <li>2. Upload a clear photo of your face</li>
                <li>3. Get instant AI-powered skin analysis</li>
                <li>4. Receive personalized sunscreen recommendations</li>
              </ol>
            </div>

            {/* User Identification */}
            <div className="mb-6">
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
                Your name (optional)
              </label>
              <input
                id="userName"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name or leave blank for anonymous"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={!isUserNameLoaded}
              />
              <p className="mt-1 text-xs text-gray-500">
                This helps track your analysis history
              </p>
            </div>

            {/* Disclaimer */}
            {isLoaded ? (
              <DisclaimerCheckbox
                checked={disclaimerAccepted}
                onChange={setDisclaimerAccepted}
              />
            ) : (
              <DisclaimerCheckbox
                checked={false}
                onChange={() => {}}
                isLoading={true}
              />
            )}

            {/* File Upload */}
            <FileUpload
              onFileSelect={handleFileSelect}
              isDisabled={!disclaimerAccepted || !isLoaded}
              isAnalyzing={isAnalyzing}
            />

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Privacy First
                </h3>
                <p className="text-xs text-gray-600">
                  Your photo is analyzed in real-time and not stored on our servers.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  AI-Powered
                </h3>
                <p className="text-xs text-gray-600">
                  Advanced computer vision technology provides accurate skin analysis.
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Results Display
          <AnalysisResults
            results={results}
            onReset={handleReset}
          />
        )}
      </div>

      {/* Loading Overlay */}
      {isAnalyzing && <LoadingSpinner />}

      {/* Error Toast */}
      {error && (
        <Toast
          type="error"
          message={getErrorMessage(error)}
          onClose={handleClearError}
        />
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-100 bg-white">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <p className="text-center text-xs text-gray-500">
            © 2025 AI Skin Analyzer. For informational purposes only.
            Not a substitute for professional medical advice.
          </p>
        </div>
      </footer>
    </main>
  )
}