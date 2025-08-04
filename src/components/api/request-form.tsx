import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { type ApiRequest, type HttpMethod } from '@/types/api';
import MethodSelector from './method-selector';
import UrlInput from './url-input';
import HeadersEditor from './headers-editor';
import BodyEditor from './body-editor';

interface RequestFormProps {
  onSend: (request: ApiRequest) => Promise<void>;
  onSave?: (request: ApiRequest) => void;
  initialRequest?: Partial<ApiRequest>;
  className?: string;
}

const RequestForm = ({
  onSend,
  onSave,
  initialRequest,
  className,
}: RequestFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(initialRequest?.name || '');
  const [method, setMethod] = useState<HttpMethod>(
    initialRequest?.method || 'GET'
  );
  const [url, setUrl] = useState(initialRequest?.url || '');
  const [headers, setHeaders] = useState<Record<string, string>>(
    initialRequest?.headers || { 'Content-Type': 'application/json' }
  );
  const [body, setBody] = useState(initialRequest?.body || '');
  const [contentType, setContentType] = useState('application/json');

  // Update form when initialRequest changes
  useEffect(() => {
    if (initialRequest) {
      setName(initialRequest.name || '');
      setMethod(initialRequest.method || 'GET');
      setUrl(initialRequest.url || '');
      setHeaders(
        initialRequest.headers || { 'Content-Type': 'application/json' }
      );
      setBody(initialRequest.body || '');
      setContentType(
        initialRequest.headers?.['Content-Type'] || 'application/json'
      );
    }
  }, [initialRequest]);

  // Clear body when switching to GET/HEAD methods
  const handleMethodChange = (newMethod: HttpMethod) => {
    setMethod(newMethod);
    if (newMethod === 'GET' || newMethod === 'HEAD') {
      setBody('');
    }
  };

  const handleSend = async () => {
    if (!url.trim()) return;

    setIsLoading(true);
    try {
      const request: ApiRequest = {
        id: crypto.randomUUID(),
        name: name || `Request to ${url}`,
        method,
        url: url.trim(),
        headers: {
          ...headers,
          'Content-Type': contentType,
        },
        body,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await onSend(request);
    } catch (error) {
      console.error('Failed to send request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!url.trim()) return;

    const request: ApiRequest = {
      id: crypto.randomUUID(),
      name: name || `Request to ${url}`,
      method,
      url: url.trim(),
      headers: {
        ...headers,
        'Content-Type': contentType,
      },
      body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    onSave?.(request);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={className} onKeyDown={handleKeyDown}>
      <div className='space-y-6'>
        {/* Request Name */}
        <div>
          <label className='block text-sm font-medium mb-2 text-slate-700'>
            Request Name
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Enter a name for this request'
          />
        </div>

        {/* Method and URL */}
        <div className='space-y-4'>
          <label className='block text-sm font-medium text-slate-700'>
            Method & URL
          </label>
          <div className='flex items-start gap-4'>
            <div className='w-40 flex-shrink-0'>
              <MethodSelector value={method} onChange={handleMethodChange} />
            </div>
            <div className='flex-1'>
              <UrlInput value={url} onChange={setUrl} />
            </div>
          </div>
        </div>

        {/* Headers */}
        <div>
          <label className='block text-sm font-medium mb-2 text-slate-700'>
            Headers
          </label>
          <HeadersEditor headers={headers} onChange={setHeaders} />
        </div>

        {/* Body */}
        {method !== 'GET' && method !== 'HEAD' && (
          <div>
            <label className='block text-sm font-medium mb-2 text-slate-700'>
              Body
            </label>
            <BodyEditor
              body={body}
              onChange={setBody}
              contentType={contentType}
              onContentTypeChange={setContentType}
            />
          </div>
        )}

        {/* Actions */}
        <div className='flex gap-3 pt-2'>
          <Button
            onClick={handleSend}
            disabled={isLoading || !url.trim()}
            className='flex items-center gap-2'
          >
            <Send className='h-4 w-4' />
            {isLoading ? 'Sending...' : 'Send Request'}
          </Button>
          {onSave && (
            <Button
              variant='outline'
              onClick={handleSave}
              disabled={!url.trim()}
              className='flex items-center gap-2'
            >
              <Save className='h-4 w-4' />
              Save Request
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestForm;
