# Feature Implementation: Usage Tracking & Admin Dashboard

**Feature ID**: FEATURE-002
**Status**: In Progress - Step 1 Complete (Data Collection)
**Last Updated**: 2025-11-04

---

## Overview

This document contains the technical implementation details for the Usage Tracking & Admin Dashboard feature.

**See parent document**: `feature001-usage-tracking-dashboard.md` for requirements and design decisions.

---

## Implementation Decisions

### Decision 1: Admin Dashboard Entry Point Implementation
**Requirement**: Admin dashboard should have hidden entry points (see Decision 4 in requirements doc)

**Technical Solution**: Dual entry mechanism

**Primary Entry - Keyboard Shortcut**:
- Hotkey: `Ctrl+Shift+A` (Windows/Linux) or `Cmd+Shift+A` (Mac)
- Implementation: Global keyboard event listener on main page
- User experience: Invisible to regular users, instant access for admins
- Code location: `app/page.tsx` (main user interface)

**Fallback Entry - Footer Link**:
- Visual: Subtle "v1.0" text in page footer
- Styling: Same color as surrounding text (low contrast, not obviously clickable)
- Location: Bottom-right corner of footer
- Behavior: Clicking navigates to `/admin`
- Purpose: Backup access method if keyboard shortcut is forgotten

**Why This Approach**:
- ✅ Zero visible UI clutter for regular users
- ✅ Fast access for admins (keyboard shortcut)
- ✅ Discoverable fallback (footer link) for authorized users who forget the shortcut
- ✅ Even if entry is discovered, admin password still protects access
- ✅ Mobile-friendly fallback (footer link works on touch devices)

**Security Note**: This is "security through obscurity" combined with password protection. The obscurity prevents casual discovery; the password provides actual security.

---

### Decision 2: IP Address Logging
**Requirement**: Track request origins for debugging and anomaly detection (see Resolved Questions in requirements doc)

**Technical Approach**:
- Extract IP address from HTTP request headers in API route
- Vercel typically provides: `x-forwarded-for` or `x-real-ip`
- Handle case where IP is unavailable (fallback to 'unknown')
- Store in `AnalysisLog.ip` field (optional string)

**Implementation Notes**:
- Check Vercel documentation for correct header name at implementation time
- Handle multiple IPs if `x-forwarded-for` contains comma-separated list (take first one)
- Consider edge cases: localhost, IPv6, missing headers
- Code location: `app/api/analyze-skin/route.ts`
- Privacy: Acceptable for internal tool; logs auto-expire after 365 days

---

### Decision 3: Log Retention Period
**Requirement**: Retain logs for 1 year (see Resolved Questions in requirements doc)

**Technical Approach**:
- Update Redis TTL (time-to-live) in existing logging function
- Change expiration from 30 days to 365 days
- Simple numeric constant change: `30 * 24 * 60 * 60` → `365 * 24 * 60 * 60`

**Implementation Notes**:
- Code location: `lib/logging.ts` in `logAnalysis()` function
- Already implemented with `client.expire()` call
- Only need to update the seconds parameter
- Rationale: Low data volume (~1MB/year), within Upstash free tier limits

---

## Implementation Strategy

### Approach: Incremental Implementation (3 Steps)

**Rationale**: Rather than implementing all 6 tasks at once, we'll use an incremental approach to:
- Validate each step before moving to the next
- Start collecting data as early as possible
- Reduce risk of large-scale failures
- Allow flexibility to adjust based on real implementation context

---

### Step 1: Start Data Collection (Highest Priority)
**Goal**: Begin logging usage data immediately

**Tasks**:
- Task 1: User Identification UI
- Task 2: Logging Integration

**Deliverable**: Every skin analysis is logged to Redis with user identification

**Testing**: Upload image → Verify Redis entries using Redis CLI or test script

**Commit**: `feat: add user identification and usage logging`

**Why First**: Core value is data collection. Without this, nothing else matters.

---

### Step 2: View Data (Basic Dashboard)
**Goal**: Create simple way to view collected data

**Tasks**:
- Task 3: Admin Dashboard (basic version, no password yet)

**Deliverable**: `/admin` page displays 4 statistics views (Recent logs, User stats, Totals, Deduplication)

**Testing**: Access `/admin` → Verify all data displays correctly

**Commit**: `feat: add basic admin dashboard`

**Why Second**: Once data is collecting, need visibility. Temporary lack of password protection acceptable for internal tool during development.

**Note**: If UI complexity is high, can pivot to JSON API endpoint (`/api/admin/logs`) as interim solution.

---

### Step 3: Production Ready (Security & Polish)
**Goal**: Add security and hidden entry points for production deployment

**Tasks**:
- Task 4: Admin Password Verification
- Task 5: Hidden Entry Points (keyboard shortcut + footer link)
- Task 6: Testing & Deployment

**Deliverable**: Fully secured admin dashboard with hidden access

