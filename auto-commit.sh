#!/bin/bash

# Auto-commit script for individual file commits
# This script commits each changed file individually with appropriate commit messages

set -e  # Exit on any error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting auto-commit process...${NC}"

# Function to determine commit message based on file type and content
get_commit_message() {
    local file="$1"
    local status="$2"
    
    case "$file" in
        # Configuration files
        *.config.* | *.json | package.json | pnpm-lock.yaml | package-lock.json)
            if [[ "$status" == "A" ]]; then
                echo "chore: add $file configuration"
            else
                echo "chore: update $file configuration"
            fi
            ;;
        # CSS and styling files
        *.css | *.scss | *.sass)
            if [[ "$status" == "A" ]]; then
                echo "style: add $file styling"
            else
                echo "style: update $file styling"
            fi
            ;;
        # TypeScript/JavaScript component files
        *.tsx | *.jsx)
            if [[ "$status" == "A" ]]; then
                echo "feat: add $file component"
            else
                echo "feat: update $file component"
            fi
            ;;
        # TypeScript/JavaScript files
        *.ts | *.js)
            if [[ "$status" == "A" ]]; then
                echo "feat: add $file"
            else
                echo "feat: update $file"
            fi
            ;;
        # Documentation files
        *.md | *.txt | *.rst)
            if [[ "$status" == "A" ]]; then
                echo "docs: add $file documentation"
            else
                echo "docs: update $file documentation"
            fi
            ;;
        # Git files
        .gitignore | .gitattributes)
            if [[ "$status" == "A" ]]; then
                echo "chore: add $file"
            else
                echo "chore: update $file"
            fi
            ;;
        # Default case
        *)
            if [[ "$status" == "A" ]]; then
                echo "chore: add $file"
            else
                echo "chore: update $file"
            fi
            ;;
    esac
}

# Get list of changed files
echo -e "${YELLOW}📋 Scanning for changed files...${NC}"
changed_files=$(git status --porcelain)

if [[ -z "$changed_files" ]]; then
    echo -e "${GREEN}✅ No changes to commit!${NC}"
    exit 0
fi

echo -e "${BLUE}📝 Found the following changes:${NC}"
echo "$changed_files"
echo ""

# Process each file
while IFS= read -r line; do
    if [[ -z "$line" ]]; then
        continue
    fi
    
    # Extract status and filename
    status="${line:0:1}"
    filename="${line:3}"
    
    # Skip if file doesn't exist (in case of deletions)
    if [[ "$status" == "D" ]]; then
        echo -e "${RED}🗑️  Skipping deleted file: $filename${NC}"
        continue
    fi
    
    # Get appropriate commit message
    commit_msg=$(get_commit_message "$filename" "$status")
    
    # Add and commit the file
    echo -e "${YELLOW}📦 Processing: $filename${NC}"
    
    if git add "$filename"; then
        if git commit -m "$commit_msg"; then
            echo -e "${GREEN}✅ Committed: $filename${NC}"
            echo -e "   Message: $commit_msg"
        else
            echo -e "${RED}❌ Failed to commit: $filename${NC}"
        fi
    else
        echo -e "${RED}❌ Failed to add: $filename${NC}"
    fi
    
    echo ""
done <<< "$changed_files"

echo -e "${GREEN}🎉 Auto-commit process completed!${NC}"

# Show final git log
echo -e "${BLUE}📊 Recent commits:${NC}"
git log --oneline -5
