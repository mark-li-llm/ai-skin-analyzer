# Frontend Implementation Plan - IMPLEMENTATION-FRONTEND-001

## Executive Summary

This document defines the complete frontend implementation plan for the AI Skin Analyzer MVP. It serves as the authoritative guide for building the React/Next.js frontend with TypeScript, following the specifications in CONTRACT-001-MVP.md and SPRINT-001-MVP.md.

**Status**: Ready for Implementation
**Timeline**: 3 days
**Approach**: Mock-first development with progressive API integration

---

## 1. Architecture Decisions

### 1.1 Component Organization
```
app/
├── page.tsx                        # Main page orchestrator
├── layout.tsx                      # Root layout (exists)
├── globals.css                     # Tailwind styles (exists)
├── components/
│   ├── FileUpload/
│   │   ├── FileUpload.tsx         # Main upload component
│   │   ├── DisclaimerCheckbox.tsx # Legal disclaimer (SSR-safe)
│   │   └── index.ts                # Export barrel
│   ├── Analysis/
│   │   ├── AnalysisResults.tsx    # Results container
│   │   ├── SkinTypeSection.tsx    # Skin type display
│   │   ├── AnalysisSection.tsx    # Characteristics
│   │   ├── ProductSection.tsx     # Recommendations
│   │   └── index.ts                # Export barrel
│   └── UI/
│       ├── LoadingSpinner.tsx     # Loading state
│       ├── ProductCard.tsx        # Product display
│       ├── Toast.tsx              # Notifications
│       ├── ConfidenceWarning.tsx  # Low confidence alert
│       └── index.ts                # Export barrel

lib/                                # Non-component utilities
├── api/
│   └── skinAnalysis.ts            # API client layer (moved from components/)
├── hooks/
│   ├── useLocalStorage.ts         # SSR-safe localStorage hook
│   ├── useToastQueue.ts           # Toast queue management
│   └── index.ts                    # Export barrel
└── utils/
    ├── localStorage.ts             # Safe localStorage utilities
    ├── fileValidation.ts           # File validation logic
    └── errorMessages.ts            # Error message mapping
```

### 1.2 State Management Strategy

**Decision**: React useState + prop drilling

```typescript
// Main state in app/page.tsx
interface AppState {
  selectedFile: File | null
  isAnalyzing: boolean
  results: SkinAnalysisResult | null
  error: ApiError | null
  disclaimerAccepted: boolean
}
```

**Rationale**: Simple app with single page flow, no need for Context or external libraries.

### 1.3 Development Approach

**Mock-First Development**
1. Use mock data from `public/mocks/` during development
2. Toggle via `NEXT_PUBLIC_USE_MOCKS` environment variable
3. Same code paths for mock and real API
4. Parallel development with backend team

---

## 2. Component Specifications

### 2.1 FileUpload Component

**File**: `app/components/FileUpload/FileUpload.tsx`

**Features**:
- File input button (styled with Tailwind)
- Drag-and-drop overlay zone
- Client-side validation
- Auto-analyze after selection
- Disabled state when disclaimer not accepted

**Interface**:
```typescript
interface FileUploadProps {
  onFileSelect: (file: File) => void
  isDisabled: boolean
  isAnalyzing: boolean
}
```

**Validation Rules**:
```typescript
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png']

function validateFile(file: File): string | null {
  if (file.size > MAX_FILE_SIZE) {
    return 'File must be under 5MB'
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Only JPEG and PNG files are supported'
  }
  return null
}
```

**UI States**:
1. Default: "Upload Photo" button + drag zone
2. Hover/Drag: Highlighted border, "Drop photo here"
3. Selected: Show filename, auto-start analysis
4. Disabled: Grayed out with tooltip
5. Analyzing: Disabled with loading indicator

### 2.2 DisclaimerCheckbox Component

**File**: `app/components/FileUpload/DisclaimerCheckbox.tsx`

**Features**:
- Checkbox with disclaimer text
- Controlled component (state managed by parent)
- Optional loading state for SSR hydration
- Required before upload

**Interface**:
```typescript
interface DisclaimerCheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  isLoading?: boolean  // Optional loading state for SSR hydration
}
```

