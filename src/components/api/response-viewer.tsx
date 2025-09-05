'use client';

import { cn } from '@/lib/utils';
import {
  Clock,
  Download,
  FileText,
  CheckCircle,
  AlertCircle,
  Info,
} from 'lucide-react';
import DOMPurify from 'dompurify';

interface ResponseViewerProps {
  response: {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: string;
    duration: number;
    size: number;
  } | null;
  className?: string;
}

const ResponseViewer = ({ response, className }: ResponseViewerProps) => {
  if (!response) {
    return (
      <div className={cn('p-8 text-center text-slate-500', className)}>
        <div className='w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4'>
          <FileText className='h-8 w-8 text-slate-400' />
        </div>
        <p className='text-slate-600 font-medium'>No response yet</p>
        <p className='text-slate-500 text-sm mt-1'>
          Send a request to see the response here
        </p>
      </div>
    );
  }

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300)
      return 'text-emerald-600 bg-emerald-50 border-emerald-200 shadow-emerald-500/20';
    if (status >= 300 && status < 400)
      return 'text-blue-600 bg-blue-50 border-blue-200 shadow-blue-500/20';
    if (status >= 400 && status < 500)
      return 'text-yellow-600 bg-yellow-50 border-yellow-200 shadow-yellow-500/20';
    return 'text-red-600 bg-red-50 border-red-200 shadow-red-500/20';
  };

  const getStatusIcon = (status: number) => {
    if (status >= 200 && status < 300)
      return <CheckCircle className='h-4 w-4' />;
    if (status >= 300 && status < 400) return <Info className='h-4 w-4' />;
    if (status >= 400 && status < 500)
      return <AlertCircle className='h-4 w-4' />;
    return <AlertCircle className='h-4 w-4' />;
  };

  const formatBody = (body: string, contentType: string) => {
    if (contentType.includes('application/json')) {
      try {
        return JSON.stringify(JSON.parse(body), null, 2);
      } catch {
        return body;
      }
    }
    return body;
  };

  const sanitizeResponse = (body: string): string => {
    // Remove all HTML tags and attributes to prevent XSS
    // This ensures only plain text is displayed
    return DOMPurify.sanitize(body, { 
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true
    });
  };

  const contentType = response.headers['content-type'] || 'text/plain';

  return (
    <div className={cn('space-y-6', className)}>
      {/* Status and Info */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div
            className={cn(
              'px-4 py-2 text-sm font-semibold rounded-lg border shadow-sm flex items-center gap-2',
              getStatusColor(response.status)
            )}
          >
            {getStatusIcon(response.status)}
            {response.status} {response.statusText}
          </div>
        </div>
        <div className='flex items-center gap-6 text-sm text-slate-600'>
          <div className='flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-lg border border-slate-200/50'>
            <Clock className='h-4 w-4 text-slate-500' />
            <span className='font-medium'>{response.duration}ms</span>
          </div>
          <div className='flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-lg border border-slate-200/50'>
            <Download className='h-4 w-4 text-slate-500' />
            <span className='font-medium'>{response.size} bytes</span>
          </div>
        </div>
      </div>

      {/* Headers */}
      <div className='bg-white/50 backdrop-blur-sm rounded-xl border border-white/30 p-6'>
        <h3 className='text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2'>
          <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
          Response Headers
        </h3>
        <div className='bg-slate-50/50 rounded-lg p-4 max-h-40 overflow-y-auto border border-slate-200/50'>
          {Object.entries(response.headers).map(([key, value]) => (
            <div key={key} className='text-sm font-mono py-1'>
              <span className='text-blue-600 font-semibold'>{sanitizeResponse(key)}:</span>
              <span className='text-slate-700 ml-2'>{sanitizeResponse(value)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className='bg-white/50 backdrop-blur-sm rounded-xl border border-white/30 p-6'>
        <h3 className='text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2'>
          <div className='w-2 h-2 bg-green-500 rounded-full'></div>
          Response Body
        </h3>
        <pre className='bg-slate-50/50 rounded-lg p-4 max-h-[800px] overflow-y-auto text-sm font-mono whitespace-pre-wrap border border-slate-200/50'>
          {sanitizeResponse(formatBody(response.body, contentType))}
        </pre>
      </div>
    </div>
  );
};

export default ResponseViewer;
