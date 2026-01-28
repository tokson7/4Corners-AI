import { prisma } from '../lib/prisma'

async function main() {
  try {
    console.log('Testing database connection...')
    console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...')
    
    await prisma.$connect()
    const userCount = await prisma.user.count()
    console.log('✅ Connection successful!')
    console.log(`Found ${userCount} users`)
    
  } catch (error) {
    console.error('❌ Connection failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
