import React, { useState } from "react";
import { SCIMAGO_DOMAINS } from "../constants"; // On importe la liste

interface Props {
  onClose: () => void;
}

type Status = "idle" | "submitting" | "success" | "error";
type Tab = "form" | "guide";

const SubmitPublicationModal: React.FC<Props> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>("guide");
  const [formData, setFormData] = useState({
    nom: "", prenoms: "", email: "", institution: "",
    titre: "", 
    type: "Mémoire de Master", 
    domaine: "Earth and Planetary Sciences", // Valeur par défaut
    pdfLink: "", abstract: "",
  });
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    
    // Construction du mail (comme vu précédemment)
    const subject = encodeURIComponent(`Soumission : ${formData.titre}`);
    const bodyText = `Auteur: ${formData.nom} ${formData.prenoms}\nDomaine: ${formData.domaine}\nTitre: ${formData.titre}\nLien: ${formData.pdfLink}`;
    const body = encodeURIComponent(bodyText);
    
    setTimeout(() => {
        window.location.href = `mailto:nkodiahardy@gmail.com?subject=${subject}&body=${body}`;
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
                <button onClick={() => setActiveTab("guide")} className={`pb-3 text-sm font-bold uppercase tracking-widest transition-colors border-b-2 ${activeTab === "guide" ? "border-blue-500 text-white" : "border-transparent text-slate-500 hover:text-slate-300"}`}>1. Guide & Droits</button>
                <button onClick={() => setActiveTab("form")} className={`pb-3 text-sm font-bold uppercase tracking-widest transition-colors border-b-2 ${activeTab === "form" ? "border-blue-500 text-white" : "border-transparent text-slate-500 hover:text-slate-300"}`}>2. Formulaire de dépôt</button>
            </div>
        </div>

        {/* CONTENU DÉFILANT */}
        <div className="overflow-y-auto p-8 md:p-12 bg-slate-50 flex-grow">
            
            {/* --- ONGLET 1 : GUIDE (inchangé) --- */}
            {activeTab === "guide" && (
                <div className="space-y-8">
                    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="bg-blue-100 text-blue-700 font-black px-2 py-1 rounded text-xs uppercase">Cas 1</span>
                            <h3 className="font-bold text-slate-900">Thèses, Mémoires & Articles Open Access</h3>
                        </div>
                        <p className="text-sm text-slate-600 mb-4">Documents dont vous détenez les droits. À rendre <strong>publics</strong>.</p>
                        <ul className="text-xs text-slate-500 space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <li className="flex gap-2">✅ <strong>Hébergeur :</strong> <a href="https://zenodo.org" target="_blank" rel="noreferrer" className="text-blue-600 underline">Zenodo.org</a> (Recommandé).</li>
                        </ul>
                    </div>
                    <div className="text-center pt-4">
                        <button onClick={() => setActiveTab("form")} className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-xl hover:-translate-y-1">Accéder au formulaire →</button>
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
                            <input className="input-style" placeholder="Institution" value={formData.institution} onChange={e => setFormData({...formData, institution: e.target.value})} />
                        </div>

                        {/* PUBLICATION */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                            <h4 className="font-bold text-slate-400 text-xs uppercase tracking-widest border-b border-slate-100 pb-2">2. La Publication</h4>
                            <input required className="input-style font-bold" placeholder="Titre complet" value={formData.titre} onChange={e => setFormData({...formData, titre: e.target.value})} />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Type</label>
                                    <select className="input-style cursor-pointer" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                                        <option value="Mémoire de Master">Mémoire de Master</option>
                                        <option value="Thèse de Doctorat">Thèse de Doctorat</option>
                                        <option value="Article de Revue">Article de Revue</option>
                                        <option value="Livre">Livre / Ouvrage</option>
                                    </select>
                                </div>

                                {/* C'EST ICI QUE ÇA CHANGE : DOMAINES SCIMAGO DYNAMIQUES */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Domaine (Scimago)</label>
                                    <select className="input-style cursor-pointer" value={formData.domaine} onChange={e => setFormData({...formData, domaine: e.target.value})}>
                                        {SCIMAGO_DOMAINS.map((dom) => (
                                            <option key={dom.value} value={dom.value}>
                                                {dom.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <input required type="url" className="input-style border-blue-200 bg-blue-50/30" placeholder="Lien (Zenodo, Drive, Editeur...)" value={formData.pdfLink} onChange={e => setFormData({...formData, pdfLink: e.target.value})} />
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
