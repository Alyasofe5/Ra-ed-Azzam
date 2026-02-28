import { GoogleGenAI, Chat } from "@google/genai";
import { AI_SYSTEM_INSTRUCTION } from "../constants";

// Safe API key access for Vite environment
const getApiKey = () => {
  try {
    // Check for Vite environment variables first
    return import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || '';
  } catch (e) {
    return '';
  }
};

const apiKey = getApiKey();

// Initialize the client safely
const ai = apiKey && apiKey !== 'PLACEHOLDER_API_KEY' ? new GoogleGenAI({ apiKey }) : null;

export const sendMessageToGemini = async (message: string, history: any[]): Promise<string> => {
  if (!ai) {
    console.error("API Key is missing for Gemini");
    return "Sorry, the AI service is currently unavailable (API key missing).";
  }

  try {
    // Transform local history to SDK Content format
    // The history passed in excludes the current message being sent
    const formattedHistory = history.map(h => ({
      role: h.role,
      parts: [{ text: h.text }]
    }));

    // Create a new chat session with the previous history
    const chat: Chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: AI_SYSTEM_INSTRUCTION,
      },
      history: formattedHistory
    });

    // Send the new message
    const response = await chat.sendMessage({ message });
    return response.text || "Sorry, I couldn't understand that.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while connecting to the server. Please try again later.";
  }
};