export interface AITextGenerationResponse {
  content: string;
  tokenUsage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIImageGenerationResponse {
  imageUrl: string; // or base64
  revisedPrompt?: string;
}

export interface AIProvider {
  generateText(prompt: string, apiKey: string, options?: any): Promise<AITextGenerationResponse>;
  generateImage?(prompt: string, apiKey: string, options?: any): Promise<AIImageGenerationResponse>;
}
