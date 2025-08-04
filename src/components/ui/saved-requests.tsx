import { Bookmark, Play, Trash2 } from 'lucide-react';
import { type ApiRequest } from '@/types/api';
import { Button } from './button';
import { substituteVariables } from '@/lib/variable-substitution';

type SavedRequestsProps = {
  savedRequests: ApiRequest[];
  onLoadRequest: (request: ApiRequest) => void;
  onDeleteRequest: (id: string) => void;
  environmentVariables?: Record<string, string>;
};

const SavedRequests = ({
  savedRequests,
  onLoadRequest,
  onDeleteRequest,
  environmentVariables = {},
}: SavedRequestsProps) => {
  return (
    <div className='bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6'>
      <div className='flex items-center gap-2 mb-4'>
        <Bookmark className='w-5 h-5 text-blue-600' />
        <h2 className='text-lg font-semibold text-slate-800'>Saved Requests</h2>
      </div>
      {savedRequests.length === 0 ? (
        <div className='text-center py-8'>
          <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3'>
            <Bookmark className='w-6 h-6 text-blue-600' />
          </div>
          <p className='text-slate-500 text-sm'>No saved requests yet</p>
        </div>
      ) : (
        <div className='space-y-3'>
          {savedRequests.map((request) => (
            <div
              key={request.id}
              className='group bg-white/50 hover:bg-white/80 rounded-xl p-3 border border-white/30 transition-all duration-200 hover:shadow-md cursor-pointer'
              onClick={() => onLoadRequest(request)}
            >
              <div className='flex items-center justify-between'>
                <div className='flex-1 min-w-0'>
                  <div className='text-sm font-medium text-slate-800 truncate'>
                    {request.name}
                  </div>
                  <div className='text-xs text-slate-500 truncate mt-1'>
                    {substituteVariables(request.url, environmentVariables)}
                  </div>
                </div>
                <div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={(e) => {
                      e.stopPropagation();
                      onLoadRequest(request);
                    }}
                    className='p-1 h-8 w-8 text-blue-600 hover:bg-blue-100'
                  >
                    <Play className='h-3 w-3' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteRequest(request.id);
                    }}
                    className='p-1 h-8 w-8 text-red-600 hover:bg-red-100'
                  >
                    <Trash2 className='h-3 w-3' />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedRequests;
