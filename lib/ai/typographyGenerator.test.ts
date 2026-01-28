/**
 * Typography Generator Tests
 * 
 * Comprehensive tests for the typography generation system.
 * Run with: npm test or node --loader ts-node/esm typographyGenerator.test.ts
 */

import {
  generateTypographySystem,
  getAvailablePersonalities,
  getPersonalityDescription,
  convertToTailwindConfig,
  type TypographySystem,
  type FontPairing,
  type TypeScale,
} from './typographyGenerator';

/**
 * Test utilities
 */
function assert(condition: boolean, message: string): void {
  if (!condition) {
    console.error('❌ FAILED:', message);
    throw new Error(message);
  }
  console.log('✅ PASSED:', message);
}

function assertDefined(value: any, name: string): void {
  assert(value !== undefined && value !== null, `${name} should be defined`);
}

function assertType(value: any, type: string, name: string): void {
  assert(typeof value === type, `${name} should be of type ${type}`);
}

/**
 * Test 1: Generate typography system for each personality
 */
function testAllPersonalities(): void {
  console.log('\n🧪 Test 1: Generate typography for all personalities\n');
  
  const personalities = [
    'corporate',
    'modern',
    'creative',
    'elegant',
    'technical',
    'minimal',
    'playful',
  ];
  
  personalities.forEach((personality) => {
    const typography = generateTypographySystem(personality);
    
    assertDefined(typography, `Typography for ${personality}`);
    assertDefined(typography.fonts, `Fonts for ${personality}`);
    assertDefined(typography.scale, `Scale for ${personality}`);
    assertDefined(typography.weights, `Weights for ${personality}`);
    assertDefined(typography.lineHeights, `Line heights for ${personality}`);
    assertDefined(typography.letterSpacing, `Letter spacing for ${personality}`);
    assertDefined(typography.googleFontsUrl, `Google Fonts URL for ${personality}`);
    
    console.log(`  ${personality}:`);
    console.log(`    Heading: ${typography.fonts.heading}`);
    console.log(`    Body: ${typography.fonts.body}`);
    console.log(`    Mono: ${typography.fonts.mono}`);
  });
}

/**
 * Test 2: Validate font pairing structure
 */
function testFontPairingStructure(): void {
  console.log('\n🧪 Test 2: Validate font pairing structure\n');
  
  const typography = generateTypographySystem('modern');
  const fonts = typography.fonts;
  
  assertDefined(fonts.heading, 'Heading font');
  assertDefined(fonts.body, 'Body font');
  assertDefined(fonts.mono, 'Mono font');
  
  assertType(fonts.heading, 'string', 'Heading font');
  assertType(fonts.body, 'string', 'Body font');
  assertType(fonts.mono, 'string', 'Mono font');
  
  assert(fonts.heading.length > 0, 'Heading font should not be empty');
  assert(fonts.body.length > 0, 'Body font should not be empty');
  assert(fonts.mono.length > 0, 'Mono font should not be empty');
}

/**
 * Test 3: Validate type scale
 */
function testTypeScale(): void {
  console.log('\n🧪 Test 3: Validate type scale\n');
  
  const typography = generateTypographySystem('modern');
  const scale = typography.scale;
  
  const sizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'];
  
  sizes.forEach((size) => {
    assertDefined(scale[size as keyof TypeScale], `Scale size ${size}`);
    assert(
      scale[size as keyof TypeScale].endsWith('rem'),
      `Scale size ${size} should be in rem units`
    );
  });
  
  // Test that sizes are progressively larger
  const parseRem = (value: string) => parseFloat(value.replace('rem', ''));
  
  assert(
    parseRem(scale.xs) < parseRem(scale.sm),
    'xs should be smaller than sm'
  );
  assert(
    parseRem(scale.sm) < parseRem(scale.base),
    'sm should be smaller than base'
  );
  assert(
    parseRem(scale.base) < parseRem(scale.lg),
    'base should be smaller than lg'
  );
  assert(
    parseRem(scale['5xl']) < parseRem(scale['6xl']),
    '5xl should be smaller than 6xl'
  );
  
  console.log('  Type scale values:');
  sizes.forEach((size) => {
    console.log(`    ${size}: ${scale[size as keyof TypeScale]}`);
  });
}

/**
 * Test 4: Validate weights
 */
function testWeights(): void {
  console.log('\n🧪 Test 4: Validate font weights\n');
  
  const typography = generateTypographySystem('modern');
  const weights = typography.weights;
  
  const expectedWeights = [
    'light',
    'normal',
    'medium',
    'semibold',
    'bold',
    'extrabold',
    'black',
  ];
  
  expectedWeights.forEach((weight) => {
    assertDefined(weights[weight], `Weight ${weight}`);
    assertType(weights[weight], 'number', `Weight ${weight}`);
    assert(
      weights[weight] >= 100 && weights[weight] <= 900,
      `Weight ${weight} should be between 100 and 900`
    );
  });
  
  // Test that weights are progressively heavier
  assert(weights.light < weights.normal, 'light < normal');
  assert(weights.normal < weights.medium, 'normal < medium');
  assert(weights.medium < weights.semibold, 'medium < semibold');
  assert(weights.semibold < weights.bold, 'semibold < bold');
  assert(weights.bold < weights.extrabold, 'bold < extrabold');
  assert(weights.extrabold < weights.black, 'extrabold < black');
  
  console.log('  Font weights:', weights);
}

