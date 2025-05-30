
import { SelectedTechnologies, ChatMessage, ParsedBlueprint } from '../types';
// The detailed JSON prompt constructor (constructLocalLlmStackOverviewPromptJson)
// if different from Gemini's, would now reside on the backend.
// For now, we assume a similar prompt structure can be adapted by the backend.

// Note: In a "production-ready" setup with a backend proxy for AI,
// these direct calls from the frontend would be replaced by calls to your backend API,
// which then communicates with the Local LLM.

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
    console.error("Failed to parse JSON string from Local LLM:", cleanedJsonText, e);
    throw new Error(`Failed to parse JSON response from Local LLM. Content: "${cleanedJsonText.substring(0,100)}..."`);
  }
}

export const generateStackOverviewWithLocalLlm = async (
  selections: SelectedTechnologies,
  baseUrl: string,
  modelName: string,
): Promise<ParsedBlueprint> => {
  // This function would be called by the backend proxy, not directly from frontend.
  // If kept for direct frontend testing (requires user to run local LLM & handle CORS):
  console.warn("generateStackOverviewWithLocalLlm: Direct frontend call. In production, this should be via backend proxy.");
  if (!baseUrl || !modelName) {
    throw new Error("Local LLM base URL and model name are required.");
  }

  // The prompt (constructLocalLlmStackOverviewPromptJson) would be constructed here
  // or on the backend. For this example, assume a generic prompt structure.
  const promptContent = `Generate a project blueprint in JSON format for: ${JSON.stringify(selections)}. The JSON should include "overview", "suggestedFiles", and "nextSteps".`;
  
  const apiEndpoint = `${baseUrl.replace(/\/$/, '')}/api/generate`; // Common for Ollama-like
  const requestBody = { model: modelName, prompt: promptContent, format: "json", stream: false };

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Local LLM API request (Stack Overview) failed: ${response.status} - ${errorBody}`);
    }
    const data = await response.json();
    if (data.response) { // Ollama often puts JSON string in data.response
        const parsedJson = parseJsonFromString(data.response);
        if (!parsedJson.overview || !Array.isArray(parsedJson.suggestedFiles)) {
            throw new Error("Local LLM returned an invalid JSON structure for blueprint.");
        }
        return parsedJson as ParsedBlueprint;
    }
    throw new Error("Invalid response format from Local LLM for stack overview.");
  } catch (error) {
    console.error("Error calling Local LLM API (Stack Overview):", error);
    throw new Error(`Local LLM communication error (Stack Overview): ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const sendMessageToLocalLlm = async (
  currentUserInput: string,
  chatHistory: ChatMessage[],
  baseUrl: string,
  modelName: string,
): Promise<string> => { // Returns raw string, expected to be JSON
  // This function would be called by the backend proxy.
  // If kept for direct frontend testing:
  console.warn("sendMessageToLocalLlm: Direct frontend call. In production, this should be via backend proxy.");
  if (!baseUrl || !modelName) throw new Error("Local LLM config missing.");

  // Constructing a prompt with history for chat - backend would handle this more robustly
  const systemPrompt = "You are an AI assistant. Respond in JSON: { \"type\": \"textResponse\", \"message\": \"Your text answer here.\" } or { \"type\": \"fileOperation\", ... }";
  let fullPrompt = systemPrompt + '\\n';
  chatHistory.forEach(msg => {
    fullPrompt += `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.content}\\n`;
  });
  fullPrompt += `User: ${currentUserInput}\\nAssistant:`;

  const apiEndpoint = `${baseUrl.replace(/\/$/, '')}/api/generate`;
  const requestBody = { model: modelName, prompt: fullPrompt, format: "json", stream: false };

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Local LLM API request (Chat) failed: ${response.status} - ${errorBody}`);
    }
    const data = await response.json();
    if (data.response) return data.response; // Expected JSON string
    throw new Error("Invalid response format from Local LLM for chat.");
  } catch (error) {
    console.error("Error calling Local LLM API (Chat):", error);
    throw new Error(`Local LLM communication error (Chat): ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Frontend no longer directly initializes or uses these complex AI service functions
// for primary tasks like blueprint generation or chat. These are now backend responsibilities.
// The constants like LOCAL_LLM_DEFAULT_BASE_URL might still be used in UI for user configuration display.
