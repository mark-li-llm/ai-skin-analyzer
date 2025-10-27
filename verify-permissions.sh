#!/bin/bash

# Script to verify file and directory permissions before deployment
# This helps prevent Vercel build issues due to restrictive permissions

echo "🔍 Verifying file permissions for Vercel deployment..."
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track issues
issues_found=0

# Function to check permissions
check_permissions() {
    local path=$1
    local type=$2
    local perms=$(stat -f "%OLp" "$path" 2>/dev/null || stat -c "%a" "$path" 2>/dev/null)

    if [ -z "$perms" ]; then
        echo -e "${RED}❌ Cannot read permissions for $path${NC}"
        ((issues_found++))
        return
    fi

    # For directories, we need at least 755 (owner: rwx, group: r-x, other: r-x)
    # For files, we need at least 644 (owner: rw-, group: r--, other: r--)
    if [ "$type" = "directory" ]; then
        if [ "$perms" -lt 755 ]; then
            echo -e "${RED}❌ Directory $path has permissions $perms (needs 755)${NC}"
            ((issues_found++))
        else
            echo -e "${GREEN}✅ Directory $path has permissions $perms${NC}"
        fi
    else
        if [ "$perms" -lt 644 ]; then
            echo -e "${RED}❌ File $path has permissions $perms (needs 644)${NC}"
            ((issues_found++))
        else
            echo -e "${GREEN}✅ File $path has permissions $perms${NC}"
        fi
    fi
}

echo "Checking API routes..."
echo "----------------------"

# Check all API route directories
for dir in app/api/*/; do
    if [ -d "$dir" ]; then
        check_permissions "$dir" "directory"

        # Check route.ts files inside
        if [ -f "$dir/route.ts" ]; then
            check_permissions "$dir/route.ts" "file"
        fi
        if [ -f "$dir/route.js" ]; then
            check_permissions "$dir/route.js" "file"
        fi
    fi
done

echo ""
echo "Checking critical files..."
echo "--------------------------"

# Check critical configuration files
critical_files=(
    "package.json"
    "next.config.mjs"
    "tsconfig.json"
    ".env.local"
)

for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        check_permissions "$file" "file"
    fi
done

echo ""
echo "Checking source directories..."
echo "------------------------------"

# Check main directories
main_dirs=(
    "app"
    "types"
    "public"
)

for dir in "${main_dirs[@]}"; do
    if [ -d "$dir" ]; then
        check_permissions "$dir" "directory"
    fi
done

echo ""
echo "=================================================="

if [ $issues_found -eq 0 ]; then
    echo -e "${GREEN}✅ All permissions look good! Ready for deployment.${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Found $issues_found permission issues!${NC}"
    echo ""
    echo "To fix directory permissions, run:"
    echo "  find app -type d -exec chmod 755 {} \\;"
    echo ""
    echo "To fix file permissions, run:"
    echo "  find app -type f -exec chmod 644 {} \\;"
    echo ""
    exit 1
fi