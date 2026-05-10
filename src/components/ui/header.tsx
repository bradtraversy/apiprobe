import { Zap } from 'lucide-react';
import GitHubLink from './github-link';
import RateLimitSettings from './rate-limit-settings';

const Header = () => {
  return (
    <div className='bg-canvas border-b border-line sticky top-0 z-20'>
      <div className='max-w-[1400px] mx-auto px-6 py-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-9 h-9 bg-card border border-line rounded-md flex items-center justify-center'>
              <Zap className='w-4 h-4 text-accent' />
            </div>
            <div>
              <h1 className='text-lg font-semibold text-fg leading-tight tracking-tight'>
                API Probe
              </h1>
              <p className='text-xs text-fg-muted'>
                Simple &amp; Powerful API Testing
              </p>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <RateLimitSettings />
            <GitHubLink />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
