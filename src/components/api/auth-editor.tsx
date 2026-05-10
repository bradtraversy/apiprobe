import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Shield, Eye, EyeOff } from 'lucide-react';

interface AuthEditorProps {
  headers: Record<string, string>;
  onChange: (headers: Record<string, string>) => void;
  className?: string;
}

const AuthEditor = ({ headers, onChange, className }: AuthEditorProps) => {
  const [authType, setAuthType] = useState('none');
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);

  const authHeader =
    headers['Authorization'] || headers['authorization'] || '';

  useEffect(() => {
    if (authHeader.startsWith('Bearer ')) {
      setAuthType('bearer');
      setToken(authHeader.replace('Bearer ', ''));
    } else if (authHeader.startsWith('Basic ')) {
      setAuthType('basic');
      setToken(authHeader.replace('Basic ', ''));
    } else if (authHeader) {
      setAuthType('custom');
      setToken(authHeader);
    } else {
      setAuthType('none');
      setToken('');
    }
  }, [authHeader]);

  const updateAuth = (type: string, value: string) => {
    const newHeaders = { ...headers };
    delete newHeaders['Authorization'];
    delete newHeaders['authorization'];

    if (type === 'bearer' && value.trim()) {
      newHeaders['Authorization'] = `Bearer ${value.trim()}`;
    } else if (type === 'basic' && value.trim()) {
      newHeaders['Authorization'] = `Basic ${value.trim()}`;
    } else if (type === 'custom' && value.trim()) {
      newHeaders['Authorization'] = value.trim();
    }

    onChange(newHeaders);
  };

  const handleAuthTypeChange = (type: string) => {
    setAuthType(type);
    if (type === 'none') {
      updateAuth('none', '');
      setToken('');
    }
  };

  const handleTokenChange = (value: string) => {
    setToken(value);
    updateAuth(authType, value);
  };

  return (
    <div className={className}>
      <div className='flex items-center gap-2 mb-2'>
        <Shield className='w-3.5 h-3.5 text-fg-muted' />
        <label className='text-xs font-semibold text-fg-muted uppercase tracking-wider'>
          Authorization
        </label>
      </div>

      <div className='space-y-2'>
        <Select
          value={authType}
          onChange={(e) => handleAuthTypeChange(e.target.value)}
          className='w-full text-xs'
        >
          <option value='none'>No Auth</option>
          <option value='bearer'>Bearer Token</option>
          <option value='basic'>Basic Auth</option>
          <option value='custom'>Custom</option>
        </Select>

        {authType !== 'none' && (
          <div className='relative'>
            <Input
              type={showToken ? 'text' : 'password'}
              value={token}
              onChange={(e) => handleTokenChange(e.target.value)}
              placeholder={
                authType === 'bearer'
                  ? 'Enter your bearer token'
                  : authType === 'basic'
                  ? 'username:password (will be base64 encoded)'
                  : 'authorization header value'
              }
              className='pr-9 font-mono text-xs'
            />
            <Button
              type='button'
              variant='ghost'
              size='sm'
              aria-label={showToken ? 'Hide token' : 'Show token'}
              onClick={() => setShowToken(!showToken)}
              className='absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0'
            >
              {showToken ? (
                <EyeOff className='h-3 w-3' />
              ) : (
                <Eye className='h-3 w-3' />
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthEditor;
