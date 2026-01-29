import React, { useState } from "react";
import { COUNTRIES } from "../constants";

interface Props {
  onClose: () => void;
}

type Status = "idle" | "submitting" | "success" | "error";

// --- Fonctions utilitaires (gardées de ton code original) ---
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
  return input;
}

const SubmitPublicationModal: React.FC<Props> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    nom: "",
    prenoms: "",
    email: "",
    whatsapp: "",
    pays: "République du Congo",
    institution: "",
    // Champs spécifiques publication
    titre: "",
    type: "Mémoire Master",
    domaine: "Géologie",
    pdfLink: "", // Le lien Zenodo ou Drive
    abstract: "",
  });

  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Tu peux utiliser le même script Google ou en créer un nouveau
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz5gO1pZtR9HnMnQbGzzP67c8eYPGUpY335vTAZXgdq4D_XwSnj3L6PFtl0S17r70s7QA/exec";

  const handleClose = () => {
    if (status === "submitting") return;
    onClose();
  };

  const validate = () => {
    const nom = normalize(formData.nom);
    const pdfLink = normalize(formData.pdfLink);
    
    if (!formData.prenoms || formData.prenoms.length < 2) return "Prénoms requis.";
    if (!nom || nom.length < 2) return "Nom requis.";
    if (!isValidEmail(formData.email)) return "Email invalide.";
    if (!formData.titre || formData.titre.length < 5) return "Titre trop court.";
    if (!pdfLink || !isValidUrl(pdfLink)) return "Le lien vers le fichier (Drive/Zenodo) est invalide.";
    if (!formData.abstract || formData.abstract.length < 20) return "Le résumé est trop court.";

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

    // On adapte le payload pour le script Google
    // Note: Si ton script Google attend des champs précis (date, duree), on peut envoyer des valeurs par défaut
    const payload = {
      type_soumission: "PUBLICATION", // Pour distinguer dans ton Excel
      nom: normalize(formData.nom),
      prenoms: normalize(formData.prenoms),
      email: normalize(formData.email),
      whatsapp: normalize(formData.whatsapp),
      titre: normalize(formData.titre),
      type: normalize(formData.type), // Thèse, Article...
      cvLink: normalize(formData.pdfLink), // On utilise le champ cvLink pour stocker le lien du PDF
      expertiseSummary: normalize(formData.abstract), // On utilise ce champ pour l'abstract
      country: normalize(formData.pays),
      institution: normalize(formData.institution),
      date: new Date().toISOString(), // Date de soumission
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });

      setStatus("success");
      setTimeout(() => onClose(), 6000);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMessage("Erreur de connexion serveur.");
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={handleClose} />

      <div className="relative bg-white rounded-[2.5rem] w-full max-w-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 max-h-[90vh] overflow-y-auto">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white sticky top-0 z-10 border-b border-slate-700">
          <button onClick={handleClose} className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <span className="inline-block bg-blue-600/20 border border-blue-400/30 text-blue-300 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-4">
            Bibliothèque Numérique
          </span>
          <h2 className="text-3xl font-serif font-bold italic">Soumettre une Publication</h2>
        </div>

        <div className="p-8 md:p-12">
          
          {/* --- SECTION EXPLICATIVE ZOTERO/ZENODO --- */}
          {status !== "success" && (
            <div className="mb-10 bg-blue-50 p-6 rounded-2xl border border-blue-100">
              <h3 className="text-blue-900 font-bold text-lg mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Procédure de soumission & Standard Zotero
              </h3>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                Kongo Science utilise le standard <strong>COinS</strong> compatible avec Zotero pour garantir que votre travail soit correctement cité par la communauté internationale.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-sm">
                  <strong className="block text-blue-700 mb-1">1. Hébergement</strong>
                  Hébergez votre fichier PDF (Thèse, Mémoire) sur une plateforme pérenne comme <strong>Zenodo</strong> (recommandé pour le DOI) ou Google Drive (en mode public).
                </div>
                <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-sm">
                  <strong className="block text-blue-700 mb-1">2. Soumission</strong>
                  Remplissez ce formulaire avec le lien de votre fichier. Nous nous chargeons de générer les métadonnées pour l'indexation.
                </div>
              </div>
            </div>
          )}

          {status === "success" ? (
            <div className="text-center py-12 animate-in zoom-in-90">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Publication reçue !</h3>
              <p className="text-slate-500">Notre comité scientifique va vérifier les métadonnées avant indexation.</p>
              <button onClick={onClose} className="mt-8 px-8 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all">Fermer</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {status === "error" && (
                <div className="bg-red-50 text-red-700 p-4 rounded-2xl text-sm border border-red-100">
                  <div className="font-bold">⚠️ Erreur</div>
                  <div>{errorMessage}</div>
                </div>
              )}

              {/* IDENTITÉ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nom</label>
                  <input required type="text" className="input-style" placeholder="Votre nom" value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Prénoms</label>
                  <input required type="text" className="input-style" placeholder="Vos prénoms" value={formData.prenoms} onChange={(e) => setFormData({ ...formData, prenoms: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                    <input required type="email" className="input-style" placeholder="email@univ.cg" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Institution</label>
                    <input type="text" className="input-style" placeholder="Université Marien Ngouabi..." value={formData.institution} onChange={(e) => setFormData({ ...formData, institution: e.target.value })} />
                </div>
              </div>

              {/* DÉTAILS PUBLICATION */}
              <div className="space-y-1.5 pt-4 border-t border-slate-100">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Titre de la publication</label>
                <input required type="text" className="input-style" placeholder="Titre complet tel qu'il apparaît sur le document" value={formData.titre} onChange={(e) => setFormData({ ...formData, titre: e.target.value })} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Type</label>
                    <select className="input-style cursor-pointer" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                        <option value="Mémoire Master">Mémoire Master</option>
                        <option value="Thèse Doctorat">Thèse Doctorat</option>
                        <option value="Article Scientifique">Article Scientifique</option>
                        <option value="Rapport Technique">Rapport Technique</option>
                    </select>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Domaine</label>
                    <select className="input-style cursor-pointer" value={formData.domaine} onChange={(e) => setFormData({ ...formData, domaine: e.target.value })}>
                        <option value="Géologie">Géologie</option>
                        <option value="Santé Publique">Santé Publique</option>
                        <option value="Environnement">Environnement</option>
                        <option value="Sciences Humaines">Sciences Humaines</option>
                        <option value="Économie">Économie</option>
                        <option value="Droit">Droit</option>
                    </select>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 text-blue-600">Lien du Fichier</label>
                    <input required type="url" className="input-style border-blue-200 bg-blue-50/50" placeholder="https://zenodo.org/..." value={formData.pdfLink} onChange={(e) => setFormData({ ...formData, pdfLink: e.target.value })} />
                 </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Résumé (Abstract)</label>
                <textarea required rows={5} className="input-style resize-none" placeholder="Copiez-collez le résumé de votre travail ici..." value={formData.abstract} onChange={(e) => setFormData({ ...formData, abstract: e.target.value })} />
              </div>

              <button type="submit" disabled={status === "submitting"} className="w-full bg-slate-900 hover:bg-blue-800 text-white font-black py-5 rounded-2xl shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 mt-4">
                {status === "submitting" ? <span>Envoi en cours...</span> : <span>Soumettre à l'indexation</span>}
              </button>
            </form>
          )}
        </div>
      </div>
      
      {/* Styles injectés localement pour la propreté */}
      <style>{`
        .input-style {
            width: 100%;
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 1rem;
            padding: 1rem 1.25rem;
            font-size: 0.875rem;
            outline: none;
            transition: all 0.2s;
        }
        .input-style:focus {
            ring: 2px solid #2563eb;
            border-color: #2563eb;
        }
      `}</style>
    </div>
  );
};

export default SubmitPublicationModal;
