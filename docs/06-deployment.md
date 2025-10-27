# Deployment Guide

**Version**: 0.2
**Last Updated**: 2025-10-27

## Overview

Single Next.js application deployed to Vercel. No separate frontend/backend - everything runs as one app with API Routes.

## Hosting Platform

**Vercel** (per technical spec)
- Automatic deployment from GitHub
- Serverless functions for API routes
- Edge network for static assets
- Zero configuration needed for Next.js

## Environment Variables

```bash
OPENAI_API_KEY=sk-...    # Required: OpenAI API access
```

No database credentials needed (stateless MVP).

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

## Implementation Status

**Not yet implemented** - No code exists yet to deploy.

### Pending Decisions (TBD)
- Custom domain name
- Monitoring/error tracking tools
- Rate limiting implementation approach

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