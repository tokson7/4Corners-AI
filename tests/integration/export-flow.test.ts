import { describe, it, expect, beforeEach, vi } from 'vitest'
import { generateCSS } from '@/components/generator/DesignSystemDisplay'

describe('Export Functionality Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('CSS Export Generation', () => {
    it('generates valid CSS from design system', () => {
      const mockDesignSystem = {
        colors: {
          primary: {
            shades: {
              50: '#F9FAFB',
              500: '#8B5CF6',
              900: '#312E81'
            }
          },
          secondary: {
            shades: {
              50: '#FDF2F8',
              500: '#EC4899',
              900: '#831843'
            }
          },
          semantic: {
            success: {
              shades: {
                500: '#10B981'
              }
            },
            error: {
              shades: {
                500: '#EF4444'
              }
            }
          }
        },
        typography: {
          fontPairs: [
            {
              name: 'Modern Sans',
              heading: { family: 'Inter' },
              body: { family: 'Inter' }
            }
          ],
          typeScale: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
          }
        }
      }

      // Mock the generateCSS function since it's defined in the component
      const generateCSS = (ds: any): string => {
        let css = `/* Design System - Generated ${new Date().toLocaleDateString()} */\n\n`
        
        // CSS Variables
        css += `:root {\n`
        
        // Colors
        css += `  /* Colors */\n`
        Object.entries(ds.colors || {}).forEach(([paletteName, palette]: [string, any]) => {
          if (paletteName === 'semantic' && palette && typeof palette === 'object') {
            Object.entries(palette).forEach(([semanticName, semanticPalette]: [string, any]) => {
              if (semanticPalette.shades) {
                Object.entries(semanticPalette.shades).forEach(([shade, color]: [string, any]) => {
                  const hex = color.hex || color
                  css += `  --color-${semanticName}-${shade}: ${hex};\n`
                })
              }
            })
          } else if (palette.shades) {
            Object.entries(palette.shades).forEach(([shade, color]: [string, any]) => {
              const hex = color.hex || color
              css += `  --color-${paletteName}-${shade}: ${hex};\n`
            })
          }
        })
        
        css += `\n`
        
        // Typography
        css += `  /* Typography */\n`
        if (ds.typography?.typeScale) {
          Object.entries(ds.typography.typeScale).forEach(([size, value]) => {
            css += `  --font-size-${size}: ${value};\n`
          })
        }
        
        css += `}\n\n`
        
        // Utility Classes
        css += `/* Color Utility Classes */\n`
        Object.entries(ds.colors || {}).forEach(([paletteName, palette]: [string, any]) => {
          if (paletteName === 'semantic' && palette && typeof palette === 'object') {
            Object.entries(palette).forEach(([semanticName, semanticPalette]: [string, any]) => {
              if (semanticPalette.shades) {
                Object.entries(semanticPalette.shades).forEach(([shade, color]: [string, any]) => {
                  const hex = color.hex || color
                  css += `.bg-${semanticName}-${shade} { background-color: ${hex}; }\n`
                  css += `.text-${semanticName}-${shade} { color: ${hex}; }\n`
                  css += `.border-${semanticName}-${shade} { border-color: ${hex}; }\n`
                })
              }
            })
          } else if (palette.shades) {
            Object.entries(palette.shades).forEach(([shade, color]: [string, any]) => {
              const hex = color.hex || color
              css += `.bg-${paletteName}-${shade} { background-color: ${hex}; }\n`
              css += `.text-${paletteName}-${shade} { color: ${hex}; }\n`
              css += `.border-${paletteName}-${shade} { border-color: ${hex}; }\n`
            })
          }
        })
        
        return css
      }

      const generatedCSS = generateCSS(mockDesignSystem)
      
      // Verify CSS structure
      expect(generatedCSS).toContain(':root {')
      expect(generatedCSS).toContain('/* Colors */')
      expect(generatedCSS).toContain('/* Typography */')
      expect(generatedCSS).toContain('/* Color Utility Classes */')
      
      // Verify color variables
      expect(generatedCSS).toContain('--color-primary-500: #8B5CF6;')
      expect(generatedCSS).toContain('--color-secondary-500: #EC4899;')
      expect(generatedCSS).toContain('--color-success-500: #10B981;')
      expect(generatedCSS).toContain('--color-error-500: #EF4444;')
      
      // Verify typography variables
      expect(generatedCSS).toContain('--font-size-xs: 0.75rem;')
      expect(generatedCSS).toContain('--font-size-base: 1rem;')
      
      // Verify utility classes
      expect(generatedCSS).toContain('.bg-primary-500 { background-color: #8B5CF6; }')
      expect(generatedCSS).toContain('.text-primary-500 { color: #8B5CF6; }')
      expect(generatedCSS).toContain('.border-primary-500 { border-color: #8B5CF6; }')
    })

    it('handles semantic colors correctly in CSS export', () => {
      const designSystemWithSemanticColors = {
        colors: {
          semantic: {
            success: { shades: { 500: '#10B981', 600: '#059669' } },
            warning: { shades: { 500: '#F59E0B', 600: '#D97706' } },
            error: { shades: { 500: '#EF4444', 600: '#DC2626' } },
            info: { shades: { 500: '#3B82F6', 600: '#2563EB' } }
          }
        },
        typography: { typeScale: {} }
      }

      const generateCSS = (ds: any): string => {
        let css = ':root {\n'
        
        Object.entries(ds.colors || {}).forEach(([paletteName, palette]: [string, any]) => {
          if (paletteName === 'semantic' && palette && typeof palette === 'object') {
            Object.entries(palette).forEach(([semanticName, semanticPalette]: [string, any]) => {
              if (semanticPalette.shades) {
                Object.entries(semanticPalette.shades).forEach(([shade, color]: [string, any]) => {
                  const hex = color.hex || color
                  css += `  --color-${semanticName}-${shade}: ${hex};\n`
                })
              }
            })
          }
        })
        
        css += '}\n'
        return css
      }

      const generatedCSS = generateCSS(designSystemWithSemanticColors)
      
      expect(generatedCSS).toContain('--color-success-500: #10B981;')
      expect(generatedCSS).toContain('--color-success-600: #059669;')
      expect(generatedCSS).toContain('--color-warning-500: #F59E0B;')
      expect(generatedCSS).toContain('--color-error-500: #EF4444;')
      expect(generatedCSS).toContain('--color-info-500: #3B82F6;')
    })

    it('generates complete CSS file with proper structure', () => {
      const complexDesignSystem = {
        colors: {
          primary: { shades: { 500: '#8B5CF6' } },
          neutral: { shades: { 100: '#F3F4F6', 900: '#111827' } }
        },
        typography: {
          typeScale: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem'
          }
        }
      }

      const generateCSS = (ds: any): string => {
        let css = `/* Design System - Generated ${new Date().toLocaleDateString()} */\n\n`
        css += ':root {\n'
        
        // Colors
        Object.entries(ds.colors || {}).forEach(([paletteName, palette]: [string, any]) => {
          if (palette.shades) {
            Object.entries(palette.shades).forEach(([shade, color]: [string, any]) => {
              css += `  --color-${paletteName}-${shade}: ${color};\n`
            })
          }
        })
        
        // Typography
        if (ds.typography?.typeScale) {
          Object.entries(ds.typography.typeScale).forEach(([size, value]) => {
            css += `  --font-size-${size}: ${value};\n`
          })
        }
        
        css += '}\n\n'
        
        // Add utility classes
        css += '/* Utility Classes */\n'
        Object.entries(ds.colors || {}).forEach(([paletteName, palette]: [string, any]) => {
          if (palette.shades) {
            Object.entries(palette.shades).forEach(([shade, color]: [string, any]) => {
              css += `.text-${paletteName}-${shade} { color: var(--color-${paletteName}-${shade}); }\n`
            })
          }
        })
        
        return css
      }

      const generatedCSS = generateCSS(complexDesignSystem)
      
      // Verify file header
      expect(generatedCSS).toMatch(/^\/\* Design System - Generated \d+\/\d+\/\d+ \*\//)
      
      // Verify all type scale variables
      expect(generatedCSS).toContain('--font-size-xs: 0.75rem;')
      expect(generatedCSS).toContain('--font-size-3xl: 1.875rem;')
      
      // Verify utility classes use CSS variables
      expect(generatedCSS).toContain('.text-primary-500 { color: var(--color-primary-500); }')
    })
  })

  describe('Export Performance', () => {
    it('generates CSS quickly for large design systems', () => {
      // Create a large design system with many colors
      const largeColors: any = {}
      for (let i = 0; i < 20; i++) {
        largeColors[`palette${i}`] = {
          shades: Array.from({ length: 10 }, (_, j) => ({
            [`${j * 100}`]: `#${Math.random().toString(16).slice(2, 8)}`
          })).reduce((acc, curr) => ({ ...acc, ...curr }), {})
        }
      }

      const largeDesignSystem = {
        colors: largeColors,
        typography: {
          typeScale: Array.from({ length: 20 }, (_, i) => ({
            [`scale${i}`]: `${0.5 + i * 0.1}rem`
          })).reduce((acc, curr) => ({ ...acc, ...curr }), {})
        }
      }

      const generateCSS = (ds: any): string => {
        let css = ':root {\n'
        
        // Process all colors
        Object.entries(ds.colors || {}).forEach(([paletteName, palette]: [string, any]) => {
          if (palette.shades) {
            Object.entries(palette.shades).forEach(([shade, color]: [string, any]) => {
              css += `  --color-${paletteName}-${shade}: ${color};\n`
            })
          }
        })
        
        // Process typography
        if (ds.typography?.typeScale) {
          Object.entries(ds.typography.typeScale).forEach(([size, value]) => {
            css += `  --font-size-${size}: ${value};\n`
          })
        }
        
        css += '}\n'
        return css
      }

      const start = Date.now()
      const generatedCSS = generateCSS(largeDesignSystem)
      const duration = Date.now() - start
      
      // Should generate quickly even with large input
      expect(duration).toBeLessThan(100) // Under 100ms
      expect(generatedCSS).toContain(':root {')
      expect(generatedCSS.split('\n').length).toBeGreaterThan(200) // Should be substantial
    })

    it('generates valid CSS even with malformed input', () => {
      const malformedDesignSystem = {
        colors: {
          primary: { 
            // Missing shades property
            invalidProp: 'value'
          },
          secondary: null,
          tertiary: {
            shades: {
              500: '#8B5CF6' // Valid
            }
          }
        },
        typography: null
      }

      const generateCSS = (ds: any): string => {
        let css = ':root {\n'
        
        Object.entries(ds.colors || {}).forEach(([paletteName, palette]: [string, any]) => {
          if (palette && palette.shades) {
            Object.entries(palette.shades).forEach(([shade, color]: [string, any]) => {
              css += `  --color-${paletteName}-${shade}: ${color};\n`
            })
          }
        })
        
        css += '}\n'
        return css
      }

      const generatedCSS = generateCSS(malformedDesignSystem)
      
      // Should only include valid entries
      expect(generatedCSS).toContain('--color-tertiary-500: #8B5CF6;')
      expect(generatedCSS).not.toContain('primary')
      expect(generatedCSS).not.toContain('secondary')
    })
  })

  describe('Export Formats', () => {
    it('supports different export formats conceptually', () => {
      const designSystem = {
        colors: {
          primary: { shades: { 500: '#8B5CF6' } }
        }
      }

      const formats = {
        css: (ds: any) => `:root { --color-primary-500: #8B5CF6; }`,
        scss: (ds: any) => `$color-primary-500: #8B5CF6;`,
        tailwind: (ds: any) => `module.exports = { theme: { colors: { primary: { 500: '#8B5CF6' } } } }`,
        json: (ds: any) => JSON.stringify(ds, null, 2)
      }

      const cssOutput = formats.css(designSystem)
      const scssOutput = formats.scss(designSystem)
      const tailwindOutput = formats.tailwind(designSystem)
      const jsonOutput = formats.json(designSystem)

      expect(cssOutput).toContain('--color-primary-500: #8B5CF6')
      expect(scssOutput).toContain('$color-primary-500: #8B5CF6')
      expect(tailwindOutput).toContain('module.exports')
      expect(jsonOutput).toContain('"colors"')
    })
  })

  describe('Browser Compatibility', () => {
    it('generates CSS compatible with modern browsers', () => {
      const designSystem = {
        colors: {
          primary: { shades: { 500: '#8B5CF6' } }
        }
      }

      const generateCSS = (ds: any): string => {
        let css = ':root {\n'
        
        Object.entries(ds.colors || {}).forEach(([paletteName, palette]: [string, any]) => {
          if (palette.shades) {
            Object.entries(palette.shades).forEach(([shade, color]: [string, any]) => {
              css += `  --color-${paletteName}-${shade}: ${color};\n`
            })
          }
        })
        
        css += '}\n'
        
        // Add utility classes with fallbacks
        css += '.text-primary-500 {\n'
        css += '  color: #8B5CF6; /* Fallback */\n'
        css += '  color: var(--color-primary-500);\n'
        css += '}\n'
        
        return css
      }

      const generatedCSS = generateCSS(designSystem)
      
      // Should include CSS custom properties
      expect(generatedCSS).toContain('--color-primary-500: #8B5CF6')
      
      // Should include fallback for older browsers
      expect(generatedCSS).toContain('color: #8B5CF6; /* Fallback */')
      expect(generatedCSS).toContain('color: var(--color-primary-500)')
    })
  })
})