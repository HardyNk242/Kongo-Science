import React, { useState, useEffect } from 'react';
import { THESES_LIBRARY, SCIMAGO_DOMAINS } from '../constants';
import { Thesis } from '../types';
import SubmitPublicationModal from './SubmitPublicationModal';

const ITEMS_PER_PAGE = 10;

const LibraryView: React.FC = () => {
  // --- ÉTATS ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('Tous');
  const [selectedYearFilter, setSelectedYearFilter] = useState('any');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  
  // Navigation
  const [selectedThesis, setSelectedThesis] = useState<Thesis | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // État pour la Pop-up de demande d'email
  const [showMailPopup, setShowMailPopup] = useState(false);

  // --- LOGIQUE DE FILTRAGE ---
  const filteredTheses = THESES_LIBRARY.filter((t) => {
    // 1. Recherche Textuelle
    const matchesSearch = 
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.abstract.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Filtre Domaine (Basé sur la valeur SCIMAGO en anglais)
    const matchesDomain = selectedDomain === 'Tous' || t.domain === selectedDomain;

    // 3. Filtre Année
    let matchesYear = true;
    const thesisYear = parseInt(t.year);
    if (selectedYearFilter !== 'any') {
       matchesYear = thesisYear >= parseInt(selectedYearFilter);
    }
    
    return matchesSearch && matchesDomain && matchesYear;
  });

  // --- PAGINATION ---
  const totalPages = Math.ceil(filteredTheses.length / ITEMS_PER_PAGE);
  const currentTheses = filteredTheses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedDomain, selectedYearFilter]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [currentPage, selectedThesis]);

  // --- UTILS ---
  const copyCitation = (thesis: Thesis) => {
    const citation = `${thesis.author} (${thesis.year}). ${thesis.title}. ${thesis.institution}.`;
    navigator.clipboard.writeText(citation);
    alert('Citation copiée !');
  };

  const renderZoteroCoins = (thesis: Thesis) => {
    const title = encodeURIComponent(thesis.title);
    const author = encodeURIComponent(thesis.author);
    const date = encodeURIComponent(thesis.year);
    const publisher = encodeURIComponent(thesis.institution);
    const isThesis = thesis.type.includes('Thèse') || thesis.type.includes('Mémoire');
    const genre = isThesis ? 'dissertation' : 'article';
    const fmt = isThesis ? 'info:ofi/fmt:kev:mtx:dissertation' : 'info:ofi/fmt:kev:mtx:journal';
    const coinsData = `ctx_ver=Z39.88-2004&rft_val_fmt=${fmt}&rft.title=${title}&rft.au=${author}&rft.date=${date}&rft.inst=${publisher}&rft.genre=${genre}`;
    return <span className="Z3988" title={coinsData} style={{ display: 'none' }}></span>;
  };

  // --- COMPOSANT POP-UP EMAIL (Interne) ---
  const MailRequestPopup = () => {
    if (!showMailPopup || !selectedThesis) return null;

    const subject = encodeURIComponent(`Demande d'accès : ${selectedThesis.title.substring(0, 50)}...`);
    const body = encodeURIComponent(`Bonjour Dr. Nkodia,\n\nJe suis intéressé par votre publication "${selectedThesis.title}" (${selectedThesis.year}).\nPourriez-vous m'envoyer une copie privée ?`);
    
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=nkodiahardy@gmail.com&su=${subject}&body=${body}`;
    const mailtoLink = `mailto:nkodiahardy@gmail.com?subject=${subject}&body=${body}`;

    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative">
          <button 
            onClick={() => setShowMailPopup(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-red-500"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Demander une copie privée</h3>
            <p className="text-sm text-slate-500 mt-2">
              Ce document est protégé. Veuillez envoyer une demande à l'auteur pour y accéder.
            </p>
          </div>

          <div className="space-y-3">
            <a 
              href={gmailLink}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full bg-red-50 text-red-700 hover:bg-red-100 p-3 rounded-xl font-bold transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>
              Écrire via Gmail
            </a>

            <button 
              onClick={() => {
                navigator.clipboard.writeText("nkodiahardy@gmail.com");
                alert("Email copié !");
              }}
              className="flex items-center justify-center gap-3 w-full bg-slate-100 text-slate-700 hover:bg-slate-200 p-3 rounded-xl font-bold transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
              Copier l'email
            </button>
            
            <a 
              href={mailtoLink}
              className="block text-center text-xs text-slate-400 hover:text-blue-600 underline mt-4"
            >
              Ou ouvrir l'application mail par défaut
            </a>
          </div>
        </div>
      </div>
    );
  };

  // ----------------------------------------------------------------------------------
  // VUE DÉTAILLÉE
  // ----------------------------------------------------------------------------------
  if (selectedThesis) {
    return (
      <div className="bg-white min-h-screen pt-32 pb-20 px-6">
        {showMailPopup && <MailRequestPopup />}

        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => setSelectedThesis(null)}
            className="group flex items-center gap-2 text-sm text-slate-500 hover:text-blue-700 mb-8 transition-colors"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Retour aux résultats
          </button>

          {renderZoteroCoins(selectedThesis)}

          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8 md:p-12">
             {/* Header Detail */}
             <div className="flex flex-col md:flex-row gap-6 mb-8 border-b border-slate-100 pb-8">
                <div className="w-24 h-32 bg-slate-50 border border-slate-200 rounded-xl flex-shrink-0 flex items-center justify-center relative overflow-hidden">
                   <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                   {/* BADGES EN HAUT A DROITE DE L'ICONE */}
                   {selectedThesis.isForSale ? (
                     <div className="absolute top-0 right-0 bg-green-500 text-white p-1 rounded-bl-lg shadow-sm" title="Disponible à l'achat">
                       <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                     </div>
                   ) : selectedThesis.isRestricted ? (
                     <div className="absolute top-0 right-0 bg-amber-400 text-white p-1 rounded-bl-lg shadow-sm" title="Accès Restreint">
                       <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                     </div>
                   ) : null}
                </div>
                <div>
                   <div className="flex flex-wrap gap-2 mb-3">
                     <span className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-100">
                       {selectedThesis.type}
                     </span>
                     {selectedThesis.isForSale ? (
                       <span className="inline-block bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-100 flex items-center gap-1">
                         En Vente ({selectedThesis.price})
                       </span>
                     ) : selectedThesis.isRestricted ? (
                       <span className="inline-block bg-amber-50 text-amber-700 text-xs font-bold px-3 py-1 rounded-full border border-amber-100 flex items-center gap-1">
                         Accès sur demande
                       </span>
                     ) : null}
                   </div>
                   <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-4 leading-tight">
                     {selectedThesis.title}
                   </h1>
                   <div className="text-slate-600 text-lg">
                     <span className="font-bold text-slate-900">{selectedThesis.author}</span>
                     <span className="mx-2 text-slate-300">•</span>
                     <span>{selectedThesis.year}</span>
                     <span className="mx-2 text-slate-300">•</span>
                     <span className="italic">{selectedThesis.institution}</span>
                   </div>
                </div>
             </div>

             <div className="mb-10">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Résumé (Abstract)</h3>
               <p className="text-slate-700 leading-relaxed text-lg text-justify font-serif">
                 {selectedThesis.abstract}
               </p>
             </div>

             <div className="flex flex-col sm:flex-row gap-4 border-t border-slate-50 pt-8">
                {/* LOGIQUE DES 3 CAS : VENTE > RESTREINT > LIBRE */}
                {selectedThesis.isForSale ? (
                  // CAS 1 : VENTE (AMAZON)
                  <a 
                    href={selectedThesis.purchaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-green-200 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                     Acheter sur Amazon
                  </a>
                ) : selectedThesis.isRestricted ? (
                  // CAS 2 : RESTREINT (POPUP EMAIL)
                  <button 
                    onClick={() => setShowMailPopup(true)}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-amber-200 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                     Demander une copie privée
                  </button>
                ) : (
                  // CAS 3 : LIBRE (PDF)
                  <a 
                    href={selectedThesis.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-blue-200 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                     Télécharger (PDF)
                  </a>
                )}

                <button 
                  onClick={() => copyCitation(selectedThesis)}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-700 px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border border-slate-200 w-full sm:w-auto"
                >
                   Citer
                </button>
             </div>

             {selectedThesis.isRestricted && !selectedThesis.isForSale && (
               <div className="mt-6 bg-amber-50 p-4 rounded-xl border border-amber-100">
                 <p className="text-xs text-amber-900 leading-relaxed">
                   <strong>Note de l'auteur :</strong> Ce document est protégé par copyright. Une copie privée peut être fournie sur demande pour un usage de recherche.
                 </p>
               </div>
             )}
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------------------
  // VUE PRINCIPALE (LISTE SCHOLAR AVEC SIDEBAR)
  // ----------------------------------------------------------------------------------
  return (
    <div className="bg-white min-h-screen">
      {showSubmitModal && <SubmitPublicationModal onClose={() => setShowSubmitModal(false)} />}
      
      {showMailPopup && <MailRequestPopup />}

      {/* HEADER DE RECHERCHE */}
      <section className="bg-slate-900 pt-32 pb-12 text-white sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-6 items-center">
             <div className="relative flex-grow w-full">
               <input 
                 type="text" 
                 placeholder="Rechercher (titre, auteur, mots-clés)..." 
                 className="w-full h-12 pl-12 pr-4 rounded-lg text-slate-900 bg-white shadow-inner focus:ring-2 focus:ring-blue-500 outline-none"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
               <svg className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             </div>
             <button 
                onClick={() => setShowSubmitModal(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold whitespace-nowrap transition-colors flex items-center gap-2"
             >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Soumettre
             </button>
        </div>
      </section>

      {/* LAYOUT 2 COLONNES */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col md:flex-row gap-12">
        
        {/* SIDEBAR FILTRES */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
           
           {/* Filtre Année */}
           <div>
             <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">
               Année
             </h4>
             <div className="flex flex-col gap-2">
               {[
                 { label: 'N\'importe quand', val: 'any' },
                 { label: 'Depuis 2026', val: '2026' },
                 { label: 'Depuis 2025', val: '2025' },
                 { label: 'Depuis 2022', val: '2022' },
               ].map((opt) => (
                 <button
                   key={opt.val}
                   onClick={() => setSelectedYearFilter(opt.val)}
                   className={`text-left text-sm transition-colors ${selectedYearFilter === opt.val ? 'font-bold text-blue-700' : 'text-slate-600 hover:text-blue-600 hover:underline'}`}
                 >
                   {opt.label}
                 </button>
               ))}
             </div>
           </div>

           {/* Filtre Domaines (DYNAMIQUE SCIMAGO) */}
           <div>
             <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">
               Domaines
             </h4>
             <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
               {/* Option TOUS */}
               <button
                  onClick={() => setSelectedDomain('Tous')}
                  className={`text-left text-sm transition-colors ${selectedDomain === 'Tous' ? 'font-bold text-blue-700' : 'text-slate-600 hover:text-blue-600 hover:underline'}`}
               >
                 Tous les domaines
               </button>

               {/* Liste Scimago */}
               {SCIMAGO_DOMAINS.map((dom) => (
                 <button
                   key={dom.value}
                   onClick={() => setSelectedDomain(dom.value)} // Filtre sur la valeur Anglaise
                   className={`text-left text-sm transition-colors ${selectedDomain === dom.value ? 'font-bold text-blue-700' : 'text-slate-600 hover:text-blue-600 hover:underline'}`}
                 >
                   {dom.label} {/* Affiche le label Français */}
                 </button>
               ))}
             </div>
           </div>
        </aside>

        {/* RÉSULTATS */}
        <main className="flex-grow">
            <div className="mb-6 text-slate-400 text-sm">
              Environ {filteredTheses.length} résultats
            </div>

            <div className="space-y-8">
              {currentTheses.length > 0 ? (
                currentTheses.map((thesis) => (
                  <div key={thesis.id} className="group relative">
                    {renderZoteroCoins(thesis)}
                    
                    <h3 
                      onClick={() => setSelectedThesis(thesis)}
                      className="text-xl font-serif text-blue-800 font-medium cursor-pointer hover:underline hover:text-blue-600 mb-1 leading-snug"
                    >
                      {thesis.title}
                    </h3>

                    <div className="text-sm text-green-800 mb-2 font-medium">
                      {thesis.author} - <span className="italic">{thesis.institution}</span>, {thesis.year}
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-2 max-w-3xl">
                      {thesis.abstract}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs">
                       <span className={`font-bold uppercase tracking-wider ${thesis.isForSale ? 'text-green-600' : thesis.isRestricted ? 'text-amber-600' : 'text-slate-500'}`}>
                        {thesis.isForSale ? `[Achat ${thesis.price}]` : thesis.isRestricted ? '[Sur demande]' : '[PDF] Accès Libre'}
                       </span>
                       <button onClick={() => copyCitation(thesis)} className="text-slate-400 hover:text-blue-700 hover:underline">
                         Citer
                       </button>
                       <button onClick={() => setSelectedThesis(thesis)} className="text-slate-400 hover:text-blue-700 hover:underline">
                         Voir détails
                       </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-slate-500">Aucun résultat ne correspond à votre recherche.</p>
                  <button 
                    onClick={() => {setSearchTerm(''); setSelectedDomain('Tous'); setSelectedYearFilter('any');}}
                    className="mt-4 text-blue-600 font-bold hover:underline"
                  >
                    Effacer les filtres
                  </button>
                </div>
              )}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="mt-16 pt-8 border-t border-slate-100 flex justify-center items-center gap-2 select-none">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="px-3 py-2 text-sm text-blue-700 hover:underline disabled:opacity-30 disabled:no-underline"
                >
                  Précédent
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded text-sm font-bold transition-all ${
                      currentPage === page
                      ? 'text-slate-900' 
                      : 'text-blue-700 hover:underline'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="px-3 py-2 text-sm text-blue-700 hover:underline disabled:opacity-30 disabled:no-underline"
                >
                  Suivant
                </button>
              </div>
            )}
        </main>
      </div>
    </div>
  );
};

export default LibraryView;
