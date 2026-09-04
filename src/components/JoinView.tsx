import React, { useMemo, useState, useEffect } from "react";
import {
  COUNTRIES,
  JOIN_PROFILES,
  MEMBERSHIP_PSYCHOLOGY,
  EXPERTISE_DOMAINS,
  CONTRIBUTION_AREAS,
  AVAILABILITY_OPTIONS,
  ACADEMIC_LEVELS,
  type JoinProfile,
} from "../constants";

import {
  FORM_ENDPOINTS,
  CONTACT_EMAIL as CONTACT_EMAIL_CONFIG,
  CONTACT_EMAIL_FALLBACK,
} from "../config/forms";

interface Props {
  onBack: () => void;
}

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Point de collecte des candidatures, défini dans src/config/forms.ts.
 * S'il est vide, le formulaire bascule sur un envoi par courriel plutôt que
 * de perdre la saisie du candidat.
 * Code du script : docs/rejoindre-apps-script.gs
 */
const JOIN_SCRIPT_URL: string = FORM_ENDPOINTS.rejoindre;

/** Adresse principale affichée au candidat. */
const CONTACT_EMAIL = CONTACT_EMAIL_CONFIG;

/** Boîte institutionnelle mise en copie, indépendante du domaine. */
const CONTACT_EMAIL_CC = CONTACT_EMAIL_FALLBACK;

/** Longueur en dessous de laquelle une motivation reste trop vague pour être départagée. */
const MOTIVATION_MIN = 180;

// --- UTILITAIRES (mêmes conventions que ProposalView) ---

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

