import { Zap } from 'lucide-react';

const Header = () => {
  return (
    <div className='bg-white/80 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-10'>
      <div className='container mx-auto px-6 py-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg'>
              <Zap className='w-6 h-6 text-white' />
            </div>
            <div>
              <h1 className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
                API Probe
              </h1>
              <p className='text-sm text-slate-600'>
                Simple & Powerful API Testing
              </p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <div className='px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium'>
              Ready
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
