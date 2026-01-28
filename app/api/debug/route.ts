import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const { userId } = await auth()

    // Test 1: Auth working?
    console.log('1. User ID:', userId)

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'Not authenticated',
      })
    }

    // Test 2: User exists?
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })
    console.log('2. User:', user)

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found in database',
        userId,
      })
    }

    // Test 3: Can query design systems?
    const systems = await prisma.designSystem.findMany({
      where: { userId: user.id },
      take: 1,
    })
    console.log('3. Design Systems:', systems)

    // Test 4: Check User table schema
    const userTableInfo = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users';
    `
    console.log('4. User table columns:', userTableInfo)

    // Test 5: Check DesignSystem table schema
    const designTableInfo = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'design_systems';
    `
    console.log('5. DesignSystem table columns:', designTableInfo)

    return NextResponse.json({
      success: true,
      userId,
      user,
      systemsCount: systems.length,
      userColumns: userTableInfo,
      designColumns: designTableInfo,
    })
  } catch (error: any) {
    console.error('DEBUG ERROR:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    }, { status: 500 })
  }
}
