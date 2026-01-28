/**
 * Component Generator Demo
 * 
 * This file demonstrates how to use the component generator.
 * Run this file to see example output.
 */

import type { ColorPaletteResponse, TypographySystem } from '@/lib/types/designSystem';
import { generateButtonComponent, generateAllComponents } from './componentGenerator';

// Mock design tokens for demo
const mockPalette: ColorPaletteResponse = {
  primary: {
    name: 'Blue',
    main: '#3B82F6',
    shades: {
      50: '#EFF6FF',
      100: '#DBEAFE',
      200: '#BFDBFE',
      300: '#93C5FD',
      400: '#60A5FA',
      500: '#3B82F6',
      600: '#2563EB',
      700: '#1D4ED8',
      800: '#1E40AF',
      900: '#1E3A8A',
    },
    reasoning: 'Blue conveys trust and professionalism',
    emotions: ['reliable', 'professional', 'trustworthy'],
  },
  secondary: {
    name: 'Purple',
    main: '#8B5CF6',
    shades: {
      50: '#FAF5FF',
      100: '#F3E8FF',
      200: '#E9D5FF',
      300: '#D8B4FE',
      400: '#C084FC',
      500: '#8B5CF6',
      600: '#7C3AED',
      700: '#6D28D9',
      800: '#5B21B6',
      900: '#4C1D95',
    },
  },
  accent: {
    name: 'Pink',
    main: '#EC4899',
    shades: {
      50: '#FDF2F8',
      100: '#FCE7F3',
      200: '#FBCFE8',
      300: '#F9A8D4',
      400: '#F472B6',
      500: '#EC4899',
      600: '#DB2777',
      700: '#BE185D',
      800: '#9D174D',
      900: '#831843',
    },
  },
  semantic: {
    success: {
      main: '#10B981',
      shades: {
        50: '#ECFDF5',
        100: '#D1FAE5',
        200: '#A7F3D0',
        300: '#6EE7B7',
        400: '#34D399',
        500: '#10B981',
        600: '#059669',
        700: '#047857',
        800: '#065F46',
        900: '#064E3B',
      },
    },
    error: {
      main: '#EF4444',
      shades: {
        50: '#FEF2F2',
        100: '#FEE2E2',
        200: '#FECACA',
        300: '#FCA5A5',
        400: '#F87171',
        500: '#EF4444',
        600: '#DC2626',
        700: '#B91C1C',
        800: '#991B1B',
        900: '#7F1D1D',
      },
    },
    warning: {
      main: '#F59E0B',
      shades: {
        50: '#FFFBEB',
        100: '#FEF3C7',
        200: '#FDE68A',
        300: '#FCD34D',
        400: '#FBBF24',
        500: '#F59E0B',
        600: '#D97706',
        700: '#B45309',
        800: '#92400E',
        900: '#78350F',
      },
    },
    info: {
      main: '#3B82F6',
      shades: {
        50: '#EFF6FF',
        100: '#DBEAFE',
        200: '#BFDBFE',
        300: '#93C5FD',
        400: '#60A5FA',
        500: '#3B82F6',
        600: '#2563EB',
        700: '#1D4ED8',
        800: '#1E40AF',
        900: '#1E3A8A',
      },
    },
  },
  neutrals: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  accessibility: {
    primaryOnWhite: {
      ratio: 4.5,
      AA: true,
      AAA: false,
    },
    primaryOnBlack: {
      ratio: 7.0,
      AA: true,
      AAA: true,
    },
  },
};

const mockTypography: TypographySystem = {
  fonts: {
    heading: 'Inter',
    body: 'Inter',
    mono: 'Fira Code',
  },
  scale: {
    xs: '0.750rem',
    sm: '0.875rem',
    base: '1.000rem',
    lg: '1.125rem',
    xl: '1.250rem',
    '2xl': '1.563rem',
    '3xl': '1.953rem',
    '4xl': '2.441rem',
    '5xl': '3.052rem',
    '6xl': '3.815rem',
  },
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  lineHeights: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
  googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Fira+Code:wght@300;400;500;600;700&display=swap',
  personality: 'modern',
};

