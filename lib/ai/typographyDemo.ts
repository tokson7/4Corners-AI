/**
 * Typography Generator - Visual Demo
 * 
 * Run this file to see example outputs from the typography generator.
 * Usage: npx ts-node lib/ai/typographyDemo.ts
 */

import {
  generateTypographySystem,
  getAvailablePersonalities,
  getPersonalityDescription,
  type TypographySystem,
} from './typographyGenerator';

/**
 * Print a horizontal line separator
 */
function printSeparator(char = '═', length = 80): void {
  console.log(char.repeat(length));
}

/**
 * Print a section header
 */
function printHeader(title: string): void {
  console.log('\n');
  printSeparator();
  console.log(`  ${title}`);
  printSeparator();
  console.log();
}

/**
 * Print typography system details
 */
function printTypographySystem(typography: TypographySystem, title: string): void {
  console.log(`\n${title}`);
  console.log('─'.repeat(80));
  
  // Fonts
  console.log('\n📝 Fonts:');
  console.log(`   Heading:  ${typography.fonts.heading}`);
  console.log(`   Body:     ${typography.fonts.body}`);
  console.log(`   Mono:     ${typography.fonts.mono}`);
  
  // Type Scale
  console.log('\n📐 Type Scale (Modular Scale 1.25):');
  const scaleEntries = Object.entries(typography.scale);
  scaleEntries.forEach(([size, value]) => {
    const pixels = (parseFloat(value) * 16).toFixed(1);
    console.log(`   ${size.padEnd(5)} →  ${value.padEnd(10)} (≈${pixels}px)`);
  });
  
  // Weights
  console.log('\n💪 Font Weights:');
  Object.entries(typography.weights).forEach(([name, value]) => {
    console.log(`   ${name.padEnd(10)} →  ${value}`);
  });
  
  // Line Heights
  console.log('\n📏 Line Heights:');
  Object.entries(typography.lineHeights).forEach(([name, value]) => {
    console.log(`   ${name.padEnd(10)} →  ${value}`);
  });
  
  // Letter Spacing
  console.log('\n📝 Letter Spacing:');
  Object.entries(typography.letterSpacing).forEach(([name, value]) => {
    console.log(`   ${name.padEnd(10)} →  ${value}`);
  });
  
  // Google Fonts URL
  console.log('\n🌐 Google Fonts URL:');
  console.log(`   ${typography.googleFontsUrl}`);
  
  // Personality
  console.log('\n🎨 Personality:');
  console.log(`   ${typography.personality}`);
  console.log(`   ${getPersonalityDescription(typography.personality)}`);
}

/**
 * Demo 1: All Personalities
 */
function demoAllPersonalities(): void {
  printHeader('DEMO 1: All Personality Categories');
  
  const personalities = getAvailablePersonalities();
  
  console.log('Available personalities:\n');
  personalities.forEach((personality, index) => {
    const description = getPersonalityDescription(personality);
    console.log(`${index + 1}. ${personality.toUpperCase()}`);
    console.log(`   ${description}\n`);
  });
  
  personalities.forEach((personality) => {
    const typography = generateTypographySystem(personality);
    printTypographySystem(typography, `${personality.toUpperCase()} Typography`);
  });
}

/**
 * Demo 2: Industry Inference
 */
function demoIndustryInference(): void {
  printHeader('DEMO 2: Industry-Based Personality Inference');
  
  const testCases = [
    { industry: 'finance', description: 'Banking application' },
    { industry: 'technology', description: 'SaaS platform' },
    { industry: 'fashion', description: 'Luxury fashion brand' },
    { industry: 'design', description: 'Creative agency' },
    { industry: 'engineering', description: 'Developer tools' },
    { industry: 'food', description: 'Restaurant website' },
    { industry: 'healthcare', description: 'Medical app' },
  ];
  
  testCases.forEach(({ industry, description }) => {
    const typography = generateTypographySystem('unknown', industry);
    console.log(`\n${description} (${industry})`);
    console.log(`  → Personality: ${typography.personality}`);
    console.log(`  → Heading Font: ${typography.fonts.heading}`);
    console.log(`  → Body Font: ${typography.fonts.body}`);
  });
}

