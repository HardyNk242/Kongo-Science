import React, { useState, useRef, useEffect, useMemo } from "react";
import { getScientificResponse } from "../services/geminiService";
import { ChatMessage, MessageRole } from "../types";

/**
 * IMPORTANT (GitHub Pages / site statique)
 * - On ne doit JAMAIS faire crasher toute l'app si la clé API est absente.
 * - On désactive l'assistant (ou on affiche un message) au lieu de throw.
 */
const ChatAssistant: React.FC = () => {
  // Cherche une clé côté Vite (.env) — à adapter si ton service lit un autre nom
  const apiKey = useMemo(() => {
    // Vite expose uniquement les variables qui commencent par VITE_
    // Exemple: VITE_GEMINI_API_KEY=xxx
    return (import.meta as any).env?.VITE_GEMINI_API_KEY as string | undefined;
  }, []);

  // Si pas de clé : on désactive le widget pour éviter la page blanche
  // (ou tu peux afficher une version "read-only" / un lien vers contact)
  const isChatEnabled = Boolean(apiKey);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: MessageRole.MODEL,
      text: "Bonjour ! Je suis l'assistant Kongo Science. Comment puis-je vous aider dans vos recherches aujourd'hui ?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!isChatEnabled) return;
    if (!inputValue.trim() || isLoading) return;

    const userMsg = inputValue.trim();
    setInputValue("");
    setIsLoading(true);

    // IMPORTANT: construire l'historique à jour (state async)
    const nextMessages = [...messages, { role: MessageRole.USER, text: userMsg }];
    setMessages(nextMessages);

    try {
      // ⚠️ On passe l'historique à jour pour éviter les décalages
      const response = await getScientificResponse(nextMessages, userMsg);

      setMessages((prev) => [
        ...prev,
        { role: MessageRole.MODEL, text: response || "Désolé, je n'ai pas pu générer une réponse." },
      ]);
    } catch (err) {
      console.error("ChatAssistant error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: MessageRole.MODEL,
          text:
            "⚠️ L'assistant rencontre un problème technique (clé API manquante ou configuration). " +
            "Merci de réessayer plus tard.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Si pas de clé : on montre juste un bouton “désactivé” ou on masque tout
  if (!isChatEnabled) {
    // Option 1: masquer complètement l'assistant (zéro risque)
    return null;

    // Option 2: laisser le bouton mais afficher un message (décommente si tu préfères)
    /*
    return (
      <div className="fixed bottom-6 right-6 z-[100]">
        <button
          type="button"
          className="w-14 h-14 bg-slate-400 text-white rounded-full shadow-lg flex items-center justify-center cursor-not-allowed"
          title="Assistant désactivé (API key manquante)"
        >
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
          </svg>
        </button>
      </div>
    );
    */
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-blue-700 p-4 text-white flex justify-between items-center shadow-md">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold">
                KS
              </div>
              <span className="font-bold">Assistant Kongo Science</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-600 rounded-full p-1 transition-colors"
              type="button"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === MessageRole.USER ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                    msg.role === MessageRole.USER
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white text-slate-800 border border-slate-200 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none flex gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-slate-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Posez une question scientifique..."
                className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="bg-blue-700 text-white p-2 rounded-xl hover:bg-blue-800 disabled:opacity-50 transition-colors"
                type="button"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-800 hover:scale-110 transition-all duration-300 group"
        type="button"
        aria-label={isOpen ? "Fermer l'assistant" : "Ouvrir l'assistant"}
      >
        {isOpen ? (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full border-2 border-white animate-ping"></span>
          </div>
        )}
      </button>
    </div>
  );
};

export default ChatAssistant;
