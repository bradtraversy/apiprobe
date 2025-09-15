import { useState, useEffect } from 'react';
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

    // Switch to first available environment or create default
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
  };

  const updateEnvironment = (updatedEnv: Environment) => {
    const newEnvironments = environments.map((env) =>
      env.id === updatedEnv.id ? updatedEnv : env
    );
    onEnvironmentsChange(newEnvironments);
  };

  const addVariable = (envId: string) => {
    if (newVarKey.trim() && newVarValue.trim()) {
      const env = environments.find((e) => e.id === envId);
      if (env) {
        const updatedEnv = {
          ...env,
          variables: {
            ...env.variables,
            [newVarKey.trim()]: newVarValue.trim(),
          },
        };
        updateEnvironment(updatedEnv);
        setNewVarKey('');
        setNewVarValue('');
      }
    }
  };

  const removeVariable = (envId: string, key: string) => {
    const env = environments.find((e) => e.id === envId);
    if (env) {
      const newVariables = { ...env.variables };
      delete newVariables[key];
      const updatedEnv = {
        ...env,
        variables: newVariables,
      };
      updateEnvironment(updatedEnv);
    }
  };

  const updateVariable = (envId: string, key: string, value: string) => {
    const env = environments.find((e) => e.id === envId);
    if (env) {
      const newVariables = { ...env.variables };
      newVariables[key] = value;
      const updatedEnv = {
        ...env,
        variables: newVariables,
      };
      updateEnvironment(updatedEnv);
    }
  };

  return (
    <div className={className}>
      <div className='flex items-center gap-2 mb-3'>
        <Globe className='w-4 h-4 text-slate-600' />
        <label className='text-sm font-medium text-slate-700'>
          Environment
        </label>
      </div>

      {/* Environment Selector */}
      <div className='relative'>
        <Button
          variant='outline'
          onClick={() => setIsOpen(!isOpen)}
          className='w-full justify-between'
        >
          <span className='flex items-center gap-2'>
            <Globe className='w-4 h-4' />
            {currentEnv?.name || 'No Environment'}
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </Button>

        {isOpen && (
          <div className='absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto'>
            {environments.map((env) => (
              <div
                key={env.id}
                className='flex items-center justify-between p-2 hover:bg-slate-50 cursor-pointer'
                onClick={() => {
                  onCurrentEnvironmentChange(env.id);
                  setIsOpen(false);
                }}
              >
                <span className='text-sm'>{env.name}</span>
                {env.id === currentEnvironment && (
                  <div className='w-2 h-2 bg-blue-500 rounded-full' />
                )}
              </div>
            ))}
            <div className='border-t border-slate-200 p-2'>
              <div className='flex items-center gap-2'>
                <Input
                  value={newEnvName}
                  onChange={(e) => setNewEnvName(e.target.value)}
                  placeholder='New environment name'
                  className='flex-1 text-sm'
                  onKeyPress={(e) => e.key === 'Enter' && addEnvironment()}
                />
                <Button
                  size='sm'
                  onClick={addEnvironment}
                  disabled={!newEnvName.trim()}
                >
                  <Plus className='w-3 h-3' />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Environment Variables */}
      {currentEnv && (
        <div className='mt-4 space-y-3'>
          <div className='flex items-center justify-between'>
            <h4 className='text-sm font-medium text-slate-700'>Variables</h4>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setEditingEnvironment(currentEnv)}
            >
              <Settings className='w-4 h-4' />
            </Button>
          </div>

          {/* Variable List */}
          <div className='space-y-2'>
            {Object.entries(currentEnv.variables).map(([key, value]) => (
              <div key={key} className='flex items-center gap-2 text-sm'>
                <span className='font-mono bg-slate-100 px-2 py-1 rounded'>
                  {`{{${key}}}`}
                </span>
                <span className='text-slate-500'>→</span>
                <span className='font-mono bg-slate-100 px-2 py-1 rounded'>
                  {value}
                </span>
              </div>
            ))}
            {Object.keys(currentEnv.variables).length === 0 && (
              <p className='text-xs text-slate-500 italic'>
                No variables defined
              </p>
            )}
          </div>
        </div>
      )}

      {/* Environment Editor Modal */}
      {editingEnvironment && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold'>Edit Environment</h3>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setEditingEnvironment(null)}
              >
                <X className='w-4 h-4' />
              </Button>
            </div>

            <div className='space-y-4'>
              {/* Environment Name */}
              <div>
                <label className='block text-sm font-medium mb-2'>
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

              {/* Variables */}
              <div>
                <label className='block text-sm font-medium mb-2'>
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
                          className='flex-1'
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
                          className='flex-1'
                        />
                        <Button
                          variant='ghost'
                          size='sm'
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
                        >
                          <Trash2 className='w-4 h-4' />
                        </Button>
                      </div>
                    )
                  )}

                  {/* Add New Variable */}
                  <div className='flex gap-2'>
                    <Input
                      value={newVarKey}
                      onChange={(e) => setNewVarKey(e.target.value)}
                      placeholder='Variable name'
                      className='flex-1'
                    />
                    <Input
                      value={newVarValue}
                      onChange={(e) => setNewVarValue(e.target.value)}
                      placeholder='Variable value'
                      className='flex-1'
                    />
                                         <Button
                       variant='outline'
                       size='sm'
                       onClick={() => {
                         if (newVarKey.trim() && newVarValue.trim()) {
                           // Validate variable name and value
                           if (!isValidVariableName(newVarKey.trim())) {
                             alert('Invalid variable name. Use only letters, numbers, underscores, and hyphens. Must start with a letter.');
                             return;
                           }
                           
                           if (!isValidVariableValue(newVarValue.trim())) {
                             alert('Invalid variable value. Contains potentially dangerous content.');
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
                     >
                      <Plus className='w-4 h-4' />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className='flex gap-2 pt-4'>
                <Button
                  onClick={() => {
                    updateEnvironment(editingEnvironment);
                    setEditingEnvironment(null);
                  }}
                  className='flex-1'
                >
                  <Save className='w-4 h-4 mr-2' />
                  Save
                </Button>
                <Button
                  variant='outline'
                  onClick={() => deleteEnvironment(editingEnvironment.id)}
                  className='flex-1'
                >
                  <Trash2 className='w-4 h-4 mr-2' />
                  Delete
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
