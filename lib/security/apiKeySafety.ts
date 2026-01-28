/**
 * API Key Safety Checks
 * Ensures API keys are never exposed client-side
 */

/**
 * Validate that OpenAI API key is configured and server-only
 */
export function validateOpenAIKey(): {
  valid: boolean;
  error?: string;
} {
  // Check if key exists
  if (!process.env.OPENAI_API_KEY) {
    return {
      valid: false,
      error: "OpenAI API key is not configured",
    };
  }

  // Check if key is in client-side accessible env var (should never be NEXT_PUBLIC_*)
  if (process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
    return {
      valid: false,
      error: "OpenAI API key must not be exposed via NEXT_PUBLIC_ prefix",
    };
  }

  // Basic format validation (OpenAI keys start with 'sk-')
  const key = process.env.OPENAI_API_KEY;
  if (!key.startsWith("sk-") && key.length < 20) {
    return {
      valid: false,
      error: "Invalid OpenAI API key format",
    };
  }

  return { valid: true };
}

/**
 * Get OpenAI API key safely (server-only)
 * Throws error if key is not available or improperly configured
 */
export function getOpenAIKey(): string {
  if (typeof window !== "undefined") {
    throw new Error("OpenAI API key cannot be accessed client-side");
  }

  const validation = validateOpenAIKey();
  if (!validation.valid) {
    throw new Error(validation.error || "OpenAI API key is not available");
  }

  return process.env.OPENAI_API_KEY!;
}

/**
 * Validate Stripe keys are configured correctly
 */
export function validateStripeKeys(): {
  valid: boolean;
  error?: string;
} {
  // Secret key must exist and not be public
  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      valid: false,
      error: "Stripe secret key is not configured",
    };
  }

  if (process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY) {
    return {
      valid: false,
      error: "Stripe secret key must not be exposed via NEXT_PUBLIC_ prefix",
    };
  }

  // Public key can be exposed (it's meant for client-side)
  // But we should still validate it exists
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    // This is a warning, not an error (only needed for client-side Stripe.js)
    console.warn("Stripe publishable key not configured (optional for server-side operations)");
  }

  return { valid: true };
}

/**
 * Validate NextAuth secret is configured
 */
export function validateNextAuthSecret(): {
  valid: boolean;
  error?: string;
} {
  if (!process.env.NEXTAUTH_SECRET) {
    return {
      valid: false,
      error: "NEXTAUTH_SECRET is not configured",
    };
  }

  if (process.env.NEXTAUTH_SECRET.length < 32) {
    return {
      valid: false,
      error: "NEXTAUTH_SECRET must be at least 32 characters",
    };
  }

  return { valid: true };
}

/**
 * Run all security validations on startup
 * Call this in a server-only context (e.g., API route initialization)
 */
export function validateAllSecrets(): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  const openAI = validateOpenAIKey();
  if (!openAI.valid) {
    errors.push(`OpenAI: ${openAI.error}`);
  }

  const stripe = validateStripeKeys();
  if (!stripe.valid) {
    errors.push(`Stripe: ${stripe.error}`);
  }

  const nextAuth = validateNextAuthSecret();
  if (!nextAuth.valid) {
    errors.push(`NextAuth: ${nextAuth.error}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

