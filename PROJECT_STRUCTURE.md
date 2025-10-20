# Project Structure

## Quick Overview
```
prototype/                    # Project root
├── .claude/                 # AI assistant instructions
│   └── README.md           # Instructions for Claude Code
├── docs/                    # All documentation
│   ├── 01-prd.md           # Product requirements (START HERE)
│   ├── 02-technical-spec.md # Technical architecture
│   ├── decisions/          # Architecture Decision Records (ADRs)
│   │   ├── 001-tech-stack.md
│   │   ├── 002-database-choice.md # Needs finalization
│   │   └── 003-hosting-platform.md
│   └── ...                 # Other docs (API, testing, etc.)
├── workflow/                # Development workflow tools
│   ├── DEVELOPMENT_WORKFLOW.md # How to work on this project
│   ├── decision-check.sh   # Pre-commit documentation check
│   └── README.md           # Workflow quick guide
├── src/                     # Source code (not yet populated)
│   ├── frontend/           # Next.js app (TBD)
│   ├── backend/            # Express API (TBD)
│   └── shared/             # Shared types/utils (TBD)
├── Makefile                 # Workflow commands (type 'make help')
├── TODO.md                  # Current tasks and blockers
├── README.md               # Project overview
└── .gitmessage             # Git commit template

## Where to Start

### For New Developers/AI:
1. Read `.claude/README.md` - Instructions for AI assistants
2. Read `workflow/DEVELOPMENT_WORKFLOW.md` - How to work
3. Read `docs/01-prd.md` - What we're building
4. Run `make status` - Check documentation state
5. Run `make help` - See available commands

### Key Commands:
```bash
make status    # Check what needs documentation
make decision  # Create new ADR
make check     # Verify docs before commit
make workflow  # Quick reference
```

## Current State: Planning Phase
- ✅ Documentation structure created
- ✅ Workflow tools in place
- ⏳ Technical decisions pending (database)
- ❌ Code not yet started
- ❌ OpenAI API not yet tested

## Next Steps:
1. Test OpenAI Vision API feasibility
2. Finalize database decision (ADR-002)
3. Create project scaffolding
4. Build MVP

## Important Files by Purpose

### To Understand Requirements:
- `docs/01-prd.md` - Product requirements
- `TODO.md` - Current focus

### To Understand Technical Choices:
- `docs/decisions/*.md` - All ADRs
- `docs/02-technical-spec.md` - Architecture

### To Understand Workflow:
- `workflow/DEVELOPMENT_WORKFLOW.md` - Full guide
- `Makefile` - Available commands
- `.claude/README.md` - AI-specific instructions

## Remember:
**No code without documentation. Use `make decision` before implementing any technical choice.**