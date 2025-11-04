# Admin Dashboard Implementation Plan (Step 2)

## Overview

Implement a basic admin dashboard at `/admin` to view usage tracking data collected in Step 1. This dashboard will display 4 key statistics views: recent analysis logs, user statistics, summary totals, and image deduplication metrics. Password protection will be added in Step 3.

**Parent Document**: `docs/features/feature001-usage-tracking-dashboard-implementation.md`
**Feature ID**: FEATURE-002, Step 2
**Date**: 2025-11-04

## Current State Analysis

### What Exists Now

**Step 1 (Complete)**:
- ✅ User identification UI in `app/page.tsx:125-142`
- ✅ Logging infrastructure in `lib/logging.ts`
- ✅ Redis data collection operational in production
- ✅ Helper functions ready to use:
  - `getRecentLogs(limit)` - Fetch last N logs across dates (lib/logging.ts:172-199)
  - `getUserStats()` - Fetch user statistics sorted by usage (lib/logging.ts:127-157)
  - `getLogsByDate(date)` - Fetch logs for specific date (lib/logging.ts:113-124)
  - `hasImageBeenAnalyzed(hash)` - Check image deduplication (lib/logging.ts:160-169)

**Redis Data Structure** (confirmed in production):
```
logs:YYYY-MM-DD     → List of AnalysisLog (JSON)
stats:user:{name}   → Hash {count, lastUsed, user}
images:analyzed     → Set of image hashes (SHA-256)
```

**Styling Patterns** (from `app/page.tsx` and `app/components/`):
- Tailwind CSS utility classes
- Card-based layout: `bg-white rounded-lg p-4 border border-gray-200`
- Responsive grid: `grid grid-cols-1 sm:grid-cols-2 gap-4`
- Section spacing: `space-y-6`
- Headers: `text-3xl font-bold text-gray-900`

### What's Missing

- No `/admin` route exists
- No way to view collected data
- No statistics visualization

### Key Constraints

1. **Server-Side Rendering**: Redis client only works in server environment (not browser)
2. **Styling Consistency**: Must follow existing Tailwind patterns
3. **No Password Protection Yet**: Step 3 will add authentication
4. **Performance**: Keep page load under 2 seconds with 1000+ logs

## Desired End State

### Specification

A functional admin dashboard accessible at `/admin` that displays:

1. **Summary Cards** (top section):
   - Total analyses count
   - Unique users count
   - Unique images analyzed

2. **Recent Logs Table**:
   - Last 50 analysis entries
   - Columns: timestamp, user, skin type, confidence, duration, status
   - Formatted and easy to read

3. **User Statistics Table**:
   - All users sorted by usage (highest first)
   - Columns: username, total analyses, last used
   - Shows both named and anonymous users

4. **Deduplication Stats**:
   - Total analyses vs unique images
   - Duplicate percentage
   - Visual indicator

### Verification

**Automated**:
- [ ] Page builds without errors: `npm run build`
- [ ] TypeScript checks pass: `npm run typecheck` (if exists)
- [ ] No console errors in dev: `npm run dev`

**Manual**:
- [ ] Navigate to `/admin` → page loads successfully
- [ ] Summary cards display correct numbers
- [ ] Recent logs table shows data with proper formatting
- [ ] User stats table sorts by usage (highest first)
- [ ] Deduplication stats calculate correctly
- [ ] Page is responsive (test mobile, tablet, desktop)
- [ ] No sensitive data exposed inappropriately
- [ ] Loading states work if data fetch is slow

## What We're NOT Doing

- ❌ Password protection (Step 3)
- ❌ Hidden entry points like keyboard shortcuts (Step 3)
- ❌ Data export (CSV/Excel) - future enhancement
- ❌ Advanced filtering (by date range, skin type) - future enhancement
- ❌ Charts/visualizations - keeping it simple for MVP
- ❌ Real-time updates - static data on page load
- ❌ Pagination - 50 logs is sufficient for now

## Implementation Approach

**Strategy**: Server Component approach for simplicity and performance

**Why Server Component**:
- Direct Redis access (no API route needed)
- Faster initial page load (no client-side fetch)
- SEO-friendly (though not needed here)
- Simpler code structure

