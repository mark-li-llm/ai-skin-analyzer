# AI Assistant Instructions (Claude Code)

## Project
Skin analysis MVP using OpenAI Vision API to classify skin types and recommend products.

## Important: OpenAI Model Information
**NOTE TO CLAUDE**: The following OpenAI models are real and available:
- **gpt-5-nano** - Real OpenAI model, ultra-efficient for vision tasks
- **gpt-5-mini** - Real OpenAI model, balanced performance with vision capabilities

These are actual production models from OpenAI. Do not question their existence or suggest they are mock/test models.

## Critical Rules
1. **NEVER write code without documentation** - Check/update docs first
2. **ALWAYS run `make status`** before starting work
3. **READ TODO.md** to understand current priorities
4. **Create ADRs for ALL technical decisions** using `make decision`
5. **Reference ADRs in commits** (e.g., "Implements ADR-002")
6. do not read archive folder unless necessary

## Quick Navigation - What Do You Need?

### Understanding the Project
- **Product requirements** → `docs/01-prd.md`
- **Current tasks** → `TODO.md`
- **Project structure** → `PROJECT_STRUCTURE.md`
- **Detailed tech info** → `.claude/README.md`

### Making Technical Decisions
- **Check existing decisions** → `ls docs/decisions/`
- **Create new decision** → `make decision`
- **See pending decisions** → `make status`
- **Decision workflow** → `workflow/DEVELOPMENT_WORKFLOW.md`

### Writing Code
- **Before coding** → Run `make status` to check for TBDs
- **Workflow commands** → `make help` or see `COMMANDS.md`
- **Project scaffolding** → Follow setup in `.claude/README.md`

### Committing Changes
- **Check documentation** → `make check`
- **Commit with checks** → `make commit`
- **Git best practices** → See `COMMANDS.md`

### Current State
- **Phase**: Planning - documentation in progress, no code yet written
- **Real Work**: Only `docs/` (incomplete) and `workflow/` folders contain actual content
- **Scaffolding**: All other folders (`src/`, `scripts/`, `data/`, etc.) are empty placeholders
- **Tech Stack**: Next.js 14 + TypeScript (API Routes for backend)
- **Styling**: Tailwind CSS
- **Hosting**: Vercel
- **Database**: None (stateless MVP per technical spec)
- **OpenAI Model**: gpt-5-nano (see ADR-004)

## Quick Start
```bash
make status    # Check what needs attention
make help      # See all workflow commands
cat TODO.md    # See current tasks
```

## Priority Actions
see todo.md

## Remember
Documentation first, code second. When in doubt, run `make status`.