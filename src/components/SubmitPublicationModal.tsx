import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { SCIMAGO_DOMAINS } from '../constants';

// --- CONFIGURATION EMAILJS ---
const SERVICE_ID = "service_ar9mjz8"; 
const TEMPLATE_ID = "template_7f6izez"; 
const PUBLIC_KEY = "V0gJsBrug9PzVvKnzm"; // ⚠️ REMPLACEZ PAR VOTRE CLÉ PUBLIQUE (Celle copiée tout à l'heure)

interface Props {
  onClose: () => void;
}

// Type pour un auteur (Structure Zotero : Nom, Prénom)
interface Author {
  firstName: string;
  lastName: string;
}

const SubmitPublicationModal: React.FC<Props> = ({ onClose }) => {
  // --- ÉTATS DU FORMULAIRE ---
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  
  // 1. Info de base du soumetteur
  const [submitterEmail, setSubmitterEmail] = useState('');
  const [submitterName, setSubmitterName] = useState(''); 
  const [docType, setDocType] = useState('Article de Revue');
  const [domain, setDomain] = useState(SCIMAGO_DOMAINS[0].value);
  
  // 2. Données Zotero
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [authors, setAuthors] = useState<Author[]>([{ lastName: '', firstName: '' }]); 
  
  // 3. Champs Bibliométriques Contextuels
  const [publication, setPublication] = useState(''); // Journal, Éditeur ou Nom de la Conférence
  const [volume, setVolume] = useState('');
  const [issue, setIssue] = useState('');
  const [pages, setPages] = useState('');
  const [date, setDate] = useState(''); // Date ou Année
  const [doi, setDoi] = useState('');   // DOI ou ISBN
  const [university, setUniversity] = useState(''); 
  const [place, setPlace] = useState(''); 
  
  // 4. Gestion des Droits (Access)
  const [accessMode, setAccessMode] = useState<'open' | 'restricted' | 'paid'>('open');
  const [link, setLink] = useState(''); // URL PDF ou Achat
  const [price, setPrice] = useState('');

  // --- LOGIQUE AUTEURS (Ajout/Retrait dynamique) ---
  const addAuthor = () => {
    setAuthors([...authors, { lastName: '', firstName: '' }]);
  };

  const removeAuthor = (index: number) => {
    if (authors.length > 1) {
      const newAuthors = [...authors];
      newAuthors.splice(index, 1);
      setAuthors(newAuthors);
    }
  };

  const updateAuthor = (index: number, field: keyof Author, value: string) => {
    const newAuthors = [...authors];
    newAuthors[index][field] = value;
    setAuthors(newAuthors);
  };

  // --- SOUMISSION VIA EMAILJS ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    // 1. Mise en forme des auteurs
    const formattedAuthors = authors.map(a => `${a.lastName.toUpperCase()} ${a.firstName}`).join(', ');

    // 2. Construction des détails bibliographiques
    let biblioInfo = "";
    
    if (docType === 'Article de Revue') {
      biblioInfo = `Journal: ${publication}\nVol: ${volume} | No: ${issue} | pp: ${pages}\nDOI: ${doi}`;
    } else if (docType === 'Actes de Conférence') {
      // Nouvelle logique pour les Actes
      biblioInfo = `Conférence: ${publication}\nLieu: ${place}\nDate: ${date}\nPages: ${pages}`;
    } else if (docType.includes('Thèse') || docType.includes('Mémoire')) {
      biblioInfo = `Université: ${university}\nLieu: ${place}\nType: ${docType}\nPages: ${pages}`;
    } else {
      // Livres et Chapitres
      biblioInfo = `Éditeur: ${publication}\nLieu: ${place}\nISBN: ${doi}\nPages: ${pages}`;
    }

    const rightsInfo = accessMode === 'open' 
      ? "✅ OPEN ACCESS (Lien direct)" 
      : accessMode === 'paid' 
        ? `💰 PAYANT (Prix: ${price})` 
        : "🔒 RESTREINT (Sur demande)";

    // 3. Construction du corps du message détaillé
    const detailedBody = `
--- DÉTAILS DOCUMENT ---
Type : ${docType}
Domaine : ${domain}
Année/Date : ${date}

--- AUTEURS ---
${formattedAuthors}

--- BIBLIOGRAPHIE ---
${biblioInfo}

--- ACCÈS ---
Statut : ${rightsInfo}

--- RÉSUMÉ ---
${abstract}
    `;

    // 4. Préparation des paramètres pour EmailJS
    const templateParams = {
        name: submitterName,
        email: submitterEmail,
        user_name: submitterName,
        user_email: submitterEmail,
        title: title,
        link: link,
        message: detailedBody
    };

    // 5. Envoi
    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      .then((result) => {
          console.log('Succès:', result.text);
          setStatus('success');
          setTimeout(onClose, 4000);
      }, (error) => {
          console.error('Erreur:', error.text);
          setStatus('error');
      });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="bg-slate-800 p-4 text-white flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
             <div className="bg-white/10 p-2 rounded-lg">
               <svg className="w-6 h-6 text-blue-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
             </div>
             <div>
                <h2 className="text-lg font-bold font-serif">Ajouter un document</h2>
                <p className="text-xs text-slate-400">Standard Zotero • Via EmailJS</p>
             </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">✕</button>
        </div>

        {status === 'success' ? (
           <div className="flex-grow flex flex-col items-center justify-center p-12 text-center bg-green-50">
             <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
             </div>
             <h3 className="text-2xl font-bold text-green-800 font-serif">Soumission envoyée !</h3>
             <p className="text-green-600 mt-2 max-w-sm">
               Merci pour votre contribution. Un accusé de réception a été envoyé à votre adresse email.
             </p>
           </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto custom-scrollbar bg-slate-50">
            
            {/* 1. TYPE & DOMAINE */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">1. Type de Document</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="label-zotero">Item Type (Zotero)</label>
                   <select className="input-zotero" value={docType} onChange={e => setDocType(e.target.value)}>
                     <option value="Article de Revue">Journal Article (Revue)</option>
                     <option value="Actes de Conférence">Actes de Conférence (Proceedings)</option>
                     <option value="Thèse">Thesis (Thèse/Mémoire)</option>
                     <option value="Livre">Book (Livre)</option>
                     <option value="Chapitre">Book Section</option>
                     <option value="Rapport">Report</option>
                   </select>
                 </div>
                 <div>
                   <label className="label-zotero">Domaine (Scimago)</label>
                   <select className="input-zotero" value={domain} onChange={e => setDomain(e.target.value)}>
                     {SCIMAGO_DOMAINS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                   </select>
                 </div>
               </div>
               <div>
                 <label className="label-zotero">Titre (Title)</label>
                 <input required className="input-zotero font-serif font-medium text-slate-800" placeholder="Titre complet..." value={title} onChange={e => setTitle(e.target.value)} />
               </div>
            </div>

            {/* 2. AUTEURS (Liste) */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
               <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">2. Auteurs</h3>
                 <button type="button" onClick={addAuthor} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 font-bold flex items-center gap-1">
                   <span>+</span> Ajouter
                 </button>
               </div>
               
               {authors.map((author, index) => (
                 <div key={index} className="flex gap-2 items-end animate-fadeIn">
                    <div className="flex-grow grid grid-cols-2 gap-2">
                       <div>
                         {index === 0 && <label className="label-zotero">Nom (Last Name)</label>}
                         <input required className="input-zotero" placeholder="ex: Nkodia" value={author.lastName} onChange={e => updateAuthor(index, 'lastName', e.target.value)} />
                       </div>
                       <div>
                         {index === 0 && <label className="label-zotero">Prénom (First Name)</label>}
                         <input required className="input-zotero" placeholder="ex: Hardy" value={author.firstName} onChange={e => updateAuthor(index, 'firstName', e.target.value)} />
                       </div>
                    </div>
                    {authors.length > 1 && (
                      <button type="button" onClick={() => removeAuthor(index)} className="mb-2 text-slate-400 hover:text-red-500 p-1">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    )}
                 </div>
               ))}
            </div>

            {/* 3. DÉTAILS (Dynamique selon le type) */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">3. Détails Bibliographiques</h3>
               
               {/* --- ARTICLE DE REVUE --- */}
               {docType === 'Article de Revue' && (
                 <>
                   <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <label className="label-zotero">Publication (Journal)</label>
                        <input className="input-zotero" placeholder="ex: LAKISA Revue" value={publication} onChange={e => setPublication(e.target.value)} />
                      </div>
                      <div>
                        <label className="label-zotero">Date / Année</label>
                        <input className="input-zotero" placeholder="2025" value={date} onChange={e => setDate(e.target.value)} />
                      </div>
                   </div>
                   <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="label-zotero">Volume</label>
                        <input className="input-zotero" placeholder="Vol." value={volume} onChange={e => setVolume(e.target.value)} />
                      </div>
                      <div>
                        <label className="label-zotero">Numéro (Issue)</label>
                        <input className="input-zotero" placeholder="No." value={issue} onChange={e => setIssue(e.target.value)} />
                      </div>
                      <div>
                        <label className="label-zotero">Pages</label>
                        <input className="input-zotero" placeholder="1-15" value={pages} onChange={e => setPages(e.target.value)} />
                      </div>
                   </div>
                   <div>
                      <label className="label-zotero">DOI</label>
                      <input className="input-zotero" placeholder="10.1007/..." value={doi} onChange={e => setDoi(e.target.value)} />
                   </div>
                 </>
               )}

               {/* --- ACTES DE CONFÉRENCE (Nouveau) --- */}
               {docType === 'Actes de Conférence' && (
                 <>
                   <div>
                      <label className="label-zotero">Nom de la Conférence / Colloque</label>
                      <input className="input-zotero" placeholder="ex: Actes du Colloque International sur..." value={publication} onChange={e => setPublication(e.target.value)} />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="label-zotero">Lieu (Place)</label>
                        <input className="input-zotero" placeholder="Brazzaville, Congo" value={place} onChange={e => setPlace(e.target.value)} />
                      </div>
                      <div>
                        <label className="label-zotero">Date</label>
                        <input className="input-zotero" placeholder="Octobre 2024" value={date} onChange={e => setDate(e.target.value)} />
                      </div>
                   </div>
                   <div>
                      <label className="label-zotero">Pages</label>
                      <input className="input-zotero" placeholder="pp. 20-35" value={pages} onChange={e => setPages(e.target.value)} />
                   </div>
                 </>
               )}

               {/* --- THÈSE / MÉMOIRE --- */}
               {(docType === 'Thèse' || docType.includes('Mémoire')) && (
                 <>
                   <div>
                      <label className="label-zotero">Université / Institution</label>
                      <input className="input-zotero" placeholder="ex: Université Marien Ngouabi" value={university} onChange={e => setUniversity(e.target.value)} />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="label-zotero">Type</label>
                        <input className="input-zotero" placeholder="ex: Master, PhD" value={docType} onChange={e => setDocType(e.target.value)} />
                      </div>
                      <div>
                        <label className="label-zotero">Lieu (Place)</label>
                        <input className="input-zotero" placeholder="Brazzaville, Congo" value={place} onChange={e => setPlace(e.target.value)} />
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="label-zotero">Date / Année</label>
                        <input className="input-zotero" placeholder="2024" value={date} onChange={e => setDate(e.target.value)} />
                      </div>
                      <div>
                        <label className="label-zotero">Nb de pages</label>
                        <input className="input-zotero" placeholder="120" value={pages} onChange={e => setPages(e.target.value)} />
                      </div>
                   </div>
                 </>
               )}

               {/* --- LIVRE / CHAPITRE --- */}
               {(docType === 'Livre' || docType === 'Chapitre') && (
                 <>
                   <div>
                      <label className="label-zotero">Éditeur (Publisher)</label>
                      <input className="input-zotero" placeholder="ex: Kongo Science Editions" value={publication} onChange={e => setPublication(e.target.value)} />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="label-zotero">Lieu (Place)</label>
                        <input className="input-zotero" placeholder="Paris, France" value={place} onChange={e => setPlace(e.target.value)} />
                      </div>
                      <div>
                        <label className="label-zotero">Année</label>
                        <input className="input-zotero" placeholder="2025" value={date} onChange={e => setDate(e.target.value)} />
                      </div>
                   </div>
                   <div>
                      <label className="label-zotero">ISBN</label>
                      <input className="input-zotero" placeholder="978-..." value={doi} onChange={e => setDoi(e.target.value)} />
                   </div>
                 </>
               )}
            </div>

            {/* 4. DROITS & ACCÈS */}
            <div className="bg-amber-50 p-5 rounded-xl border border-amber-200 shadow-sm space-y-4">
               <h3 className="text-xs font-black text-amber-700 uppercase tracking-widest border-b border-amber-200 pb-2">4. Droits & Partage</h3>
               
               <div className="space-y-3">
                 <label className="flex items-start gap-3 cursor-pointer p-3 bg-white rounded-lg border border-amber-100 hover:border-blue-400 transition-all">
                    <input type="radio" name="access" className="mt-1" checked={accessMode === 'open'} onChange={() => setAccessMode('open')} />
                    <div>
                      <span className="block font-bold text-slate-800">🔓 Open Access</span>
                      <span className="text-xs text-slate-500">Accessible à tous (PDF public).</span>
                    </div>
                 </label>

                 <label className="flex items-start gap-3 cursor-pointer p-3 bg-white rounded-lg border border-amber-100 hover:border-blue-400 transition-all">
                    <input type="radio" name="access" className="mt-1" checked={accessMode === 'restricted'} onChange={() => setAccessMode('restricted')} />
                    <div>
                      <span className="block font-bold text-slate-800">🔒 Accès Restreint (Copyright)</span>
                      <span className="text-xs text-slate-500">PDF privé. Lecture sur demande à l'auteur uniquement.</span>
                    </div>
                 </label>

                 <label className="flex items-start gap-3 cursor-pointer p-3 bg-white rounded-lg border border-amber-100 hover:border-blue-400 transition-all">
                    <input type="radio" name="access" className="mt-1" checked={accessMode === 'paid'} onChange={() => setAccessMode('paid')} />
                    <div>
                      <span className="block font-bold text-slate-800">💰 En Vente (Livre)</span>
                      <span className="text-xs text-slate-500">Lien vers Amazon ou éditeur externe.</span>
                    </div>
                 </label>
               </div>

               <div className="pt-2 animate-fadeIn">
                  <label className="label-zotero">
                    {accessMode === 'open' ? "Lien vers le PDF (Drive/Zenodo)" : 
                     accessMode === 'paid' ? "Lien d'achat (Amazon/Site)" : 
                     "Lien vers le fichier (Pour l'admin)"}
                  </label>
                  <input required type="url" className="input-zotero bg-amber-50/50 border-amber-300" placeholder="https://..." value={link} onChange={e => setLink(e.target.value)} />
                  
                  {accessMode === 'paid' && (
                    <div className="mt-2">
                      <label className="label-zotero">Prix de vente</label>
                      <input className="input-zotero w-1/3" placeholder="ex: 25.00 €" value={price} onChange={e => setPrice(e.target.value)} />
                    </div>
                  )}
               </div>
            </div>

            {/* 5. RÉSUMÉ */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 mb-3">5. Résumé (Abstract)</h3>
               <textarea required rows={5} className="input-zotero resize-none" placeholder="Copiez le résumé ici..." value={abstract} onChange={e => setAbstract(e.target.value)} />
            </div>

            {/* VOS INFORMATIONS */}
            <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 shadow-sm space-y-4">
               <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest border-b border-blue-100 pb-2">Contact & Confirmation</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="label-zotero text-blue-700">Votre Nom (Pour le suivi)</label>
                   <input required className="input-zotero border-blue-200 focus:border-blue-500" placeholder="Votre nom" value={submitterName} onChange={e => setSubmitterName(e.target.value)} />
                 </div>
                 <div>
                   <label className="label-zotero text-blue-700">Votre Email (Pour confirmation)</label>
                   <input required type="email" className="input-zotero border-blue-200 focus:border-blue-500" placeholder="votre@email.com" value={submitterEmail} onChange={e => setSubmitterEmail(e.target.value)} />
                 </div>
               </div>
            </div>

            <button 
              type="submit" 
              disabled={status === 'sending'}
              className="w-full bg-blue-700 text-white font-bold py-4 rounded-xl hover:bg-blue-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {status === 'sending' ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Envoi en cours...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  Envoyer la soumission
                </>
              )}
            </button>

            {status === 'error' && (
              <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-100">
                Une erreur est survenue lors de l'envoi. Veuillez vérifier votre connexion et votre Clé Publique.
              </p>
            )}

          </form>
        )}
      </div>

      <style>{`
        .label-zotero {
          display: block;
          font-size: 0.7rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          margin-bottom: 0.25rem;
          letter-spacing: 0.05em;
        }
        .input-zotero {
          width: 100%;
          background-color: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          color: #1e293b;
          outline: none;
          transition: all 0.2s;
        }
        .input-zotero:focus {
          background-color: #fff;
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
};

export default SubmitPublicationModal;