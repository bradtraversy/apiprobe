import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Save, Copy } from 'lucide-react';
import { useState, useEffect, useMemo, type KeyboardEvent } from 'react';
import { toast } from 'react-hot-toast';
import { type ApiRequest, type HttpMethod } from '@/types/api';
import { buildCurlCommand } from '@/lib/api-service';
import MethodSelector from './method-selector';
import UrlInput from './url-input';
import HeadersEditor from './headers-editor';
import AuthEditor from './auth-editor';
import BodyEditor from './body-editor';

interface RequestFormProps {
  onSend: (request: ApiRequest) => Promise<void>;
  onSave?: (request: ApiRequest) => void;
  initialRequest?: Partial<ApiRequest>;
  className?: string;
}

const sectionLabel =
  'block text-xs font-semibold text-fg-muted uppercase tracking-wider mb-2';

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

  const handleMethodChange = (newMethod: HttpMethod) => {
    setMethod(newMethod);
    if (
      newMethod === 'GET' ||
      newMethod === 'HEAD' ||
      newMethod === 'OPTIONS'
    ) {
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
        headers: { ...headers, 'Content-Type': contentType },
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
      headers: { ...headers, 'Content-Type': contentType },
      body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    onSave?.(request);
  };

  const curlCommand = useMemo(() => {
    if (!url.trim()) return '';

    const request: ApiRequest = {
      id: 'preview',
      name: name || `Request to ${url}`,
      method,
      url: url.trim(),
      headers: { ...headers, 'Content-Type': contentType },
      body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return buildCurlCommand(request);
  }, [name, method, url, headers, body, contentType]);

  const handleCopyCurl = async () => {
    if (!curlCommand) return;

    try {
      await navigator.clipboard.writeText(curlCommand);
      toast.success('cURL command copied to clipboard');
    } catch (error) {
      console.error('Failed to copy cURL command:', error);
      toast.error('Unable to copy cURL command');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={className} onKeyDown={handleKeyDown}>
      <div className='space-y-5'>
        <div>
          <label className={sectionLabel}>Request Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Enter a name for this request'
          />
        </div>

        <div>
          <label className={sectionLabel}>Method &amp; URL</label>
          <div className='flex items-start gap-3'>
            <div className='w-32 flex-shrink-0'>
              <MethodSelector value={method} onChange={handleMethodChange} />
            </div>
            <div className='flex-1'>
              <UrlInput value={url} onChange={setUrl} />
            </div>
          </div>
        </div>

        <div>
          <AuthEditor headers={headers} onChange={setHeaders} />
        </div>

        <div>
          <label className={sectionLabel}>Headers</label>
          <HeadersEditor headers={headers} onChange={setHeaders} />
        </div>

        {method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS' && (
          <div>
            <label className={sectionLabel}>Body</label>
            <BodyEditor
              body={body}
              onChange={setBody}
              contentType={contentType}
              onContentTypeChange={setContentType}
            />
          </div>
        )}

        <div className='flex flex-col gap-3 pt-2 border-t border-line'>
          <div className='flex flex-wrap gap-2'>
            <Button
              onClick={handleSend}
              disabled={isLoading || !url.trim()}
              className='gap-2'
            >
              <Send className='h-3.5 w-3.5' />
              {isLoading ? 'Sending...' : 'Send Request'}
            </Button>
            {onSave && (
              <Button
                variant='outline'
                onClick={handleSave}
                disabled={!url.trim()}
                className='gap-2'
              >
                <Save className='h-3.5 w-3.5' />
                Save
              </Button>
            )}
            <Button
              variant='outline'
              onClick={handleCopyCurl}
              disabled={!url.trim()}
              className='gap-2'
            >
              <Copy className='h-3.5 w-3.5' />
              Copy cURL
            </Button>
          </div>
          {curlCommand && (
            <div className='bg-card border border-line rounded-md p-3 text-[11px] font-mono overflow-auto'>
              <span className='text-fg-muted'>Generated cURL command</span>
              <pre className='mt-2 whitespace-pre-wrap break-all'>{curlCommand}</pre>
            </div>
          )}
          <span className='self-end text-xs text-fg-faint font-mono'>
            ⌘ + Enter
          </span>
        </div>
      </div>
    </div>
  );
};

export default RequestForm;
