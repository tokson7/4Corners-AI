#!/bin/bash

# Quick Restore Script - Go back to a previous snapshot
# Usage: 
#   ./scripts/restore.sh                    (shows list of snapshots)
#   ./scripts/restore.sh <commit-hash>      (restores specific snapshot)
#   ./scripts/restore.sh last               (restores last snapshot)

if [ -z "$1" ]; then
    echo "📜 Available snapshots:"
    echo ""
    git log --oneline --graph --decorate -20
    echo ""
    echo "Usage:"
    echo "  ./scripts/restore.sh <commit-hash>   - Restore specific snapshot"
    echo "  ./scripts/restore.sh last            - Restore last snapshot"
    exit 0
fi

if [ "$1" == "last" ]; then
    COMMIT="HEAD^"
    echo "⏮️  Restoring to last snapshot..."
else
    COMMIT="$1"
    echo "⏮️  Restoring to snapshot: $COMMIT"
fi

# Confirm
echo "⚠️  This will discard all current changes!"
read -p "Continue? (y/N): " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Restore cancelled"
    exit 1
fi

# Create safety backup first
BACKUP_BRANCH="backup-$(date +%s)"
git branch "$BACKUP_BRANCH" 2>/dev/null
echo "🔒 Safety backup created: $BACKUP_BRANCH"

# Restore
git checkout "$COMMIT" -- .
git add -A
git commit -m "🔄 RESTORE: Back to $COMMIT" || echo "Already at this state"

echo ""
echo "✅ Restored successfully!"
echo "📋 If something went wrong, restore the backup:"
echo "   git checkout $BACKUP_BRANCH"
