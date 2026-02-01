/**
 * URL utility functions for ensuring proper URL formatting
 */

/**
 * Ensures a URL has a proper scheme (https:// in production, http:// for localhost)
 * This fixes the "Invalid URL: An explicit scheme must be provided" error
 */
export function ensureUrlScheme(url: string | undefined | null): string {
  // Default fallback for development
  const defaultUrl = process.env.NODE_ENV === 'production' 
    ? 'https://localhost:3000' // This will fail intentionally if not configured
    : 'http://localhost:3000';
  
  if (!url) {
    console.warn('[URL] No URL provided, using default:', defaultUrl);
    return defaultUrl;
  }
  
  // Trim whitespace
  url = url.trim();
  
  // If URL already has a scheme, return it
  if (url.startsWith('https://') || url.startsWith('http://')) {
    return url;
  }
  
  // Check if it's localhost (use http)
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    return `http://${url}`;
  }
  
  // For all other URLs (production), use https
  return `https://${url}`;
}

/**
 * Gets the app base URL from environment or request headers
 * Ensures the URL always has a proper scheme
 */
export function getAppBaseUrl(requestOrigin?: string | null): string {
  // Priority: request origin > env var > default
  const url = requestOrigin || process.env.NEXT_PUBLIC_APP_URL;
  return ensureUrlScheme(url);
}
