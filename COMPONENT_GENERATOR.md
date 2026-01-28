# 🧩 Component Generator Documentation

## Overview

Production-grade component code generator that creates styled React, Vue, HTML, and CSS components using your generated design tokens.

---

## ✨ Features

- **Multi-Framework Support**: React, Vue, HTML, CSS
- **Design Token Integration**: Uses actual colors and typography from your palette
- **Type-Safe**: Full TypeScript support
- **Production-Ready**: Clean, well-commented code
- **Multiple Variants**: Primary, Secondary, Outline, Ghost
- **Multiple Sizes**: Small, Medium, Large
- **Fully Accessible**: Proper focus states and disabled states

---

## 🚀 Quick Start

### Basic Usage

```typescript
import { generateButtonComponent } from '@/lib/generators';

// Generate button component with your design tokens
const buttonComponent = generateButtonComponent(palette, typography);

// Access different code formats
console.log(buttonComponent.code.react);  // React component
console.log(buttonComponent.code.vue);    // Vue component
console.log(buttonComponent.code.html);   // HTML markup
console.log(buttonComponent.code.css);    // CSS styles
```

### Generate All Components

```typescript
import { generateAllComponents } from '@/lib/generators';

// Generate complete component library
const components = generateAllComponents(palette, typography);

components.forEach(component => {
  console.log(component.name);
  console.log(component.description);
  console.log(component.code.react);
});
```

### Get Specific Component

```typescript
import { getComponentByName } from '@/lib/generators';

// Get a specific component
const button = getComponentByName('Button', palette, typography);

if (button) {
  console.log(button.code.react);
}
```

---

## 📦 Button Component

### Features

✅ **4 Variants:**
- **Primary**: Main action button with brand color
- **Secondary**: Alternative action with secondary color
- **Outline**: Transparent with border
- **Ghost**: Transparent with no border

✅ **3 Sizes:**
- **Small**: Compact for tight spaces
- **Medium**: Default size
- **Large**: Prominent for primary actions

✅ **States:**
- Normal
- Hover
- Active
- Focus
- Disabled

---

## 💻 Generated Code Examples

### React Component

```tsx
import { Button } from './components/Button';

function App() {
  return (
    <div>
      <Button variant="primary" size="md">
        Click me
      </Button>
      
      <Button variant="outline" size="lg">
        Learn more
      </Button>
      
      <Button variant="ghost" size="sm" disabled>
        Disabled
      </Button>
    </div>
  );
}
```

**Features:**
- TypeScript with full prop types
- Customizable className prop
- onClick handler
- Disabled state
- Uses design system colors
- Responsive and accessible

---

### Vue Component

```vue
<template>
  <div>
    <Button variant="primary" size="md">
      Click me
    </Button>
    
    <Button variant="outline" size="lg" @click="handleClick">
      Learn more
    </Button>
    
    <Button variant="ghost" size="sm" :disabled="true">
      Disabled
    </Button>
  </div>
</template>

<script setup>
import Button from './components/Button.vue';

const handleClick = () => {
  console.log('Button clicked!');
};
</script>
```

**Features:**
- Vue 3 Composition API
- TypeScript support
- Event emissions
- Computed classes
- Uses design system colors

---

### HTML + CSS

```html
<button class="btn btn-primary btn-md">
  Click me
</button>

<button class="btn btn-secondary btn-lg">
  Secondary Action
</button>

<button class="btn btn-outline btn-sm">
  Learn more
</button>

<button class="btn btn-ghost btn-md">
  Cancel
</button>
```

**Features:**
- Simple class-based styling
- BEM-like naming convention
- Works with vanilla JavaScript
- All variants and sizes included

---

## 🎨 Design Token Integration

### How Tokens Are Used

The generator injects your actual design tokens:

**Colors:**
```typescript
primary: palette.primary.main        // #3B82F6
primary-hover: palette.primary.shades[600]  // #2563EB
primary-active: palette.primary.shades[700] // #1D4ED8
```

**Typography:**
```typescript
font-family: typography.fonts.body   // 'Inter'
font-weight: typography.weights.semibold  // 600
font-size-sm: typography.scale.sm    // 0.800rem
font-size-md: typography.scale.base  // 1.000rem
font-size-lg: typography.scale.lg    // 1.250rem
```

---

## 📊 Component Structure

### GeneratedComponent Interface

```typescript
interface GeneratedComponent {
  name: string;           // Component name
  description: string;    // Component description
  code: ComponentCode;    // Code in all formats
  preview: string;        // Preview HTML
}
```

### ComponentCode Interface

```typescript
interface ComponentCode {
  react: string;  // React/TypeScript component
  vue: string;    // Vue 3 component
  html: string;   // HTML markup
  css: string;    // CSS styles
}
```

---

## 🎯 Component Variants

### Primary Button

**Use Case:** Main call-to-action

**Style:**
- Background: Primary color
- Text: White
- Hover: Darker shade
- Focus: Ring in primary color

```tsx
<Button variant="primary">Submit</Button>
```

---

### Secondary Button

**Use Case:** Alternative action

**Style:**
- Background: Secondary color
- Text: White
- Hover: Darker shade
- Focus: Ring in secondary color

```tsx
<Button variant="secondary">Cancel</Button>
```

---

### Outline Button

**Use Case:** Less prominent action

**Style:**
- Background: Transparent
- Border: Primary color
- Text: Primary color
- Hover: Light background

```tsx
<Button variant="outline">Learn More</Button>
```

---

### Ghost Button

**Use Case:** Subtle action

**Style:**
- Background: Transparent
- No border
- Text: Primary color
- Hover: Light background

