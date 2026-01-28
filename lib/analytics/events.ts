/**
 * Analytics Event Type Definitions
 * Defines all trackable events in DesignForge AI
 */

export type AnalyticsEvent =
  | "user_signed_up"
  | "user_signed_in"
  | "design_system_generated"
  | "colors_generated"
  | "typography_generated"
  | "components_generated"
  | "export_initiated"
  | "export_completed"
  | "plan_upgraded"
  | "plan_downgraded"
  | "credit_balance_low"
  | "credit_balance_depleted";

/**
 * Base event payload structure
 */
export interface BaseEventPayload {
  userId: string;
  plan?: "free" | "pro" | "team";
  timestamp: string;
}

/**
 * Event-specific payload types
 */
export interface UserSignedUpPayload extends BaseEventPayload {
  method: "email" | "google" | "github";
}

export interface UserSignedInPayload extends BaseEventPayload {
  method: "email" | "google" | "github";
}

export interface DesignSystemGeneratedPayload extends BaseEventPayload {
  industry?: string;
  audience?: string;
  hasColors: boolean;
  hasTypography: boolean;
  hasComponents: boolean;
}

export interface ColorsGeneratedPayload extends BaseEventPayload {
  industry?: string;
  audience?: string;
  primaryColor: string;
  creditsUsed: number;
}

export interface TypographyGeneratedPayload extends BaseEventPayload {
  headingFont: string;
  bodyFont: string;
  creditsUsed: number;
}

export interface ComponentsGeneratedPayload extends BaseEventPayload {
  componentCount: number;
  frameworks: string[];
  creditsUsed: number;
}

export interface ExportInitiatedPayload extends BaseEventPayload {
  exportFormats: string[];
  designSystemId?: string;
}

export interface ExportCompletedPayload extends BaseEventPayload {
  exportFormats: string[];
  designSystemId?: string;
  success: boolean;
}

export interface PlanUpgradedPayload extends BaseEventPayload {
  fromPlan: "free" | "pro" | "team";
  toPlan: "free" | "pro" | "team";
  amount?: number;
}

export interface PlanDowngradedPayload extends BaseEventPayload {
  fromPlan: "free" | "pro" | "team";
  toPlan: "free" | "pro" | "team";
}

export interface CreditBalanceLowPayload extends BaseEventPayload {
  balance: number;
  threshold: number;
}

export interface CreditBalanceDepletedPayload extends BaseEventPayload {
  lastAction: string;
}

/**
 * Union type for all event payloads
 */
export type AnalyticsEventPayload =
  | UserSignedUpPayload
  | UserSignedInPayload
  | DesignSystemGeneratedPayload
  | ColorsGeneratedPayload
  | TypographyGeneratedPayload
  | ComponentsGeneratedPayload
  | ExportInitiatedPayload
  | ExportCompletedPayload
  | PlanUpgradedPayload
  | PlanDowngradedPayload
  | CreditBalanceLowPayload
  | CreditBalanceDepletedPayload;
