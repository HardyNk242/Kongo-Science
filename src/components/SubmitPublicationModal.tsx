import React, { useState } from "react";

interface Props {
  onClose: () => void;
}

type Status = "idle" | "submitting" | "success" | "error";
type Tab = "form" | "guide";

const SubmitPublicationModal: React.FC<Props> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>("guide");
  const [formData, setFormData] = useState({
    nom: "", prenoms: "", email: "", institution: "",
    titre: "", type: "Mémoire Master", domaine: "Géologie",
    pdfLink: "", abstract: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    // Simulation d'envoi vers Google Script
    setTimeout(() => {
        setStatus("success");
        setTimeout(onClose, 6000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      
      <div className="relative bg-white rounded-[2.5rem] w-full max-w-4xl shadow-2xl overflow-hidden animate-in zoom-in-95 max-h-[90vh] flex flex-col">
        
        {/* EN-TÊTE */}
        <div className="bg-slate-900 p-8 text-white flex-shrink-0">
            <button onClick={onClose} className="absolute top-6 right-6 text-white/40 hover:text-white">✕</button>
            <h2 className="text-2xl font-serif font-bold italic mb-6">Soumettre une Publication</h2>
            
            <div className="flex gap-6 border-b border-slate-700">
                <button 
                    onClick={() => setActiveTab("guide")}
                    className={`pb-3 text-sm font-bold uppercase tracking-widest transition-colors border-b-2 ${activeTab === "guide" ? "border-blue-500 text-white" : "border-transparent text-slate-500 hover:text-slate-300"}`}
                >
                    1. Guide & Droits (Important)
                </button>
                <button 
                    onClick={() => setActiveTab("form")}
                    className={`pb-3 text-sm font-bold uppercase tracking-widest transition-colors border-b-2 ${activeTab === "form" ? "border-blue-500 text-white" : "border-transparent text-slate-500 hover:text-slate-300"}`}
                >
                    2. Formulaire de dépôt
                </button>
            </div>
        </div>

        {/* CONTENU DÉFILANT */}
        <div className="overflow-y-auto p-8 md:p-12 bg-slate-50 flex-grow">
            
            {/* --- ONGLET 1 : GUIDE PÉDAGOGIQUE --- */}
            {activeTab === "guide" && (
                <div className="space-y-8">
                    
                    {/* CAS 1 : THÈSES & MÉMOIRES (PUBLIC) */}
                    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="bg-blue-100 text-blue-700 font-black px-2 py-1 rounded text-xs uppercase">Cas 1</span>
                            <h3 className="font-bold text-slate-900">Thèses, Mémoires & Articles Open Access</h3>
                        </div>
                        <p className="text-sm text-slate-600 mb-4">
                            Ces documents vous appartiennent totalement. Vous devez les rendre <strong>publics</strong> pour une visibilité maximale.
                        </p>
                        <ul className="text-xs text-slate-500 space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <li className="flex gap-2">
                                ✅ <strong>Hébergeur recommandé :</strong> <a href="https://zenodo.org" target="_blank" className="text-blue-600 underline">Zenodo.org</a> (Gratuit, fournit un DOI).
                            </li>
                            <li className="flex gap-2">
                                🔗 <strong>Lien à fournir :</strong> Le lien public de téléchargement direct.
                            </li>
                        </ul>
                    </div>

                    {/* CAS 2 : ARTICLES COPYRIGHTÉS (PROTECTION) */}
                    <div className="bg-yellow-50 border border-yellow-100 p-6 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="bg-yellow-100 text-yellow-700 font-black px-2 py-1 rounded text-xs uppercase">Cas 2</span>
                            <h3 className="font-bold text-slate-900">Articles payants (Elsevier, Springer, Nature...)</h3>
                        </div>
                        <p className="text-sm text-yellow-800 mb-4">
                            ⚠️ <strong>Attention :</strong> Vous n'avez pas le droit de diffuser publiquement le PDF final de l'éditeur ("Version of Record").
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="bg-white p-3 rounded-xl border border-yellow-200">
                                <strong className="block text-slate-900 mb-1">Option A (Recommandée) : Google Drive Privé</strong>
                                Mettez le PDF sur votre Drive, mais réglez le partage sur <strong>"Accès limité"</strong> (ou "Demander l'accès").
                                <br/><br/>
                                <em>Avantage :</em> Légal. Le lecteur cliquera sur le lien, et devra vous demander l'autorisation (par email automatique) pour télécharger.
                            </div>
                            <div className="bg-white p-3 rounded-xl border border-yellow-200">
                                <strong className="block text-slate-900 mb-1">Option B : Version "Auteur"</strong>
                                Vous avez le droit de publier votre version Word/LaTeX (avant la mise en page de l'éditeur). Celle-ci peut être mise sur Zenodo.
                            </div>
                        </div>
                    </div>

                    <div className="text-center pt-4">
                        <button onClick={() => setActiveTab("form")} className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-xl hover:-translate-y-1">
                            J'ai choisi ma méthode, accéder au formulaire →
                        </button>
                    </div>
                </div>
            )}

            {/* --- ONGLET 2 : FORMULAIRE --- */}
            {activeTab === "form" && (
                status === "success" ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">✅</div>
                        <h3 className="text-2xl font-bold text-slate-900">Bien reçu !</h3>
                        <p className="text-slate-500 mt-2">Votre publication sera examinée par le comité scientifique.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
                        {/* IDENTITÉ */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                            <h4 className="font-bold text-slate-400 text-xs uppercase tracking-widest border-b border-slate-100 pb-2">1. L'Auteur</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <input required className="input-style" placeholder="Nom" value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} />
                                <input required className="input-style" placeholder="Prénoms" value={formData.prenoms} onChange={e => setFormData({...formData, prenoms: e.target.value})} />
                            </div>
                            <input required type="email" className="input-style" placeholder="Email institutionnel" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                            <input className="input-style" placeholder="Institution (Université, Labo...)" value={formData.institution} onChange={e => setFormData({...formData, institution: e.target.value})} />
                        </div>

                        {/* PUBLICATION */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                            <h4 className="font-bold text-slate-400 text-xs uppercase tracking-widest border-b border-slate-100 pb-2">2. La Publication</h4>
                            <input required className="input-style font-bold" placeholder="Titre complet de la publication" value={formData.titre} onChange={e => setFormData({...formData, titre: e.target.value})} />
                            
                            <div className="grid grid-cols-2 gap-4">
                                <select className="input-style cursor-pointer" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                                    <option value="Mémoire Master">Mémoire Master</option>
                                    <option value="Thèse Doctorat">Thèse Doctorat</option>
                                    <option value="Article Scientifique">Article Scientifique</option>
                                </select>
                                <select className="input-style cursor-pointer" value={formData.domaine} onChange={e => setFormData({...formData, domaine: e.target.value})}>
                                    <option value="Géologie">Géologie</option>
                                    <option value="Santé">Santé</option>
                                    <option value="Environnement">Environnement</option>
                                    <option value="Droit/Éco">Droit/Éco</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-blue-600 uppercase ml-1">Lien du Fichier (Zenodo ou Drive)</label>
                                <input required type="url" className="input-style border-blue-200 bg-blue-50/30" placeholder="https://..." value={formData.pdfLink} onChange={e => setFormData({...formData, pdfLink: e.target.value})} />
                                <p className="text-[10px] text-slate-400 mt-1">
                                    Pour Elsevier/Springer : Mettez un lien Google Drive en mode "Restreint" ou "Sur demande".
                                </p>
                            </div>

                            <textarea required rows={4} className="input-style resize-none" placeholder="Résumé (Abstract)..." value={formData.abstract} onChange={e => setFormData({...formData, abstract: e.target.value})} />
                        </div>

                        <button type="submit" disabled={status === "submitting"} className="w-full bg-blue-700 text-white font-bold py-4 rounded-xl hover:bg-blue-800 transition-all shadow-lg hover:shadow-blue-200">
                            {status === "submitting" ? "Envoi..." : "Soumettre la publication"}
                        </button>
                    </form>
                )
            )}
        </div>
      </div>
      
      <style>{`
        .input-style {
            width: 100%;
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 0.75rem;
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
            outline: none;
            transition: all 0.2s;
        }
        .input-style:focus {
            background-color: #fff;
            border-color: #2563eb;
            box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
        }
      `}</style>
    </div>
  );
};

export default SubmitPublicationModal;
