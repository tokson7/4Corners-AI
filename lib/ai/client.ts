/**
 * OpenAI Client Wrapper
 * 
 * Handles AI API calls for brand analysis and design system generation.
 * Provides a simple, robust interface for OpenAI GPT-4 interactions.
 */

import OpenAI from 'openai';

/**
 * OpenAI client instance
 * 
 * Initialized with API key from environment variables.
 * Only available on the server side.
 * 
 * @throws Error if OPENAI_API_KEY is not set when client is used
 */
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '', // Will be validated in analyzeWithAI
});

/**
 * Analyze brand description using AI
 * 
 * Sends a prompt to OpenAI GPT-4 model and returns the response.
 * Configured for brand and color consultation with JSON output.
 * 
 * @param prompt - The prompt/question to send to the AI
 * @returns AI response as string (typically JSON)
 * @throws Error if API call fails or response is invalid
 * 
 * @example
 * ```typescript
 * const response = await analyzeWithAI(
 *   'Analyze this brand: Modern fintech app for Gen Z'
 * );
 * // Returns: '{"primaryColor": "#3B82F6", "reasoning": "..."}'
 * ```
 */
export async function analyzeWithAI(prompt: string): Promise<string> {
  // Validate input
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    throw new Error('Prompt must be a non-empty string');
  }

  // Validate API key is still available
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional brand and color consultant. Return only valid JSON.',
        },
        {
          role: 'user',
          content: prompt.trim(),
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    // Extract content from response
    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response content from AI');
    }

    return content;
  } catch (error) {
    // Handle OpenAI API errors
    if (error instanceof OpenAI.APIError) {
      // OpenAI-specific error
      const apiError = error as InstanceType<typeof OpenAI.APIError>;
      throw new Error(
        `OpenAI API Error: ${apiError.message} (Status: ${apiError.status})`
      );
    }

    // Handle network/timeout errors
    if (error instanceof Error) {
      // Check for common error types
      if (error.message.includes('timeout') || error.message.includes('ECONNRESET')) {
        throw new Error('Network error: Failed to connect to OpenAI API. Please try again.');
      }

      if (error.message.includes('rate limit')) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      // Re-throw with descriptive message
      throw new Error(`Failed to analyze with AI: ${error.message}`);
    }

    // Unknown error type
    throw new Error('Failed to analyze with AI: Unknown error occurred');
  }
}
