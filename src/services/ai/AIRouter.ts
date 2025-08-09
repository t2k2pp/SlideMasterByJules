import { geminiProvider } from './geminiProvider';
import { openaiProvider } from './openaiProvider';
import { claudeProvider } from './claudeProvider';
import { azureProvider } from './azureProvider';
import { lmStudioProvider } from './lmStudioProvider';
import { fooucusProvider } from './fooucusProvider';

// The AIRouter is a simple object that exposes all implemented providers.
// This acts as a factory or registry for AI services.
export const AIRouter = {
  gemini: geminiProvider,
  openai: openaiProvider,
  claude: claudeProvider,
  azure: azureProvider,
  lmstudio: lmStudioProvider,
  fooocus: fooucusProvider,
};

// Example of a higher-level function that could be added later:
/*
export const generateTextWithBestProvider = async (prompt: string, apiKeys: Record<string, string>) => {
  // Logic to choose the best provider based on criteria (cost, speed, quality)
  // For now, we'll just default to Gemini.
  if (apiKeys.gemini) {
    return AIRouter.gemini.generateText(prompt, apiKeys.gemini);
  }
  throw new Error("No suitable AI provider API key found.");
};
*/
export {};
