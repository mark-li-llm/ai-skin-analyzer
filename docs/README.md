# Documentation Index

Welcome to the AI Skin Analyzer documentation. This index helps you find the right document for your needs.

---

## ✅ MVP Status: **COMPLETED & DEPLOYED** 🎉

**Production URL**: https://ai-skin-analyzer.vercel.app
**Completion Date**: 2025-10-27
**Status**: Live in production, fully functional

📖 **Implementation Summary**: [completed/README.md](./completed/README.md)

---

## 🎯 Current Phase: Post-MVP Monitoring

**For new contributors or code review:**

| Document | Purpose | Priority |
|----------|---------|----------|
| [**completed/README.md**](./completed/README.md) | MVP completion summary & implementation overview | ⭐⭐⭐ |
| [**CONTRACT-001-MVP.md**](./CONTRACT-001-MVP.md) | API contract (reference) | ⭐⭐ |
| [**types/analysis.ts**](../types/analysis.ts) | TypeScript type definitions | ⭐⭐⭐ |

---

## 📋 Planning Documents

**Background and architecture (less frequently changed):**

| Document | Purpose |
|----------|---------|
| [01-prd.md](./01-prd.md) | Product requirements and core features |
| [02-technical-spec.md](./02-technical-spec.md) | Architecture, tech stack, and infrastructure |
| [05-prompt-engineering.md](./05-prompt-engineering.md) | OpenAI Vision API prompt definition |
| [06-deployment.md](./06-deployment.md) | Vercel deployment guide |
| [07-testing-strategy.md](./07-testing-strategy.md) | Testing approach and criteria |

---

## 🗂️ Technical Decisions

**Architecture Decision Records (ADRs):**

Located in [decisions/](./decisions/):
- [004-openai-model-selection.md](./decisions/004-openai-model-selection.md) - Why we chose gpt-5-nano
- [005-image-processing-library.md](./decisions/005-image-processing-library.md) - Why we chose Sharp
- [006-file-upload-handling.md](./decisions/006-file-upload-handling.md) - File upload strategy

**Related Research**:
- [research/adr006-file-upload-comparison.md](../research/adr006-file-upload-comparison.md)

---

## 📦 Completed Implementation

**MVP implementation documents (archived for reference):**

Located in [completed/](./completed/):
- [**README.md**](./completed/README.md) - MVP completion summary ⭐
- [IMPLEMENTATION-BACKEND-001.md](./completed/IMPLEMENTATION-BACKEND-001.md) - Backend implementation
- [IMPLEMENTATION-FRONTEND-001.md](./completed/IMPLEMENTATION-FRONTEND-001.md) - Frontend implementation
- [REVIEW-IMPLEMENTATION-FRONTEND-001.md](./completed/REVIEW-IMPLEMENTATION-FRONTEND-001.md) - Frontend code review
- [SPRINT-001-MVP.md](./completed/SPRINT-001-MVP.md) - Sprint plan & checklist
- [METADATA-STRIPPING-VERIFICATION.md](./completed/METADATA-STRIPPING-VERIFICATION.md) - Security validation
- [testing/](./completed/testing/) - Testing results and reports

---

## ⚠️ Deprecated / Not Applicable

**Do not use these documents for implementation:**

| Document | Status | Reason |
|----------|--------|--------|
| [03-database-schema.md](./03-database-schema.md) | ⚠️ N/A for MVP | MVP is stateless, no database |
| [04-api-documentation.md](./04-api-documentation.md) | ⚠️ DEPRECATED | Superseded by CONTRACT-001-MVP.md |

These files are kept for historical reference and future planning only.

---

## 📖 Document Lifecycle

### Planning Phase (October 19)
- Created 01-07: PRD, specs, and strategy documents
- Status: Foundation documents, rarely updated

### Implementation Phase (October 24+)
- Created CONTRACT-001-MVP.md: API contract
- Created SPRINT-001-MVP.md: Execution plan
- Created types/analysis.ts: Type definitions
- Status: Active development, frequently updated

### Decision Phase (Ongoing)
- ADRs created as technical decisions are made
- Each ADR documents WHY a choice was made

---

## 🔄 How to Use This Documentation

### For New Contributors / Code Review
1. Read [completed/README.md](./completed/README.md) for MVP overview
2. Review [completed/IMPLEMENTATION-BACKEND-001.md](./completed/IMPLEMENTATION-BACKEND-001.md) and [completed/IMPLEMENTATION-FRONTEND-001.md](./completed/IMPLEMENTATION-FRONTEND-001.md)
3. Check [CONTRACT-001-MVP.md](./CONTRACT-001-MVP.md) for API specification
4. Import types from `types/analysis.ts`

### For Feature Development
1. Read [01-prd.md](./01-prd.md) and [02-technical-spec.md](./02-technical-spec.md) for context
2. Check existing ADRs in [decisions/](./decisions/) for technical constraints
3. Create new ADR if making significant architectural changes
4. Follow the template in [decisions/template.md](./decisions/template.md)

### For Understanding Past Decisions
1. Check ADRs in [decisions/](./decisions/) for "why" behind technical choices
2. Review [completed/](./completed/) for implementation details
3. See [completed/testing/](./completed/testing/) for test coverage

---

## 📊 Document Priority Matrix

```
┌─────────────────────────────────────────────────┐
│  MUST READ (MVP Complete - Code Review)        │
│  • completed/README.md                          │
│  • types/analysis.ts                            │
│  • CONTRACT-001-MVP.md (reference)              │
└─────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────┐
│  SHOULD READ (Implementation Details)           │
│  • completed/IMPLEMENTATION-BACKEND-001.md      │
│  • completed/IMPLEMENTATION-FRONTEND-001.md     │
│  • completed/testing/*                          │
└─────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────┐
│  CAN READ (Context & Strategy)                  │
│  • 01-prd.md                                    │
│  • 02-technical-spec.md                         │
│  • 05-prompt-engineering.md                     │
│  • decisions/*.md (ADRs)                        │
└─────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────┐
│  ARCHIVED (Not Applicable)                      │
│  • archive/03-database-schema.md                │
│  • archive/04-api-documentation.md              │
└─────────────────────────────────────────────────┘
```

---

## 🆘 Quick Links

- **Project Root**: [Main README](../README.md)
- **ADR Template**: [decisions/template.md](./decisions/template.md)
- **Type Definitions**: [types/analysis.ts](../types/analysis.ts)
- **Legal Disclaimers**: [legal/disclaimers.md](../legal/disclaimers.md)

---

**Last Updated**: 2025-10-27
**Status**: MVP Complete & Deployed to Production
