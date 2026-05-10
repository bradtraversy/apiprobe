import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { isValidVariableName, isValidVariableValue } from '@/lib/validation';
import {
  Settings,
  Plus,
  Trash2,
  Save,
  X,
  Globe,
  ChevronDown,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Environment {
  id: string;
  name: string;
  variables: Record<string, string>;
}

interface EnvironmentManagerProps {
  environments: Environment[];
  currentEnvironment: string;
  onEnvironmentsChange: (environments: Environment[]) => void;
  onCurrentEnvironmentChange: (environmentId: string) => void;
  className?: string;
}

const EnvironmentManager = ({
  environments,
  currentEnvironment,
  onEnvironmentsChange,
  onCurrentEnvironmentChange,
  className,
}: EnvironmentManagerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingEnvironment, setEditingEnvironment] =
    useState<Environment | null>(null);
  const [newEnvName, setNewEnvName] = useState('');
  const [newVarKey, setNewVarKey] = useState('');
  const [newVarValue, setNewVarValue] = useState('');

  const currentEnv = environments.find((env) => env.id === currentEnvironment);

  const addEnvironment = () => {
    if (newEnvName.trim()) {
      const newEnv: Environment = {
        id: crypto.randomUUID(),
        name: newEnvName.trim(),
        variables: {},
      };
      onEnvironmentsChange([...environments, newEnv]);
      setNewEnvName('');
      onCurrentEnvironmentChange(newEnv.id);
    }
  };

  const deleteEnvironment = (id: string) => {
    const newEnvironments = environments.filter((env) => env.id !== id);
    onEnvironmentsChange(newEnvironments);

    if (newEnvironments.length > 0) {
      onCurrentEnvironmentChange(newEnvironments[0].id);
    } else {
      const defaultEnv: Environment = {
        id: crypto.randomUUID(),
        name: 'Default',
        variables: {},
      };
      onEnvironmentsChange([defaultEnv]);
      onCurrentEnvironmentChange(defaultEnv.id);
    }
    setEditingEnvironment(null);
  };

  const updateEnvironment = (updatedEnv: Environment) => {
    const newEnvironments = environments.map((env) =>
      env.id === updatedEnv.id ? updatedEnv : env
    );
    onEnvironmentsChange(newEnvironments);
  };

  return (
    <div
      className={`bg-surface border border-line rounded-md p-5 ${
        className ?? ''
      }`}
    >
      <div className='flex items-center gap-2 mb-3'>
        <Globe className='w-3.5 h-3.5 text-fg-muted' />
        <h2 className='text-xs font-semibold text-fg-muted uppercase tracking-wider'>
          Environment
        </h2>
      </div>

      <div className='relative'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => setIsOpen(!isOpen)}
          className='w-full justify-between'
        >
          <span className='flex items-center gap-2'>
            <Globe className='w-3.5 h-3.5 text-fg-muted' />
            {currentEnv?.name || 'No Environment'}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </Button>

        {isOpen && (
          <div className='absolute top-full left-0 right-0 mt-1 bg-surface border border-line rounded-md shadow-lg z-10 max-h-60 overflow-y-auto'>
            {environments.map((env) => (
              <div
                key={env.id}
                className='flex items-center justify-between px-3 py-2 hover:bg-card-hover cursor-pointer text-sm text-fg'
                onClick={() => {
                  onCurrentEnvironmentChange(env.id);
                  setIsOpen(false);
                }}
              >
                <span>{env.name}</span>
                {env.id === currentEnvironment && (
                  <div className='w-1.5 h-1.5 bg-accent rounded-full' />
                )}
              </div>
            ))}
            <div className='border-t border-line p-2'>
              <div className='flex items-center gap-2'>
                <Input
                  value={newEnvName}
                  onChange={(e) => setNewEnvName(e.target.value)}
                  placeholder='New environment'
                  className='flex-1 h-8 text-xs'
                  onKeyDown={(e) => e.key === 'Enter' && addEnvironment()}
                />
                <Button
                  size='sm'
                  aria-label='Add environment'
                  onClick={addEnvironment}
                  disabled={!newEnvName.trim()}
                  className='h-8 w-8 p-0'
                >
                  <Plus className='w-3 h-3' />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {currentEnv && (
        <div className='mt-4 space-y-2'>
          <div className='flex items-center justify-between'>
            <h4 className='text-[10px] font-semibold text-fg-faint uppercase tracking-wider'>
              Variables
            </h4>
            <Button
              variant='ghost'
              size='sm'
              aria-label='Edit environment'
              onClick={() => setEditingEnvironment(currentEnv)}
              className='h-6 w-6 p-0'
            >
              <Settings className='w-3 h-3' />
            </Button>
          </div>

          <div className='space-y-1.5'>
            {Object.entries(currentEnv.variables).map(([key, value]) => (
              <div key={key} className='flex items-center gap-2 text-xs'>
                <span className='font-mono bg-card border border-line px-1.5 py-0.5 rounded text-accent'>
                  {`{{${key}}}`}
                </span>
                <span className='text-fg-faint'>→</span>
                <span className='font-mono text-fg-muted truncate'>
                  {value}
                </span>
              </div>
            ))}
            {Object.keys(currentEnv.variables).length === 0 && (
              <p className='text-xs text-fg-faint italic'>
                No variables defined
              </p>
            )}
          </div>
        </div>
      )}

      {editingEnvironment && (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
          <div className='bg-surface border border-line rounded-md p-6 w-full max-w-md max-h-[80vh] overflow-y-auto'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-base font-semibold text-fg'>
                Edit Environment
              </h3>
              <Button
                variant='ghost'
                size='sm'
                aria-label='Close'
                onClick={() => setEditingEnvironment(null)}
                className='h-6 w-6 p-0'
              >
                <X className='w-3.5 h-3.5' />
              </Button>
            </div>

            <div className='space-y-4'>
              <div>
                <label className='block text-xs font-semibold text-fg-muted uppercase tracking-wider mb-2'>
                  Environment Name
                </label>
                <Input
                  value={editingEnvironment.name}
                  onChange={(e) =>
                    setEditingEnvironment({
                      ...editingEnvironment,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className='block text-xs font-semibold text-fg-muted uppercase tracking-wider mb-2'>
                  Variables
                </label>
                <div className='space-y-2'>
                  {Object.entries(editingEnvironment.variables).map(
                    ([key, value]) => (
                      <div key={key} className='flex gap-2'>
                        <Input
                          value={key}
                          onChange={(e) => {
                            const newVariables = {
                              ...editingEnvironment.variables,
                            };
                            delete newVariables[key];
                            newVariables[e.target.value] = value;
                            setEditingEnvironment({
                              ...editingEnvironment,
                              variables: newVariables,
                            });
                          }}
                          placeholder='Variable name'
                          className='flex-1 font-mono text-xs'
                        />
                        <Input
                          value={value}
                          onChange={(e) => {
                            const newVariables = {
                              ...editingEnvironment.variables,
                            };
                            newVariables[key] = e.target.value;
                            setEditingEnvironment({
                              ...editingEnvironment,
                              variables: newVariables,
                            });
                          }}
                          placeholder='Variable value'
                          className='flex-1 font-mono text-xs'
                        />
                        <Button
                          variant='ghost'
                          size='sm'
                          aria-label={`Remove variable ${key}`}
                          onClick={() => {
                            const newVariables = {
                              ...editingEnvironment.variables,
                            };
                            delete newVariables[key];
                            setEditingEnvironment({
                              ...editingEnvironment,
                              variables: newVariables,
                            });
                          }}
                          className='h-9 w-9 p-0 text-fg-muted hover:text-[color:var(--color-method-delete-fg)]'
                        >
                          <Trash2 className='w-3.5 h-3.5' />
                        </Button>
                      </div>
                    )
                  )}

                  <div className='flex gap-2 pt-1'>
                    <Input
                      value={newVarKey}
                      onChange={(e) => setNewVarKey(e.target.value)}
                      placeholder='Variable name'
                      className='flex-1 font-mono text-xs'
                    />
                    <Input
                      value={newVarValue}
                      onChange={(e) => setNewVarValue(e.target.value)}
                      placeholder='Variable value'
                      className='flex-1 font-mono text-xs'
                    />
                    <Button
                      variant='outline'
                      size='sm'
                      aria-label='Add variable'
                      onClick={() => {
                        if (newVarKey.trim() && newVarValue.trim()) {
                          if (!isValidVariableName(newVarKey.trim())) {
                            toast.error(
                              'Invalid variable name. Use only letters, numbers, underscores, and hyphens. Must start with a letter.'
                            );
                            return;
                          }
                          if (!isValidVariableValue(newVarValue.trim())) {
                            toast.error(
                              'Invalid variable value. Contains potentially dangerous content.'
                            );
                            return;
                          }
                          const newVariables = {
                            ...editingEnvironment.variables,
                            [newVarKey.trim()]: newVarValue.trim(),
                          };
                          setEditingEnvironment({
                            ...editingEnvironment,
                            variables: newVariables,
                          });
                          setNewVarKey('');
                          setNewVarValue('');
                        }
                      }}
                      disabled={!newVarKey.trim() || !newVarValue.trim()}
                      className='h-9 w-9 p-0'
                    >
                      <Plus className='w-3.5 h-3.5' />
                    </Button>
                  </div>
                </div>
              </div>

              <div className='flex gap-2 justify-end pt-4 border-t border-line'>
                <Button
                  variant='destructive'
                  size='sm'
                  onClick={() => deleteEnvironment(editingEnvironment.id)}
                >
                  <Trash2 className='w-3.5 h-3.5 mr-2' />
                  Delete
                </Button>
                <Button
                  variant='default'
                  size='sm'
                  onClick={() => {
                    updateEnvironment(editingEnvironment);
                    setEditingEnvironment(null);
                  }}
                >
                  <Save className='w-3.5 h-3.5 mr-2' />
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnvironmentManager;
