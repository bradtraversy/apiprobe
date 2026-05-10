'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, Gauge } from 'lucide-react';
import { getRateLimitStatus } from '@/lib/rate-limit';
import { cn } from '@/lib/utils';

export default function RateLimitSettings() {
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<ReturnType<
    typeof getRateLimitStatus
  > | null>(null);

  useEffect(() => {
    setMounted(true);
    setStatus(getRateLimitStatus());

    const interval = setInterval(() => {
      setStatus(getRateLimitStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted || !status) {
    return (
      <div className='px-3 py-1.5 rounded-md border border-line bg-card text-fg-muted'>
        <span className='text-xs'>Loading...</span>
      </div>
    );
  }

  const used = status.limit - status.remaining;
  const percentage = (status.remaining / status.limit) * 100;
  const isLow = percentage < 30;
  const isExhausted = status.remaining === 0;

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-md border bg-card transition-colors',
        isExhausted
          ? 'border-[color:var(--color-method-delete-fg)]/30 text-[color:var(--color-method-delete-fg)]'
          : isLow
          ? 'border-[color:var(--color-method-put-fg)]/30 text-[color:var(--color-method-put-fg)]'
          : 'border-line text-fg-muted'
      )}
    >
      <Gauge className='h-3.5 w-3.5' />
      <span className='text-xs font-medium font-mono'>
        {used}/{status.limit} requests
      </span>
      {isExhausted && (
        <>
          <AlertCircle className='h-3.5 w-3.5' />
          <span className='text-xs font-mono'>
            reset {Math.ceil(status.resetIn / 1000)}s
          </span>
        </>
      )}
    </div>
  );
}
