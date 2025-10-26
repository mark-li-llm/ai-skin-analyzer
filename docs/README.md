# Documentation Index

Welcome to the AI Skin Analyzer documentation. This index helps you find the right document for your needs.

---

## 🚀 For Implementation (Read These First)

**If you're implementing the MVP, start here:**

| Document | Purpose | Priority |
|----------|---------|----------|
| [**CONTRACT-001-MVP.md**](./CONTRACT-001-MVP.md) | API contract (single source of truth) | ⭐⭐⭐ |
| [**SPRINT-001-MVP.md**](./SPRINT-001-MVP.md) | Sprint tasks and checklist | ⭐⭐ |
| [**types/analysis.ts**](../types/analysis.ts) | TypeScript type definitions | ⭐⭐⭐ |

**Quick Start**:
1. Read CONTRACT-001-MVP.md to understand the API specification
2. Import types from `types/analysis.ts` in your code
3. Follow SPRINT-001-MVP.md checklist for parallel development

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
- [006-file-upload-handling.md](./decisions/006-file-upload-handling.md) - File upload strategy

**Related Research**:
- [research/adr006-file-upload-comparison.md](../research/adr006-file-upload-comparison.md)

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

### For Frontend Developers
1. Read [CONTRACT-001-MVP.md](./CONTRACT-001-MVP.md) sections 1, 4, 5, 7
2. Import types from `types/analysis.ts`
3. Use mock data (to be created in `public/mocks/`)
4. Follow frontend checklist in [SPRINT-001-MVP.md](./SPRINT-001-MVP.md)

### For Backend Developers
1. Read [CONTRACT-001-MVP.md](./CONTRACT-001-MVP.md) sections 1-6
2. Import types from `types/analysis.ts`
3. Reference [05-prompt-engineering.md](./05-prompt-engineering.md) for OpenAI prompt
4. Follow backend checklist in [SPRINT-001-MVP.md](./SPRINT-001-MVP.md)

### For Decision Making
1. Check existing ADRs in [decisions/](./decisions/)
2. If making a new technical decision, create a new ADR
3. Follow the template in [decisions/template.md](./decisions/template.md)

---

## 📊 Document Priority Matrix

```
┌─────────────────────────────────────────────────┐
│  MUST READ for Implementation                   │
│  • CONTRACT-001-MVP.md                          │
│  • types/analysis.ts                            │
│  • SPRINT-001-MVP.md                            │
└─────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────┐
│  SHOULD READ for Context                        │
│  • 01-prd.md                                    │
│  • 02-technical-spec.md                         │
│  • 05-prompt-engineering.md                     │
└─────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────┐
│  CAN READ for Reference                         │
│  • 06-deployment.md                             │
│  • 07-testing-strategy.md                       │
│  • decisions/*.md                               │
└─────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────┐
│  IGNORE for MVP                                 │
│  • 03-database-schema.md                        │
│  • 04-api-documentation.md                      │
└─────────────────────────────────────────────────┘
```

---

## 🆘 Quick Links

- **Project Root**: [Main README](../README.md)
- **ADR Template**: [decisions/template.md](./decisions/template.md)
- **Type Definitions**: [types/analysis.ts](../types/analysis.ts)
- **Legal Disclaimers**: [legal/disclaimers.md](../legal/disclaimers.md)

---

**Last Updated**: 2025-10-24
