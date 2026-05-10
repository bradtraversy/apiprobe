import { type ApiResponse } from '@/types/api';
import ResponseViewer from '@/components/api/response-viewer';

type ResponseViewerContainerProps = {
  response: ApiResponse | null;
};

const ResponseViewerContainer = ({
  response,
}: ResponseViewerContainerProps) => {
  return (
    <div className='bg-surface border border-line rounded-md p-6'>
      <div className='flex items-center gap-2 mb-5'>
        <div className='w-1.5 h-1.5 bg-accent rounded-full' />
        <h2 className='text-xs font-semibold text-fg-muted uppercase tracking-wider'>
          Response
        </h2>
      </div>
      <ResponseViewer response={response} />
    </div>
  );
};

export default ResponseViewerContainer;
