import { History, Clock } from 'lucide-react';
import { type ApiRequest, type RequestHistory } from '@/types/api';

type RequestHistoryProps = {
  requestHistory: RequestHistory[];
  onLoadRequest: (request: ApiRequest) => void;
};

const RequestHistoryList = ({
  requestHistory,
  onLoadRequest,
}: RequestHistoryProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
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
              className='group bg-white/50 hover:bg-white/80 rounded-xl p-3 border border-white/30 transition-all duration-200 hover:shadow-md cursor-pointer'
              onClick={() => onLoadRequest(history.request)}
            >
              <div className='flex items-center justify-between'>
                <div className='flex-1 min-w-0'>
                  <div className='text-sm font-medium text-slate-800 truncate'>
                    {history.request.name}
                  </div>
                  <div className='text-xs text-slate-500 truncate mt-1'>
                    {history.request.url}
                  </div>
                </div>
                <div className='flex items-center gap-1 text-xs text-slate-500'>
                  <Clock className='h-3 w-3' />
                  {formatDate(history.timestamp)}
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
