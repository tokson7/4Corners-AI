import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

/**
 * Prisma Client Instance
 * 
 * This file creates a singleton instance of PrismaClient to avoid
 * creating multiple connections in development (hot reloading).
 * 
 * Prisma 7+ Configuration:
 * - Uses database adapter pattern (PrismaPg) for PostgreSQL
 * - Connection URL from environment variable
 * 
 * Usage:
 * import { prisma } from '@/lib/db/prisma'
 * 
 * const user = await prisma.user.findUnique({ where: { clerkId: userId } })
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  // Create Prisma Pg adapter (Prisma 7 pattern)
  const adapter = new PrismaPg(process.env.DATABASE_URL as string)
  
  // Create Prisma client with adapter
  // The adapter will connect when first query is made
  const client = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  })
  
  return client
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

/**
 * Type exports for convenience
 */
export type { User, DesignSystem, UsageMetrics} from '@prisma/client'
