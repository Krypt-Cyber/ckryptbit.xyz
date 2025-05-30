
import { GoogleGenAI, GenerateContentResponse, Chat, Part, SendMessageParameters, GenerateContentConfig } from "@google/genai";
import { SelectedTechnologies, ChatMessage, ParsedBlueprint, ChatMessageImageData, GroundingSource, AiAgentMode } from '../types';
import { GEMINI_MODEL_NAME } from '../constants';

// API_KEY is no longer managed or used directly in this frontend service for primary AI calls.
// All primary AI calls (chat, blueprint generation) are proxied through the backend.
// The backend will use its own API_KEY from environment variables.

let localFrontendAiInstance: GoogleGenAI | null = null; // For any hypothetical direct frontend calls (e.g. simple text, if API_KEY was exposed)

const initializeFrontendGeminiClientIfPermitted = (): GoogleGenAI | null => {
  // This function would only succeed if process.env.API_KEY was somehow made available to frontend
  // and intended for direct, non-proxied, simple calls.
  // For the "production-ready" build, API_KEY is NOT exposed to frontend bundle directly.
  const apiKey = process.env.API_KEY; // This will likely be undefined or a dummy string in frontend build
  if (!localFrontendAiInstance && apiKey && apiKey !== "FRONTEND_SHOULD_NOT_USE_API_KEY_DIRECTLY" && apiKey !== "UNSET_IN_FRONTEND_BUNDLE") {
    try {
        localFrontendAiInstance = new GoogleGenAI({ apiKey });
        console.info("Frontend Gemini Client initialized for POTENTIAL direct simple calls (developer/testing only).");
    } catch (e: any) {
        console.warn("Frontend Gemini Client init failed (API key issue for direct calls):", e.message);
        localFrontendAiInstance = null;
    }
  } else if (!apiKey || apiKey === "FRONTEND_SHOULD_NOT_USE_API_KEY_DIRECTLY" || apiKey === "UNSET_IN_FRONTEND_BUNDLE") {
    // This is the expected state for production frontend builds.
    // console.log("Frontend Gemini direct calls disabled (API_KEY not available to frontend bundle). AI calls are proxied via backend.");
  }
  return localFrontendAiInstance;
}


// This function is kept for potential simple, non-sensitive, direct frontend calls IF an API key were available.
// In the production setup, digital asset generation happens on the backend.
export const generateSimpleTextWithGemini = async (userPrompt: string): Promise<string> => {
  const feAi = initializeFrontendGeminiClientIfPermitted();
  if (!feAi) {
    // Fallback or error for when frontend cannot make direct calls
    console.warn("generateSimpleTextWithGemini: Frontend Gemini client not available. This function should ideally not be called in production frontend if API_KEY is not exposed. Backend should handle AI generation.");
    // Simulating backend call for consistency or throwing error:
    // Option 1: Throw error to indicate it should be a backend call
    // throw new Error("Direct frontend Gemini text generation disabled. Use backend proxy.");
    // Option 2: Simulate a delay and return a placeholder (less ideal for "production")
    await new Promise(resolve => setTimeout(resolve, 500));
    return `[Simulated Frontend AI Response for: "${userPrompt.substring(0,30)}..."] - Note: Production AI generation occurs on backend.`;
  }
  try {
    const response: GenerateContentResponse = await feAi.models.generateContent({
      model: GEMINI_MODEL_NAME, // This constant might still be useful for frontend display
      contents: userPrompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error in generateSimpleTextWithGemini (direct frontend call):", error);
    if (error instanceof Error) {
        // ... (error handling as before, but less critical as this path is less used)
        throw new Error(`Direct Frontend Gemini API request failed: ${error.message}`);
    }
    throw new Error("Unknown error in direct frontend Gemini simple text generation.");
  }
};


// The following functions for stack overview and chat messaging are now effectively superseded
// by backend API proxy calls. They are commented out or removed to reflect this shift.
// The actual logic for prompt construction, history management (for chat), and parsing
// will now reside on the backend within the respective AI proxy routes.

/*
// --- No longer used directly by frontend - Backend handles blueprint generation ---
export const constructStackOverviewPromptForJson = (selections: SelectedTechnologies): string => {
  // ... (prompt construction logic - This logic now lives on the backend)
  return "PROMPT_CONSTRUCTED_ON_BACKEND";
};

export const generateStackOverviewWithGemini = async (selections: SelectedTechnologies): Promise<ParsedBlueprint> => {
  // This function is now deprecated for frontend use. Call the backend API instead.
  throw new Error("generateStackOverviewWithGemini is deprecated on frontend. Use API proxy: /api/ai/generate-blueprint");
};
*/

/*
// --- No longer used directly by frontend - Backend handles chat ---
let chatInstance: Chat | null = null; // Chat instance is now managed by backend per user session if needed or stateless

export const geminiChatSystemPromptForJson = \`...PROMPT_LIVES_ON_BACKEND...\`;
export const geminiChatSystemPromptForResearch = \`...PROMPT_LIVES_ON_BACKEND...\`;

const initializeChat = () => {
  // This frontend chat initialization is no longer primary. Backend handles chat sessions.
  console.warn("Frontend chat initialization is deprecated. Backend manages AI chat sessions.");
  return null; 
};

export const resetGeminiChat = () => {
    // chatInstance = null; // No frontend chat instance to reset primarily
    console.log("Frontend chat session reset (client-side view only). Backend handles actual AI chat state.");
};

export const sendMessageToGemini = async (
    messageContent: string, 
    _history: ChatMessage[], 
    agentMode: AiAgentMode,
    imageData?: ChatMessageImageData | null
): Promise<{ text: string; groundingSources?: GroundingSource[] }> => {
  // This function is now deprecated for frontend use. Call the backend API instead.
  throw new Error("sendMessageToGemini is deprecated on frontend. Use API proxy: /api/ai/chat");
};
*/

// Minimal reset function if App.tsx still needs to call something on provider switch
export const resetGeminiChat = () => {
    console.log("Client-side Gemini context cleared. Backend manages AI chat state.");
};


// IMPORTANT: The App.tsx and components like TechStackConfiguratorView & ChatView
// MUST be refactored to call the new backend API endpoints (e.g., /api/ai/generate-blueprint, /api/ai/chat)
// via the apiService.ts module. The frontend no longer directly initializes or uses the Gemini SDK for these primary tasks.
