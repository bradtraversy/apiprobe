/**
 * Security and validation utilities for API Probe
 */

/**
 * Sanitize and validate a URL
 * @param url - The URL to validate
 * @returns Sanitized URL or null if invalid
 */
export function sanitizeUrl(url: string): string | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  try {
    const parsed = new URL(url);
    
    // Only allow HTTP/HTTPS protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null;
    }
    
    // Basic length check to prevent extremely long URLs
    if (url.length > 2048) {
      return null;
    }
    
    return url;
  } catch {
    return null;
  }
}

/**
 * Validate if a string contains potentially dangerous content
 * @param input - The string to validate
 * @returns true if safe, false if potentially dangerous
 */
export function isSafeInput(input: string): boolean {
  if (!input || typeof input !== 'string') {
    return true;
  }

  // Check for common XSS patterns
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /data:/gi,
    /vbscript:/gi,
    /on\w+\s*=/gi, // onclick, onload, etc.
  ];

  return !dangerousPatterns.some(pattern => pattern.test(input));
}

/**
 * Sanitize headers to prevent injection attacks
 * @param headers - The headers object to sanitize
 * @returns Sanitized headers object
 */
export function sanitizeHeaders(headers: Record<string, string>): Record<string, string> {
  const sanitized: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(headers)) {
    // Skip empty or null values
    if (!key || !value) continue;
    
    // Basic header name validation (alphanumeric, hyphens, underscores)
    if (!/^[a-zA-Z0-9\-_]+$/.test(key)) continue;
    
    // Check for dangerous header names
    const lowerKey = key.toLowerCase();
    const dangerousHeaders = [
      'content-security-policy',
      'x-frame-options',
      'x-content-type-options',
      'strict-transport-security',
    ];
    
    if (dangerousHeaders.includes(lowerKey)) continue;
    
    // Basic value sanitization
    if (isSafeInput(value)) {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

/**
 * Validate environment variable names
 * @param name - The variable name to validate
 * @returns true if valid, false otherwise
 */
export function isValidVariableName(name: string): boolean {
  if (!name || typeof name !== 'string') {
    return false;
  }
  
  // Variable names should be alphanumeric with underscores and hyphens
  return /^[a-zA-Z][a-zA-Z0-9_-]*$/.test(name);
}

/**
 * Validate environment variable values
 * @param value - The variable value to validate
 * @returns true if safe, false if potentially dangerous
 */
export function isValidVariableValue(value: string): boolean {
  if (typeof value !== 'string') {
    return false;
  }
  
  // Check for dangerous content
  return isSafeInput(value);
} 