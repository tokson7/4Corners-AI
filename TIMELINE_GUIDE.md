# 🕐 Timeline History System - Quick Guide

Your project now has full version control! You can create snapshots and restore to any point in time.

## 🚀 Quick Start

### Create a Snapshot (Before Making Changes)

```bash
# Simple snapshot
./scripts/snapshot.sh "Before adding new feature"

# Or use git directly
git add -A
git commit -m "📸 Before testing something"
```

### Restore to Previous State

```bash
# See all snapshots
./scripts/restore.sh

# Restore to specific snapshot
./scripts/restore.sh abc123

# Restore to last snapshot
./scripts/restore.sh last

# Or use git directly
git checkout abc123 -- .
```

## 📚 Common Scenarios

### Scenario 1: Before Making Risky Changes

```bash
# Create snapshot
./scripts/snapshot.sh "Before refactoring authentication"

# Make your changes...
# If something breaks, restore:
./scripts/restore.sh last
```

### Scenario 2: Daily Backups

```bash
# At end of each day
./scripts/snapshot.sh "End of day - Jan 28, 2026"
```

### Scenario 3: Major Milestones

```bash
# Create named version
git tag -a "v2.0-working-auth" -m "Authentication fully working"

# Later, restore to this version
git checkout v2.0-working-auth
```

## 🔍 View Timeline History

```bash
# See all snapshots (graph view)
git log --oneline --graph --all

# See last 10 snapshots
git log --oneline -10

# Search for specific snapshot
git log --grep="Tailwind"

# See what changed in a snapshot
git show abc123
```

## 🛟 Emergency Recovery

### If You Made Bad Changes

```bash
# Option 1: Undo last commit (keep changes)
git reset --soft HEAD^

# Option 2: Undo last commit (discard changes)
git reset --hard HEAD^

# Option 3: Go back 3 commits
git reset --hard HEAD~3
```

### If You Need Yesterday's Version

```bash
# Find yesterday's commits
git log --since="yesterday" --until="today"

# Restore specific file from yesterday
git checkout abc123 -- app/page.tsx
```

### If Everything is Broken

```bash
# Nuclear option - restore entire project to specific commit
git reset --hard abc123

# Or restore to your tagged version
git reset --hard v1.0-restored
```

## 📅 Timeline Visualization

```bash
# Beautiful timeline view
git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit --date=relative

# Or create alias for easy access
git config --global alias.timeline "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr)%Creset' --abbrev-commit"

# Then just use:
git timeline
```

## 🏷️ Using Tags for Important Versions

```bash
# Create tagged version
git tag -a "v1.0-working" -m "Fully working version before experiment"

# List all tags
git tag -l

# Show tag details
git show v1.0-working

# Restore to tagged version
git checkout v1.0-working

# Delete tag if needed
git tag -d v1.0-working
```

## 💾 Automatic Hourly Snapshots (Optional)

Add to your crontab for automatic hourly backups:

```bash
# Edit crontab
crontab -e

# Add this line (replace path with your project path)
0 * * * * cd /Users/tornikezarisze/DesignForge\ AI && git add -A && git commit -m "⏰ Auto-snapshot $(date)" 2>/dev/null
```

## 🔄 Compare Versions

```bash
# See what changed between two commits
git diff abc123 xyz789

# See what changed in specific file
git diff abc123 xyz789 app/page.tsx

# See all changed files
git diff --name-only abc123 xyz789
```

## 📝 Best Practices

1. **Before any major change**: Create a snapshot
2. **End of each work session**: Create a snapshot
3. **Before updating packages**: Create a snapshot with tag
4. **After fixing a bug**: Create a snapshot
5. **Before experimental features**: Create a tagged version

## 🎯 Your Current Setup

- ✅ Git repository initialized
- ✅ Initial commit created: "Restored version from 01:41 AM"
- ✅ Tagged as: `v1.0-restored`
- ✅ Quick snapshot script: `./scripts/snapshot.sh`
- ✅ Quick restore script: `./scripts/restore.sh`
- ✅ .gitignore configured (excludes node_modules, .next, etc.)

## 🚨 Important Notes

- **Git only tracks committed files** - Remember to commit your changes!
- **node_modules is ignored** - You'll need to run `npm install` after restore
- **.env files are ignored** - Keep backups separately for security
- **Snapshots are local** - Consider pushing to GitHub for cloud backup

## 🌐 Optional: Push to GitHub

```bash
# Create repo on GitHub, then:
git remote add origin https://github.com/yourusername/designforge-ai.git
git branch -M main
git push -u origin main

# Now your snapshots are backed up in the cloud!
```

## 📞 Quick Reference Card

```bash
# CREATE SNAPSHOT
./scripts/snapshot.sh "description"

# VIEW HISTORY
git log --oneline

# RESTORE
./scripts/restore.sh abc123

# EMERGENCY UNDO
git reset --hard HEAD^

# TAG IMPORTANT VERSION
git tag -a "v1.0" -m "description"
```

---

**You now have complete timeline control! Never lose work again. 🎉**
