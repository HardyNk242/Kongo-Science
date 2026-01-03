import type { ChatMessage } from "../types";

/**
 * Flag injecté par Vite (vite.config.ts)
 * true  = Gemini autorisé
 * false = Gemini désactivé (prod sans backend)
 */
declare const __GEMINI_ENABLED__: boolean;

const SYSTEM_INSTRUCTION = `
Tu es l'assistant IA de "Kongo Science", un portail dédié à l'excellence scientifique
en République Démocratique du Congo et dans le Bassin du Congo.

Ton but est d'aider les chercheurs, étudiants et passionnés à comprendre des concepts
scientifiques complexes.

Sois précis, professionnel, et mets en avant les contextes locaux
(faune, flore, géologie, culture scientifique congolaise) quand c'est pertinent.

Réponds en français de manière claire et structurée.
`;

export async function getScientificResponse(
  history: ChatMessage[],
  userPrompt: string
): Promise<string> {
  /**
   * ✅ AUCUNE CLÉ → AUCUN APPEL GEMINI → AUCUN CRASH
   */
  if (!__GEMINI_ENABLED__) {
    return "Assistant temporairement indisponible (clé API non configurée).";
  }

  try {
    /**
     * ✅ Import dynamique
     * Empêche Vite / le navigateur de crasher au chargement
     */
    const { GoogleGenAI } = await import("@google/genai");

    /**
     * ⚠️ En frontend, NE PAS exposer de clé en prod.
     * Cette variable sert uniquement en local si besoin.
     */
    const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY as string | undefined;

    if (!apiKey) {
      return "Assistant indisponible (clé API absente côté client).";
    }

    const ai = new GoogleGenAI({ apiKey });

    const contents = [
      ...history.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      })),
      {
        role: "user",
        parts: [{ text: userPrompt }],
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    return response.text ?? "Je n’ai pas pu générer de réponse.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Erreur technique de l’assistant. Veuillez réessayer plus tard.";
  }
}
