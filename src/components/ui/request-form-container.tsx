import { Zap } from 'lucide-react';
import { type ApiRequest } from '@/types/api';
import RequestForm from '@/components/api/request-form';

type RequestFormContainerProps = {
  onSend: (request: ApiRequest) => Promise<void>;
  onSave: (request: ApiRequest) => void;
  initialRequest?: ApiRequest;
};

const RequestFormContainer = ({
  onSend,
  onSave,
  initialRequest,
}: RequestFormContainerProps) => {
  return (
    <div className='bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8'>
      <div className='flex items-center gap-3 mb-6'>
        <div className='w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center'>
          <Zap className='w-4 h-4 text-white' />
        </div>
        <h2 className='text-xl font-semibold text-slate-800'>New Request</h2>
      </div>
      <RequestForm
        onSend={onSend}
        onSave={onSave}
        initialRequest={initialRequest}
      />
    </div>
  );
};

export default RequestFormContainer;
