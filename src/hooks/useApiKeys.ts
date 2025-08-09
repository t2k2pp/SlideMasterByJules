import { useCallback } from 'react';
import { AIProviderType } from '../types';

// As specified in the design doc
const ENCRYPTION_KEY = 'slidemaster-secure-key-v1';

const encryptApiKey = (apiKey: string): string => {
  try {
    // A simple XOR-like cipher for basic obfuscation, then base64
    const textToChars = (text: string) => text.split('').map(c => c.charCodeAt(0));
    const byteHex = (n: number) => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = (code: number) => textToChars(ENCRYPTION_KEY).reduce((a, b) => a ^ b, code);

    return textToChars(apiKey)
      .map(applySaltToChar)
      .map(byteHex)
      .join('');
  } catch (e) {
    console.error("Encryption failed", e);
    return '';
  }
};

const decryptApiKey = (encryptedKey: string): string => {
  try {
    const textToChars = (text: string) => text.split('').map(c => c.charCodeAt(0));
    const applySaltToChar = (code: number) => textToChars(ENCRYPTION_KEY).reduce((a, b) => a ^ b, code);

    return (encryptedKey.match(/.{1,2}/g) || [])
      .map(hex => parseInt(hex, 16))
      .map(applySaltToChar)
      .map(charCode => String.fromCharCode(charCode))
      .join('');
  } catch (e) {
    console.error("Decryption failed", e);
    return '';
  }
};


export const useApiKeys = () => {
  const getApiKey = useCallback((provider: AIProviderType): string => {
    const encryptedKey = localStorage.getItem(`slidemaster_apikey_${provider}`);
    if (!encryptedKey) {
      return '';
    }
    return decryptApiKey(encryptedKey);
  }, []);

  const setApiKey = useCallback((provider: AIProviderType, key: string) => {
    if (key) {
      const encryptedKey = encryptApiKey(key);
      localStorage.setItem(`slidemaster_apikey_${provider}`, encryptedKey);
    } else {
      localStorage.removeItem(`slidemaster_apikey_${provider}`);
    }
  }, []);

  return { getApiKey, setApiKey };
};