**Alternative Considered**: Client component + API routes (`/api/admin/logs`, `/api/admin/stats`)
- **Rejected because**: Adds unnecessary complexity, extra round trips, and more files to maintain
- **Fallback plan**: If server component has issues, can pivot to this approach

**Data Fetching Strategy**:
- Fetch all data in parallel at page load
- Use Promise.all() for concurrent requests
- Handle errors gracefully with fallback UI

## Phase 1: Create Admin Page Structure

### Overview
Set up the basic page file and layout structure with dummy data to establish the UI foundation.

### Changes Required

#### 1. Create Admin Page Component

**File**: `app/admin/page.tsx` (new file)

**Purpose**: Server component that fetches and displays all dashboard data

**Changes**: Create new file with basic structure

```typescript
import { getRecentLogs, getUserStats } from '@/lib/logging'
import { Redis } from '@upstash/redis'

// Get Redis client for unique image count
function getRedisClient() {
  // Copy logic from lib/logging.ts:7-35
  const redisUrl = process.env.LOGS_REDIS_URL
  if (redisUrl) {
    const urlParts = redisUrl.match(/rediss:\/\/default:([^@]+)@([^:]+):(\d+)/)
    if (urlParts) {
      const [, token, host] = urlParts
      return new Redis({
        url: `https://${host}`,
        token: token,
      })
    }
  }
  return Redis.fromEnv()
}

export default async function AdminDashboard() {
  // Fetch all data in parallel
  const [recentLogs, userStats, uniqueImagesCount] = await Promise.all([
    getRecentLogs(50),
    getUserStats(),
    getRedisClient().scard('images:analyzed')
  ])

  // Calculate totals
  const totalAnalyses = recentLogs.length
  const uniqueUsers = userStats.length

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Usage analytics and system monitoring</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Summary Cards - Component placeholder */}
        <SummaryCards
          totalAnalyses={totalAnalyses}
          uniqueUsers={uniqueUsers}
          uniqueImages={uniqueImagesCount}
        />

        {/* Recent Logs - Component placeholder */}
        <RecentLogsSection logs={recentLogs} />

        {/* User Stats - Component placeholder */}
        <UserStatsSection stats={userStats} />

        {/* Deduplication Stats - Component placeholder */}
        <DeduplicationSection
          totalAnalyses={totalAnalyses}
          uniqueImages={uniqueImagesCount}
        />
      </div>
    </main>
  )
}
```

**Notes**:
- Server component (no 'use client')
- Uses async/await for data fetching
- Parallel fetching with Promise.all() for performance
- Follows existing page structure from `app/page.tsx`

### Success Criteria

#### Automated Verification:
- [ ] File created: `app/admin/page.tsx`
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors

#### Manual Verification:
- [ ] Navigate to `http://localhost:3000/admin`
- [ ] Page loads without errors (even with missing components)
- [ ] Dev console shows no errors

---

## Phase 2: Implement Summary Cards

### Overview
Create the top section displaying total analyses, unique users, and unique images as stat cards.

### Changes Required

#### 1. Add SummaryCards Component

**File**: `app/admin/page.tsx`

**Changes**: Add component definition above the main page component

```typescript
// Add this above the AdminDashboard component

interface SummaryCardsProps {
  totalAnalyses: number
  uniqueUsers: number
  uniqueImages: number
}

function SummaryCards({ totalAnalyses, uniqueUsers, uniqueImages }: SummaryCardsProps) {
  const duplicatePercentage = totalAnalyses > 0
    ? Math.round(((totalAnalyses - uniqueImages) / totalAnalyses) * 100)
    : 0

  const cards = [
    {
      title: 'Total Analyses',
      value: totalAnalyses,
      description: 'All-time skin analysis requests',
      icon: '📊'
    },
    {
      title: 'Unique Users',
      value: uniqueUsers,
      description: 'Named and anonymous users',
      icon: '👥'
    },
    {
      title: 'Unique Images',
      value: uniqueImages,
      description: `${duplicatePercentage}% were duplicates`,
      icon: '🖼️'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{card.value}</p>
              <p className="mt-1 text-xs text-gray-500">{card.description}</p>
            </div>
            <div className="text-4xl">{card.icon}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
```

