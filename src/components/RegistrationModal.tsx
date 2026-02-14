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
      // @ts-ignore
      delete window[cbName];
      if (script.parentNode) script.parentNode.removeChild(script);
    }
    // @ts-ignore
    window[cbName] = (data: T) => {
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

  // MISE À JOUR ICI : Nouvelle URL de déploiement
  const DEFAULT_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby2QOJtSBLXavDoAssvNKFKgj30kG-nKXy8QM_ieicDB1mJmhqI6J5YPo1qewKE2UpM/exec";
  
  // Si vous avez des URLs spécifiques, vous pouvez les laisser ou utiliser la nouvelle par défaut
  const SCRIPT_URLS: Record<string, string> = {
    // "conf-ingenierie-petroliere": "URL_SPECIFIQUE_SI_BESOIN" 
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

    if (!name || name.length < 3) { setStatus("error"); setErrorMessage("Nom complet requis."); return; }
    if (!isValidEmail(email)) { setStatus("error"); setErrorMessage("Email invalide."); return; }
    if (!institution || institution.length < 2) { setStatus("error"); setErrorMessage("Institution requise."); return; }

    const participantTz = Intl.DateTimeFormat().resolvedOptions().timeZone || "Africa/Brazzaville";
    const eventId = conference.title;

    setStatus("checking");
    try {
      const checkUrl = `${GOOGLE_SCRIPT_URL}?action=check&email=${encodeURIComponent(email)}&eventId=${encodeURIComponent(eventId)}`;
      const check = await jsonp<CheckResult>(checkUrl);
      if (check.status !== "ok") { setStatus("error"); setErrorMessage(check.message || "Erreur serveur."); return; }
      if (check.exists) { setStatus("error"); setErrorMessage("Déjà inscrit."); return; }
    } catch {
      setStatus("error"); setErrorMessage("Erreur connexion check."); return;
    }

    setStatus("submitting");
    const payload = { name, email, institution, country, eventId, eventDate: conference.date, eventTime: conference.time, participantTz };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });
      setStatus("success");
      setTimeout(() => onClose(), 6000);
    } catch {
      setStatus("error"); setErrorMessage("Erreur envoi.");
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => (status === "submitting" || status === "checking" ? null : onClose())} />
      
      <div className="relative bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="bg-gradient-to-br from-blue-700 to-blue-900 p-8 text-white relative">
          <button onClick={() => onClose()} className="absolute top-6 right-6 text-white/40 hover:text-white">✕</button>
          <span className="inline-block bg-blue-500/30 border border-blue-400/30 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4">Inscription Rapide</span>
          <h2 className="text-2xl font-serif font-bold leading-tight">{conference.title}</h2>
          <div className="flex flex-wrap gap-4 mt-4 text-blue-100/70 text-sm">
             <span>{formatPrettyDateTime(conference.date, conference.time)}</span>
          </div>
        </div>

        <div className="p-8">
          {status === "success" ? (
            <div className="text-center py-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Inscription envoyée !</h3>
              <p className="text-slate-500 mb-6">Vérifiez vos emails (et spams).</p>
              <button onClick={onClose} className="px-8 py-3 rounded-xl bg-slate-100 font-bold">Fermer</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {status === "error" && <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm">⚠️ {errorMessage}</div>}
              
              <div className="grid grid-cols-2 gap-4">
                <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-600" placeholder="Prénom" value={formData.prenoms} onChange={e => setFormData({ ...formData, prenoms: e.target.value })} />
                <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-600" placeholder="Nom" value={formData.nom} onChange={e => setFormData({ ...formData, nom: e.target.value })} />
              </div>
              
              <input required type="email" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-600" placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
              
              <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-600" placeholder="Institution" value={formData.institution} onChange={e => setFormData({ ...formData, institution: e.target.value })} />
              
              <select required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-600 appearance-none" value={formData.pays} onChange={e => setFormData({ ...formData, pays: e.target.value })}>
                {COUNTRIES.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
              </select>

              <button type="submit" disabled={status === "submitting" || status === "checking"} className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 rounded-2xl shadow-xl flex justify-center gap-3">
                {(status === "checking" || status === "submitting") ? "En cours..." : "Confirmer"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;