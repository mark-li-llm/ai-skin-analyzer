# Deployment Guide

**Version**: 1.1 (Updated with Production Experience + Security)
**Last Updated**: 2025-10-27
**Status**: ✅ **Live in Production**

## Overview

Single Next.js application deployed to Vercel. No separate frontend/backend - everything runs as one app with API Routes.

## Hosting Platform

**Vercel** (per technical spec)
- Automatic deployment from GitHub
- Serverless functions for API routes
- Edge network for static assets
- Zero configuration needed for Next.js

## Environment Variables

### Production Environment (Vercel Dashboard)

```bash
OPENAI_API_KEY=sk-...    # Required: OpenAI API access (encrypted by Vercel)
```

**Security Notes**:
- ✅ API key stored encrypted in Vercel Dashboard
- ✅ Never commit API keys to git
- ✅ Use `.env.local` for local development (gitignored)
- ✅ No database credentials needed (stateless MVP)

### Local Development Setup

```bash
# Create .env.local (not tracked in git)
cp .env.example .env.local

# Add your OpenAI API key
echo "OPENAI_API_KEY=sk-your-key-here" >> .env.local
```

## Deployment Process

### Initial Setup
1. Connect GitHub repository to Vercel
2. Vercel auto-detects Next.js configuration
3. Set environment variable: `OPENAI_API_KEY`
4. Deploy

### Subsequent Deployments
- **Production**: Push to `main` branch → Auto-deploy
- **Preview**: Any pull request → Auto-deploy preview URL

## Environments

- **Local Development**: `npm run dev` on localhost:3000
- **Production**: Vercel production URL

No staging environment defined for MVP.

## Vercel Configuration

### Function Settings (`vercel.json`)

<<<<<<< HEAD
```json
{
  "functions": {
    "app/api/*/route.ts": {
      "maxDuration": 60,     // 60s timeout for OpenAI API calls
      "memory": 1024         // 1GB memory for image processing
    }
  }
}
```

**Configuration Rationale**:
- **60s timeout**: OpenAI Vision API typically responds in 3-5s, but we allow 60s for edge cases
- **1GB memory**: Sufficient for Sharp image processing + API operations (typical usage: 400-500MB)

---

## Actual Deployment Experience (2025-10-27)

### Initial Deployment ✅

**Timeline**:
- **2025-10-26**: Backend API implemented and tested locally
- **2025-10-27**: Frontend completed and integrated
- **2025-10-27**: First production deployment via `git push`

**Process**:
```bash
# 1. Ensure all tests pass locally
npm run build
npm run lint

# 2. Commit and push to main
git add .
git commit -m "feat: Implement complete MVP"
git push origin main

# 3. Vercel automatically builds and deploys (2-3 minutes)
```

### Challenges Encountered & Solutions

#### Challenge 1: ESLint Configuration ⚠️
**Issue**: Vercel couldn't detect ESLint configuration during build
**Error**: "ESLint configuration not found"
**Solution**: Added `"root": true` to `.eslintrc.json`
```json
{
  "root": true,
  "extends": "next/core-web-vitals"
}
```
**Git Commit**: `78e80a5 chore: Add root flag to ESLint config`

#### Challenge 2: API Route Detection ⚠️
**Issue**: Vercel initially had trouble detecting API routes
**Solution**: Verified `vercel.json` function configuration matches route patterns
**Status**: Resolved automatically after vercel.json configuration
**Git Commit**: `3a41e33 fix: Resolve Vercel deployment and API route detection`

#### Challenge 3: HTML Entity Escaping 🐛
**Issue**: Apostrophes in product names breaking HTML rendering
**Error**: `Don&apos;t` appearing in UI
**Solution**: Used HTML entities (`&apos;`) in JSX strings
**Git Commit**: `1388042 fix(lint): Escape apostrophe with HTML entity in ProductSection`

### Production Validation ✅

**Automated Testing** (`test-production.sh`):
```bash
./test-production.sh
# ✅ API endpoint detection: PASS
# ✅ Health check: PASS
# ✅ Error handling: PASS
# ✅ Response format: PASS
```

