/**
 * Card Component Templates
 * Generates card code for React, Vue, Svelte, and HTML/CSS
 */

import type { ColorPaletteResponse, TypographySystem } from '@/lib/types/designSystem';

interface CardStyles {
  backgroundColor: string;
  color?: string;
  padding: string;
  borderRadius: string;
  border?: string;
  boxShadow?: string;
  titleColor?: string;
  titleSize?: string;
  titleWeight?: string;
}

export function generateReactCard(
  variant: string,
  styles: CardStyles,
  palette: ColorPaletteResponse,
  typography: TypographySystem
): string {
  return `import React from 'react';

interface ${capitalize(variant)}CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const ${capitalize(variant)}Card: React.FC<${capitalize(variant)}CardProps> = ({ 
  title,
  children,
  className = ''
}) => {
  return (
    <div
      className={\`${variant}-card \${className}\`}
      style={{
        backgroundColor: '${styles.backgroundColor}',
        ${styles.color ? `color: '${styles.color}',` : ''}
        padding: '${styles.padding}',
        borderRadius: '${styles.borderRadius}',
        border: '${styles.border || 'none'}',
        ${styles.boxShadow ? `boxShadow: '${styles.boxShadow}',` : ''}
        transition: 'all 0.2s ease',
      }}
    >
      {title && (
        <h3
          style={{
            fontSize: '${styles.titleSize || typography.scale.lg}',
            fontWeight: '${styles.titleWeight || typography.weights.semibold}',
            color: '${styles.titleColor || palette.neutrals[900]}',
            marginBottom: '1rem',
            fontFamily: '${typography.fonts?.heading || 'Inter, sans-serif'}',
          }}
        >
          {title}
        </h3>
      )}
      <div className="card-content">{children}</div>
    </div>
  );
};`;
}

export function generateVueCard(
  variant: string,
  styles: CardStyles,
  palette: ColorPaletteResponse,
  typography: TypographySystem
): string {
  return `<script setup lang="ts">
interface Props {
  title?: string;
}

defineProps<Props>();
</script>

<template>
  <div class="${variant}-card">
    <h3 v-if="title" class="card-title">{{ title }}</h3>
    <div class="card-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.${variant}-card {
  background-color: ${styles.backgroundColor};
  ${styles.color ? `color: ${styles.color};` : ''}
  padding: ${styles.padding};
  border-radius: ${styles.borderRadius};
  border: ${styles.border || 'none'};
  ${styles.boxShadow ? `box-shadow: ${styles.boxShadow};` : ''}
  transition: all 0.2s ease;
}

.card-title {
  font-size: ${styles.titleSize || typography.scale.lg};
  font-weight: ${styles.titleWeight || typography.weights.semibold};
  color: ${styles.titleColor || palette.neutrals[900]};
  margin-bottom: 1rem;
  font-family: ${typography.fonts?.heading || 'Inter, sans-serif'};
}

.${variant}-card:hover {
  transform: translateY(-2px);
  ${styles.boxShadow ? `box-shadow: ${styles.boxShadow.replace('0.1', '0.15')};` : ''}
}
</style>`;
}

export function generateSvelteCard(
  variant: string,
  styles: CardStyles,
  palette: ColorPaletteResponse,
  typography: TypographySystem
): string {
  return `<script lang="ts">
  export let title: string | undefined = undefined;
</script>

<div class="${variant}-card">
  {#if title}
    <h3 class="card-title">{title}</h3>
  {/if}
  <div class="card-content">
    <slot />
  </div>
</div>

<style>
  .${variant}-card {
    background-color: ${styles.backgroundColor};
    ${styles.color ? `color: ${styles.color};` : ''}
    padding: ${styles.padding};
    border-radius: ${styles.borderRadius};
    border: ${styles.border || 'none'};
    ${styles.boxShadow ? `box-shadow: ${styles.boxShadow};` : ''}
    transition: all 0.2s ease;
  }

  .card-title {
    font-size: ${styles.titleSize || typography.scale.lg};
    font-weight: ${styles.titleWeight || typography.weights.semibold};
    color: ${styles.titleColor || palette.neutrals[900]};
    margin-bottom: 1rem;
    font-family: ${typography.fonts?.heading || 'Inter, sans-serif'};
  }

  .${variant}-card:hover {
    transform: translateY(-2px);
    ${styles.boxShadow ? `box-shadow: ${styles.boxShadow.replace('0.1', '0.15')};` : ''}
  }
</style>`;
}

export function generateHTMLCard(
  variant: string,
  styles: CardStyles,
  palette: ColorPaletteResponse,
  typography: TypographySystem
): string {
  return `<div class="${variant}-card">
  <h3 class="card-title">${capitalize(variant)} Card</h3>
  <div class="card-content">
    <p>Card content goes here...</p>
  </div>
</div>`;
}

export function generateCSSCard(
  variant: string,
  styles: CardStyles,
  palette: ColorPaletteResponse,
  typography: TypographySystem
): string {
  return `.${variant}-card {
  background-color: ${styles.backgroundColor};  ${styles.color ? `color: ${styles.color};` : ''}  padding: ${styles.padding};
  border-radius: ${styles.borderRadius};
  border: ${styles.border || 'none'};
  ${styles.boxShadow ? `box-shadow: ${styles.boxShadow};` : ''}
  transition: all 0.2s ease;
}

.card-title {
  font-size: ${styles.titleSize || typography.scale.lg};
  font-weight: ${styles.titleWeight || typography.weights.semibold};
  color: ${styles.titleColor || palette.neutrals[900]};
  margin-bottom: 1rem;
  font-family: ${typography.fonts?.heading || 'Inter, sans-serif'};
}

.${variant}-card:hover {
  transform: translateY(-2px);
  ${styles.boxShadow ? `box-shadow: ${styles.boxShadow.replace('0.1', '0.15')};` : ''}
}`;
}

// Helper function
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