/**
 * Test 5: Validate line heights
 */
function testLineHeights(): void {
  console.log('\n🧪 Test 5: Validate line heights\n');
  
  const typography = generateTypographySystem('modern');
  const lineHeights = typography.lineHeights;
  
  const expectedLineHeights = ['none', 'tight', 'snug', 'normal', 'relaxed', 'loose'];
  
  expectedLineHeights.forEach((lh) => {
    assertDefined(lineHeights[lh], `Line height ${lh}`);
    assertType(lineHeights[lh], 'number', `Line height ${lh}`);
    assert(
      lineHeights[lh] >= 1 && lineHeights[lh] <= 2,
      `Line height ${lh} should be between 1 and 2`
    );
  });
  
  console.log('  Line heights:', lineHeights);
}

/**
 * Test 6: Validate letter spacing
 */
function testLetterSpacing(): void {
  console.log('\n🧪 Test 6: Validate letter spacing\n');
  
  const typography = generateTypographySystem('modern');
  const letterSpacing = typography.letterSpacing;
  
  const expectedLetterSpacing = [
    'tighter',
    'tight',
    'normal',
    'wide',
    'wider',
    'widest',
  ];
  
  expectedLetterSpacing.forEach((ls) => {
    assertDefined(letterSpacing[ls], `Letter spacing ${ls}`);
    assertType(letterSpacing[ls], 'string', `Letter spacing ${ls}`);
    assert(
      letterSpacing[ls].endsWith('em'),
      `Letter spacing ${ls} should be in em units`
    );
  });
  
  console.log('  Letter spacing:', letterSpacing);
}

/**
 * Test 7: Validate Google Fonts URL
 */
function testGoogleFontsUrl(): void {
  console.log('\n🧪 Test 7: Validate Google Fonts URL\n');
  
  const typography = generateTypographySystem('modern');
  const url = typography.googleFontsUrl;
  
  assertDefined(url, 'Google Fonts URL');
  assertType(url, 'string', 'Google Fonts URL');
  assert(
    url.startsWith('https://fonts.googleapis.com/css2'),
    'URL should start with Google Fonts API'
  );
  assert(url.includes('family='), 'URL should include font families');
  assert(url.includes('display=swap'), 'URL should include display=swap');
  
  console.log('  URL:', url);
}

/**
 * Test 8: Industry inference
 */
function testIndustryInference(): void {
  console.log('\n🧪 Test 8: Test industry inference\n');
  
  const testCases = [
    { industry: 'finance', expectedPersonality: 'corporate' },
    { industry: 'technology', expectedPersonality: 'modern' },
    { industry: 'design', expectedPersonality: 'creative' },
    { industry: 'fashion', expectedPersonality: 'elegant' },
    { industry: 'engineering', expectedPersonality: 'technical' },
  ];
  
  testCases.forEach(({ industry, expectedPersonality }) => {
    const typography = generateTypographySystem('unknown', industry);
    assert(
      typography.personality === expectedPersonality,
      `Industry ${industry} should infer personality ${expectedPersonality}`
    );
    console.log(`  ${industry} → ${typography.personality} ✓`);
  });
}

/**
 * Test 9: Unknown personality fallback
 */
function testUnknownPersonality(): void {
  console.log('\n🧪 Test 9: Test unknown personality fallback\n');
  
  const typography = generateTypographySystem('nonexistent-personality');
  
  assertDefined(typography, 'Typography system');
  assert(
    typography.personality === 'modern',
    'Unknown personality should default to modern'
  );
  console.log(`  Unknown personality defaults to: ${typography.personality} ✓`);
}

/**
 * Test 10: Available personalities
 */
function testAvailablePersonalities(): void {
  console.log('\n🧪 Test 10: Test available personalities\n');
  
  const personalities = getAvailablePersonalities();
  
  assertDefined(personalities, 'Available personalities');
  assert(Array.isArray(personalities), 'Should return an array');
  assert(personalities.length > 0, 'Should have at least one personality');
  
  console.log('  Available personalities:', personalities);
}

/**
 * Test 11: Personality descriptions
 */
function testPersonalityDescriptions(): void {
  console.log('\n🧪 Test 11: Test personality descriptions\n');
  
  const personalities = ['corporate', 'modern', 'creative', 'elegant'];
  
  personalities.forEach((personality) => {
    const description = getPersonalityDescription(personality);
    assertDefined(description, `Description for ${personality}`);
    assertType(description, 'string', `Description for ${personality}`);
    assert(description.length > 0, `Description for ${personality} should not be empty`);
    console.log(`  ${personality}: ${description.substring(0, 50)}...`);
  });
}

/**
 * Test 12: Tailwind conversion
 */
