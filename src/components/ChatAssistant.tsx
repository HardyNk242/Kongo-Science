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
        <div
          role="dialog"
          aria-label="Assistant Kongo Science"
          className="mb-4 w-[calc(100vw-3rem)] sm:w-96 h-[560px] max-h-[80vh] bg-white rounded-3xl shadow-2xl shadow-slate-900/20 border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          {/* Header dégradé */}
          <div className="relative bg-gradient-to-br from-slate-900 to-blue-900 p-5 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-sm font-serif font-bold border border-white/20">
                    KS
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900"></span>
                </div>
                <div>
                  <p className="font-serif font-bold text-base leading-tight">Assistant Kongo Science</p>
                  <p className="text-[10px] uppercase tracking-widest text-blue-200 font-bold mt-0.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                    En ligne · IA scientifique
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/10 rounded-full p-1.5 transition-colors"
                type="button"
                aria-label="Fermer l'assistant"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50" aria-live="polite">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === MessageRole.USER ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                {msg.role !== MessageRole.USER && (
                  <div className="w-7 h-7 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center mr-2 flex-shrink-0">
                    KS
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === MessageRole.USER
                      ? "bg-slate-900 text-white rounded-tr-sm"
                      : "bg-white text-slate-800 border border-slate-100 rounded-tl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                  KS
                </div>
                <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex gap-1.5">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:120ms]"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:240ms]"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex gap-2 items-end">
              <label htmlFor="chat-input" className="sr-only">Votre question</label>
              <input
                id="chat-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Posez une question scientifique…"
                disabled={isLoading}
                className="flex-1 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white rounded-xl px-4 py-3 text-sm outline-none transition-colors disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !inputValue.trim()}
                aria-label="Envoyer le message"
                className="bg-slate-900 hover:bg-blue-700 text-white p-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 flex-shrink-0"
                type="button"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 text-center">Propulsé par IA · Réponses scientifiques uniquement</p>
          </div>
        </div>
      )}

      {/* Bouton flottant */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative w-14 h-14 bg-slate-900 hover:bg-blue-700 text-white rounded-full shadow-2xl shadow-slate-900/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300"
        type="button"
        aria-label={isOpen ? "Fermer l'assistant" : "Ouvrir l'assistant"}
        aria-expanded={isOpen}
      >
        {/* Halo pulse */}
        {!isOpen && (
          <>
            <span className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white"></span>
          </>
        )}
        {isOpen ? (
          <svg className="w-6 h-6 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

export default ChatAssistant;
