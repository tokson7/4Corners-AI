import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cacheDesignSystem, getCachedDesignSystem } from "@/lib/cache/designSystemCache";
import type { ColorGenerationResponse } from "@/lib/types/designSystem";

export interface ColorPalette {
  primary: {
    hex: string;
    name: string;
    psychology: string;
    shades: { value: string; hex: string }[];
  };
  secondary: {
    hex: string;
    name: string;
    psychology: string;
    shades: { value: string; hex: string }[];
  };
  accent: {
    hex: string;
    name: string;
    psychology: string;
    shades: { value: string; hex: string }[];
  };
  semantic: {
    success: string;
    error: string;
    warning: string;
    info: string;
  };
  neutrals: { value: string; hex: string }[];
}

export interface TypographySystem {
  heading: {
    font: string;
    h1: { size: string; weight: string };
    h2: { size: string; weight: string };
    h3: { size: string; weight: string };
  };
  body: {
    font: string;
    large: { size: string; weight: string };
    regular: { size: string; weight: string };
    small: { size: string; weight: string };
    caption: { size: string; weight: string };
  };
}

export interface SpacingScale {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
}

export interface DesignSystemData {
  colors: ColorPalette;
  typography: TypographySystem;
  spacing: SpacingScale;
  components: any[];
}

export interface ExportOptions {
  cssVariables: boolean;
  tailwindConfig: boolean;
  reactComponents: boolean;
  vueComponents: boolean;
  figmaTokens: boolean;
}

interface DesignSystemState {
  // Generator step
  currentStep: number;
  setCurrentStep: (step: number) => void;

  // Brand description
  brandDescription: string;
  setBrandDescription: (description: string) => void;
  industry: string;
  setIndustry: (industry: string) => void;
  targetAudience: string;
  setTargetAudience: (audience: string) => void;

  // Generated design system data
  designSystem: DesignSystemData | null;
  setDesignSystem: (data: DesignSystemData) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Export options
  exportOptions: ExportOptions;
  setExportOption: (key: keyof ExportOptions, value: boolean) => void;
  toggleExportOption: (key: keyof ExportOptions) => void;

  // Actions
  reset: () => void;
  generateDesignSystem: () => Promise<void>;
  saveDesignSystem: (name?: string) => Promise<boolean>;
}

const defaultExportOptions: ExportOptions = {
  cssVariables: true,
  tailwindConfig: true,
  reactComponents: true,
  vueComponents: false,
  figmaTokens: false,
};

// Placeholder data structure (before AI integration)
const placeholderResult: DesignSystemData = {
  colors: {
    primary: {
      hex: "#6366F1",
      name: "Indigo",
      psychology: "Trust, Innovation, Technology",
      shades: [
        { value: "50", hex: "#EEF2FF" },
        { value: "100", hex: "#E0E7FF" },
        { value: "200", hex: "#C7D2FE" },
        { value: "300", hex: "#A5B4FC" },
        { value: "400", hex: "#818CF8" },
        { value: "500", hex: "#6366F1" },
        { value: "600", hex: "#4F46E5" },
        { value: "700", hex: "#4338CA" },
        { value: "800", hex: "#3730A3" },
        { value: "900", hex: "#312E81" },
      ],
    },
    secondary: {
      hex: "#8B5CF6",
      name: "Purple",
      psychology: "Creativity, Luxury, Ambition",
      shades: [
        { value: "50", hex: "#F5F3FF" },
        { value: "100", hex: "#EDE9FE" },
        { value: "200", hex: "#DDD6FE" },
        { value: "300", hex: "#C4B5FD" },
        { value: "400", hex: "#A78BFA" },
        { value: "500", hex: "#8B5CF6" },
        { value: "600", hex: "#7C3AED" },
        { value: "700", hex: "#6D28D9" },
        { value: "800", hex: "#5B21B6" },
        { value: "900", hex: "#4C1D95" },
      ],
    },
    accent: {
      hex: "#EC4899",
      name: "Pink",
      psychology: "Energy, Playfulness, Modernity",
      shades: [
        { value: "50", hex: "#FDF2F8" },
        { value: "100", hex: "#FCE7F3" },
        { value: "200", hex: "#FBCFE8" },
        { value: "300", hex: "#F9A8D4" },
        { value: "400", hex: "#F472B6" },
        { value: "500", hex: "#EC4899" },
        { value: "600", hex: "#DB2777" },
        { value: "700", hex: "#BE185D" },
        { value: "800", hex: "#9F1239" },
        { value: "900", hex: "#831843" },
      ],
    },
    semantic: {
      success: "#10B981",
      error: "#EF4444",
      warning: "#F59E0B",
      info: "#3B82F6",
    },
    neutrals: [
      { value: "50", hex: "#F9FAFB" },
      { value: "100", hex: "#F3F4F6" },
      { value: "200", hex: "#E5E7EB" },
      { value: "300", hex: "#D1D5DB" },
      { value: "400", hex: "#9CA3AF" },
      { value: "500", hex: "#6B7280" },
      { value: "600", hex: "#4B5563" },
      { value: "700", hex: "#374151" },
      { value: "800", hex: "#1F2937" },
      { value: "900", hex: "#111827" },
    ],
  },
  typography: {
    heading: {
      font: "Space Grotesk",
      h1: { size: "48px", weight: "Bold" },
      h2: { size: "36px", weight: "Bold" },
      h3: { size: "24px", weight: "Semibold" },
    },
    body: {
      font: "Inter",
      large: { size: "18px", weight: "Regular" },
      regular: { size: "16px", weight: "Regular" },
      small: { size: "14px", weight: "Regular" },
      caption: { size: "12px", weight: "Regular" },
    },
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
  },
  components: [
    {
      name: "Button",
      code: `<button className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:opacity-90 transition-opacity">
  Button
</button>`,
    },
    {
      name: "Input",
      code: `<input
  type="text"
  placeholder="Enter text"
  className="w-full px-4 py-2 rounded-lg bg-white/10 border-2 border-white/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 shadow-lg shadow-black/50"
/>`,
    },
    {
      name: "Card",
      code: `<div className="glass rounded-xl p-6">
  <h3 className="font-heading text-lg font-semibold mb-2">Card Title</h3>
  <p className="text-sm text-muted-foreground">Card content</p>
</div>`,
    },
    {
      name: "Modal",
      code: `<div className="glass-strong rounded-xl p-6 border border-white/20">
  <h3 className="font-heading text-lg font-semibold mb-4">Modal Title</h3>
  <p className="text-sm text-muted-foreground">Modal content</p>
</div>`,
    },
    {
      name: "Alert",
      code: `<div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
  <p className="text-sm text-green-400 font-medium">Alert message</p>
</div>`,
    },
    {
      name: "Badge",
      code: `<span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium">
  Badge
</span>`,
    },
  ],
};

