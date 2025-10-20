# Development Workflow Makefile

# Default target
.DEFAULT_GOAL := help

# Colors for output
YELLOW := \033[1;33m
GREEN := \033[0;32m
RED := \033[0;31m
NC := \033[0m # No Color

## help: Show this help message
help:
	@echo "📚 Development Workflow Commands"
	@echo "================================"
	@grep -E '^## ' $(MAKEFILE_LIST) | sed 's/## /  /'

## decision: Create a new ADR from template
decision:
	@echo "$(YELLOW)📝 Creating new ADR...$(NC)"
	@NUMBER=$$(printf "%03d" $$(($$(ls docs/decisions/*.md 2>/dev/null | grep -v template | wc -l) + 1))); \
	read -p "Enter decision topic (e.g., 'authentication-method'): " TOPIC; \
	cp docs/decisions/template.md "docs/decisions/$${NUMBER}-$${TOPIC}.md"; \
	echo "$(GREEN)✅ Created: docs/decisions/$${NUMBER}-$${TOPIC}.md$(NC)"

## check: Run decision documentation check
check:
	@./workflow/decision-check.sh

## commit: Check documentation then commit
commit: check
	@git add -A && git commit

## status: Show documentation status
status:
	@echo "$(YELLOW)📊 Documentation Status$(NC)"
	@echo "======================="
	@echo ""
	@echo "ADRs with TBD:"
	@grep -l "TBD" docs/decisions/*.md 2>/dev/null | xargs basename -a 2>/dev/null || echo "  None ✅"
	@echo ""
	@echo "Proposed ADRs (not yet accepted):"
	@grep -l "Status: Proposed" docs/decisions/*.md 2>/dev/null | xargs basename -a 2>/dev/null || echo "  None ✅"
	@echo ""
	@echo "Recent ADRs (last 7 days):"
	@find docs/decisions -name "*.md" -mtime -7 -not -name "template.md" 2>/dev/null | xargs basename -a 2>/dev/null || echo "  None"

## review: Weekly documentation review
review:
	@echo "$(YELLOW)🔍 Weekly Documentation Review$(NC)"
	@echo "=============================="
	@echo ""
	@echo "1. Decisions made this week:"
	@git log --since="1 week ago" --oneline | grep -E "(decision|ADR|chose|selected)" || echo "  No decision-related commits"
	@echo ""
	@echo "2. Files changed without ADR references:"
	@git log --since="1 week ago" --oneline | grep -v "ADR" | head -5
	@echo ""
	@echo "3. Action items:"
	@echo "  - Review above commits for undocumented decisions"
	@echo "  - Update any 'Proposed' ADRs to 'Accepted' or 'Rejected'"
	@echo "  - Resolve any remaining TBDs"

## setup-git: Configure git for decision tracking
setup-git:
	@echo "$(YELLOW)⚙️  Setting up git for decision tracking...$(NC)"
	@git config commit.template .gitmessage
	@echo "$(GREEN)✅ Git commit template configured$(NC)"
	@echo ""
	@echo "Optional: Install pre-commit hook"
	@echo "  cp workflow/decision-check.sh .git/hooks/pre-commit"

## workflow: Display the workflow guide
workflow:
	@echo "$(YELLOW)📋 Quick Workflow Reference$(NC)"
	@echo "=========================="
	@echo ""
	@echo "1. Before coding anything new:"
	@echo "   $$ make decision       # Create new ADR"
	@echo ""
	@echo "2. Before committing:"
	@echo "   $$ make check          # Run documentation check"
	@echo "   $$ make commit         # Check then commit"
	@echo ""
	@echo "3. Weekly:"
	@echo "   $$ make review         # Review week's decisions"
	@echo ""
	@echo "4. Anytime:"
	@echo "   $$ make status         # See documentation status"

## init: Initialize workflow for new developer
init: setup-git
	@echo "$(GREEN)✅ Workflow initialized!$(NC)"
	@echo ""
	@echo "Next steps:"
	@echo "  1. Read workflow/DEVELOPMENT_WORKFLOW.md"
	@echo "  2. Run 'make workflow' for quick reference"
	@echo "  3. Use 'make decision' to create your first ADR"

.PHONY: help decision check commit status review setup-git workflow init