/**
 * Form Input Component Templates
 * Generates input code for React, Vue, Svelte, and HTML/CSS
 */

import type { ColorPaletteResponse, TypographySystem } from '@/lib/types/designSystem';

interface InputStyles {
  backgroundColor: string;
  color: string;
  padding: string;
  borderRadius: string;
  border: string;
  focusBorder: string;
  fontSize: string;
  fontWeight: string;
}

export function generateReactInput(
  variant: string,
  styles: InputStyles,
  palette: ColorPaletteResponse,
  typography: TypographySystem
): string {
  return `import React, { useState } from 'react';

interface ${capitalize(variant)}InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  label?: string;
  error?: string;
  className?: string;
}

export const ${capitalize(variant)}Input: React.FC<${capitalize(variant)}InputProps> = ({ 
  type = 'text',
  label,
  error,
  className = '',
  disabled = false,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={\`input-wrapper \${className}\`}>
      {label && (
        <label 
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '${typography.scale.sm}',
            fontWeight: '${typography.weights.medium}',
            color: '${palette.neutrals[700]}',
          }}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        className="${variant}-input"
        style={{
          width: '100%',
          backgroundColor: '${styles.backgroundColor}',
          color: '${styles.color}',
          padding: '${styles.padding}',
          borderRadius: '${styles.borderRadius}',
          border: isFocused ? '${styles.focusBorder}' : '${styles.border}',
          fontSize: '${styles.fontSize}',
          fontWeight: '${styles.fontWeight}',
          fontFamily: '${typography.fonts?.body || 'Inter, sans-serif'}',
          outline: 'none',
          transition: 'all 0.2s ease',
          boxShadow: isFocused ? \`0 0 0 3px \${String('${palette.primary.main}').substring(0, 7)}22\` : 'none',
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        {...props}
      />
      {error && (
        <span
          style={{
            display: 'block',
            marginTop: '0.25rem',
            fontSize: '${typography.scale.sm}',
            color: '${palette.semantic.error.main}',
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
};`;
}

export function generateVueInput(
  variant: string,
  styles: InputStyles,
  palette: ColorPaletteResponse,
  typography: TypographySystem
): string {
  return `<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  modelValue?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  label?: string;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const isFocused = ref(false);
</script>

<template>
  <div class="input-wrapper">
    <label v-if="label" class="input-label">{{ label }}</label>
    <input
      :type="type"
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @focus="isFocused = true"
      @blur="isFocused = false"
      :disabled="disabled"
      :placeholder="placeholder"
      :class="['${variant}-input', { focused: isFocused, error: error }]"
    />
    <span v-if="error" class="input-error">{{ error }}</span>
  </div>
</template>

<style scoped>
.input-wrapper {
  width: 100%;
}

.input-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: ${typography.scale.sm};
  font-weight: ${typography.weights.medium};
  color: ${palette.neutrals[700]};
}

.${variant}-input {
  width: 100%;
  background-color: ${styles.backgroundColor};
  color: ${styles.color};
  padding: ${styles.padding};
  border-radius: ${styles.borderRadius};
  border: ${styles.border};
  font-size: ${styles.fontSize};
  font-weight: ${styles.fontWeight};
  font-family: ${typography.fonts?.body || 'Inter, sans-serif'};
  outline: none;
  transition: all 0.2s ease;
}

.${variant}-input.focused {
  border: ${styles.focusBorder};
  box-shadow: 0 0 0 3px ${palette.primary.main}22;
}

.${variant}-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.${variant}-input.error {
  border-color: ${palette.semantic.error.main};
}

.input-error {
  display: block;
  margin-top: 0.25rem;
  font-size: ${typography.scale.sm};
  color: ${palette.semantic.error.main};
}
</style>`;
}

export function generateSvelteInput(
  variant: string,
  styles: InputStyles,
  palette: ColorPaletteResponse,
  typography: TypographySystem
): string {
  return `<script lang="ts">
  export let value: string = '';
  export let type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' = 'text';
  export let label: string | undefined = undefined;
  export let error: string | undefined = undefined;
  export let disabled: boolean = false;
  export let placeholder: string | undefined = undefined;

  let isFocused: boolean = false;
</script>

<div class="input-wrapper">
  {#if label}
    <label class="input-label">{label}</label>
  {/if}
  <input
    {type}
    bind:value
    on:focus={() => (isFocused = true)}
    on:blur={() => (isFocused = false)}
    {disabled}
    {placeholder}
    class="${variant}-input"
    class:focused={isFocused}
    class:error={!!error}
  />
  {#if error}
    <span class="input-error">{error}</span>
  {/if}
</div>

<style>
  .input-wrapper {
    width: 100%;
  }

  .input-label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: ${typography.scale.sm};
    font-weight: ${typography.weights.medium};
    color: ${palette.neutrals[700]};
  }

  .${variant}-input {
    width: 100%;
    background-color: ${styles.backgroundColor};
    color: ${styles.color};
    padding: ${styles.padding};
    border-radius: ${styles.borderRadius};
    border: ${styles.border};
    font-size: ${styles.fontSize};
    font-weight: ${styles.fontWeight};
    font-family: ${typography.fonts?.body || 'Inter, sans-serif'};
    outline: none;
    transition: all 0.2s ease;
  }

  .${variant}-input.focused {
    border: ${styles.focusBorder};
    box-shadow: 0 0 0 3px ${palette.primary.main}22;
  }

  .${variant}-input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .${variant}-input.error {
    border-color: ${palette.semantic.error.main};
  }

  .input-error {
    display: block;
    margin-top: 0.25rem;
    font-size: ${typography.scale.sm};
    color: ${palette.semantic.error.main};
  }
</style>`;
}

export function generateHTMLInput(
  variant: string,
  styles: InputStyles,
  palette: ColorPaletteResponse,
  typography: TypographySystem
): string {
  return `<div class="input-wrapper">
  <label class="input-label">${capitalize(variant)} Input</label>
  <input 
    type="text" 
    placeholder="Enter text..." 
    class="${variant}-input"
  />
</div>`;
}

export function generateCSSInput(
  variant: string,
  styles: InputStyles,
  palette: ColorPaletteResponse,
  typography: TypographySystem
): string {
  return `.input-wrapper {
  width: 100%;
}

.input-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: ${typography.scale.sm};
  font-weight: ${typography.weights.medium};
  color: ${palette.neutrals[700]};
}

.${variant}-input {
  width: 100%;
  background-color: ${styles.backgroundColor};
  color: ${styles.color};
  padding: ${styles.padding};
  border-radius: ${styles.borderRadius};
  border: ${styles.border};
  font-size: ${styles.fontSize};
  font-weight: ${styles.fontWeight};
  font-family: ${typography.fonts?.body || 'Inter, sans-serif'};
  outline: none;
  transition: all 0.2s ease;
}

.${variant}-input:focus {
  border: ${styles.focusBorder};
  box-shadow: 0 0 0 3px ${palette.primary.main}22;
}

.${variant}-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.${variant}-input.error {
  border-color: ${palette.semantic.error.main};
}

.input-error {
  display: block;
  margin-top: 0.25rem;
  font-size: ${typography.scale.sm};
  color: ${palette.semantic.error.main};
}`;
}

// Helper function
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
