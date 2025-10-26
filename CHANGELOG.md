# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### In Progress
- MVP frontend implementation (landing page + upload + results display)
- MVP backend implementation (/api/analyze-skin endpoint)

---

## [0.2.0] - 2025-10-25

### Added
- **Documentation Architecture Refactor**:
  - Created `docs/README.md` as documentation navigation hub
  - Marked `docs/03-database-schema.md` as N/A for MVP
  - Marked `docs/04-api-documentation.md` as DEPRECATED (superseded by CONTRACT-001-MVP.md)
  - Established `docs/CONTRACT-001-MVP.md` as AUTHORITATIVE source
- **ADR-006: File Upload Handling Strategy**:
  - Decision: Use Next.js native `Request.formData()` API
  - Created detailed technical comparison: `research/adr006-file-upload-comparison.md`
- **Mock Data Infrastructure**:
  - Created `public/mocks/` directory
  - Added `analysis-success.json` (combination skin example)
  - Added `analysis-error-file-too-large.json`
  - Created mock data usage guide in `public/mocks/README.md`

### Changed
- Updated `README.md` to reference new documentation structure
- Updated `TODO.md` with complete 2025-10-25 progress
- Removed redundant `AGENTS.md` (replaced by docs/README.md)

### Fixed
- Corrected SPRINT-001-MVP.md path references in README.md
- Fixed outdated status messages in project documentation

---

## [0.1.5] - 2025-10-24

### Added
- **CONTRACT-001-MVP.md**: Authoritative API contract for parallel frontend/backend development
- **SPRINT-001-MVP.md**: MVP sprint task checklist with definition of done
- **ADR-005: Image Processing Library Selection**:
  - Created decision document (status: Proposed, pending verification)
  - Documented sharp vs jimp comparison
  - Created research document: `research/adr005-image-processing-comparison.md`
- **Vercel Sharp Verification**:
  - Deployed sharp test to Vercel
  - Created 4 verification documents in `experiments/`:
    - `adr005-sharp-vercel-verification.md`
    - `adr005-sharp-test-results.md`
    - `adr005-local-verification-results.md`
    - `adr005-vercel-deployment-info.md`
  - ✅ Confirmed sharp works perfectly on Vercel

---

## [0.1.0] - 2025-10-23

### Added
- **Next.js 14 Project Initialization**:
  - Set up with App Router, TypeScript, Tailwind CSS, ESLint
  - Created basic app directory structure with layout and landing page
  - Verified development server runs successfully
- **TypeScript Type Definitions**:
  - Created `types/analysis.ts` with complete API contract types
  - Defined `SkinType`, `SkinAnalysisResult`, `ApiError` interfaces
  - Established as single source of truth for type definitions
- **OpenAI Vision API Validation**:
  - Successfully tested gpt-5-nano with production prompt
  - Created `experiments/TEST_RESULTS.md` documenting:
    - Skin type classification: 80% confidence (accurate)
    - Product recommendations: Relevant and specific
    - Cost: $0.0011 per analysis
  - ✅ Prompt declared production-ready
- **Model Configuration**:
  - Fixed gpt-5-nano parameters (max_completion_tokens: 3000)
  - Validated temperature defaults

---

## [0.0.1] - 2025-10-19

### Added
- **Repository Setup**:
  - Initial project structure
  - Core project files (README, TODO, NOTES, CHANGELOG)
  - Development workflow templates
- **Documentation Framework** (docs 01-07):
  - Product Requirements Document (PRD)
  - Technical Specification
  - Database Schema (for future reference, N/A for MVP)
  - API Documentation
  - Prompt Engineering guide
  - Deployment Guide
  - Testing Strategy
- **ADR-004: OpenAI Model Selection**:
  - Decision: gpt-5-nano for cost efficiency
  - Documented model comparison and rationale
- **Project Infrastructure**:
  - Planning directory with roadmap and user stories
  - Research directory structure
  - Legal documentation templates
  - Scripts for setup and testing
  - GitHub issue templates
  - Makefile with workflow commands

---

## Version Roadmap

- **0.0.1** (Oct 19) - Initial setup and planning ✅
- **0.1.0** (Oct 23) - Next.js setup + OpenAI validation ✅
- **0.1.5** (Oct 24) - Technical decisions + Vercel verification ✅
- **0.2.0** (Oct 25) - Documentation refactor + Mock data ✅
- **0.3.0** (Planned) - MVP implementation (API + frontend)
- **0.4.0** (Planned) - E2E testing + deployment
- **1.0.0** (Planned) - Public beta launch

---

## Migration Notes

### From 0.1.5 to 0.2.0
- `AGENTS.md` removed → Use `docs/README.md` instead
- `docs/04-api-documentation.md` deprecated → Use `docs/CONTRACT-001-MVP.md`
- `docs/03-database-schema.md` marked N/A for MVP
- All references to `planning/SPRINT-001-MVP.md` → `docs/SPRINT-001-MVP.md`

---

**Last Updated**: 2025-10-25
