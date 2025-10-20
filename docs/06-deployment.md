# Deployment Guide

**Version**: 0.1
**Last Updated**: 2025-10-19

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