import { AzureOpenAI } from "@azure/openai";
import { AIProvider, AITextGenerationResponse, AIImageGenerationResponse } from "./types";
import { ProviderConfig } from "../../hooks/useProviderConfig";

const generateText = async (prompt: string, config: ProviderConfig): Promise<AITextGenerationResponse> => {
  if (!config.apiKey || !config.endpoint) {
    throw new Error("Azure OpenAI API key or endpoint is missing.");
  }

  const client = new AzureOpenAI({ endpoint: config.endpoint, apiKey: config.apiKey });

  try {
    // Note: For Azure, the model name is the "Deployment name" you specify in Azure Studio.
    const deploymentName = "gpt-4-turbo";
    const response = await client.getChatCompletions(deploymentName, [{ role: "user", content: prompt }]);

    const content = response.choices[0]?.message?.content || "";
    const tokenUsage = {
      promptTokens: response.usage?.prompt_tokens || 0,
      completionTokens: response.usage?.completion_tokens || 0,
      totalTokens: response.usage?.total_tokens || 0,
    };

    return { content, tokenUsage };
  } catch (error: any) {
    console.error("Error calling Azure OpenAI API:", error);
    throw new Error(`Azure OpenAI API Error: ${error.message}`);
  }
};

const generateImage = async (prompt: string, config: ProviderConfig): Promise<AIImageGenerationResponse> => {
  if (!config.apiKey || !config.endpoint) {
    throw new Error("Azure OpenAI API key or endpoint is missing.");
  }

  const client = new AzureOpenAI({ endpoint: config.endpoint, apiKey: config.apiKey });

  try {
    const deploymentName = "dall-e-3";
    const response = await client.getImages(deploymentName, prompt, {
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = response.data[0]?.url;
    if (!imageUrl) {
      throw new Error("Image generation failed, no URL returned.");
    }

    const revisedPrompt = response.data[0]?.revised_prompt;

    return { imageUrl, revisedPrompt };
  } catch (error: any) {
    console.error("Error calling Azure OpenAI Image API:", error);
    throw new Error(`Azure OpenAI Image API Error: ${error.message}`);
  }
};


export const azureProvider: AIProvider = {
  generateText,
  generateImage,
};