**Notes**:
- Responsive grid (1 col mobile, 3 cols desktop)
- Calculates duplicate percentage inline
- Uses emoji icons for visual interest
- Consistent with existing card styling

### Success Criteria

#### Automated Verification:
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors

#### Manual Verification:
- [ ] Three cards display horizontally on desktop
- [ ] Cards stack vertically on mobile (< 768px)
- [ ] Numbers are correct (verify against Redis CLI if needed)
- [ ] Duplicate percentage calculates correctly
- [ ] Visual styling matches existing components

---

## Phase 3: Implement Recent Logs Table

### Overview
Display the last 50 analysis logs in a table format with key fields.

### Changes Required

#### 1. Add RecentLogsSection Component

**File**: `app/admin/page.tsx`

**Changes**: Add component definition

```typescript
import type { AnalysisLog } from '@/lib/logging'

// Add this with other components

interface RecentLogsSectionProps {
  logs: AnalysisLog[]
}

function RecentLogsSection({ logs }: RecentLogsSectionProps) {
  if (logs.length === 0) {
    return (
      <section className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Analyses</h2>
        <p className="text-gray-500 text-center py-8">No analysis logs found</p>
      </section>
    )
  }

  return (
    <section className="bg-white rounded-lg p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Recent Analyses ({logs.length})
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 font-medium text-gray-700">Time</th>
              <th className="text-left py-3 px-2 font-medium text-gray-700">User</th>
              <th className="text-left py-3 px-2 font-medium text-gray-700">Skin Type</th>
              <th className="text-left py-3 px-2 font-medium text-gray-700">Confidence</th>
              <th className="text-left py-3 px-2 font-medium text-gray-700">Duration</th>
              <th className="text-left py-3 px-2 font-medium text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-2 text-gray-600">
                  {formatTimestamp(log.timestamp)}
                </td>
                <td className="py-3 px-2 text-gray-900 font-medium">
                  {log.user}
                </td>
                <td className="py-3 px-2">
                  {log.status === 'success' && log.analysisResult ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {log.analysisResult.skinType}
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="py-3 px-2 text-gray-600">
                  {log.status === 'success' && log.analysisResult
                    ? `${Math.round(log.analysisResult.confidence * 100)}%`
                    : '—'
                  }
                </td>
                <td className="py-3 px-2 text-gray-600">
                  {log.duration ? `${log.duration}ms` : '—'}
                </td>
                <td className="py-3 px-2">
                  <StatusBadge status={log.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

// Helper component for status badge
function StatusBadge({ status }: { status: 'success' | 'error' }) {
  if (status === 'success') {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        ✓ Success
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
      ✗ Error
    </span>
  )
}

// Helper function for timestamp formatting
function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  // Relative time for recent entries
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  // Absolute time for older entries
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
```

**Notes**:
- Responsive table with horizontal scroll on mobile
- Relative timestamps for recent entries (e.g., "5m ago")
- Badge styling for status and skin type
- Empty state handling
- Hover effect on rows for better UX

### Success Criteria

#### Automated Verification:
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors

#### Manual Verification:
- [ ] Table displays with correct columns
- [ ] Data populates correctly (verify against actual Redis data)
- [ ] Timestamps show relative time for recent entries
- [ ] Status badges display correctly (green for success, red for error)
- [ ] Table scrolls horizontally on mobile devices
- [ ] Empty state shows when no logs exist
- [ ] Hover effect works on table rows

---

## Phase 4: Implement User Statistics Table

### Overview
Display all users with their usage statistics, sorted by frequency.

### Changes Required

#### 1. Add UserStatsSection Component

**File**: `app/admin/page.tsx`

**Changes**: Add component definition

