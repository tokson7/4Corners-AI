/**
 * Database Connection Test
 * Run with: npx tsx scripts/test-db-connection.ts
 */

import { PrismaClient } from '../node_modules/.prisma/client';

async function testDatabaseConnection() {
  console.log('🔍 Testing Neon Database Connection...\n');

  const prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

  try {
    // Test 1: Check connection
    console.log('1️⃣ Testing database connection...');
    await prisma.$connect();
    console.log('✅ Connected to database successfully!\n');

    // Test 2: Check database version
    console.log('2️⃣ Checking PostgreSQL version...');
    const result = await prisma.$queryRaw<Array<{ version: string }>>`SELECT version()`;
    console.log('✅ Database version:', result[0].version.split(' ').slice(0, 2).join(' '));
    console.log('');

    // Test 3: List tables
    console.log('3️⃣ Checking if tables exist...');
    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    `;
    
    if (tables.length === 0) {
      console.log('⚠️  No tables found. You need to run: npx prisma db push\n');
    } else {
      console.log('✅ Found tables:');
      tables.forEach((t: { tablename: string }) => console.log(`   - ${t.tablename}`));
      console.log('');
    }

    // Test 4: Try a simple query (if User table exists)
    if (tables.some((t: { tablename: string }) => t.tablename === 'User')) {
      console.log('4️⃣ Testing User table query...');
      const userCount = await prisma.user.count();
      console.log(`✅ User table accessible. Current user count: ${userCount}\n`);
    }

    console.log('🎉 All database tests passed!\n');
    
  } catch (error: any) {
    console.error('❌ Database connection failed!\n');
    
    if (error.message.includes('P1001')) {
      console.error('Error: Cannot reach database server');
      console.error('Possible causes:');
      console.error('  - Wrong DATABASE_URL in .env.local');
      console.error('  - Database server is down');
      console.error('  - Network/firewall issues\n');
    } else if (error.message.includes('P1003')) {
      console.error('Error: Database does not exist');
      console.error('  - Check your DATABASE_URL database name\n');
    } else if (error.message.includes('authentication failed')) {
      console.error('Error: Authentication failed');
      console.error('  - Check username/password in DATABASE_URL\n');
    } else {
      console.error('Error details:', error.message);
      console.error('');
    }
    
    console.error('Current DATABASE_URL:', process.env.DATABASE_URL ? 
      process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@') : 'NOT SET');
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set in .env.local');
  console.error('\nTo fix this:');
  console.error('1. Go to https://console.neon.tech/');
  console.error('2. Select your project');
  console.error('3. Copy the connection string');
  console.error('4. Add to .env.local: DATABASE_URL="your-connection-string"\n');
  process.exit(1);
}

testDatabaseConnection();
