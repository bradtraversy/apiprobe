'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, Gauge } from 'lucide-react';
import { getRateLimitStatus } from '@/lib/rate-limit';
import { cn } from '@/lib/utils';

export default function RateLimitSettings() {
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<ReturnType<typeof getRateLimitStatus> | null>(null);

  useEffect(() => {
    setMounted(true);
    setStatus(getRateLimitStatus());
    
    // Update status every second
    const interval = setInterval(() => {
      setStatus(getRateLimitStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Don't render until mounted on client to avoid hydration mismatch
  if (!mounted || !status) {
    return (
      <div className="px-3 py-1.5 rounded-lg border bg-gray-50 text-gray-500 border-gray-200">
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  const used = status.limit - status.remaining;
  const percentage = (status.remaining / status.limit) * 100;
  const isLow = percentage < 30;
  const isExhausted = status.remaining === 0;

  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors",
      isExhausted 
        ? "bg-red-50 text-red-700 border-red-200"
        : isLow 
        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
        : "bg-green-50 text-green-700 border-green-200"
    )}>
      <Gauge className="h-4 w-4" />
      <span className="text-sm font-medium">
        {used}/{status.limit} requests used
      </span>
      {isExhausted && (
        <>
          <AlertCircle className="h-4 w-4" />
          <span className="text-xs">
            Reset in {Math.ceil(status.resetIn / 1000)}s
          </span>
        </>
      )}
    </div>
  );
}