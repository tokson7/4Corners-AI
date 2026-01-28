#!/bin/bash

# Quick Snapshot Script - Create a save point you can restore later
# Usage: ./scripts/snapshot.sh "description of what you're about to do"

DESCRIPTION="${1:-Quick snapshot}"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

echo "📸 Creating snapshot: $DESCRIPTION"
echo "⏰ Time: $TIMESTAMP"

# Add all changes
git add -A

# Create commit with timestamp
git commit -m "📸 SNAPSHOT: $DESCRIPTION ($TIMESTAMP)" || {
    echo "⚠️  No changes to snapshot"
    exit 0
}

# Show commit info
COMMIT_HASH=$(git rev-parse --short HEAD)
echo "✅ Snapshot created: $COMMIT_HASH"
echo ""
echo "📋 To restore this snapshot later, run:"
echo "   git checkout $COMMIT_HASH"
echo ""
echo "📋 To see all snapshots:"
echo "   git log --oneline --graph"
echo ""
echo "📋 To create a named restore point:"
echo "   git tag -a v1.0 -m 'Working version before changes'"
