import { History, Play, Trash2 } from 'lucide-react';
import { type ApiRequest, type RequestHistory } from '@/types/api';
import { Button } from './button';
import { substituteVariables } from '@/lib/variable-substitution';

type RequestHistoryProps = {
  requestHistory: RequestHistory[];
  onLoadRequest: (request: ApiRequest) => void;
  onDeleteHistory: (id: string) => void;
  environmentVariables?: Record<string, string>;
};

const RequestHistoryList = ({
  requestHistory,
  onLoadRequest,
  onDeleteHistory,
  environmentVariables = {},
}: RequestHistoryProps) => {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );
    if (diffInHours < 1) return 'now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className='bg-surface border border-line rounded-md p-5'>
      <div className='flex items-center gap-2 mb-4'>
        <History className='w-3.5 h-3.5 text-fg-muted' />
        <h2 className='text-xs font-semibold text-fg-muted uppercase tracking-wider'>
          Recent Requests
        </h2>
      </div>
      {requestHistory.length === 0 ? (
        <p className='text-sm text-fg-faint italic'>No recent requests</p>
      ) : (
        <div className='space-y-2'>
          {requestHistory.slice(0, 5).map((history) => (
            <div
              key={history.id}
              className='group bg-card hover:bg-card-hover border border-line hover:border-line-strong rounded-md p-3 transition-colors duration-150'
            >
              <div className='flex items-start justify-between gap-2'>
                <div className='flex-1 min-w-0'>
                  <div className='text-sm font-medium text-fg truncate'>
                    {history.request.name}
                  </div>
                  <div className='text-xs text-fg-muted truncate mt-0.5 font-mono'>
                    {substituteVariables(
                      history.request.url,
                      environmentVariables
                    )}
                  </div>
                </div>
                <div className='flex items-center gap-1 flex-shrink-0'>
                  <span className='text-[10px] text-fg-faint font-mono'>
                    {formatDate(history.timestamp)}
                  </span>
                  <div className='flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity'>
                    <Button
                      variant='ghost'
                      size='sm'
                      aria-label={`Load request ${history.request.name}`}
                      onClick={() => onLoadRequest(history.request)}
                      className='p-1 h-7 w-7 text-accent hover:text-accent-hover'
                    >
                      <Play className='h-3 w-3' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      aria-label={`Delete history item ${history.request.name}`}
                      onClick={() => onDeleteHistory(history.id)}
                      className='p-1 h-7 w-7 text-fg-muted hover:text-[color:var(--color-method-delete-fg)]'
                    >
                      <Trash2 className='h-3 w-3' />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestHistoryList;
