import { History, Clock, Play, Trash2 } from 'lucide-react';
import { type ApiRequest, type RequestHistory } from '@/types/api';
import { Button } from './button';

type RequestHistoryProps = {
  requestHistory: RequestHistory[];
  onLoadRequest: (request: ApiRequest) => void;
  onDeleteHistory: (id: string) => void;
};

const RequestHistoryList = ({
  requestHistory,
  onLoadRequest,
  onDeleteHistory,
}: RequestHistoryProps) => {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return 'now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <div className='bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6'>
      <div className='flex items-center gap-2 mb-4'>
        <History className='w-5 h-5 text-indigo-600' />
        <h2 className='text-lg font-semibold text-slate-800'>
          Recent Requests
        </h2>
      </div>
      {requestHistory.length === 0 ? (
        <div className='text-center py-8'>
          <div className='w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3'>
            <History className='w-6 h-6 text-indigo-600' />
          </div>
          <p className='text-slate-500 text-sm'>No recent requests</p>
        </div>
      ) : (
        <div className='space-y-3'>
          {requestHistory.slice(0, 5).map((history) => (
            <div
              key={history.id}
              className='group bg-white/50 hover:bg-white/80 rounded-xl p-3 border border-white/30 transition-all duration-200 hover:shadow-md'
            >
              <div className='flex items-start justify-between gap-3'>
                <div className='flex-1 min-w-0'>
                  <div className='text-sm font-medium text-slate-800 truncate'>
                    {history.request.name}
                  </div>
                  <div className='text-xs text-slate-500 truncate mt-1'>
                    {history.request.url}
                  </div>
                </div>
                <div className='flex items-center gap-2 flex-shrink-0'>
                  <div className='text-xs text-slate-500 bg-slate-100/50 px-2 py-1 rounded-md'>
                    {formatDate(history.timestamp)}
                  </div>
                  <div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => onLoadRequest(history.request)}
                      className='p-1 h-8 w-8 text-indigo-600 hover:bg-indigo-100'
                    >
                      <Play className='h-3 w-3' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => onDeleteHistory(history.id)}
                      className='p-1 h-8 w-8 text-red-600 hover:bg-red-100'
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