**Testing**:
- Verify password protection works
- Test keyboard shortcut (Ctrl+Shift+A)
- Test footer link
- Full end-to-end testing in production

**Commit**: `feat: add admin security and hidden entry points`

**Why Last**: Security is important but doesn't need to block data collection. Can develop Steps 1-2 in dev environment without full security, then add security before production deployment.

---

### Fallback Plan
If Step 2 (Dashboard UI) proves too complex or time-consuming:
- Create simple JSON API endpoint: `/api/admin/logs?password=xxx`
- Returns raw JSON data
- Can build UI later when time permits
- Use browser or `curl` to access data in the meantime

---

## Architecture

### Data Flow (Step 1 - Implemented)

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Browser (app/page.tsx)              │
│                                                                 │
│  1. User enters name (optional) or uses anonymous ID           │
│  2. localStorage persists user identification                  │
│  3. User uploads image                                          │
│  4. getUserIdentifier() returns userId                          │
│  5. analyzeSkin(file, userId) called                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ FormData: {file, userId}
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│            API Route (app/api/analyze-skin/route.ts)            │
│                                                                 │
│  1. Extract userId from FormData                                │
│  2. Validate file (type, size, magic number)                    │
│  3. Process image with sharp:                                   │
│     - Resize, orient, convert to JPEG                           │
│     - Strip all metadata (EXIF, GPS)                            │
│     - Generate SHA-256 hash (imageHash)                         │
│  4. Call OpenAI Vision API (gpt-5-nano)                         │
│  5. Parse and validate analysis result                          │
│  6. Log to Redis:                                               │
│     - Success: full metadata + analysis result                  │
│     - Error: error details + timing                             │
│  7. Return SkinAnalysisResult or ApiError                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ await logAnalysis({...})
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                Redis (Upstash) - lib/logging.ts                 │
│                                                                 │
│  Key Structure:                                                 │
│  ┌────────────────────────────────────────────────────┐        │
│  │ logs:2025-11-04 (List)                             │        │
│  │ - AnalysisLog entries (JSON)                       │        │
│  │ - TTL: 365 days                                    │        │
│  └────────────────────────────────────────────────────┘        │
│  ┌────────────────────────────────────────────────────┐        │
│  │ stats:user:{username} (Hash)                       │        │
│  │ - count: total analyses                            │        │
│  │ - lastUsed: timestamp                              │        │
│  │ - user: username                                   │        │
│  └────────────────────────────────────────────────────┘        │
│  ┌────────────────────────────────────────────────────┐        │
│  │ images:analyzed (Set)                              │        │
│  │ - Image hashes for deduplication detection         │        │
│  └────────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

### Component Interaction

**Frontend → API**:
- HTTP POST to `/api/analyze-skin`
- Content-Type: `multipart/form-data`
- Body: `{ file: File, userId: string }`

**API → OpenAI**:
- HTTP POST to `https://api.openai.com/v1/chat/completions`
- Model: `gpt-5-nano`
- Vision API with base64-encoded image
- Returns structured JSON analysis

**API → Redis**:
- Asynchronous logging (non-blocking)
- Operations: `lpush`, `hincrby`, `hset`, `sadd`, `expire`
- Connection: Upstash REST API
- Error handling: failures logged but don't break main flow

### Error Handling Strategy

1. **Logging Isolation**: All `logAnalysis()` calls wrapped in `.catch()` to prevent logging errors from affecting user experience
2. **Default Values**: userId defaults to 'anonymous' if extraction fails
3. **Graceful Degradation**: App continues working even if Redis is unavailable
4. **Comprehensive Error Logging**: All errors captured with timing and user context

---

## Implementation Checklist

### Task 1: User Identification UI
**Location**: `app/page.tsx`

- [x] Add optional text input field: "Your name (optional)"
- [x] Implement anonymous session ID generation (e.g., `anon-a1b2c3d4`)
- [x] Add `localStorage` to remember last used name
- [x] Pass user identifier to API when analyzing

**Technical Details**: ✅ COMPLETED

**Implementation Summary**:
- Added user name input field (lines 125-142 in `app/page.tsx`)
- Implemented `useLocalStorage` hooks for persistence:
  - `ai-skin-analyzer-user-name` - Stores user-provided name
  - `ai-skin-analyzer-anon-id` - Stores generated anonymous ID
- Anonymous ID format: `anon-XXXXXX` (6 random alphanumeric characters)
- User identification logic in `getUserIdentifier()`:
  1. If user provides name → use trimmed name
  2. If anonymous ID exists → reuse it
  3. Otherwise → generate new anonymous ID with `Math.random().toString(36).substring(2, 8)`
- User ID passed to API via `analyzeSkin(file, userId)` (line 63)
- FormData includes `userId` field sent to `/api/analyze-skin`

---

### Task 2: Logging Integration
**Location**: `app/api/analyze-skin/route.ts`

