import { geminiProvider } from './geminiProvider';
import { openaiProvider } from './openaiProvider';
import { claudeProvider } from './claudeProvider';
// Import other providers as they are implemented
// import { azureProvider } from './azureProvider';

// For now, the router is a simple object that exposes the providers.
// Later, it can contain logic to select the best provider for a task.
export const AIRouter = {
  gemini: geminiProvider,
  openai: openaiProvider,
  claude: claudeProvider,
  // azure: azureProvider,
  // ...and so on
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
