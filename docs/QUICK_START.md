# 🚀 Quick Start - Understand the Project in 5 Minutes

**Last Updated**: 2025-11-03
**For**: New developers, code reviewers, AI assistants

---

## 📖 Project Overview

**AI Skin Analyzer** - Skin analysis and sunscreen recommendation system powered by OpenAI Vision API

- **Current Status**: ✅ MVP Deployed to Production
- **Production URL**: https://ai-skin-analyzer.vercel.app
- **Tech Stack**: Next.js 14 + TypeScript + OpenAI Vision API + Upstash Redis

---

## 🏗️ System Architecture (One-Page Overview)

```
┌─────────────┐
│    User     │
│ Upload Photo│
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│  Next.js Frontend (app/page.tsx)│
│  - File Upload UI               │
│  - Results Display Components   │
└──────┬──────────────────────────┘
       │
       │ (Protected by password)
       ▼
┌─────────────────────────────────┐
│  middleware.ts                  │
│  ✓ JWT Cookie Verification      │
│  ✓ /login Route Protection      │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  API Route                      │
│  /api/analyze-skin (POST)       │
│  1. File validation (size/type) │
│  2. Sharp image preprocessing   │
│  3. Call OpenAI Vision API      │
│  4. Redis logging               │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  OpenAI Vision API              │
│  Model: gpt-5-nano              │
│  Returns: JSON skin analysis    │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Upstash Redis (Logging)        │
│  Log each analysis request      │
└─────────────────────────────────┘
```

---

## 🗺️ Code Map

### Core Files (Must Know)

| File Path | Purpose | Priority |
|-----------|---------|----------|
| `app/page.tsx` | Main page: Upload UI + Results display | ⭐⭐⭐ |
| `app/api/analyze-skin/route.ts` | **Core API**: Handle image analysis requests | ⭐⭐⭐ |
| `types/analysis.ts` | TypeScript type definitions (API contract) | ⭐⭐⭐ |
| `middleware.ts` | Password protection middleware | ⭐⭐ |

### Component Directory

```
app/components/
├── FileUpload/          # File upload related components
│   ├── FileUpload.tsx      # Drag-and-drop upload UI
│   └── ImagePreview.tsx    # Image preview
├── Analysis/            # Analysis results display
│   ├── Results.tsx         # Main results component
│   ├── SkinTypeCard.tsx    # Skin type card
│   └── ProductCard.tsx     # Product recommendation card
└── UI/                  # Common UI components
    ├── Button.tsx
    ├── Card.tsx
    └── ErrorMessage.tsx
```

### Utility Libraries

```
lib/
├── api/
│   └── skinAnalysis.ts     # OpenAI Vision API call logic
├── utils/
│   ├── fileValidation.ts   # File validation (type/size checks)
│   ├── errorMessages.ts    # Error message mapping
│   └── localStorage.ts     # Browser storage utilities
├── logging.ts              # Upstash Redis logging
└── jwt.ts                  # JWT generation and verification
```

### Authentication

```
app/login/                  # Login page
middleware.ts               # Global auth middleware
lib/jwt.ts                  # JWT utilities
```

---

## ✅ Implementation Status

### Completed ✅
- ✅ **Image Upload** - Support JPEG/PNG, max 5MB
- ✅ **Image Preprocessing** - Sharp library: resize, EXIF stripping, sRGB conversion
- ✅ **AI Skin Analysis** - OpenAI gpt-5-nano model
- ✅ **Sunscreen Recommendations** - 1-2 specific product recommendations
- ✅ **Results Display** - Skin type, confidence score, characteristic analysis
- ✅ **Password Protection** - JWT-based authentication
- ✅ **Production Deployment** - Vercel auto-deploy

### In Progress ⏳
- ⏳ **Usage Logging** - Upstash Redis (currently in development)
- ⏳ **Admin Dashboard** - View usage statistics

### Not Started ❌
- ❌ User history tracking
- ❌ Before/After comparison
- ❌ Multi-language support
- ❌ User account system

---

## 🔧 Local Development Workflow

### 1. Environment Setup

```bash
# Install dependencies
npm install

# Configure environment variables (.env.local)
OPENAI_API_KEY=sk-xxx...
AUTH_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_key

# Upstash Redis (optional - for logging feature)
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx
```

### 2. Start Development Server

```bash
npm run dev
# Visit: http://localhost:3000
```