**Implementation** (SSR-safe):
```typescript
export function DisclaimerCheckbox({
  checked,
  onChange,
  isLoading = false
}: DisclaimerCheckboxProps) {
  // Show loading skeleton during hydration
  if (isLoading) {
    return (
      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="h-5 bg-gray-200 animate-pulse rounded w-3/4" />
      </div>
    )
  }

  return (
    <label className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
        aria-describedby="disclaimer-text"
      />
      <span id="disclaimer-text" className="text-sm text-gray-700">
        I understand this analysis is for informational purposes only and
        not medical advice. Results are AI-generated and may not be accurate.
        Please consult a dermatologist for professional advice.
      </span>
    </label>
  )
}
```

**Note**: LocalStorage persistence is handled by the parent component (`app/page.tsx`) using SSR-safe patterns, not within this component.

### 2.3 LoadingSpinner Component

**File**: `app/components/UI/LoadingSpinner.tsx`

**Features**:
- Centered overlay
- Spinning animation
- "Analyzing your skin..." text

**Implementation**:
```tsx
export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-700">Analyzing your skin...</p>
      </div>
    </div>
  )
}
```

### 2.4 AnalysisResults Component

**File**: `app/components/Analysis/AnalysisResults.tsx`

**Layout**: Vertical stack of three sections

**Interface**:
```typescript
interface AnalysisResultsProps {
  results: SkinAnalysisResult
  onReset: () => void
}
```

**Structure**:
```tsx
<div className="max-w-2xl mx-auto space-y-6">
  {/* Low confidence warning if needed */}
  {results.confidence < 0.5 && <ConfidenceWarning />}

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
    <div className="p-4 bg-gray-50 rounded-lg">
      <p className="text-sm text-gray-600">{results.additionalNotes}</p>
    </div>
  )}

  {/* Reset Button */}
  <button onClick={onReset} className="...">
    Analyze Another Photo
  </button>
</div>
```

### 2.5 SkinTypeSection Component

**File**: `app/components/Analysis/SkinTypeSection.tsx`

**Features**:
- Large skin type badge
- Confidence percentage with color coding
- Visual confidence indicator

**Confidence Color Mapping**:
```typescript
function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.8) return 'text-green-600 bg-green-50'
  if (confidence >= 0.5) return 'text-yellow-600 bg-yellow-50'
  return 'text-red-600 bg-red-50'
}
```

**Display Format**:
```tsx
<div className="bg-white rounded-lg shadow-md p-6">
  <h2 className="text-lg font-semibold mb-4">Your Skin Type</h2>
  <div className="flex items-center justify-between">
    <span className="text-3xl font-bold capitalize">
      {skinType}
    </span>
    <span className={`px-3 py-1 rounded-full ${getConfidenceColor(confidence)}`}>
      {Math.round(confidence * 100)}% confident
    </span>
  </div>
</div>
```

### 2.6 ProductCard Component

**File**: `app/components/UI/ProductCard.tsx`

**Interface**:
```typescript
interface ProductCardProps {
  product: SpecificProduct
}
```

**Layout**:
```tsx
<div className="border rounded-lg p-4">
  <h4 className="font-bold text-lg">{product.brandName}</h4>
  <p className="text-gray-700">{product.productName}</p>
  <div className="flex items-center gap-4 mt-2">
    <span className="bg-yellow-100 px-2 py-1 rounded text-sm font-medium">
      {product.spf}
    </span>
    <span className="text-sm text-gray-600">
      {product.keyBenefit}
    </span>
  </div>
</div>
```

### 2.7 Toast Component

**File**: `app/components/UI/Toast.tsx`

**Interface**:
```typescript
interface ToastProps {
  type: 'error' | 'warning' | 'info'
  message: string
  onClose: () => void
}
```

**Features**:
- Fixed position (top-right desktop, top mobile)
- Auto-dismiss after 5 seconds
- Different colors per type
- Close button

**Error Message Mapping**:
```typescript
const ERROR_MESSAGES: Record<ApiErrorCode, string> = {
  InvalidImage: 'Please upload a valid image file',
  FileTooLarge: 'File must be under 5MB',
  UnsupportedType: 'Only JPEG and PNG files are supported',
  OpenAIError: 'Analysis failed. Please try again',
  Timeout: 'Request timed out. Please try again',
  RateLimited: 'Too many requests. Please try again later'
}
```

### 2.8 ConfidenceWarning Component

**File**: `app/components/UI/ConfidenceWarning.tsx`

