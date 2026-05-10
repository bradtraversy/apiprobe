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
        <label className='text-xs font-semibold text-fg-muted uppercase tracking-wider'>
          Content-Type
        </label>
        <Select
          value={contentType}
          onChange={(e) => onContentTypeChange(e.target.value)}
          className='w-56 text-xs font-mono'
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
            type='button'
            onClick={formatJson}
            className='text-xs text-accent hover:text-accent-hover transition-colors'
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
              ? '{ "key": "value" }'
              : contentType === 'application/xml'
              ? '<root><item>value</item></root>'
              : 'Enter request body...'
          }
          className='min-h-[180px] font-mono text-xs'
        />
      )}
    </div>
  );
};

export default BodyEditor;
