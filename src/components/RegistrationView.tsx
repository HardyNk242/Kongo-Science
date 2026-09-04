import React, { useMemo, useState, useEffect } from "react";
import { Conference } from "../types";
import { COUNTRIES } from "../constants";
import Seo from "./Seo";

interface Props {
  conference: Conference;
  onBack: () => void;
}

// --- UTILITAIRES ---

function formatPrettyDateTime(isoDate: string, time: string): string {
  try {
    const [year, month, day] = isoDate.split("-");
    const months = [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];
    const m = parseInt(month, 10);
    return `${day} ${months[m - 1] ?? month} ${year} à ${time}`;
  } catch {
    return `${isoDate} à ${time}`;
  }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Fonction JSONP robuste pour le check d'existence (GET)
function jsonp<T>(url: string, timeoutMs = 8000): Promise<T> {
  return new Promise((resolve, reject) => {
    const cbName = `__jsonp_cb_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const script = document.createElement("script");

    const timer = window.setTimeout(() => {
      cleanup();
      reject(new Error("timeout"));
    }, timeoutMs);

    function cleanup() {
      window.clearTimeout(timer);
      delete (window as any)[cbName];
      if (script.parentNode) script.parentNode.removeChild(script);
    }

    (window as any)[cbName] = (data: T) => {
      cleanup();
      resolve(data);
    };

    const sep = url.includes("?") ? "&" : "?";
    script.src = `${url}${sep}callback=${cbName}`;
    script.onerror = () => {
      cleanup();
      reject(new Error("script_error"));
    };

    document.body.appendChild(script);
  });
}

type CheckResult = { status: "ok" | "error"; exists: boolean; message?: string };

/**
 * ✅ RÉSOLUTION INTELLIGENTE DE L'ID
 * 1. Cherche conference.id (ex: "conf-2024")
 * 2. Sinon, utilise le titre nettoyé
 * 3. Sinon, cherche dans le hash URL
 */
function resolveEventId(conference: Conference): string {
  const anyConf = conference as any;

  // Priorité 1 : L'ID explicite dans l'objet conférence
  if (anyConf?.id && String(anyConf.id).trim()) {
    return String(anyConf.id).trim();
  }

  // Priorité 2 : Si pas d'ID, on utilise le Titre (Attention : EventsPrivate doit utiliser le Titre en colonne A dans ce cas)
  if (conference.title) {
    return conference.title.trim();
  }

  // Fallback : Path URL
  const path = (window.location.pathname || "").replace(/^\/+/, "");
  const parts = path.split("/");
  if (parts[0] === "registration" && parts[1]) return String(parts[1]).trim();

  return "unknown-event";
}

const RegistrationView: React.FC<Props> = ({ conference, onBack }) => {
  useEffect(() => window.scrollTo(0, 0), []);

  const defaultCountry = useMemo(() => {
    const prefer = ["République du Congo", "Congo", "Congo, Republic of the", "Congo (Republic of the)"];
    for (const p of prefer) {
      const found = COUNTRIES.find(c => c.name === p);
      if (found) return found.name;
    }
    return COUNTRIES.find(c => c.name === "Congo, The Democratic Republic of the")?.name ?? (COUNTRIES[0]?.name ?? "N/A");
  }, []);

  const [formData, setFormData] = useState({
    nom: "",
    prenoms: "",
    pays: defaultCountry,
    institution: "",
    email: ""
  });

  const [status, setStatus] = useState<"idle" | "checking" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const DEFAULT_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbw-XKGABUep94GRlVd1X_t1O-8UeuFIlMAz_EGU1KTWjghlvbLrMnm73eT1Eff7jcis/exec";
  const SCRIPT_URLS: Record<string, string> = {
    "conf-ingenierie-petroliere":
      "https://script.google.com/macros/s/AKfycbxj29r4wCZte8QJBBIuE-JCTVQdh404NvuW3Hq6Hdy6ON4ZGw4uyu9jWTfDj3YLMDSKRg/exec"
  };
  const GOOGLE_SCRIPT_URL = SCRIPT_URLS[conference.id] ?? DEFAULT_SCRIPT_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "checking" || status === "submitting") return;

    setErrorMessage("");

    const email = formData.email.trim().toLowerCase();
    const name = `${formData.prenoms} ${formData.nom}`.replace(/\s+/g, " ").trim();
    const institution = formData.institution.trim();
    const country = formData.pays.trim() || "N/A";

    // Validation locale
    if (!name || name.length < 3) {
      setStatus("error");
      setErrorMessage("Veuillez renseigner votre nom complet.");
      return;
    }
    if (!isValidEmail(email)) {
      setStatus("error");
      setErrorMessage("Veuillez renseigner un email valide.");
      return;
    }
    if (!institution || institution.length < 2) {
      setStatus("error");
      setErrorMessage("Veuillez renseigner votre institution.");
      return;
    }

    const participantTz = Intl.DateTimeFormat().resolvedOptions().timeZone || "Africa/Brazzaville";

    // ✅ PRÉPARATION DES CLÉS POUR LE SCRIPT
    // eventId = Ce qui est dans la colonne A de 'EventsPrivate' (ex: "conf-peatlands")
    const eventId = resolveEventId(conference);
    // eventTitle = Le joli titre pour l'email
    const eventTitle = String(conference.title || eventId).trim();

    if (!eventId) {
      setStatus("error");
      setErrorMessage("Erreur technique : ID de l'événement introuvable.");
      return;
    }

    // 1. VERIFICATION DOUBLON (GET via JSONP)
    setStatus("checking");
    try {
      const checkUrl = `${GOOGLE_SCRIPT_URL}?action=check&email=${encodeURIComponent(email)}&eventId=${encodeURIComponent(eventId)}`;
      const check = await jsonp<CheckResult>(checkUrl);

      if (check.status !== "ok") {
        setStatus("error");
        setErrorMessage(check.message || "Erreur lors de la vérification.");
        return;
      }
      if (check.exists) {
        setStatus("error");
        setErrorMessage("Cette adresse email est déjà inscrite à cet événement.");
        return;
      }
    } catch (err) {
      console.warn("Check failed, skipping to submit", err);
      // On continue quand même vers le submit si le check échoue (fail-safe)
    }

    // 2. ENVOI FINAL (POST)
    setStatus("submitting");

    const payload = {
      name,
      email,
      institution,
      country,
      eventId,         // 🔑 Important : Doit matcher 'EventsPrivate' col A
      eventTitle,      // 📧 Important : Pour le titre du mail et du calendrier
      eventDate: conference.date,
      eventTime: conference.time,
      participantTz
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // Indispensable pour Google Apps Script
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });

      // Avec mode: 'no-cors', on ne peut pas lire la réponse, on assume le succès si pas d'erreur réseau
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMessage("Impossible de joindre le serveur. Vérifiez votre connexion.");
    }
  };

  // --- RENDU IDENTIQUE ---
  return (
    <div className="bg-white min-h-screen">
      {/* Sans ce bloc, les douze pages d'inscription partageaient le même titre
          et une canonique pointant toutes vers /registration : un moteur de
          recherche les aurait fusionnées en une seule. */}
      <Seo
        title={`${conference.title} — inscription`}
        description={`${conference.description} ${formatPrettyDateTime(conference.date, conference.time)}. ${conference.location}. Inscription gratuite.`}
        path={`/registration/${encodeURIComponent(conference.id)}`}
        type="article"
      />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-700 font-bold transition-colors group"
        >
          <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour à l'agenda
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-8 animate-in slide-in-from-left-4 duration-700">
          <div>
            <span className="inline-block bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-6">
              Portail d'Inscription
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-tight italic">
              {conference.title}
            </h1>
          </div>

          <div className="flex flex-col gap-6 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Date & Heure</div>
                <div className="text-slate-900 font-bold">{formatPrettyDateTime(conference.date, conference.time)}</div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-200">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              <div>
                <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Lieu / Plateforme</div>
                <div className="text-slate-900 font-bold">{conference.location}</div>
                <div className="text-slate-500 text-xs mt-1 italic">{conference.type}</div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-content-center text-white shadow-lg shadow-green-200">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Organisateur</div>
                <div className="text-slate-900 font-bold">{conference.organizer}</div>
              </div>
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed italic border-l-4 border-blue-100 pl-6">
            "{conference.description}"
          </p>
        </div>

        <div className="animate-in slide-in-from-right-4 duration-700">
          <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
            {status === "success" ? (
              <div className="text-center py-12 animate-in zoom-in-90 duration-300">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">Félicitations !</h3>
                <p className="text-slate-500 mb-10 leading-relaxed">
                  Votre inscription a été validée avec succès.
                  Un email contenant les détails de l'événement et votre invitation calendrier (.ics) vous a été envoyé.
                  <br /><br />
                  <span className="text-blue-600 font-bold">À bientôt pour cet échange scientifique !</span>
                </p>
                <button
                  onClick={onBack}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl"
                >
                  Retour à l'accueil
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-slate-900 mb-8">Formulaire d'inscription</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {status === "error" && (
                    <div className="bg-red-50 text-red-700 p-5 rounded-2xl text-sm border border-red-100 flex gap-3 items-center">
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      {errorMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Prénom</label>
                      <input
                        required
                        type="text"
                        className="w-full bg-slate-5 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                        value={formData.prenoms}
                        onChange={e => setFormData({ ...formData, prenoms: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom</label>
                      <input
                        required
                        type="text"
                        className="w-full bg-slate-5 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                        value={formData.nom}
                        onChange={e => setFormData({ ...formData, nom: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Académique / Pro</label>
                    <input
                      required
                      type="email"
                      className="w-full bg-slate-5 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Institution</label>
                    <input
                      required
                      type="text"
                      className="w-full bg-slate-5 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                      value={formData.institution}
                      onChange={e => setFormData({ ...formData, institution: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pays de résidence</label>
                    <select
                      required
                      className="w-full bg-slate-5 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all appearance-none cursor-pointer"
                      value={formData.pays}
                      onChange={e => setFormData({ ...formData, pays: e.target.value })}
                    >
                      {COUNTRIES.map(c => (
                        <option key={c.code} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={status === "submitting" || status === "checking"}
                      className="w-full bg-blue-700 hover:bg-blue-800 text-white font-black py-5 rounded-2xl shadow-2xl shadow-blue-200 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                    >
                      {(status === "checking" || status === "submitting") ? (
                        <>
                          <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>{status === "checking" ? "Vérification..." : "Finalisation..."}</span>
                        </>
                      ) : (
                        <>
                          <span>Confirmer mon inscription</span>
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </>
                      )}
                    </button>
                    <p className="text-center text-slate-400 text-[10px] mt-6 leading-relaxed">
                      En vous inscrivant, vous acceptez de recevoir les communications liées à cet événement par email.
                    </p>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationView;
