import React, { useState, useEffect } from 'react';
import { THESES_LIBRARY } from '../constants';
import { Thesis } from '../types';
import SubmitPublicationModal from './SubmitPublicationModal';

const ITEMS_PER_PAGE = 10; // Nombre de résultats par page (style Google Scholar)

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

  // --- VUE DÉTAILLÉE (La "Sous-page") ---
  if (selectedThesis) {
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
                <div className="w-24 h-32 bg-slate-50 border border-slate-200 rounded-xl flex-shrink-0 flex items-center justify-center">
                   <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div>
                   <span className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
                     {selectedThesis.type}
                   </span>
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

             {/* Résumé */}
             <div className="mb-10">
               <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Résumé (Abstract)</h3>
               <p className="text-slate-700 leading-relaxed text-lg text-justify">
                 {selectedThesis.abstract}
               </p>
             </div>

             {/* Actions */}
             <div className="flex flex-wrap gap-4">
                <a 
                  href={selectedThesis.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-blue-200 hover:-translate-y-1 transition-all flex items-center gap-2"
                >
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                   Télécharger / Lire (PDF)
                </a>
                <button 
                  onClick={() => copyCitation(selectedThesis)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-4 rounded-xl font-bold transition-all flex items-center gap-2"
                >
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                   Citer
                </button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // --- VUE PRINCIPALE (LISTE SCHOLAR) ---
  return (
    <div className="bg-white min-h-screen">
      {showSubmitModal && <SubmitPublicationModal onClose={() => setShowSubmitModal(false)} />}

      {/* HEADER RECHERCHE (Style compact mais pro) */}
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

          {/* Filtres rapides */}
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

      {/* RÉSULTATS (LISTE COMPACTE) */}
      <section className="py-12 max-w-5xl mx-auto px-6">
        <div className="space-y-8">
          {currentTheses.length > 0 ? (
            currentTheses.map((thesis) => (
              <div key={thesis.id} className="group">
                {/* Métadonnées Zotero (invisibles) */}
                {renderZoteroCoins(thesis)}
                
                {/* 1. Titre (Lien Bleu Scholar) */}
                <h3 
                  onClick={() => setSelectedThesis(thesis)}
                  className="text-xl md:text-2xl font-serif text-blue-700 font-medium cursor-pointer hover:underline mb-1"
                >
                  {thesis.title}
                </h3>

                {/* 2. Infos Auteur/Date (Vert/Gris) */}
                <div className="text-sm text-green-700 mb-2 font-medium">
                  {thesis.author} - {thesis.institution}, {thesis.year} - <span className="text-slate-500">{thesis.domain}</span>
                </div>

                {/* 3. Extrait du résumé (Snippet) */}
                <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-3">
                  {thesis.abstract}
                </p>

                {/* 4. Badges / Actions rapides */}
                <div className="flex items-center gap-4 text-xs">
                  <span className="font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <span className="text-blue-600">[PDF]</span> {thesis.type}
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

        {/* PAGINATION */}
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