```typescript
import type { UserStats } from '@/lib/logging'

// Add this with other components

interface UserStatsSectionProps {
  stats: UserStats[]
}

function UserStatsSection({ stats }: UserStatsSectionProps) {
  if (stats.length === 0) {
    return (
      <section className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">User Statistics</h2>
        <p className="text-gray-500 text-center py-8">No user data available</p>
      </section>
    )
  }

  return (
    <section className="bg-white rounded-lg p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        User Statistics ({stats.length} users)
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 font-medium text-gray-700">User</th>
              <th className="text-left py-3 px-2 font-medium text-gray-700">Type</th>
              <th className="text-right py-3 px-2 font-medium text-gray-700">Total Analyses</th>
              <th className="text-left py-3 px-2 font-medium text-gray-700">Last Used</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((stat) => {
              const isAnonymous = stat.user.startsWith('anon-')
              return (
                <tr key={stat.user} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2 text-gray-900 font-medium">
                    {stat.user}
                  </td>
                  <td className="py-3 px-2">
                    {isAnonymous ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        Anonymous
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        Named
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-right text-gray-900 font-semibold">
                    {stat.totalAnalyses}
                  </td>
                  <td className="py-3 px-2 text-gray-600">
                    {formatTimestamp(stat.lastUsed)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Summary footer */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Named users:</span>{' '}
            <span className="font-semibold text-gray-900">
              {stats.filter(s => !s.user.startsWith('anon-')).length}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Anonymous users:</span>{' '}
            <span className="font-semibold text-gray-900">
              {stats.filter(s => s.user.startsWith('anon-')).length}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
```

**Notes**:
- Data comes pre-sorted from `getUserStats()` (descending by total analyses)
- Distinguishes between named and anonymous users with badges
- Right-aligned numbers for better readability
- Summary footer with named vs anonymous breakdown
- Uses same `formatTimestamp()` helper from Phase 3

### Success Criteria

#### Automated Verification:
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors

#### Manual Verification:
- [ ] Users sorted by usage (highest first)
- [ ] Named vs anonymous users distinguished with badges
- [ ] Total analyses displayed correctly
- [ ] Last used timestamps formatted properly
- [ ] Summary footer shows correct counts
- [ ] Table scrolls on mobile if needed
- [ ] Empty state shows when no users exist

---

## Phase 5: Implement Deduplication Statistics

### Overview
Display image deduplication metrics with visual indicator.

### Changes Required

#### 1. Add DeduplicationSection Component

**File**: `app/admin/page.tsx`

**Changes**: Add component definition

