#!/usr/bin/env node

/**
 * Enterprise Tier Testing Script
 * 
 * Quick validation script to test enterprise tier functionality
 * Run: node scripts/test-enterprise.js
 */

const API_URL = process.env.API_URL || 'http://localhost:3000';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function section(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'bright');
  console.log('='.repeat(60) + '\n');
}

function pass(message) {
  log(`✅ ${message}`, 'green');
}

function fail(message) {
  log(`❌ ${message}`, 'red');
}

function warn(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function info(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

// Test results
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
};

async function testBasicValidation() {
  section('Test 1: Basic Validation Checks');
  
  // Check if server is running
  try {
    const response = await fetch(API_URL);
    if (response.ok) {
      pass('Development server is running');
      results.passed++;
    } else {
      fail('Server returned error status');
      results.failed++;
    }
  } catch (error) {
    fail(`Cannot connect to ${API_URL}`);
    fail('Please run: npm run dev');
    results.failed++;
    process.exit(1);
  }
}

async function testTierConfigs() {
  section('Test 2: Tier Configuration Validation');
  
  info('Checking TIER_CONFIGS structure...');
  
  // Import tier configs
  try {
    const { TIER_CONFIGS } = require('../types/design-system.ts');
    
    const tiers = ['basic', 'professional', 'enterprise'];
    tiers.forEach(tier => {
      if (TIER_CONFIGS[tier]) {
        pass(`${tier.toUpperCase()} tier configured`);
        info(`  Credits: ${TIER_CONFIGS[tier].credits}`);
        info(`  Palettes: ${TIER_CONFIGS[tier].colorPalettes}`);
        info(`  Fonts: ${TIER_CONFIGS[tier].fontPairings}`);
        info(`  Time: ${TIER_CONFIGS[tier].estimatedTime}`);
        results.passed++;
      } else {
        fail(`${tier.toUpperCase()} tier missing`);
        results.failed++;
      }
    });
    
    // Validate enterprise tier specifically
    const enterprise = TIER_CONFIGS.enterprise;
    if (enterprise.colorPalettes === 20) {
      pass('Enterprise has 20 color palettes');
      results.passed++;
    } else {
      fail(`Enterprise has ${enterprise.colorPalettes} palettes, expected 20`);
      results.failed++;
    }
    
    if (enterprise.fontPairings === 50) {
      pass('Enterprise has 50 font pairings');
      results.passed++;
    } else {
      fail(`Enterprise has ${enterprise.fontPairings} fonts, expected 50`);
      results.failed++;
    }
    
    if (enterprise.credits === 5) {
      pass('Enterprise costs 5 credits');
      results.passed++;
    } else {
      warn(`Enterprise costs ${enterprise.credits} credits, expected 5`);
      results.warnings++;
    }
    
  } catch (error) {
    fail('Failed to load TIER_CONFIGS');
    fail(error.message);
    results.failed++;
  }
}

async function testDatabaseSchema() {
  section('Test 3: Database Schema Validation');
  
  info('Checking Prisma schema...');
  
  const fs = require('fs');
  const path = require('path');
  
  try {
    const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    
    // Check for tier field
    if (schema.includes('tier') && schema.includes('String')) {
      pass('DesignSystem.tier field exists');
      results.passed++;
    } else {
      fail('DesignSystem.tier field not found');
      results.failed++;
    }
    
    // Check for tier index
    if (schema.includes('@@index([tier])')) {
      pass('Tier index configured');
      results.passed++;
    } else {
      warn('Tier index not found (performance impact)');
      results.warnings++;
    }
    
    // Check for brandDescription
    if (schema.includes('brandDescription')) {
      pass('brandDescription field exists');
      results.passed++;
    } else {
      warn('brandDescription field not found');
      results.warnings++;
    }
    
  } catch (error) {
    fail('Failed to read Prisma schema');
    fail(error.message);
    results.failed++;
  }
}

async function testAIGenerator() {
  section('Test 4: AI Generator Configuration');
  
  info('Checking AI generator setup...');
  
  try {
    const generatorPath = require.resolve('../lib/ai/design-generator.ts');
    info(`Generator found at: ${generatorPath}`);
    
    // Check environment variables
    if (process.env.OPENAI_API_KEY) {
      pass('OPENAI_API_KEY configured');
      info(`  Key: ${process.env.OPENAI_API_KEY.substring(0, 15)}...`);
      results.passed++;
    } else {
      fail('OPENAI_API_KEY not set');
      fail('Add to .env.local: OPENAI_API_KEY=sk-...');
      results.failed++;
    }
    
    const provider = process.env.AI_PROVIDER || 'openai';
    info(`AI Provider: ${provider}`);
    
    if (provider === 'openai') {
      pass('Using OpenAI (recommended for enterprise)');
      results.passed++;
    } else {
      warn(`Using ${provider} (may have issues with enterprise tier)`);
      results.warnings++;
    }
    
  } catch (error) {
    fail('AI generator not found');
    fail(error.message);
    results.failed++;
  }
}

async function testCreditSystem() {
  section('Test 5: Credit System Validation');
  
  info('Checking credit management...');
  
  try {
    const servicePath = require.resolve('../lib/services/user-service.ts');
    info(`User service found at: ${servicePath}`);
    
    const fs = require('fs');
    const service = fs.readFileSync(servicePath, 'utf-8');
    
    // Check for checkCredits function
    if (service.includes('function checkCredits') || service.includes('checkCredits')) {
      pass('checkCredits function exists');
      results.passed++;
    } else {
      fail('checkCredits function not found');
      results.failed++;
    }
    
    // Check for deductCredits function
    if (service.includes('function deductCredits') || service.includes('deductCredits')) {
      pass('deductCredits function exists');
      results.passed++;
    } else {
      fail('deductCredits function not found');
      results.failed++;
    }
    
    // Check for tier imports
    if (service.includes('GenerationTier') && service.includes('TIER_CONFIGS')) {
      pass('Tier types imported');
      results.passed++;
    } else {
      warn('Tier types not imported (may not be tier-aware)');
      results.warnings++;
    }
    
  } catch (error) {
    fail('User service not found');
    fail(error.message);
    results.failed++;
  }
}

async function testAPIEndpoint() {
  section('Test 6: API Endpoint Validation');
  
  info('Checking generation API...');
  
  try {
    const fs = require('fs');
    const path = require('path');
    const apiPath = path.join(__dirname, '../app/api/generate/colors/route.ts');
    const api = fs.readFileSync(apiPath, 'utf-8');
    
    // Check for tier validation
    if (api.includes('tier') && api.includes('TIER_CONFIGS')) {
      pass('API supports tier parameter');
      results.passed++;
    } else {
      fail('API does not support tiers');
      results.failed++;
    }
    
    // Check for credit checking
    if (api.includes('checkCredits') || api.includes('user.credits')) {
      pass('API checks user credits');
      results.passed++;
    } else {
      fail('API does not check credits');
      results.failed++;
    }
    
    // Check for credit deduction
    if (api.includes('deductCredits')) {
      pass('API deducts credits');
      results.passed++;
    } else {
      fail('API does not deduct credits');
      results.failed++;
    }
    
    // Check for 402 status code
    if (api.includes('402')) {
      pass('API returns 402 for insufficient credits');
      results.passed++;
    } else {
      warn('API may not handle insufficient credits properly');
      results.warnings++;
    }
    
  } catch (error) {
    fail('API endpoint not found');
    fail(error.message);
    results.failed++;
  }
}

async function testUIComponents() {
  section('Test 7: UI Component Validation');
  
  info('Checking UI components...');
  
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Check GeneratorForm
    const formPath = path.join(__dirname, '../components/generator/GeneratorForm.tsx');
    if (fs.existsSync(formPath)) {
      const form = fs.readFileSync(formPath, 'utf-8');
      
      if (form.includes('TIER_CONFIGS') && form.includes('tier')) {
        pass('GeneratorForm supports tiers');
        results.passed++;
      } else {
        fail('GeneratorForm missing tier support');
        results.failed++;
      }
      
      if (form.includes('Sparkles') && form.includes('Zap') && form.includes('Crown')) {
        pass('Tier icons configured');
        results.passed++;
      } else {
        warn('Tier icons may be missing');
        results.warnings++;
      }
    } else {
      fail('GeneratorForm not found');
      results.failed++;
    }
    
    // Check DesignSystemCard
    const cardPath = path.join(__dirname, '../components/dashboard/DesignSystemCard.tsx');
    if (fs.existsSync(cardPath)) {
      const card = fs.readFileSync(cardPath, 'utf-8');
      
      if (card.includes('TIER_BADGES') && card.includes('tier')) {
        pass('DesignSystemCard shows tier badges');
        results.passed++;
      } else {
        fail('DesignSystemCard missing tier badges');
        results.failed++;
      }
    } else {
      fail('DesignSystemCard not found');
      results.failed++;
    }
    
  } catch (error) {
    fail('UI component check failed');
    fail(error.message);
    results.failed++;
  }
}

