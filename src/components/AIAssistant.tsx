import React, { useState } from 'react';
import { useApiKeys } from '../hooks/useApiKeys';
import { AIRouter } from '../services/ai/AIRouter';
import { AIProviderType } from '../types';

interface AIAssistantProps {
  onClose: () => void;
}

export const AIAssistant = ({ onClose }: AIAssistantProps) => {
  const [prompt, setPrompt] = useState('');
  const [provider, setProvider] = useState<AIProviderType>('gemini');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const { getApiKey } = useApiKeys();

  const handleGenerate = async () => {
    setError('');
    setResult('');
    setIsLoading(true);

    const apiKey = getApiKey(provider);
    if (!apiKey) {
      setError(`API key for ${provider} is not set. Please add it in Settings.`);
      setIsLoading(false);
      return;
    }

    try {
      // This is a simplified call; the router will need to be more dynamic
      if (provider === 'gemini') {
        const response = await AIRouter.gemini.generateText(prompt, apiKey);
        setResult(response.content);
      } else {
        setError(`${provider} provider is not implemented yet.`);
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
        <select value={provider} onChange={e => setProvider(e.target.value as AIProviderType)} style={selectStyle}>
          <option value="gemini">Gemini</option>
          <option value="openai" disabled>OpenAI</option>
          {/* Add other providers as they are implemented */}
        </select>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          style={textareaStyle}
        />
        <button onClick={handleGenerate} disabled={isLoading || !prompt} style={buttonStyle}>
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
        {error && <div style={errorStyle}>{error}</div>}
        {result && <div style={resultStyle}><pre>{result}</pre></div>}
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
