# 🗄️ Database Setup Guide - DesignForge AI

## ✅ Status: Schema Created!

Your database layer has been successfully set up with **PostgreSQL** and **Prisma ORM**.

---

## 📋 What's Been Configured

### **1. Prisma ORM** ✅
- **Installed:** `prisma` + `@prisma/client`
- **Provider:** PostgreSQL
- **Location:** `/prisma/schema.prisma`

### **2. Database Schema** ✅

Three models have been created:

#### **User Model**
- Linked to Clerk `userId` for authentication
- Tracks subscription plan and credits
- Relations to DesignSystems and UsageMetrics

#### **DesignSystem Model**
- Stores generated design systems
- JSON fields for colors, typography, components, theme
- Public/private visibility for showcase
- Version tracking and tags

#### **UsageMetrics Model**
- Tracks API usage and generation actions
- Credits tracking per action
- Analytics data for monitoring
- Error logging

---

## 🔧 Environment Variables Required

Add these to your `.env` file (create it if it doesn't exist):

```env
# ===========================
# Database Configuration
# ===========================

# PostgreSQL database connection string
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
DATABASE_URL="postgresql://postgres:password@localhost:5432/designforge?schema=public"

# ===========================
# Existing variables (keep these)
# ===========================

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"

# OpenAI
OPENAI_API_KEY="sk-..."

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRO_PRICE_ID="price_..."
STRIPE_ENTERPRISE_PRICE_ID="price_..."

# Upstash Redis
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

---

## 📊 Database Schema Details

### **User Model (`users` table)**

```prisma
model User {
  id        String   @id @default(cuid())
  clerkId   String   @unique // Clerk user ID
  email     String   @unique
  firstName String?
  lastName  String?
  
  // Subscription & Credits
  plan      String   @default("free")
  credits   Int      @default(10)
  
  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  designSystems DesignSystem[]
  usageMetrics  UsageMetrics[]
}
```

**Key Features:**
- ✅ Linked to Clerk via `clerkId` (unique)
- ✅ Email for user identification
- ✅ Plan tracking (free/pro/enterprise)
- ✅ Credit balance for generations
- ✅ Auto timestamps

**Indexes:**
- `clerkId` - Fast authentication lookups
- `email` - Fast email searches

---

### **DesignSystem Model (`design_systems` table)**

```prisma
model DesignSystem {
  id          String   @id @default(cuid())
  name        String
  description String?
  
  // Design System Data (JSON)
  colors      Json?
  typography  Json?
  components  Json?
  theme       Json?
  
  // Metadata
  isPublic    Boolean  @default(false)
  version     String   @default("1.0.0")
  tags        String[]
  
  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

**Key Features:**
- ✅ Stores complete design systems
- ✅ JSON fields for flexible data structures
- ✅ Public/private toggle for showcase
- ✅ Version tracking
- ✅ Tags for categorization
- ✅ Cascade delete (if user deleted, their design systems are too)

**Indexes:**
- `userId` - Fast user lookups
- `isPublic` - Fast showcase queries
- `createdAt` - Chronological sorting

---

### **UsageMetrics Model (`usage_metrics` table)**

```prisma
model UsageMetrics {
  id            String   @id @default(cuid())
  
  // Usage tracking
  action        String   // "generate_colors", "generate_typography", etc.
  creditsUsed   Int      @default(1)
  
  // Request details
  promptTokens  Int?
  success       Boolean  @default(true)
  errorMessage  String?
  
  // Context
  designSystemId String?
  metadata      Json?
  
  // Timestamps
  createdAt     DateTime @default(now())
  
  // Relations
  userId        String
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

**Key Features:**
- ✅ Tracks every generation action
- ✅ Credits usage per action
- ✅ AI token tracking for cost analysis
- ✅ Success/failure logging
- ✅ Error message storage
- ✅ Flexible metadata JSON field
- ✅ Cascade delete with user

**Indexes:**
- `userId` - Fast user queries
- `action` - Action type filtering
- `createdAt` - Time-based analytics

---

## 🚀 Next Steps

### **Step 1: Set Up PostgreSQL Database**

**Option A: Local PostgreSQL (Recommended for Development)**

```bash
# Install PostgreSQL (macOS)
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb designforge

# Update .env with:
DATABASE_URL="postgresql://postgres:password@localhost:5432/designforge?schema=public"
```

**Option B: Docker PostgreSQL**

```bash
# Run PostgreSQL in Docker
docker run --name designforge-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=designforge \
  -p 5432:5432 \
  -d postgres:15

# Update .env with:
DATABASE_URL="postgresql://postgres:password@localhost:5432/designforge?schema=public"
```

**Option C: Cloud Database (Recommended for Production)**

Popular options:
- **Supabase** (Free tier with PostgreSQL)
- **Neon** (Serverless PostgreSQL)
- **Railway** (Easy deployment)
- **Vercel Postgres** (If deploying to Vercel)

Get connection string from your provider and add to `.env`

---

### **Step 2: Run Migrations**

After setting up your database, create and apply the schema:

```bash
# Generate migration files
npx prisma migrate dev --name init

# This will:
# 1. Create migration files in /prisma/migrations
# 2. Apply the schema to your database
# 3. Generate Prisma Client
```

---

### **Step 3: Generate Prisma Client** (Already done! ✅)

The Prisma Client has been generated and is ready to use.

```bash
# If you need to regenerate:
npx prisma generate
```

---

### **Step 4: Use Prisma in Your Code**

**Create Prisma Client Instance:**

Create `/lib/db/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

**Example Usage in API Routes:**

```typescript
import { prisma } from '@/lib/db/prisma'
import { auth } from '@clerk/nextjs/server'

// Get current user from database
export async function GET() {
  const { userId } = await auth()
  
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  // Find or create user
  const user = await prisma.user.findUnique({
    where: { clerkId: userId }
  })
  
  return Response.json({ user })
}

// Create a design system
export async function POST(req: Request) {
  const { userId } = await auth()
  const data = await req.json()
  
  const designSystem = await prisma.designSystem.create({
    data: {
      name: data.name,
      colors: data.colors,
      typography: data.typography,
      userId: user.id, // Link to user
    }
  })
  
  return Response.json({ designSystem })
}

// Track usage
await prisma.usageMetrics.create({
  data: {
    userId: user.id,
    action: 'generate_colors',
    creditsUsed: 1,
    success: true,
  }
})
```

---

## 🛠️ Useful Prisma Commands

```bash
# View database in Prisma Studio (GUI)
npx prisma studio

# Generate Prisma Client after schema changes
npx prisma generate

# Create a new migration
npx prisma migrate dev --name your_migration_name

# Apply pending migrations (production)
npx prisma migrate deploy

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Pull schema from existing database
npx prisma db pull

# Push schema to database without migrations (dev only)
npx prisma db push

# Format schema file
npx prisma format
```

---

## 📚 Integration Examples

### **Sync Clerk User to Database**

Create a webhook endpoint to sync Clerk users:

```typescript
// app/api/webhooks/clerk/route.ts
import { prisma } from '@/lib/db/prisma'
import { WebhookEvent } from '@clerk/nextjs/server'

export async function POST(req: Request) {
  const evt = await req.json() as WebhookEvent
  
  if (evt.type === 'user.created') {
    await prisma.user.create({
      data: {
        clerkId: evt.data.id,
        email: evt.data.email_addresses[0].email_address,
        firstName: evt.data.first_name,
        lastName: evt.data.last_name,
        plan: 'free',
        credits: 10,
      }
    })
  }
  
  return Response.json({ success: true })
}
```

### **Check User Credits Before Generation**

```typescript
async function generateColors(userId: string) {
  // Get user from database
  const user = await prisma.user.findUnique({
    where: { clerkId: userId }
  })
  
  if (!user || user.credits < 1) {
    throw new Error('Insufficient credits')
  }
  
  // Generate colors...
  const colors = await generateColorPalette()
  
  // Deduct credit and track usage
  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { credits: { decrement: 1 } }
    }),
    prisma.usageMetrics.create({
      data: {
        userId: user.id,
        action: 'generate_colors',
        creditsUsed: 1,
        success: true,
      }
    })
  ])
  
  return colors
}
```

### **Save Design System**

```typescript
async function saveDesignSystem(userId: string, data: any) {
  const user = await prisma.user.findUnique({
    where: { clerkId: userId }
  })
  
  const designSystem = await prisma.designSystem.create({
    data: {
      name: data.name,
      description: data.description,
      colors: data.colors,
      typography: data.typography,
      components: data.components,
      theme: data.theme,
      tags: data.tags || [],
      userId: user.id,
    }
  })
  
  return designSystem
}
```

---

## 🔒 Security Best Practices

### **1. Never Expose Database URLs**
- ✅ `.env` is in `.gitignore`
- ✅ Never commit `.env` to Git
- ✅ Use different databases for dev/staging/production

### **2. Always Validate User Ownership**

```typescript
// ❌ BAD: No ownership check
const designSystem = await prisma.designSystem.findUnique({
  where: { id: designSystemId }
})

// ✅ GOOD: Check ownership
const designSystem = await prisma.designSystem.findFirst({
  where: {
    id: designSystemId,
    user: { clerkId: userId }
  }
})
```

### **3. Use Transactions for Multi-Step Operations**

```typescript
// ✅ Use $transaction for atomic operations
await prisma.$transaction([
  prisma.user.update({
    where: { id: userId },
    data: { credits: { decrement: 1 } }
  }),
  prisma.usageMetrics.create({
    data: { /* ... */ }
  })
])
```

---

## 📊 Monitoring & Analytics

### **Get User Statistics**

```typescript
const stats = await prisma.usageMetrics.aggregate({
  where: { userId: user.id },
  _sum: { creditsUsed: true },
  _count: { action: true },
})
```

### **Get Popular Actions**

```typescript
const popularActions = await prisma.usageMetrics.groupBy({
  by: ['action'],
  _count: { action: true },
  orderBy: { _count: { action: 'desc' } }
})
```

---

## ✅ Database Setup Checklist

- [x] **Prisma installed** ✅
- [x] **Schema created** ✅
- [x] **Models defined** (User, DesignSystem, UsageMetrics) ✅
- [x] **Prisma Client generated** ✅
- [ ] **PostgreSQL database running** (Do this next)
- [ ] **DATABASE_URL in .env** (Do this next)
- [ ] **Run migrations** (`npx prisma migrate dev --name init`)
- [ ] **Create Prisma client instance** (`/lib/db/prisma.ts`)
- [ ] **Test database connection** (`npx prisma studio`)

---

## 🎯 Summary

**What's Ready:**
- ✅ Prisma ORM configured
- ✅ PostgreSQL provider set
- ✅ Complete schema with 3 models
- ✅ Indexes for performance
- ✅ Relations properly defined
- ✅ Prisma Client generated

**What You Need to Do:**
1. Set up PostgreSQL database (local or cloud)
2. Add `DATABASE_URL` to `.env`
3. Run `npx prisma migrate dev --name init`
4. Create Prisma client instance (`/lib/db/prisma.ts`)
5. Start using Prisma in your API routes!

**Your database layer is ready! 🎉🗄️**