**Display Condition**: `confidence < 0.5`

**Layout**:
```tsx
<div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
  <div className="flex">
    <div className="flex-shrink-0">
      ⚠️
    </div>
    <div className="ml-3">
      <p className="text-sm text-yellow-700">
        Low confidence result. The analysis may not be accurate.
        Consider taking a clearer photo in good lighting.
      </p>
    </div>
  </div>
</div>
```

---

## 3. API Integration Layer

### 3.1 API Client

**File**: `lib/api/skinAnalysis.ts`

```typescript
import type { SkinAnalysisResult, ApiError } from '@/types/analysis'

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === '1'

export async function analyzeSkin(file: File): Promise<SkinAnalysisResult> {
  if (USE_MOCKS) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Randomly return success or error for testing
    if (Math.random() > 0.8) {
      throw { error: 'FileTooLarge' } as ApiError
    }

    // ✅ Fetch mock data from public directory
    const response = await fetch('/mocks/analysis-success.json')
    if (!response.ok) {
      throw new Error('Failed to load mock data')
    }
    const data = await response.json()
    return data as SkinAnalysisResult
  }

  // Real API call
  const formData = new FormData()
  formData.append('file', file)

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 60000) // 60s timeout

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
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw { error: 'Timeout' } as ApiError
    }
    throw error
  }
}
```

---

## 4. Custom Hooks and Utilities

### 4.1 SSR-Safe localStorage Hook

**File**: `lib/hooks/useLocalStorage.ts`

This custom hook provides SSR-safe localStorage access with proper hydration handling.

```typescript
import { useState, useEffect, useCallback } from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  // Start with consistent initial value for SSR
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isLoaded, setIsLoaded] = useState(false)

  // Client-side only: Load actual value from localStorage
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item !== null) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
    } finally {
      setIsLoaded(true)
    }
  }, [key])

  // Safe setter with error handling
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      setStoredValue(prev => {
        const newValue = value instanceof Function ? value(prev) : value
        window.localStorage.setItem(key, JSON.stringify(newValue))
        return newValue
      })
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
      // Still update in-memory state even if localStorage fails
      setStoredValue(value instanceof Function ? value : value)
    }
  }, [key])

  return [storedValue, setValue, isLoaded]
}
```

**Usage Example**:
```typescript
// In page.tsx - cleaner alternative to manual useEffect
const [disclaimerAccepted, setDisclaimerAccepted, isLoaded] = useLocalStorage(
  'ai-skin-analyzer-disclaimer-accepted',
  false
)

// Show loading state while hydrating
{!isLoaded ? (
  <div className="h-10 bg-gray-100 animate-pulse rounded" />
) : (
  <DisclaimerCheckbox
    checked={disclaimerAccepted}
    onChange={setDisclaimerAccepted}
  />
)}
```

### 4.2 Safe localStorage Utilities

**File**: `lib/utils/localStorage.ts`

Utility functions for safe localStorage access with SSR compatibility.

```typescript
/**
 * Safely get item from localStorage (SSR-safe)
 */
export function getLocalStorageItem(key: string): string | null {
  if (typeof window === 'undefined') return null

  try {
    return window.localStorage.getItem(key)
  } catch (error) {
    console.warn(`localStorage.getItem("${key}") failed:`, error)
    return null
  }
}

/**
 * Safely set item in localStorage (SSR-safe)
 */
export function setLocalStorageItem(key: string, value: string): boolean {
  if (typeof window === 'undefined') return false

  try {
    window.localStorage.setItem(key, value)
    return true
  } catch (error) {
    console.warn(`localStorage.setItem("${key}") failed:`, error)
    return false
  }
}

/**
 * Safely remove item from localStorage (SSR-safe)
 */
export function removeLocalStorageItem(key: string): boolean {
  if (typeof window === 'undefined') return false

  try {
    window.localStorage.removeItem(key)
    return true
  } catch (error) {
    console.warn(`localStorage.removeItem("${key}") failed:`, error)
    return false
  }
}

/**
 * Check if localStorage is available
 */
export function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false

  try {
    const testKey = '__localStorage_test__'
    window.localStorage.setItem(testKey, 'test')
    window.localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}
```

---

## 5. Main Page Implementation

### 5.1 Page Component

