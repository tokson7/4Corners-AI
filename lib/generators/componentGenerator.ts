/**
 * Component Code Generator
 * 
 * Generates styled component code using design tokens.
 * Supports React, Vue, HTML, and CSS output formats.
 */

import type { ColorPaletteResponse, TypographySystem } from '@/lib/types/designSystem';

/**
 * Component code in multiple frameworks
 */
export interface ComponentCode {
  react: string;
  vue: string;
  html: string;
  css: string;
}

/**
 * Generated component with all code variants
 */
export interface GeneratedComponent {
  name: string;
  description: string;
  code: ComponentCode;
  preview: string; // Preview HTML
}

/**
 * Generate Button component with design tokens
 * 
 * Creates a fully-featured button component with variants (primary, secondary, outline, ghost)
 * and sizes (sm, md, lg) using the design system's color palette and typography.
 * 
 * @param palette - Color palette with design tokens
 * @param typography - Typography system with fonts and scales
 * @returns Generated button component code in multiple formats
 */
export function generateButtonComponent(
  palette: ColorPaletteResponse,
  typography: TypographySystem
): GeneratedComponent {
  // Extract colors for easy reference
  const primaryMain = palette.primary.main;
  const primary50 = palette.primary.shades[50];
  const primary600 = palette.primary.shades[600];
  const primary700 = palette.primary.shades[700];
  const secondaryMain = palette.secondary.main;
  const secondary600 = palette.secondary.shades[600];
  const secondary700 = palette.secondary.shades[700];
  const grayWhite = palette.neutrals[50];
  
  // Extract typography
  const fontBody = typography.fonts.body;
  const fontSemibold = typography.weights.semibold;
  const textSm = typography.scale.sm;
  const textBase = typography.scale.base;
  const textLg = typography.scale.lg;

  // React Component
  const react = `import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Button Component
 * 
 * Customizable button with multiple variants and sizes.
 * Uses design system tokens for consistent styling.
 */
export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  className = ''
}) => {
  // Base styles applied to all buttons
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center';
  
  // Variant-specific styles
  const variantClasses = {
    primary: \`bg-[${primaryMain}] text-white hover:bg-[${primary600}] active:bg-[${primary700}] focus:ring-[${primaryMain}]\`,
    secondary: \`bg-[${secondaryMain}] text-white hover:bg-[${secondary600}] active:bg-[${secondary700}] focus:ring-[${secondaryMain}]\`,
    outline: \`bg-transparent border-2 border-[${primaryMain}] text-[${primaryMain}] hover:bg-[${primary50}] focus:ring-[${primaryMain}]\`,
    ghost: \`bg-transparent text-[${primaryMain}] hover:bg-[${primary50}] focus:ring-[${primaryMain}]\`
  };
  
  // Size-specific styles
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      ].join(' ')}
      style={{ fontFamily: '${fontBody}' }}
    >
      {children}
    </button>
  );
};

// Usage examples:
// <Button variant="primary" size="md">Click me</Button>
// <Button variant="outline" size="lg">Learn more</Button>
// <Button variant="ghost" size="sm" disabled>Disabled</Button>`.trim();

  // Vue Component
  const vue = `<template>
  <button
    :class="buttonClasses"
    :disabled="disabled"
    :style="buttonStyle"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false
});

const emit = defineEmits<{
  click: [event: MouseEvent]
}>();

const buttonClasses = computed(() => {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center';
  
  const variantClasses = {
    primary: 'bg-[${primaryMain}] text-white hover:bg-[${primary600}] active:bg-[${primary700}] focus:ring-[${primaryMain}]',
    secondary: 'bg-[${secondaryMain}] text-white hover:bg-[${secondary600}] active:bg-[${secondary700}] focus:ring-[${secondaryMain}]',
    outline: 'bg-transparent border-2 border-[${primaryMain}] text-[${primaryMain}] hover:bg-[${primary50}] focus:ring-[${primaryMain}]',
    ghost: 'bg-transparent text-[${primaryMain}] hover:bg-[${primary50}] focus:ring-[${primaryMain}]'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  return [
    baseClasses,
    variantClasses[props.variant],
    sizeClasses[props.size],
    props.disabled && 'opacity-50 cursor-not-allowed'
  ].filter(Boolean).join(' ');
});

const buttonStyle = computed(() => ({
  fontFamily: '${fontBody}'
}));

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event);
  }
};
</script>

<!-- Usage examples: -->
<!-- <Button variant="primary" size="md">Click me</Button> -->
<!-- <Button variant="outline" size="lg">Learn more</Button> -->
<!-- <Button variant="ghost" size="sm" :disabled="true">Disabled</Button> -->`.trim();

  // HTML with inline styles
  const html = `<!-- Button Component HTML -->
<!-- Copy and paste these button examples -->

<!-- Primary Button (Medium) -->
<button class="btn btn-primary btn-md">
  Click me
</button>

<!-- Secondary Button (Large) -->
<button class="btn btn-secondary btn-lg">
  Secondary Action
</button>

<!-- Outline Button (Small) -->
<button class="btn btn-outline btn-sm">
  Learn more
</button>

<!-- Ghost Button (Medium) -->
<button class="btn btn-ghost btn-md">
  Cancel
</button>

<!-- Disabled Button -->
<button class="btn btn-primary btn-md" disabled>
  Disabled
</button>`.trim();

  // CSS Styles
  const css = `/* Button Component CSS */
/* Generated from design system tokens */

.btn {
  /* Base styles */
  font-family: '${fontBody}', sans-serif;
  font-weight: ${fontSemibold};
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  outline: none;
}

.btn:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px white, 0 0 0 4px currentColor;
}

/* Sizes */
.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: ${textSm};
}

.btn-md {
  padding: 0.5rem 1rem;
  font-size: ${textBase};
}

.btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: ${textLg};
}

/* Primary variant */
.btn-primary {
  background-color: ${primaryMain};
  color: ${grayWhite};
}

.btn-primary:hover:not(:disabled) {
  background-color: ${primary600};
}

.btn-primary:active:not(:disabled) {
  background-color: ${primary700};
}

.btn-primary:focus {
  box-shadow: 0 0 0 2px white, 0 0 0 4px ${primaryMain};
}

/* Secondary variant */
.btn-secondary {
  background-color: ${secondaryMain};
  color: ${grayWhite};
}

.btn-secondary:hover:not(:disabled) {
  background-color: ${secondary600};
}

.btn-secondary:active:not(:disabled) {
  background-color: ${secondary700};
}

.btn-secondary:focus {
  box-shadow: 0 0 0 2px white, 0 0 0 4px ${secondaryMain};
}

/* Outline variant */
.btn-outline {
  background-color: transparent;
  border: 2px solid ${primaryMain};
  color: ${primaryMain};
}

.btn-outline:hover:not(:disabled) {
  background-color: ${primary50};
}

.btn-outline:focus {
  box-shadow: 0 0 0 2px white, 0 0 0 4px ${primaryMain};
}

/* Ghost variant */
.btn-ghost {
  background-color: transparent;
  color: ${primaryMain};
}

.btn-ghost:hover:not(:disabled) {
  background-color: ${primary50};
}

.btn-ghost:focus {
  box-shadow: 0 0 0 2px white, 0 0 0 4px ${primaryMain};
}

/* Disabled state */
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}`.trim();

  // Preview HTML
  const preview = `<div style="display: flex; gap: 1rem; flex-wrap: wrap; padding: 2rem; background: #f5f5f5; border-radius: 0.5rem;">
  <button style="
    background-color: ${primaryMain};
    color: ${grayWhite};
    font-family: '${fontBody}', sans-serif;
    font-weight: ${fontSemibold};
    font-size: ${textBase};
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  " onmouseover="this.style.backgroundColor='${primary600}'" onmouseout="this.style.backgroundColor='${primaryMain}'">
    Primary
  </button>
  
  <button style="
    background-color: ${secondaryMain};
    color: ${grayWhite};
    font-family: '${fontBody}', sans-serif;
    font-weight: ${fontSemibold};
    font-size: ${textBase};
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  ">
    Secondary
  </button>
  
  <button style="
    background-color: transparent;
    border: 2px solid ${primaryMain};
    color: ${primaryMain};
    font-family: '${fontBody}', sans-serif;
    font-weight: ${fontSemibold};
    font-size: ${textBase};
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
  ">
    Outline
  </button>
  
  <button style="
    background-color: transparent;
    border: none;
    color: ${primaryMain};
    font-family: '${fontBody}', sans-serif;
    font-weight: ${fontSemibold};
    font-size: ${textBase};
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
  ">
    Ghost
  </button>
</div>`.trim();

  return {
    name: 'Button',
    description: 'Versatile button component with multiple variants (primary, secondary, outline, ghost) and sizes (sm, md, lg). Built with your design system tokens.',
    code: {
      react,
      vue,
      html,
      css,
    },
    preview,
  };
}

