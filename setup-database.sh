#!/bin/bash

# DesignForge AI - Quick Database Setup Script
# This script helps you set up a PostgreSQL database quickly

echo "🚀 DesignForge AI - Database Setup"
echo "===================================="
echo ""

# Check if PostgreSQL is installed
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL is installed"
    
    # Check if PostgreSQL is running
    if pg_isready -h localhost -p 5432 &> /dev/null; then
        echo "✅ PostgreSQL is running on localhost:5432"
        
        # Get current user
        CURRENT_USER=$(whoami)
        
        # Create database
        echo ""
        echo "📦 Creating 'designforge' database..."
        createdb designforge 2>/dev/null || echo "ℹ️  Database 'designforge' already exists"
        
        # Generate DATABASE_URL
        DB_URL="postgresql://${CURRENT_USER}@localhost:5432/designforge"
        
        echo ""
        echo "✅ Local PostgreSQL database ready!"
        echo ""
        echo "📋 Add this to your .env.local:"
        echo ""
        echo "DATABASE_URL=\"${DB_URL}\""
        echo ""
        
        # Ask to automatically add to .env.local
        read -p "❓ Auto-add to .env.local? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            # Check if DATABASE_URL already exists in .env.local
            if grep -q "^DATABASE_URL=" .env.local 2>/dev/null; then
                # Replace existing
                sed -i '' "s|^DATABASE_URL=.*|DATABASE_URL=\"${DB_URL}\"|" .env.local
                echo "✅ Updated DATABASE_URL in .env.local"
            else
                # Add new
                echo "DATABASE_URL=\"${DB_URL}\"" >> .env.local
                echo "✅ Added DATABASE_URL to .env.local"
            fi
        fi
        
    else
        echo "❌ PostgreSQL is not running"
        echo ""
        echo "📝 Start PostgreSQL with:"
        echo "   brew services start postgresql@15"
        exit 1
    fi
else
    echo "❌ PostgreSQL is NOT installed"
    echo ""
    echo "🎯 Choose one of these options:"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  Option 1: Install PostgreSQL locally (macOS)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "  brew install postgresql@15"
    echo "  brew services start postgresql@15"
    echo "  createdb designforge"
    echo ""
    echo "  Then re-run this script"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  Option 2: Use Neon (RECOMMENDED - 2 minutes)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "  1. Go to: https://neon.tech"
    echo "  2. Sign up (free)"
    echo "  3. Create new project"
    echo "  4. Copy connection string"
    echo "  5. Add to .env.local:"
    echo ""
    echo "     DATABASE_URL=\"your-neon-connection-string\""
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  Option 3: Use Supabase (Free)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "  1. Go to: https://supabase.com"
    echo "  2. Create project"
    echo "  3. Settings → Database → Connection String (URI)"
    echo "  4. Add to .env.local"
    echo ""
    exit 1
fi

echo ""
echo "🔄 Next steps:"
echo ""
echo "1. Push schema to database:"
echo "   npx prisma db push"
echo ""
echo "2. Restart dev server:"
echo "   lsof -ti:3000 | xargs kill -9"
echo "   npm run dev"
echo ""
echo "3. Test save functionality!"
echo ""
