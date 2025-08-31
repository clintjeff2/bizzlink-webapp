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
    
    # Debug: Print file path for debugging
    echo "DEBUG: Processing file: $file with status: $status" >&2
    
    # Add more specific commit messages for the files in your current changes
    case "$file" in
        # Project-specific files
        "app/projects/page.tsx")
            echo "fix: update project listing page with direct Firestore queries for proposals"
            ;;
        "app/projects/[id]/page.tsx")
            echo "fix: improve project detail page with correct proposal handling"
            ;;
        "app/projects/[id]/proposal/"*)
            echo "feat: add proposal submission and editing functionality"
            ;;
        "app/freelancer/proposals/"*)
            echo "feat: update freelancer proposals management"
            ;;
        "app/client/projects/"*)
            echo "feat: improve client project management interface"
            ;;
        "components/freelancer-project-action.tsx")
            echo "feat: add FreelancerProjectAction component for proposal handling"
            ;;
        "lib/redux/api/firebaseApi.ts")
            echo "feat: enhance Firebase API with improved proposal endpoints"
            ;;
        "lib/redux/slices/proposalSlice.ts")
            echo "feat: update proposal state management"
            ;;
        "lib/redux/slices/authSlice.ts")
            echo "fix: improve authentication state handling"
            ;;
        "lib/services/proposalService.ts")
            echo "feat: add proposal service for data operations"
            ;;
        "lib/services/storage/"*)
            echo "feat: improve storage service with proper typing"
            ;;
        "lib/redux/utils/"*)
            echo "feat: add utility functions for Redux operations"
            ;;
        "lib/redux/selectors/"*)
            echo "feat: add Redux selectors for improved state access"
            ;;
        "FIREBASE_SCHEMA.md"|"FIRESTORE_INDEXES.md"|"PROPOSAL_SCHEMA_UPDATE.md")
            echo "docs: update Firebase schema documentation"
            ;;
        "PROPOSAL_REDUX_FIXES.md"|"PROPOSAL_FEATURE_EXPLANATION.md"|"exaplanation.freelancer.proposal.md")
            echo "docs: add implementation explanation documentation"
            ;;
        "auto-commit.sh")
            echo "chore: improve auto-commit script functionality"
            ;;
        # Configuration files
        *.config.*|*.json|"package.json"|"pnpm-lock.yaml"|"package-lock.json")
            if [[ "$status" == "A" ]]; then
                echo "chore: add $(basename "$file") configuration"
            else
                echo "chore: update dependencies and configuration"
            fi
            ;;
        # CSS and styling files
        *.css|*.scss|*.sass)
            if [[ "$status" == "A" ]]; then
                echo "style: add $(basename "$file") styling"
            else
                echo "style: update $(basename "$file") styling"
            fi
            ;;
        # TypeScript/JavaScript component files
        "components/"*)
            component_name=$(basename "$file")
            if [[ "$status" == "A" ]]; then
                echo "feat: add $component_name component"
            else
                echo "fix: update $component_name component"
            fi
            ;;
        # App pages and layouts
        "app/"*/page.tsx|"app/layout.tsx")
            page_path=$(dirname "$file" | sed 's|^app/||')
            if [[ "$page_path" == "." ]]; then
                page_path="main"
            fi
            if [[ "$status" == "A" ]]; then
                echo "feat: add $page_path page"
            else
                echo "fix: update $page_path page layout and functionality"
            fi
            ;;
        # TypeScript/JavaScript files
        *.ts|*.js)
            file_name=$(basename "$file")
            if [[ "$status" == "A" ]]; then
                echo "feat: add $file_name"
            else
                echo "fix: update $file_name"
            fi
            ;;
        # Documentation files
        *.md|*.txt|*.rst)
            doc_name=$(basename "$file")
            if [[ "$status" == "A" ]]; then
                echo "docs: add $doc_name documentation"
            else
                echo "docs: update $doc_name documentation"
            fi
            ;;
        # Default case
        *)
            file_name=$(basename "$file")
            if [[ -z "$file_name" ]]; then
                file_name="$file"
            fi
            if [[ "$status" == "A" ]]; then
                echo "chore: add $file_name"
            else
                echo "chore: update $file_name"
            fi
            ;;
    esac
}

# Get list of changed files - specifically the ones from your git status
echo -e "${YELLOW}📋 Scanning for changed files...${NC}"

# Use a better approach to get modified and untracked files
# Get modified files
modified_files=$(git status --porcelain | grep "^ M" | sed 's/^ M //')

# Get untracked files
untracked_files=$(git status --porcelain | grep "^??" | sed 's/?? //')

# Create lists of files with their status
modified_list=()
for file in $modified_files; do
    modified_list+=("M $file")
done

untracked_list=()
for file in $untracked_files; do
    untracked_list+=("A $file")
done

# Combine the files with their status
changed_files=""
for item in "${modified_list[@]}"; do
    changed_files+="$item"$'\n'
done

for item in "${untracked_list[@]}"; do
    changed_files+="$item"$'\n'
done

if [[ -z "$changed_files" ]]; then
    echo -e "${GREEN}✅ No changes to commit!${NC}"
    exit 0
fi

echo -e "${BLUE}📝 Found the following changes:${NC}"
echo "$changed_files"
echo ""

# Process each file
echo "$changed_files" | while IFS= read -r line; do
    if [[ -z "$line" ]]; then
        continue
    fi
    
    # Extract status and filename
    status="${line:0:1}"
    filename="${line:2}"
    
    # Skip if file doesn't exist (in case of deletions)
    if [[ "$status" == "D" ]]; then
        echo -e "${RED}🗑️  Skipping deleted file: $filename${NC}"
        continue
    fi
    
    # Skip empty lines or invalid entries
    if [[ -z "$filename" || ! -e "$filename" ]]; then
        echo -e "${YELLOW}⚠️  Skipping invalid entry: $filename${NC}"
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
done

echo -e "${GREEN}🎉 Auto-commit process completed!${NC}"

# Show final git log
echo -e "${BLUE}📊 Recent commits:${NC}"
git log --oneline -5
