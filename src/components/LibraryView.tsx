import React, { useState, useEffect } from 'react';
import { THESES_LIBRARY } from '../constants';
import { Thesis } from '../types';
import SubmitPublicationModal from './SubmitPublicationModal';

const ITEMS_PER_PAGE = 10;

const LibraryView: React.FC = () => {
  // --- ÉTATS ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('Tous');
  const [selectedYearFilter, setSelectedYearFilter] = useState('any'); // 'any', '2026', '2025', '2022'
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  
  // Navigation
  const [selectedThesis, setSelectedThesis] = useState<Thesis | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // --- LOGIQUE DE FILTRAGE ---
  const domains = ['Tous', ...new Set(THESES_LIBRARY.map((t) => t.domain))];

  const filteredTheses = THESES_LIBRARY.filter((t) => {
    // 1. Recherche Textuelle
    const matchesSearch = 
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.abstract.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Filtre Domaine
    const matchesDomain = selectedDomain === 'Tous' || t.domain === selectedDomain;

    // 3. Filtre Année (Logique "Depuis...")
    let matchesYear = true;
    const thesisYear = parseInt(t.year); // On suppose que l'année commence par 4 chiffres
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

  // Reset page quand on change un filtre
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDomain, selectedYearFilter]);

  // Scroll top au changement de page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, selectedThesis]);

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

  // ----------------------------------------------------------------------------------
  // VUE DÉTAILLÉE (Page unique quand on clique sur un titre)
  // ----------------------------------------------------------------------------------
  if (selectedThesis) {
    const mailSubject = encodeURIComponent(`Demande d'accès : ${selectedThesis.title}`);
    const mailBody = encodeURIComponent(`Bonjour,\n\nJe suis intéressé par votre publication "${selectedThesis.title}" publiée en ${selectedThesis.year}.\nPourriez-vous s'il vous plaît m'envoyer une copie privée pour mes recherches personnelles ?\n\nCordialement,`);
    const emailLink = `mailto:nkodiahardy@gmail.com?subject=${mailSubject}&body=${mailBody}`;

    return (
      <div className="bg-white min-h-screen pt-32 pb-20 px-6">
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
             <div className="flex flex-col md:flex-row gap-6 mb-8 border-b border-slate-100 pb-8">
                <div className="w-24 h-32 bg-slate-50 border border-slate-200 rounded-xl flex-shrink-0 flex items-center justify-center relative overflow-hidden">
                   <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                   {selectedThesis.isRestricted && (
                     <div className="absolute top-0 right-0 bg-amber-400 text-white p-1 rounded-bl-lg shadow-sm" title="Accès Restreint">
                       <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                     </div>
                   )}
                </div>
                <div>
                   <div className="flex flex-wrap gap-2 mb-3">
                     <span className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-100">
                       {selectedThesis.type}
                     </span>
                     {selectedThesis.isRestricted && (
                       <span className="inline-block bg-amber-50 text-amber-700 text-xs font-bold px-3 py-1 rounded-full border border-amber-100 flex items-center gap-1">
                         <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                         Accès sur demande
                       </span>
                     )}
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
                {selectedThesis.isRestricted ? (
                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <a 
                      href={emailLink}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-amber-200 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                       <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                       Demander une copie privée
                    </a>
                  </div>
                ) : (
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

             {selectedThesis.isRestricted && (
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

      {/* HEADER DE RECHERCHE (Fixe ou Sticky) */}
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

      {/* LAYOUT 2 COLONNES : SIDEBAR + RÉSULTATS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col md:flex-row gap-12">
        
        {/* --- COLONNE GAUCHE (FILTRES) --- */}
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
               <div className="text-slate-400 text-xs italic mt-2 cursor-not-allowed">
                 Période personnalisée...
               </div>
             </div>
           </div>

           {/* Filtre Domaines (Déplacé ici) */}
           <div>
             <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">
               Domaines
             </h4>
             <div className="flex flex-col gap-2">
               {domains.map((domain) => (
                 <button
                   key={domain}
                   onClick={() => setSelectedDomain(domain)}
                   className={`text-left text-sm transition-colors ${selectedDomain === domain ? 'font-bold text-blue-700' : 'text-slate-600 hover:text-blue-600 hover:underline'}`}
                 >
                   {domain}
                 </button>
               ))}
             </div>
           </div>

        </aside>

        {/* --- COLONNE DROITE (RÉSULTATS) --- */}
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
                       <span className={`font-bold uppercase tracking-wider ${thesis.isRestricted ? 'text-amber-600' : 'text-slate-500'}`}>
                        {thesis.isRestricted ? '[Sur demande]' : '[PDF] Accès Libre'}
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

            {/* PAGINATION NUMÉROTÉE */}
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
                      ? 'text-slate-900' // Page active (style Google Scholar : juste du texte noir)
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
