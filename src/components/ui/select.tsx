import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { type SelectHTMLAttributes, forwardRef } from 'react';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className='relative'>
        <select
          className={cn(
            'flex h-11 w-full appearance-none rounded-xl border border-slate-300/50 bg-white/80 backdrop-blur-sm px-4 py-3 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-sm hover:shadow-md',
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className='absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none' />
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };
