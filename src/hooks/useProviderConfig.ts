import { useCallback } from 'react';
import { AIProviderType } from '../types';

export interface ProviderConfig {
  apiKey: string;
  endpoint?: string;
}

// Encryption functions from the previous implementation
const ENCRYPTION_KEY = 'slidemaster-secure-key-v1';

const encrypt = (text: string): string => {
  try {
    const textToChars = (t: string) => t.split('').map(c => c.charCodeAt(0));
    const byteHex = (n: number) => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = (code: number) => textToChars(ENCRYPTION_KEY).reduce((a, b) => a ^ b, code);
    return textToChars(text).map(applySaltToChar).map(byteHex).join('');
  } catch (e) { return ''; }
};

const decrypt = (encrypted: string): string => {
  try {
    const textToChars = (t: string) => t.split('').map(c => c.charCodeAt(0));
    const applySaltToChar = (code: number) => textToChars(ENCRYPTION_KEY).reduce((a, b) => a ^ b, code);
    return (encrypted.match(/.{1,2}/g) || [])
      .map(hex => parseInt(hex, 16))
      .map(applySaltToChar)
      .map(charCode => String.fromCharCode(charCode))
      .join('');
  } catch (e) { return ''; }
};


export const useProviderConfig = () => {
  const getProviderConfig = useCallback((provider: AIProviderType): ProviderConfig => {
    const rawStoredConfig = localStorage.getItem(`slidemaster_config_${provider}`);
    if (!rawStoredConfig) {
      return { apiKey: '', endpoint: '' };
    }
    try {
      const storedConfig = JSON.parse(rawStoredConfig);
      const decryptedApiKey = decrypt(storedConfig.apiKey || '');
      return { ...storedConfig, apiKey: decryptedApiKey };
    } catch {
      return { apiKey: '', endpoint: '' };
    }
  }, []);

  const setProviderConfig = useCallback((provider: AIProviderType, config: ProviderConfig) => {
    const encryptedApiKey = encrypt(config.apiKey);
    const configToStore = { ...config, apiKey: encryptedApiKey };
    localStorage.setItem(`slidemaster_config_${provider}`, JSON.stringify(configToStore));
  }, []);

  return { getProviderConfig, setProviderConfig };
};