const defaultDesignSystem = placeholderResult;

export const useDesignSystemStore = create<DesignSystemState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentStep: 1,
      brandDescription: "",
      industry: "",
      targetAudience: "",
      designSystem: null,
      isLoading: false,
      exportOptions: defaultExportOptions,

      // Step management
      setCurrentStep: (step: number) => set({ currentStep: step }),

      // Brand description
      setBrandDescription: (description: string) =>
        set({ brandDescription: description }),
      setIndustry: (industry: string) => set({ industry }),
      setTargetAudience: (audience: string) => set({ targetAudience: audience }),

      // Design system
      setDesignSystem: (data: DesignSystemData) => set({ designSystem: data }),
      setIsLoading: (loading: boolean) => set({ isLoading: loading }),

      // Export options
      setExportOption: (key: keyof ExportOptions, value: boolean) =>
        set((state) => ({
          exportOptions: { ...state.exportOptions, [key]: value },
        })),
      toggleExportOption: (key: keyof ExportOptions) =>
        set((state) => ({
          exportOptions: {
            ...state.exportOptions,
            [key]: !state.exportOptions[key],
          },
        })),

      // Generate design system with caching
      generateDesignSystem: async () => {
        set({ isLoading: true, currentStep: 2 });
        
        const state = get();
        const { brandDescription, industry, targetAudience } = state;
        
        // Check cache first
        const cached = await getCachedDesignSystem(brandDescription, industry, targetAudience);
        if (cached) {
          set({
            designSystem: cached,
            isLoading: false,
            currentStep: 3,
          });
          return;
        }
        
        try {
          // Call color generation API
          const response = await fetch('/api/generate/colors', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              brandDescription,
              industry: industry || undefined,
              audience: targetAudience || undefined,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            
            // Handle credit insufficient error
            if (response.status === 402) {
              throw new Error(errorData.error || "Insufficient credits. Upgrade your plan to continue generating.");
            }
            
            // Handle usage limit error
            if (response.status === 429) {
              throw new Error(errorData.error || "Usage limit reached. Upgrade your plan to continue generating.");
            }
            
            throw new Error(`API error: ${response.status}`);
          }

          const data = await response.json() as ColorGenerationResponse;
          
          // Transform API response to match store structure
          if (data.success && data.palette) {
            const generatedSystem: DesignSystemData = {
              colors: {
                primary: {
                  hex: data.palette.primary.main,
                  name: data.palette.primary.name,
                  psychology: data.palette.primary.reasoning || data.palette.primary.emotions?.join(', ') || '',
                  shades: Object.entries(data.palette.primary.shades).map(([value, hex]) => ({
                    value,
                    hex: hex as string,
                  })),
                },
                secondary: {
                  hex: data.palette.secondary.main,
                  name: data.palette.secondary.name,
                  psychology: '',
                  shades: Object.entries(data.palette.secondary.shades).map(([value, hex]) => ({
                    value,
                    hex: hex as string,
                  })),
                },
                accent: {
                  hex: data.palette.accent.main,
                  name: data.palette.accent.name,
                  psychology: '',
                  shades: Object.entries(data.palette.accent.shades).map(([value, hex]) => ({
                    value,
                    hex: hex as string,
                  })),
                },
                semantic: {
                  success: data.palette.semantic.success.main,
                  error: data.palette.semantic.error.main,
                  warning: data.palette.semantic.warning.main,
                  info: data.palette.semantic.info.main,
                },
                neutrals: Object.entries(data.palette.neutrals).map(([value, hex]) => ({
                  value,
                  hex: hex as string,
                })),
              },
              typography: placeholderResult.typography,
              spacing: placeholderResult.spacing,
              components: placeholderResult.components,
            };

            // Add accessibility data if present
            if (data.palette.accessibility) {
              (generatedSystem as any).accessibility = data.palette.accessibility;
            }
            
            // Generate production-ready UI components
            console.log('🧩 Generating production-ready UI components...');
            try {
              const componentsResponse = await fetch('/api/generate-components', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  palette: data.palette,
                  typography: placeholderResult.typography, // TODO: Replace with real typography when available
                }),
              });

              if (componentsResponse.ok) {
                const componentsData = await componentsResponse.json();
                if (componentsData.success && componentsData.components) {
                  console.log('✅ UI components generated successfully!');
                  (generatedSystem as any).generatedComponents = componentsData.components;
                }
              } else {
                console.warn('⚠️ Component generation failed, using placeholders');
              }
            } catch (componentError) {
              console.warn('⚠️ Component generation error:', componentError);
              // Continue without components - not a critical failure
            }
            
            // Cache the result (1 hour TTL)
            await cacheDesignSystem(brandDescription, generatedSystem, 3600, industry, targetAudience);
            
            set({
              designSystem: generatedSystem,
              isLoading: false,
              currentStep: 3,
            });

            // Track full design system generation (non-blocking)
            if (typeof window !== "undefined") {
              import("@/lib/analytics/trackEvent").then(({ trackEvent }) => {
                // Get user ID from session if available
                fetch("/api/user/me")
                  .then((res) => res.json())
                  .then((userData) => {
                    if (userData?.id) {
                      trackEvent("design_system_generated", {
                        userId: userData.id,
                        plan: "free", // TODO: Get from subscription
                        timestamp: new Date().toISOString(),
                        industry: industry || undefined,
                        audience: targetAudience || undefined,
                        hasColors: true,
                        hasTypography: true,
                        hasComponents: true,
                      }).catch(() => {});
                    }
                  })
                  .catch(() => {});
              }).catch(() => {});
            }

            // Auto-save the design system
            try {
              await get().saveDesignSystem();
            } catch (error) {
              console.warn("Failed to auto-save design system:", error);
              // Don't block the UI if save fails
            }
          } else {
            throw new Error('Invalid API response format');
          }
        } catch (error) {
          console.error('Failed to generate design system:', error);
          // Fallback to placeholder on error
          set({
            designSystem: placeholderResult,
            isLoading: false,
            currentStep: 3,
          });
        }
      },

      // Save design system
      saveDesignSystem: async (name?: string) => {
        const state = get();
        const { designSystem, brandDescription } = state;

        if (!designSystem) {
          throw new Error("No design system to save");
        }

        try {
          const response = await fetch("/api/design-systems", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: name || `Design System ${new Date().toLocaleDateString()}`,
              brandDescription,
              colors: designSystem.colors,
              typography: designSystem.typography,
              components: designSystem.components,
              spacing: designSystem.spacing,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to save design system");
          }

          return true;
        } catch (error) {
          console.error("Failed to save design system:", error);
          throw error;
        }
      },

      // Reset
      reset: () =>
        set({
          currentStep: 1,
          brandDescription: "",
          industry: "",
          targetAudience: "",
          designSystem: null,
          isLoading: false,
          exportOptions: defaultExportOptions,
        }),
    }),
    {
      name: "designforge-storage",
      partialize: (state) => ({
        brandDescription: state.brandDescription,
        industry: state.industry,
        targetAudience: state.targetAudience,
        designSystem: state.designSystem,
        exportOptions: state.exportOptions,
      }),
    }
  )
);
