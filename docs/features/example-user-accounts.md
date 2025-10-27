# Feature: User Accounts

**ID**: FEATURE-001
**Status**: Planning
**Effort**: L (1-2 weeks)
**Priority**: High

## One Line Summary
Allow users to create accounts to save analysis history and track skin progress over time.

## Problem
Users take a photo, get results, then lose them. They can't track if their skin is improving with the recommended products. Every visit is like starting over.

## Solution
Basic authentication with email/password, save each analysis with timestamp, show history on profile page.

### What's Included
- Email/password registration
- Login/logout functionality
- Profile page with analysis history
- Compare 2 photos side-by-side
- Delete old analyses

### What's NOT Included
- Social login (Google/Facebook) - v2
- Sharing profiles publicly - v2
- Comments on analyses - v2
- Multiple skin profiles - v2

## Success Criteria
- [ ] User can create account in < 30 seconds
- [ ] All past analyses are viewable
- [ ] Can compare before/after photos
- [ ] 40% of users create accounts
- [ ] 60% of accounts have 2+ analyses

## Technical Notes
```
// Key changes needed:
- Add Supabase for auth + database
- New tables: users, analyses
- Protect /api/analyze-skin (optional)
- Add middleware for auth routes
- Store images in Supabase Storage

// Decision needed:
- Make accounts optional or required?
- Keep anonymous mode?
```

## Open Questions
- [ ] Should we require accounts or keep anonymous option?
- [ ] Store images or just analysis results?
- [ ] GDPR compliance needed for EU users?
- [ ] Free tier limits (10 analyses/month)?

---
*Note: This changes architecture from stateless to stateful. Need ADR-007 before starting.*