```typescript
// Add this with other components

interface DeduplicationSectionProps {
  totalAnalyses: number
  uniqueImages: number
}

function DeduplicationSection({ totalAnalyses, uniqueImages }: DeduplicationSectionProps) {
  const duplicates = Math.max(0, totalAnalyses - uniqueImages)
  const duplicatePercentage = totalAnalyses > 0
    ? ((duplicates / totalAnalyses) * 100).toFixed(1)
    : '0.0'
  const uniquePercentage = totalAnalyses > 0
    ? ((uniqueImages / totalAnalyses) * 100).toFixed(1)
    : '0.0'

  return (
    <section className="bg-white rounded-lg p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Image Deduplication</h2>

      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Total Analyses</p>
            <p className="text-3xl font-bold text-blue-900 mt-2">{totalAnalyses}</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Unique Images</p>
            <p className="text-3xl font-bold text-green-900 mt-2">{uniqueImages}</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-orange-600 font-medium">Duplicates</p>
            <p className="text-3xl font-bold text-orange-900 mt-2">{duplicates}</p>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Unique: {uniquePercentage}%</span>
            <span>Duplicate: {duplicatePercentage}%</span>
          </div>
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-600"
              style={{ width: `${uniquePercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
          <p>
            <strong>Deduplication tracking:</strong> Each uploaded image is hashed using SHA-256.
            If the same image is analyzed multiple times, it's counted as a duplicate.
            This helps identify patterns in usage and potential system abuse.
          </p>
        </div>
      </div>
    </section>
  )
}
```

**Notes**:
- Three colored stat cards for visual distinction
- Progress bar showing unique vs duplicate ratio
- Percentage calculations with 1 decimal precision
- Explanatory text for context
- Responsive grid layout

### Success Criteria

#### Automated Verification:
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors

#### Manual Verification:
- [ ] Three stat cards display correctly
- [ ] Progress bar width matches percentage calculation
- [ ] Math is correct: Total = Unique + Duplicates
- [ ] Percentages add up to 100%
- [ ] Colors provide good visual distinction
- [ ] Section is responsive on mobile
- [ ] Explanation text is clear and helpful

---

## Phase 6: Error Handling and Polish

### Overview
Add error handling, loading states, and final polish to the dashboard.

### Changes Required

#### 1. Add Error Handling to Main Component

**File**: `app/admin/page.tsx`

**Changes**: Wrap data fetching in try-catch

```typescript
export default async function AdminDashboard() {
  let recentLogs: AnalysisLog[] = []
  let userStats: UserStats[] = []
  let uniqueImagesCount = 0
  let error: string | null = null

  try {
    // Fetch all data in parallel
    const [logs, stats, imagesCount] = await Promise.all([
      getRecentLogs(50).catch(err => {
        console.error('Failed to fetch logs:', err)
        return []
      }),
      getUserStats().catch(err => {
        console.error('Failed to fetch user stats:', err)
        return []
      }),
      getRedisClient().scard('images:analyzed').catch(err => {
        console.error('Failed to fetch unique images count:', err)
        return 0
      })
    ])

    recentLogs = logs
    userStats = stats
    uniqueImagesCount = imagesCount as number

  } catch (err) {
    console.error('Failed to load dashboard data:', err)
    error = 'Failed to load dashboard data. Please check Redis connection.'
  }

  // Calculate totals
  const totalAnalyses = recentLogs.length
  const uniqueUsers = userStats.length

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Usage analytics and system monitoring</p>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start">
              <span className="text-2xl mr-3">⚠️</span>
              <div>
                <h3 className="text-red-900 font-semibold">Error Loading Dashboard</h3>
                <p className="text-red-700 mt-1">{error}</p>
                <p className="text-red-600 text-sm mt-2">
                  Check that Redis environment variables are configured correctly.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!error && (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          <SummaryCards
            totalAnalyses={totalAnalyses}
            uniqueUsers={uniqueUsers}
            uniqueImages={uniqueImagesCount}
          />

          <RecentLogsSection logs={recentLogs} />

          <UserStatsSection stats={userStats} />

          <DeduplicationSection
            totalAnalyses={totalAnalyses}
            uniqueImages={uniqueImagesCount}
          />
        </div>
      )}
    </main>
  )
}
```

**Notes**:
- Individual catch blocks for each data source (graceful degradation)
- Error state UI with helpful message
- Continues to show partial data if some fetches fail
- Console logging for debugging

#### 2. Add Page Metadata

**File**: `app/admin/page.tsx`

**Changes**: Add at top of file (after imports)

```typescript
export const metadata = {
  title: 'Admin Dashboard | AI Skin Analyzer',
  description: 'Usage analytics and system monitoring',
}
```

**Notes**:
- SEO optimization (even though this is admin-only)
- Consistent with main page metadata

### Success Criteria

#### Automated Verification:
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors
- [ ] No console warnings in production build

#### Manual Verification:
- [ ] Error state displays if Redis is unavailable (test by breaking LOGS_REDIS_URL)
- [ ] Dashboard works with partial data (test by commenting out one fetch)
- [ ] Page title shows correctly in browser tab
- [ ] No console errors in normal operation
- [ ] Dashboard loads in under 2 seconds (with typical data volume)

---

## Testing Strategy

### Unit Tests

**Not Required for MVP**: Admin dashboard is internal tool, manual testing sufficient

**Future Enhancement**: Could add tests for:
- `formatTimestamp()` helper
- Percentage calculations in deduplication section
- User type detection (anonymous vs named)

### Integration Tests

**Manual Testing Checklist** (run in order):

1. **Environment Setup**:
   - [ ] Verify `LOGS_REDIS_URL` or Upstash env vars are set
   - [ ] Run `npm install` to ensure all dependencies

2. **Development Testing**:
   - [ ] Start dev server: `npm run dev`
   - [ ] Navigate to `http://localhost:3000/admin`
   - [ ] Verify all 4 sections display
   - [ ] Check data accuracy against Redis CLI

3. **Data Scenarios**:
   - [ ] Test with no data (empty Redis)
   - [ ] Test with 1-5 logs
   - [ ] Test with 50+ logs
   - [ ] Test with multiple users (named and anonymous)
   - [ ] Test with duplicate images