// Demo function
export function demoComponentGenerator() {
  console.log('\n=================================');
  console.log('🧩 COMPONENT GENERATOR DEMO');
  console.log('=================================\n');

  // Generate Button component
  console.log('📦 Generating Button component...\n');
  const button = generateButtonComponent(mockPalette, mockTypography);

  console.log('✅ Component Generated!\n');
  console.log('Component Name:', button.name);
  console.log('Description:', button.description);
  console.log('\n---------------------------------');
  console.log('📝 React Component:');
  console.log('---------------------------------');
  console.log(button.code.react.substring(0, 500) + '...\n');

  console.log('---------------------------------');
  console.log('📝 Vue Component:');
  console.log('---------------------------------');
  console.log(button.code.vue.substring(0, 500) + '...\n');

  console.log('---------------------------------');
  console.log('📝 HTML:');
  console.log('---------------------------------');
  console.log(button.code.html + '\n');

  console.log('---------------------------------');
  console.log('📝 CSS (first 500 chars):');
  console.log('---------------------------------');
  console.log(button.code.css.substring(0, 500) + '...\n');

  console.log('---------------------------------');
  console.log('🎨 Preview HTML:');
  console.log('---------------------------------');
  console.log(button.preview.substring(0, 300) + '...\n');

  // Generate all components
  console.log('\n=================================');
  console.log('📦 Generating All Components...');
  console.log('=================================\n');
  
  const allComponents = generateAllComponents(mockPalette, mockTypography);
  
  console.log(`✅ Generated ${allComponents.length} component(s):\n`);
  allComponents.forEach((comp, index) => {
    console.log(`${index + 1}. ${comp.name}: ${comp.description}`);
  });

  console.log('\n=================================');
  console.log('✨ Demo Complete!');
  console.log('=================================\n');

  return button;
}

// Example usage in API endpoint
export function exampleAPIUsage() {
  console.log('\n=================================');
  console.log('🚀 Example API Endpoint Usage');
  console.log('=================================\n');

  const exampleCode = `
// In your API route: app/api/generate/components/route.ts

import { generateAllComponents } from '@/lib/generators';

export async function POST(req: NextRequest) {
  const { palette, typography } = await req.json();
  
  // Generate all components
  const components = generateAllComponents(palette, typography);
  
  return NextResponse.json({
    success: true,
    components: components
  });
}
  `.trim();

  console.log(exampleCode);
  console.log('\n');
}

// Example usage in React component
export function exampleReactUsage() {
  console.log('\n=================================');
  console.log('⚛️ Example React Component Usage');
  console.log('=================================\n');

  const exampleCode = `
// In your React component

import { generateButtonComponent } from '@/lib/generators';
import { useState } from 'react';

function ComponentViewer({ palette, typography }) {
  const [activeTab, setActiveTab] = useState('react');
  const button = generateButtonComponent(palette, typography);
  
  return (
    <div>
      <h2>{button.name}</h2>
      <p>{button.description}</p>
      
      {/* Code tabs */}
      <div className="tabs">
        <button onClick={() => setActiveTab('react')}>React</button>
        <button onClick={() => setActiveTab('vue')}>Vue</button>
        <button onClick={() => setActiveTab('html')}>HTML</button>
        <button onClick={() => setActiveTab('css')}>CSS</button>
      </div>
      
      {/* Code display */}
      <pre>
        <code>{button.code[activeTab]}</code>
      </pre>
      
      {/* Live preview */}
      <div 
        className="preview" 
        dangerouslySetInnerHTML={{ __html: button.preview }} 
      />
      
      {/* Copy button */}
      <button onClick={() => {
        navigator.clipboard.writeText(button.code[activeTab]);
        alert('Code copied!');
      }}>
        Copy Code
      </button>
    </div>
  );
}
  `.trim();

  console.log(exampleCode);
  console.log('\n');
}

// Run demos if this file is executed directly
if (require.main === module) {
  demoComponentGenerator();
  exampleAPIUsage();
  exampleReactUsage();
}

