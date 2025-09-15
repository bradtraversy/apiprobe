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

    toast.success('Data has been cleared successfully!');
  };

  return (
    <div className={className}>
      <Button
        variant='outline'
        size='sm'
        onClick={() => setIsOpen(!isOpen)}
        className='w-full justify-center gap-2'
      >
        <Settings className='w-4 h-4' />
        Settings
      </Button>

      {isOpen && (
        <div className='mt-3 p-4 bg-white border border-slate-200 rounded-lg shadow-sm'>
          <h3 className='text-sm font-medium text-slate-700 mb-3'>
            Application Settings
          </h3>

          <div className='space-y-3'>
            {/* Clear All Data Section */}
            <div className='border-t border-slate-100 pt-3'>
              <div className='flex items-center gap-2 mb-2'>
                <AlertTriangle className='w-4 h-4 text-red-500' />
                <h4 className='text-sm font-medium text-slate-700'>
                  Danger Zone
                </h4>
              </div>

              <p className='text-xs text-slate-600 mb-3'>
                Clear all stored data including requests, history, and
                environment variables.
              </p>

              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowClearConfirmation(true)}
                className='text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300'
              >
                <Trash2 className='w-4 h-4 mr-2' />
                Clear All Data
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Confirmation Modal */}
      {showClearConfirmation && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md'>
            <div className='flex items-center gap-3 mb-4'>
              <AlertTriangle className='w-6 h-6 text-red-500' />
              <h3 className='text-lg font-semibold text-slate-800'>
                Clear All Data
              </h3>
            </div>

            <p className='text-sm text-slate-600 mb-6'>
              This will permanently delete all your:
            </p>

            <ul className='text-sm text-slate-600 mb-6 space-y-1'>
              <li>• Saved requests</li>
              <li>• Request history</li>
              <li>• Environment variables</li>
              <li>• All application settings</li>
            </ul>

            <p className='text-sm text-red-600 mb-6 font-medium'>
              This action cannot be undone!
            </p>

            <div className='flex gap-3'>
              <Button
                variant='outline'
                onClick={() => setShowClearConfirmation(false)}
                className='flex-1'
              >
                Cancel
              </Button>
              <Button
                onClick={handleClearAllData}
                className='flex-1 bg-red-600 hover:bg-red-700'
              >
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
