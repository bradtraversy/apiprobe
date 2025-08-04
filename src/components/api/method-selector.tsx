import { Select } from '@/components/ui/select';
import { type HttpMethod } from '@/types/api';
import { cn } from '@/lib/utils';

interface MethodSelectorProps {
  value: HttpMethod;
  onChange: (method: HttpMethod) => void;
  className?: string;
}

const methodColors: Record<HttpMethod, string> = {
  GET: 'text-emerald-600 bg-emerald-50 border-emerald-200 shadow-emerald-500/20',
  POST: 'text-blue-600 bg-blue-50 border-blue-200 shadow-blue-500/20',
  PUT: 'text-orange-600 bg-orange-50 border-orange-200 shadow-orange-500/20',
  PATCH: 'text-yellow-600 bg-yellow-50 border-yellow-200 shadow-yellow-500/20',
  DELETE: 'text-red-600 bg-red-50 border-red-200 shadow-red-500/20',
  HEAD: 'text-purple-600 bg-purple-50 border-purple-200 shadow-purple-500/20',
  OPTIONS: 'text-slate-600 bg-slate-50 border-slate-200 shadow-slate-500/20',
};

const MethodSelector = ({
  value,
  onChange,
  className,
}: MethodSelectorProps) => {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value as HttpMethod)}
        className='w-full'
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
          'px-4 py-2 text-sm font-semibold rounded-lg border shadow-sm text-center',
          methodColors[value]
        )}
      >
        {value}
      </div>
    </div>
  );
};

export default MethodSelector;