async function runAllTests() {
  log('\n🧪 ENTERPRISE TIER TESTING SUITE\n', 'bright');
  info('Testing enterprise tier implementation...\n');
  
  try {
    await testBasicValidation();
    await testTierConfigs();
    await testDatabaseSchema();
    await testAIGenerator();
    await testCreditSystem();
    await testAPIEndpoint();
    await testUIComponents();
  } catch (error) {
    fail('Test suite crashed');
    console.error(error);
    process.exit(1);
  }
  
  // Summary
  section('Test Summary');
  
  console.log(`Total Tests Run: ${results.passed + results.failed + results.warnings}`);
  pass(`Passed: ${results.passed}`);
  fail(`Failed: ${results.failed}`);
  warn(`Warnings: ${results.warnings}`);
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  if (results.failed === 0) {
    log('🎉 ALL TESTS PASSED!', 'green');
    log('\nYou can now test enterprise generation:', 'bright');
    log('1. Run: npm run dev', 'cyan');
    log('2. Navigate to: http://localhost:3000/generate', 'cyan');
    log('3. Select Enterprise tier', 'cyan');
    log('4. Enter a brand description', 'cyan');
    log('5. Click Generate', 'cyan');
    log('\nExpected: 20 palettes × 15 shades = 300 colors + 50 fonts\n', 'yellow');
    process.exit(0);
  } else {
    log('❌ SOME TESTS FAILED', 'red');
    log('\nPlease fix the issues above before testing enterprise tier.\n', 'yellow');
    process.exit(1);
  }
}

// Run tests
runAllTests().catch(error => {
  fail('Fatal error');
  console.error(error);
  process.exit(1);
});