const JoinView: React.FC<Props> = ({ onBack }) => {
  useEffect(() => window.scrollTo(0, 0), []);

  const defaultCountry = useMemo(() => {
    const found = COUNTRIES.find((c) => c.name === "Congo, Republic of");
    return found?.name ?? COUNTRIES[0]?.name ?? "N/A";
  }, []);

  const [formData, setFormData] = useState({
    profil: JOIN_PROFILES[0] as JoinProfile,
    prenoms: "",
    nom: "",
    email: "",
    whatsapp: "",
    pays: defaultCountry,
    institution: "",
    fonction: "",
    niveau: ACADEMIC_LEVELS[2],
    orcid: "",
    profilLink: "",
    domaines: [] as string[],
    contributions: [] as string[],
    disponibilite: AVAILABILITY_OPTIONS[1],
    langues: ["Français"] as string[],
    motivation: "",
    consentNom: false,
    consentData: false,
  });

  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [sentByEmail, setSentByEmail] = useState(false);

  const psychology = MEMBERSHIP_PSYCHOLOGY.profiles[formData.profil];

  const isReviewerLike =
    formData.profil === "Relecteur scientifique" || formData.profil === "Comité éditorial";
  const isStudent = formData.profil === "Étudiant / Jeune chercheur";

  const motivationCount = formData.motivation.trim().length;
  const motivationRatio = Math.min(100, Math.round((motivationCount / MOTIVATION_MIN) * 100));

  // --- Bascules de cases à cocher ---
  const toggleInList = (field: "domaines" | "contributions" | "langues", value: string) => {
    setFormData((prev) => {
      const list = prev[field];
      return {
        ...prev,
        [field]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
      };
    });
  };

  // --- Validation ---
  const validate = (): string | null => {
    const prenoms = normalize(formData.prenoms);
    const nom = normalize(formData.nom);
    const email = normalize(formData.email).toLowerCase();
    const institution = normalize(formData.institution);
    const profilLink = normalize(formData.profilLink);
    const motivation = normalize(formData.motivation);

    if (prenoms.length < 2 || nom.length < 2) return "Veuillez renseigner votre prénom et votre nom.";
    if (!isValidEmail(email)) return "Veuillez renseigner une adresse email valide.";
    if (institution.length < 2) return "Veuillez indiquer votre institution ou votre employeur.";
    if (formData.domaines.length === 0) return "Sélectionnez au moins un domaine scientifique.";
    if (formData.langues.length === 0) return "Indiquez au moins une langue de travail.";
    if (profilLink && !isValidUrl(profilLink))
      return "Le lien vers vos publications doit commencer par https://";
    if (isReviewerLike && !profilLink)
      return "Pour une candidature de relecteur ou d'éditeur, un lien vers vos publications (ORCID, Google Scholar, CV en ligne) est indispensable.";
    if (motivation.length < MOTIVATION_MIN)
      return `Votre message fait ${motivation.length} caractères. Développez-le jusqu'à ${MOTIVATION_MIN} au minimum : c'est lui qui départage les candidatures.`;
    if (!formData.consentData)
      return "Merci d'accepter que vos informations soient utilisées pour traiter votre candidature.";

    return null;
  };

  const buildPayload = () => ({
    profil: formData.profil,
    prenoms: normalize(formData.prenoms),
    nom: normalize(formData.nom),
    name: normalize(`${formData.prenoms} ${formData.nom}`),
    email: normalize(formData.email).toLowerCase(),
    whatsapp: normalize(formData.whatsapp) || "N/A",
    pays: normalize(formData.pays) || "N/A",
    institution: normalize(formData.institution),
    fonction: normalize(formData.fonction) || "N/A",
    niveau: formData.niveau,
    orcid: normalize(formData.orcid) || "N/A",
    profilLink: normalize(formData.profilLink) || "N/A",
    domaines: formData.domaines.join(" ; "),
    contributions: formData.contributions.join(" ; ") || "N/A",
    disponibilite: formData.disponibilite,
    langues: formData.langues.join(" ; "),
    motivation: normalize(formData.motivation),
    consentNom: formData.consentNom ? "Oui" : "Non",
    clientTz: Intl.DateTimeFormat().resolvedOptions().timeZone || "Africa/Brazzaville",
    dateEnvoi: new Date().toISOString(),
  });

  /** Repli courriel : ouvre le client de messagerie avec la candidature déjà rédigée. */
  const sendByEmail = (p: ReturnType<typeof buildPayload>) => {
    const corps = [
      `Profil souhaité : ${p.profil}`,
      `Nom : ${p.name}`,
      `Email : ${p.email}`,
      `WhatsApp : ${p.whatsapp}`,
      `Pays : ${p.pays}`,
      `Institution : ${p.institution}`,
      `Fonction : ${p.fonction}`,
      `Niveau : ${p.niveau}`,
      `ORCID : ${p.orcid}`,
      `Publications : ${p.profilLink}`,
      `Domaines : ${p.domaines}`,
      `Contributions : ${p.contributions}`,
      `Disponibilité : ${p.disponibilite}`,
      `Langues : ${p.langues}`,
      `Accord affichage du nom : ${p.consentNom}`,
      "",
      "--- Message ---",
      p.motivation,
    ].join("\n");

    const href =
      `mailto:${CONTACT_EMAIL}` +
      `?cc=${encodeURIComponent(CONTACT_EMAIL_CC)}` +
      `&subject=${encodeURIComponent(`Candidature ${p.profil} — ${p.name}`)}` +
      `&body=${encodeURIComponent(corps)}`;

    window.location.href = href;
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
    const payload = buildPayload();

    // Tant que le script de collecte n'est pas déployé, on n'égare aucune candidature :
    // elle part par courriel avec exactement les mêmes champs.
    if (!JOIN_SCRIPT_URL) {
      sendByEmail(payload);
      setSentByEmail(true);
      setStatus("success");
      return;
    }

    try {
      await fetch(JOIN_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // Indispensable pour Google Apps Script
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
      setSentByEmail(false);
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMessage("Impossible de joindre le serveur. Vérifiez votre connexion internet.");
    }
  };

  // --- Styles réutilisés ---
  const labelCls = "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1";
  const inputCls =
    "w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all";

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

      <div className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

        {/* ================= COLONNE GAUCHE : GUIDE RÉDACTIONNEL ================= */}
        <div className="space-y-8 animate-in slide-in-from-left-4 duration-700 lg:sticky lg:top-28">
          <div>
            <span className="inline-block bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-6">
              Rejoindre la communauté
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-tight italic">
              {MEMBERSHIP_PSYCHOLOGY.main_promise}
            </h1>
            <p className="mt-6 text-slate-600 leading-relaxed text-lg italic">
              « {MEMBERSHIP_PSYCHOLOGY.strategic_question} »
            </p>
          </div>

          {/* Promesse liée au profil sélectionné */}
          <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] border border-slate-800 shadow-xl group">
            <div className="flex gap-5 items-center mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="font-bold text-blue-400 uppercase tracking-widest text-xs">Notre engagement</h4>
            </div>
            <div key={formData.profil} className="animate-in fade-in slide-in-from-top-2 duration-500">
              <h3 className="text-xl font-bold mb-4">{formData.profil}</h3>
              <p className="text-slate-300 leading-relaxed italic">{psychology.promise}</p>
            </div>
          </div>

          {/* Ce que nous lisons vraiment */}
          <div key={`tips-${formData.profil}`} className="bg-blue-50 p-8 rounded-[2.5rem] border border-blue-100 animate-in fade-in duration-500">
            <h4 className="text-blue-900 font-bold mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Ce que nous lisons vraiment
            </h4>
            <p className="text-blue-800/70 text-xs italic mb-5">{psychology.focus}</p>
            <ul className="space-y-4">
              {psychology.writeWell.map((tip, i) => (
                <li key={i} className="flex gap-4 text-sm text-blue-900 leading-relaxed">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-700 text-white rounded-lg flex items-center justify-center text-[11px] font-black">
                    {i + 1}
                  </span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Exemple fort vs exemple faible */}
          <div key={`ex-${formData.profil}`} className="space-y-4 animate-in fade-in duration-500">
            <div className="bg-white border-2 border-green-200 rounded-[2rem] p-6">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[10px] font-black uppercase tracking-widest text-green-700">Ce qui retient l'attention</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed italic">« {psychology.exampleGood} »</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-6 opacity-80">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Trop vague pour être départagé</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed italic">« {psychology.exampleWeak} »</p>
            </div>
          </div>
        </div>

        {/* ================= COLONNE DROITE : FORMULAIRE ================= */}
        <div className="animate-in slide-in-from-right-4 duration-700">
          <div className="bg-white border border-slate-100 rounded-[3rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">

            {status === "success" ? (
              <div className="text-center py-12 animate-in zoom-in-90 duration-300">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">Candidature transmise</h3>

                {sentByEmail ? (
                  <p className="text-slate-500 mb-10 leading-relaxed">
                    Votre logiciel de messagerie vient de s'ouvrir avec votre candidature déjà rédigée.
                    <strong className="text-slate-700"> Il ne reste qu'à l'envoyer.</strong>
                    <br /><br />
                    S'il ne s'est pas ouvert, écrivez directement à{" "}
                    <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-600 font-bold hover:underline">
                      {CONTACT_EMAIL}
                    </a>{" "}ou à{" "}
                    <a href={`mailto:${CONTACT_EMAIL_CC}`} className="text-blue-600 font-bold hover:underline">
                      {CONTACT_EMAIL_CC}
                    </a>.
                  </p>
                ) : (
                  <p className="text-slate-500 mb-10 leading-relaxed">
                    Merci. Le bureau examine votre candidature et vous répond{" "}
                    <strong className="text-slate-700">sous deux semaines</strong> — quelle que soit l'issue.
                    <br /><br />
                    <span className="text-blue-600 font-bold">Bienvenue dans la démarche Kongo Science.</span>
                  </p>
                )}

                <button
                  onClick={onBack}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl"
                >
                  Retour à l'accueil
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Formulaire d'adhésion</h3>
                <p className="text-slate-500 text-sm mb-8">
                  Comptez cinq minutes. Les champs marqués d'une étoile sont obligatoires.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {status === "error" && (
                    <div role="alert" className="bg-red-50 text-red-700 p-5 rounded-2xl text-sm border border-red-100 flex gap-3 items-start">
                      <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      {errorMessage}
                    </div>
                  )}

                  {/* --- PROFIL --- */}
                  <div className="space-y-2">
                    <label htmlFor="profil" className={labelCls}>Je souhaite rejoindre en tant que *</label>
                    <select
                      id="profil"
                      required
                      className={`${inputCls} appearance-none cursor-pointer font-bold text-slate-900`}
                      value={formData.profil}
                      onChange={(e) => setFormData({ ...formData, profil: e.target.value as JoinProfile })}
                    >
                      {JOIN_PROFILES.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                    <p className="text-[11px] text-slate-400 ml-1 italic">
                      Le guide de rédaction à gauche s'adapte au profil choisi.
                    </p>
                  </div>

                  {/* --- IDENTITÉ --- */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="prenoms" className={labelCls}>Prénom *</label>
                      <input id="prenoms" required type="text" className={inputCls}
                        value={formData.prenoms}
                        onChange={(e) => setFormData({ ...formData, prenoms: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="nom" className={labelCls}>Nom *</label>
                      <input id="nom" required type="text" className={inputCls}
                        value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="email" className={labelCls}>Email *</label>
                      <input id="email" required type="email" className={inputCls}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="whatsapp" className={labelCls}>WhatsApp</label>
                      <input id="whatsapp" type="tel" placeholder="+242 06 000 00 00" className={inputCls}
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="pays" className={labelCls}>Pays de résidence *</label>
                      <select id="pays" required className={`${inputCls} appearance-none cursor-pointer`}
                        value={formData.pays}
                        onChange={(e) => setFormData({ ...formData, pays: e.target.value })}>
                        {COUNTRIES.map((c) => (
                          <option key={c.code} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="niveau" className={labelCls}>Statut académique *</label>
                      <select id="niveau" required className={`${inputCls} appearance-none cursor-pointer`}
                        value={formData.niveau}
                        onChange={(e) => setFormData({ ...formData, niveau: e.target.value })}>
                        {ACADEMIC_LEVELS.map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="institution" className={labelCls}>Institution / Employeur *</label>
                      <input id="institution" required type="text" className={inputCls}
                        value={formData.institution}
                        onChange={(e) => setFormData({ ...formData, institution: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="fonction" className={labelCls}>Fonction actuelle</label>
                      <input id="fonction" type="text" className={inputCls}
                        value={formData.fonction}
                        onChange={(e) => setFormData({ ...formData, fonction: e.target.value })} />
                    </div>
                  </div>

                  {/* --- DOMAINES --- */}
                  <div className="space-y-3 pt-2">
                    <label className={labelCls}>Domaines scientifiques * <span className="normal-case tracking-normal font-medium text-slate-400">(1 à 3 de préférence)</span></label>
                    <div className="flex flex-wrap gap-2">
                      {EXPERTISE_DOMAINS.map((d) => {
                        const active = formData.domaines.includes(d);
                        return (
                          <button
                            key={d}
                            type="button"
                            aria-pressed={active}
                            onClick={() => toggleInList("domaines", d)}
                            className={`px-4 py-2 rounded-full text-xs font-bold border transition-all active:scale-95 ${
                              active
                                ? "bg-blue-700 text-white border-blue-700 shadow-md shadow-blue-100"
                                : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-700"
                            }`}
                          >
                            {d}
                          </button>
                        );
                      })}
                    </div>
                    {formData.domaines.length > 3 && (
                      <p className="text-[11px] text-amber-600 ml-1 italic">
                        Au-delà de trois domaines, une candidature perd en lisibilité. Gardez les plus solides.
                      </p>
                    )}
                  </div>

                  {/* --- CONTRIBUTIONS (hors relecteur pur) --- */}
                  {!isReviewerLike && (
                    <div className="space-y-3">
                      <label className={labelCls}>Comment souhaitez-vous contribuer ?</label>
                      <div className="flex flex-wrap gap-2">
                        {CONTRIBUTION_AREAS.map((c) => {
                          const active = formData.contributions.includes(c);
                          return (
                            <button
                              key={c}
                              type="button"
                              aria-pressed={active}
                              onClick={() => toggleInList("contributions", c)}
                              className={`px-4 py-2 rounded-full text-xs font-bold border transition-all active:scale-95 ${
                                active
                                  ? "bg-slate-900 text-white border-slate-900"
                                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                              }`}
                            >
                              {c}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* --- RÉFÉRENCES SCIENTIFIQUES --- */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="orcid" className={labelCls}>ORCID</label>
                      <input id="orcid" type="text" placeholder="0000-0002-1825-0097" className={inputCls}
                        value={formData.orcid}
                        onChange={(e) => setFormData({ ...formData, orcid: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="profilLink" className={labelCls}>
                        Lien publications / CV {isReviewerLike && "*"}
                      </label>
                      <input id="profilLink" type="url" placeholder="https://scholar.google.com/..." className={inputCls}
                        value={formData.profilLink}
                        onChange={(e) => setFormData({ ...formData, profilLink: e.target.value })} />
                    </div>
                  </div>

                  {/* --- DISPONIBILITÉ & LANGUES --- */}
                  <div className="space-y-2">
                    <label htmlFor="dispo" className={labelCls}>
                      {isReviewerLike ? "Disponibilité pour les relectures *" : "Temps que vous pouvez consacrer *"}
                    </label>
                    <select id="dispo" required className={`${inputCls} appearance-none cursor-pointer`}
                      value={formData.disponibilite}
                      onChange={(e) => setFormData({ ...formData, disponibilite: e.target.value })}>
                      {AVAILABILITY_OPTIONS.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                    <p className="text-[11px] text-slate-400 ml-1 italic">
                      Annoncez ce que vous tiendrez réellement : c'est ce qui construit la confiance.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className={labelCls}>Langues de travail *</label>
                    <div className="flex flex-wrap gap-2">
                      {["Français", "Anglais", "Lingala", "Kituba"].map((l) => {
                        const active = formData.langues.includes(l);
                        return (
                          <button
                            key={l}
                            type="button"
                            aria-pressed={active}
                            onClick={() => toggleInList("langues", l)}
                            className={`px-4 py-2 rounded-full text-xs font-bold border transition-all active:scale-95 ${
                              active
                                ? "bg-blue-700 text-white border-blue-700"
                                : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                            }`}
                          >
                            {l}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* --- MOTIVATION --- */}
                  <div className="space-y-2 pt-2">
                    <label htmlFor="motivation" className={labelCls}>
                      {isStudent ? "Où en êtes-vous, et sur quoi bloquez-vous ? *" : "Ce que vous apportez à Kongo Science *"}
                    </label>
                    <textarea
                      id="motivation"
                      required
                      rows={7}
                      className={`${inputCls} resize-y leading-relaxed`}
                      placeholder={psychology.exampleGood}
                      value={formData.motivation}
                      onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                    />

                    {/* Jauge de consistance */}
                    <div className="flex items-center gap-3 ml-1">
                      <div className="flex-grow h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            motivationCount >= MOTIVATION_MIN ? "bg-green-500" : "bg-amber-400"
                          }`}
                          style={{ width: `${motivationRatio}%` }}
                        />
                      </div>
                      <span className={`text-[11px] font-bold whitespace-nowrap ${
                        motivationCount >= MOTIVATION_MIN ? "text-green-600" : "text-slate-400"
                      }`}>
                        {motivationCount} / {MOTIVATION_MIN}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 ml-1 italic">
                      Le texte gris ci-dessus est un exemple réel de bonne réponse — inspirez-vous-en, ne le recopiez pas.
                    </p>
                  </div>

                  {/* --- CONSENTEMENTS --- */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <label className="flex gap-3 items-start cursor-pointer group">
                      <input
                        type="checkbox"
                        className="mt-1 w-4 h-4 accent-blue-700 flex-shrink-0"
                        checked={formData.consentNom}
                        onChange={(e) => setFormData({ ...formData, consentNom: e.target.checked })}
                      />
                      <span className="text-xs text-slate-600 leading-relaxed group-hover:text-slate-900 transition-colors">
                        J'autorise Kongo Science à publier mon nom et mon affiliation si ma candidature est retenue.
                        <span className="block text-slate-400 italic mt-1">
                          Sans cette case, votre nom ne sera jamais affiché — c'est la règle appliquée au comité éditorial.
                        </span>
                      </span>
                    </label>

                    <label className="flex gap-3 items-start cursor-pointer group">
                      <input
                        type="checkbox"
                        required
                        className="mt-1 w-4 h-4 accent-blue-700 flex-shrink-0"
                        checked={formData.consentData}
                        onChange={(e) => setFormData({ ...formData, consentData: e.target.checked })}
                      />
                      <span className="text-xs text-slate-600 leading-relaxed group-hover:text-slate-900 transition-colors">
                        J'accepte que ces informations soient conservées par Kongo Science pour traiter ma candidature
                        et me contacter. *
                      </span>
                    </label>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="w-full bg-blue-700 hover:bg-blue-800 text-white font-black py-5 rounded-2xl shadow-2xl shadow-blue-200 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                    >
                      {status === "submitting" ? (
                        <>
                          <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Envoi en cours...</span>
                        </>
                      ) : (
                        <>
                          <span>Envoyer ma candidature</span>
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </>
                      )}
                    </button>
                    <p className="text-center text-slate-400 text-[10px] mt-6 leading-relaxed">
                      Le bureau répond à toutes les candidatures sous deux semaines.
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

export default JoinView;
