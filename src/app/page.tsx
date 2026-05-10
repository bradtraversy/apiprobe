'use client';

import { useState, useEffect } from 'react';
import {
  type ApiRequest,
  type ApiResponse,
  type RequestHistory,
} from '@/types/api';
import { makeApiRequest, validateRequest, checkRateLimit } from '@/lib/api-service';
import { getRateLimitStatus } from '@/lib/rate-limit';
import {
  saveRequest,
  saveToHistory,
  getSavedRequests,
  getRequestHistory,
  deleteSavedRequest,
  deleteHistoryItem,
  updateHistoryItem,
  saveEnvironments,
  getEnvironments,
  saveCurrentEnvironment,
  getCurrentEnvironment,
} from '@/lib/storage';
import {
  substituteVariables,
  substituteVariablesInObject,
  type Environment,
} from '@/lib/variable-substitution';
import Header from '@/components/ui/header';
import SavedRequests from '@/components/ui/saved-requests';
import RequestHistoryList from '@/components/ui/request-history';
import RequestFormContainer from '@/components/ui/request-form-container';
import ResponseViewerContainer from '@/components/ui/response-viewer-container';
import EnvironmentManager from '@/components/ui/environment-manager';
import SecurityWarning from '@/components/ui/security-warning';
import SettingsPanel from '@/components/ui/settings-panel';
import toast from 'react-hot-toast';