```tsx
<Button variant="ghost">Skip</Button>
```

---

## 📏 Component Sizes

### Small (sm)

**Use Case:** Compact spaces, less important actions

**Style:**
- Padding: 6px 12px
- Font Size: 0.875rem (14px)

```tsx
<Button size="sm">Small</Button>
```

---

### Medium (md)

**Use Case:** Default, most common use

**Style:**
- Padding: 8px 16px
- Font Size: 1rem (16px)

```tsx
<Button size="md">Medium</Button>
```

---

### Large (lg)

**Use Case:** Prominent actions, hero sections

**Style:**
- Padding: 12px 24px
- Font Size: 1.125rem (18px)

```tsx
<Button size="lg">Large</Button>
```

---

## 🎨 Customization

### React Component Customization

```tsx
// Add custom className
<Button variant="primary" className="my-custom-class">
  Custom Styled Button
</Button>

// Custom click handler
<Button onClick={() => console.log('Clicked!')}>
  Click Me
</Button>

// Disabled state
<Button disabled>
  Disabled Button
</Button>
```

### CSS Customization

```css
/* Override button styles */
.btn-primary.my-custom-button {
  border-radius: 9999px;  /* Pill shape */
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

---

## 🔧 API Reference

### `generateButtonComponent(palette, typography)`

Generates a Button component with design tokens.

**Parameters:**
- `palette: ColorPaletteResponse` - Color palette
- `typography: TypographySystem` - Typography system

**Returns:** `GeneratedComponent`

**Example:**
```typescript
const button = generateButtonComponent(palette, typography);
```

---

### `generateAllComponents(palette, typography)`

Generates all available components.

**Parameters:**
- `palette: ColorPaletteResponse` - Color palette
- `typography: TypographySystem` - Typography system

**Returns:** `GeneratedComponent[]`

**Example:**
```typescript
const components = generateAllComponents(palette, typography);
```

---

### `getComponentByName(name, palette, typography)`

Gets a specific component by name.

**Parameters:**
- `name: string` - Component name (case-insensitive)
- `palette: ColorPaletteResponse` - Color palette
- `typography: TypographySystem` - Typography system

**Returns:** `GeneratedComponent | undefined`

**Example:**
```typescript
const button = getComponentByName('Button', palette, typography);
```

---

## 📝 Code Quality

### TypeScript Support

All generated code includes:
- ✅ Full TypeScript types
- ✅ Interface definitions
- ✅ Prop types
- ✅ Event types

### Accessibility

All components include:
- ✅ Proper focus states
- ✅ Keyboard navigation
- ✅ ARIA attributes (where needed)
- ✅ Disabled state handling

### Performance

Generated code is optimized for:
- ✅ Fast rendering
- ✅ Minimal re-renders
- ✅ Efficient transitions
- ✅ Small bundle size

---

## 🎯 Usage Examples

### Example 1: Download Component Code

```typescript
import { generateButtonComponent } from '@/lib/generators';

// Generate button
const button = generateButtonComponent(palette, typography);

// Create file downloads
const reactBlob = new Blob([button.code.react], { type: 'text/plain' });
const vueBlob = new Blob([button.code.vue], { type: 'text/plain' });

// Trigger downloads
downloadFile(reactBlob, 'Button.tsx');
downloadFile(vueBlob, 'Button.vue');
```

---

### Example 2: Display in UI

```tsx
import { generateButtonComponent } from '@/lib/generators';
import { useState } from 'react';

function ComponentView({ palette, typography }) {
  const [tab, setTab] = useState('react');
  const button = generateButtonComponent(palette, typography);
  
  return (
    <div>
      <div className="tabs">
        <button onClick={() => setTab('react')}>React</button>
        <button onClick={() => setTab('vue')}>Vue</button>
        <button onClick={() => setTab('html')}>HTML</button>
        <button onClick={() => setTab('css')}>CSS</button>
      </div>
      
      <pre>
        <code>{button.code[tab]}</code>
      </pre>
      
      <div dangerouslySetInnerHTML={{ __html: button.preview }} />
    </div>
  );
}
```

---

### Example 3: Copy to Clipboard

```typescript
import { generateButtonComponent } from '@/lib/generators';

async function copyReactCode() {
  const button = generateButtonComponent(palette, typography);
  await navigator.clipboard.writeText(button.code.react);
  alert('React code copied to clipboard!');
}
```

---

## 🚀 Future Components

### Coming Soon

- 🔲 **Input**: Text input with variants
- 🔲 **Card**: Container with header, body, footer
- 🔲 **Badge**: Status indicators
- 🔲 **Alert**: Notification messages
- 🔲 **Modal**: Dialog component
- 🔲 **Dropdown**: Select and menu
- 🔲 **Checkbox**: Form checkbox
- 🔲 **Radio**: Form radio button
- 🔲 **Switch**: Toggle switch
- 🔲 **Tabs**: Tabbed interface

Each component will support:
- Multiple variants
- Multiple sizes
- Design token integration
- React, Vue, HTML, CSS
- Full accessibility

---

## ✅ Production Ready

The component generator is:
- ✅ **Type-Safe**: Full TypeScript support
- ✅ **Clean Code**: Well-commented and formatted
- ✅ **Design Token Based**: Uses actual palette and typography
- ✅ **Multi-Framework**: React, Vue, HTML, CSS
- ✅ **Accessible**: Proper focus and keyboard support
- ✅ **Customizable**: Easy to modify generated code
- ✅ **Well-Documented**: Complete API reference

**Ready to generate production-grade components! 🎉**

