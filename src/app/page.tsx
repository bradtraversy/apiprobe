'use client';

import { useState, useEffect } from 'react';
import {
  type ApiRequest,
  type ApiResponse,
  type RequestHistory,
} from '@/types/api';
import { makeApiRequest, validateRequest } from '@/lib/api-service';
import {
  saveRequest,
  saveToHistory,
  getSavedRequests,
  getRequestHistory,
  deleteSavedRequest,
  deleteHistoryItem,
} from '@/lib/storage';
import Header from '@/components/ui/header';
import SavedRequests from '@/components/ui/saved-requests';
import RequestHistoryList from '@/components/ui/request-history';
import RequestFormContainer from '@/components/ui/request-form-container';
import ResponseViewerContainer from '@/components/ui/response-viewer-container';

export default function HomePage() {
  const [currentResponse, setCurrentResponse] = useState<ApiResponse | null>(
    null
  );
  const [savedRequests, setSavedRequests] = useState<ApiRequest[]>([]);
  const [requestHistory, setRequestHistory] = useState<RequestHistory[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ApiRequest | null>(
    null
  );

  useEffect(() => {
    // Load saved data on mount
    setSavedRequests(getSavedRequests());
    setRequestHistory(getRequestHistory());
  }, []);

  const handleSendRequest = async (request: ApiRequest) => {
    const validationError = validateRequest(request);
    if (validationError) {
      alert(validationError);
      return;
    }

    const response = await makeApiRequest(request);
    setCurrentResponse(response);

    // Save to history
    const history: RequestHistory = {
      id: crypto.randomUUID(),
      request,
      response,
      timestamp: new Date(),
    };
    saveToHistory(history);
    setRequestHistory(getRequestHistory());
  };

  const handleSaveRequest = (request: ApiRequest) => {
    saveRequest(request);
    setSavedRequests(getSavedRequests());
  };

  const handleLoadRequest = (request: ApiRequest) => {
    setSelectedRequest(request);
  };

  const handleDeleteRequest = (id: string) => {
    if (confirm('Are you sure you want to delete this request?')) {
      deleteSavedRequest(id);
      setSavedRequests(getSavedRequests());
    }
  };

  const handleDeleteHistory = (id: string) => {
    if (confirm('Are you sure you want to delete this history item?')) {
      deleteHistoryItem(id);
      setRequestHistory(getRequestHistory());
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'>
      <Header />

      <div className='container mx-auto px-6 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          {/* Left Sidebar */}
          <div className='lg:col-span-1 space-y-6'>
            <SavedRequests
              savedRequests={savedRequests}
              onLoadRequest={handleLoadRequest}
              onDeleteRequest={handleDeleteRequest}
            />
            <RequestHistoryList
              requestHistory={requestHistory}
              onLoadRequest={handleLoadRequest}
              onDeleteHistory={handleDeleteHistory}
            />
          </div>

          {/* Main Content */}
          <div className='lg:col-span-3 space-y-6'>
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
