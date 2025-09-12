#!/bin/bash

# Bash script to systematically commit all current changes with appropriate messages
# Based on git status from September 12, 2025

echo "Starting systematic commit process for current changes..."

# Modified files first
echo "Committing modified files..."

git add app/messages/page.tsx
git commit -m "feat: add unread conversation count badges and enhanced message filtering"

git add lib/services/storageService.ts
git commit -m "chore: update storage service configuration and error handling"

git add tailwind.config.ts
git commit -m "chore: update tailwind configuration for message components"

# New untracked files
echo "Committing new files..."

git add app/messages/page-new.tsx
git commit -m "feat: add new messages page implementation with improved UX"

git add app/messages/page-updated.tsx
git commit -m "feat: add updated messages page with conversation management"

git add components/messages-components/
git commit -m "feat: add comprehensive message components system with real-time updates"

git add components/ui/spinner.tsx
git commit -m "feat: add spinner UI component for loading states"

git add lib/hooks/useMessages.ts
git commit -m "feat: add enhanced useMessages hook with smart conversation merging and flickering fixes"

git add lib/messages-data.ts
git commit -m "feat: add messages data utilities and type definitions"

git add lib/services/messageService.ts
git commit -m "feat: add comprehensive message service with Firebase dual-collection support"

git add lib/services/userService.ts
git commit -m "feat: add user service for user data management and enrichment"

git add lib/utils/messageUtils.ts
git commit -m "feat: add message utility functions for formatting and validation"

# Commit this script itself
git add commit-changes.sh
git commit -m "chore: update commit script for current messaging system changes"

echo "All files committed successfully!"
echo "Git status after commits:"
git status