**Manual Testing**:
- ✅ Upload JPEG image → Analysis succeeds
- ✅ Upload PNG image → Analysis succeeds
- ✅ Upload >5MB file → Error 413 (FileTooLarge)
- ✅ Upload TXT file → Error 415 (UnsupportedType)
- ✅ Mobile responsive design → Working correctly

---

## Current Production Status

### Deployment Details

| Property | Value |
|----------|-------|
| **Platform** | Vercel |
| **Project ID** | `prj_4lcbN16Jq31nAMSI1LNUoeRghtmz` |
| **Organization** | `team_r87heu2yiuwyDEob6g0MNDfg` |
| **Project Name** | `ai-skin-analyzer` |
| **Branch** | `main` (auto-deploy) |
| **Framework** | Next.js 14 |
| **Node.js** | 18.17.0+ |
| **Build Time** | ~2-3 minutes |
| **Status** | ✅ **Live and Operational** |

### Performance Metrics (Production)

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| API Response Time | <60s | 3-5s | ✅ 92% better |
| Function Memory | <1024MB | ~400-500MB | ✅ 50% usage |
| Build Time | <5min | ~2-3min | ✅ Excellent |
| Cold Start | <3s | ~1-2s | ✅ Acceptable |

---

## Monitoring & Maintenance

### Current Monitoring

**Vercel Dashboard** (Automatic):
- ✅ Build logs
- ✅ Function logs
- ✅ Error tracking
- ✅ Performance metrics
- ✅ Bandwidth usage

**Access**: Via Vercel Dashboard → ai-skin-analyzer project

### Recommended Additions (Future)

- [ ] Custom request logging (e.g., Logtail, Datadog)
- [ ] Error tracking service (e.g., Sentry)
- [ ] Uptime monitoring (e.g., Better Stack, Pingdom)
- [ ] Analytics dashboard (custom or Vercel Analytics)

### Maintenance Schedule

- **Daily**: Check Vercel dashboard for errors (first week)
- **Weekly**: Review function logs and performance
- **Monthly**: Analyze usage patterns and costs

---

## Rollback Procedure

### Quick Rollback (Vercel Dashboard)

1. Navigate to: Vercel Dashboard → ai-skin-analyzer → Deployments
2. Find the last known good deployment
3. Click "Promote to Production"
4. Confirm rollback

**Recovery Time**: ~30 seconds

