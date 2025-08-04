import { type ApiRequest, type ApiResponse } from '@/types/api';

export async function makeApiRequest(
  request: ApiRequest
): Promise<ApiResponse> {
  const startTime = Date.now();

  try {
    // Prepare headers
    const headers: Record<string, string> = {};
    Object.entries(request.headers).forEach(([key, value]) => {
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

export function validateRequest(request: ApiRequest): string | null {
  if (!request.url.trim()) {
    return 'URL is required';
  }

  // Skip URL validation if it contains environment variables
  // (they will be validated after substitution)
  if (!request.url.includes('{{')) {
    try {
      new URL(request.url);
    } catch {
      return 'Invalid URL format';
    }
  }

  if (request.method === 'GET' && request.body) {
    return 'GET requests cannot have a body';
  }

  return null;
}