**File**: `app/page.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import type { SkinAnalysisResult, ApiError } from '@/types/analysis'
import { FileUpload, DisclaimerCheckbox } from '@/components/FileUpload'
import { AnalysisResults } from '@/components/Analysis'
import { LoadingSpinner, Toast } from '@/components/UI'
import { analyzeSkin } from '@/lib/api/skinAnalysis'

export default function Home() {
  // State management
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<SkinAnalysisResult | null>(null)
  const [error, setError] = useState<ApiError | null>(null)
  // SSR-safe: Initial state consistent between server and client
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false)

  // Load disclaimer acceptance from localStorage after client-side hydration
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ai-skin-analyzer-disclaimer-accepted')
      if (stored === 'true') {
        setDisclaimerAccepted(true)
      }
    } catch (error) {
      console.warn('localStorage access denied:', error)
      // Gracefully degrade in private browsing mode
    }
  }, [])

  // Handle disclaimer acceptance with error handling
  const handleDisclaimerChange = (checked: boolean) => {
    setDisclaimerAccepted(checked)

    try {
      if (checked) {
        localStorage.setItem('ai-skin-analyzer-disclaimer-accepted', 'true')
      } else {
        localStorage.removeItem('ai-skin-analyzer-disclaimer-accepted')
      }
    } catch (error) {
      console.warn('localStorage write failed:', error)
      // App continues to work even if localStorage fails
    }
  }

  // Handle file selection and analysis
  const handleFileSelect = async (file: File) => {
    setSelectedFile(file)
    setError(null)
    setIsAnalyzing(true)

    try {
      const result = await analyzeSkin(file)
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

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          AI Skin Analyzer
        </h1>

        {!results ? (
          <>
            <DisclaimerCheckbox
              checked={disclaimerAccepted}
              onChange={handleDisclaimerChange}
            />

            <FileUpload
              onFileSelect={handleFileSelect}
              isDisabled={!disclaimerAccepted}
              isAnalyzing={isAnalyzing}
            />
          </>
        ) : (
          <AnalysisResults
            results={results}
            onReset={handleReset}
          />
        )}

        {isAnalyzing && <LoadingSpinner />}

        {error && (
          <Toast
            type="error"
            message={getErrorMessage(error)}
            onClose={() => setError(null)}
          />
        )}
      </div>
    </main>
  )
}

function getErrorMessage(error: ApiError): string {
  const messages: Record<string, string> = {
    InvalidImage: 'Please upload a valid image file',
    FileTooLarge: 'File must be under 5MB',
    UnsupportedType: 'Only JPEG and PNG files are supported',
    OpenAIError: 'Analysis failed. Please try again',
    Timeout: 'Request timed out. Please try again',
    RateLimited: 'Too many requests. Please try again later'
  }
  return messages[error.error] || 'An error occurred'
}
```

---

## 6. Styling Guidelines

### 6.1 Design Tokens

```css
/* Color Palette */
Primary: blue-600 (#2563EB)
Secondary: gray-600 (#4B5563)
Success: green-600 (#059669)
Warning: yellow-600 (#D97706)
Error: red-600 (#DC2626)
Background: gray-50 (#F9FAFB)
Card: white (#FFFFFF)

/* Spacing */
Container: max-w-2xl mx-auto px-4
Section gap: space-y-6
Card padding: p-6
Button padding: px-4 py-2

/* Border Radius */
Cards: rounded-lg
Buttons: rounded-md
Badges: rounded-full

/* Shadows */
Cards: shadow-md
Hover: shadow-lg
```

### 6.2 Component Classes

```typescript
// Reusable Tailwind patterns
export const styles = {
  card: 'bg-white rounded-lg shadow-md p-6',
  button: {
    primary: 'bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors',
    secondary: 'bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors',
    disabled: 'bg-gray-300 text-gray-500 px-4 py-2 rounded-md cursor-not-allowed'
  },
  input: 'border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500',
  error: 'text-red-600 text-sm mt-1',
  label: 'block text-sm font-medium text-gray-700 mb-1'
}
```

### 6.3 Responsive Breakpoints

```css
/* Mobile First Approach */
Default: 0-639px (mobile)
sm: 640px+ (large mobile)
md: 768px+ (tablet)
lg: 1024px+ (desktop)
xl: 1280px+ (large desktop)

/* Key Responsive Patterns */
.container: px-4 sm:px-6 lg:px-8
.grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
.text: text-sm sm:text-base lg:text-lg
```