function testTailwindConversion(): void {
  console.log('\n🧪 Test 12: Test Tailwind configuration conversion\n');
  
  const typography = generateTypographySystem('modern');
  const tailwindConfig = convertToTailwindConfig(typography.scale);
  
  assertDefined(tailwindConfig, 'Tailwind config');
  assert(typeof tailwindConfig === 'object', 'Should be an object');
  
  const sizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'];
  sizes.forEach((size) => {
    assertDefined(tailwindConfig[size], `Tailwind config ${size}`);
  });
  
  console.log('  Tailwind config:', tailwindConfig);
}

/**
 * Test 13: Modular scale ratio
 */
function testModularScaleRatio(): void {
  console.log('\n🧪 Test 13: Validate modular scale ratio (1.25)\n');
  
  const typography = generateTypographySystem('modern');
  const scale = typography.scale;
  
  const parseRem = (value: string) => parseFloat(value.replace('rem', ''));
  
  // Check that ratio is approximately 1.25
  const ratio = parseRem(scale.lg) / parseRem(scale.base);
  const expectedRatio = 1.25;
  const tolerance = 0.01;
  
  assert(
    Math.abs(ratio - expectedRatio) < tolerance,
    `Ratio should be approximately ${expectedRatio}, got ${ratio.toFixed(3)}`
  );
  
  console.log(`  Base: ${scale.base}`);
  console.log(`  Large: ${scale.lg}`);
  console.log(`  Ratio: ${ratio.toFixed(3)} (expected: ${expectedRatio})`);
}

/**
 * Test 14: Consistency across multiple generations
 */
function testConsistency(): void {
  console.log('\n🧪 Test 14: Test consistency across generations\n');
  
  // Generate same personality multiple times
  const systems = Array.from({ length: 5 }, () =>
    generateTypographySystem('modern')
  );
  
  // All should have the same scale, weights, lineHeights, letterSpacing
  const firstSystem = systems[0];
  
  systems.forEach((system, index) => {
    assert(
      JSON.stringify(system.scale) === JSON.stringify(firstSystem.scale),
      `Scale should be consistent (iteration ${index})`
    );
    assert(
      JSON.stringify(system.weights) === JSON.stringify(firstSystem.weights),
      `Weights should be consistent (iteration ${index})`
    );
    assert(
      JSON.stringify(system.lineHeights) === JSON.stringify(firstSystem.lineHeights),
      `Line heights should be consistent (iteration ${index})`
    );
    assert(
      JSON.stringify(system.letterSpacing) === JSON.stringify(firstSystem.letterSpacing),
      `Letter spacing should be consistent (iteration ${index})`
    );
  });
  
  console.log('  All values consistent across 5 generations ✓');
}

/**
 * Run all tests
 */
function runAllTests(): void {
  console.log('═══════════════════════════════════════════════════');
  console.log('🧪 Typography Generator Test Suite');
  console.log('═══════════════════════════════════════════════════');
  
  try {
    testAllPersonalities();
    testFontPairingStructure();
    testTypeScale();
    testWeights();
    testLineHeights();
    testLetterSpacing();
    testGoogleFontsUrl();
    testIndustryInference();
    testUnknownPersonality();
    testAvailablePersonalities();
    testPersonalityDescriptions();
    testTailwindConversion();
    testModularScaleRatio();
    testConsistency();
    
    console.log('\n═══════════════════════════════════════════════════');
    console.log('✅ All tests passed!');
    console.log('═══════════════════════════════════════════════════\n');
  } catch (error) {
    console.log('\n═══════════════════════════════════════════════════');
    console.log('❌ Tests failed!');
    console.log('═══════════════════════════════════════════════════\n');
    console.error(error);
    process.exit(1);
  }
}

/**
 * Visual demo
 */
function visualDemo(): void {
  console.log('\n📊 Visual Demo - Typography Systems\n');
  
  const personalities = ['corporate', 'modern', 'creative', 'elegant', 'technical'];
  
  personalities.forEach((personality) => {
    console.log(`\n${personality.toUpperCase()}`);
    console.log('─'.repeat(50));
    
    const typography = generateTypographySystem(personality);
    
    console.log(`Fonts:`);
    console.log(`  Heading:  ${typography.fonts.heading}`);
    console.log(`  Body:     ${typography.fonts.body}`);
    console.log(`  Mono:     ${typography.fonts.mono}`);
    
    console.log(`\nType Scale:`);
    console.log(`  xs:  ${typography.scale.xs}`);
    console.log(`  sm:  ${typography.scale.sm}`);
    console.log(`  base: ${typography.scale.base}`);
    console.log(`  lg:  ${typography.scale.lg}`);
    console.log(`  xl:  ${typography.scale.xl}`);
    console.log(`  2xl: ${typography.scale['2xl']}`);
    console.log(`  3xl: ${typography.scale['3xl']}`);
    console.log(`  4xl: ${typography.scale['4xl']}`);
    console.log(`  5xl: ${typography.scale['5xl']}`);
    console.log(`  6xl: ${typography.scale['6xl']}`);
    
    console.log(`\nGoogle Fonts URL:`);
    console.log(`  ${typography.googleFontsUrl}`);
  });
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests();
  visualDemo();
}

export { runAllTests, visualDemo };

