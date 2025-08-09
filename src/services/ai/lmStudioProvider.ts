import OpenAI from "openai";
import { AIProvider, AITextGenerationResponse } from "./types";
import { ProviderConfig } from "../../hooks/useProviderConfig";

const generateText = async (prompt: string, config: ProviderConfig): Promise<AITextGenerationResponse> => {
  if (!config.endpoint) {
    throw new Error("LM Studio endpoint URL is missing.");
  }

  // LM Studio's server is OpenAI-compatible. We can use the OpenAI SDK.
  // The API key is often not required for local servers, but we pass 'N/A' or any string.
  const openai = new OpenAI({
    apiKey: config.apiKey || 'not-needed',
    baseURL: config.endpoint,
    dangerouslyAllowBrowser: true,
  });

  try {
    const response = await openai.chat.completions.create({
      model: "local-model", // The model name is often configured in LM Studio itself.
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content || "";

    // Local models typically don't return token usage in the same way.
    const tokenUsage = {
      promptTokens: response.usage?.prompt_tokens || 0,
      completionTokens: response.usage?.completion_tokens || 0,
      totalTokens: response.usage?.total_tokens || 0,
    };

    return { content, tokenUsage };
  } catch (error: any) {
    console.error("Error calling LM Studio API:", error);
    if (error.code === 'ECONNREFUSED') {
        throw new Error(`Connection to LM Studio failed. Is the server running at ${config.endpoint}?`);
    }
    throw new Error(`LM Studio API Error: ${error.message}`);
  }
};

export const lmStudioProvider: AIProvider = {
  generateText,
};
