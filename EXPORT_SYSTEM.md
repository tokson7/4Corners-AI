# 📦 Export System Documentation

## Overview

Production-grade export system for design tokens in multiple formats. Allows users to download their generated design system as a ZIP package containing tokens in CSS, Tailwind, Figma, and SCSS formats.

---

## ✨ Features

- **4 Export Formats**: CSS Variables, Tailwind Config, Figma Tokens, SCSS Variables
- **ZIP Packaging**: All files bundled in a single download
- **Comprehensive README**: Auto-generated documentation for each export
- **Type-Safe**: Full TypeScript support
- **Professional Output**: Clean, formatted, production-ready code
- **Flexible**: Choose which formats to include

---

## 🗂️ File Structure

```
lib/exporters/
├── index.ts              # Main exports
├── cssExporter.ts        # CSS Variables generator
├── tailwindExporter.ts   # Tailwind config generator
├── figmaExporter.ts      # Figma tokens generator
├── scssExporter.ts       # SCSS variables generator
└── packageGenerator.ts   # ZIP package creator
```

---

## 🚀 Quick Start

### Basic Usage

```typescript
import {
  generateExportPackage,
  downloadExportPackage
} from '@/lib/exporters';

// Generate export package
const blob = await generateExportPackage(
  palette,
  typography,
  {
    css: true,
    tailwind: true,
    figma: true,
    scss: true
  },
  'my-design-system'
);

// Download the file
downloadExportPackage(blob, 'my-design-system.zip');
```

### Individual Exporters

```typescript
import {
  exportCSSVariables,
  exportTailwindConfig,
  exportFigmaTokens,
  exportSCSSVariables
} from '@/lib/exporters';

// Export specific format
const cssContent = exportCSSVariables(palette, typography, 'my-project');
console.log(cssContent);
```

---

## 📄 Export Formats

### 1. CSS Variables (`design-tokens.css`)

**What it generates:**
- CSS custom properties in `:root` selector
- All color shades (primary, secondary, accent, semantic, neutral)
- Typography tokens (fonts, sizes, weights, line heights, letter spacing)
- Usage examples in comments

**Example output:**
```css
:root {
  /* Primary Colors */
  --color-primary: #3B82F6;
  --color-primary-50: #EFF6FF;
  --color-primary-100: #DBEAFE;
  ...
  
  /* Typography */
  --font-heading: 'Space Grotesk', sans-serif;
  --font-body: 'Inter', sans-serif;
  --text-base: 1.000rem;
  --text-4xl: 3.052rem;
}
```

**Use cases:**
- Vanilla CSS/HTML projects
- React without Tailwind
- Vue.js applications
- Any modern web project

---

### 2. Tailwind Config (`tailwind.config.js`)

**What it generates:**
- Complete Tailwind CSS configuration file
- Extended color palette with all shades
- Custom font families
- Font sizes, weights, line heights, letter spacing
- Usage examples in comments

**Example output:**
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          // ...
        },
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
};
```

**Use cases:**
- Next.js projects with Tailwind
- React + Tailwind CSS
- Vue.js + Tailwind CSS
- Any Tailwind CSS project

---

### 3. Figma Tokens (`figma-tokens.json`)

**What it generates:**
- JSON file compatible with Figma Tokens plugin
- Structured color tokens with metadata
- Typography tokens (families, sizes, weights, etc.)
- W3C Design Tokens format

**Example output:**
```json
{
  "$metadata": {
    "generator": "DesignForge AI",
    "version": "1.0.0"
  },
  "colors": {
    "primary": {
      "$type": "color",
      "50": { "$value": "#EFF6FF" },
      "100": { "$value": "#DBEAFE" }
    }
  },
  "typography": {
    "fontFamilies": {
      "heading": { "$value": "Space Grotesk" }
    }
  }
}
```

**Use cases:**
- Design handoff to developers
- Keeping Figma and code in sync
- Design system documentation
- Collaborative design workflows

---

### 4. SCSS Variables (`_variables.scss`)

**What it generates:**
- SCSS variables for Sass/SCSS preprocessor
- All color tokens as variables
- Typography tokens
- Usage examples with SCSS mixins

**Example output:**
```scss
// Primary Colors
$color-primary: #3B82F6;
$color-primary-50: #EFF6FF;
$color-primary-100: #DBEAFE;