/**
 * Generate Input component with design tokens
 * 
 * Creates a fully-featured input component with label, error states, and validation
 * using the design system's color palette and typography.
 * 
 * @param palette - Color palette with design tokens
 * @param typography - Typography system with fonts and scales
 * @returns Generated input component code in multiple formats
 */
export function generateInputComponent(
  palette: ColorPaletteResponse,
  typography: TypographySystem
): GeneratedComponent {
  // Extract colors for easy reference
  const primaryMain = palette.primary.main;
  const primary200 = palette.primary.shades[200];
  const errorMain = palette.semantic.error.main;
  const error200 = palette.semantic.error.shades[200];
  const gray300 = palette.neutrals[300];
  const gray100 = palette.neutrals[100];
  const gray700 = palette.neutrals[700];
  
  // Extract typography
  const fontBody = typography.fonts.body;
  const textSm = typography.scale.sm;
  const textBase = typography.scale.base;
  const fontMedium = typography.weights.medium;

  // React Component
  const react = `import React, { useState } from 'react';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url';
  placeholder?: string;
  label?: string;
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

/**
 * Input Component
 * 
 * Form input with label, validation, and error states.
 * Uses design system tokens for consistent styling.
 */
export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  label,
  error,
  value,
  onChange,
  disabled = false,
  required = false,
  className = ''
}) => {
  const [focused, setFocused] = useState(false);
  
  const baseClasses = 'w-full px-4 py-2 rounded-lg border-2 transition-all duration-200 focus:outline-none';
  const normalClasses = \`border-[${gray300}] focus:border-[${primaryMain}] focus:ring-2 focus:ring-[${primary200}]\`;
  const errorClasses = \`border-[${errorMain}] focus:border-[${errorMain}] focus:ring-2 focus:ring-[${error200}]\`;
  
  return (
    <div className={\`w-full \${className}\`}>
      {label && (
        <label className="block text-sm font-medium mb-2" style={{ color: '${gray700}' }}>
          {label}
          {required && <span className="ml-1" style={{ color: '${errorMain}' }}>*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={[
          baseClasses,
          error ? errorClasses : normalClasses,
          'disabled:bg-[${gray100}] disabled:cursor-not-allowed'
        ].join(' ')}
        style={{ fontFamily: '${fontBody}' }}
      />
      {error && (
        <p className="mt-1 text-sm" style={{ color: '${errorMain}' }}>
          {error}
        </p>
      )}
    </div>
  );
};

// Usage examples:
// <Input label="Email" type="email" placeholder="you@example.com" />
// <Input label="Password" type="password" required />
// <Input label="Name" error="This field is required" />`.trim();

  // Vue Component
  const vue = `<template>
  <div class="w-full">
    <label v-if="label" class="block text-sm font-medium mb-2 text-gray-700">
      {{ label }}
      <span v-if="required" class="ml-1 text-error">*</span>
    </label>
    <input
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @focus="handleFocus"
      @blur="handleBlur"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :class="inputClasses"
      :style="inputStyle"
      class="w-full px-4 py-2 rounded-lg border-2 transition-all duration-200 focus:outline-none"
    />
    <p v-if="error" class="mt-1 text-sm text-error">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

interface Props {
  type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url';
  placeholder?: string;
  label?: string;
  error?: string;
  modelValue?: string;
  disabled?: boolean;
  required?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false
});

const emit = defineEmits(['update:modelValue']);

const focused = ref(false);

const handleFocus = () => {
  focused.value = true;
};

const handleBlur = () => {
  focused.value = false;
};

const inputClasses = computed(() => {
  if (props.error) {
    return 'border-[${errorMain}] focus:border-[${errorMain}] focus:ring-2 focus:ring-[${error200}]';
  }
  return 'border-[${gray300}] focus:border-[${primaryMain}] focus:ring-2 focus:ring-[${primary200}]';
});

const inputStyle = computed(() => ({
  fontFamily: '${fontBody}'
}));
</script>

<!-- Usage examples: -->
<!-- <Input v-model="email" label="Email" type="email" placeholder="you@example.com" /> -->
<!-- <Input v-model="password" label="Password" type="password" :required="true" /> -->
<!-- <Input v-model="name" label="Name" :error="nameError" /> -->`.trim();

  // HTML
  const html = `<!-- Input Component HTML -->
<!-- Copy and paste these input examples -->

<!-- Text Input with Label -->
<div class="input-wrapper">
  <label class="input-label">
    Email Address
    <span class="required">*</span>
  </label>
  <input 
    type="email" 
    class="input input-normal"
    placeholder="Enter your email"
    required
  />
</div>

<!-- Input with Error State -->
<div class="input-wrapper">
  <label class="input-label">
    Full Name
    <span class="required">*</span>
  </label>
  <input 
    type="text" 
    class="input input-error-state"
    placeholder="Enter your name"
  />
  <p class="input-error">This field is required</p>
</div>

<!-- Disabled Input -->
<div class="input-wrapper">
  <label class="input-label">Username</label>
  <input 
    type="text" 
    class="input input-normal"
    value="johndoe"
    disabled
  />
</div>

<!-- Password Input -->
<div class="input-wrapper">
  <label class="input-label">
    Password
    <span class="required">*</span>
  </label>
  <input 
    type="password" 
    class="input input-normal"
    placeholder="Enter password"
  />
</div>`.trim();

  // CSS
  const css = `/* Input Component CSS */
/* Generated from design system tokens */

.input-wrapper {
  width: 100%;
}

.input-label {
  display: block;
  font-size: ${textSm};
  font-weight: ${fontMedium};
  margin-bottom: 0.5rem;
  color: ${gray700};
  font-family: '${fontBody}', sans-serif;
}

.required {
  color: ${errorMain};
  margin-left: 0.25rem;
}

.input {
  width: 100%;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 2px solid;
  transition: all 0.2s ease-in-out;
  font-family: '${fontBody}', sans-serif;
  font-size: ${textBase};
  outline: none;
}

.input:focus {
  outline: none;
}

/* Normal state */
.input-normal {
  border-color: ${gray300};
}

.input-normal:focus {
  border-color: ${primaryMain};
  box-shadow: 0 0 0 3px ${primary200};
}

/* Error state */
.input-error-state {
  border-color: ${errorMain};
}

.input-error-state:focus {
  border-color: ${errorMain};
  box-shadow: 0 0 0 3px ${error200};
}

/* Disabled state */
.input:disabled {
  background-color: ${gray100};
  cursor: not-allowed;
  opacity: 0.6;
}

/* Error message */
.input-error {
  margin-top: 0.25rem;
  font-size: ${textSm};
  color: ${errorMain};
  font-family: '${fontBody}', sans-serif;
}`.trim();

  // Preview HTML
  const preview = `<div style="padding: 2rem; background: #f5f5f5; border-radius: 0.5rem; font-family: '${fontBody}', sans-serif;">
  <div style="margin-bottom: 1.5rem;">
    <label style="display: block; font-size: ${textSm}; font-weight: ${fontMedium}; margin-bottom: 0.5rem; color: ${gray700};">
      Email Address <span style="color: ${errorMain};">*</span>
    </label>
    <input 
      type="email" 
      placeholder="Enter your email"
      style="width: 100%; padding: 0.5rem 1rem; border-radius: 0.5rem; border: 2px solid ${primaryMain}; font-family: '${fontBody}', sans-serif; font-size: ${textBase}; outline: none; box-shadow: 0 0 0 3px ${primary200};"
    />
  </div>
  
  <div>
    <label style="display: block; font-size: ${textSm}; font-weight: ${fontMedium}; margin-bottom: 0.5rem; color: ${gray700};">
      Full Name <span style="color: ${errorMain};">*</span>
    </label>
    <input 
      type="text" 
      placeholder="Enter your name"
      style="width: 100%; padding: 0.5rem 1rem; border-radius: 0.5rem; border: 2px solid ${errorMain}; font-family: '${fontBody}', sans-serif; font-size: ${textBase}; outline: none;"
    />
    <p style="margin-top: 0.25rem; font-size: ${textSm}; color: ${errorMain};">
      This field is required
    </p>
  </div>
</div>`.trim();

  return {
    name: 'Input',
    description: 'Form input component with label, validation states, error messages, and accessibility features. Supports text, email, password, search, tel, and url input types.',
    code: {
      react,
      vue,
      html,
      css,
    },
    preview,
  };
}

/**
 * Generate all components with design tokens
 * 
 * Creates a complete component library using the design system.
 * Currently includes Button and Input, with more components to be added.
 * 
 * @param palette - Color palette with design tokens
 * @param typography - Typography system with fonts and scales
 * @returns Array of generated components
 */
export function generateAllComponents(
  palette: ColorPaletteResponse,
  typography: TypographySystem
): GeneratedComponent[] {
  return [
    generateButtonComponent(palette, typography),
    generateInputComponent(palette, typography),
    // More components will be added here:
    // generateCardComponent(palette, typography),
    // generateBadgeComponent(palette, typography),
    // etc.
  ];
}

/**
 * Get a specific component by name
 * 
 * @param name - Component name (e.g., 'Button')
 * @param palette - Color palette
 * @param typography - Typography system
 * @returns Generated component or undefined if not found
 */
export function getComponentByName(
  name: string,
  palette: ColorPaletteResponse,
  typography: TypographySystem
): GeneratedComponent | undefined {
  const components = generateAllComponents(palette, typography);
  return components.find(c => c.name.toLowerCase() === name.toLowerCase());
}