### 6.4 Animation & Transitions

```css
/* Standard transitions */
.transition-colors: transition-colors duration-200
.transition-all: transition-all duration-200
.transition-opacity: transition-opacity duration-300

/* Fade in animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in: animation: fadeIn 0.3s ease-out

/* Loading spinner */
.animate-spin: animation: spin 1s linear infinite
```

### 5.2 SSR Best Practices and Common Pitfalls

⚠️ **Critical SSR Guidelines for Next.js**

#### Browser-Only APIs to Avoid During Initial Render

Never access these during initial render or in `useState` initializers:

- `window` object
- `document` object
- `localStorage` / `sessionStorage`
- `navigator` object
- Any browser-specific APIs

**❌ Wrong (Causes Hydration Error)**:
```typescript
// This runs on both server and client with different results
const [theme, setTheme] = useState(() => {
  return localStorage.getItem('theme') || 'light'  // Error!
})
```

**✅ Correct (SSR-Safe)**:
```typescript
// Consistent initial state
const [theme, setTheme] = useState('light')

// Load from localStorage after hydration
useEffect(() => {
  const stored = localStorage.getItem('theme')
  if (stored) setTheme(stored)
}, [])
```

#### Common SSR Pitfalls and Solutions

| Pitfall | Solution |
|---------|----------|
| Reading `localStorage` in `useState` | Use `useEffect` to load after mount |
| Checking `window.innerWidth` for responsive | Use CSS media queries or `useEffect` |
| Using `Date.now()` for IDs | Use stable IDs or `useId()` hook |
| Random values in render | Move to `useEffect` or use seed |
| Browser-only libraries | Dynamic import with `{ ssr: false }` |

#### Dynamic Imports for Client-Only Components

```typescript
// For components that can't be SSR'd
import dynamic from 'next/dynamic'

const MapComponent = dynamic(
  () => import('./MapComponent'),
  {
    ssr: false,
    loading: () => <div>Loading map...</div>
  }
)
```

#### Testing for SSR Issues

Always test with production build:
```bash
# This catches SSR issues that dev mode might miss
npm run build && npm run start
```

#### Debugging Hydration Errors

When you see "Text content did not match" or similar:

1. Check for any browser API usage in initial render
2. Ensure consistent initial state between server/client
3. Look for date/time rendering without stable formatting
4. Check for user-specific content rendered differently

---

## 7. User Flow Implementation

### 7.1 Initial Load Flow

```
1. Check localStorage for disclaimer
   ├─ If accepted: Enable upload
   └─ If not: Show checkbox, disable upload

2. Display upload interface
   ├─ Upload button
   ├─ Drag-drop zone
   └─ File type/size hints
```

### 7.2 Analysis Flow

```
1. File Selection
   ├─ Validate file (client-side)
   ├─ Show error if invalid
   └─ Auto-start analysis if valid

2. During Analysis
   ├─ Show loading spinner
   ├─ Disable all inputs
   └─ 60-second timeout

3. Success Response
   ├─ Hide spinner
   ├─ Show results (fade in)
   ├─ Check confidence level
   └─ Display warning if <0.5

4. Error Response
   ├─ Hide spinner
   ├─ Show toast notification
   ├─ Keep upload visible
   └─ Allow retry
```

### 7.3 Reset Flow

```
1. User clicks "Analyze Another Photo"
2. Clear all state except disclaimer
3. Show upload interface again
4. Ready for new analysis
```

---

## 8. Testing Strategy

### 8.1 Component Testing

```typescript
// Test each component in isolation
describe('FileUpload', () => {
  test('validates file size')
  test('validates file type')
  test('handles drag and drop')
  test('disabled when disclaimer not accepted')
})

describe('AnalysisResults', () => {
  test('displays all three sections')
  test('shows confidence warning when <0.5')
  test('renders product cards correctly')
  test('reset button works')
})
```

### 8.2 Integration Testing

```typescript
// Test complete user flows
describe('E2E Flow', () => {
  test('complete success flow with mock data')
  test('error handling for oversized file')
  test('error handling for wrong file type')
  test('API timeout handling')
  test('low confidence warning display')
})
```

### 8.3 Mock Data Testing

