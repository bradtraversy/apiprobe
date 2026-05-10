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
            'flex h-9 w-full appearance-none rounded-md border border-line bg-card px-3 pr-9 py-2 text-sm text-fg',
            'focus-visible:outline-none focus-visible:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent/20',
            'disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-150',
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted pointer-events-none' />
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };
