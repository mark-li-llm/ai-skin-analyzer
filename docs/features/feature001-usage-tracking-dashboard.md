# Feature: Usage Tracking & Admin Dashboard

**ID**: FEATURE-002
**Status**: Planning
**Created**: 2025-11-03
**Owner**: Product & Engineering

---

## Purpose (Why)

As a **developer/product owner**, I need to monitor product usage to:
- Understand who is using the product and how often
- Track analysis results to evaluate AI performance
- Identify issues and make data-driven improvements

**Critical**: This is a **purely internal admin tool**. Usage data should NOT be accessible to unauthorized users.

---

## Current Context (Important Constraints)

### Two-Layer Password Protection

**1. Site-wide password** (`AUTH_PASSWORD`)
- **Purpose**: Prevent OpenAI API abuse (cost control)
- **Who has it**: All authorized users
- **Protects**: Main application and API endpoints

**2. Admin password** (`ADMIN_PASSWORD`)
- **Purpose**: Protect internal usage data (admin-only access)
- **Who has it**: Administrators only
- **Protects**: Admin dashboard and analytics

**Why separate passwords**: Regular users need access to the product functionality, but analytics should remain strictly admin-only.

---

## Key Decisions

| # | Decision | Approach | Rationale |
|---|----------|----------|-----------|
| **1** | **User Identification** | Free text input (optional) + Anonymous fallback | Users can optionally enter names for tracking across sessions; anonymous IDs generated if left blank. Balances tracking with privacy. |
| **2** | **Admin Access Control** | Separate admin password | Analytics contain sensitive usage data and should only be accessible to administrators, not regular users. |
| **3** | **Dashboard Visualization** | Simple tables first (charts in Phase 2) | Ship fast; prioritize data completeness over visual polish. Charts can be added later when we have more data to analyze. |
| **4** | **Admin Entry Points** | Hidden (keyboard shortcut + footer link) | Keep UI clean for regular users with no visible admin links. Keyboard shortcut (`Ctrl+Shift+A`) for quick access; subtle footer link as fallback. |

---

## Scope

### What's Included (MVP)
- User identification mechanism (optional name input or anonymous)
- Usage logging integration for all skin analyses
- Admin dashboard with 4 statistics views (recent logs, user stats, totals, deduplication)
- Hidden admin entry points (keyboard shortcut + footer link)
- Admin password protection (separate from site password)

### What's NOT Included
- CSV/Excel export (Phase 2)
- Charts and visualizations (Phase 2)
- Advanced filtering and search (Phase 2)
- Real-time dashboard updates (Phase 2)
- User profiles and history (Phase 3)

---

## Success Criteria

### Must Have
- [ ] Every skin analysis is logged with complete metadata
- [ ] Admin dashboard exists at `/admin` and shows all 4 stat categories
- [ ] Dashboard is protected by admin password (separate from site password)
- [ ] Regular users have clean UI with no visible admin elements
- [ ] Users can identify themselves (optional name or anonymous)
- [ ] Same user can be tracked across sessions (if they use same name)
- [ ] Logging failures don't break the main analysis flow
- [ ] Works in both development and production environments

### Performance
- [ ] Dashboard loads in < 2 seconds
- [ ] Logging adds < 100ms overhead to API response time

---

## Resolved Questions

- [x] **Should we log IP addresses?** → **YES, record full IP**
  - Internal tool with small trusted user base (friends + team)
  - Valuable for debugging and anomaly detection
  - Risk mitigation: Redis password-protected, logs expire after 1 year

- [x] **How long to retain logs?** → **365 days (1 year)**
  - Low usage volume (~960 entries/year ≈ 1MB storage)
  - Well within Upstash Redis free tier limits
  - Sufficient for annual trend analysis

---

*For technical implementation details, see `feature001-usage-tracking-dashboard-implementation.md`*
