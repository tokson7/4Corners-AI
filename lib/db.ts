import { prisma } from './prisma'

let isConnected = false

export async function connectToDatabase() {
  if (isConnected) {
    return
  }

  try {
    await prisma.$connect()
    isConnected = true
    console.log('✅ Database connected successfully')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    throw error
  }
}

export async function disconnectFromDatabase() {
  if (!isConnected) {
    return
  }

  try {
    await prisma.$disconnect()
    isConnected = false
    console.log('Database disconnected')
  } catch (error) {
    console.error('Database disconnect error:', error)
  }
}

// Auto-retry on connection timeout
export async function ensureDbConnection() {
  const maxRetries = 3
  let retries = 0

  while (retries < maxRetries) {
    try {
      await connectToDatabase()
      return true
    } catch (error) {
      retries++
      console.log(`Retry ${retries}/${maxRetries}...`)
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }

  throw new Error('Failed to connect to database after multiple retries')
}
