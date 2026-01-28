/**
 * Alert Component Templates
 * Generates alert code for React, Vue, Svelte, and HTML/CSS
 */

import type { ColorPaletteResponse, TypographySystem } from '@/lib/types/designSystem';

interface AlertStyles {
  backgroundColor: string;
  color: string;
  padding: string;
  borderRadius: string;
  border: string;
  fontSize: string;
  fontWeight: string;
  iconColor?: string;
}

export function generateReactAlert(
  variant: string,
  styles: AlertStyles,
  palette: ColorPaletteResponse,
  typography: TypographySystem
): string {
  const iconMap: Record<string, string> = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };
  
  const icon = iconMap[variant] || 'ℹ';

  return `import React from 'react';

interface ${capitalize(variant)}AlertProps {
  children: React.ReactNode;
  title?: string;
  onClose?: () => void;
  className?: string;
}

export const ${capitalize(variant)}Alert: React.FC<${capitalize(variant)}AlertProps> = ({ 
  children,
  title,
  onClose,
  className = ''
}) => {
  return (
    <div
      className={\`${variant}-alert \${className}\`}
      style={{
        display: 'flex',
        alignItems: 'start',
        gap: '0.75rem',
        backgroundColor: '${styles.backgroundColor}',
        color: '${styles.color}',
        padding: '${styles.padding}',
        borderRadius: '${styles.borderRadius}',
        border: '${styles.border}',
        fontSize: '${styles.fontSize}',
        fontWeight: '${styles.fontWeight}',
        fontFamily: '${typography.fonts.body}',
      }}
      role="alert"
    >
      <span
        style={{
          flexShrink: 0,
          fontSize: '1.25rem',
          fontWeight: 'bold',
        }}
      >
        ${icon}
      </span>
      <div style={{ flex: 1 }}>
        {title && (
          <div
            style={{
              fontWeight: '${typography.weights.semibold}',
              marginBottom: '0.25rem',
            }}
          >
            {title}
          </div>
        )}
        <div>{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            padding: '0',
            fontSize: '1.25rem',
            lineHeight: '1',
            opacity: 0.7,
          }}
          aria-label="Close alert"
        >
          ×
        </button>
      )}
    </div>
  );
};`;
}

export function generateVueAlert(
  variant: string,
  styles: AlertStyles,
  palette: ColorPaletteResponse,
  typography: TypographySystem
): string {
  const iconMap: Record<string, string> = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };
  
  const icon = iconMap[variant] || 'ℹ';

  return `<script setup lang="ts">
interface Props {
  title?: string;
  closeable?: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  close: [];
}>();
</script>

<template>
  <div class="${variant}-alert" role="alert">
    <span class="alert-icon">${icon}</span>
    <div class="alert-content">
      <div v-if="title" class="alert-title">{{ title }}</div>
      <div class="alert-body">
        <slot />
      </div>
    </div>
    <button 
      v-if="closeable" 
      @click="emit('close')" 
      class="alert-close"
      aria-label="Close alert"
    >
      ×
    </button>
  </div>
</template>

<style scoped>
.${variant}-alert {
  display: flex;
  align-items: start;
  gap: 0.75rem;
  background-color: ${styles.backgroundColor};
  color: ${styles.color};
  padding: ${styles.padding};
  border-radius: ${styles.borderRadius};
  border: ${styles.border};
  font-size: ${styles.fontSize};
  font-weight: ${styles.fontWeight};
  font-family: ${typography.fonts.body};
}

.alert-icon {
  flex-shrink: 0;
  font-size: 1.25rem;
  font-weight: bold;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-weight: ${typography.weights.semibold};
  margin-bottom: 0.25rem;
}

.alert-close {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0;
  font-size: 1.25rem;
  line-height: 1;
  opacity: 0.7;
}

.alert-close:hover {
  opacity: 1;
}
</style>`;
}

export function generateSvelteAlert(
  variant: string,
  styles: AlertStyles,
  palette: ColorPaletteResponse,
  typography: TypographySystem
): string {
  const iconMap: Record<string, string> = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };
  
  const icon = iconMap[variant] || 'ℹ';

  return `<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let title: string | undefined = undefined;
  export let closeable: boolean = false;

  const dispatch = createEventDispatcher();

  function handleClose() {
    dispatch('close');
  }
</script>

<div class="${variant}-alert" role="alert">
  <span class="alert-icon">${icon}</span>
  <div class="alert-content">
    {#if title}
      <div class="alert-title">{title}</div>
    {/if}
    <div class="alert-body">
      <slot />
    </div>
  </div>
  {#if closeable}
    <button 
      on:click={handleClose} 
      class="alert-close"
      aria-label="Close alert"
    >
      ×
    </button>
  {/if}
</div>

<style>
  .${variant}-alert {
    display: flex;
    align-items: start;
    gap: 0.75rem;
    background-color: ${styles.backgroundColor};
    color: ${styles.color};
    padding: ${styles.padding};
    border-radius: ${styles.borderRadius};
    border: ${styles.border};
    font-size: ${styles.fontSize};
    font-weight: ${styles.fontWeight};
    font-family: ${typography.fonts.body};
  }

  .alert-icon {
    flex-shrink: 0;
    font-size: 1.25rem;
    font-weight: bold;
  }

  .alert-content {
    flex: 1;
  }

  .alert-title {
    font-weight: ${typography.weights.semibold};
    margin-bottom: 0.25rem;
  }

  .alert-close {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    padding: 0;
    font-size: 1.25rem;
    line-height: 1;
    opacity: 0.7;
  }

  .alert-close:hover {
    opacity: 1;
  }
</style>`;
}

export function generateHTMLAlert(
  variant: string,
  styles: AlertStyles,
  palette: ColorPaletteResponse,
  typography: TypographySystem
): string {
  const iconMap: Record<string, string> = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };
  
  const icon = iconMap[variant] || 'ℹ';

  return `<div class="${variant}-alert" role="alert">
  <span class="alert-icon">${icon}</span>
  <div class="alert-content">
    <div class="alert-title">${capitalize(variant)} Alert</div>
    <div class="alert-body">
      This is a ${variant} alert message.
    </div>
  </div>
  <button class="alert-close" aria-label="Close alert">×</button>
</div>`;
}

export function generateCSSAlert(
  variant: string,
  styles: AlertStyles,
  palette: ColorPaletteResponse,
  typography: TypographySystem
): string {
  return `.${variant}-alert {
  display: flex;
  align-items: start;
  gap: 0.75rem;
  background-color: ${styles.backgroundColor};
  color: ${styles.color};
  padding: ${styles.padding};
  border-radius: ${styles.borderRadius};
  border: ${styles.border};
  font-size: ${styles.fontSize};
  font-weight: ${styles.fontWeight};
  font-family: ${typography.fonts.body};
}

.alert-icon {
  flex-shrink: 0;
  font-size: 1.25rem;
  font-weight: bold;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-weight: ${typography.weights.semibold};
  margin-bottom: 0.25rem;
}

.alert-close {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0;
  font-size: 1.25rem;
  line-height: 1;
  opacity: 0.7;
}

.alert-close:hover {
  opacity: 1;
}`;
}

// Helper function
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
