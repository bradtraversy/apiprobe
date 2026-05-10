import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Trash2, AlertTriangle } from 'lucide-react';
import { clearAllData } from '@/lib/storage';
import { toast } from 'react-hot-toast';

interface SettingsPanelProps {
  onDataCleared: () => void;
  className?: string;
}

const SettingsPanel = ({ onDataCleared, className }: SettingsPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);

  const handleClearAllData = () => {
    clearAllData();
    onDataCleared();
    setShowClearConfirmation(false);
    setIsOpen(false);
    toast.success('Data has been cleared successfully');
  };

  return (
    <div className={className}>
      <Button
        variant='outline'
        size='sm'
        onClick={() => setIsOpen(!isOpen)}
        className='w-full justify-center gap-2'
      >
        <Settings className='w-3.5 h-3.5' />
        Settings
      </Button>

      {isOpen && (
        <div className='mt-3 p-4 bg-surface border border-line rounded-md'>
          <h3 className='text-xs font-semibold text-fg-muted uppercase tracking-wider mb-3'>
            Application Settings
          </h3>

          <div className='space-y-3'>
            <div className='border-t border-line pt-3'>
              <div className='flex items-center gap-2 mb-2'>
                <AlertTriangle className='w-3.5 h-3.5 text-[color:var(--color-method-delete-fg)]' />
                <h4 className='text-sm font-medium text-fg'>Danger Zone</h4>
              </div>

              <p className='text-xs text-fg-muted mb-3'>
                Clear all stored data including requests, history, and
                environment variables.
              </p>

              <Button
                variant='destructive'
                size='sm'
                onClick={() => setShowClearConfirmation(true)}
              >
                <Trash2 className='w-3.5 h-3.5 mr-2' />
                Clear All Data
              </Button>
            </div>
          </div>
        </div>
      )}

      {showClearConfirmation && (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
          <div className='bg-surface border border-line rounded-md p-6 w-full max-w-md'>
            <div className='flex items-center gap-3 mb-4'>
              <AlertTriangle className='w-5 h-5 text-[color:var(--color-method-delete-fg)]' />
              <h3 className='text-base font-semibold text-fg'>
                Clear All Data
              </h3>
            </div>

            <p className='text-sm text-fg-muted mb-3'>
              This will permanently delete all your:
            </p>

            <ul className='text-sm text-fg-muted mb-4 space-y-1 list-disc list-inside'>
              <li>Saved requests</li>
              <li>Request history</li>
              <li>Environment variables</li>
              <li>All application settings</li>
            </ul>

            <p className='text-xs text-[color:var(--color-method-delete-fg)] mb-5 font-medium'>
              This action cannot be undone.
            </p>

            <div className='flex gap-2 justify-end'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowClearConfirmation(false)}
              >
                Cancel
              </Button>
              <Button
                variant='destructive'
                size='sm'
                onClick={handleClearAllData}
              >
                <Trash2 className='w-3.5 h-3.5 mr-2' />
                Clear All Data
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPanel;
