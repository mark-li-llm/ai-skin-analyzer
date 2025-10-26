#!/bin/bash
# Decision Documentation Checker
# Run this before commits or as a git hook

echo "🔍 Decision Documentation Check"
echo "================================"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check for TBDs in decision documents
echo ""
echo "Checking for unresolved decisions (TBDs)..."
TBD_COUNT=$(grep -r "TBD" docs/decisions/ 2>/dev/null | wc -l)

if [ $TBD_COUNT -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Found $TBD_COUNT TBD items in decision documents:${NC}"
    grep -r "TBD" docs/decisions/ --include="*.md" | head -5
    echo ""
    read -p "Continue with unresolved decisions? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}❌ Commit cancelled. Please resolve TBDs first.${NC}"
        exit 1
    fi
fi

# Check if recent code changes have corresponding ADRs
echo "Checking for recent decisions..."

# List ADRs modified in the last week
RECENT_ADRS=$(find docs/decisions -name "*.md" -mtime -7 2>/dev/null | wc -l)

if [ $RECENT_ADRS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  No ADRs updated in the last 7 days${NC}"
    echo "If you made technical decisions, consider documenting them."
else
    echo -e "${GREEN}✅ Found $RECENT_ADRS recently updated ADR(s)${NC}"
fi

# Check for "Proposed" status ADRs that might need acceptance
echo ""
echo "Checking ADR statuses..."
PROPOSED=$(grep -l "Status: Proposed" docs/decisions/*.md 2>/dev/null | wc -l)

if [ $PROPOSED -gt 0 ]; then
    echo -e "${YELLOW}📋 $PROPOSED ADR(s) still in 'Proposed' status:${NC}"
    grep -l "Status: Proposed" docs/decisions/*.md 2>/dev/null | xargs basename -a
    echo "Consider moving to 'Accepted' or 'Rejected' after decision is made."
fi

# Quick prompt for documentation
echo ""
echo "Quick check before commit:"
echo "  1. Did you make any technical decisions? [Framework/Library/Architecture]"
echo "  2. Is there an ADR for each decision?"
echo "  3. Are the technical specs updated?"
echo ""

read -p "Have you documented all decisions? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}❌ Please document decisions before committing.${NC}"
    echo ""
    echo "Quick ADR creation:"
    echo "  cp docs/decisions/template.md docs/decisions/$(printf "%03d" $(($(ls docs/decisions/*.md | wc -l) + 1)))-your-decision.md"
    exit 1
fi

echo -e "${GREEN}✅ Decision documentation check passed!${NC}"
echo ""
echo "Commit message tip: Reference ADRs like 'Implements database choice from ADR-002'"