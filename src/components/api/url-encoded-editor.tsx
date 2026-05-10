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

  const updateBody = (newPairs: KeyValuePair[]) => {
    const validPairs = newPairs.filter((pair) => pair.key.trim() !== '');
    const params = new URLSearchParams();
    validPairs.forEach((pair) => {
      params.append(pair.key.trim(), pair.value);
    });
    onChange(params.toString());
  };

  const addPair = () => {
    setPairs([...pairs, { key: '', value: '' }]);
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
      <div className='space-y-2'>
        {pairs.map((pair, index) => (
          <div key={index} className='flex items-center gap-2'>
            <Input
              value={pair.key}
              onChange={(e) => updatePair(index, 'key', e.target.value)}
              placeholder='Key'
              className='flex-1 font-mono text-xs'
            />
            <Input
              value={pair.value}
              onChange={(e) => updatePair(index, 'value', e.target.value)}
              placeholder='Value'
              className='flex-1 font-mono text-xs'
            />
            {pairs.length > 1 && (
              <Button
                variant='ghost'
                size='sm'
                aria-label='Remove field'
                onClick={() => removePair(index)}
                className='h-9 w-9 p-0 text-fg-muted hover:text-[color:var(--color-method-delete-fg)]'
              >
                <Trash2 className='w-3.5 h-3.5' />
              </Button>
            )}
          </div>
        ))}
        <Button
          variant='outline'
          size='sm'
          onClick={addPair}
          className='gap-2'
        >
          <Plus className='w-3 h-3' />
          Add Field
        </Button>
      </div>
    </div>
  );
};

export default UrlEncodedEditor;