```bash
# Test with mocks
NEXT_PUBLIC_USE_MOCKS=1 npm run dev

# Test scenarios:
1. Upload valid image → Success response
2. Upload large file → Size error
3. Upload non-image → Type error
4. Simulate timeout → Timeout error
5. Low confidence result → Warning display
```

### 8.4 SSR Testing

**Testing for SSR compatibility and hydration issues**:

```typescript
// test/ssr.test.tsx
import { render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import Home from '@/app/page'

describe('SSR Compatibility', () => {
  test('renders without hydration errors', () => {
    // Mock window as undefined (server environment)
    const originalWindow = global.window
    // @ts-ignore
    delete global.window

    // Should not throw during server render
    expect(() => {
      const html = renderToString(<Home />)
      expect(html).toContain('AI Skin Analyzer')
    }).not.toThrow()

    // Restore window
    global.window = originalWindow
  })

  test('localStorage failures handled gracefully', () => {
    // Mock localStorage to throw
    const mockLocalStorage = {
      getItem: jest.fn(() => {
        throw new Error('Access denied')
      }),
      setItem: jest.fn(() => {
        throw new Error('Quota exceeded')
      }),
      removeItem: jest.fn(() => {
        throw new Error('Access denied')
      })
    }

    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    })

    // Should not crash with localStorage errors
    const { container } = render(<Home />)
    expect(container).toBeInTheDocument()
  })

  test('hydration consistency', () => {
    // Server render
    const originalWindow = global.window
    // @ts-ignore
    delete global.window
    const serverHtml = renderToString(<Home />)
    global.window = originalWindow

    // Client render with same initial state
    const { container } = render(<Home />)

    // Initial states should match (disclaimer not accepted)
    expect(container.querySelector('[type="checkbox"]')).not.toBeChecked()
  })

  test('works in private browsing mode', () => {
    // Simulate Safari private browsing (localStorage throws)
    const originalLocalStorage = window.localStorage
    Object.defineProperty(window, 'localStorage', {
      get: () => {
        throw new Error('localStorage is not available')
      }
    })

    // Should render without crashing
    const { container } = render(<Home />)
    expect(container).toBeInTheDocument()

    // Restore
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
      writable: true
    })
  })
})
```

**SSR-Safe Component Testing**:

```typescript
// test/components/DisclaimerCheckbox.test.tsx
describe('DisclaimerCheckbox SSR', () => {
  test('shows loading state during hydration', () => {
    const { rerender } = render(
      <DisclaimerCheckbox
        checked={false}
        onChange={() => {}}
        isLoading={true}
      />
    )

    expect(screen.getByRole('generic')).toHaveClass('animate-pulse')

    // After hydration
    rerender(
      <DisclaimerCheckbox
        checked={true}
        onChange={() => {}}
        isLoading={false}
      />
    )

    expect(screen.getByRole('checkbox')).toBeChecked()
  })
})
```

---

## 9. Performance Optimizations

### 9.1 Image Handling

```typescript
// Client-side image preview (optional)
function createImagePreview(file: File): string {
  return URL.createObjectURL(file)
}

// Clean up object URLs
function cleanupPreview(url: string): void {
  URL.revokeObjectURL(url)
}
```

### 9.2 Bundle Size

```typescript
// Dynamic imports for heavy components
const AnalysisResults = dynamic(
  () => import('@/components/Analysis/AnalysisResults'),
  { loading: () => <LoadingSpinner /> }
)
```

### 9.3 Re-render Optimization

```typescript
// Memoize expensive computations
const confidenceColor = useMemo(
  () => getConfidenceColor(confidence),
  [confidence]
)

// Prevent unnecessary re-renders
const MemoizedProductCard = memo(ProductCard)
```

---

## 10. Error Handling Matrix

| Error Code | User Message | Recovery Action |
|------------|--------------|-----------------|
| InvalidImage | "Please upload a valid image file" | Clear file, show upload |
| FileTooLarge | "File must be under 5MB" | Clear file, show hint |
| UnsupportedType | "Only JPEG and PNG files are supported" | Clear file, show formats |
| OpenAIError | "Analysis failed. Please try again" | Show retry button |
| Timeout | "Request timed out. Please try again" | Show retry button |
| RateLimited | "Too many requests. Please try again later" | Disable upload temporarily |

---

## 11. Implementation Checklist

