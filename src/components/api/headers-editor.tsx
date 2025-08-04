import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';

interface HeadersEditorProps {
  headers: Record<string, string>;
  onChange: (headers: Record<string, string>) => void;
  className?: string;
}

const HeadersEditor = ({
  headers,
  onChange,
  className,
}: HeadersEditorProps) => {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const addHeader = () => {
    if (
      newKey.trim() &&
      newValue.trim() &&
      newKey.toLowerCase() !== 'authorization'
    ) {
      onChange({ ...headers, [newKey.trim()]: newValue.trim() });
      setNewKey('');
      setNewValue('');
    }
  };

  const removeHeader = (key: string) => {
    const newHeaders = { ...headers };
    delete newHeaders[key];
    onChange(newHeaders);
  };

  const updateHeader = (key: string, value: string) => {
    onChange({ ...headers, [key]: value });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addHeader();
    }
  };

  return (
    <div className={className}>
      <div className='space-y-2'>
        {Object.entries(headers)
          .filter(([key]) => key.toLowerCase() !== 'authorization')
          .map(([key, value]) => (
            <div key={key} className='flex gap-2'>
              <Input
                value={key}
                onChange={(e) => {
                  const newHeaders = { ...headers };
                  delete newHeaders[key];
                  newHeaders[e.target.value] = value;
                  onChange(newHeaders);
                }}
                placeholder='Header name'
                className='flex-1'
              />
              <Input
                value={value}
                onChange={(e) => updateHeader(key, e.target.value)}
                placeholder='Header value'
                className='flex-1'
              />
              <Button
                variant='ghost'
                size='sm'
                onClick={() => removeHeader(key)}
                className='px-2'
              >
                <X className='h-4 w-4' />
              </Button>
            </div>
          ))}

        <div className='flex gap-2'>
          <Input
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder='Header name'
            className='flex-1'
            onKeyPress={handleKeyPress}
          />
          <Input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder='Header value'
            className='flex-1'
            onKeyPress={handleKeyPress}
          />
          <Button
            variant='outline'
            size='sm'
            onClick={addHeader}
            disabled={!newKey.trim() || !newValue.trim()}
            className='px-2'
          >
            <Plus className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeadersEditor;
