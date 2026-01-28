import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { GET } from '@/app/api/user/profile/route'
import { GET as getUsage } from '@/app/api/user/usage/route'
import { mockPrisma, mockAuth, mockCurrentUser } from '../setup'

describe('Authentication Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('User Profile Management', () => {
    it('creates new user profile on first auth', async () => {
      const mockClerkUser = {
        id: 'test-user-123',
        emailAddresses: [{ emailAddress: 'newuser@example.com' }],
        firstName: 'New',
        lastName: 'User',
        imageUrl: 'https://example.com/avatar.jpg',
      }

      // Mock Clerk currentUser
      mockCurrentUser.mockResolvedValue(mockClerkUser)

      mockPrisma.user.upsert.mockResolvedValue({
        id: 'db-user-1',
        clerkId: 'test-user-123',
        email: 'newuser@example.com',
        name: 'New User',
        imageUrl: 'https://example.com/avatar.jpg',
        role: 'USER',
        banned: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const request = new NextRequest('http://localhost:3000/api/user/profile', {
        method: 'GET',
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toHaveProperty('email', 'newuser@example.com')
      expect(data.data).toHaveProperty('name', 'New User')
      expect(data.data).toHaveProperty('role', 'USER')

      expect(mockPrisma.user.upsert).toHaveBeenCalledWith({
        where: { clerkId: 'test-user-123' },
        create: expect.objectContaining({
          clerkId: 'test-user-123',
          email: 'newuser@example.com',
          name: 'New User',
        }),
        update: expect.objectContaining({
          email: 'newuser@example.com',
          name: 'New User',
        }),
      })
    })

    it('updates existing user profile', async () => {
      const mockClerkUser = {
        id: 'test-user-123',
        emailAddresses: [{ emailAddress: 'updated@example.com' }],
        firstName: 'Updated',
        lastName: 'Name',
        imageUrl: 'https://example.com/new-avatar.jpg',
      }

      mockCurrentUser.mockResolvedValue(mockClerkUser)

      mockPrisma.user.upsert.mockResolvedValue({
        id: 'db-user-1',
        clerkId: 'test-user-123',
        email: 'updated@example.com',
        name: 'Updated Name',
        imageUrl: 'https://example.com/new-avatar.jpg',
        role: 'USER',
        banned: false,
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date(),
      })

      const request = new NextRequest('http://localhost:3000/api/user/profile', {
        method: 'GET',
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toHaveProperty('email', 'updated@example.com')
      expect(data.data).toHaveProperty('name', 'Updated Name')
    })

    it('handles unauthorized access', async () => {
      // Mock no user authentication
      mockAuth.mockResolvedValue({ userId: null as any })

      const request = new NextRequest('http://localhost:3000/api/user/profile', {
        method: 'GET',
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Unauthorized')
    })

    it('handles missing Clerk user data', async () => {
      // Mock auth but no currentUser
      mockAuth.mockResolvedValue({ userId: 'test-user-123' })
      mockCurrentUser.mockResolvedValue(null as any)

      const request = new NextRequest('http://localhost:3000/api/user/profile', {
        method: 'GET',
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('User not found')
    })
  })

  describe('Usage Metrics', () => {
    it('retrieves current month usage metrics', async () => {
      mockPrisma.usageMetrics.findUnique.mockResolvedValue({
        id: 'usage-1',
        userId: 'test-user-123',
        generationsUsed: 5,
        generationLimit: 10,
        month: new Date('2026-01-01'),
      })

      const request = new NextRequest('http://localhost:3000/api/user/usage', {
        method: 'GET',
      })

      const response = await getUsage(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toHaveProperty('used', 5)
      expect(data.data).toHaveProperty('limit', 10)
      expect(data.data).toHaveProperty('remaining', 5)
      expect(data.data).toHaveProperty('percentUsed', 50)
    })

    it('creates usage metrics for new user', async () => {
      mockPrisma.usageMetrics.findUnique.mockResolvedValue(null)
      mockPrisma.usageMetrics.create.mockResolvedValue({
        id: 'usage-new',
        userId: 'test-user-123',
        generationsUsed: 0,
        generationLimit: 10,
        month: new Date('2026-01-01'),
      })

      const request = new NextRequest('http://localhost:3000/api/user/usage', {
        method: 'GET',
      })

      const response = await getUsage(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toHaveProperty('used', 0)
      expect(data.data).toHaveProperty('limit', 10)
      expect(data.data).toHaveProperty('remaining', 10)
      expect(data.data).toHaveProperty('percentUsed', 0)

      expect(mockPrisma.usageMetrics.create).toHaveBeenCalledWith({
        data: {
          userId: 'test-user-123',
          month: expect.any(Date),
          generationsUsed: 0,
          generationLimit: 10,
        },
      })
    })

    it('calculates usage statistics correctly', async () => {
      const testCases = [
        { used: 0, limit: 10, expectedRemaining: 10, expectedPercent: 0 },
        { used: 5, limit: 10, expectedRemaining: 5, expectedPercent: 50 },
        { used: 10, limit: 10, expectedRemaining: 0, expectedPercent: 100 },
        { used: 12, limit: 10, expectedRemaining: 0, expectedPercent: 120 }, // Over limit
      ]

      for (const testCase of testCases) {
        mockPrisma.usageMetrics.findUnique.mockResolvedValue({
          id: 'usage-test',
          userId: 'test-user-123',
          generationsUsed: testCase.used,
          generationLimit: testCase.limit,
          month: new Date('2026-01-01'),
        })

        const request = new NextRequest('http://localhost:3000/api/user/usage', {
          method: 'GET',
        })

        const response = await getUsage(request)
        const data = await response.json()

        expect(data.data.used).toBe(testCase.used)
        expect(data.data.limit).toBe(testCase.limit)
        expect(data.data.remaining).toBe(testCase.expectedRemaining)
        expect(data.data.percentUsed).toBe(testCase.expectedPercent)
      }
    })
  })

  describe('User Security', () => {
    it('handles banned user access', async () => {
      const mockClerkUser = {
        id: 'banned-user-123',
        emailAddresses: [{ emailAddress: 'banned@example.com' }],
        firstName: 'Banned',
        lastName: 'User',
        imageUrl: '',
      }

      mockCurrentUser.mockResolvedValue(mockClerkUser)

      mockPrisma.user.upsert.mockResolvedValue({
        id: 'db-user-banned',
        clerkId: 'banned-user-123',
        email: 'banned@example.com',
        name: 'Banned User',
        imageUrl: null,
        role: 'USER',
        banned: true, // User is banned
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const request = new NextRequest('http://localhost:3000/api/user/profile', {
        method: 'GET',
      })

      const response = await GET(request)
      const data = await response.json()

      // Profile endpoint should still work for banned users to show status
      expect(response.status).toBe(200)
      expect(data.data).toHaveProperty('banned', true)
    })

    it('handles admin role correctly', async () => {
      const mockClerkUser = {
        id: 'admin-user-123',
        emailAddresses: [{ emailAddress: 'admin@example.com' }],
        firstName: 'Admin',
        lastName: 'User',
        imageUrl: '',
      }

      mockCurrentUser.mockResolvedValue(mockClerkUser)

      mockPrisma.user.upsert.mockResolvedValue({
        id: 'db-user-admin',
        clerkId: 'admin-user-123',
        email: 'admin@example.com',
        name: 'Admin User',
        imageUrl: null,
        role: 'ADMIN',
        banned: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const request = new NextRequest('http://localhost:3000/api/user/profile', {
        method: 'GET',
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toHaveProperty('role', 'ADMIN')
      expect(data.data).toHaveProperty('banned', false)
    })
  })

  describe('Data Synchronization', () => {
    it('synchronizes email updates from Clerk', async () => {
      const mockClerkUser = {
        id: 'test-user-123',
        emailAddresses: [{ emailAddress: 'newemail@example.com' }],
        firstName: 'Test',
        lastName: 'User',
        imageUrl: 'https://example.com/avatar.jpg',
      }

      mockCurrentUser.mockResolvedValue(mockClerkUser)

      mockPrisma.user.upsert.mockResolvedValue({
        id: 'db-user-1',
        clerkId: 'test-user-123',
        email: 'newemail@example.com',
        name: 'Test User',
        imageUrl: 'https://example.com/avatar.jpg',
        role: 'USER',
        banned: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const request = new NextRequest('http://localhost:3000/api/user/profile', {
        method: 'GET',
      })

      await GET(request)

      expect(mockPrisma.user.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          update: expect.objectContaining({
            email: 'newemail@example.com',
          }),
        })
      )
    })

    it('handles missing email gracefully', async () => {
      const mockClerkUser = {
        id: 'test-user-123',
        emailAddresses: [], // No email addresses
        firstName: 'Test',
        lastName: 'User',
        imageUrl: '',
      }

      mockCurrentUser.mockResolvedValue(mockClerkUser)

      mockPrisma.user.upsert.mockResolvedValue({
        id: 'db-user-1',
        clerkId: 'test-user-123',
        email: '',
        name: 'Test User',
        imageUrl: null,
        role: 'USER',
        banned: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const request = new NextRequest('http://localhost:3000/api/user/profile', {
        method: 'GET',
      })

      const response = await GET(request)

      expect(response.status).toBe(200)
      expect(mockPrisma.user.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({
            email: '',
          }),
        })
      )
    })
  })
})