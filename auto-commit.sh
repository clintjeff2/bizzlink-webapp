#!/bin/bash

# Function to get a commit message prefix based on file path
get_commit_prefix() {
  local file=$1
  
  if [[ $file == *".vscode/"* ]]; then
    echo "chore"
  elif [[ $file == *"/app/"* ]]; then
    echo "feat"
  else
    echo "chore"
  fi
}

# Function to get a descriptive message based on file path
get_commit_description() {
  local file=$1
  local basename=$(basename "$file")
  
  if [[ $file == *".vscode/tasks.json"* ]]; then
    echo "update VS Code tasks configuration"
  elif [[ $file == *"/client/contracts/"* ]]; then
    echo "update client contract view $(echo $basename | sed 's/.tsx$//')"
  elif [[ $file == *"/freelancer/contracts/"* ]]; then
    echo "update freelancer contract view $(echo $basename | sed 's/.tsx$//')"
  elif [[ $file == *"/projects/[id]/page.tsx"* ]]; then
    echo "improve project details page layout"
  elif [[ $file == *"/projects/post/page.tsx"* ]]; then
    echo "enhance project creation form"
  else
    echo "update $(echo $basename | sed 's/.tsx$//')"
  fi
}

# Get the modified files from git status
modified_files=$(git status --porcelain | grep "^ M" | awk '{print $2}')
deleted_files=$(git status --porcelain | grep "^ D" | awk '{print $2}')

# Process modified files
for file in $modified_files; do
  prefix=$(get_commit_prefix "$file")
  description=$(get_commit_description "$file")
  
  echo "Processing: $file"
  git add "$file"
  git commit -m "$prefix: $description"
  echo -e "Committed: $file with message '$prefix: $description'\n"
done

# Process deleted files
for file in $deleted_files; do
  echo "Processing deleted file: $file"
  git add "$file"
  git commit -m "chore: remove $(basename "$file")"
  echo -e "Committed deletion of: $file\n"
done

echo "All changes have been committed!"
