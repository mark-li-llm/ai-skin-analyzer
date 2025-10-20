# Workflow Tools

This directory contains tools and processes to maintain documentation discipline throughout development.

## Quick Start

```bash
# Initial setup (do this once)
make init

# Daily workflow
make decision     # Create new ADR when making technical choices
make check       # Check documentation before committing
make commit      # Check docs then commit
make status      # See current documentation status

# Weekly
make review      # Review week's decisions
```

## Philosophy: Document First, Code Second

**Every technical decision should be documented BEFORE implementation.**

## Files in This Directory

- **DEVELOPMENT_WORKFLOW.md** - Complete workflow guide and philosophy
- **decision-check.sh** - Script that checks for undocumented decisions
- **README.md** - This file

## The 3D Workflow

1. **Decision** - Make technical choice
2. **Document** - Create/update ADR
3. **Develop** - Implement the decision

## Git Integration

After running `make init`, your git commits will:
- Use a template that reminds you about documentation
- Prompt for ADR references
- Encourage decision documentation

## Example Workflow

```bash
# You decide to use PostgreSQL
$ make decision
# Enter: database-choice
# Creates: docs/decisions/004-database-choice.md

# Edit the ADR with your decision
$ vim docs/decisions/004-database-choice.md

# Check everything is documented
$ make check
✅ Decision documentation check passed!

# Commit with confidence
$ git commit -m "feat: Set up PostgreSQL database

Implements database choice from ADR-004"
```

## Enforcement

The workflow is enforced at multiple levels:
1. **Git commit template** - Reminds you to reference ADRs
2. **Decision check script** - Warns about TBDs and undocumented choices
3. **PR template** - Requires documentation updates
4. **Weekly reviews** - Catch anything missed

## Tips

- **Small decisions matter too** - If you'll wonder "why" in 3 months, document it now
- **ADRs are immutable** - Don't edit old ADRs, create new ones that supersede them
- **Link to code** - Reference the PR/commit that implements each decision
- **Set calendar reminders** - Weekly documentation review every Friday

## Remember

> "The best documentation is written when the decision is made, not when someone asks about it."