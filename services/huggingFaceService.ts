
import { SelectedTechnologies, ChatMessage, ParsedBlueprint } from '../types';
// The detailed JSON prompt constructor (constructHfStackOverviewPromptJson)
// if different from Gemini's, would now reside on the backend.

// Note: In a "production-ready" setup with a backend proxy for AI,
// these direct calls from the frontend would be replaced by calls to your backend API,
// which then communicates with the Hugging Face API.

interface HuggingFaceTextGenerationRequest {
  inputs: string;
  parameters?: { max_new_tokens?: number; temperature?: number; return_full_text?: boolean; };
  options?: { wait_for_model?: boolean; };
}
interface HuggingFaceTextGenerationResponseItem { generated_text: string; }
type HuggingFaceTextGenerationResponse = HuggingFaceTextGenerationResponseItem[];

const parseJsonFromString = (jsonString: string): any => {
  let cleanedJsonText = jsonString.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = cleanedJsonText.match(fenceRegex);
  if (match && match[2]) {
    cleanedJsonText = match[2].trim();
  }
  try {
    return JSON.parse(cleanedJsonText);
  } catch (e) {
    console.error("Failed to parse JSON string from Hugging Face:", cleanedJsonText, e);
    throw new Error(`Failed to parse JSON response from Hugging Face. Content: "${cleanedJsonText.substring(0,100)}..."`);
  }
}

export const generateStackOverviewWithHuggingFace = async (
  selections: SelectedTechnologies,
  modelId: string,
  apiKey?: string,
): Promise<ParsedBlueprint> => {
  // This function would be called by the backend proxy.
  // If kept for direct frontend testing (requires user to handle HF API key & CORS):
  console.warn("generateStackOverviewWithHuggingFace: Direct frontend call. In production, this should be via backend proxy.");
  if (!modelId) throw new Error("Hugging Face Model ID is required.");

  const promptContent = `Generate a project blueprint in JSON format for: ${JSON.stringify(selections)}. The JSON should include "overview", "suggestedFiles", and "nextSteps". Respond ONLY with the JSON object.`;
  const apiEndpoint = `https://api-inference.huggingface.co/models/${modelId}`;
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;

  const requestBody: HuggingFaceTextGenerationRequest = {
    inputs: promptContent,
    parameters: { max_new_tokens: 3072, temperature: 0.3, return_full_text: false },
    options: { wait_for_model: true }
  };

  try {
    const response = await fetch(apiEndpoint, { method: 'POST', headers, body: JSON.stringify(requestBody) });
    if (!response.ok) { /* ... error handling ... */ throw new Error(`HF API Error ${response.status}`); }
    const data: HuggingFaceTextGenerationResponse | { error?: string } = await response.json();
    if ('error' in data && data.error) throw new Error(`HF API Error: ${data.error}`);
    
    const hfResponse = data as HuggingFaceTextGenerationResponse;
    if (hfResponse?.[0]?.generated_text) {
        const parsedJson = parseJsonFromString(hfResponse[0].generated_text);
        if (!parsedJson.overview || !Array.isArray(parsedJson.suggestedFiles)) {
            throw new Error("Hugging Face LLM returned invalid JSON for blueprint.");
        }
        return parsedJson as ParsedBlueprint;
    }
    throw new Error("Could not parse valid response from Hugging Face for stack overview.");
  } catch (error) {
    console.error("Error calling Hugging Face API (Stack Overview):", error);
    throw new Error(`HF communication error (Stack Overview): ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const sendMessageToHuggingFace = async (
  currentUserInput: string,
  chatHistory: ChatMessage[],
  modelId: string,
  apiKey?: string,
): Promise<string> => { // Returns raw string, expected to be JSON
  // This function would be called by the backend proxy.
  // If kept for direct frontend testing:
  console.warn("sendMessageToHuggingFace: Direct frontend call. In production, this should be via backend proxy.");
  if (!modelId) throw new Error("HF Model ID missing.");

  const systemPrompt = "You are an AI assistant. Respond in JSON: { \"type\": \"textResponse\", \"message\": \"Your text answer here.\" } or { \"type\": \"fileOperation\", ... }";
  let fullPrompt = systemPrompt + '\\n';
  chatHistory.forEach(msg => { fullPrompt += `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.content}\\n`; });
  fullPrompt += `User: ${currentUserInput}\\nAssistant:`;

  const apiEndpoint = `https://api-inference.huggingface.co/models/${modelId}`;
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;
  const requestBody: HuggingFaceTextGenerationRequest = {
    inputs: fullPrompt,
    parameters: { max_new_tokens: 2048, temperature: 0.5, return_full_text: false },
    options: { wait_for_model: true }
  };

  try {
    const response = await fetch(apiEndpoint, { method: 'POST', headers, body: JSON.stringify(requestBody) });
    if (!response.ok) { /* ... error handling ... */ throw new Error(`HF API Chat Error ${response.status}`); }
    const data: HuggingFaceTextGenerationResponse | { error?: string } = await response.json();
    if ('error' in data && data.error) throw new Error(`HF API Chat Error: ${data.error}`);
    const hfResponse = data as HuggingFaceTextGenerationResponse;
    if (hfResponse?.[0]?.generated_text) return hfResponse[0].generated_text.trim();
    throw new Error("Could not parse valid response from Hugging Face for chat.");
  } catch (error) {
    console.error("Error calling Hugging Face API (Chat):", error);
    throw new Error(`HF communication error (Chat): ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Frontend no longer directly uses these for primary tasks.
// Constants like HUGGING_FACE_DEFAULT_TEXT_MODEL might still be used in UI for display/config.
