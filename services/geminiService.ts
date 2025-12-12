import { GoogleGenAI, Chat } from "@google/genai";
import { AI_SYSTEM_INSTRUCTION } from "../constants";

const apiKey = process.env.API_KEY || '';

// Initialize the client
// We initialize the AI client instance directly. 
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

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