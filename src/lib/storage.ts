import { type ApiRequest, type RequestHistory } from '@/types/api';
import { type Environment } from '@/lib/variable-substitution';

const STORAGE_KEYS = {
  SAVED_REQUESTS: 'apiprobe_saved_requests',
  REQUEST_HISTORY: 'apiprobe_request_history',
  ENVIRONMENTS: 'apiprobe_environments',
  CURRENT_ENVIRONMENT: 'apiprobe_current_environment',
  SECURITY_WARNING_DISMISSED: 'apiprobe_security_warning_dismissed',
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

export function deleteHistoryItem(id: string): void {
  try {
    const saved = getRequestHistory();
    const filtered = saved.filter((item) => item.id !== id);
    localStorage.setItem(
      STORAGE_KEYS.REQUEST_HISTORY,
      JSON.stringify(filtered)
    );
  } catch (error) {
    console.error('Failed to delete history item:', error);
  }
}

export function updateHistoryItem(updatedHistory: RequestHistory): void {
  try {
    const saved = getRequestHistory();
    const updated = saved.map((item) =>
      item.id === updatedHistory.id ? updatedHistory : item
    );
    localStorage.setItem(STORAGE_KEYS.REQUEST_HISTORY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to update history item:', error);
  }
}

// Environment management functions
export function saveEnvironments(environments: Environment[]): void {
  try {
    localStorage.setItem(
      STORAGE_KEYS.ENVIRONMENTS,
      JSON.stringify(environments)
    );
  } catch (error) {
    console.error('Failed to save environments:', error);
  }
}

export function getEnvironments(): Environment[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.ENVIRONMENTS);
    if (!saved) {
      // Create default environment if none exists
      const defaultEnv = {
        id: crypto.randomUUID(),
        name: 'Default',
        variables: {},
      };
      saveEnvironments([defaultEnv]);
      return [defaultEnv];
    }
    return JSON.parse(saved);
  } catch (error) {
    console.error('Failed to load environments:', error);
    return [];
  }
}

export function saveCurrentEnvironment(environmentId: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_ENVIRONMENT, environmentId);
  } catch (error) {
    console.error('Failed to save current environment:', error);
  }
}

export function getCurrentEnvironment(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_ENVIRONMENT);
    if (!saved) {
      const environments = getEnvironments();
      if (environments.length > 0) {
        saveCurrentEnvironment(environments[0].id);
        return environments[0].id;
      }
    }
    return saved || '';
  } catch (error) {
    console.error('Failed to load current environment:', error);
    return '';
  }
}

export function clearAllData(): void {
  try {
    // Clear all application data
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Failed to clear application data:', error);
  }
}

// Security warning functions
export function setSecurityWarningDismissed(): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SECURITY_WARNING_DISMISSED, 'true');
  } catch (error) {
    console.error('Failed to save security warning dismissal:', error);
  }
}

export function isSecurityWarningDismissed(): boolean {
  try {
    const dismissed = localStorage.getItem(
      STORAGE_KEYS.SECURITY_WARNING_DISMISSED
    );
    return dismissed === 'true';
  } catch (error) {
    console.error('Failed to check security warning dismissal:', error);
    return false;
  }
}
