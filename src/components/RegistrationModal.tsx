import React, { useMemo, useState } from "react";
import { Conference } from "../types";
import { COUNTRIES } from "../constants";

interface Props {
  conference: Conference;
  onClose: () => void;
}

/** Formate une date ISO YYYY-MM-DD en format FR */
function formatPrettyDateTime(isoDate: string, time: string): string {
  try {
    const [year, month, day] = isoDate.split("-");
    const months = [
      "Janvier","Février","Mars","Avril","Mai","Juin",
      "Juillet","Août","Septembre","Octobre","Novembre","Décembre"
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

/** JSONP helper (contourne CORS) */
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
      // Fix: Removed unused @ts-expect-error directive and cast to any for dynamic property access
      delete (window as any)[cbName];
      if (script.parentNode) script.parentNode.removeChild(script);
    }

    // Fix: Removed unused @ts-expect-error directive and cast to any for dynamic property access
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

const RegistrationModal: React.FC<Props> = ({ conference, onClose }) => {
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

  // ⚠️ Ton URL Apps Script (celle qui finit par /exec)
  const DEFAULT_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyjqDo9cSCncf_KKMJB6LGRXyAKuwtfs3ZDfyt_fV0w1eP74LosMvDSTK5LP73NXU12/exec";
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
    const eventId = conference.title;

    // 1) ✅ Pré-check "Déjà inscrit" via JSONP (GET)
    setStatus("checking");
    try {
      const checkUrl =
        `${GOOGLE_SCRIPT_URL}?action=check&email=${encodeURIComponent(email)}&eventId=${encodeURIComponent(eventId)}`;

      const check = await jsonp<CheckResult>(checkUrl);

      if (check.status !== "ok") {
        setStatus("error");
        setErrorMessage(check.message || "Erreur serveur (check).");
        return;
      }
      if (check.exists) {
        setStatus("error");
        setErrorMessage("Vous êtes déjà inscrit à cet événement.");
        return;
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage("Impossible de vérifier l'inscription (connexion). Réessayez.");
      return;
    }

    // 2) ✅ Envoi réel (POST no-cors) — ultra fiable
    setStatus("submitting");

    const payload = {
      name,
      email,
      institution,
      country,
      eventId,
      eventDate: conference.date,
      eventTime: conference.time,
      participantTz
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });

      // en no-cors, on ne peut pas lire la réponse -> succès si pas d’exception
      setStatus("success");
      setTimeout(() => onClose(), 6000);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMessage("Impossible de joindre le serveur. Vérifiez votre connexion.");
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => (status === "submitting" || status === "checking" ? null : onClose())}
      />

      <div className="relative bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
        <div className="bg-gradient-to-br from-blue-700 to-blue-900 p-8 text-white relative">
          <button
            onClick={() => (status === "submitting" || status === "checking" ? null : onClose())}
            className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
            aria-label="Fermer"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <span className="inline-block bg-blue-500/30 border border-blue-400/30 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Inscription Officielle
          </span>

          <h2 className="text-2xl font-serif font-bold leading-tight">{conference.title}</h2>

          <div className="flex flex-wrap gap-4 mt-4 text-blue-100/70 text-sm">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatPrettyDateTime(conference.date, conference.time)}
            </div>
          </div>
        </div>

        <div className="p-8">
          {status === "success" ? (
            <div className="text-center py-8 animate-in zoom-in-90 duration-300">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Inscription envoyée !</h3>
              <p className="text-slate-500 mb-6 px-4">
                Vous allez recevoir un email de confirmation avec votre <b>invitation calendrier (.ics)</b>.
                <br />
                <small className="mt-2 block text-blue-600 font-medium">Pensez à vérifier vos spams.</small>
              </p>
              <button
                onClick={onClose}
                className="px-8 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all"
              >
                Fermer
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {status === "error" && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-100">
                  ⚠️ {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Prénom</label>
                  <input
                    required
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    placeholder="Jean"
                    value={formData.prenoms}
                    onChange={e => setFormData({ ...formData, prenoms: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nom</label>
                  <input
                    required
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    placeholder="Mbuyi"
                    value={formData.nom}
                    onChange={e => setFormData({ ...formData, nom: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                <input
                  required
                  type="email"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  placeholder="votre.email@exemple.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Institution</label>
                <input
                  required
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  placeholder="Université, Labo, Entreprise..."
                  value={formData.institution}
                  onChange={e => setFormData({ ...formData, institution: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Pays</label>
                <select
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all appearance-none cursor-pointer"
                  value={formData.pays}
                  onChange={e => setFormData({ ...formData, pays: e.target.value })}
                >
                  {COUNTRIES.map(country => (
                    <option key={country.code} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={status === "submitting" || status === "checking"}
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                >
                  {(status === "checking" || status === "submitting") ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>{status === "checking" ? "Vérification..." : "Envoi en cours..."}</span>
                    </>
                  ) : (
                    <>
                      <span>Confirmer l'inscription</span>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;