// Typography
$font-heading: 'Space Grotesk', sans-serif;
$font-body: 'Inter', sans-serif;
$text-base: 1.000rem;
```

**Use cases:**
- Angular projects with SCSS
- Legacy Sass/SCSS projects
- Projects using Bootstrap with SCSS
- Any Sass-based workflow

---

## 🎯 ZIP Package Contents

When you generate an export package, you get:

```
design-system.zip
├── README.md              # Comprehensive documentation
├── package.json           # npm package metadata
├── design-tokens.css      # CSS variables (if selected)
├── tailwind.config.js     # Tailwind config (if selected)
├── figma-tokens.json      # Figma tokens (if selected)
└── _variables.scss        # SCSS variables (if selected)
```

### README.md Features

The auto-generated README includes:

- ✅ Quick start guides for each format
- ✅ Usage examples
- ✅ Integration instructions
- ✅ Documentation links
- ✅ Accessibility notes
- ✅ Design token benefits explanation
- ✅ SCSS mixins examples
- ✅ Dark mode tips for CSS
- ✅ Tailwind plugin suggestions

### package.json Features

- Valid npm package structure
- Correct file references
- Appropriate keywords
- Ready for npm publishing (optional)

---

## 💻 API Reference

### `exportCSSVariables(palette, typography, projectName?)`

Generates CSS custom properties file.

**Parameters:**
- `palette: ColorPaletteResponse` - Color palette with all shades
- `typography: TypographySystem` - Typography system
- `projectName?: string` - Optional project name (default: 'design-system')

**Returns:** `string` - Formatted CSS content

**Example:**
```typescript
const css = exportCSSVariables(palette, typography, 'my-project');
console.log(css); // :root { --color-primary: #3B82F6; ... }
```

---

### `exportTailwindConfig(palette, typography)`

Generates Tailwind CSS configuration file.

**Parameters:**
- `palette: ColorPaletteResponse` - Color palette
- `typography: TypographySystem` - Typography system

**Returns:** `string` - Formatted JavaScript config

**Example:**
```typescript
const config = exportTailwindConfig(palette, typography);
// module.exports = { theme: { extend: { ... } } }
```

---

### `exportFigmaTokens(palette, typography)`

Generates Figma Tokens plugin JSON file.

**Parameters:**
- `palette: ColorPaletteResponse` - Color palette
- `typography: TypographySystem` - Typography system

**Returns:** `string` - Formatted JSON content

**Example:**
```typescript
const tokens = exportFigmaTokens(palette, typography);
// { "$metadata": { ... }, "colors": { ... } }
```

---

### `exportSCSSVariables(palette, typography, projectName?)`

Generates SCSS variables file.

**Parameters:**
- `palette: ColorPaletteResponse` - Color palette
- `typography: TypographySystem` - Typography system
- `projectName?: string` - Optional project name

**Returns:** `string` - Formatted SCSS content

**Example:**
```typescript
const scss = exportSCSSVariables(palette, typography);
// $color-primary: #3B82F6; ...
```

---

### `generateExportPackage(palette, typography, options, projectName?)`

Generates complete ZIP package with selected formats.

**Parameters:**
- `palette: ColorPaletteResponse` - Color palette
- `typography: TypographySystem` - Typography system
- `options: ExportOptions` - Format selection
  ```typescript
  {
    css?: boolean;
    tailwind?: boolean;
    figma?: boolean;
    scss?: boolean;
  }
  ```
- `projectName?: string` - Optional project name

**Returns:** `Promise<Blob>` - ZIP file blob

**Example:**
```typescript
const blob = await generateExportPackage(
  palette,
  typography,
  { css: true, tailwind: true },
  'my-project'
);
```

---

### `downloadExportPackage(blob, filename?)`

Triggers browser download of the ZIP file.

**Parameters:**
- `blob: Blob` - ZIP file blob
- `filename?: string` - Optional filename (default: 'design-system.zip')

**Returns:** `void`

**Example:**
```typescript
downloadExportPackage(blob, 'awesome-design-system.zip');
```

---

## 🎨 React Component Example

```tsx
'use client';

import { useState } from 'react';
import { generateExportPackage, downloadExportPackage } from '@/lib/exporters';
import type { ExportOptions } from '@/lib/exporters';

