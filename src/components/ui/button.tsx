import { cn } from '@/lib/utils';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-accent text-canvas hover:bg-accent-hover': variant === 'default',
            'bg-card text-fg border border-line hover:bg-card-hover hover:border-line-strong':
              variant === 'outline',
            'text-fg-muted hover:text-fg hover:bg-card': variant === 'ghost',
            'bg-card text-[color:var(--color-method-delete-fg)] border border-line hover:border-[color:var(--color-method-delete-fg)]/40 hover:bg-card-hover':
              variant === 'destructive',
          },
          {
            'h-8 px-3 text-xs': size === 'sm',
            'h-9 px-4 text-sm': size === 'md',
            'h-11 px-6 text-base': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
