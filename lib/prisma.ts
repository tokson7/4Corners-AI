import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pool: Pool | undefined
  adapter: PrismaPg | undefined
}

// Create Pool singleton with optimized settings
if (!globalForPrisma.pool) {
  globalForPrisma.pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    max: 8,                      // Reduced from default 20 (less resource waste)
    min: 4,                      // Increased from default 2 (fewer cold starts)
    connectionTimeoutMillis: 2000, // Reduced from default 5000 (faster failures)
    idleTimeoutMillis: 20000,    // Close idle connections after 20s
  })
}

// Create Adapter singleton
if (!globalForPrisma.adapter) {
  globalForPrisma.adapter = new PrismaPg(globalForPrisma.pool)
}

// Create Prisma Client singleton
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ 
    adapter: globalForPrisma.adapter,
    log: ['error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Export types
export type { User, DesignSystem, UsageMetrics } from '@prisma/client'
