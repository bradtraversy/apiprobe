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
} from '@/lib/storage';
import RequestForm from '@/components/api/request-form';
import ResponseViewer from '@/components/api/response-viewer';
import { Button } from '@/components/ui/button';
import { Clock, Trash2, Play, Zap, History, Bookmark } from 'lucide-react';

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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'>
      {/* Header */}
      <div className='bg-white/80 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-10'>
        <div className='container mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg'>
                <Zap className='w-6 h-6 text-white' />
              </div>
              <div>
                <h1 className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
                  API Probe
                </h1>
                <p className='text-sm text-slate-600'>
                  Simple & Powerful API Testing
                </p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <div className='px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium'>
                Ready
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-6 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          {/* Left Sidebar */}
          <div className='lg:col-span-1 space-y-6'>
            {/* Saved Requests */}
            <div className='bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6'>
              <div className='flex items-center gap-2 mb-4'>
                <Bookmark className='w-5 h-5 text-blue-600' />
                <h2 className='text-lg font-semibold text-slate-800'>
                  Saved Requests
                </h2>
              </div>
              {savedRequests.length === 0 ? (
                <div className='text-center py-8'>
                  <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3'>
                    <Bookmark className='w-6 h-6 text-blue-600' />
                  </div>
                  <p className='text-slate-500 text-sm'>
                    No saved requests yet
                  </p>
                </div>
              ) : (
                <div className='space-y-3'>
                  {savedRequests.map((request) => (
                    <div
                      key={request.id}
                      className='group bg-white/50 hover:bg-white/80 rounded-xl p-3 border border-white/30 transition-all duration-200 hover:shadow-md'
                    >
                      <div className='flex items-center justify-between'>
                        <div className='flex-1 min-w-0'>
                          <div className='text-sm font-medium text-slate-800 truncate'>
                            {request.name}
                          </div>
                          <div className='text-xs text-slate-500 truncate mt-1'>
                            {request.url}
                          </div>
                        </div>
                        <div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleLoadRequest(request)}
                            className='p-1 h-8 w-8 text-blue-600 hover:bg-blue-100'
                          >
                            <Play className='h-3 w-3' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleDeleteRequest(request.id)}
                            className='p-1 h-8 w-8 text-red-600 hover:bg-red-100'
                          >
                            <Trash2 className='h-3 w-3' />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Request History */}
            <div className='bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6'>
              <div className='flex items-center gap-2 mb-4'>
                <History className='w-5 h-5 text-indigo-600' />
                <h2 className='text-lg font-semibold text-slate-800'>
                  Recent Requests
                </h2>
              </div>
              {requestHistory.length === 0 ? (
                <div className='text-center py-8'>
                  <div className='w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3'>
                    <History className='w-6 h-6 text-indigo-600' />
                  </div>
                  <p className='text-slate-500 text-sm'>No recent requests</p>
                </div>
              ) : (
                <div className='space-y-3'>
                  {requestHistory.slice(0, 5).map((history) => (
                    <div
                      key={history.id}
                      className='group bg-white/50 hover:bg-white/80 rounded-xl p-3 border border-white/30 transition-all duration-200 hover:shadow-md cursor-pointer'
                      onClick={() => handleLoadRequest(history.request)}
                    >
                      <div className='flex items-center justify-between'>
                        <div className='flex-1 min-w-0'>
                          <div className='text-sm font-medium text-slate-800 truncate'>
                            {history.request.name}
                          </div>
                          <div className='text-xs text-slate-500 truncate mt-1'>
                            {history.request.url}
                          </div>
                        </div>
                        <div className='flex items-center gap-1 text-xs text-slate-500'>
                          <Clock className='h-3 w-3' />
                          {formatDate(history.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className='lg:col-span-3 space-y-6'>
            {/* Request Form */}
            <div className='bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8'>
              <div className='flex items-center gap-3 mb-6'>
                <div className='w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center'>
                  <Zap className='w-4 h-4 text-white' />
                </div>
                <h2 className='text-xl font-semibold text-slate-800'>
                  New Request
                </h2>
              </div>
              <RequestForm
                onSend={handleSendRequest}
                onSave={handleSaveRequest}
                initialRequest={selectedRequest || undefined}
              />
            </div>

            {/* Response Viewer */}
            <div className='bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8'>
              <div className='flex items-center gap-3 mb-6'>
                <div className='w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center'>
                  <div className='w-2 h-2 bg-white rounded-full'></div>
                </div>
                <h2 className='text-xl font-semibold text-slate-800'>
                  Response
                </h2>
              </div>
              <ResponseViewer response={currentResponse} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
