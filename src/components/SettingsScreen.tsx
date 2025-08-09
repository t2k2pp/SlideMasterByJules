import React, { useState, useEffect } from 'react';
import { useApiKeys } from '../hooks/useApiKeys';
import { AIProviderType } from '../types';

interface SettingsScreenProps {
  onClose: () => void;
}

const PROVIDERS: AIProviderType[] = ['gemini', 'openai', 'azure', 'claude', 'lmstudio', 'fooocus'];

export const SettingsScreen = ({ onClose }: SettingsScreenProps) => {
  const { getApiKey, setApiKey } = useApiKeys();
  const [keys, setKeys] = useState<Record<AIProviderType, string>>({
    gemini: '', openai: '', azure: '', claude: '', lmstudio: '', fooocus: ''
  });
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const existingKeys: Record<AIProviderType, string> = {} as any;
    for (const provider of PROVIDERS) {
      existingKeys[provider] = getApiKey(provider);
    }
    setKeys(existingKeys);
  }, [getApiKey]);

  const handleInputChange = (provider: AIProviderType, value: string) => {
    setKeys(prevKeys => ({ ...prevKeys, [provider]: value }));
    setIsDirty(true);
  };

  const handleSave = () => {
    for (const provider of PROVIDERS) {
      setApiKey(provider, keys[provider]);
    }
    setIsDirty(false);
    // A better feedback mechanism will be added later
    alert('API Keys saved!');
    onClose();
  };

  const handleClose = () => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <div style={{ padding: '20px 40px', maxWidth: '700px', margin: '40px auto', fontFamily: 'sans-serif', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>API Key Settings</h2>
      <p style={{ color: '#666', fontSize: '0.9rem' }}>API keys are stored securely in your browser's local storage and are never sent to any server other than the respective AI provider's.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        {PROVIDERS.map(provider => (
          <div key={provider}>
            <label htmlFor={`apikey-${provider}`} style={{ textTransform: 'capitalize', display: 'block', marginBottom: '5px', fontWeight: 500 }}>
              {provider} API Key
            </label>
            <input
              id={`apikey-${provider}`}
              type="password"
              placeholder={`Enter your ${provider} API key`}
              value={keys[provider]}
              onChange={(e) => handleInputChange(provider, e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>
        ))}
      </div>

      <div style={{ marginTop: '30px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button onClick={handleClose} style={{ padding: '10px 20px', border: '1px solid #ccc', backgroundColor: 'transparent', borderRadius: '5px', cursor: 'pointer' }}>
          Cancel
        </button>
        <button onClick={handleSave} style={{ padding: '10px 20px', border: 'none', backgroundColor: '#4F46E5', color: 'white', borderRadius: '5px', cursor: 'pointer' }}>
          Save and Close
        </button>
      </div>
    </div>
  );
};
