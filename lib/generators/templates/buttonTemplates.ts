/**
 * Button Component Templates
 * Generates button code for React, Vue, Svelte, and HTML/CSS
 */

import type { ColorPaletteResponse, TypographySystem } from '@/lib/types/designSystem';

interface ButtonStyles {
  backgroundColor: string;
  color: string;
  hoverBg: string;
  activeBg: string;
  padding: string;
  borderRadius: string;
  fontSize: string;
  fontWeight: string;
  border?: string;
  boxShadow?: string;
}

export function generateReactButton(
  variant: string,
  styles: ButtonStyles,
  palette: ColorPaletteResponse,
  typography: TypographySystem
): string {
  return `import React from 'react';

interface ${capitalize(variant)}ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const ${capitalize(variant)}Button: React.FC<${capitalize(variant)}ButtonProps> = ({ 
  children, 
  disabled = false,
  className = '',
  ...props 
}) => {
  return (
    <button
      className={\`
        inline-flex items-center justify-center
        font-semibold transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        \${className}
      \`}
      style={{
        backgroundColor: '${styles.backgroundColor}',
        color: '${styles.color}',
        padding: '${styles.padding}',
        borderRadius: '${styles.borderRadius}',
        fontSize: '${styles.fontSize}',
        fontWeight: '${styles.fontWeight}',
        border: '${styles.border || 'none'}',
        ${styles.boxShadow ? `boxShadow: '${styles.boxShadow}',` : ''}
      }}
      onMouseOver={(e) => !disabled && (e.currentTarget.style.backgroundColor = '${styles.hoverBg}')}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '${styles.backgroundColor}')}
      onMouseDown={(e) => !disabled && (e.currentTarget.style.backgroundColor = '${styles.activeBg}')}
      onMouseUp={(e) => !disabled && (e.currentTarget.style.backgroundColor = '${styles.hoverBg}')}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};`;
}

export function generateVueButton(
  variant: string,
  styles: ButtonStyles,
  palette: ColorPaletteResponse,
  typography: TypographySystem
): string {
  return `<script setup lang="ts">
interface Props {
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
});
</script>

<template>
  <button
    class="${variant}-button"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style scoped>
.${variant}-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: ${styles.backgroundColor};
  color: ${styles.color};
  padding: ${styles.padding};
  border-radius: ${styles.borderRadius};
  font-size: ${styles.fontSize};
  font-weight: ${styles.fontWeight};
  font-family: ${typography.fonts.body};
  border: ${styles.border || 'none'};
  ${styles.boxShadow ? `box-shadow: ${styles.boxShadow};` : ''}
  cursor: pointer;
  transition: all 0.2s ease;
}

.${variant}-button:hover:not(:disabled) {
  background-color: ${styles.hoverBg};
}

.${variant}-button:active:not(:disabled) {
  background-color: ${styles.activeBg};
}

.${variant}-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.${variant}-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px ${styles.backgroundColor}33;
}
</style>`;
}

export function generateSvelteButton(
  variant: string,
  styles: ButtonStyles,
  palette: ColorPaletteResponse,
  typography: TypographySystem
): string {
  return `<script lang="ts">
  export let disabled: boolean = false;
</script>

<button 
  class="${variant}-button" 
  {disabled}
  on:click
>
  <slot />
</button>

<style>
  .${variant}-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: ${styles.backgroundColor};
    color: ${styles.color};
    padding: ${styles.padding};
    border-radius: ${styles.borderRadius};
    font-size: ${styles.fontSize};
    font-weight: ${styles.fontWeight};
    font-family: ${typography.fonts.body};
    border: ${styles.border || 'none'};
    ${styles.boxShadow ? `box-shadow: ${styles.boxShadow};` : ''}
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .${variant}-button:hover:not(:disabled) {
    background-color: ${styles.hoverBg};
  }

  .${variant}-button:active:not(:disabled) {
    background-color: ${styles.activeBg};
  }

  .${variant}-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .${variant}-button:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${styles.backgroundColor}33;
  }
</style>`;
}

export function generateHTMLButton(
  variant: string,
  styles: ButtonStyles,
  palette: ColorPaletteResponse,
  typography: TypographySystem
): string {
  return `<button class="${variant}-button">
  ${capitalize(variant)} Button
</button>`;
}

export function generateCSSButton(
  variant: string,
  styles: ButtonStyles,
  palette: ColorPaletteResponse,
  typography: TypographySystem
): string {
  return `.${variant}-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: ${styles.backgroundColor};
  color: ${styles.color};
  padding: ${styles.padding};
  border-radius: ${styles.borderRadius};
  font-size: ${styles.fontSize};
  font-weight: ${styles.fontWeight};
  font-family: ${typography.fonts.body};
  border: ${styles.border || 'none'};
  ${styles.boxShadow ? `box-shadow: ${styles.boxShadow};` : ''}
  cursor: pointer;
  transition: all 0.2s ease;
}

.${variant}-button:hover:not(:disabled) {
  background-color: ${styles.hoverBg};
}

.${variant}-button:active:not(:disabled) {
  background-color: ${styles.activeBg};
}

.${variant}-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.${variant}-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px ${styles.backgroundColor}33;
}`;
}

// Helper function
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
