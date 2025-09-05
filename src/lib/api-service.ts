import { type ApiRequest, type ApiResponse } from '@/types/api';
import { sanitizeUrl, sanitizeHeaders } from '@/lib/validation';
import { createThrottledRequest, canMakeRequest, getRateLimitStatus } from '@/lib/rate-limit';

// Create the actual request function
async function _makeApiRequest(
  request: ApiRequest
): Promise<ApiResponse> {
  const startTime = Date.now();

  try {
    // Prepare and sanitize headers
    const sanitizedHeaders = sanitizeHeaders(request.headers);
    const headers: Record<string, string> = {};
    Object.entries(sanitizedHeaders).forEach(([key, value]) => {
      if (key.toLowerCase() !== 'content-type' || request.method !== 'GET') {
        headers[key] = value;
      }
    });

    // Prepare body
    let body: string | undefined;
    if (request.method !== 'GET' && request.method !== 'HEAD' && request.body) {
      body = request.body;
    }

    // Make the request
    const response = await fetch(request.url, {
      method: request.method,
      headers,
      body,
    });

    // Get response body
    const responseText = await response.text();
    const endTime = Date.now();
    const duration = endTime - startTime;

    // Convert headers to plain object
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    return {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      body: responseText,
      duration,
      size: responseText.length,
    };
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;

    // Handle network errors
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    return {
      status: 0,
      statusText: 'Network Error',
      headers: {},
      body: `Error: ${errorMessage}`,
      duration,
      size: 0,
    };
  }
}

// Export the throttled version
export const makeApiRequest = createThrottledRequest(_makeApiRequest);

// Export a function to check rate limit status before making a request
export function checkRateLimit(): { canRequest: boolean; status: ReturnType<typeof getRateLimitStatus> } {
  const status = getRateLimitStatus();
  return {
    canRequest: canMakeRequest(),
    status
  };
}

export function validateRequest(request: ApiRequest): string | null {
  if (!request.url.trim()) {
    return 'URL is required';
  }

  // Skip URL validation if it contains environment variables
  // (they will be validated after substitution)
  if (!request.url.includes('{{')) {
    const sanitizedUrl = sanitizeUrl(request.url);
    if (!sanitizedUrl) {
      return 'Invalid URL format or protocol not allowed';
    }
  }

  if (request.method === 'GET' && request.body) {
    return 'GET requests cannot have a body';
  }

  return null;
}
