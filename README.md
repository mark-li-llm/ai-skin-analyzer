# Skin Analysis App

## 🎯 Mission
AI-powered skin analysis app that provides personalized product recommendations based on uploaded photos.

## 📖 For AI Assistants / Claude Code

**🚀 Ready to implement MVP? Start here:**

1. **Read the API contract**: [docs/CONTRACT-001-MVP.md](docs/CONTRACT-001-MVP.md) ⭐⭐⭐
2. **Check your tasks**: [docs/completed/SPRINT-001-MVP.md](docs/completed/SPRINT-001-MVP.md) ⭐⭐
3. **Use shared types**: [types/analysis.ts](types/analysis.ts) ⭐⭐⭐
4. **Frontend mock data**: [public/mocks/](public/mocks/) (for parallel dev)

**Full navigation**: [docs/README.md](docs/README.md) | **AI instructions**: [CLAUDE.md](CLAUDE.md)

> **Note**: CONTRACT-001-MVP.md is the authoritative source for implementation. All other docs are context/reference.


## 🏗️ Tech Stack

(See [docs/decisions/](docs/decisions/) for technical ADRs)

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes (integrated backend)
- **AI**: OpenAI Vision API (gpt-5-nano model per ADR-004)
- **Database**: None (stateless MVP - no persistence)
- **Hosting**: Vercel


## 🔄 Current Status

- [x] Phase 0: Repository Setup & Planning (Complete)
- [x] Phase 1: Documentation & Design (Complete)
- [x] Phase 2: OpenAI Integration Testing (Complete ✅)
- [x] Phase 3: Technical Decisions & Verification (Complete ✅)
- [x] Phase 4: MVP Implementation (Complete ✅)
- [x] Phase 5: Testing & Production Deployment (Complete ✅)
- [ ] Phase 6: Beta Launch & User Feedback

**🎉 MVP LIVE IN PRODUCTION**

**Latest**:
- ✅ Frontend MVP implemented with complete UI/UX components
- ✅ Backend API deployed to Vercel with OpenAI Vision integration
- ✅ End-to-end testing completed (all tests passing)
- ✅ Production deployment successful with performance validation
- ✅ Real-time skin analysis working with gpt-5-nano model
- 📊 **Currently monitoring production usage and performance**


## 🚀 Quick Start

### Prerequisites

- Node.js 18.17.0+ (required for Next.js 14)
- OpenAI API key (gpt-5-nano model)

### Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your OPENAI_API_KEY

# Run development server
npm run dev
```

### Key Development Commands

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run lint        # Run ESLint
```

## 📚 Documentation

**Start here**: [docs/README.md](docs/README.md) - Complete documentation index

**For Implementation** (Read First):
- [API Contract](docs/CONTRACT-001-MVP.md) ⭐⭐⭐ - Single source of truth
- [Sprint Plan](docs/completed/SPRINT-001-MVP.md) ⭐⭐ - MVP task checklist (completed)
- [Type Definitions](types/analysis.ts) ⭐⭐⭐ - Shared TypeScript types
- [Mock Data](public/mocks/) ⭐⭐ - Frontend parallel dev

**Planning Documents**:
- [Product Requirements](docs/01-prd.md) - What we're building and why
- [Technical Spec](docs/02-technical-spec.md) - Architecture & tech stack
- [Prompt Engineering](docs/05-prompt-engineering.md) - OpenAI prompt definition
- [Deployment Guide](docs/06-deployment.md) - Vercel deployment
- [Testing Strategy](docs/07-testing-strategy.md) - Test approach

**Technical Decisions** ([decisions/](docs/decisions/)):
- ADR-004: OpenAI Model Selection (gpt-5-nano)
- ADR-005: Image Processing Library (sharp, verified ✅)
- ADR-006: File Upload Handling (Next.js native FormData)



## 📋 Quick Links

- [Documentation Index](docs/README.md) - Complete navigation
- [SPRINT-001 MVP Plan](docs/completed/SPRINT-001-MVP.md) - Parallel dev scope and tasks (completed)
- [Current Work](TODO.md) - Work tracking
- [Mock Data](public/mocks/) - Frontend development



## 📝 License

TBD