### Git-based Rollback

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or rollback multiple commits
git reset --hard <good-commit-hash>
git push --force origin main  # Use with caution!
```

**Recovery Time**: ~2-3 minutes (build time)

---

## Lessons Learned & Best Practices

### What Worked Well ✅

1. **Automatic Deployment**: Git push → Live in 2-3 minutes is incredibly efficient
2. **Zero Configuration**: Vercel auto-detected Next.js setup correctly
3. **Environment Variables**: Secure storage in Vercel dashboard worked perfectly
4. **Build Validation**: ESLint and TypeScript errors caught during build
5. **Function Configuration**: `vercel.json` settings were sufficient

### Best Practices Established

1. **Always test locally first**: Run `npm run build` before pushing
2. **Use `.env.local` for secrets**: Never commit API keys
3. **Configure ESLint properly**: Add `"root": true` for monorepo-style projects
4. **Monitor first deployments**: Watch Vercel dashboard during initial deploy
5. **Test production immediately**: Run validation scripts post-deployment

### Future Improvements

- [ ] **Custom Domain**: Add professional domain name
- [ ] **Rate Limiting**: Implement Vercel Edge Middleware for rate limiting
- [ ] **Caching Strategy**: Consider caching for repeated analyses (low priority)
- [ ] **Staging Environment**: Create preview branch for testing major changes
- [ ] **CI/CD Enhancements**: Add automated tests in Vercel build process

---

## Troubleshooting Guide

### Common Issues & Solutions

#### Issue: Build Fails with "ESLint not found"
**Solution**: Add `"root": true` to `.eslintrc.json`

#### Issue: API Route returns 404
**Solution**: Verify `vercel.json` function patterns match your route structure

#### Issue: Environment variable not working
**Solution**:
1. Check Vercel Dashboard → Settings → Environment Variables
2. Ensure variable is set for "Production" environment
3. Redeploy after adding/changing variables

#### Issue: Function timeout
**Solution**:
1. Check `vercel.json` → `maxDuration` (currently 60s)
2. Optimize OpenAI API call if needed
3. Consider increasing timeout (max 300s on paid plans)

#### Issue: Memory limit exceeded
**Solution**:
1. Check image processing logic (Sharp)
2. Verify `vercel.json` → `memory` (currently 1024MB)
3. Optimize buffer handling if needed

---

## Cost Estimation

### Current Usage (MVP - Free Tier)

- **Vercel**: Free tier (sufficient for MVP)
- **Bandwidth**: Within free limits
- **Build Minutes**: Within free limits
- **Serverless Executions**: Within free limits

### Estimated Costs (Paid Usage)

| Service | Usage | Est. Cost/Month |
|---------|-------|-----------------|
| Vercel Pro | If needed | $20 |
| OpenAI API | ~$0.01-0.05/request | $10-50 (1000 requests) |
| Custom Domain | Optional | $12/year |
| Monitoring | Optional | $0-50 |

**Total (Low Traffic)**: ~$10-50/month
**Total (High Traffic)**: ~$100-200/month (5000+ requests)

---

## Security Considerations

### Implemented Security Measures

- ✅ API keys encrypted in Vercel
- ✅ HTTPS enforced (Vercel automatic)
- ✅ EXIF metadata stripping (privacy)
- ✅ File type validation
- ✅ File size limits
- ✅ Magic number verification
- ✅ No disk persistence (in-memory only)

### Pending Security Enhancements

- [ ] Rate limiting (prevent abuse)
- [ ] CAPTCHA (optional, if abuse detected)
- [ ] IP-based throttling
- [ ] Request logging (audit trail)

---

## Documentation References

**Detailed Deployment Report**: [DEPLOYMENT-PRODUCTION-001.md](DEPLOYMENT-PRODUCTION-001.md)

**Related Documentation**:
- [MVP Completion Report](MVP-COMPLETION-REPORT.md) - Full project summary
- [Test Summary](TEST-SUMMARY.md) - Testing results
- [CONTRACT-001-MVP.md](CONTRACT-001-MVP.md) - API contract

**Vercel Documentation**:
- [Vercel Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js Deployment](https://vercel.com/docs/frameworks/nextjs)

---

## Quick Reference Commands

```bash
# Local development
npm run dev                    # Start dev server
npm run build                  # Test production build
npm run lint                   # Run ESLint

# Testing
./scripts/test-api-simple.sh      # Quick API test
./scripts/test-production.sh      # Production validation

# Deployment
git push origin main           # Auto-deploy to production

# Monitoring
# Visit: https://vercel.com/dashboard
```

---

**Document Status**: Production-Ready
**Maintenance**: Update after major deployments
**Next Review**: After first month of production usage

---

## Security & Access Control

**Added**: October 2025 (Product protection against unauthorized access)

### Purpose
Protect the MVP from unauthorized access and potential abuse during early deployment phase.

### Implementation Details
- **Technology**: Next.js Middleware (native solution)
- **Auth Method**: Single shared password
- **Session**: Secure httpOnly cookie
- **Protected Routes**: All routes except /login

### Environment Configuration
```bash
# Required in production (.env.local or Vercel Environment Variables)
AUTH_PASSWORD=secure_password_here  # Strong password required (16+ characters recommended)
```

### Security Notes
- Password must be strong (recommend 16+ characters)
- Can support multiple passwords if needed
- Easy to remove after public launch
- No impact on application performance
- Middleware runs at Edge Runtime for minimal latency

### Removal Plan
Once the product is ready for public launch, simply:
1. Delete the middleware file
2. Remove AUTH_PASSWORD from environment variables
3. Delete the /login route
4. Redeploy to Vercel
