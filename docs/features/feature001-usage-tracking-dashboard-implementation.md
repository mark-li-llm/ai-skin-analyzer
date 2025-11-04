# Feature Implementation: Usage Tracking & Admin Dashboard

**Feature ID**: FEATURE-002
**Status**: Planning
**Last Updated**: 2025-11-03

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

[To be filled during implementation]

---

## Implementation Checklist

### Task 1: User Identification UI
**Location**: `app/page.tsx`

- [ ] Add optional text input field: "Your name (optional)"
- [ ] Implement anonymous session ID generation (e.g., `anon-a1b2c3d4`)
- [ ] Add `localStorage` to remember last used name
- [ ] Pass user identifier to API when analyzing

**Technical Details**: [To be filled]

---

### Task 2: Logging Integration
**Location**: `app/api/analyze-skin/route.ts`

- [ ] Import `logAnalysis()` from `lib/logging.ts`
- [ ] Add timing measurement (start/end timestamps)
- [ ] Generate image hash using `generateImageHash()`
- [ ] Log every analysis with complete metadata:
  - User identifier
  - Timestamp
  - Image hash
  - Analysis result (skin type, confidence, recommendations)
  - API duration
  - Success/error status
  - Optional: User agent, IP
- [ ] Ensure logging errors don't break main flow

**Technical Details**: [To be filled]

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

### 1. User Identification UI

[To be filled during implementation]

---

### 2. Logging Integration

[To be filled during implementation]

---

### 3. Admin Dashboard

[To be filled during implementation]

---

### 4. Admin Password Verification

[To be filled during implementation]

---

## API Routes

[To be filled during implementation]

---

## Database Schema (Redis)

[To be filled during implementation]

---

## UI Components

[To be filled during implementation]

---

## Testing Plan

[To be filled during implementation]

---

## Deployment Notes

[To be filled during implementation]

---

*This document will be filled out during implementation with code snippets, architecture diagrams, and technical decisions.*
