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

  // Extract current auth from headers
  useEffect(() => {
    const authHeader = headers['Authorization'] || headers['authorization'];
    if (authHeader) {
      if (authHeader.startsWith('Bearer ')) {
        setAuthType('bearer');
        setToken(authHeader.replace('Bearer ', ''));
      } else if (authHeader.startsWith('Basic ')) {
        setAuthType('basic');
        setToken(authHeader.replace('Basic ', ''));
      } else {
        setAuthType('custom');
        setToken(authHeader);
      }
    } else {
      setAuthType('none');
      setToken('');
    }
  }, [headers]);

  const updateAuth = (type: string, value: string) => {
    const newHeaders = { ...headers };
    
    // Remove existing auth headers
    delete newHeaders['Authorization'];
    delete newHeaders['authorization'];
    
    // Add new auth header
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
      <div className='flex items-center gap-2 mb-3'>
        <Shield className='w-4 h-4 text-slate-600' />
        <label className='text-sm font-medium text-slate-700'>Authorization</label>
      </div>
      
      <div className='space-y-3'>
        <Select
          value={authType}
          onChange={(e) => handleAuthTypeChange(e.target.value)}
          className='w-full'
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
                  ? 'Enter username:password (will be base64 encoded)'
                  : 'Enter your authorization header value'
              }
              className='pr-10'
            />
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => setShowToken(!showToken)}
              className='absolute right-1 top-1/2 -translate-y-1/2 p-1 h-6 w-6'
            >
              {showToken ? (
                <EyeOff className='h-3 w-3 text-slate-500' />
              ) : (
                <Eye className='h-3 w-3 text-slate-500' />
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthEditor; 