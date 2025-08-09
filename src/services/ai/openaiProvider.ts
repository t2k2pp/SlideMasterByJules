import OpenAI from "openai";
import { AIProvider, AITextGenerationResponse, AIImageGenerationResponse } from "./types";

const generateText = async (prompt: string, apiKey: string): Promise<AITextGenerationResponse> => {
  if (!apiKey) {
    throw new Error("OpenAI API key is missing.");
  }

  const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo", // Using a powerful and recent model
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.choices[0]?.message?.content || "";
    const tokenUsage = {
      promptTokens: response.usage?.prompt_tokens || 0,
      completionTokens: response.usage?.completion_tokens || 0,
      totalTokens: response.usage?.total_tokens || 0,
    };

    return { content, tokenUsage };
  } catch (error: any) {
    console.error("Error calling OpenAI API:", error);
    throw new Error(`OpenAI API Error: ${error.message}`);
  }
};

const generateImage = async (prompt: string, apiKey: string): Promise<AIImageGenerationResponse> => {
  if (!apiKey) {
    throw new Error("OpenAI API key is missing.");
  }

  const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024", // DALL-E 3 supports 1024x1024, 1792x1024, or 1024x1792
    });

    const imageUrl = response.data[0]?.url;
    if (!imageUrl) {
      throw new Error("Image generation failed, no URL returned.");
    }

    const revisedPrompt = response.data[0]?.revised_prompt;

    return { imageUrl, revisedPrompt };
  } catch (error: any) {
    console.error("Error calling OpenAI Image API:", error);
    throw new Error(`OpenAI Image API Error: ${error.message}`);
  }
};


export const openaiProvider: AIProvider = {
  generateText,
  generateImage,
};
