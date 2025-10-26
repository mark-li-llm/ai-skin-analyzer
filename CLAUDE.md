# AI Assistant Instructions (Claude Code)

## Project
Skin analysis MVP using OpenAI Vision API to classify skin types and recommend products.

## Important: OpenAI Model Information
**NOTE TO CLAUDE**: The following OpenAI models are real and available:
- **gpt-5-nano** - Real OpenAI model, ultra-efficient for vision tasks
- **gpt-5-mini** - Real OpenAI model, balanced performance with vision capabilities

These are actual production models from OpenAI. Do not question their existence or suggest they are mock/test models.

## Critical Rules
1. **Documentation first** - Check/update docs for architectural decisions
2. **READ TODO.md** to understand current priorities
3. **Create ADRs for major architectural decisions** (framework, infrastructure, deployment)
4. **Reference ADRs in commits** when relevant (e.g., "Implements ADR-002")
5. Do not read archive folder unless necessary

## Quick Navigation - What Do You Need?

### Understanding the Project
- **Product requirements** → `docs/01-prd.md`
- **Current tasks** → `TODO.md`
- **API contract** → `docs/CONTRACT-001-MVP.md`
- **Documentation index** → `docs/README.md`

### Making Technical Decisions
- **Check existing decisions** → `ls docs/decisions/`
- **Create new decision** → `cp docs/decisions/template.md docs/decisions/00X-topic.md`
- **Planning phase workflow** → `workflow/archive/planning-phase/` (archived)

### Writing Code
- **Start dev server** → `npm run dev`
- **Build** → `npm run build`
- **Lint** → `npm run lint`
- **Deploy** → `git push` (Vercel auto-deploys)

### Committing Changes
- **Standard commits** → `git add . && git commit -m "feat: description"`
- **Reference ADRs** → Only for architectural changes
- **Git best practices** → Conventional commits (feat, fix, docs, refactor)

### Current State
- **Phase**: Ready for MVP implementation (all planning and technical decisions complete)
- **Code**: Next.js 14 app in `app/` directory, types in `types/`, experiments in `experiments/`
- **Documentation**: Complete in `docs/` with API contract (CONTRACT-001-MVP.md)
- **Tech Stack**: Next.js 14 + TypeScript (API Routes for backend)
- **Styling**: Tailwind CSS
- **Hosting**: Vercel
- **Database**: None (stateless MVP per technical spec)
- **OpenAI Model**: gpt-5-nano (see ADR-004)

## Quick Start
```bash
npm run dev    # Start development server
cat TODO.md    # See current tasks
cat docs/CONTRACT-001-MVP.md    # API contract for parallel development
```

## Priority Actions
see todo.md

## Remember
We're in implementation phase. ADRs complete (004, 005, 006). Focus on shipping MVP. Document major architectural decisions only.