### 3. Test API

```bash
# Test image analysis API
curl -X POST -F "file=@test-image.jpg" http://localhost:3000/api/analyze-skin

# Or use project scripts
npm run test:vision
```

### 4. Deploy to Production

```bash
# Method 1: Auto-deploy (Recommended)
git add .
git commit -m "feat: your changes"
git push  # Vercel auto-deploys

# Method 2: Manual deploy
vercel --prod
```

---

## 📊 API Contract Quick Reference

### Request Format
```http
POST /api/analyze-skin
Content-Type: multipart/form-data

file: <image_file>  (JPEG/PNG, max 5MB)
```

### Success Response (200)
```typescript
{
  skinType: "combination",  // oily | dry | combination | normal | sensitive
  confidence: 0.78,         // 0.0 - 1.0
  analysis: {
    observedCharacteristics: ["T-zone shine", "Balanced cheeks"],
    skinTypeExplanation: "..."
  },
  productRecommendation: {
    formulationType: "Oil-free gel",
    formulationReasoning: "...",
    specificProducts: [
      {
        brandName: "Neutrogena",
        productName: "Ultra Sheer Dry-Touch",
        spf: "55",
        keyBenefit: "Lightweight, non-greasy"
      }
    ]
  }
}
```

### Error Responses
```typescript
// 400 Bad Request
{ "error": "InvalidImage" }

// 413 Payload Too Large
{ "error": "FileTooLarge" }

// 415 Unsupported Media Type
{ "error": "UnsupportedType" }

// 500 Internal Server Error
{ "error": "OpenAIError" }
```

**Full Contract**: [docs/CONTRACT-001-MVP.md](./CONTRACT-001-MVP.md)

---

## 📚 Key Documentation Navigation

**New Contributors (5 minutes)**:
1. ⭐ This document (`docs/QUICK_START.md`)
2. ⭐ [docs/completed/README.md](./completed/README.md) - MVP completion summary

**Understanding the Business (10 minutes)**:
3. [docs/01-prd.md](./01-prd.md) - Product Requirements Document
4. [docs/CONTRACT-001-MVP.md](./CONTRACT-001-MVP.md) - API Contract

**Technical Deep Dive (30 minutes)**:
5. [docs/02-technical-spec.md](./02-technical-spec.md) - Technical Specification
6. [docs/decisions/](./decisions/) - Architecture Decision Records (ADRs)
7. [types/analysis.ts](../types/analysis.ts) - Type Definitions

---

## 🐛 Common Issues

### Q1: OpenAI API call fails?
**A**: Check that `OPENAI_API_KEY` in `.env.local` is configured correctly.

### Q2: No response after uploading image?
**A**:
1. Check if file size exceeds 5MB
2. Verify file format is JPEG/PNG
3. Check browser console for error messages

### Q3: Cannot access Redis locally?
**A**: Redis logging is optional. Ensure `.env.local` has Upstash environment variables, or skip logging logic in code.

### Q4: How to test password protection?
**A**:
1. Visit `http://localhost:3000/login`
2. Enter `AUTH_PASSWORD` from `.env.local`
3. On success, redirects to main page

---

## 🎯 Quick Task Checklist

**If you're a new developer, try these tasks to familiarize yourself with the codebase:**

- [ ] Successfully run project locally and upload a test image
- [ ] Modify UI styles in `app/page.tsx` (e.g., button color)
- [ ] Add a console.log in `app/api/analyze-skin/route.ts`
- [ ] Read `lib/api/skinAnalysis.ts` to understand OpenAI API call logic
- [ ] Review `types/analysis.ts` to understand data structures
- [ ] Run test script `scripts/test-api-simple.sh`

---

## 💡 Development Tips

1. **Read type definitions first** - `types/analysis.ts` is key to understanding data flow
2. **Follow ADR decisions** - Check `docs/decisions/` for technical decision rationale
3. **Use Git Worktree** - Project supports parallel branch development (see `worktrees/`)
4. **Reference existing tests** - `experiments/` and `scripts/` have rich test cases

---

**Ready to start? Launch your first task:**
```bash
npm run dev
# Visit http://localhost:3000 and try uploading a photo!
```

---

**Documentation Index**: [docs/README.md](./README.md)
**Project Homepage**: [README.md](../README.md)
**TODO List**: [TODO.md](../TODO.md)
