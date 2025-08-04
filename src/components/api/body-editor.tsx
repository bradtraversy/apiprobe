import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import UrlEncodedEditor from './url-encoded-editor';

interface BodyEditorProps {
  body: string;
  onChange: (body: string) => void;
  contentType: string;
  onContentTypeChange: (contentType: string) => void;
  className?: string;
}

const BodyEditor = ({
  body,
  onChange,
  contentType,
  onContentTypeChange,
  className,
}: BodyEditorProps) => {
  const formatJson = () => {
    try {
      const parsed = JSON.parse(body);
      onChange(JSON.stringify(parsed, null, 2));
    } catch {
      // If not valid JSON, don't format
    }
  };

  return (
    <div className={className}>
      <div className='flex items-center gap-2 mb-2'>
        <label className='text-sm font-medium'>Content-Type:</label>
        <Select
          value={contentType}
          onChange={(e) => onContentTypeChange(e.target.value)}
          className='w-48'
        >
          <option value='application/json'>application/json</option>
          <option value='application/xml'>application/xml</option>
          <option value='text/plain'>text/plain</option>
          <option value='application/x-www-form-urlencoded'>
            application/x-www-form-urlencoded
          </option>
        </Select>
        {contentType === 'application/json' && (
          <button
            onClick={formatJson}
            className='text-xs text-blue-600 hover:text-blue-800'
          >
            Format JSON
          </button>
        )}
      </div>
      {contentType === 'application/x-www-form-urlencoded' ? (
        <UrlEncodedEditor body={body} onChange={onChange} />
      ) : (
        <Textarea
          value={body}
          onChange={(e) => onChange(e.target.value)}
          placeholder={
            contentType === 'application/json'
              ? '{"key": "value"}'
              : contentType === 'application/xml'
              ? '<root><item>value</item></root>'
              : 'Enter request body...'
          }
          className='min-h-[200px] font-mono text-sm'
        />
      )}
    </div>
  );
};

export default BodyEditor;
