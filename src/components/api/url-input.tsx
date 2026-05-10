import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface UrlInputProps {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  className?: string;
}

const UrlInput = ({
  value,
  onChange,
  placeholder = 'Enter URL...',
  className,
}: UrlInputProps) => {
  const isValidUrl = (url: string) => {
    if (url.includes('{{')) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const valid = !value || isValidUrl(value);

  return (
    <div className='relative'>
      <Input
        type='url'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'pr-9 font-mono',
          !valid && 'border-[color:var(--color-method-delete-fg)]/50',
          className
        )}
      />
      {value && (
        <div className='absolute right-3 top-1/2 -translate-y-1/2'>
          <div
            className={cn(
              'w-1.5 h-1.5 rounded-full',
              valid
                ? 'bg-accent'
                : 'bg-[color:var(--color-method-delete-fg)]'
            )}
            title={valid ? 'Valid URL' : 'Invalid URL'}
          />
        </div>
      )}
    </div>
  );
};

export default UrlInput;
