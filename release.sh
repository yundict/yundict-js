#!/bin/bash

# Release new version script
# Usage: ./release-simple.sh <version>

set -e

if [ -z "$1" ]; then
    echo "Usage: $0 <version>"
    exit 1
fi

VERSION=$1

echo "Updating version to $VERSION..."

# Update package.json
sed -i '' "s/\"version\": \"[^\"]*\"/\"version\": \"$VERSION\"/" package.json

# Update jsr.json
sed -i '' "s/\"version\": \"[^\"]*\"/\"version\": \"$VERSION\"/" jsr.json

# Update lock file
npm install

# Commit and push
git add .
git commit -m "Release version $VERSION"
git tag -a "v$VERSION" -m "Release version $VERSION"
git push origin main
git push origin "v$VERSION"

echo "✅ Version $VERSION released successfully!"
