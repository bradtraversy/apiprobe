import pThrottle from 'p-throttle';

// Fixed rate limit for public use - 5 requests per minute
export const RATE_LIMIT = { limit: 5, interval: 60000 } as const;

// Store the current throttle function
let currentThrottle: ReturnType<typeof pThrottle> | null = null;
let requestCount = 0;
let windowStart = Date.now();

/**
 * Get the current request count and limit
 */
export function getRateLimitStatus() {
  const now = Date.now();
  
  // Reset counter if window has passed
  if (now - windowStart > RATE_LIMIT.interval) {
    requestCount = 0;
    windowStart = now;
  }
  
  return {
    current: requestCount,
    limit: RATE_LIMIT.limit,
    remaining: Math.max(0, RATE_LIMIT.limit - requestCount),
    resetIn: Math.max(0, RATE_LIMIT.interval - (now - windowStart))
  };
}

/**
 * Create a throttled function that respects rate limits
 */
export function createThrottledRequest<T extends (...args: any[]) => any>(
  fn: T
): (...args: Parameters<T>) => ReturnType<T> {
  // Create throttle if needed
  if (!currentThrottle) {
    currentThrottle = pThrottle({
      limit: RATE_LIMIT.limit,
      interval: RATE_LIMIT.interval,
      strict: true // Throw error when rate limit is exceeded
    });
    requestCount = 0;
    windowStart = Date.now();
  }
  
  // Wrap the function to track request count
  const throttled = currentThrottle(async (...args: Parameters<T>) => {
    requestCount++;
    return fn(...args);
  });
  
  return throttled as any;
}

/**
 * Check if we can make a request without actually making it
 */
export function canMakeRequest(): boolean {
  const status = getRateLimitStatus();
  return status.remaining > 0;
}

/**
 * Reset the rate limit counter
 */
export function resetRateLimit(): void {
  requestCount = 0;
  windowStart = Date.now();
  currentThrottle = null;
}