- [x] Import `logAnalysis()` from `lib/logging.ts`
- [x] Add timing measurement (start/end timestamps)
- [x] Generate image hash using `generateImageHash()`
- [x] Log every analysis with complete metadata:
  - User identifier
  - Timestamp
  - Image hash
  - Analysis result (skin type, confidence, recommendations)
  - API duration
  - Success/error status
  - Optional: User agent, IP
- [x] Ensure logging errors don't break main flow

**Technical Details**: ✅ COMPLETED

**Implementation Summary**:

**1. Timing & User ID Capture** (lines 363-364):
```typescript
const startTime = Date.now()
let userId = 'anonymous' // Default for error handling
```

**2. Extract User ID from FormData** (line 382):
```typescript
userId = formData.get('userId') as string | null || 'anonymous'
```

**3. Image Hash Generation** (line 418):
- Hash generated during image processing in `processImage()`
- Returns both `{ processedImage, imageHash }`
- Uses SHA-256 hash (first 16 chars) via `crypto.createHash('sha256')`

**4. Success Logging** (lines 423-446):
```typescript
const duration = Date.now() - startTime;
await logAnalysis({
  user: userId,
  action: 'analyze',
  status: 'success',
  imageHash: imageHash,
  analysisResult: {
    skinType: analysis.skinType,
    confidence: analysis.confidence,
    issues: analysis.analysis.observedCharacteristics,
    recommendations: analysis.productRecommendation.specificProducts.map(
      p => `${p.brandName} ${p.productName}`
    )
  },
  duration: duration,
  userAgent: request.headers.get('user-agent') || undefined,
  ip: request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      undefined
}).catch(err => {
  console.error('Failed to log analysis:', err);
});
```

**5. Error Logging** (lines 314-325 in `handleError()`):
```typescript
logAnalysis({
  user: userId,
  action: 'analyze',
  status: 'error',
  errorDetails: error.message || String(error),
  duration: duration
}).catch(err => {
  console.error('Failed to log error:', err);
});
```

**6. Error Isolation**:
- Both logging calls use `.catch()` to prevent logging failures from breaking the response
- Errors logged to console but don't throw
- Main API flow continues regardless of logging status

