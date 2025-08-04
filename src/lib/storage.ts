import { type ApiRequest, type RequestHistory } from '@/types/api';

const STORAGE_KEYS = {
  SAVED_REQUESTS: 'apiprobe_saved_requests',
  REQUEST_HISTORY: 'apiprobe_request_history',
} as const;

export function saveRequest(request: ApiRequest): void {
  try {
    const saved = getSavedRequests();
    const existingIndex = saved.findIndex((r) => r.id === request.id);

    if (existingIndex >= 0) {
      saved[existingIndex] = { ...request, updatedAt: new Date() };
    } else {
      saved.push(request);
    }

    localStorage.setItem(STORAGE_KEYS.SAVED_REQUESTS, JSON.stringify(saved));
  } catch (error) {
    console.error('Failed to save request:', error);
  }
}

export function getSavedRequests(): ApiRequest[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SAVED_REQUESTS);
    if (!saved) return [];

    const requests = JSON.parse(saved) as ApiRequest[];
    return requests.map((req) => ({
      ...req,
      createdAt: new Date(req.createdAt),
      updatedAt: new Date(req.updatedAt),
    }));
  } catch (error) {
    console.error('Failed to load saved requests:', error);
    return [];
  }
}

export function deleteSavedRequest(id: string): void {
  try {
    const saved = getSavedRequests();
    const filtered = saved.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.SAVED_REQUESTS, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete request:', error);
  }
}

export function saveToHistory(history: RequestHistory): void {
  try {
    const saved = getRequestHistory();
    saved.unshift(history);

    // Keep only last 50 requests
    const limited = saved.slice(0, 50);

    localStorage.setItem(STORAGE_KEYS.REQUEST_HISTORY, JSON.stringify(limited));
  } catch (error) {
    console.error('Failed to save to history:', error);
  }
}

export function getRequestHistory(): RequestHistory[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.REQUEST_HISTORY);
    if (!saved) return [];

    const history = JSON.parse(saved) as RequestHistory[];
    return history.map((item) => ({
      ...item,
      request: {
        ...item.request,
        createdAt: new Date(item.request.createdAt),
        updatedAt: new Date(item.request.updatedAt),
      },
      timestamp: new Date(item.timestamp),
    }));
  } catch (error) {
    console.error('Failed to load request history:', error);
    return [];
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.REQUEST_HISTORY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
}