4. **Responsive Testing**:
   - [ ] Desktop (1920x1080)
   - [ ] Tablet (768x1024)
   - [ ] Mobile (375x667)

5. **Error Scenarios**:
   - [ ] Invalid Redis URL → verify error message
   - [ ] Redis unreachable → verify graceful degradation

6. **Production Build**:
   - [ ] Run `npm run build`
   - [ ] Run `npm start`
   - [ ] Test production build locally

### Manual Testing Steps

**Step-by-step verification**:

1. **Open Dashboard**:
   ```bash
   npm run dev
   # Navigate to http://localhost:3000/admin
   ```

2. **Verify Summary Cards**:
   - Compare "Total Analyses" with: `redis-cli -u $LOGS_REDIS_URL LLEN logs:2025-11-04`
   - Compare "Unique Images" with: `redis-cli -u $LOGS_REDIS_URL SCARD images:analyzed`
   - Verify duplicate percentage calculation

3. **Verify Recent Logs**:
   - Check timestamps are formatted correctly
   - Verify data matches: `redis-cli -u $LOGS_REDIS_URL LRANGE logs:2025-11-04 0 9`
   - Check status badges (success = green, error = red)

4. **Verify User Stats**:
   - Compare with: `redis-cli -u $LOGS_REDIS_URL KEYS "stats:user:*"`
   - Verify sort order (highest usage first)
   - Check named vs anonymous distinction

5. **Verify Deduplication**:
   - Verify math: Total = Unique + Duplicates
   - Check progress bar width matches percentage

## Performance Considerations

**Current Approach (Good for MVP)**:
- Server-side rendering → fast initial load
- Parallel data fetching → ~500ms total (3 concurrent requests)
- No client-side JavaScript for data display → minimal bundle size

**Potential Issues**:
- `getRecentLogs(50)` checks last 7 days → could be slow with high volume
- `getUserStats()` iterates all user keys → O(n) where n = number of users
- Page re-renders on every visit (no caching)

**Optimizations (if needed)**:
- Add Redis caching for computed stats (TTL: 5 minutes)
- Limit date range in `getRecentLogs()` to last 2 days
- Add pagination for logs (show 20, load more button)
- Consider incremental static regeneration (ISR) with 1-minute revalidation

**Estimated Performance** (with 1000 logs, 50 users):
- Data fetch: ~800ms
- Page render: ~200ms
- **Total**: ~1 second (acceptable)

## Migration Notes

**No Database Migration Required**: All data already exists in Redis from Step 1

**Environment Variables** (verify these exist):
```bash
# Required (one of these setups)
LOGS_REDIS_URL=rediss://default:TOKEN@HOST:PORT

# OR
UPSTASH_REDIS_REST_URL=https://HOST
UPSTASH_REDIS_REST_TOKEN=TOKEN
```

**Deployment Checklist**:
1. [ ] Verify env vars in Vercel dashboard
2. [ ] Deploy with: `git push` (Vercel auto-deploys)
3. [ ] Test production dashboard: `https://ai-skin-analyzer.vercel.app/admin`
4. [ ] Monitor Vercel function logs for errors
5. [ ] Check page load time in production (target: <2 seconds)

## References

- **Parent Document**: `docs/features/feature001-usage-tracking-dashboard-implementation.md`
- **Logging Infrastructure**: `lib/logging.ts`
- **Existing Page Structure**: `app/page.tsx`
- **Component Patterns**: `app/components/Analysis/AnalysisResults.tsx`
- **Types**: `types/analysis.ts`, `lib/logging.ts:38-62`
- **Redis Schema**: Feature doc lines 817-921

## Next Steps (Step 3)

After Step 2 is complete and deployed:

1. **Add Password Protection**:
   - Create `/api/verify-admin` route
   - Implement JWT token generation
   - Add password gate UI to dashboard

2. **Hidden Entry Points**:
   - Keyboard shortcut: Ctrl/Cmd+Shift+A
   - Subtle footer link: "v1.0"

3. **Full Production Deployment**:
   - Set `ADMIN_PASSWORD` environment variable
   - Deploy and test complete flow
   - Verify unauthorized users cannot access dashboard
