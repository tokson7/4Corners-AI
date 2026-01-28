/**
 * Input Sanitization and Validation
 * Protects against prompt injection, XSS, and malformed data
 */

/**
 * Maximum allowed input length
 */
export const MAX_INPUT_LENGTHS = {
  brandDescription: 5000,
  refinementInstruction: 1000,
  email: 255,
  teamName: 100,
  designSystemName: 200,
} as const;

/**
 * Sanitize text input
 * Removes potentially dangerous characters and normalizes whitespace
 */
export function sanitizeText(input: string, maxLength?: number): string {
  if (typeof input !== "string") {
    throw new Error("Input must be a string");
  }

  // Trim and normalize whitespace
  let sanitized = input.trim().replace(/\s+/g, " ");

  // Remove control characters (except newlines and tabs)
  sanitized = sanitized.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, "");

  // Limit length
  const limit = maxLength ?? MAX_INPUT_LENGTHS.brandDescription;
  if (sanitized.length > limit) {
    sanitized = sanitized.substring(0, limit);
  }

  return sanitized;
}

/**
 * Validate brand description
 */
export function validateBrandDescription(description: string): {
  valid: boolean;
  sanitized: string;
  error?: string;
} {
  if (!description || typeof description !== "string") {
    return {
      valid: false,
      sanitized: "",
      error: "Brand description is required",
    };
  }

  if (description.trim().length === 0) {
    return {
      valid: false,
      sanitized: "",
      error: "Brand description cannot be empty",
    };
  }

  if (description.length > MAX_INPUT_LENGTHS.brandDescription) {
    return {
      valid: false,
      sanitized: "",
      error: `Brand description must be less than ${MAX_INPUT_LENGTHS.brandDescription} characters`,
    };
  }

  // Check for prompt injection patterns
  const promptInjectionPatterns = [
    /ignore\s+(previous|above|all)\s+(instructions?|prompts?)/i,
    /system\s*:\s*you\s+are/i,
    /\[INST\]|\[\/INST\]/i, // Llama format
    /<\|im_start\|>|<\|im_end\|>/i, // ChatML format
    /###\s*(system|user|assistant)\s*:/i, // Chat format
  ];

  for (const pattern of promptInjectionPatterns) {
    if (pattern.test(description)) {
      return {
        valid: false,
        sanitized: "",
        error: "Invalid input detected",
      };
    }
  }

  const sanitized = sanitizeText(description, MAX_INPUT_LENGTHS.brandDescription);

  return {
    valid: true,
    sanitized,
  };
}

/**
 * Validate refinement instruction
 */
export function validateRefinementInstruction(instruction: string): {
  valid: boolean;
  sanitized: string;
  error?: string;
} {
  if (!instruction || typeof instruction !== "string") {
    return {
      valid: false,
      sanitized: "",
      error: "Instruction is required",
    };
  }

  if (instruction.trim().length === 0) {
    return {
      valid: false,
      sanitized: "",
      error: "Instruction cannot be empty",
    };
  }

  if (instruction.length > MAX_INPUT_LENGTHS.refinementInstruction) {
    return {
      valid: false,
      sanitized: "",
      error: `Instruction must be less than ${MAX_INPUT_LENGTHS.refinementInstruction} characters`,
    };
  }

  // Check for prompt injection
  const promptInjectionPatterns = [
    /ignore\s+(previous|above|all)\s+(instructions?|prompts?)/i,
    /system\s*:\s*you\s+are/i,
    /\[INST\]|\[\/INST\]/i,
    /<\|im_start\|>|<\|im_end\|>/i,
    /###\s*(system|user|assistant)\s*:/i,
  ];

  for (const pattern of promptInjectionPatterns) {
    if (pattern.test(instruction)) {
      return {
        valid: false,
        sanitized: "",
        error: "Invalid input detected",
      };
    }
  }

  const sanitized = sanitizeText(instruction, MAX_INPUT_LENGTHS.refinementInstruction);

  return {
    valid: true,
    sanitized,
  };
}

/**
 * Validate JSON payload size
 */
export function validatePayloadSize(payload: any, maxSizeBytes: number = 1024 * 100): {
  valid: boolean;
  error?: string;
} {
  try {
    const jsonString = JSON.stringify(payload);
    const sizeBytes = new Blob([jsonString]).size;

    if (sizeBytes > maxSizeBytes) {
      return {
        valid: false,
        error: `Payload too large. Maximum size: ${maxSizeBytes} bytes`,
      };
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: "Invalid payload format",
    };
  }
}

/**
 * Sanitize email address
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== "string") {
    throw new Error("Email must be a string");
  }

  // Basic email validation and sanitization
  const sanitized = email.trim().toLowerCase();
  
  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) {
    throw new Error("Invalid email format");
  }

  if (sanitized.length > MAX_INPUT_LENGTHS.email) {
    throw new Error(`Email must be less than ${MAX_INPUT_LENGTHS.email} characters`);
  }

  return sanitized;
}

/**
 * Sanitize team name
 */
export function sanitizeTeamName(name: string): string {
  if (typeof name !== "string") {
    throw new Error("Team name must be a string");
  }

  let sanitized = name.trim();

  // Remove potentially dangerous characters
  sanitized = sanitized.replace(/[<>\"'&]/g, "");

  // Limit length
  if (sanitized.length > MAX_INPUT_LENGTHS.teamName) {
    sanitized = sanitized.substring(0, MAX_INPUT_LENGTHS.teamName);
  }

  if (sanitized.length === 0) {
    throw new Error("Team name cannot be empty");
  }

  return sanitized;
}

/**
 * Validate and sanitize design system name
 */
export function validateDesignSystemName(name: string): {
  valid: boolean;
  sanitized: string;
  error?: string;
} {
  if (!name || typeof name !== "string") {
    return {
      valid: false,
      sanitized: "",
      error: "Name is required",
    };
  }

  let sanitized = name.trim();

  // Remove potentially dangerous characters
  sanitized = sanitized.replace(/[<>\"'&]/g, "");

  if (sanitized.length === 0) {
    return {
      valid: false,
      sanitized: "",
      error: "Name cannot be empty",
    };
  }

  if (sanitized.length > MAX_INPUT_LENGTHS.designSystemName) {
    return {
      valid: false,
      sanitized: "",
      error: `Name must be less than ${MAX_INPUT_LENGTHS.designSystemName} characters`,
    };
  }

  return {
    valid: true,
    sanitized,
  };
}

