import { AIProvider, AIImageGenerationResponse } from "./types";
import { ProviderConfig } from "../../hooks/useProviderConfig";

const generateImage = async (prompt: string, config: ProviderConfig): Promise<AIImageGenerationResponse> => {
  if (!config.endpoint) {
    throw new Error("Fooocus endpoint URL is missing.");
  }

  // Ensure the endpoint doesn't have a trailing slash
  const endpoint = config.endpoint.endsWith('/') ? config.endpoint.slice(0, -1) : config.endpoint;
  const url = `${endpoint}/v1/generation/text-to-image`;

  const payload = {
    prompt: prompt,
    style_selections: ["Fooocus V2", "Fooocus Enhance", "Fooocus Sharp"],
    performance_selection: "Speed",
    aspect_ratios_selection: "1024*1024",
    image_number: 1,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Fooocus API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    // The response is the raw image data. We need to convert it to a data URL.
    const imageBlob = await response.blob();
    const imageUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(imageBlob);
    });

    return { imageUrl };

  } catch (error: any) {
    console.error("Error calling Fooocus API:", error);
     if (error.message.includes('Failed to fetch')) {
        throw new Error(`Connection to Fooocus failed. Is the server running at ${config.endpoint}?`);
    }
    throw new Error(`Fooocus API Error: ${error.message}`);
  }
};


export const fooucusProvider: AIProvider = {
  // Fooocus only supports image generation
  generateImage,
};