export function ExportButton({ palette, typography }) {
  const [isExporting, setIsExporting] = useState(false);
  const [options, setOptions] = useState<ExportOptions>({
    css: true,
    tailwind: true,
    figma: false,
    scss: false,
  });

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await generateExportPackage(
        palette,
        typography,
        options,
        'my-design-system'
      );
      downloadExportPackage(blob);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div>
      <h3>Export Formats</h3>
      <label>
        <input
          type="checkbox"
          checked={options.css}
          onChange={(e) => setOptions({ ...options, css: e.target.checked })}
        />
        CSS Variables
      </label>
      <label>
        <input
          type="checkbox"
          checked={options.tailwind}
          onChange={(e) => setOptions({ ...options, tailwind: e.target.checked })}
        />
        Tailwind Config
      </label>
      <label>
        <input
          type="checkbox"
          checked={options.figma}
          onChange={(e) => setOptions({ ...options, figma: e.target.checked })}
        />
        Figma Tokens
      </label>
      <label>
        <input
          type="checkbox"
          checked={options.scss}
          onChange={(e) => setOptions({ ...options, scss: e.target.checked })}
        />
        SCSS Variables
      </label>

      <button onClick={handleExport} disabled={isExporting}>
        {isExporting ? 'Exporting...' : 'Download Design System'}
      </button>
    </div>
  );
}
```

---

## 🔧 Integration Examples

### Next.js API Route

```typescript
// app/api/export/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateExportPackage } from '@/lib/exporters';

export async function POST(req: NextRequest) {
  const { palette, typography, options, projectName } = await req.json();

  const blob = await generateExportPackage(
    palette,
    typography,
    options,
    projectName
  );

  return new NextResponse(blob, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${projectName}.zip"`,
    },
  });
}
```

### Vue.js Component

```vue
<template>
  <div>
    <button @click="handleExport" :disabled="isExporting">
      {{ isExporting ? 'Exporting...' : 'Download' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { generateExportPackage, downloadExportPackage } from '@/lib/exporters';

const isExporting = ref(false);

const handleExport = async () => {
  isExporting.value = true;
  try {
    const blob = await generateExportPackage(
      palette.value,
      typography.value,
      { css: true, tailwind: true }
    );
    downloadExportPackage(blob);
  } finally {
    isExporting.value = false;
  }
};
</script>
```

---

## 📊 Output Quality

### CSS Variables
- ✅ Clean, formatted output
- ✅ Logical grouping by category
- ✅ Consistent naming convention
- ✅ Usage examples in comments
- ✅ Modern CSS syntax

### Tailwind Config
- ✅ Valid JavaScript syntax
- ✅ Proper indentation (8 spaces for nested objects)
- ✅ JSDoc comments
- ✅ Usage examples
- ✅ Ready to use

### Figma Tokens
- ✅ Valid JSON format
- ✅ W3C Design Tokens spec compliant
- ✅ Metadata included
- ✅ Proper token structure
- ✅ Compatible with Figma Tokens plugin

### SCSS Variables
- ✅ Valid SCSS syntax
- ✅ Organized by sections
- ✅ Mixin examples
- ✅ Comment documentation
- ✅ Import ready

---

## 🛡️ Error Handling

All exporters include robust error handling:

```typescript
try {
  const blob = await generateExportPackage(palette, typography, options);
  downloadExportPackage(blob);
} catch (error) {
  console.error('Export failed:', error);
  // Show error message to user
}
```

**Common Issues:**
- Invalid palette structure → Validation before export
- Missing typography data → Uses fallback values
- ZIP generation failure → Clear error messages

---

## 🎯 Best Practices

### 1. Always Include README
The generated README is comprehensive and helps users integrate the tokens.

### 2. Choose Relevant Formats
Only export formats that your users actually need:
- Web apps → CSS + Tailwind
- Design handoff → Figma
- Legacy projects → SCSS

### 3. Use Descriptive Project Names
```typescript
// Good
generateExportPackage(palette, typography, options, 'acme-design-system');

// Bad
generateExportPackage(palette, typography, options, 'ds');
```

### 4. Handle Export Errors Gracefully
Show clear error messages to users if export fails.

### 5. Validate Data Before Export
Ensure palette and typography are complete before exporting.

---

## 📚 Resources

- [CSS Custom Properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Tailwind CSS Theme Configuration](https://tailwindcss.com/docs/theme)
- [Figma Tokens Plugin](https://www.figma.com/community/plugin/843461159747178978)
- [Sass Documentation](https://sass-lang.com/documentation)
- [Design Tokens W3C Community Group](https://www.w3.org/community/design-tokens/)
- [JSZip Documentation](https://stuk.github.io/jszip/)

---

## ✅ Production Ready

This export system is:
- ✅ Type-safe (TypeScript)
- ✅ Well-documented
- ✅ Tested formats
- ✅ Clean output
- ✅ Professional quality
- ✅ Zero dependencies (except jszip)
- ✅ Browser compatible
- ✅ Easy to integrate

**Ready for production use! 🚀**

