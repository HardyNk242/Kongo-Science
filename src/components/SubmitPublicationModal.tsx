import React, { useState } from "react";

interface Props {
  onClose: () => void;
}

type Status = "idle" | "submitting" | "success" | "error";
type Tab = "form" | "guide";

const SubmitPublicationModal: React.FC<Props> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>("guide"); // On commence par le guide par défaut pour éduquer
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
    // Simulation d'envoi (remplacer par votre fetch vers Google Script)
    setTimeout(() => {
        setStatus("success");
        setTimeout(onClose, 5000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      
      <div className="relative bg-white rounded-[2.5rem] w-full max-w-4xl shadow-2xl overflow-hidden animate-in zoom-in-95 max-h-[90vh] flex flex-col">
        
        {/* EN-TÊTE AVEC ONGLETS */}
        <div className="bg-slate-900 p-8 text-white flex-shrink-0">
            <button onClick={onClose} className="absolute top-6 right-6 text-white/40 hover:text-white">✕</button>
            <h2 className="text-2xl font-serif font-bold italic mb-6">Soumettre une Publication</h2>
            
            <div className="flex gap-4 border-b border-slate-700">
                <button 
                    onClick={() => setActiveTab("guide")}
                    className={`pb-3 text-sm font-bold uppercase tracking-widest transition-colors border-b-2 ${activeTab === "guide" ? "border-blue-500 text-white" : "border-transparent text-slate-500 hover:text-slate-300"}`}
                >
                    1. Guide & Droits (À lire)
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
                <div className="space-y-10">
                    {/* SECTION COPYRIGHT */}
                    <div className="bg-red-50 border border-red-100 p-6 rounded-2xl">
                        <h3 className="text-red-800 font-bold text-lg mb-2 flex items-center gap-2">
                            ⛔ Attention : Droit d'auteur & Double Publication
                        </h3>
                        <p className="text-red-700/80 text-sm leading-relaxed mb-4">
                            En science, <strong>vous ne pouvez pas publier le même article deux fois</strong>. Si votre article a déjà été publié dans une revue payante (Elsevier, Springer, Nature...), vous avez cédé vos droits de diffusion.
                        </p>
                        <ul className="list-disc list-inside text-sm text-red-700/80 space-y-1 ml-2">
                            <li><strong>Interdit :</strong> Déposer le PDF final de l'éditeur (avec le logo de la revue).</li>
                            <li><strong>Autorisé :</strong> Déposer votre version "Manuscrit Auteur" (Post-print) ou vos Thèses/Mémoires universitaires.</li>
                            <li><strong>Risque :</strong> Kongo Science rejettera tout document violant le copyright d'un éditeur.</li>
                        </ul>
                    </div>

                    {/* SECTION ZENODO */}
                    <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
                        <h3 className="text-slate-900 font-bold text-xl mb-6">Comment héberger votre fichier sur Zenodo ?</h3>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-8 h-8 bg-blue-100 text-blue-700 font-black rounded-full flex items-center justify-center flex-shrink-0">1</div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Créez un compte Zenodo</h4>
                                    <p className="text-sm text-slate-500 mt-1">Allez sur <a href="https://zenodo.org" target="_blank" className="text-blue-600 underline">zenodo.org</a> (gratuit, géré par le CERN). C'est la référence mondiale pour l'Open Science.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 bg-blue-100 text-blue-700 font-black rounded-full flex items-center justify-center flex-shrink-0">2</div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Déposez votre fichier (Upload)</h4>
                                    <p className="text-sm text-slate-500 mt-1">Cliquez sur "New Upload". Remplissez les infos (Titre, Auteur). Zenodo va créer un <strong>DOI</strong> (un code unique pour votre travail).</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 bg-blue-100 text-blue-700 font-black rounded-full flex items-center justify-center flex-shrink-0">3</div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Copiez le lien final</h4>
                                    <p className="text-sm text-slate-500 mt-1">Une fois publié, copiez le lien de la page ou le lien de téléchargement direct du fichier PDF.</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 text-center">
                            <button onClick={() => setActiveTab("form")} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
                                J'ai compris, passer au formulaire →
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- ONGLET 2 : FORMULAIRE --- */}
            {activeTab === "form" && (
                status === "success" ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">✅</div>
                        <h3 className="text-2xl font-bold text-slate-900">Bien reçu !</h3>
                        <p className="text-slate-500 mt-2">Votre publication sera en ligne après validation.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase">Nom</label>
                                <input required className="w-full p-3 rounded-xl border border-slate-200" value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase">Prénoms</label>
                                <input required className="w-full p-3 rounded-xl border border-slate-200" value={formData.prenoms} onChange={e => setFormData({...formData, prenoms: e.target.value})} />
                            </div>
                        </div>
                        
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase">Titre de la publication</label>
                            <input required className="w-full p-3 rounded-xl border border-slate-200" placeholder="Titre exact" value={formData.titre} onChange={e => setFormData({...formData, titre: e.target.value})} />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-blue-600 uppercase">Lien Zenodo / Drive (PDF)</label>
                            <input required type="url" className="w-full p-3 rounded-xl border-2 border-blue-100 bg-white" placeholder="https://zenodo.org/record/..." value={formData.pdfLink} onChange={e => setFormData({...formData, pdfLink: e.target.value})} />
                            <p className="text-[10px] text-slate-400">Le fichier doit être accessible publiquement.</p>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase">Résumé (Abstract)</label>
                            <textarea required rows={5} className="w-full p-3 rounded-xl border border-slate-200" value={formData.abstract} onChange={e => setFormData({...formData, abstract: e.target.value})} />
                        </div>

                        <button type="submit" disabled={status === "submitting"} className="w-full bg-blue-700 text-white font-bold py-4 rounded-xl hover:bg-blue-800 transition-all">
                            {status === "submitting" ? "Envoi..." : "Soumettre la publication"}
                        </button>
                    </form>
                )
            )}
        </div>
      </div>
    </div>
  );
};

export default SubmitPublicationModal;