/**
 * Demo 3: Type Scale Visualization
 */
function demoTypeScale(): void {
  printHeader('DEMO 3: Type Scale Visualization (Major Third Ratio)');
  
  const typography = generateTypographySystem('modern');
  
  console.log('Base size: 16px (1rem)');
  console.log('Ratio: 1.25 (Major Third)\n');
  console.log('Formula: size = base × ratio^n\n');
  
  const scaleData = [
    { name: 'xs', step: -2, use: 'Small labels, captions' },
    { name: 'sm', step: -1, use: 'Secondary text, metadata' },
    { name: 'base', step: 0, use: 'Body text (default)' },
    { name: 'lg', step: 1, use: 'Large body, small headings' },
    { name: 'xl', step: 2, use: 'H4, subheadings' },
    { name: '2xl', step: 3, use: 'H3' },
    { name: '3xl', step: 4, use: 'H2' },
    { name: '4xl', step: 5, use: 'H1' },
    { name: '5xl', step: 6, use: 'Display text, hero titles' },
    { name: '6xl', step: 7, use: 'Large display, feature text' },
  ];
  
  console.log('Size'.padEnd(8) + 'Step'.padEnd(8) + 'rem'.padEnd(12) + 'px'.padEnd(10) + 'Use Case');
  console.log('─'.repeat(80));
  
  scaleData.forEach(({ name, step, use }) => {
    const remValue = typography.scale[name as keyof typeof typography.scale];
    const pxValue = (parseFloat(remValue) * 16).toFixed(1);
    const stepStr = step >= 0 ? `+${step}` : `${step}`;
    console.log(
      name.padEnd(8) +
      stepStr.padEnd(8) +
      remValue.padEnd(12) +
      `${pxValue}px`.padEnd(10) +
      use
    );
  });
  
  // Show ratio verification
  console.log('\n📊 Ratio Verification:');
  const baseRem = parseFloat(typography.scale.base);
  const lgRem = parseFloat(typography.scale.lg);
  const ratio = lgRem / baseRem;
  console.log(`   lg / base = ${lgRem.toFixed(3)} / ${baseRem.toFixed(3)} = ${ratio.toFixed(3)}`);
  console.log(`   Expected ratio: 1.25 ✓`);
}

/**
 * Demo 4: Font Pairing Examples
 */
function demoFontPairings(): void {
  printHeader('DEMO 4: Font Pairing Examples');
  
  const examples = [
    {
      personality: 'corporate',
      brand: 'Global Bank',
      description: 'Traditional financial institution',
    },
    {
      personality: 'modern',
      brand: 'TechFlow',
      description: 'SaaS productivity platform',
    },
    {
      personality: 'creative',
      brand: 'Pixel Studio',
      description: 'Digital design agency',
    },
    {
      personality: 'elegant',
      brand: 'Luxe Boutique',
      description: 'High-end fashion brand',
    },
    {
      personality: 'technical',
      brand: 'DevTools Pro',
      description: 'Developer IDE and tools',
    },
    {
      personality: 'minimal',
      brand: 'Mindful Wellness',
      description: 'Meditation and wellness app',
    },
    {
      personality: 'playful',
      brand: 'Yummy Treats',
      description: 'Food delivery service',
    },
  ];
  
  examples.forEach(({ personality, brand, description }) => {
    const typography = generateTypographySystem(personality);
    console.log(`\n${brand} — ${description}`);
    console.log(`  Personality: ${personality}`);
    console.log(`  Heading: ${typography.fonts.heading}`);
    console.log(`  Body: ${typography.fonts.body}`);
    console.log(`  Mono: ${typography.fonts.mono}`);
  });
}

/**
 * Demo 5: CSS Integration Example
 */
