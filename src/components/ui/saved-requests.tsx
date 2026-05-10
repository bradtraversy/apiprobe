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
    <div className='bg-surface border border-line rounded-md p-5'>
      <div className='flex items-center gap-2 mb-4'>
        <Bookmark className='w-3.5 h-3.5 text-fg-muted' />
        <h2 className='text-xs font-semibold text-fg-muted uppercase tracking-wider'>
          Saved Requests
        </h2>
      </div>
      {savedRequests.length === 0 ? (
        <p className='text-sm text-fg-faint italic'>No saved requests yet</p>
      ) : (
        <div className='space-y-2'>
          {savedRequests.map((request) => (
            <div
              key={request.id}
              className='group bg-card hover:bg-card-hover border border-line hover:border-line-strong rounded-md p-3 transition-colors duration-150 cursor-pointer'
              onClick={() => onLoadRequest(request)}
            >
              <div className='flex items-center justify-between gap-2'>
                <div className='flex-1 min-w-0'>
                  <div className='text-sm font-medium text-fg truncate'>
                    {request.name}
                  </div>
                  <div className='text-xs text-fg-muted truncate mt-0.5 font-mono'>
                    {substituteVariables(request.url, environmentVariables)}
                  </div>
                </div>
                <div className='flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity'>
                  <Button
                    variant='ghost'
                    size='sm'
                    aria-label={`Load request ${request.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onLoadRequest(request);
                    }}
                    className='p-1 h-7 w-7 text-accent hover:text-accent-hover'
                  >
                    <Play className='h-3 w-3' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    aria-label={`Delete request ${request.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteRequest(request.id);
                    }}
                    className='p-1 h-7 w-7 text-fg-muted hover:text-[color:var(--color-method-delete-fg)]'
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