### Day 1: Core Components
- [ ] Create folder structure
- [ ] Implement FileUpload component
- [ ] Add DisclaimerCheckbox with localStorage
- [ ] Build LoadingSpinner
- [ ] Create AnalysisResults structure
- [ ] Implement ProductCard component

### Day 2: Integration
- [ ] Implement Toast notifications
- [ ] Create API client with mock toggle
- [ ] Wire up page.tsx with state management
- [ ] Add error handling
- [ ] Implement reset flow

### Day 3: Polish & Testing
- [ ] Add responsive design
- [ ] Implement animations/transitions
- [ ] Test with mock data
- [ ] Test error scenarios
- [ ] Verify mobile experience
- [ ] Final UI polish

---

## 12. Acceptance Criteria Validation

Per SPRINT-001-MVP.md:

- [ ] **Upload Support**: jpg/jpeg/png, single file ≤ 5MB
- [ ] **API Integration**: Successfully sends request and receives JSON
- [ ] **Results Display**: Complete 3-section UI with confidence
- [ ] **Error Handling**: Clear messages for common failures
- [ ] **Disclaimer**: Shown and required before upload
- [ ] **Mobile Responsive**: Works on all screen sizes
- [ ] **SSR Compatibility**: No hydration errors in Next.js
- [ ] **localStorage Fallback**: Works even when localStorage unavailable (private browsing)
- [ ] **No UI Flash**: Minimal/no visual flash when loading persisted disclaimer state
- [ ] **Confidence Threshold**: Warning shown when confidence < 0.5 (per contract)

---

## 13. Development Commands

```bash
# Start development with mocks
NEXT_PUBLIC_USE_MOCKS=1 npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Type checking
npx tsc --noEmit
```

---

## 14. File References

### Required Imports
```typescript
// Types (use in every component)
import type {
  SkinAnalysisResult,
  ApiError,
  ApiErrorCode,
  SkinType,
  SpecificProduct
} from '@/types/analysis'
```

### Mock Data Access
```typescript
// ✅ Correct way to access mock data (in lib/api/skinAnalysis.ts)
const data = await fetch('/mocks/analysis-success.json').then(r => r.json())
const error = await fetch('/mocks/analysis-error-file-too-large.json').then(r => r.json())

// You can also test mock data directly in browser:
// http://localhost:3000/mocks/analysis-success.json
// http://localhost:3000/mocks/analysis-error-file-too-large.json
```

### Key Documentation
- API Contract: `docs/CONTRACT-001-MVP.md`
- Sprint Requirements: `docs/SPRINT-001-MVP.md`
- Type Definitions: `types/analysis.ts`
- Mock Data: `public/mocks/` (access via fetch, not import)
- Mock Usage Guide: `public/mocks/README.md`

---

## 15. Handoff Notes

### For Backend Team
- Frontend expects exact JSON structure per `types/analysis.ts`
- Using multipart/form-data with field name "file"
- Expecting proper HTTP status codes (400, 413, 415, 500, 504)
- 60-second timeout on frontend

### For QA Team
- Test with real photos, not stock images
- Verify mobile experience on actual devices
- Check disclaimer persistence across sessions
- Validate all error scenarios

### For Product Team
- Low confidence threshold set at 0.5
- Auto-analyze triggers immediately after file selection
- No multi-photo or comparison features
- Results are not saved/persisted

---

## Document Version

**Version**: 1.1.0
**Date**: 2025-10-26
**Author**: Frontend Development Team
**Status**: Ready for Implementation (SSR-Safe)

**Change Log**:
- v1.1.0 (2025-10-26): Major SSR hydration fixes and improvements:
  - Fixed SSR hydration error in localStorage handling (Section 5.1)
  - Added custom useLocalStorage hook for SSR-safe state management (Section 4)
  - Updated DisclaimerCheckbox component with loading states (Section 2.2)
  - Added comprehensive SSR testing section (Section 8.4)
  - Added SSR best practices documentation (Section 5.2)
  - Updated acceptance criteria with SSR requirements (Section 12)
  - Fixed all section numbering after insertions
  - Moved API client from components/api/ to lib/api/ (proper architecture)
- v1.0.1 (2025-10-26): Fix confidence threshold from 0.6 to 0.5 (align with CONTRACT-001-MVP.md)
- v1.0.0 (2025-10-26): Initial implementation plan

---

END OF DOCUMENT