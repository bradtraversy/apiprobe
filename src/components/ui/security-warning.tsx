import { AlertTriangle, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  isSecurityWarningDismissed,
  setSecurityWarningDismissed,
} from '@/lib/storage';

interface SecurityWarningProps {
  className?: string;
}

const SecurityWarning = ({ className }: SecurityWarningProps) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const dismissed = isSecurityWarningDismissed();
    setIsDismissed(dismissed);
    setIsLoading(false);
  }, []);

  if (isLoading || isDismissed) {
    return null;
  }

  return (
    <div
      className={`bg-surface border border-line border-l-[3px] border-l-[color:var(--color-method-put-fg)] rounded-md p-4 ${
        className ?? ''
      }`}
    >
      <div className='flex items-start gap-3'>
        <AlertTriangle className='w-4 h-4 text-[color:var(--color-method-put-fg)] mt-0.5 flex-shrink-0' />
        <div className='flex-1'>
          <h3 className='text-fg font-medium text-sm mb-1'>Security Notice</h3>
          <p className='text-fg-muted text-xs leading-relaxed'>
            This tool stores API keys, tokens, and request data locally in your
            browser. Only use on trusted devices and clear browser data
            regularly to remove sensitive information.
          </p>
        </div>
        <Button
          variant='ghost'
          size='sm'
          aria-label='Dismiss security warning'
          onClick={() => {
            setIsDismissed(true);
            setSecurityWarningDismissed();
          }}
          className='h-6 w-6 p-0'
        >
          <X className='w-3.5 h-3.5' />
        </Button>
      </div>
    </div>
  );
};

export default SecurityWarning;
