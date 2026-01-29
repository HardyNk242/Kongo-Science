import React, { useState, useEffect } from 'react';
import { THESES_LIBRARY } from '../constants';
import { Thesis } from '../types';
import SubmitPublicationModal from './SubmitPublicationModal';

const ITEMS_PER_PAGE = 10;

const LibraryView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('Tous');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  
  const [selectedThesis, setSelectedThesis] = useState<Thesis | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // --- FILTRAGE ---
  const domains = ['Tous', ...new Set(THESES_LIBRARY.map((t) => t.domain))];

  const filteredTheses = THESES_LIBRARY.filter((t) => {
    const matchesSearch = 
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.abstract.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = selectedDomain === 'Tous' || t.domain === selectedDomain;
    
    return matchesSearch && matchesDomain;
  });

  // --- PAGINATION ---
  const totalPages = Math.ceil(filteredTheses.length / ITEMS_PER_PAGE);
  const currentTheses = filteredTheses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDomain]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, selectedThesis]);

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

  // --- VUE DÉTAILLÉE ---
  if (selectedThesis) {
    // Préparation du mail de demande
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
                   {/* Indicateur visuel si restreint */}
                   {selectedThesis.isRestricted && (
                     <div className="absolute top-0 right-0 bg-amber-400 text-white p-1 rounded-bl-lg">
                       <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                     </div>
                   )}
                </div>
                <div>
                   <div className="flex gap-2 mb-3">
                     <span className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                       {selectedThesis.type}
                     </span>
                     {selectedThesis.isRestricted && (
                       <span className="inline-block bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                         <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                         Accès Restreint (Copyright)
                       </span>
                     )}
                   </div>
                   <h1 className="text-2xl md:text-4xl font-serif font-bold text-slate-900 mb-4 leading-tight">
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
               <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Résumé (Abstract)</h3>
               <p className="text-slate-700 leading-relaxed text-lg text-justify">
                 {selectedThesis.abstract}
               </p>
             </div>

             <div className="flex flex-wrap gap-4">
                {/* LOGIQUE INTELLIGENTE DES BOUTONS */}
                {selectedThesis.isRestricted ? (
                  // CAS 1: ACCÈS RESTREINT -> EMAIL
                  <a 
                    href={emailLink}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-amber-200 hover:-translate-y-1 transition-all flex items-center gap-2"
                  >
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                     Demander une copie privée
                  </a>
                ) : (
                  // CAS 2: ACCÈS LIBRE -> TÉLÉCHARGEMENT
                  <a 
                    href={selectedThesis.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-blue-200 hover:-translate-y-1 transition-all flex items-center gap-2"
                  >
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                     Télécharger (PDF)
                  </a>
                )}

                <button 
                  onClick={() => copyCitation(selectedThesis)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-4 rounded-xl font-bold transition-all flex items-center gap-2"
                >
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                   Citer
                </button>
             </div>
             
             {/* Note explicative pour les documents restreints */}
             {selectedThesis.isRestricted && (
               <p className="mt-6 text-sm text-slate-500 italic">
                 * Ce document est soumis à des droits d'auteur (Copyright). Conformément aux usages académiques, vous pouvez demander une copie privée à l'auteur pour vos travaux de recherche.
               </p>
             )}
          </div>
        </div>
      </div>
    );
  }

  // --- VUE LISTE ---
  return (
    <div className="bg-white min-h-screen">
      {showSubmitModal && <SubmitPublicationModal onClose={() => setShowSubmitModal(false)} />}

      <section className="bg-slate-900 pt-32 pb-16 text-white">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-3xl font-serif font-bold italic mb-6">Bibliothèque des Publications</h1>
          
          <div className="flex flex-col md:flex-row gap-4">
             <div className="relative flex-grow">
               <input 
                 type="text" 
                 placeholder="Rechercher (titre, auteur, mots-clés)..." 
                 className="w-full h-14 pl-12 pr-4 rounded-xl text-slate-900 focus:ring-4 focus:ring-blue-500/30 outline-none"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
               <svg className="w-5 h-5 text-slate-400 absolute left-4 top-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             </div>
             <button 
                onClick={() => setShowSubmitModal(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-colors flex items-center justify-center gap-2"
             >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Soumettre
             </button>
          </div>

          <div className="flex gap-2 overflow-x-auto py-4 mt-2 no-scrollbar">
            {domains.map((domain) => (
              <button
                key={domain}
                onClick={() => setSelectedDomain(domain)}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedDomain === domain 
                  ? 'bg-white text-slate-900 border-white' 
                  : 'bg-transparent text-slate-400 border-slate-700 hover:border-slate-500'
                }`}
              >
                {domain}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 max-w-5xl mx-auto px-6">
        <div className="space-y-8">
          {currentTheses.length > 0 ? (
            currentTheses.map((thesis) => (
              <div key={thesis.id} className="group">
                {renderZoteroCoins(thesis)}
                
                <h3 
                  onClick={() => setSelectedThesis(thesis)}
                  className="text-xl md:text-2xl font-serif text-blue-700 font-medium cursor-pointer hover:underline mb-1"
                >
                  {thesis.title}
                </h3>

                <div className="text-sm text-green-700 mb-2 font-medium">
                  {thesis.author} - {thesis.institution}, {thesis.year} - <span className="text-slate-500">{thesis.domain}</span>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-3">
                  {thesis.abstract}
                </p>

                <div className="flex items-center gap-4 text-xs">
                  <span className={`font-bold uppercase tracking-wider flex items-center gap-1 ${thesis.isRestricted ? 'text-amber-600' : 'text-slate-500'}`}>
                    {thesis.isRestricted ? (
                      <>
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                        [Sur demande] {thesis.type}
                      </>
                    ) : (
                      <>
                         <span className="text-blue-600">[PDF]</span> {thesis.type}
                      </>
                    )}
                  </span>
                  
                  <button onClick={() => copyCitation(thesis)} className="text-slate-400 hover:text-blue-700 transition-colors">
                    Citer
                  </button>
                  <button onClick={() => setSelectedThesis(thesis)} className="text-slate-400 hover:text-blue-700 transition-colors">
                    Voir les détails
                  </button>
                  {thesis.isExclusive && (
                     <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded">Exclusif Kongo Science</span>
                  )}
                </div>
              </div>
            ))
          ) : (
             <div className="text-center py-20">
               <div className="text-4xl mb-4">🔍</div>
               <p className="text-slate-500">Aucun résultat pour cette recherche.</p>
             </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-16 pt-8 border-t border-slate-100 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg font-bold transition-all ${
                  currentPage === page
                  ? 'bg-blue-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default LibraryView;
