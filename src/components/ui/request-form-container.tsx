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
    <div className='bg-surface border border-line rounded-md p-6'>
      <div className='flex items-center gap-2 mb-5'>
        <Zap className='w-3.5 h-3.5 text-accent' />
        <h2 className='text-xs font-semibold text-fg-muted uppercase tracking-wider'>
          New Request
        </h2>
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
