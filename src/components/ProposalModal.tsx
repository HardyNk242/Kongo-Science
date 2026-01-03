import React, { useMemo, useState } from "react";
import { COUNTRIES } from "../constants";

interface Props {
  onClose: () => void;
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

const ProposalModal: React.FC<Props> = ({ onClose }) => {
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

  const handleClose = () => {
    if (status === "submitting") return;
    onClose();
  };

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
      // FIX: Reversion en mode "no-cors". Google Apps Script ne supporte pas bien les requêtes CORS POST complexes.
      // Le mode "no-cors" permet d'envoyer la requête. On ne peut pas lire la réponse, mais si fetch ne crash pas,
      // la requête a été transmise au serveur.
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", 
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });

      // En mode no-cors, on considère le succès si aucune exception n'est levée
      setStatus("success");
      setTimeout(() => onClose(), 6000);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMessage("Impossible de joindre le serveur. Vérifiez votre connexion internet.");
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={handleClose}
      />

      <div className="relative bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-800 to-indigo-900 p-8 text-white sticky top-0 z-10">
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
            aria-label="Fermer"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <span className="inline-block bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-4">
            Soumission de projet scientifique
          </span>
          <h2 className="text-3xl font-serif font-bold italic">Proposer une Conférence</h2>
          <p className="text-blue-100/70 text-sm mt-2">
            Valorisez vos recherches au sein de l’excellence Kongo Science.
          </p>
        </div>

        <div className="p-8 md:p-12">
          {status === "success" ? (
            <div className="text-center py-12 animate-in zoom-in-90">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-2">Proposition transmise !</h3>
              <p className="text-slate-500">
                Vous allez recevoir un email de confirmation après examen par le comité scientifique.
                <br />
                <span className="text-blue-600 font-medium">Pensez à vérifier vos spams.</span>
              </p>

              <button
                onClick={onClose}
                className="mt-8 px-8 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all"
              >
                Fermer
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {status === "error" && (
                <div className="bg-red-50 text-red-700 p-4 rounded-2xl text-sm border border-red-100">
                  <div className="font-bold mb-1">⚠️ Erreur de soumission</div>
                  <div>{errorMessage}</div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nom</label>
                  <input
                    required
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    placeholder="Votre nom"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Prénoms</label>
                  <input
                    required
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    placeholder="Vos prénoms"
                    value={formData.prenoms}
                    onChange={(e) => setFormData({ ...formData, prenoms: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">WhatsApp</label>
                  <input
                    required
                    type="tel"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    placeholder="+242 06 ..."
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    onBlur={(e) => setFormData({ ...formData, whatsapp: formatWhatsappHint(e.target.value) })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email professionnel</label>
                  <input
                    required
                    type="email"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    placeholder="chercheur@univ.cg"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Institution</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    placeholder="Université, Labo, Entreprise..."
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Pays</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all appearance-none cursor-pointer"
                    value={formData.pays}
                    onChange={(e) => setFormData({ ...formData, pays: e.target.value })}
                  >
                    {COUNTRIES.map((country) => (
                      <option key={country.code} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Titre de la conférence / formation</label>
                <input
                  required
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  placeholder="Ex: L’IA appliquée à la géologie du bassin du Congo"
                  value={formData.titre}
                  onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  Lien Google Drive vers votre CV
                  <span className="text-[9px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full lowercase font-medium">requis</span>
                </label>
                <input
                  required
                  type="url"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  placeholder="https://drive.google.com/file/d/..."
                  value={formData.cvLink}
                  onChange={(e) => setFormData({ ...formData, cvLink: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Résumé d’expertise & réalisations</label>
                <textarea
                  required
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all resize-none"
                  placeholder="Bref résumé (publications, projets, impacts, méthodes, etc.)"
                  value={formData.expertiseSummary}
                  onChange={(e) => setFormData({ ...formData, expertiseSummary: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Format de session</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all cursor-pointer"
                    value={formData.format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                  >
                    <option value="Recherche scientifique">Recherche scientifique</option>
                    <option value="Formation académique">Formation académique</option>
                    <option value="Atelier technique">Atelier technique</option>
                    <option value="Séminaire professionnel">Séminaire professionnel</option>
                    <option value="Colloque scientifique">Colloque scientifique</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tarification</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all cursor-pointer"
                    value={formData.tarif}
                    onChange={(e) => setFormData({ ...formData, tarif: e.target.value })}
                  >
                    <option value="Gratuit">Accès Gratuit pour tous</option>
                    <option value="Payant">Accès Payant (Formation)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Modalité</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="En ligne">En ligne</option>
                    <option value="Présentiel">Présentiel</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Date souhaitée</label>
                  <input
                    required
                    type="date"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Durée totale</label>
                  <input
                    required
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    placeholder="Ex: 1h30, 2h, 5j"
                    value={formData.duree}
                    onChange={(e) => setFormData({ ...formData, duree: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 mt-4"
              >
                {status === "submitting" ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Envoi en cours...</span>
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
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProposalModal;