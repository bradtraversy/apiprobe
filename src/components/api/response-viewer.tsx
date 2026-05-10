'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Clock, Download, FileText } from 'lucide-react';
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
  const contentType = response?.headers['content-type'] || 'text/plain';

  const formattedBody = useMemo(() => {
    if (!response) return '';
    if (contentType.includes('application/json')) {
      try {
        return JSON.stringify(JSON.parse(response.body), null, 2);
      } catch {
        return response.body;
      }
    }
    return response.body;
  }, [response, contentType]);

  if (!response) {
    return (
      <div className={cn('p-12 text-center', className)}>
        <div className='w-12 h-12 bg-card border border-line rounded-md flex items-center justify-center mx-auto mb-3'>
          <FileText className='h-5 w-5 text-fg-faint' />
        </div>
        <p className='text-sm text-fg-muted'>No response yet</p>
        <p className='text-xs text-fg-faint mt-1'>
          Send a request to see the response here
        </p>
      </div>
    );
  }

  const getStatusClass = (status: number) => {
    if (status >= 200 && status < 300)
      return 'bg-[color:var(--color-method-get-bg)] text-[color:var(--color-method-get-fg)]';
    if (status >= 300 && status < 400)
      return 'bg-[color:var(--color-method-post-bg)] text-[color:var(--color-method-post-fg)]';
    if (status >= 400 && status < 500)
      return 'bg-[color:var(--color-method-put-bg)] text-[color:var(--color-method-put-fg)]';
    return 'bg-[color:var(--color-method-delete-bg)] text-[color:var(--color-method-delete-fg)]';
  };

  const sanitizeResponse = (body: string): string => {
    return DOMPurify.sanitize(body, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true,
    });
  };

  return (
    <div className={cn('space-y-5', className)}>
      <div className='flex items-center justify-between flex-wrap gap-3'>
        <div
          className={cn(
            'px-2.5 py-1 text-xs font-mono font-semibold tracking-wider rounded-sm',
            getStatusClass(response.status)
          )}
        >
          {response.status} {response.statusText}
        </div>
        <div className='flex items-center gap-3 text-xs font-mono text-fg-muted'>
          <div className='flex items-center gap-1.5'>
            <Clock className='h-3.5 w-3.5' />
            <span>{response.duration}ms</span>
          </div>
          <div className='flex items-center gap-1.5'>
            <Download className='h-3.5 w-3.5' />
            <span>{response.size} bytes</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className='text-[10px] font-semibold text-fg-faint uppercase tracking-wider mb-2'>
          Response Headers
        </h3>
        <div className='bg-card border border-line rounded-md p-3 max-h-40 overflow-y-auto'>
          {Object.entries(response.headers).map(([key, value]) => (
            <div key={key} className='text-xs font-mono py-0.5'>
              <span className='text-accent'>{sanitizeResponse(key)}:</span>
              <span className='text-fg-muted ml-2'>
                {sanitizeResponse(value)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className='text-[10px] font-semibold text-fg-faint uppercase tracking-wider mb-2'>
          Response Body
        </h3>
        <pre className='bg-canvas border border-line rounded-md p-4 max-h-[600px] overflow-auto text-xs font-mono whitespace-pre-wrap text-fg leading-relaxed'>
          {sanitizeResponse(formattedBody)}
        </pre>
      </div>
    </div>
  );
};

export default ResponseViewer;
