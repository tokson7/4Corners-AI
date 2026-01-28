/**
 * Debug Script: Check Design System Data
 * 
 * Fetches a design system from the database and dumps its structure
 * to verify that colors and typography are being saved correctly.
 */

import { prisma } from '../lib/prisma';

async function checkDesignSystem() {
  try {
    // Get the most recent design system
    const system = await prisma.designSystem.findFirst({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        colors: true,
        typography: true,
        createdAt: true,
      },
    });

    if (!system) {
      console.log('❌ No design systems found in database');
      return;
    }

    console.log('\n' + '='.repeat(60));
    console.log('🔍 DESIGN SYSTEM DATA CHECK');
    console.log('='.repeat(60));
    console.log(`\n📝 Name: ${system.name}`);
    console.log(`📅 Created: ${system.createdAt}`);
    console.log(`🆔 ID: ${system.id}\n`);

    console.log('🎨 COLORS STRUCTURE:');
    console.log('─'.repeat(60));
    if (system.colors && typeof system.colors === 'object') {
      const colors = system.colors as any;
      console.log(`Color palettes: ${Object.keys(colors).length}`);
      Object.entries(colors).forEach(([key, value]: [string, any]) => {
        if (typeof value === 'object' && value !== null) {
          if (key === 'semantic') {
            console.log(`\n  ${key}:`);
            Object.keys(value).forEach((subKey) => {
              console.log(`    - ${subKey}`);
              if (value[subKey]?.shades) {
                console.log(`      Shades: ${Object.keys(value[subKey].shades).length} shades`);
              }
            });
          } else {
            console.log(`\n  ${key}:`);
            console.log(`    Main: ${value.main || value['500'] || 'N/A'}`);
            if (value.shades) {
              console.log(`    Shades: ${Object.keys(value.shades).length} shades`);
              console.log(`    Shade values: ${Object.keys(value.shades).join(', ')}`);
            }
          }
        }
      });
    } else {
      console.log('  ❌ No colors data or invalid format');
    }

    console.log('\n\n📝 TYPOGRAPHY STRUCTURE:');
    console.log('─'.repeat(60));
    if (system.typography && typeof system.typography === 'object') {
      const typography = system.typography as any;
      console.log(`Typography keys: ${Object.keys(typography).join(', ')}`);
      
      if (typography.fontPairs) {
        console.log(`\nFont Pairings: ${typography.fontPairs.length} pairs`);
        typography.fontPairs.slice(0, 3).forEach((pair: any, i: number) => {
          console.log(`\n  ${i + 1}. ${pair.name}`);
          console.log(`     Heading: ${pair.heading?.family || 'N/A'}`);
          console.log(`     Body: ${pair.body?.family || 'N/A'}`);
        });
        if (typography.fontPairs.length > 3) {
          console.log(`\n  ... and ${typography.fontPairs.length - 3} more`);
        }
      } else if (typography.fonts) {
        console.log(`\nFonts (legacy structure):`);
        console.log(`  Heading: ${typography.fonts.heading}`);
        console.log(`  Body: ${typography.fonts.body}`);
      } else {
        console.log('  ⚠️  No font data found');
      }

      if (typography.typeScale) {
        console.log(`\nType Scale: ${Object.keys(typography.typeScale).length} sizes`);
        console.log(`  Sizes: ${Object.keys(typography.typeScale).join(', ')}`);
      } else if (typography.scale) {
        console.log(`\nScale (legacy): ${Object.keys(typography.scale).length} sizes`);
      }
    } else {
      console.log('  ❌ No typography data or invalid format');
    }

    console.log('\n\n📄 RAW DATA (First 1000 chars):');
    console.log('─'.repeat(60));
    console.log('\nColors:');
    console.log(JSON.stringify(system.colors, null, 2).substring(0, 1000));
    console.log('\nTypography:');
    console.log(JSON.stringify(system.typography, null, 2).substring(0, 1000));
    
    console.log('\n' + '='.repeat(60) + '\n');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDesignSystem();
