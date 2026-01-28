/**
 * Design System Generation Performance Test
 * Tests all tiers and measures generation times
 * 
 * Run with: npx tsx scripts/test-generation-performance.ts
 */

import { generateDesignSystem, getEstimatedTime, validateAPIKey } from '../lib/ai/design-generator';

interface TestResult {
  tier: string;
  brand: string;
  success: boolean;
  time: number;
  tokenCount?: number;
  responseSize?: number;
  error?: string;
  withinTarget: boolean;
}

const testBrands = [
  'A modern tech startup focused on AI and machine learning',
  'An eco-friendly sustainable fashion brand',
  'A luxury hotel and resort chain',
  'A vibrant fitness and wellness company',
  'A professional financial services firm',
];

async function testGeneration(
  brand: string,
  tier: 'basic' | 'professional' | 'enterprise'
): Promise<TestResult> {
  const estimate = getEstimatedTime(tier);
  
  console.log(`\nTesting ${tier} tier...`);
  console.log(`Brand: ${brand.substring(0, 50)}...`);
  console.log(`Target: ${estimate.min}ms - ${estimate.max}ms`);

  const startTime = Date.now();

  // Add timeout safety (65 seconds to match client)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 65000);

  try {
    const result = await generateDesignSystem(brand, tier, controller.signal);
    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;
    const withinTarget = duration <= estimate.max;

    console.log(`✅ Success in ${duration}ms ${withinTarget ? '✓' : '✗ (exceeded target)'}`);

    return {
      tier,
      brand: brand.substring(0, 30),
      success: true,
      time: duration,
      tokenCount: result.metadata.tokenCount,
      responseSize: result.metadata.responseSize,
      withinTarget,
    };
  } catch (error: any) {
    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;
    
    if (error.name === 'AbortError') {
      console.log(`⏱️ Timeout in ${duration}ms (exceeded 65s limit)`);
    } else {
      console.log(`❌ Failed in ${duration}ms: ${error.message}`);
    }

    return {
      tier,
      brand: brand.substring(0, 30),
      success: false,
      time: duration,
      error: error.name === 'AbortError' ? 'Timeout (>65s)' : error.message,
      withinTarget: false,
    };
  }
}

async function runPerformanceTests() {
  console.log('🎨 Design System Generation Performance Test\n');
  console.log('=' .repeat(60));

  // Check API key
  if (!validateAPIKey()) {
    console.error('\n❌ OPENAI_API_KEY not set. Please add it to .env.local');
    console.error('Get your key from: https://platform.openai.com/api-keys\n');
    process.exit(1);
  }

  const results: TestResult[] = [];

  // Test Basic Tier (1 test)
  console.log('\n📦 BASIC TIER (Target: 3-5 seconds)');
  console.log('-'.repeat(60));
  results.push(await testGeneration(testBrands[0], 'basic'));

  // Test Professional Tier (2 tests)
  console.log('\n\n💼 PROFESSIONAL TIER (Target: 8-12 seconds)');
  console.log('-'.repeat(60));
  results.push(await testGeneration(testBrands[1], 'professional'));
  results.push(await testGeneration(testBrands[2], 'professional'));

  // Test Enterprise Tier (5 tests as requested)
  console.log('\n\n🏢 ENTERPRISE TIER (Target: 12-18 seconds)');
  console.log('-'.repeat(60));
  for (let i = 0; i < 5; i++) {
    results.push(await testGeneration(testBrands[i % testBrands.length], 'enterprise'));
    if (i < 4) {
      console.log('\nWaiting 2s before next test...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // Summary
  console.log('\n\n' + '='.repeat(60));
  console.log('📊 PERFORMANCE SUMMARY\n');

  const byTier = {
    basic: results.filter(r => r.tier === 'basic'),
    professional: results.filter(r => r.tier === 'professional'),
    enterprise: results.filter(r => r.tier === 'enterprise'),
  };

  Object.entries(byTier).forEach(([tier, tierResults]) => {
    if (tierResults.length === 0) return;

    const successful = tierResults.filter(r => r.success);
    const failed = tierResults.filter(r => !r.success);
    const withinTarget = successful.filter(r => r.withinTarget);

    if (successful.length > 0) {
      const times = successful.map(r => r.time);
      const avgTime = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
      const minTime = Math.min(...times);
      const maxTime = Math.max(...times);

      const estimate = getEstimatedTime(tier as any);

      console.log(`\n${tier.toUpperCase()}:`);
      console.log(`  Tests: ${tierResults.length} (${successful.length} passed, ${failed.length} failed)`);
      console.log(`  Average: ${avgTime}ms`);
      console.log(`  Range: ${minTime}ms - ${maxTime}ms`);
      console.log(`  Target: ${estimate.min}ms - ${estimate.max}ms`);
      console.log(`  Within Target: ${withinTarget.length}/${successful.length} ${withinTarget.length === successful.length ? '✅' : '⚠️'}`);

      if (successful.length > 0) {
        const avgTokens = Math.round(successful.reduce((a, b) => a + (b.tokenCount || 0), 0) / successful.length);
        const avgSize = Math.round(successful.reduce((a, b) => a + (b.responseSize || 0), 0) / successful.length);
        console.log(`  Avg Tokens: ${avgTokens}`);
        console.log(`  Avg Response Size: ${(avgSize / 1024).toFixed(1)} KB`);
      }
    }
  });

  // Overall stats
  const totalTests = results.length;
  const totalSuccess = results.filter(r => r.success).length;
  const totalFailed = results.filter(r => !r.success).length;
  const totalWithinTarget = results.filter(r => r.success && r.withinTarget).length;

  console.log('\n' + '='.repeat(60));
  console.log('\n🎯 OVERALL RESULTS:');
  console.log(`  Total Tests: ${totalTests}`);
  console.log(`  Successful: ${totalSuccess} (${Math.round(totalSuccess / totalTests * 100)}%)`);
  console.log(`  Failed: ${totalFailed}`);
  console.log(`  Within Target: ${totalWithinTarget}/${totalSuccess} (${Math.round(totalWithinTarget / totalSuccess * 100)}%)`);

  // Check specific requirements
  const enterpriseResults = results.filter(r => r.tier === 'enterprise' && r.success);
  const allEnterpriseUnder20s = enterpriseResults.every(r => r.time < 20000);
  
  console.log('\n✅ REQUIREMENTS:');
  console.log(`  All enterprise < 20s: ${allEnterpriseUnder20s ? '✅' : '❌'}`);
  console.log(`  All parse successfully: ${totalFailed === 0 ? '✅' : '❌'}`);
  console.log(`  No 500 errors: ${totalFailed === 0 ? '✅' : '❌'}`);

  if (totalFailed > 0) {
    console.log('\n❌ FAILURES:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  ${r.tier}: ${r.error}`);
    });
  }

  console.log('\n' + '='.repeat(60) + '\n');

  if (totalFailed === 0 && allEnterpriseUnder20s) {
    console.log('🎉 All tests passed! Performance targets achieved.\n');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed or exceeded targets.\n');
    process.exit(1);
  }
}

runPerformanceTests().catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});
