import { type ApiResponse } from '@/types/api';
import ResponseViewer from '@/components/api/response-viewer';

type ResponseViewerContainerProps = {
  response: ApiResponse | null;
};

const ResponseViewerContainer = ({
  response,
}: ResponseViewerContainerProps) => {
  return (
    <div className='bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8'>
      <div className='flex items-center gap-3 mb-6'>
        <div className='w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center'>
          <div className='w-2 h-2 bg-white rounded-full'></div>
        </div>
        <h2 className='text-xl font-semibold text-slate-800'>Response</h2>
      </div>
      <ResponseViewer response={response} />
    </div>
  );
};

export default ResponseViewerContainer;
