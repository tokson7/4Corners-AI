'use client'

import { useState } from 'react'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  designSystem: any
}

export default function ExportModal({ isOpen, onClose, designSystem }: ExportModalProps) {
  const [isExporting, setIsExporting] = useState(false)

  if (!isOpen) return null

  const handleExportOption = async (option: string) => {
    setIsExporting(true)
    
    try {
      switch (option) {
        case 'figma':
          await handleFigmaExport()
          break
          
        case 'sketch':
          alert('Sketch export coming soon!')
          break
          
        case 'css':
          exportCSS()
          break
          
        case 'json':
          exportJSON()
          break
          
        case 'tailwind':
          exportTailwind()
          break
          
        case 'all':
          exportAll()
          break
      }
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
      if (option !== 'figma') {
        onClose()
      }
    }
  }

  const getSystemName = () => {
    return designSystem.name.toLowerCase().replace(/\s+/g, '-')
  }

  // Enhanced Figma Export with Auto-Open
  const handleFigmaExport = async () => {
    try {
      // 1. Generate Figma-compatible JSON
      const figmaTokens = generateFigmaTokensFormat(designSystem)
      const jsonString = JSON.stringify(figmaTokens, null, 2)
      
      // 2. Copy to clipboard automatically
      await navigator.clipboard.writeText(jsonString)
      console.log('✅ Tokens copied to clipboard')
      
      // 3. Show instructions modal FIRST
      showFigmaInstructions()
      
      // 4. THEN open Figma (after 500ms delay so modal renders first)
      setTimeout(() => {
        // Try desktop app first
        const figmaDesktopUrl = 'figma://'
        window.location.href = figmaDesktopUrl
        console.log('📱 Attempting to open Figma desktop app...')
        
        // Fallback to web after 1.5 seconds if desktop doesn't open
        setTimeout(() => {
          const figmaWeb = window.open('https://www.figma.com/', '_blank')
          if (figmaWeb) {
            console.log('🌐 Opened Figma web as fallback')
          } else {
            console.log('⚠️ Popup blocked - user needs to allow popups')
          }
        }, 1500)
      }, 500)
      
    } catch (error) {
      console.error('Figma export error:', error)
      
      // Fallback: Download JSON file
      const figmaTokens = generateFigmaTokensFormat(designSystem)
      const jsonString = JSON.stringify(figmaTokens, null, 2)
      downloadFile(jsonString, 'figma-tokens.json', 'application/json')
      
      alert(
        '📋 JSON file downloaded!\n\n' +
        'To import into Figma:\n' +
        '1. Open Figma\n' +
        '2. Install "Figma Tokens" plugin\n' +
        '3. Open plugin\n' +
        '4. Click Import\n' +
        '5. Select the downloaded JSON file'
      )
    }
  }

  // Generate proper Figma Tokens format
  const generateFigmaTokensFormat = (ds: any) => {
    const tokens: any = {
      global: {
        colors: {},
        typography: {}
      }
    }
    
    // Format colors for Figma Tokens plugin
    if (ds.colors) {
      Object.entries(ds.colors).forEach(([paletteName, palette]: [string, any]) => {
        tokens.global.colors[paletteName] = {}
        
        if (palette.shades) {
          Object.entries(palette.shades).forEach(([shade, color]: [string, any]) => {
            tokens.global.colors[paletteName][shade] = {
              value: color.hex || color,
              type: 'color'
            }
          })
        }
      })
    }
    
    // Format typography for Figma Tokens plugin
    if (ds.typography?.fontPairs) {
      ds.typography.fontPairs.forEach((pair: any, index: number) => {
        tokens.global.typography[`heading-${index + 1}`] = {
          value: {
            fontFamily: pair.heading?.family || 'Inter',
            fontWeight: pair.heading?.weights?.[0] || 700,
            fontSize: '32px',
            lineHeight: '1.2'
          },
          type: 'typography'
        }
        
        tokens.global.typography[`body-${index + 1}`] = {
          value: {
            fontFamily: pair.body?.family || 'Inter',
            fontWeight: pair.body?.weights?.[0] || 400,
            fontSize: '16px',
            lineHeight: '1.5'
          },
          type: 'typography'
        }
      })
    }
    
    return tokens
  }

  // Show beautiful instructions modal
  const showFigmaInstructions = () => {
    // Create instructions overlay
    const overlay = document.createElement('div')
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.9);
      backdrop-filter: blur(10px);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease;
    `
    
    const modal = document.createElement('div')
    modal.style.cssText = `
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 24px;
      padding: 48px;
      max-width: 600px;
      width: 90%;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      animation: slideUp 0.3s ease;
    `
    
    modal.innerHTML = `
      <div style="text-align: center; color: white;">
        <div style="font-size: 64px; margin-bottom: 24px;">✨</div>
        <h2 style="font-size: 32px; font-weight: bold; margin-bottom: 16px;">
          Design Tokens Copied!
        </h2>
        <p style="font-size: 18px; opacity: 0.9; margin-bottom: 32px;">
          Figma is opening... Follow these steps:
        </p>
        
        <div style="text-align: left; background: rgba(255,255,255,0.1); border-radius: 16px; padding: 24px; margin-bottom: 32px;">
          <div style="display: flex; align-items: start; gap: 16px; margin-bottom: 16px;">
            <div style="background: rgba(255,255,255,0.2); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-weight: bold;">1</div>
            <div>
              <p style="font-weight: 600; margin-bottom: 4px;">Open Figma Tokens Plugin</p>
              <p style="opacity: 0.8; font-size: 14px;">Menu → Plugins → Figma Tokens</p>
            </div>
          </div>
          
          <div style="display: flex; align-items: start; gap: 16px; margin-bottom: 16px;">
            <div style="background: rgba(255,255,255,0.2); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-weight: bold;">2</div>
            <div>
              <p style="font-weight: 600; margin-bottom: 4px;">Click "Import" Button</p>
              <p style="opacity: 0.8; font-size: 14px;">In the plugin panel</p>
            </div>
          </div>
          
          <div style="display: flex; align-items: start; gap: 16px;">
            <div style="background: rgba(255,255,255,0.2); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-weight: bold;">3</div>
            <div>
              <p style="font-weight: 600; margin-bottom: 4px;">Paste Tokens</p>
              <p style="opacity: 0.8; font-size: 14px;">Press Cmd+V (Mac) or Ctrl+V (Windows)</p>
            </div>
          </div>
        </div>
        
      <div style="background: rgba(255,255,255,0.15); border-radius: 12px; padding: 16px; margin-bottom: 32px;">
        <p style="font-size: 14px; opacity: 0.9;">
          ℹ️ Don't have Figma Tokens plugin? Install it from Figma Community first.
        </p>
      </div>
      
      <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
        <button 
          id="openFigmaBtn"
          style="
            background: rgba(255,255,255,0.2);
            color: white;
            border: 2px solid white;
            padding: 16px 32px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          "
        >
          🚀 Open Figma Now
        </button>
        
        <button 
          id="closeModalBtn"
          style="
            background: white;
            color: #667eea;
            border: none;
            padding: 16px 32px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
          "
        >
          Got It!
        </button>
      </div>
    </div>
  `
    
    overlay.appendChild(modal)
    document.body.appendChild(overlay)
    
    // ✅ CRITICAL: Add event listeners AFTER appending to DOM
    
    // Handle "Open Figma Now" button
    const openFigmaBtn = document.getElementById('openFigmaBtn')
    if (openFigmaBtn) {
      openFigmaBtn.addEventListener('click', () => {
        console.log('🚀 Opening Figma...')
        
        // Try desktop app first
        window.location.href = 'figma://'
        console.log('📱 Attempted desktop app')
        
        // Fallback to web after 1 second
        setTimeout(() => {
          const figmaWeb = window.open('https://www.figma.com/', '_blank')
          if (figmaWeb) {
            console.log('🌐 Opened Figma web')
          } else {
            console.log('⚠️ Popup blocked - please allow popups')
            alert('Please allow popups to open Figma')
          }
        }, 1000)
      })
      
      // Add hover effects
      openFigmaBtn.addEventListener('mouseenter', () => {
        openFigmaBtn.style.background = 'rgba(255,255,255,0.3)'
        openFigmaBtn.style.transform = 'scale(1.05)'
      })
      openFigmaBtn.addEventListener('mouseleave', () => {
        openFigmaBtn.style.background = 'rgba(255,255,255,0.2)'
        openFigmaBtn.style.transform = 'scale(1)'
      })
    } else {
      console.error('❌ openFigmaBtn not found!')
    }
    
    // Handle "Got It!" button
    const closeModalBtn = document.getElementById('closeModalBtn')
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        console.log('✅ Closing instructions modal')
        overlay.remove()
      })
      
      // Add hover effects
      closeModalBtn.addEventListener('mouseenter', () => {
        closeModalBtn.style.transform = 'scale(1.05)'
      })
      closeModalBtn.addEventListener('mouseleave', () => {
        closeModalBtn.style.transform = 'scale(1)'
      })
    } else {
      console.error('❌ closeModalBtn not found!')
    }
    
    // Close on click outside
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.remove()
      }
    })
    
    // Close on ESC
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        overlay.remove()
        document.removeEventListener('keydown', handleEsc)
      }
    }
    document.addEventListener('keydown', handleEsc)
    
    // Add animations
    const style = document.createElement('style')
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `
    document.head.appendChild(style)
  }

  const generateCSS = (ds: any) => {
    let css = `/* ${ds.name} - Design System */\n`
    css += `/* Generated on ${new Date().toLocaleDateString()} */\n\n`
    css += `:root {\n`
    
    if (ds.colors) {
      css += `  /* Colors */\n`
      Object.entries(ds.colors).forEach(([name, palette]: [string, any]) => {
        if (palette.shades) {
          Object.entries(palette.shades).forEach(([shade, color]: [string, any]) => {
            const hex = color.hex || color
            css += `  --color-${name}-${shade}: ${hex};\n`
          })
        }
      })
    }
    
    if (ds.typography?.typeScale) {
      css += `\n  /* Typography */\n`
      Object.entries(ds.typography.typeScale).forEach(([size, value]) => {
        css += `  --font-size-${size}: ${value};\n`
      })
    }
    
    css += `}\n\n/* Utility Classes */\n`
    
    if (ds.colors) {
      Object.entries(ds.colors).forEach(([name, palette]: [string, any]) => {
        if (palette.shades) {
          Object.entries(palette.shades).forEach(([shade, color]: [string, any]) => {
            const hex = color.hex || color
            css += `.bg-${name}-${shade} { background-color: ${hex}; }\n`
            css += `.text-${name}-${shade} { color: ${hex}; }\n`
            css += `.border-${name}-${shade} { border-color: ${hex}; }\n`
          })
        }
      })
    }
    
    return css
  }

  const generateJSON = (ds: any) => {
    return JSON.stringify({
      name: ds.name,
      version: ds.version || '1.0.0',
      colors: ds.colors,
      typography: ds.typography,
      metadata: {
        createdAt: ds.createdAt,
        updatedAt: ds.updatedAt,
      }
    }, null, 2)
  }

  const generateTailwindConfig = (ds: any) => {
    let config = `/** @type {import('tailwindcss').Config} */\n`
    config += `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n`
    
    if (ds.colors) {
      Object.entries(ds.colors).forEach(([name, palette]: [string, any]) => {
        config += `        '${name}': {\n`
        if (palette.shades) {
          Object.entries(palette.shades).forEach(([shade, color]: [string, any]) => {
            const hex = color.hex || color
            config += `          '${shade}': '${hex}',\n`
          })
        }
        config += `        },\n`
      })
    }
    
    config += `      },\n`
    
    if (ds.typography?.typeScale) {
      config += `      fontSize: {\n`
      Object.entries(ds.typography.typeScale).forEach(([size, value]) => {
        config += `        '${size}': '${value}',\n`
      })
      config += `      },\n`
    }
    
    config += `    },\n  },\n}\n`
    return config
  }

  const generateREADME = (ds: any) => {
    let readme = `# ${ds.name}\n\n`
    readme += `${ds.description || 'Design system documentation'}\n\n`
    readme += `## Installation\n\n`
    readme += `### Using CSS\n\`\`\`html\n<link rel="stylesheet" href="design-system.css">\n\`\`\`\n\n`
    readme += `### Using Tailwind\n\`\`\`javascript\nmodule.exports = require('./tailwind.config.js')\n\`\`\`\n\n`
    readme += `## Colors\n\n`
    
    if (ds.colors) {
      Object.entries(ds.colors).forEach(([name, palette]: [string, any]) => {
        readme += `### ${name.charAt(0).toUpperCase() + name.slice(1)}\n`
        if (palette.shades) {
          Object.entries(palette.shades).forEach(([shade, color]: [string, any]) => {
            const hex = color.hex || color
            readme += `- **${shade}**: \`${hex}\`\n`
          })
        }
        readme += `\n`
      })
    }
    
    readme += `---\n\nGenerated on ${new Date().toLocaleDateString()}\n`
    return readme
  }

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const exportCSS = () => {
    const css = generateCSS(designSystem)
    downloadFile(css, `${getSystemName()}.css`, 'text/css')
  }

  const exportJSON = () => {
    const json = generateJSON(designSystem)
    downloadFile(json, `${getSystemName()}.json`, 'application/json')
  }

  const exportTailwind = () => {
    const config = generateTailwindConfig(designSystem)
    downloadFile(config, `tailwind.config.js`, 'text/javascript')
  }

  const exportAll = () => {
    exportCSS()
    setTimeout(() => exportJSON(), 100)
    setTimeout(() => exportTailwind(), 200)
    setTimeout(() => {
      const readme = generateREADME(designSystem)
      downloadFile(readme, 'README.md', 'text/markdown')
    }, 300)
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in zoom-in-95 duration-200">
        <div 
          className="bg-slate-900 rounded-2xl border border-white/10 w-full max-w-md shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Export Design System</h2>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <p className="text-purple-300 mt-2">Choose how you want to export</p>
          </div>

          {/* Export Options */}
          <div className="p-6 space-y-3">
            {/* Figma */}
            <button
              onClick={() => handleExportOption('figma')}
              disabled={isExporting}
              className="w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📐</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                    Open in Figma
                  </h3>
                  <p className="text-sm text-purple-300">
                    Auto-copy tokens & open Figma with instructions
                  </p>
                </div>
                <svg className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            {/* CSS File */}
            <button
              onClick={() => handleExportOption('css')}
              disabled={isExporting}
              className="w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📄</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                    Download CSS
                  </h3>
                  <p className="text-sm text-purple-300">
                    CSS file with variables and utilities
                  </p>
                </div>
                <svg className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
            </button>

            {/* JSON Tokens */}
            <button
              onClick={() => handleExportOption('json')}
              disabled={isExporting}
              className="w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-mono font-bold text-white">{ }</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                    Download JSON
                  </h3>
                  <p className="text-sm text-purple-300">
                    Design tokens in JSON format
                  </p>
                </div>
                <svg className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
            </button>

            {/* Tailwind Config */}
            <button
              onClick={() => handleExportOption('tailwind')}
              disabled={isExporting}
              className="w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🎨</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                    Tailwind Config
                  </h3>
                  <p className="text-sm text-purple-300">
                    Ready-to-use Tailwind configuration
                  </p>
                </div>
                <svg className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
            </button>

            {/* Download All */}
            <button
              onClick={() => handleExportOption('all')}
              disabled={isExporting}
              className="w-full p-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📦</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">
                    Download All Files
                  </h3>
                  <p className="text-sm text-white/80">
                    Get CSS, JSON, Tailwind, and README
                  </p>
                </div>
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