**7. IP Address Extraction** (lines 440-442):
- Tested and working in production
- Checks `x-forwarded-for` header first (Vercel's primary header)
- Falls back to `x-real-ip` if not available
- Returns `undefined` if neither header exists

---

### Task 3: Admin Dashboard
**Location**: `app/admin/page.tsx` (new)

- [ ] Create admin page component (client component)
- [ ] Implement admin password verification UI
- [ ] Build 4 statistics sections:
  - [ ] Recent analysis logs (last 50) - table format
  - [ ] User usage statistics - sorted by frequency
  - [ ] Summary cards (total analyses, unique users, unique images)
  - [ ] Image deduplication stats
- [ ] Add basic styling with Tailwind CSS
- [ ] Implement loading states
- [ ] Handle error states

**Technical Details**: [To be filled]

---

### Task 4: Admin Password Verification
**Location**: `app/api/verify-admin/route.ts` (new)

- [ ] Create API route for admin password verification
- [ ] Use environment variable `ADMIN_PASSWORD`
- [ ] Generate JWT token upon successful verification
- [ ] Store token in `localStorage`
- [ ] Token validation logic in admin page

**Technical Details**: [To be filled]

---

### Task 5: Hidden Entry Points
**Locations**: `app/page.tsx`, `app/layout.tsx`

- [ ] Implement keyboard shortcut listener (`Ctrl+Shift+A` / `Cmd+Shift+A`)
- [ ] Add subtle footer link: "v1.0" text with low contrast
- [ ] Both navigate to `/admin` route
- [ ] Ensure no visible admin links in main navigation

**Technical Details**: [To be filled]

---

### Task 6: Testing & Deployment

- [ ] Test user identification flow
- [ ] Test logging integration (verify Redis entries)
- [ ] Test admin dashboard (all 4 views)
- [ ] Test admin password protection
- [ ] Test hidden entry points (keyboard + footer)
- [ ] Verify in development environment
- [ ] Deploy to production (Vercel)
- [ ] Verify production Redis connection
- [ ] Test complete flow in production

---

## Component Breakdown

### 1. User Identification UI ✅

**File**: `app/page.tsx` (lines 25-52, 125-142)

**Purpose**: Capture user identity for tracking analysis history

**Implementation**:

**State Management**:
```typescript
// User name with localStorage persistence
const [userName, setUserName, isUserNameLoaded] = useLocalStorage<string>(
  'ai-skin-analyzer-user-name',
  ''
)

// Anonymous ID with localStorage persistence
const [anonId, setAnonId, isAnonIdLoaded] = useLocalStorage<string>(
  'ai-skin-analyzer-anon-id',
  ''
)
```

**User Identifier Logic**:
```typescript
const getUserIdentifier = () => {
  // Priority 1: User-provided name
  if (userName && userName.trim()) {
    return userName.trim()
  }

  // Priority 2: Existing anonymous ID
  if (anonId) {
    return anonId
  }

  // Priority 3: Generate new anonymous ID
  const newAnonId = 'anon-' + Math.random().toString(36).substring(2, 8)
  setAnonId(newAnonId)
  return newAnonId
}
```

**UI Component**:
```typescript
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
```

**Key Features**:
- Seamless transition between named and anonymous users
- Anonymous ID persists across browser sessions
- User can change name at any time
- SSR-safe with `isUserNameLoaded` check
- Clear helper text explaining the purpose

---

### 2. Logging Integration ✅

**Files**:
- `app/api/analyze-skin/route.ts` (API endpoint)
- `lib/logging.ts` (Redis operations)

**Purpose**: Capture comprehensive usage data for every analysis request

**API Route Integration** (`route.ts`):

**Timing Capture**:
```typescript
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  let userId = 'anonymous'

  try {
    // ... processing ...
    const duration = Date.now() - startTime
    // ... logging ...
  } catch (error) {
    return handleError(error, userId, startTime)
  }
}
```

**Success Logging** (lines 423-446):
```typescript
await logAnalysis({
  user: userId,
  action: 'analyze',
  status: 'success',
  imageHash: imageHash,
  analysisResult: {
    skinType: analysis.skinType,
    confidence: analysis.confidence,
    issues: analysis.analysis.observedCharacteristics,
    recommendations: analysis.productRecommendation.specificProducts.map(
      p => `${p.brandName} ${p.productName}`
    )
  },
  duration: duration,
  userAgent: request.headers.get('user-agent') || undefined,
  ip: request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      undefined
}).catch(err => {
  console.error('Failed to log analysis:', err);
});
```

**Error Logging** (handleError function):
```typescript
logAnalysis({
  user: userId,
  action: 'analyze',
  status: 'error',
  errorDetails: error.message || String(error),
  duration: duration
}).catch(err => {
  console.error('Failed to log error:', err);
});
```

**Logging Library** (`lib/logging.ts`):

**Core Function**:
```typescript
export async function logAnalysis(log: Omit<AnalysisLog, 'id' | 'timestamp'>): Promise<void> {
  const logEntry: AnalysisLog = {
    ...log,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };

  const dateKey = getDateKey(); // Format: YYYY-MM-DD

  try {
    const client = getRedisClient();

    // 1. Store in daily log list
    await client.lpush(`logs:${dateKey}`, JSON.stringify(logEntry));

    // 2. Update user statistics
    await client.hincrby(`stats:user:${log.user}`, 'count', 1);
    await client.hset(`stats:user:${log.user}`, {
      lastUsed: logEntry.timestamp,
      user: log.user,
    });

    // 3. Track image hash for deduplication
    if (log.status === 'success' && log.imageHash) {
      await client.sadd('images:analyzed', log.imageHash);
    }

    // 4. Set 365-day expiration on daily logs
    await client.expire(`logs:${dateKey}`, 365 * 24 * 60 * 60);

  } catch (error) {
    console.error('Failed to log analysis:', error);
    // Don't throw - logging failure shouldn't break the app
  }
}
```

**Key Features**:
- Non-blocking logging (errors don't affect user experience)
- Comprehensive metadata capture (user, timing, results, headers)
- Image hash for deduplication detection
- Organized by date for efficient querying
- User statistics automatically maintained
- 365-day retention period
- IP address extraction (tested in production)

---

### 3. Admin Dashboard

[To be filled during implementation]

---

### 4. Admin Password Verification

[To be filled during implementation]

---

## API Routes

### Implemented Routes

#### POST `/api/analyze-skin`

**Status**: ✅ COMPLETE (with logging integration)

**Purpose**: Analyze uploaded skin image and return product recommendations

**Request**:
```typescript
Content-Type: multipart/form-data

Body:
  file: File              // JPEG or PNG image (max 5MB)
  userId: string          // User identifier (name or anonymous ID)
```

**Response (Success)**:
```typescript
Status: 200 OK
Content-Type: application/json
Cache-Control: no-store

Body: SkinAnalysisResult {
  skinType: 'oily' | 'dry' | 'combination' | 'normal' | 'sensitive'
  confidence: number  // 0.0 to 1.0
  analysis: {
    observedCharacteristics: string[]
    skinTypeExplanation: string
  }
  productRecommendation: {
    formulationType: string
    formulationReasoning: string
    specificProducts: Array<{
      brandName: string
      productName: string
      spf: string
      keyBenefit: string
    }>
  }
  additionalNotes?: string
}
```

**Response (Error)**:
```typescript
Status: 400 | 413 | 415 | 504 | 500
Content-Type: application/json
Cache-Control: no-store

Body: ApiError {
  error: 'InvalidImage' | 'FileTooLarge' | 'UnsupportedType' | 'Timeout' | 'OpenAIError'
  message?: string
}
```

**Logging Behavior**:
- Success: Logs full analysis result with timing and metadata
- Error: Logs error type with timing
- Non-blocking: Logging errors don't affect response
- Metadata captured: user, imageHash, duration, IP, user-agent

**File**: `app/api/analyze-skin/route.ts`

---

### Planned Routes (Step 2 & 3)

#### GET `/api/admin/logs` (Optional)

**Status**: ⏳ PENDING (Step 2)

**Purpose**: Fetch analysis logs for admin dashboard

**Request**:
```typescript
GET /api/admin/logs?date=YYYY-MM-DD&limit=50
```

**Response**:
```typescript
Status: 200 OK
Content-Type: application/json

Body: {
  logs: AnalysisLog[]
  total: number
}
```

**Alternative**: Client-side functions in `lib/logging.ts` can be used directly if admin page is server-side rendered.

---

#### POST `/api/verify-admin` (Required)

**Status**: ⏳ PENDING (Step 3)

**Purpose**: Verify admin password and generate JWT token

**Request**:
```typescript
Content-Type: application/json

Body: {
  password: string
}
```

**Response (Success)**:
```typescript
Status: 200 OK
Content-Type: application/json

Body: {
  token: string  // JWT token
}
```

**Response (Error)**:
```typescript
Status: 401 Unauthorized
Content-Type: application/json

Body: {
  error: 'Invalid password'
}
```

**Implementation Notes**:
- Compare against `process.env.ADMIN_PASSWORD`
- Generate JWT with 24-hour expiration
- Token stored in localStorage on client
- Token validation middleware for dashboard access

**File**: `app/api/verify-admin/route.ts` (to be created)

---

#### GET `/api/admin/stats` (Optional)

**Status**: ⏳ PENDING (Step 2, optional)

**Purpose**: Get aggregated statistics for admin dashboard

**Request**:
```typescript
GET /api/admin/stats
```

**Response**:
```typescript
Status: 200 OK
Content-Type: application/json

Body: {
  totalAnalyses: number
  uniqueUsers: number
  uniqueImages: number
  userStats: UserStats[]
}
```

**Alternative**: Use `getRecentLogs()` and `getUserStats()` directly from client if using server components.

---

### API Design Decisions

**Why FormData for `/api/analyze-skin`**:
- Native browser File API support
- Efficient binary data transfer
- Standard multipart encoding
- Easy to append additional fields (userId)

**Why No Auth on Analysis Endpoint**:
- Public MVP feature (password-protected at app level)
- Simpler implementation
- Rate limiting handled by Vercel (serverless functions)
- Future: Can add API key auth if needed

**Why JWT for Admin Auth**:
- Stateless (no server-side sessions)
- Works with Vercel serverless functions
- Can set custom expiration
- Easy to validate on client and server

**Why No Streaming**:
- OpenAI Vision API doesn't support streaming for vision tasks
- Analysis typically completes in 2-5 seconds
- Loading state provides adequate UX

---

## Database Schema (Redis)

### Redis Key Structure

**1. Daily Log Lists** - `logs:YYYY-MM-DD`
```
Type: List (LPUSH for newest first)
Value: JSON-serialized AnalysisLog objects
TTL: 365 days (31,536,000 seconds)
Example Key: logs:2025-11-04

AnalysisLog Structure:
{
  id: string                    // UUID
  timestamp: string             // ISO 8601 format
  user: string                  // User identifier or 'anonymous'
  action: 'analyze'             // Action type
  status: 'success' | 'error'   // Request status
  imageHash?: string            // SHA-256 hash (first 16 chars)
  analysisResult?: {            // Present on success
    skinType: string
    confidence: number
    issues: string[]
    recommendations: string[]
  }
  duration?: number             // API response time in ms
  errorDetails?: string         // Present on error
  userAgent?: string            // Browser/client info
  ip?: string                   // Request origin IP
}
```

**2. User Statistics** - `stats:user:{username}`
```
Type: Hash
Fields:
  - count: string        // Total number of analyses (incremented with HINCRBY)
  - lastUsed: string     // ISO 8601 timestamp of last usage
  - user: string         // Username (redundant, for convenience)

Example: stats:user:john
{
  count: "15"
  lastUsed: "2025-11-04T10:30:00.000Z"
  user: "john"
}

Example: stats:user:anon-abc123
{
  count: "3"
  lastUsed: "2025-11-04T09:15:00.000Z"
  user: "anon-abc123"
}
```

**3. Image Hash Set** - `images:analyzed`
```
Type: Set (SADD for deduplication)
Value: Image hashes (SHA-256, first 16 chars)
Purpose: Track which images have been analyzed to detect duplicates

Example members:
- "a1b2c3d4e5f67890"
- "9876543210fedcba"
- "1a2b3c4d5e6f7g8h"

Query: SISMEMBER images:analyzed <hash>
Returns: 1 if analyzed before, 0 if new
```

### Query Patterns

**Get logs for specific date**:
```redis
LRANGE logs:2025-11-04 0 -1
// Returns all logs for Nov 4, 2025
```

**Get recent logs (last N)**:
```redis
LRANGE logs:2025-11-04 0 49
// Returns last 50 logs from today
```

**Get user statistics**:
```redis
KEYS stats:user:*
// Returns all user stat keys

HGETALL stats:user:john
// Returns all fields for user "john"
```

**Check if image was analyzed**:
```redis
SISMEMBER images:analyzed a1b2c3d4e5f67890
// Returns 1 if yes, 0 if no
```

**Get image deduplication count**:
```redis
SCARD images:analyzed
// Returns total number of unique images
```

### Storage Estimates

**Log Entry Size**: ~500-800 bytes per entry (JSON with full metadata)

**Daily Storage** (assuming 100 analyses/day):
- Logs: 100 × 700 bytes = 70 KB/day
- Annual: 70 KB × 365 = 25.55 MB/year

**User Stats**: ~100 bytes per user
- 50 unique users = 5 KB

**Image Hashes**: 16 bytes per hash
- 1000 unique images = 16 KB

**Total (1 year, 100 analyses/day, 50 users)**: ~26 MB
- Well within Upstash free tier (10,000 commands/day, 256 MB storage)

### Connection Configuration

**Environment Variables**:
```bash
# Option 1: Custom Redis URL (currently used)
LOGS_REDIS_URL=rediss://default:TOKEN@HOST:PORT

# Option 2: Standard Upstash variables
UPSTASH_REDIS_REST_URL=https://HOST
UPSTASH_REDIS_REST_TOKEN=TOKEN
```

**Connection Logic** (`lib/logging.ts:7-35`):
1. Lazy initialization (connection created on first use)
2. Parses custom `LOGS_REDIS_URL` format
3. Falls back to standard Upstash env vars
4. Uses Upstash REST API (not Redis protocol)
5. Throws error if no valid configuration found

---

## UI Components

### Implemented Components

#### User Identification Input (Step 1) ✅

**File**: `app/page.tsx` (lines 125-142)

**Component**: User name input field

**Features**:
- Optional text input
- localStorage persistence
- SSR-safe with hydration handling
- Disabled state during loading
- Helper text for context

**Styling**: Tailwind CSS classes
- Focus ring (purple)
- Border states
- Responsive padding
- Placeholder text

**Props**: N/A (state managed internally)

---

### Planned Components (Step 2 & 3)

#### Admin Dashboard Page (Step 2)

**File**: `app/admin/page.tsx` (to be created)

**Structure**:
```typescript
'use client'

export default function AdminDashboard() {
  return (
    <div>
      {/* Password Protection UI (Step 3) */}
      <PasswordGate onAuthenticated={() => setAuthenticated(true)} />

      {/* Dashboard Content (Step 2) */}
      {authenticated && (
        <>
          <SummaryCards />
          <RecentLogsTable />
          <UserStatsTable />
          <DeduplicationStats />
        </>
      )}
    </div>
  )
}
```

**Components to Build**:

1. **PasswordGate** (Step 3)
   - Password input field
   - Submit button
   - Error message display
   - JWT token storage
   - Redirect logic

2. **SummaryCards** (Step 2)
   - Total analyses count
   - Unique users count
   - Unique images count
   - Grid layout (responsive)

3. **RecentLogsTable** (Step 2)
   - Last 50 analysis logs
   - Columns: timestamp, user, skin type, confidence, duration, status
   - Sortable columns
   - Responsive (stack on mobile)
   - Loading skeleton

4. **UserStatsTable** (Step 2)
   - User list sorted by usage
   - Columns: username, total analyses, last used
   - Search/filter functionality
   - Loading skeleton

5. **DeduplicationStats** (Step 2)
   - Total images analyzed
   - Unique images count
   - Duplicate percentage
   - Visual indicator (progress bar or chart)

#### Hidden Entry Points (Step 3)

**Keyboard Shortcut Listener**:
```typescript
// In app/page.tsx
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
      e.preventDefault()
      router.push('/admin')
    }
  }
  window.addEventListener('keydown', handleKeyPress)
  return () => window.removeEventListener('keydown', handleKeyPress)
}, [])
```

**Footer Link** (Step 3):
```typescript
// In app/layout.tsx or app/page.tsx footer
<footer>
  <p>© 2025 AI Skin Analyzer...</p>
  <Link
    href="/admin"
    className="text-gray-400 hover:text-gray-500"
    aria-label="Version"
  >
    v1.0
  </Link>
</footer>
```

---

### Component Design Principles

**Styling**:
- Tailwind CSS for all components
- Responsive design (mobile-first)
- Consistent spacing and typography
- Loading states for async operations
- Error states with helpful messages

**Accessibility**:
- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators
- Screen reader friendly

**Performance**:
- Client components only when needed
- Server components for static content
- Lazy loading for admin dashboard
- Efficient re-renders (React.memo where appropriate)

**Security**:
- Password input with type="password"
- JWT tokens stored in localStorage (not cookies to avoid CSRF)
- Token validation on mount
- Automatic logout after expiration
- No sensitive data in URLs or console logs

---

## Testing Plan

### Step 1 Testing ✅ (Completed)

**User Identification**:
- [x] Verify anonymous ID generation on first visit
- [x] Verify anonymous ID persists across page refreshes
- [x] Verify localStorage stores `ai-skin-analyzer-anon-id`
- [x] Verify user can enter custom name
- [x] Verify custom name persists in localStorage
- [x] Verify custom name takes priority over anonymous ID
- [x] Verify input field disabled state during SSR hydration

**Logging Integration**:
- [x] Upload test image → verify userId passed to API
- [x] Check Redis for log entry with correct structure
- [x] Verify timing (duration field) is captured
- [x] Verify image hash is generated and logged
- [x] Verify analysis results are logged correctly
- [x] Verify user stats hash is updated (count, lastUsed)
- [x] Verify image hash added to `images:analyzed` set
- [x] Verify 365-day TTL set on daily log list
- [x] Verify IP address extraction working in production
- [x] Verify user-agent capture
- [x] Test error scenario → verify error logged without breaking app
- [x] Test Redis unavailable → verify app continues working

**Redis Verification Commands**:
```bash
# Check if connection works
redis-cli -u $LOGS_REDIS_URL ping

# View recent logs
redis-cli -u $LOGS_REDIS_URL LRANGE logs:2025-11-04 0 9

# Check user stats
redis-cli -u $LOGS_REDIS_URL KEYS "stats:user:*"
redis-cli -u $LOGS_REDIS_URL HGETALL stats:user:john

# Check unique images
redis-cli -u $LOGS_REDIS_URL SCARD images:analyzed
redis-cli -u $LOGS_REDIS_URL SMEMBERS images:analyzed
```

**Development Helper Scripts**:

**View Single Log** - `scripts/view-single-log.js`

Purpose: View complete JSON data for a specific user's log entry

Usage:
```bash
# View logs for specific user
node scripts/view-single-log.js Mark

# View logs for anonymous user
node scripts/view-single-log.js anon-abc123

# Default (searches for "Mark")
node scripts/view-single-log.js
```

Features:
- Searches today's logs for specified user
- Displays complete JSON structure
- Shows field-by-field breakdown with types
- Lists available users if target not found
- Helpful for debugging log structure

Example Output:
```
🔍 Searching for logs from user: "Mark"

📝 Log Entry #1 - Complete Data:

{
  "id": "a1b2c3d4-...",
  "timestamp": "2025-11-04T10:30:00.000Z",
  "user": "Mark",
  "action": "analyze",
  "status": "success",
  "imageHash": "a1b2c3d4e5f67890",
  "analysisResult": { ... },
  "duration": 3245,
  "userAgent": "Mozilla/5.0...",
  "ip": "192.168.1.1"
}

📊 Data Field Breakdown:

id:
  Type: string
  Value: a1b2c3d4-...

timestamp:
  Type: string
  Value: 2025-11-04T10:30:00.000Z

[... field-by-field breakdown ...]
```

**When to Use**:
- Verifying log structure after code changes
- Debugging missing or incorrect fields
- Inspecting actual analysis results
- Finding user identifiers for testing

### Step 2 Testing (Pending)

**Admin Dashboard** (To be implemented):
- [ ] Verify `/admin` page loads
- [ ] Test Recent Logs view (last 50 entries)
- [ ] Test User Stats view (sorted by usage)
- [ ] Test Summary Cards (total analyses, unique users, unique images)
- [ ] Test loading states
- [ ] Test error handling
- [ ] Test responsive design (mobile/tablet/desktop)

### Step 3 Testing (Pending)

**Admin Security** (To be implemented):
- [ ] Test password protection (correct password)
- [ ] Test password protection (incorrect password)
- [ ] Test JWT token generation and validation
- [ ] Test token persistence in localStorage
- [ ] Test keyboard shortcut (Ctrl+Shift+A / Cmd+Shift+A)
- [ ] Test footer link visibility and navigation
- [ ] Test that dashboard is inaccessible without password
- [ ] Test password required after browser restart

**Production Testing** (To be implemented):
- [ ] Deploy to Vercel
- [ ] Verify Redis connection in production
- [ ] Verify environment variables set correctly
- [ ] Test complete flow: upload → log → view dashboard
- [ ] Verify IP address extraction working
- [ ] Test from multiple devices/browsers
- [ ] Verify no errors in Vercel logs

---

## Deployment Notes

### Step 1 Deployment ✅ (Completed)

**Status**: Deployed to production
**Commit**: `feat(logging): implement Step 1 - user identification and data collection`
**Date**: 2025-11-04

**Environment Variables Required**:
```bash
# Existing (already set)
OPENAI_API_KEY=sk-...

# New for logging (already set)
LOGS_REDIS_URL=rediss://default:TOKEN@HOST:PORT
# OR
UPSTASH_REDIS_REST_URL=https://HOST
UPSTASH_REDIS_REST_TOKEN=TOKEN
```

**Vercel Configuration**:
- Environment variables configured in Vercel dashboard
- Redis connection tested and working
- IP address extraction validated in production
- Automatic deployment on `git push`

**Post-Deployment Verification**:
- [x] Upload test image → check Redis for log entry
- [x] Verify user identification working (named and anonymous)
- [x] Verify IP addresses being captured
- [x] Verify user-agent strings being logged
- [x] Check Vercel function logs for any errors
- [x] Verify TTL set correctly (365 days)

**Current State**:
- ✅ Data collection fully operational
- ✅ Every analysis is logged to Redis
- ✅ User identification working
- ✅ Image deduplication tracking active
- ⏳ Dashboard not yet implemented (Step 2)
- ⏳ Admin password not yet implemented (Step 3)

### Step 2 Deployment (Pending)

**Requirements**:
- Create `/admin` page component
- Create `/api/admin/logs` endpoint (optional)
- No additional environment variables needed
- Deploy with `git push` (Vercel auto-deploy)

**Testing Before Deploy**:
- Verify dashboard displays data correctly
- Test all 4 views (recent logs, user stats, totals, deduplication)
- Check loading and error states

### Step 3 Deployment (Pending)

**Requirements**:
- Add new environment variable: `ADMIN_PASSWORD`
- Configure in Vercel dashboard before deployment
- Update `/admin` page with password protection
- Add keyboard shortcut and footer link
- Deploy with `git push` (Vercel auto-deploy)

**Testing Before Deploy**:
- Test password protection locally
- Test keyboard shortcut
- Test footer link
- Verify JWT token generation

**Post-Deploy Verification**:
- Test password protection in production
- Test hidden entry points
- Verify no unauthorized access possible
- Test complete end-to-end flow

### Monitoring & Maintenance

**Redis Storage**:
- Current usage: ~26 MB/year (estimated)
- Upstash free tier: 256 MB storage
- Auto-expiration: 365 days per log entry
- No manual cleanup needed

**Upstash Dashboard**:
- Monitor daily command usage (limit: 10,000/day)
- Monitor storage usage
- Check connection health
- Review error rates

**Potential Issues**:
1. **Redis Connection Failures**: App continues working, logs errors to console
2. **Exceeding Command Limit**: Consider upgrading Upstash plan or implementing request throttling
3. **Storage Limit**: Unlikely with current 365-day TTL, but can reduce retention if needed

**Future Enhancements** (Post-MVP):
- Add analytics aggregation (daily/weekly summaries)
- Implement data export functionality
- Add alerting for anomalies
- Create visualization charts
- Add filtering and search capabilities

---

## Step 1 Completion Summary

**Status**: ✅ COMPLETE
**Date**: 2025-11-04
**Commit**: `feat(logging): implement Step 1 - user identification and data collection`

### What Was Implemented

**User Identification** (`app/page.tsx`):
- Optional name input field with localStorage persistence
- Automatic anonymous ID generation (`anon-XXXXXX` format)
- Seamless switching between named and anonymous users
- SSR-safe implementation with hydration handling

**Logging Integration** (`app/api/analyze-skin/route.ts`, `lib/logging.ts`):
- Complete request timing capture (start to finish)
- Image hash generation using SHA-256
- Comprehensive metadata logging (user, image, results, timing, headers)
- Non-blocking error handling (logging failures don't affect users)
- IP address and user-agent extraction (tested in production)

**Redis Storage** (`lib/logging.ts`):
- Daily log lists with 365-day retention
- User statistics tracking (count, last used)
- Image deduplication detection
- Upstash connection with fallback configuration
- Helper functions: `getRecentLogs()`, `getUserStats()`, `hasImageBeenAnalyzed()`

### Testing Completed

- ✅ User identification (named and anonymous)
- ✅ localStorage persistence across sessions
- ✅ Redis logging with full metadata
- ✅ Image hash generation and tracking
- ✅ User statistics updates
- ✅ TTL configuration (365 days)
- ✅ IP address extraction (production validated)
- ✅ Error handling (graceful degradation)
- ✅ Production deployment and verification

### Next Steps

**Step 2**: Build basic admin dashboard to view collected data
**Step 3**: Add security (password protection + hidden entry points)

---

*This document is actively maintained and updated as implementation progresses.*
