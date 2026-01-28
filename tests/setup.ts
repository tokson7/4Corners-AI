import '@testing-library/jest-dom'
import { beforeAll, afterAll, beforeEach, vi } from 'vitest'

// Mock Prisma first to avoid initialization issues
export const mockPrisma = {
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    upsert: vi.fn(),
  },
  designSystem: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  usageTracking: {
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  usageMetrics: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  $connect: vi.fn(),
  $disconnect: vi.fn(),
}

vi.mock('@/lib/prisma', () => ({
  prisma: mockPrisma
}))

// Mock environment variables for tests
beforeAll(() => {
  // Set test environment variables
  process.env.OPENAI_API_KEY = 'test-api-key-for-testing'
  process.env.DATABASE_URL = 'file:./test.db'
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_test_testing'
  process.env.CLERK_SECRET_KEY = 'sk_test_testing'
})

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock Clerk auth
export const mockAuth = vi.fn(() => Promise.resolve({ userId: 'test-user-123' }))
export const mockCurrentUser = vi.fn(() => Promise.resolve({
  id: 'test-user-123',
  emailAddresses: [{ emailAddress: 'test@example.com' }],
  firstName: 'Test',
  lastName: 'User',
  imageUrl: 'https://example.com/avatar.jpg',
}))

vi.mock('@clerk/nextjs/server', () => ({
  auth: mockAuth,
  currentUser: mockCurrentUser,
}))

// Mock OpenAI for tests
export const mockOpenAI = vi.fn().mockImplementation(() => ({
  chat: {
    completions: {
      create: vi.fn(() => Promise.resolve({
        choices: [{
          message: {
            content: JSON.stringify({
              colors: {
                primary: { shades: { 500: '#8B5CF6' } },
                secondary: { shades: { 500: '#EC4899' } },
              },
              typography: {
                fontPairs: [{
                  name: 'Modern Sans',
                  heading: { family: 'Inter' },
                  body: { family: 'Inter' },
                }]
              }
            })
          }
        }],
        usage: { total_tokens: 1500 }
      }))
    }
  }
}))

vi.mock('openai', () => ({
  default: mockOpenAI,
  OpenAI: mockOpenAI
}))

// Global test utilities
global.fetch = vi.fn()
global.ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))