export default function HomePage() {
  const [currentResponse, setCurrentResponse] = useState<ApiResponse | null>(
    null
  );
  const [savedRequests, setSavedRequests] = useState<ApiRequest[]>([]);
  const [requestHistory, setRequestHistory] = useState<RequestHistory[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ApiRequest | null>(
    null
  );
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [currentEnvironment, setCurrentEnvironment] = useState<string>('');

  useEffect(() => {
    // Load saved data on mount
    setSavedRequests(getSavedRequests());
    setRequestHistory(getRequestHistory());
    setEnvironments(getEnvironments());
    setCurrentEnvironment(getCurrentEnvironment());
  }, []);

  const handleSendRequest = async (request: ApiRequest) => {
    // Get current environment variables
    const currentEnv = environments.find(
      (env) => env.id === currentEnvironment
    );
    const variables = currentEnv?.variables || {};

    // Substitute variables in request
    const processedRequest: ApiRequest = {
      ...request,
      url: substituteVariables(request.url, variables),
      headers: substituteVariablesInObject(request.headers, variables),
      body: substituteVariables(request.body, variables),
    };

    // Validate the processed request (after variable substitution)
    const validationError = validateRequest(processedRequest);
    if (validationError) {
      toast.error(validationError)
      return;
    }

    // Check rate limit before making request
    const { canRequest, status } = checkRateLimit();
    if (!canRequest) {
      const resetInSeconds = Math.ceil(status.resetIn / 1000);
      toast.error(`Rate limit exceeded. You have used ${status.current}/${status.limit} requests. Please wait ${resetInSeconds} seconds before trying again.`);
      return;
    }

    let response: ApiResponse;
    try {
      response = await makeApiRequest(processedRequest);
      setCurrentResponse(response);
    } catch (error) {
      // Handle rate limit error from p-throttle
      const errorMessage = error instanceof Error ? error.message : '';
      if (errorMessage.includes('Rate limit')) {
        const status = getRateLimitStatus();
        const resetInSeconds = Math.ceil(status.resetIn / 1000);
        toast.error(`Rate limit exceeded. Please wait ${resetInSeconds} seconds before trying again.`);
      }
      return;
    }

    // Check if this request already exists in history
    const existingHistory = requestHistory.find(
      (item) =>
        item.request.method === processedRequest.method &&
        item.request.url === processedRequest.url &&
        item.request.name === processedRequest.name
    );

    if (existingHistory) {
      // Update existing history item with new response and timestamp
      const updatedHistory: RequestHistory = {
        ...existingHistory,
        response,
        timestamp: new Date(),
      };
      updateHistoryItem(updatedHistory);
    } else {
      // Add new history item
      const history: RequestHistory = {
        id: crypto.randomUUID(),
        request: processedRequest,
        response,
        timestamp: new Date(),
      };
      saveToHistory(history);
    }

    setRequestHistory(getRequestHistory());
  };

  const handleSaveRequest = (request: ApiRequest) => {
    saveRequest(request);
    setSavedRequests(getSavedRequests());
  };

  const handleLoadRequest = (request: ApiRequest) => {
    setSelectedRequest(request);
  };

  const confirmDelete = (message: string, onConfirm: () => void) => {
    toast(
      (t) => (
        <div className='flex items-center gap-3'>
          <span className='text-sm text-fg'>{message}</span>
          <button
            type='button'
            onClick={() => {
              onConfirm();
              toast.dismiss(t.id);
            }}
            className='px-2 py-1 text-xs font-medium rounded border border-line bg-card text-[color:var(--color-method-delete-fg)] hover:border-[color:var(--color-method-delete-fg)]/40 hover:bg-card-hover transition-colors'
          >
            Delete
          </button>
          <button
            type='button'
            onClick={() => toast.dismiss(t.id)}
            className='px-2 py-1 text-xs font-medium rounded border border-line bg-card text-fg hover:bg-card-hover transition-colors'
          >
            Cancel
          </button>
        </div>
      ),
      { duration: 6000 }
    );
  };

  const handleDeleteRequest = (id: string) => {
    confirmDelete('Delete this request?', () => {
      deleteSavedRequest(id);
      setSavedRequests(getSavedRequests());
    });
  };

  const handleDeleteHistory = (id: string) => {
    confirmDelete('Delete this history item?', () => {
      deleteHistoryItem(id);
      setRequestHistory(getRequestHistory());
    });
  };

  const handleEnvironmentsChange = (newEnvironments: Environment[]) => {
    setEnvironments(newEnvironments);
    saveEnvironments(newEnvironments);
  };

  const handleCurrentEnvironmentChange = (environmentId: string) => {
    setCurrentEnvironment(environmentId);
    saveCurrentEnvironment(environmentId);
  };

  const handleDataCleared = () => {
    // Reset all state when data is cleared
    setSavedRequests([]);
    setRequestHistory([]);
    setEnvironments([]);
    setCurrentEnvironment('');
    setCurrentResponse(null);
    setSelectedRequest(null);
  };

  return (
    <div className='min-h-screen bg-canvas'>
      <Header />

      <div className='max-w-[1400px] mx-auto px-6 py-8'>
        <SecurityWarning className='mb-6' />
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-5'>
          {/* Left Sidebar */}
          <div className='lg:col-span-1 space-y-5'>
            <EnvironmentManager
              environments={environments}
              currentEnvironment={currentEnvironment}
              onEnvironmentsChange={handleEnvironmentsChange}
              onCurrentEnvironmentChange={handleCurrentEnvironmentChange}
            />
            <SavedRequests
              savedRequests={savedRequests}
              onLoadRequest={handleLoadRequest}
              onDeleteRequest={handleDeleteRequest}
              environmentVariables={
                environments.find((env) => env.id === currentEnvironment)
                  ?.variables || {}
              }
            />
            <RequestHistoryList
              requestHistory={requestHistory}
              onLoadRequest={handleLoadRequest}
              onDeleteHistory={handleDeleteHistory}
              environmentVariables={
                environments.find((env) => env.id === currentEnvironment)
                  ?.variables || {}
              }
            />
            <SettingsPanel onDataCleared={handleDataCleared} />
          </div>

          {/* Main Content */}
          <div className='lg:col-span-3 space-y-5'>
            <RequestFormContainer
              onSend={handleSendRequest}
              onSave={handleSaveRequest}
              initialRequest={selectedRequest || undefined}
            />
            <ResponseViewerContainer response={currentResponse} />
          </div>
        </div>
      </div>
    </div>
  );
}
