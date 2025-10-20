# Skin Analysis App

## 🎯 Mission
AI-powered skin analysis app that provides personalized product recommendations based on uploaded photos.

## 📖 For AI Assistants / Claude Code
**See [CLAUDE.md](CLAUDE.md) for AI-specific instructions.**
**See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for project organization.**

> **Note**: Currently in documentation phase. Only `docs/` and `workflow/` contain actual content. Other folders are empty scaffolding.


## 🏗️ Tech Stack

(See [docs/decisions/](docs/decisions/) for technical ADRs)

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes (integrated backend)
- **AI**: OpenAI Vision API (gpt-5-nano model per ADR-004)
- **Database**: None (stateless MVP - no persistence)
- **Hosting**: Vercel


## 🔄 Current Status

- [x] Phase 0: Repository Setup & Planning
- [x] Phase 1: Documentation & Design (Complete)
- [ ] Phase 2: OpenAI Integration Testing (Current)
- [ ] Phase 3: MVP Development
- [ ] Phase 4: Testing & Iteration
- [ ] Phase 5: Beta Launch

**Latest**: All documentation complete (`docs/` folder). Ready to test OpenAI Vision API integration with gpt-5-nano model.


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

# Check project status
make status

# Run development server
npm run dev
```

### Key Workflow Commands

```bash
make status          # Check documentation status & TBDs
make help           # Show all available commands
make decision       # Create a new ADR
make commit         # Commit with automatic checks
make check          # Validate documentation
npm run dev         # Start development server (once built)
npm run build       # Build for production
npm run test        # Run tests
```

## 📚 Documentation

- [Product Requirements](docs/01-prd.md) - What we're building and why
- [Technical Spec](docs/02-technical-spec.md) - Architecture & API design
- [Database Schema](docs/03-database-schema.md) - Data models
- [API Documentation](docs/04-api-documentation.md) - Endpoint reference
- [Prompt Engineering](docs/05-prompt-engineering.md) - OpenAI prompt iterations
- [Deployment Guide](docs/06-deployment.md) - How to deploy
- [Testing Strategy](docs/07-testing-strategy.md) - Test approach



## 📋 Quick Links

- [Current Sprint](TODO.md) - What I'm working on now
- [Ideas & Notes](NOTES.md) - Random thoughts and experiments
- [Changelog](CHANGELOG.md) - What's been done
- [Roadmap](planning/roadmap.md) - Where we're headed



## 📝 License

TBD
