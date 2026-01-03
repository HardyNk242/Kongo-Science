import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

// Always use named parameter and process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
Tu es l'assistant IA de "Kongo Science", un portail dédié à l'excellence scientifique en République Démocratique du Congo et dans le Bassin du Congo.
Ton but est d'aider les chercheurs, étudiants et passionnés à comprendre des concepts scientifiques complexes.
Sois précis, professionnel, et mets en avant les contextes locaux (faune, flore, géologie, culture scientifique congolaise) quand c'est pertinent.
Réponds en français de manière claire et structurée.
`;

export const getScientificResponse = async (history: ChatMessage[], userPrompt: string) => {
  try {
    // Use ai.models.generateContent to query GenAI with model and contents.
    // systemInstruction is passed within the config object.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        })),
        { role: 'user', parts: [{ text: userPrompt }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    // Directly access the .text property of GenerateContentResponse.
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Désolé, j'ai rencontré une difficulté technique. Veuillez réessayer plus tard.";
  }
};