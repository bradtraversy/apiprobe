import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface SecurityWarningProps {
  className?: string;
}

const SecurityWarning = ({ className }: SecurityWarningProps) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return null;
  }

  return (
    <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
      <div className='flex items-start gap-3'>
        <AlertTriangle className='w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0' />
        <div className='flex-1'>
          <h3 className='text-yellow-800 font-medium text-sm mb-1'>
            Security Notice
          </h3>
          <p className='text-yellow-700 text-xs leading-relaxed'>
            This tool stores API keys, tokens, and request data locally in your browser. 
            Only use on trusted devices and clear browser data regularly to remove sensitive information.
          </p>
        </div>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => setIsDismissed(true)}
          className='text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 p-1 h-6 w-6'
        >
          <X className='w-4 h-4' />
        </Button>
      </div>
    </div>
  );
};

export default SecurityWarning; 