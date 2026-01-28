/**
 * API Error Handling Test
 * Tests that all API routes return JSON responses (never HTML) on errors
 * 
 * Run with: npx tsx scripts/test-api-errors.ts
 */

const API_BASE_URL = 'http://localhost:3000/api';

interface TestResult {
  endpoint: string;
  method: string;
  scenario: string;
  passed: boolean;
  error?: string;
  response?: any;
}

const results: TestResult[] = [];

async function testEndpoint(
  endpoint: string,
  method: string,
  scenario: string,
  options: RequestInit = {}
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      ...options,
    });

    const contentType = response.headers.get('content-type');
    
    // Check if response is JSON
    if (!contentType?.includes('application/json')) {
      results.push({
        endpoint,
        method,
        scenario,
        passed: false,
        error: `Expected JSON, got ${contentType}`,
      });
      return;
    }

    // Try to parse JSON
    let data;
    try {
      data = await response.json();
    } catch (error) {
      results.push({
        endpoint,
        method,
        scenario,
        passed: false,
        error: 'Response is not valid JSON',
      });
      return;
    }

    // Check response structure
    if (!data.hasOwnProperty('success')) {
      results.push({
        endpoint,
        method,
        scenario,
        passed: false,
        error: 'Response missing "success" field',
        response: data,
      });
      return;
    }

    // For error responses, check required fields
    if (data.success === false) {
      if (!data.error || !data.message) {
        results.push({
          endpoint,
          method,
          scenario,
          passed: false,
          error: 'Error response missing "error" or "message" fields',
          response: data,
        });
        return;
      }
    }

    results.push({
      endpoint,
      method,
      scenario,
      passed: true,
      response: data,
    });
  } catch (error: any) {
    results.push({
      endpoint,
      method,
      scenario,
      passed: false,
      error: error.message,
    });
  }
}

async function runTests() {
  console.log('🧪 Testing API Error Handling\n');
  console.log('Ensuring all endpoints return JSON (never HTML) on errors\n');
  console.log('=' .repeat(60) + '\n');

  // Test 1: Unauthorized access (no auth)
  console.log('Test 1: Unauthorized access...');
  await testEndpoint('/generate-design-system', 'POST', 'POST without auth');
  await testEndpoint('/design-systems', 'GET', 'GET without auth');
  await testEndpoint('/user/profile', 'GET', 'GET profile without auth');
  await testEndpoint('/user/usage', 'GET', 'GET usage without auth');

  // Test 2: Invalid JSON body
  console.log('Test 2: Invalid request bodies...');
  await testEndpoint('/generate-design-system', 'POST', 'POST with invalid JSON', {
    headers: { 'Content-Type': 'application/json' },
    body: 'not valid json{',
  });

  // Test 3: Missing required fields
  console.log('Test 3: Missing required fields...');
  await testEndpoint('/generate-design-system', 'POST', 'POST without brandDescription', {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });

  // Test 4: Validation errors
  console.log('Test 4: Validation errors...');
  await testEndpoint('/generate-design-system', 'POST', 'POST with short description', {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ brandDescription: 'short' }),
  });

  await testEndpoint('/generate-design-system', 'POST', 'POST with long description', {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      brandDescription: 'a'.repeat(600) 
    }),
  });

  // Test 5: DELETE without ID
  console.log('Test 5: DELETE operations...');
  await testEndpoint('/design-systems', 'DELETE', 'DELETE without ID');
  await testEndpoint('/design-systems?id=invalid-id', 'DELETE', 'DELETE with invalid ID');

  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Test Results:\n');

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  // Show failed tests first
  if (failed > 0) {
    console.log('❌ Failed Tests:\n');
    results
      .filter(r => !r.passed)
      .forEach(result => {
        console.log(`  ${result.method} ${result.endpoint}`);
        console.log(`  Scenario: ${result.scenario}`);
        console.log(`  Error: ${result.error}`);
        if (result.response) {
          console.log(`  Response:`, JSON.stringify(result.response, null, 2));
        }
        console.log('');
      });
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log(`\n✅ Passed: ${passed}/${results.length}`);
  console.log(`❌ Failed: ${failed}/${results.length}\n`);

  if (failed === 0) {
    console.log('🎉 All tests passed! All APIs return proper JSON on errors.\n');
  } else {
    console.log('⚠️  Some tests failed. Fix the issues above.\n');
    process.exit(1);
  }

  // Show all successful test details
  console.log('\n✅ Successful Tests:\n');
  results
    .filter(r => r.passed)
    .forEach(result => {
      console.log(`  ✓ ${result.method} ${result.endpoint} - ${result.scenario}`);
    });
  console.log('');
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3000');
    return true;
  } catch (error) {
    console.error('❌ Server is not running at http://localhost:3000');
    console.error('Please start the server with: npm run dev\n');
    process.exit(1);
  }
}

// Run tests
checkServer().then(() => {
  setTimeout(runTests, 1000);
});
