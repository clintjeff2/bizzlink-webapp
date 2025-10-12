#!/bin/bash

# Helper function to commit a file with appropriate prefix
commit_file() {
    local file=$1
    local message=$2
    local prefix=$3
    
    echo "Adding $file..."
    git add "$file"
    
    echo "Committing $file with message: $prefix: $message"
    git commit -m "$prefix: $message"
    echo "------------------------------"
}

# Commit each modified/added file with appropriate message
echo "Starting commit process..."

# Modified files
commit_file "app/freelancers/page.tsx" "enhance freelancer cards UI and fix date formatting" "fix"
commit_file "app/page.tsx" "improve landing page design and data integration" "feat"
commit_file "lib/redux/api/firebaseApi.ts" "resolve non-serializable values in Redux store" "fix"

# New files
commit_file "lib/services/landingPageService.ts" "add service for fetching landing page data" "feat"

echo "All commits completed successfully!"
echo "Run 'git push' to push your changes to remote repository."
