# Development Workflow & Documentation Discipline

## Core Principle: No Code Without Decisions, No Decisions Without Documentation

This workflow ensures ADRs and documentation are updated BEFORE implementation, not after.

## 🔄 The Decision-Documentation-Development (3D) Workflow

### Step 1: DECISION TRIGGER
**When you encounter any technical choice:**
- Which library/framework to use?
- How to structure the API?
- Where to deploy?
- How to handle errors?
- Database schema design?

**STOP! Don't code yet.**

### Step 2: DOCUMENT FIRST
1. Create or update the relevant ADR in `docs/decisions/`
2. Status: "Proposed"
3. List all options considered
4. Research if needed (quick spikes/POCs)
5. Document your decision and rationale
6. Status: "Accepted"

### Step 3: UPDATE RELATED DOCS
Before coding, update:
- [ ] Technical Spec (if architecture changed)
- [ ] API Documentation (if endpoints affected)
- [ ] Database Schema (if data models changed)
- [ ] Testing Strategy (if test approach changed)

### Step 4: IMPLEMENT
Now you can code with confidence.

### Step 5: VALIDATE & ITERATE
If implementation reveals issues:
- Update ADR with "Lessons Learned" section
- If decision needs reversal, create new ADR explaining why

---

## 📋 Decision Checkpoints (Use as Git Commit Template)

Every significant commit should follow this template:

```
feat: [feature description]

Decisions made:
- [ ] ADR updated: #[number] [decision]
- [ ] Tech spec updated: [section]
- [ ] API docs updated: [endpoint]
- [ ] Tests added: [type]

Related ADRs: #001, #002
```

---

## 🚫 Anti-Patterns to Avoid

1. **"I'll document it later"** - You won't. Document before coding.
2. **"It's just a small change"** - Small changes accumulate into undocumented complexity.
3. **"The code is self-documenting"** - Code shows HOW, ADRs explain WHY.
4. **"I'll remember why I chose this"** - You won't in 3 months.

---

## 🔑 Enforcement Mechanisms

### 1. Pre-Commit Checklist
Add to `.gitmessage` template:
```
# Decision Documentation Checklist:
# - [ ] Is this a new technical decision?
# - [ ] If yes, is there an ADR?
# - [ ] Are related docs updated?
```

### 2. PR Template
Create `.github/pull_request_template.md`:
```markdown
## Changes Made
-

## Documentation Updates
- [ ] ADRs created/updated: #
- [ ] Technical spec sections updated
- [ ] API documentation current
- [ ] README updated if needed

## Decision Rationale
Why these choices:
```

### 3. Weekly Documentation Review
Every Friday, ask:
- What decisions did I make this week?
- Are they all documented?
- What's still "TBD" that shouldn't be?

---

## 📊 ADR Lifecycle

```
Proposed → Accepted → Deprecated (if replaced)
    ↓          ↓           ↓
  Research   Implement   New ADR
    ↓          ↓           ↓
   Update    Validate    Link old→new
```

---

## 🎯 Quick Decision Framework

For any technical choice, ask:

1. **Will someone ask "why" about this later?** → Create ADR
2. **Does this affect the architecture?** → Update Tech Spec
3. **Does this change the API?** → Update API Docs
4. **Does this affect data storage?** → Update Schema Docs
5. **Will this confuse future developers?** → Document it NOW

---

## 📝 ADR Naming Convention

```
docs/decisions/
├── 001-tech-stack.md           # Foundational decisions
├── 002-database-choice.md      # Infrastructure
├── 003-hosting-platform.md     # Deployment
├── 004-authentication.md       # Features
├── 005-image-processing.md     # Core functionality
└── NNN-decision-topic.md
```

Number sequentially, never reuse numbers.

---

## ⚡ Quick ADR Template

When you need to make a decision quickly:

```markdown
# ADR-NNN: [Decision Title]

Status: Proposed → Accepted
Date: YYYY-MM-DD

## Quick Context
[1-2 sentences on why this decision is needed]

## Decision
We will use [X] for [purpose].

## Because
- [Main reason]
- [Supporting reason]

## Trade-offs
- (+) [Positive]
- (-) [Negative we accept]

## Revisit When
[Conditions that would make us reconsider]
```

---

## 🔄 Continuous Improvement

After each sprint/week:
1. Review commits without ADR references
2. Identify undocumented decisions
3. Retroactively document if critical
4. Improve workflow if patterns emerge

---

## 💡 Remember

**Good documentation is written BEFORE implementation, not after.**

The best time to document a decision is when you make it, not when someone asks about it.