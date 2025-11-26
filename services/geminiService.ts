import { GoogleGenAI } from "@google/genai";
import { AssetType, AspectRatio } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to enhance prompt based on asset type, style, and optional title
const enhancePrompt = (prompt: string, type: AssetType, style: string, title?: string): string => {
  let prefix = "";
  let suffix = `Style: ${style}. High quality, professional, detailed.`;

  // Add explicit instruction for text rendering if title is provided
  if (title) {
    suffix += ` The image MUST prominently display the text "${title}" in a readable font matching the style.`;
  }

  switch (type) {
    case AssetType.LOGO:
      prefix = "A professional vector logo design ";
      if (title) prefix += `for the brand "${title}", `;
      else prefix += "of ";
      suffix += " Vector graphic, flat design, centered, minimal background, highly scalable, clear typography.";
      break;
    case AssetType.THUMBNAIL:
      prefix = "A catchy, high-contrast YouTube thumbnail ";
      if (title) prefix += `featuring the title text "${title}", `;
      suffix += " Vibrant colors, eye-catching, emotional connection, 4k resolution, bold typography.";
      break;
    case AssetType.BANNER:
      prefix = "A wide web banner design ";
      if (title) prefix += `with the headline "${title}", `;
      else prefix += "for ";
      suffix += " Clean layout, suitable for website headers, balanced composition, negative space for text.";
      break;
    case AssetType.SOCIAL_POST:
      prefix = "A creative social media post image ";
      if (title) prefix += `promoting "${title}", `;
      else prefix += "for ";
      suffix += " Instagram aesthetic, engaging, trending visual style, integrated typography.";
      break;
    case AssetType.SOCIAL_STORY:
      prefix = "A vertical full-screen social media story background ";
      if (title) prefix += `highlighting "${title}", `;
      else prefix += "for ";
      suffix += " Immersive, vertical composition, mobile-first design, legible overlay text.";
      break;
  }

  return `${prefix}${prompt}. ${suffix}`;
};

export const generateImage = async (
  prompt: string,
  type: AssetType,
  style: string,
  aspectRatio: AspectRatio,
  title?: string
): Promise<string> => {
  try {
    // If prompt is empty but title exists, create a basic prompt from title
    const effectivePrompt = prompt.trim() || (title ? `A creative concept representing ${title}` : "");
    
    if (!effectivePrompt) {
      throw new Error("Please provide a description or a title.");
    }

    const finalPrompt = enhancePrompt(effectivePrompt, type, style, title);

    console.log("Generating with prompt:", finalPrompt);

    // Using gemini-2.5-flash-image as the standard image generation model
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: finalPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        },
      },
    });

    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("No candidates returned from Gemini API");
    }

    const content = response.candidates[0].content;
    if (!content || !content.parts) {
      throw new Error("No content parts returned");
    }

    // Find the image part
    for (const part of content.parts) {
      if (part.inlineData && part.inlineData.data) {
        const base64Data = part.inlineData.data;
        const mimeType = part.inlineData.mimeType || 'image/png';
        return `data:${mimeType};base64,${base64Data}`;
      }
    }

    throw new Error("No image data found in the response.");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};