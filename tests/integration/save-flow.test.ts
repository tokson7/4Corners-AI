import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/design-systems/route'
import { mockPrisma } from '../setup'

describe('Save Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Default mock responses
    mockPrisma.usageMetrics.findUnique.mockResolvedValue({
      id: 'usage-1',
      userId: 'test-user-123',
      generationsUsed: 2,
      generationLimit: 10,
      month: new Date('2026-01-01'),
    })
    
    mockPrisma.designSystem.create.mockResolvedValue({
      id: 'design-system-1',
      name: 'Test Design System',
      description: 'Test description',
      userId: 'test-user-123',
      colors: { primary: '#8B5CF6' },
      typography: { fontPairs: [] },
      components: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  })

  describe('Design System Saving', () => {
    it('saves design system to database successfully', async () => {
      const requestBody = {
        name: 'Modern Tech Startup',
        description: 'AI-powered automation platform',
        colors: {
          primary: { shades: { 500: '#8B5CF6' } },
          secondary: { shades: { 500: '#EC4899' } }
        },
        typography: {
          fontPairs: [{
            name: 'Modern Sans',
            heading: { family: 'Inter' },
            body: { family: 'Inter' }
          }]
        },
        components: []
      }

      const request = new NextRequest('http://localhost:3000/api/design-systems', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data).toHaveProperty('id')
      expect(mockPrisma.designSystem.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'Modern Tech Startup',
          description: 'AI-powered automation platform',
          userId: 'test-user-123',
        })
      })
    })

    it('validates required fields', async () => {
      const invalidRequestBody = {
        // Missing name
        description: 'Test description',
        colors: {},
      }

      const request = new NextRequest('http://localhost:3000/api/design-systems', {
        method: 'POST',
        body: JSON.stringify(invalidRequestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Validation Error')
    })

    it('checks usage limits before saving', async () => {
      // Mock user at limit
      mockPrisma.usageMetrics.findUnique.mockResolvedValue({
        id: 'usage-1',
        userId: 'test-user-123',
        generationsUsed: 10,
        generationLimit: 10,
        month: new Date('2026-01-01'),
      })

      const requestBody = {
        name: 'Test Design System',
        description: 'Test description',
        colors: { primary: '#8B5CF6' },
        typography: { fontPairs: [] },
        components: []
      }

      const request = new NextRequest('http://localhost:3000/api/design-systems', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(429)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Usage Limit Exceeded')
    })

    it('handles database errors gracefully', async () => {
      mockPrisma.designSystem.create.mockRejectedValue(
        new Error('Database connection failed')
      )

      const requestBody = {
        name: 'Test Design System',
        description: 'Test description',
        colors: { primary: '#8B5CF6' },
        typography: { fontPairs: [] },
        components: []
      }

      const request = new NextRequest('http://localhost:3000/api/design-systems', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Internal server error')
    })
  })

  describe('Credit Deduction', () => {
    it('increments usage metrics after successful save', async () => {
      mockPrisma.usageMetrics.update.mockResolvedValue({
        id: 'usage-1',
        userId: 'test-user-123',
        generationsUsed: 3,
        generationLimit: 10,
        month: new Date('2026-01-01'),
      })

      const requestBody = {
        name: 'Test Design System',
        description: 'Test description',
        colors: { primary: '#8B5CF6' },
        typography: { fontPairs: [] },
        components: []
      }

      const request = new NextRequest('http://localhost:3000/api/design-systems', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      await POST(request)

      expect(mockPrisma.usageMetrics.update).toHaveBeenCalledWith({
        where: {
          userId_month: {
            userId: 'test-user-123',
            month: expect.any(Date),
          },
        },
        data: {
          generationsUsed: {
            increment: 1,
          },
        },
      })
    })

    it('creates usage metrics if none exist', async () => {
      mockPrisma.usageMetrics.findUnique.mockResolvedValue(null)
      mockPrisma.usageMetrics.create.mockResolvedValue({
        id: 'usage-new',
        userId: 'test-user-123',
        generationsUsed: 0,
        generationLimit: 10,
        month: new Date('2026-01-01'),
      })

      const requestBody = {
        name: 'Test Design System',
        description: 'Test description',
        colors: { primary: '#8B5CF6' },
        typography: { fontPairs: [] },
        components: []
      }

      const request = new NextRequest('http://localhost:3000/api/design-systems', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      await POST(request)

      expect(mockPrisma.usageMetrics.create).toHaveBeenCalledWith({
        data: {
          userId: 'test-user-123',
          month: expect.any(Date),
          generationsUsed: 1,
          generationLimit: 10,
        },
      })
    })
  })

  describe('Data Persistence', () => {
    it('persists complex design system data correctly', async () => {
      const complexDesignSystem = {
        name: 'Enterprise Design System',
        description: 'Complex multi-brand design system',
        colors: {
          primary: { 
            shades: { 
              50: '#F3F4F6', 
              500: '#8B5CF6', 
              900: '#312E81' 
            } 
          },
          semantic: {
            success: { shades: { 500: '#10B981' } },
            error: { shades: { 500: '#EF4444' } },
            warning: { shades: { 500: '#F59E0B' } }
          }
        },
        typography: {
          fontPairs: [
            {
              name: 'Corporate Serif',
              heading: { family: 'Playfair Display' },
              body: { family: 'Source Sans Pro' }
            },
            {
              name: 'Modern Sans',
              heading: { family: 'Inter' },
              body: { family: 'Inter' }
            }
          ],
          scale: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
          }
        },
        components: []
      }

      const request = new NextRequest('http://localhost:3000/api/design-systems', {
        method: 'POST',
        body: JSON.stringify(complexDesignSystem),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      
      expect(response.status).toBe(201)
      expect(mockPrisma.designSystem.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'Enterprise Design System',
          colors: complexDesignSystem.colors,
          typography: complexDesignSystem.typography,
          description: 'Complex multi-brand design system',
          userId: 'test-user-123',
        })
      })
    })

    it('handles large design system payloads', async () => {
      const largeColors = Array.from({ length: 20 }, (_, i) => ({
        [`palette${i}`]: {
          shades: Array.from({ length: 10 }, (_, j) => ({
            [`${j * 100}`]: `#${Math.random().toString(16).slice(2, 8)}`
          })).reduce((acc, curr) => ({ ...acc, ...curr }), {})
        }
      })).reduce((acc, curr) => ({ ...acc, ...curr }), {})

      const largeDesignSystem = {
        name: 'Large Design System',
        description: 'System with many color variations',
        colors: largeColors,
        typography: { fontPairs: [] },
        components: []
      }

      const request = new NextRequest('http://localhost:3000/api/design-systems', {
        method: 'POST',
        body: JSON.stringify(largeDesignSystem),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      
      expect(response.status).toBe(201)
      expect(mockPrisma.designSystem.create).toHaveBeenCalled()
    })
  })
})