import React, { useState, useEffect } from 'react';
import { THESES_LIBRARY } from '../constants';
import { Thesis } from '../types';
import SubmitPublicationModal from './SubmitPublicationModal';

const ITEMS_PER_PAGE = 10;

const LibraryView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('Tous');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  
  // États pour la navigation (Liste vs Détail)
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

  // Reset page quand on cherche
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDomain]);

  // Retour en haut de page quand on change de page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, selectedThesis]);

  // --- UTILS ---
  const copyCitation = (thesis: Thesis) => {
    const citation = `${thesis.author} (${thesis.year}). ${thesis.title}. ${thesis.institution}. Archivé sur Kongo Science.`;
    navigator.clipboard.writeText(citation);
    alert('Citation copiée dans le presse-papier !');
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

  // --- VUE DÉTAILLÉE (La "Sous-page") ---
  if (selectedThesis) {
    // Préparation du mail pour la demande de copie privée
    const mailSubject = encodeURIComponent(`Demande d'accès : ${selectedThesis.title}`);
    const mailBody = encodeURIComponent(`Bonjour,\n\nJe suis intéressé par votre publication "${selectedThesis.title}" publiée en ${selectedThesis.year}.\nPourriez-vous s'il vous plaît m'envoyer une copie privée pour mes recherches personnelles ?\n\nCordialement,`);
    const emailLink = `mailto:nkodiahardy@gmail.com?subject=${mailSubject}&body=${mailBody}`;

    return (
      <div className="bg-white min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Fil d'ariane */}
          <button 
            onClick={() => setSelectedThesis(null)}
            className="group flex items-center gap-2 text-sm text-slate-500 hover:text-blue-700 mb-8 transition-colors"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Retour aux résultats
          </button>

          {/* Injection Zotero */}
          {renderZoteroCoins(selectedThesis)}

          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8 md:p-12">
             {/* En-tête Document */}
             <div className="flex flex-col md:flex-row gap-6 mb-8 border-b border-slate-100 pb-8">
                <div className="w-24 h-32 bg-slate-50 border border-slate-200 rounded-xl flex-shrink-0 flex items-center justify-center relative overflow-hidden">
                   <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                   {/* Badge Cadenas si restreint */}
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

             {/* Résumé */}
             <div className="mb-10">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Résumé (Abstract)</h3>
               <p className="text-slate-700 leading-relaxed text-lg text-justify font-serif">
                 {selectedThesis.abstract}
               </p>
             </div>

             {/* Actions : Logique de Court-circuit */}
             <div className="flex flex-col sm:flex-row gap-4 border-t border-slate-50 pt-8">
                {selectedThesis.isRestricted ? (
                  // CAS 1: ACCÈS RESTREINT (Email)
                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <a 
                      href={emailLink}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-amber-200 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                       <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                       Demander une copie privée
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText("nkodiahardy@gmail.com");
                        alert("Email copié ! Vous pouvez maintenant m'envoyer votre demande.");
                      }}
                      className="text-sm text-slate-400 underline hover:text-blue-700 px-4"
                    >
                      (Ou copier l'email)
                    </button>
                  </div>
                ) : (
                  // CAS 2: ACCÈS LIBRE (Téléchargement)
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
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                   Citer
                </button>
             </div>

             {/* Mention légale pour les documents restreints */}
             {selectedThesis.isRestricted && (
               <div className="mt-6 bg-amber-50 p-4 rounded-xl border border-amber-100 flex gap-3">
                 <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 <p className="text-xs text-amber-900 leading-relaxed">
                   <strong>Note de l'auteur :</strong> Ce document est protégé par les droits d'auteur de l'éditeur. Conformément aux usages académiques (Scholarly sharing), une copie privée peut être fournie aux chercheurs sur demande directe pour un usage personnel et non-commercial.
                 </p>
               </div>
             )}
          </div>
        </div>
      </div>
    );
  }

  // --- VUE PRINCIPALE (LISTE SCHOLAR) ---
  return (
    <div className="bg-white min-h-screen">
      {showSubmitModal && <SubmitPublicationModal onClose={() => setShowSubmitModal(false)} />}

      {/* HEADER RECHERCHE */}
      <section className="bg-slate-900 pt-32 pb-16 text-white relative overflow-hidden">
        {/* Légère décoration de fond */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="flex justify-between items-end mb-6">
            <h1 className="text-3xl font-serif font-bold italic">Bibliothèque des Publications</h1>
            <span className="text-slate-400 text-sm hidden sm:block">{filteredTheses.length} résultats</span>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
             <div className="relative flex-grow">
               <input 
                 type="text" 
                 placeholder="Rechercher (titre, auteur, mots-clés)..." 
                 className="w-full h-14 pl-12 pr-4 rounded-xl text-slate-900 bg-white shadow-lg focus:ring-4 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-400"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
               <svg className="w-5 h-5 text-slate-400 absolute left-4 top-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             </div>
             <button 
                onClick={() => setShowSubmitModal(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all shadow-lg shadow-blue-900/50 active:scale-95 flex items-center justify-center gap-2"
             >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Soumettre un travail
             </button>
          </div>

          {/* Filtres rapides */}
          <div className="flex gap-2 overflow-x-auto py-4 mt-2 no-scrollbar">
            {domains.map((domain) => (
              <button
                key={domain}
                onClick={() => setSelectedDomain(domain)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedDomain === domain 
                  ? 'bg-white text-slate-900 border-white shadow-md' 
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                }`}
              >
                {domain}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* RÉSULTATS (LISTE COMPACTE) */}
      <section className="py-12 max-w-5xl mx-auto px-6">
        <div className="space-y-8">
          {currentTheses.length > 0 ? (
            currentTheses.map((thesis) => (
              <div key={thesis.id} className="group relative pl-4 border-l-2 border-transparent hover:border-blue-500 transition-all duration-300">
                {/* Métadonnées Zotero */}
                {renderZoteroCoins(thesis)}
                
                {/* 1. Titre */}
                <h3 
                  onClick={() => setSelectedThesis(thesis)}
                  className="text-xl md:text-2xl font-serif text-blue-700 font-medium cursor-pointer hover:underline mb-1 inline-block"
                >
                  {thesis.title}
                </h3>

                {/* 2. Infos Auteur/Date */}
                <div className="text-sm text-green-700 mb-2 font-medium">
                  {thesis.author} - <span className="italic">{thesis.institution}</span>, {thesis.year}
                </div>

                {/* 3. Snippet Résumé */}
                <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-3 max-w-3xl">
                  {thesis.abstract}
                </p>

                {/* 4. Badges / Actions rapides */}
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  {/* Badge Type & Statut */}
                  <span className={`font-bold uppercase tracking-wider flex items-center gap-1.5 ${thesis.isRestricted ? 'text-amber-600' : 'text-slate-500'}`}>
                    {thesis.isRestricted ? (
                      <>
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                        Sur demande
                      </>
                    ) : (
                      <>
                         <span className="text-blue-600 font-black">[PDF]</span> Accès Libre
                      </>
                    )}
                  </span>
                  
                  <span className="text-slate-300">|</span>

                  <button onClick={() => copyCitation(thesis)} className="text-slate-400 hover:text-blue-700 transition-colors font-medium">
                    Citer
                  </button>
                  <button onClick={() => setSelectedThesis(thesis)} className="text-slate-400 hover:text-blue-700 transition-colors font-medium">
                    Voir détails
                  </button>
                  
                  {thesis.isExclusive && (
                     <span className="ml-auto text-[10px] font-bold bg-amber-50 text-amber-600 px-2 py-1 rounded border border-amber-100">
                       Exclusif Kongo Science
                     </span>
                  )}
                </div>
              </div>
            ))
          ) : (
             <div className="text-center py-32 bg-slate-50 rounded-[3rem] border border-slate-100">
               <div className="text-5xl mb-6 opacity-30">🔍</div>
               <h3 className="text-xl font-bold text-slate-700 mb-2">Aucun résultat trouvé</h3>
               <p className="text-slate-500">Essayez d'autres mots-clés ou changez de filtre.</p>
               <button 
                 onClick={() => {setSearchTerm(''); setSelectedDomain('Tous');}}
                 className="mt-6 text-blue-600 font-bold hover:underline"
               >
                 Réinitialiser la recherche
               </button>
             </div>
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="mt-16 pt-8 border-t border-slate-100 flex justify-center items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="px-4 py-2 text-sm text-slate-500 hover:text-blue-700 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
            >
              Précédent
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg font-bold transition-all ${
                  currentPage === page
                  ? 'bg-blue-700 text-white shadow-lg shadow-blue-200'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {page}
              </button>
            ))}

            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="px-4 py-2 text-sm text-slate-500 hover:text-blue-700 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
            >
              Suivant
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default LibraryView;
