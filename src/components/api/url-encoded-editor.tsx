import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';

interface KeyValuePair {
  key: string;
  value: string;
}

interface UrlEncodedEditorProps {
  body: string;
  onChange: (body: string) => void;
  className?: string;
}

const UrlEncodedEditor = ({
  body,
  onChange,
  className,
}: UrlEncodedEditorProps) => {
  const [pairs, setPairs] = useState<KeyValuePair[]>([{ key: '', value: '' }]);

  // Convert body string to key-value pairs
  useEffect(() => {
    if (body.trim()) {
      try {
        const params = new URLSearchParams(body);
        const newPairs: KeyValuePair[] = [];
        params.forEach((value, key) => {
          newPairs.push({ key, value });
        });
        if (newPairs.length > 0) {
          setPairs([...newPairs, { key: '', value: '' }]);
        } else {
          setPairs([{ key: '', value: '' }]);
        }
      } catch {
        setPairs([{ key: '', value: '' }]);
      }
    } else {
      setPairs([{ key: '', value: '' }]);
    }
  }, [body]);

  // Convert key-value pairs to body string
  const updateBody = (newPairs: KeyValuePair[]) => {
    const validPairs = newPairs.filter((pair) => pair.key.trim() !== '');
    const params = new URLSearchParams();
    validPairs.forEach((pair) => {
      params.append(pair.key.trim(), pair.value);
    });
    onChange(params.toString());
  };

  const addPair = () => {
    const newPairs = [...pairs, { key: '', value: '' }];
    setPairs(newPairs);
  };

  const removePair = (index: number) => {
    const newPairs = pairs.filter((_, i) => i !== index);
    setPairs(newPairs);
    updateBody(newPairs);
  };

  const updatePair = (index: number, field: 'key' | 'value', value: string) => {
    const newPairs = [...pairs];
    newPairs[index][field] = value;
    setPairs(newPairs);
    updateBody(newPairs);
  };

  return (
    <div className={className}>
      <div className='space-y-3'>
        {pairs.map((pair, index) => (
          <div key={index} className='flex items-center gap-2'>
            <div className='flex-1'>
              <Input
                value={pair.key}
                onChange={(e) => updatePair(index, 'key', e.target.value)}
                placeholder='Key'
                className='text-sm'
              />
            </div>
            <div className='flex-1'>
              <Input
                value={pair.value}
                onChange={(e) => updatePair(index, 'value', e.target.value)}
                placeholder='Value'
                className='text-sm'
              />
            </div>
            {pairs.length > 1 && (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => removePair(index)}
                className='p-1 h-8 w-8 text-red-600 hover:bg-red-100'
              >
                <Trash2 className='h-3 w-3' />
              </Button>
            )}
          </div>
        ))}
        <Button
          variant='outline'
          size='sm'
          onClick={addPair}
          className='flex items-center gap-2 text-blue-600 hover:bg-blue-50'
        >
          <Plus className='h-3 w-3' />
          Add Field
        </Button>
      </div>
    </div>
  );
};

export default UrlEncodedEditor;
