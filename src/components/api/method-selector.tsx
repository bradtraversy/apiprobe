import { Select } from '@/components/ui/select';
import { type HttpMethod } from '@/types/api';
import { cn } from '@/lib/utils';

interface MethodSelectorProps {
  value: HttpMethod;
  onChange: (method: HttpMethod) => void;
  className?: string;
}

const methodColors: Record<HttpMethod, string> = {
  GET: 'bg-[color:var(--color-method-get-bg)] text-[color:var(--color-method-get-fg)]',
  POST: 'bg-[color:var(--color-method-post-bg)] text-[color:var(--color-method-post-fg)]',
  PUT: 'bg-[color:var(--color-method-put-bg)] text-[color:var(--color-method-put-fg)]',
  PATCH:
    'bg-[color:var(--color-method-patch-bg)] text-[color:var(--color-method-patch-fg)]',
  DELETE:
    'bg-[color:var(--color-method-delete-bg)] text-[color:var(--color-method-delete-fg)]',
  HEAD: 'bg-[color:var(--color-method-head-bg)] text-[color:var(--color-method-head-fg)]',
  OPTIONS:
    'bg-[color:var(--color-method-options-bg)] text-[color:var(--color-method-options-fg)]',
};

const MethodSelector = ({
  value,
  onChange,
  className,
}: MethodSelectorProps) => {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value as HttpMethod)}
        className='w-full font-mono text-xs'
      >
        <option value='GET'>GET</option>
        <option value='POST'>POST</option>
        <option value='PUT'>PUT</option>
        <option value='PATCH'>PATCH</option>
        <option value='DELETE'>DELETE</option>
        <option value='HEAD'>HEAD</option>
        <option value='OPTIONS'>OPTIONS</option>
      </Select>
      <div
        className={cn(
          'px-3 py-1 text-[11px] font-mono font-semibold tracking-wider rounded-sm text-center uppercase',
          methodColors[value]
        )}
      >
        {value}
      </div>
    </div>
  );
};

export default MethodSelector;
