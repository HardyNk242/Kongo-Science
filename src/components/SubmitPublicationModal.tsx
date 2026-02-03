import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { SCIMAGO_DOMAINS } from '../constants';

// --- VOS IDENTIFIANTS ---
const SERVICE_ID = "service_fl4m7b9"; 
const TEMPLATE_ID = "template_7f6izez"; 
const PUBLIC_KEY = "0gJsBrug9PzVvKnzm"; 

interface Props {
  onClose: () => void;
}

interface Author {
  firstName: string;
  lastName: string;
}

const SubmitPublicationModal: React.FC<Props> = ({ onClose }) => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  
  // 1. Info de base
  const [submitterEmail, setSubmitterEmail] = useState('');
  const [submitterName, setSubmitterName] = useState(''); 
  const [docType, setDocType] = useState('Article Scientifique');
  const [domain, setDomain] = useState(SCIMAGO_DOMAINS[0].value);
  
  // 2. Données
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [authors, setAuthors] = useState<Author[]>([{ lastName: '', firstName: '' }]); 
  const [publication, setPublication] = useState(''); 
  const [volume, setVolume] = useState('');
  const [issue, setIssue] = useState('');
  const [pages, setPages] = useState('');
  const [date, setDate] = useState(''); 
  const [doi, setDoi] = useState('');   
  const [university, setUniversity] = useState(''); 
  const [place, setPlace] = useState(''); 
  
  // 3. Droits
  const [accessMode, setAccessMode] = useState<'open' | 'restricted' | 'paid'>('open');
  const [link, setLink] = useState(''); 
  const [price, setPrice] = useState('');

  const addAuthor = () => setAuthors([...authors, { lastName: '', firstName: '' }]);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    // FORMATAGE AUTEURS
    const authorString = authors.map(a => {
        const initial = a.firstName ? `${a.firstName.charAt(0)}.` : '';
        return `${initial} ${a.lastName}`;
    }).join(', ');

    // GÉNÉRATION ID
    const cleanName = authors[0]?.lastName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'aut';
    const cleanYear = date.substring(0, 4) || new Date().getFullYear().toString();
    const cleanTitle = title.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '') || 'doc';
    const generatedId = `art-${cleanName}-${cleanYear}-${cleanTitle}`;

    // FORMATAGE PAGES
    let pageString = pages;
    if (pages) {
        pageString = volume ? `Vol ${volume}, pp. ${pages}` : `pp. ${pages}`;
    }

    // INSTITUTION
    const institutionValue = publication || university || 'Institution Inconnue';

    // --- CONSTRUCTION DU JSON ---
    const codeSnippet = `
  {
    id: '${generatedId}',
    title: "${title.replace(/"/g, '\\"')}",
    author: "${authorString.replace(/"/g, '\\"')}",
    year: '${date}',
    institution: "${institutionValue.replace(/"/g, '\\"')}",
    domain: '${domain}',
    type: '${docType}',
    abstract: \`${abstract.replace(/`/g, "\\`")}\`,
    pages: '${pageString}',
    isRestricted: ${accessMode !== 'open'},
    isExclusive: false,
    pdfUrl: '${link}',
  },`;

    const detailedBody = `
--- ✂️ CODE À COPIER DANS LIBRARYDATA.TS ✂️ ---
${codeSnippet}

----------------------------------------
RÉSUMÉ POUR VALIDATION :
Soumis par : ${submitterName} (${submitterEmail})
Type : ${docType}
Lien : ${link}
    `;

    const templateParams = {
        name: submitterName,
        email: submitterEmail,
        user_name: submitterName,
        user_email: submitterEmail,
        title: title,
        link: link,
        message: detailedBody
    };

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
        <div className="bg-slate-800 p-4 text-white flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
             <div className="bg-white/10 p-2 rounded-lg">
               <svg className="w-6 h-6 text-blue-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
             </div>
             <div><h2 className="text-lg font-bold font-serif">Ajouter un document</h2><p className="text-xs text-slate-400">Générateur JSON • Via EmailJS</p></div>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">✕</button>
        </div>

        {status === 'success' ? (
           <div className="flex-grow flex flex-col items-center justify-center p-12 text-center bg-green-50">
             <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm"><svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></div>
             <h3 className="text-2xl font-bold text-green-800 font-serif">Envoyé !</h3>
             <p className="text-green-600 mt-2 max-w-sm">Le code JSON formaté a été envoyé sur votre email.</p>
           </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto custom-scrollbar bg-slate-50">
            {/* 1. TYPE & DOMAINE */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">1. Type de Document</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="label-zotero">Type</label>
                   <select className="input-zotero" value={docType} onChange={e => setDocType(e.target.value)}>
                     <option value="Article Scientifique">Article Scientifique</option>
                     <option value="Actes de Conférence">Actes de Conférence</option>
                     <option value="Thèse">Thèse/Mémoire</option>
                     <option value="Livre">Livre</option>
                     <option value="Rapport">Rapport</option>
                   </select>
                 </div>
                 <div>
                   <label className="label-zotero">Domaine</label>
                   <select className="input-zotero" value={domain} onChange={e => setDomain(e.target.value)}>
                     {SCIMAGO_DOMAINS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                   </select>
                 </div>
               </div>
               <div><label className="label-zotero">Titre</label><input required className="input-zotero font-serif font-medium" placeholder="Titre complet..." value={title} onChange={e => setTitle(e.target.value)} /></div>
            </div>

            {/* 2. AUTEURS */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
               <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">2. Auteurs</h3>
                 <button type="button" onClick={addAuthor} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 font-bold">+ Ajouter</button>
               </div>
               {authors.map((author, index) => (
                 <div key={index} className="flex gap-2 items-end"><div className="flex-grow grid grid-cols-2 gap-2"><div><input required className="input-zotero" placeholder="Nom (ex: Nkodia)" value={author.lastName} onChange={e => updateAuthor(index, 'lastName', e.target.value)} /></div><div><input required className="input-zotero" placeholder="Prénom (ex: Hardy)" value={author.firstName} onChange={e => updateAuthor(index, 'firstName', e.target.value)} /></div></div>{authors.length > 1 && (<button type="button" onClick={() => removeAuthor(index)} className="mb-2 text-slate-400 hover:text-red-500">✕</button>)}</div>
               ))}
            </div>

            {/* 3. DÉTAILS - DYNAMIQUE SELON LE TYPE */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">3. Détails</h3>
               
               {docType === 'Article Scientifique' && (
                 <>
                   <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2"><label className="label-zotero">Journal</label><input className="input-zotero" placeholder="ex: Nature, Zootaxa..." value={publication} onChange={e => setPublication(e.target.value)} /></div>
                      <div><label className="label-zotero">Année</label><input className="input-zotero" placeholder="2024" value={date} onChange={e => setDate(e.target.value)} /></div>
                   </div>
                   <div className="grid grid-cols-3 gap-4">
                      <div><label className="label-zotero">Vol</label><input className="input-zotero" placeholder="83" value={volume} onChange={e => setVolume(e.target.value)} /></div>
                      <div><label className="label-zotero">No</label><input className="input-zotero" value={issue} onChange={e => setIssue(e.target.value)} /></div>
                      <div><label className="label-zotero">Pages</label><input className="input-zotero" placeholder="10-15" value={pages} onChange={e => setPages(e.target.value)} /></div>
                   </div>
                   <div><label className="label-zotero">DOI</label><input className="input-zotero" value={doi} onChange={e => setDoi(e.target.value)} /></div>
                 </>
               )}
               
               {docType === 'Actes de Conférence' && (
                 <>
                   <div><label className="label-zotero">Conférence</label><input className="input-zotero" placeholder="ex: IGARSS 2015..." value={publication} onChange={e => setPublication(e.target.value)} /></div>
                   <div className="grid grid-cols-2 gap-4">
                      <div><label className="label-zotero">Lieu</label><input className="input-zotero" value={place} onChange={e => setPlace(e.target.value)} /></div>
                      <div><label className="label-zotero">Année/Date</label><input className="input-zotero" placeholder="2024" value={date} onChange={e => setDate(e.target.value)} /></div>
                   </div>
                   <div><label className="label-zotero">Pages</label><input className="input-zotero" value={pages} onChange={e => setPages(e.target.value)} /></div>
                 </>
               )}
               
               {(docType.includes('Thèse') || docType.includes('Mémoire')) && (
                 <>
                   <div><label className="label-zotero">Université</label><input className="input-zotero" placeholder="ex: UMNG" value={university} onChange={e => setUniversity(e.target.value)} /></div>
                   <div className="grid grid-cols-2 gap-4">
                      <div><label className="label-zotero">Type</label><input className="input-zotero" value={docType} onChange={e => setDocType(e.target.value)} /></div>
                      <div><label className="label-zotero">Lieu</label><input className="input-zotero" value={place} onChange={e => setPlace(e.target.value)} /></div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div><label className="label-zotero">Année</label><input className="input-zotero" value={date} onChange={e => setDate(e.target.value)} /></div>
                      <div><label className="label-zotero">Pages</label><input className="input-zotero" value={pages} onChange={e => setPages(e.target.value)} /></div>
                   </div>
                 </>
               )}

               {(docType === 'Livre' || docType === 'Rapport') && (
                 <>
                   <div><label className="label-zotero">Éditeur</label><input className="input-zotero" value={publication} onChange={e => setPublication(e.target.value)} /></div>
                   <div className="grid grid-cols-2 gap-4">
                      <div><label className="label-zotero">Lieu</label><input className="input-zotero" value={place} onChange={e => setPlace(e.target.value)} /></div>
                      <div><label className="label-zotero">Année</label><input className="input-zotero" value={date} onChange={e => setDate(e.target.value)} /></div>
                   </div>
                   <div><label className="label-zotero">Pages/ISBN</label><input className="input-zotero" value={pages} onChange={e => setPages(e.target.value)} /></div>
                 </>
               )}
            </div>

            {/* 4. DROITS */}
            <div className="bg-amber-50 p-5 rounded-xl border border-amber-200 shadow-sm space-y-4">
               <h3 className="text-xs font-black text-amber-700 uppercase tracking-widest border-b border-amber-200 pb-2">4. Droits & Partage</h3>
               <div className="space-y-3">
                 <label className="flex items-start gap-3 cursor-pointer p-3 bg-white rounded-lg border border-amber-100"><input type="radio" name="access" className="mt-1" checked={accessMode === 'open'} onChange={() => setAccessMode('open')} /><div><span className="block font-bold text-slate-800">🔓 Open Access</span></div></label>
                 <label className="flex items-start gap-3 cursor-pointer p-3 bg-white rounded-lg border border-amber-100"><input type="radio" name="access" className="mt-1" checked={accessMode === 'restricted'} onChange={() => setAccessMode('restricted')} /><div><span className="block font-bold text-slate-800">🔒 Restreint</span></div></label>
                 <label className="flex items-start gap-3 cursor-pointer p-3 bg-white rounded-lg border border-amber-100"><input type="radio" name="access" className="mt-1" checked={accessMode === 'paid'} onChange={() => setAccessMode('paid')} /><div><span className="block font-bold text-slate-800">💰 Payant</span></div></label>
               </div>
               <div className="pt-2"><label className="label-zotero">Lien PDF (URL)</label><input required type="url" className="input-zotero bg-amber-50/50 border-amber-300" placeholder="https://..." value={link} onChange={e => setLink(e.target.value)} /></div>
            </div>

            {/* 5. RÉSUMÉ */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm"><h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 mb-3">5. Résumé</h3><textarea required rows={5} className="input-zotero resize-none" value={abstract} onChange={e => setAbstract(e.target.value)} /></div>

            {/* CONTACT */}
            <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 shadow-sm space-y-4">
               <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest border-b border-blue-100 pb-2">Contact</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div><label className="label-zotero text-blue-700">Votre Nom</label><input required className="input-zotero border-blue-200" value={submitterName} onChange={e => setSubmitterName(e.target.value)} /></div>
                 <div><label className="label-zotero text-blue-700">Votre Email</label><input required type="email" className="input-zotero border-blue-200" value={submitterEmail} onChange={e => setSubmitterEmail(e.target.value)} /></div>
               </div>
            </div>

            <button type="submit" disabled={status === 'sending'} className="w-full bg-blue-700 text-white font-bold py-4 rounded-xl hover:bg-blue-800 transition-all shadow-lg">{status === 'sending' ? 'Envoi...' : 'Envoyer'}</button>
            {status === 'error' && (<p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg mt-2">Erreur. Désactivez AdBlock ou vérifiez votre connexion.</p>)}
          </form>
        )}
      </div>
      <style>{`.label-zotero { display: block; font-size: 0.7rem; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 0.25rem; letter-spacing: 0.05em; } .input-zotero { width: 100%; background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.5rem 0.75rem; font-size: 0.875rem; color: #1e293b; outline: none; transition: all 0.2s; } .input-zotero:focus { background-color: #fff; border-color: #2563eb; box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1); } .custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; } .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }`}</style>
    </div>
  );
};

export default SubmitPublicationModal;