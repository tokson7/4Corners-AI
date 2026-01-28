/**
 * Component Generation Types
 * 
 * Type definitions for the component generation system
 */

import { ColorPalette, TypographySystem } from '@/store/useDesignSystemStore';

export type Framework = 'react' | 'vue' | 'svelte' | 'html';

export type ComponentCategoryId = 
  | 'buttons' 
  | 'cards' 
  | 'forms' 
  | 'alerts' 
  | 'navigation'
  | 'modals';

export interface ComponentCode {
  react: string;
  vue: string;
  svelte: string;
  html: string;
}

export interface ComponentVariant {
  id: string;
  name: string;
  description?: string;
  code: ComponentCode;
  props?: Record<string, any>;
  preview?: {
    html: string;
    css: string;
  };
}

export interface ComponentCategory {
  id: ComponentCategoryId;
  name: string;
  description: string;
  icon?: string;
  variants: ComponentVariant[];
}

export interface GeneratedComponents {
  categories: ComponentCategory[];
  metadata: {
    generatedAt: string;
    frameworks: Framework[];
    appliedTokens: {
      colors: ColorPalette;
      typography: TypographySystem;
    };
  };
}

export interface ComponentGeneratorOptions {
  palette: ColorPalette;
  typography: TypographySystem;
  frameworks?: Framework[];
  categories?: ComponentCategoryId[];
}

export interface ComponentPreviewProps {
  variant: ComponentVariant;
  framework: Framework;
  onCopy?: () => void;
}
