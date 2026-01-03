import React, { useMemo, useState, useEffect } from "react";
import { COUNTRIES, PROPOSAL_PSYCHOLOGY } from "../constants";

interface Props {
  onBack: () => void;
}

type Status = "idle" | "submitting" | "success" | "error";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidUrl(u: string): boolean {
  try {
    const url = new URL(u);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function normalize(s: string) {
  return (s || "").replace(/\s+/g, " ").trim();
}

function digitsOnly(s: string) {
  return (s || "").replace(/\D/g, "");
}

function formatWhatsappHint(input: string) {
  const d = digitsOnly(input);
  if (!d) return input;
  if (d.startsWith("242") && d.length >= 9) {
    const rest = d.slice(3);
    const groups = rest.match(/.{1,2}/g) || [];
    return `+242 ${groups.join(" ")}`.trim();
  }
  if (d.startsWith("82") && d.length >= 9) {
    const rest = d.slice(2);
    const groups = rest.match(/.{1,2}/g) || [];
    return `+82 ${groups.join(" ")}`.trim();
  }
  return input;
}

const ProposalView: React.FC<Props> = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const defaultCountry = useMemo(() => {
    const prefer = [
      "République du Congo",
      "Congo",
      "Congo (Republic of the)",
      "Congo, Republic of the",
      "Congo, Republic of",
    ];
    for (const p of prefer) {
      const found = COUNTRIES.find((c) => c.name === p);
      if (found) return found.name;
    }
    return COUNTRIES[0]?.name ?? "N/A";
  }, []);

  const [formData, setFormData] = useState({
    nom: "",
    prenoms: "",
    whatsapp: "",
    email: "",
    titre: "",
    type: "En ligne",
    date: "",
    duree: "",
    tarif: "Gratuit",
    format: "Recherche scientifique",
    cvLink: "",
    expertiseSummary: "",
    pays: defaultCountry,
    institution: "",
  });

  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbz5gO1pZtR9HnMnQbGzzP67c8eYPGUpY335vTAZXgdq4D_XwSnj3L6PFtl0S17r70s7QA/exec";

  const selectedPsychology = useMemo(() => {
    return (PROPOSAL_PSYCHOLOGY.formats as any)[formData.format] || PROPOSAL_PSYCHOLOGY.formats["Recherche scientifique"];
  }, [formData.format]);

  const validate = () => {
    const nom = normalize(formData.nom);
    const prenoms = normalize(formData.prenoms);
    const name = normalize(`${prenoms} ${nom}`);
    const email = normalize(formData.email).toLowerCase();
    const whatsapp = normalize(formData.whatsapp);
    const titre = normalize(formData.titre);
    const date = normalize(formData.date);
    const duree = normalize(formData.duree);
    const cvLink = normalize(formData.cvLink);
    const expertiseSummary = normalize(formData.expertiseSummary);

    if (!prenoms || prenoms.length < 2) return "Veuillez renseigner vos prénoms.";
    if (!nom || nom.length < 2) return "Veuillez renseigner votre nom.";
    if (name.length < 3) return "Veuillez renseigner votre nom complet.";
    if (!isValidEmail(email)) return "Veuillez renseigner un email valide.";
    if (digitsOnly(whatsapp).length < 8) return "Veuillez renseigner un numéro WhatsApp valide.";
    if (!titre || titre.length < 6) return "Veuillez renseigner un titre plus précis (min 6 caractères).";
    if (!date) return "Veuillez choisir une date souhaitée.";
    if (!duree || duree.length < 2) return "Veuillez renseigner la durée.";
    if (!cvLink || !isValidUrl(cvLink)) return "Veuillez fournir un lien valide pour le CV.";
    if (!expertiseSummary || expertiseSummary.length < 20)
      return "Veuillez écrire un résumé d'expertise (min 20 caractères).";

    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;

    const err = validate();
    if (err) {
      setStatus("error");
      setErrorMessage(err);
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    const clientTz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

    const payload = {
      nom: normalize(formData.nom),
      prenoms: normalize(formData.prenoms),
      name: normalize(`${formData.prenoms} ${formData.nom}`),
      whatsapp: normalize(formData.whatsapp),
      email: normalize(formData.email).toLowerCase(),
      titre: normalize(formData.titre),
      type: normalize(formData.type) || "En ligne",
      date: normalize(formData.date),
      duree: normalize(formData.duree),
      tarif: normalize(formData.tarif) || "Gratuit",
      format: normalize(formData.format) || "Recherche scientifique",
      cvLink: normalize(formData.cvLink),
      expertiseSummary: normalize(formData.expertiseSummary),
      country: normalize(formData.pays) || "N/A",
      institution: normalize(formData.institution) || "N/A",
      clientTz,
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", 
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });

      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMessage("Impossible de joindre le serveur. Vérifiez votre connexion internet.");
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-700 font-bold transition-colors group"
        >
          <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour à l'accueil
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-10 animate-in slide-in-from-left-4 duration-700">
          <div>
            <span className="inline-block bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-6">
              Soumission de projet
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-tight italic">
              {PROPOSAL_PSYCHOLOGY.main_promise}
            </h1>
            <p className="mt-6 text-slate-600 leading-relaxed text-lg italic">
              « {PROPOSAL_PSYCHOLOGY.strategic_question} »
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] border border-slate-800 shadow-xl group">
               <div className="flex gap-5 items-center mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <h4 className="font-bold text-blue-400 uppercase tracking-widest text-xs">La Promesse Kongo Science</h4>
               </div>
               <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                  <h3 className="text-xl font-bold mb-4">{formData.format}</h3>
                  <p className="text-slate-300 leading-relaxed italic">
                    {selectedPsychology.promise}
                  </p>
               </div>
            </div>

            <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex gap-5 items-center group">
               <div className="w-14 h-14 bg-indigo-700 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.673.337a4 4 0 01-2.574.345l-2.387-.477a2 2 0 00-1.022.547l-1.162 1.162a1 1 0 00.904 1.678h13.39a1 1 0 00.904-1.678l-1.162-1.162zM10 9V4m0 0L8 6m2-2l2 2m2 4h7m-7 0a3 3 0 01-3 3V7a3 3 0 013 3z" /></svg>
               </div>
               <div>
                  <h4 className="font-bold text-slate-900">Impact Psychologique</h4>
                  <p className="text-sm text-slate-500 italic">Offrez du {selectedPsychology.want.toLowerCase()}</p>
               </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-10 rounded-[2.5rem] border border-blue-100">
             <h4 className="text-blue-900 font-bold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Conseil Stratégique
             </h4>
             <p className="text-blue-700 text-sm leading-relaxed italic">
                Ne vendez pas une conférence. Vendez une solution à une tension interne : légitimité, crédibilité et reconnaissance institutionnelle. Kongo Science est votre partenaire de sécurité académique.
             </p>
          </div>
        </div>

        <div className="animate-in slide-in-from-right-4 duration-700">
          <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-2xl relative">
            {status === "success" ? (
              <div className="text-center py-12 animate-in zoom-in-90 duration-300">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">Proposition reçue !</h3>
                <p className="text-slate-500 mb-10 leading-relaxed">
                  Votre dossier est maintenant entre les mains du comité scientifique. Nous vous contacterons via WhatsApp ou Email sous 72h.
                </p>
                <button
                  onClick={onBack}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl"
                >
                  Retour à l'accueil
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {status === "error" && (
                  <div className="bg-red-50 text-red-700 p-5 rounded-2xl text-sm border border-red-100 flex gap-3 items-center">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Prénoms</label>
                    <input
                      required
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                      placeholder="Vos prénoms"
                      value={formData.prenoms}
                      onChange={e => setFormData({ ...formData, prenoms: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom</label>
                    <input
                      required
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                      placeholder="Votre nom"
                      value={formData.nom}
                      onChange={e => setFormData({ ...formData, nom: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp</label>
                    <input
                      required
                      type="tel"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                      placeholder="+242 06 ..."
                      value={formData.whatsapp}
                      onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                      onBlur={e => setFormData({ ...formData, whatsapp: formatWhatsappHint(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Pro</label>
                    <input
                      required
                      type="email"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                      placeholder="chercheur@univ.cg"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Institution</label>
                  <input
                    required
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                    placeholder="Université, Labo, Entreprise..."
                    value={formData.institution}
                    onChange={e => setFormData({ ...formData, institution: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Titre de l'intervention</label>
                  <input
                    required
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                    placeholder="Ex: L’IA appliquée à la géologie du bassin du Congo"
                    value={formData.titre}
                    onChange={e => setFormData({ ...formData, titre: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lien CV (Google Drive)</label>
                  <input
                    required
                    type="url"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                    placeholder="https://drive.google.com/..."
                    value={formData.cvLink}
                    onChange={e => setFormData({ ...formData, cvLink: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Expertise & Résumé</label>
                  <textarea
                    required
                    rows={4}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all resize-none"
                    placeholder="Bref résumé de vos succès récents et de l'intervention proposée..."
                    value={formData.expertiseSummary}
                    onChange={e => setFormData({ ...formData, expertiseSummary: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Format</label>
                    <select
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all cursor-pointer font-bold text-indigo-700"
                      value={formData.format}
                      onChange={e => setFormData({ ...formData, format: e.target.value })}
                    >
                      <option value="Recherche scientifique">Recherche scientifique</option>
                      <option value="Formation académique">Formation académique</option>
                      <option value="Atelier technique">Atelier technique</option>
                      <option value="Séminaire professionnel">Séminaire professionnel</option>
                      <option value="Colloque scientifique">Colloque scientifique</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tarif</label>
                    <select
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all cursor-pointer"
                      value={formData.tarif}
                      onChange={e => setFormData({ ...formData, tarif: e.target.value })}
                    >
                      <option value="Gratuit">Accès Gratuit</option>
                      <option value="Payant">Accès Payant</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Modalité</label>
                    <select
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all cursor-pointer"
                      value={formData.type}
                      onChange={e => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="En ligne">En ligne</option>
                      <option value="Présentiel">Présentiel</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date souhaitée</label>
                    <input
                      required
                      type="date"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Durée totale</label>
                    <input
                      required
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                      placeholder="Ex: 1h30, 2h, 5j"
                      value={formData.duree}
                      onChange={e => setFormData({ ...formData, duree: e.target.value })}
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-black py-5 rounded-2xl shadow-2xl shadow-indigo-200 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                  >
                    {status === "submitting" ? (
                      <>
                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Transmission...</span>
                      </>
                    ) : (
                      <>
                        <span>Envoyer ma proposition</span>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
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
    </div>
  );
};

export default ProposalView;