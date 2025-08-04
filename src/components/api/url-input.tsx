import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface UrlInputProps {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  className?: string;
}

const UrlInput = ({ value, onChange, placeholder = 'Enter URL...', className }: UrlInputProps) => {
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="relative">
      <Input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'pr-10',
          value && !isValidUrl(value) && 'border-red-500 focus-visible:ring-red-500',
          className,
        )}
      />
      {value && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isValidUrl(value) ? (
            <div className="w-4 h-4 bg-green-500 rounded-full" title="Valid URL" />
          ) : (
            <div className="w-4 h-4 bg-red-500 rounded-full" title="Invalid URL" />
          )}
        </div>
      )}
    </div>
  );
};

export default UrlInput; 