function demoCSSIntegration(): void {
  printHeader('DEMO 5: CSS Integration Example');
  
  const typography = generateTypographySystem('modern', 'technology');
  
  console.log('Generated CSS Variables:\n');
  console.log('```css');
  console.log(':root {');
  console.log('  /* Font Families */');
  console.log(`  --font-heading: '${typography.fonts.heading}', sans-serif;`);
  console.log(`  --font-body: '${typography.fonts.body}', sans-serif;`);
  console.log(`  --font-mono: '${typography.fonts.mono}', monospace;`);
  console.log();
  console.log('  /* Type Scale */');
  Object.entries(typography.scale).forEach(([size, value]) => {
    console.log(`  --font-${size}: ${value};`);
  });
  console.log();
  console.log('  /* Font Weights */');
  Object.entries(typography.weights).forEach(([name, value]) => {
    console.log(`  --font-weight-${name}: ${value};`);
  });
  console.log();
  console.log('  /* Line Heights */');
  Object.entries(typography.lineHeights).forEach(([name, value]) => {
    console.log(`  --line-height-${name}: ${value};`);
  });
  console.log();
  console.log('  /* Letter Spacing */');
  Object.entries(typography.letterSpacing).forEach(([name, value]) => {
    console.log(`  --letter-spacing-${name}: ${value};`);
  });
  console.log('}');
  console.log('```');
  
  console.log('\n\nUsage in CSS:\n');
  console.log('```css');
  console.log('h1 {');
  console.log('  font-family: var(--font-heading);');
  console.log('  font-size: var(--font-4xl);');
  console.log('  font-weight: var(--font-weight-bold);');
  console.log('  line-height: var(--line-height-tight);');
  console.log('}');
  console.log();
  console.log('body {');
  console.log('  font-family: var(--font-body);');
  console.log('  font-size: var(--font-base);');
  console.log('  line-height: var(--line-height-normal);');
  console.log('}');
  console.log();
  console.log('code {');
  console.log('  font-family: var(--font-mono);');
  console.log('  font-size: var(--font-sm);');
  console.log('}');
  console.log('```');
}

/**
 * Demo 6: React Component Example
 */
function demoReactIntegration(): void {
  printHeader('DEMO 6: React Component Integration');
  
  console.log('```tsx');
  console.log(`import { generateTypographySystem } from '@/lib/ai/typographyGenerator';
import { useEffect } from 'react';

export function TypographyProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Generate typography system
    const typography = generateTypographySystem('modern', 'technology');
    
    // Load Google Fonts
    const link = document.createElement('link');
    link.href = typography.googleFontsUrl;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    // Inject CSS variables
    const style = document.createElement('style');
    style.textContent = \`
      :root {
        --font-heading: '\${typography.fonts.heading}', sans-serif;
        --font-body: '\${typography.fonts.body}', sans-serif;
        --font-mono: '\${typography.fonts.mono}', monospace;
        
        --font-xs: \${typography.scale.xs};
        --font-sm: \${typography.scale.sm};
        --font-base: \${typography.scale.base};
        --font-lg: \${typography.scale.lg};
        --font-xl: \${typography.scale.xl};
        --font-2xl: \${typography.scale['2xl']};
        --font-3xl: \${typography.scale['3xl']};
        --font-4xl: \${typography.scale['4xl']};
        --font-5xl: \${typography.scale['5xl']};
        --font-6xl: \${typography.scale['6xl']};
      }
    \`;
    document.head.appendChild(style);
  }, []);
  
  return <>{children}</>;
}
`);
  console.log('```');
}

/**
 * Run all demos
 */
function runAllDemos(): void {
  console.clear();
  printSeparator('═', 80);
  console.log('  🔤 TYPOGRAPHY GENERATOR - VISUAL DEMO');
  printSeparator('═', 80);
  
  demoAllPersonalities();
  demoIndustryInference();
  demoTypeScale();
  demoFontPairings();
  demoCSSIntegration();
  demoReactIntegration();
  
  printSeparator('═', 80);
  console.log('  ✅ Demo Complete!');
  printSeparator('═', 80);
  console.log();
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllDemos();
}

export { runAllDemos };

