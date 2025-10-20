# Common Commands Cheatsheet

## For AI Assistants: Quick Command Reference

### 📋 Workflow Commands (Use These!)
```bash
make help          # Show all available commands
make status        # Check documentation health
make decision      # Create new ADR when making technical choice
make check         # Run before committing
make commit        # Check docs, then commit
make workflow      # Show workflow quick guide
```

### 🎯 When to Use Each Command

#### Starting Work Session
```bash
make status        # See what needs attention
cat TODO.md        # Check current tasks
```

#### Before Making Technical Decisions
```bash
ls docs/decisions/ # See existing decisions
make decision      # Create new ADR
vim docs/decisions/XXX-your-decision.md
```

#### Before Writing Code
```bash
cat docs/01-prd.md # Understand requirements
make status        # Check for TBDs
# Update any TBDs first!
```

#### After Writing Code
```bash
make check         # Verify documentation
make commit        # Commit with doc check
```

#### Weekly/Periodic
```bash
make review        # Review week's decisions
make status        # Overall health check
```

### 🚀 Starting Development (When Ready)

```bash
# 1. Test OpenAI API first (highest risk)
mkdir experiments
touch experiments/test-openai-vision.js

# 2. After API validation, scaffold project
npx create-next-app@latest frontend --typescript --tailwind
mkdir backend && cd backend && npm init -y

# 3. Document the setup decisions
make decision  # Create ADR for any choices made
```

### 📝 Git Commit Best Practices

```bash
# Bad commit:
git commit -m "update code"

# Good commit (references ADR):
git commit -m "feat: Add PostgreSQL database setup

Implements database choice from ADR-002
- Uses Prisma for type-safe ORM
- Includes migration setup"
```

### 🔍 Finding Information

```bash
# Find all TBDs
grep -r "TBD" docs/

# Find specific decision
ls docs/decisions/ | grep database

# Check recent changes
git log --oneline -10

# See what's not documented
make status
```

### ⚠️ Important Rules

1. **ALWAYS run before implementing:**
   ```bash
   make status     # Check for undocumented decisions
   cat docs/01-prd.md  # Verify requirements
   ```

2. **ALWAYS run before committing:**
   ```bash
   make check      # Or use 'make commit'
   ```

3. **NEVER:**
   - Write code without checking existing ADRs
   - Leave TBDs after making decisions
   - Edit old ADRs (create new ones instead)
   - Skip documentation "to save time"

### 💡 Pro Tips

```bash
# Set up git hooks (one time)
cp workflow/decision-check.sh .git/hooks/pre-commit

# Quick ADR creation
make decision
# Enter: "cache-strategy"
# Creates: docs/decisions/004-cache-strategy.md

# Check if you're following workflow
make status | grep TBD
# If output exists, resolve TBDs first
```

## Remember: Documentation First, Code Second!

The computer won't judge you for documenting, but your future self (and other developers/AIs) will thank you.