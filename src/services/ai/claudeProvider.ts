import Anthropic from "@anthropic-ai/sdk";
import { AIProvider, AITextGenerationResponse } from "./types";

const generateText = async (prompt: string, apiKey: string): Promise<AITextGenerationResponse> => {
  if (!apiKey) {
    throw new Error("Claude API key is missing.");
  }

  // The Anthropic SDK is designed to be used in server-side environments.
  // For client-side usage, we need to proxy requests to avoid exposing the API key.
  // However, for this project, we follow the design of using the key directly
  // on the client, similar to the OpenAI provider.
  const anthropic = new Anthropic({
    apiKey: apiKey,
  });

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    // The response content is an array of blocks; we need to extract the text.
    const content = response.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('');

    const tokenUsage = {
      promptTokens: response.usage.input_tokens,
      completionTokens: response.usage.output_tokens,
      totalTokens: response.usage.input_tokens + response.usage.output_tokens,
    };

    return { content, tokenUsage };
  } catch (error: any) {
    console.error("Error calling Claude API:", error);
    throw new Error(`Claude API Error: ${error.message}`);
  }
};

export const claudeProvider: AIProvider = {
  generateText,
  // generateImage is intentionally omitted as Claude does not support it.
};
