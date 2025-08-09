import React, { useState, useMemo } from 'react';
import { useProviderConfig } from '../hooks/useProviderConfig';
import { AIRouter } from '../services/ai/AIRouter';
import { AIProviderType } from '../types';

type TaskType = 'text' | 'image';

interface AIAssistantProps {
  onClose: () => void;
}

export const AIAssistant = ({ onClose }: AIAssistantProps) => {
  const [prompt, setPrompt] = useState('');
  const [provider, setProvider] = useState<AIProviderType>('gemini');
  const [taskType, setTaskType] = useState<TaskType>('text');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const { getProviderConfig } = useProviderConfig();

  const availableProvidersForTask = useMemo(() => {
    const allProviders = Object.keys(AIRouter) as AIProviderType[];
    if (taskType === 'image') {
      return allProviders.filter(p => AIRouter[p].generateImage);
    }
    return allProviders;
  }, [taskType]);

  // If current provider is not available for the selected task, switch to the first available one
  React.useEffect(() => {
    if (!availableProvidersForTask.includes(provider)) {
      setProvider(availableProvidersForTask[0] || 'gemini');
    }
  }, [availableProvidersForTask, provider]);

  const handleGenerate = async () => {
    setError('');
    setResult('');
    setIsLoading(true);

    const config = getProviderConfig(provider);
    if (!config.apiKey) {
      setError(`API key for ${provider} is not set. Please add it in Settings.`);
      setIsLoading(false);
      return;
    }

    try {
      const selectedProvider = AIRouter[provider];
      if (taskType === 'text') {
        const response = await selectedProvider.generateText(prompt, config);
        setResult(response.content);
      } else if (taskType === 'image' && selectedProvider.generateImage) {
        const response = await selectedProvider.generateImage(prompt, config);
        setResult(response.imageUrl);
      } else {
        throw new Error(`Task '${taskType}' not supported by provider '${provider}'.`);
      }
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={panelStyle}>
      <div style={headerStyle}>
        <h3>AI Assistant</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
      </div>
      <div style={contentStyle}>
        <div>
          <label><input type="radio" name="task" value="text" checked={taskType === 'text'} onChange={() => setTaskType('text')} /> Text</label>
          <label style={{marginLeft: '15px'}}><input type="radio" name="task" value="image" checked={taskType === 'image'} onChange={() => setTaskType('image')} /> Image</label>
        </div>
        <select value={provider} onChange={e => setProvider(e.target.value as AIProviderType)} style={selectStyle}>
          {Object.keys(AIRouter).map(p => (
            <option key={p} value={p} disabled={!availableProvidersForTask.includes(p as AIProviderType)}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </option>
          ))}
        </select>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={taskType === 'text' ? 'Enter your text prompt...' : 'Enter your image prompt...'}
          style={textareaStyle}
        />
        <button onClick={handleGenerate} disabled={isLoading || !prompt} style={buttonStyle}>
          {isLoading ? 'Generating...' : `Generate ${taskType.charAt(0).toUpperCase() + taskType.slice(1)}`}
        </button>
        {error && <div style={errorStyle}>{error}</div>}
        {result && (
          <div style={resultStyle}>
            {taskType === 'text' ? <pre>{result}</pre> : <img src={result} alt="Generated" style={{maxWidth: '100%'}} />}
          </div>
        )}
      </div>
    </div>
  );
};

// Styles
const panelStyle: React.CSSProperties = { position: 'fixed', bottom: '20px', right: '20px', width: '350px', backgroundColor: 'white', boxShadow: '0 0 15px rgba(0,0,0,0.2)', borderRadius: '8px', zIndex: 1000, fontFamily: 'sans-serif' };
const headerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px', borderBottom: '1px solid #eee' };
const contentStyle: React.CSSProperties = { padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' };
const selectStyle: React.CSSProperties = { padding: '8px', borderRadius: '4px' };
const textareaStyle: React.CSSProperties = { height: '100px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical', fontFamily: 'inherit' };
const buttonStyle: React.CSSProperties = { padding: '10px', border: 'none', backgroundColor: '#4F46E5', color: 'white', borderRadius: '5px', cursor: 'pointer' };
const errorStyle: React.CSSProperties = { color: '#c00', marginTop: '10px', fontSize: '0.9rem', padding: '10px', backgroundColor: '#fdd', borderRadius: '4px' };
const resultStyle: React.CSSProperties = { marginTop: '10px', padding: '10px', backgroundColor: '#f7f7f7', borderRadius: '4px', maxHeight: '200px', overflowY: 'auto', border: '1px solid #eee' };
