import { GoogleGenerativeAI, Part } from "@google/genai";
import { AIProvider, AITextGenerationResponse } from "./types";

// Function to convert base64 to a Gemini API Part object.
const fileToGenerativePart = (base64: string, mimeType: string): Part => {
  return {
    inlineData: {
      data: base64.split(',')[1], // remove the "data:image/jpeg;base64," part
      mimeType
    },
  };
}

export const analyzeVideoWithVision = async (
  prompt: string,
  apiKey: string,
  images: string[] // array of base64 strings
): Promise<AITextGenerationResponse> => {
  if (!apiKey) throw new Error("Gemini API key is missing.");
  if (images.length === 0) throw new Error("No images provided for analysis.");

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    const imageParts = images.map(img => fileToGenerativePart(img, 'image/jpeg'));

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = result.response;
    const text = response.text();

    return { content: text };
  } catch (error) {
    console.error("Error calling Gemini Vision API:", error);
    if (error instanceof Error) {
      throw new Error(`Gemini Vision API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while calling the Gemini Vision API.");
  }
};

const generateText = async (prompt: string, apiKey: string): Promise<AITextGenerationResponse> => {
  if (!apiKey) {
    throw new Error("Gemini API key is missing.");
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Note: The @google/genai SDK v1 doesn't directly expose token counts
    // in the same way as some other libraries. This is a placeholder.
    const tokenUsage = {
      promptTokens: 0, // Placeholder
      completionTokens: 0, // Placeholder
      totalTokens: 0, // Placeholder
    };

    return {
      content: text,
      tokenUsage,
    };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
      // More specific error handling for common cases
      if (error.message.includes('API key not valid')) {
        throw new Error('Invalid Gemini API key. Please check your key.');
      }
      throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while calling the Gemini API.");
  }
};

export const geminiProvider: AIProvider = {
  generateText,
};
