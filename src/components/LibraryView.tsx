import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async'; // Pour le SEO (Titres Google)
import { SCIMAGO_DOMAINS } from '../constants';
import { THESES_LIBRARY } from '../data/library';
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

  // --- 1. CALCUL DES COMPTEURS PAR DOMAINE ---
  const domainCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    THESES_LIBRARY.forEach((item) => {
      const domain = item.domain || "Multidisciplinary";
      counts[domain] = (counts[domain] || 0) + 1;
    });
    return counts;
  }, []);

  // --- LOGIQUE DE FILTRAGE ---
  const filteredTheses = useMemo(() => {
    return THESES_LIBRARY.filter((t) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        (t.title || "").toLowerCase().includes(searchLower) || 
        (t.author || "").toLowerCase().includes(searchLower) ||
        (t.abstract || "").toLowerCase().includes(searchLower);

      const matchesDomain = selectedDomain === 'Tous' || t.domain === selectedDomain;

      let matchesYear = true;
      const thesisYear = parseInt(t.year);
      if (selectedYearFilter !== 'any') {
         matchesYear = thesisYear >= parseInt(selectedYearFilter);
      }
      
      return matchesSearch && matchesDomain && matchesYear;
    });
  }, [searchTerm, selectedDomain, selectedYearFilter]);

  // --- PAGINATION ---
  const totalPages = Math.ceil(filteredTheses.length / ITEMS_PER_PAGE);
  const currentTheses = filteredTheses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedDomain, selectedYearFilter]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [currentPage, selectedThesis]);

  // --- ALGORITHME PAGINATION "GOOGLE STYLE" ---
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    range.push(1);
    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i < totalPages && i > 1) {
        range.push(i);
      }
    }
    range.push(totalPages);

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }
    if (totalPages === 1) return [1];
    return rangeWithDots;
  };

  // --- UTILS ---
  const copyCitation = (thesis: Thesis) => {
    const citation = `${thesis.author} (${thesis.year}). ${thesis.title}. ${thesis.institution}.`;
    navigator.clipboard.writeText(citation);
    alert('Citation copiée !');
  };

  const renderZoteroCoins = (thesis: Thesis) => {
    const title = encodeURIComponent(thesis.title || "");
    const author = encodeURIComponent(thesis.author || "");
    const date = encodeURIComponent(thesis.year || "");
    const publisher = encodeURIComponent(thesis.institution || "");
    const isThesis = (thesis.type || "").includes('Thèse') || (thesis.type || "").includes('Mémoire');
    const genre = isThesis ? 'dissertation' : 'article';
    const fmt = isThesis ? 'info:ofi/fmt:kev:mtx:dissertation' : 'info:ofi/fmt:kev:mtx:journal';
    const coinsData = `ctx_ver=Z39.88-2004&rft_val_fmt=${fmt}&rft.title=${title}&rft.au=${author}&rft.date=${date}&rft.inst=${publisher}&rft.genre=${genre}`;
    return <span className="Z3988" title={coinsData} style={{ display: 'none' }}></span>;
  };

  // --- COMPOSANT POP-UP EMAIL ---
  const MailRequestPopup = () => {
    if (!showMailPopup || !selectedThesis) return null;
    const subject = encodeURIComponent(`Demande d'accès : ${selectedThesis.title.substring(0, 50)}...`);
    const body = encodeURIComponent(`Bonjour Dr. Nkodia,\n\nJe suis intéressé par votre publication "${selectedThesis.title}" (${selectedThesis.year}).\nPourriez-vous m'envoyer une copie privée ?`);
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=nkodiahardy@gmail.com&su=${subject}&body=${body}`;
    const mailtoLink = `mailto:nkodiahardy@gmail.com?subject=${subject}&body=${body}`;

    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative">
          <button onClick={() => setShowMailPopup(false)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-slate-900">Demander une copie privée</h3>
            <p className="text-sm text-slate-500 mt-2">Ce document est protégé. Veuillez envoyer une demande à l'auteur.</p>
          </div>
          <div className="space-y-3">
            <a href={gmailLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full bg-red-50 text-red-700 hover:bg-red-100 p-3 rounded-xl font-bold transition-colors">
              Écrire via Gmail
            </a>
            <a href={mailtoLink} className="block text-center text-xs text-slate-400 hover:text-blue-600 underline mt-4">Ou via l'application par défaut</a>
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
        <Helmet>
          <title>{selectedThesis.title} - Kongo Science</title>
          <meta name="description" content={`Découvrez l'article de ${selectedThesis.author} : ${selectedThesis.title}. Publié en ${selectedThesis.year}.`} />
        </Helmet>

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
             <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-4 leading-tight">{selectedThesis.title}</h1>
             <div className="text-slate-600 text-lg mb-8">
               <span className="font-bold text-slate-900">{selectedThesis.author}</span> • <span>{selectedThesis.year}</span> • <span className="italic">{selectedThesis.institution}</span>
             </div>
             <div className="mb-10">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Résumé</h3>
               <p className="text-slate-700 leading-relaxed text-lg text-justify font-serif">{selectedThesis.abstract}</p>
             </div>
             <div className="flex flex-col sm:flex-row gap-4 border-t border-slate-50 pt-8">
                {selectedThesis.isForSale ? (
                  <a href={selectedThesis.purchaseUrl} target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto">Acheter sur Amazon</a>
                ) : selectedThesis.isRestricted ? (
                  <button onClick={() => setShowMailPopup(true)} className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto">Demander une copie</button>
                ) : (
                  <a href={selectedThesis.pdfUrl} target="_blank" rel="noopener noreferrer" className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto">Télécharger (PDF)</a>
                )}
             </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------------------
  // VUE PRINCIPALE (LISTE)
  // ----------------------------------------------------------------------------------
  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>Bibliothèque Scientifique - Kongo Science</title>
        <meta name="description" content="Accédez à une base de données de plus de 1000 thèses, articles et mémoires sur la géologie, la santé et l'environnement en République du Congo." />
      </Helmet>

      {showSubmitModal && <SubmitPublicationModal onClose={() => setShowSubmitModal(false)} />}
      
      {/* HEADER RECHERCHE */}
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
             <button onClick={() => setShowSubmitModal(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold whitespace-nowrap transition-colors flex items-center gap-2">
                Soumettre
             </button>
        </div>
      </section>

      {/* CONTENU */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col md:flex-row gap-12">
        
        {/* SIDEBAR FILTRES */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
           <div>
             <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">
               Domaines
             </h4>
             <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
               <button
                  onClick={() => setSelectedDomain('Tous')}
                  className={`text-left text-sm flex justify-between items-center transition-colors ${selectedDomain === 'Tous' ? 'font-bold text-blue-700' : 'text-slate-600 hover:text-blue-600'}`}
               >
                 <span>Tous</span>
                 <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-full">{THESES_LIBRARY.length}</span>
               </button>

               {SCIMAGO_DOMAINS.map((dom) => {
                 const count = domainCounts[dom.value] || 0;
                 if (count === 0) return null;

                 return (
                   <button
                     key={dom.value}
                     onClick={() => setSelectedDomain(dom.value)}
                     className={`text-left text-sm flex justify-between items-center transition-colors ${selectedDomain === dom.value ? 'font-bold text-blue-700' : 'text-slate-600 hover:text-blue-600'}`}
                   >
                     <span className="truncate pr-2">{dom.label}</span>
                     <span className={`text-[10px] px-2 py-0.5 rounded-full ${selectedDomain === dom.value ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                       {count}
                     </span>
                   </button>
                 );
               })}
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
                    <h3 onClick={() => setSelectedThesis(thesis)} className="text-xl font-serif text-blue-800 font-medium cursor-pointer hover:underline hover:text-blue-600 mb-1 leading-snug">
                      {thesis.title}
                    </h3>
                    <div className="text-sm text-green-800 mb-2 font-medium">
                      {thesis.author} - <span className="italic">{thesis.institution}</span>, {thesis.year}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs">
                       <span className={`font-bold uppercase tracking-wider ${thesis.isForSale ? 'text-green-600' : thesis.isRestricted ? 'text-amber-600' : 'text-slate-500'}`}>
                        {thesis.isForSale ? `[Achat ${thesis.price}]` : thesis.isRestricted ? '[Sur demande]' : '[PDF] Accès Libre'}
                       </span>
                       <button onClick={() => setSelectedThesis(thesis)} className="text-slate-400 hover:text-blue-700 hover:underline">Voir détails</button>
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

            {/* PAGINATION GOOGLE STYLE */}
            {totalPages > 1 && (
              <div className="mt-16 pt-8 border-t border-slate-100 flex justify-center items-center gap-2 select-none flex-wrap">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="px-3 py-2 text-sm text-blue-700 hover:underline disabled:opacity-30 disabled:no-underline"
                >
                  Précédent
                </button>

                {getVisiblePages().map((page, idx) => (
                  typeof page === 'number' ? (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded text-sm font-bold transition-all ${
                        currentPage === page
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-blue-700 hover:bg-blue-50'
                      }`}
                    >
                      {page}
                    </button>
                  ) : (
                    <span key={idx} className="w-8 h-8 flex items-center justify-center text-slate-400">
                      ...
                    </span>
                  )
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

export default LibraryView;import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async'; // Pour le SEO (Titres Google)
import { SCIMAGO_DOMAINS } from '../constants';
import { THESES_LIBRARY } from '../data/library';
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

  // --- 1. CALCUL DES COMPTEURS PAR DOMAINE ---
  const domainCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    THESES_LIBRARY.forEach((item) => {
      const domain = item.domain || "Multidisciplinary";
      counts[domain] = (counts[domain] || 0) + 1;
    });
    return counts;
  }, []);

  // --- LOGIQUE DE FILTRAGE ---
  const filteredTheses = useMemo(() => {
    return THESES_LIBRARY.filter((t) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        (t.title || "").toLowerCase().includes(searchLower) || 
        (t.author || "").toLowerCase().includes(searchLower) ||
        (t.abstract || "").toLowerCase().includes(searchLower);

      const matchesDomain = selectedDomain === 'Tous' || t.domain === selectedDomain;

      let matchesYear = true;
      const thesisYear = parseInt(t.year);
      if (selectedYearFilter !== 'any') {
         matchesYear = thesisYear >= parseInt(selectedYearFilter);
      }
      
      return matchesSearch && matchesDomain && matchesYear;
    });
  }, [searchTerm, selectedDomain, selectedYearFilter]);

  // --- PAGINATION ---
  const totalPages = Math.ceil(filteredTheses.length / ITEMS_PER_PAGE);
  const currentTheses = filteredTheses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedDomain, selectedYearFilter]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [currentPage, selectedThesis]);

  // --- ALGORITHME PAGINATION "GOOGLE STYLE" ---
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    range.push(1);
    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i < totalPages && i > 1) {
        range.push(i);
      }
    }
    range.push(totalPages);

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }
    if (totalPages === 1) return [1];
    return rangeWithDots;
  };

  // --- UTILS ---
  const copyCitation = (thesis: Thesis) => {
    const citation = `${thesis.author} (${thesis.year}). ${thesis.title}. ${thesis.institution}.`;
    navigator.clipboard.writeText(citation);
    alert('Citation copiée !');
  };

  const renderZoteroCoins = (thesis: Thesis) => {
    const title = encodeURIComponent(thesis.title || "");
    const author = encodeURIComponent(thesis.author || "");
    const date = encodeURIComponent(thesis.year || "");
    const publisher = encodeURIComponent(thesis.institution || "");
    const isThesis = (thesis.type || "").includes('Thèse') || (thesis.type || "").includes('Mémoire');
    const genre = isThesis ? 'dissertation' : 'article';
    const fmt = isThesis ? 'info:ofi/fmt:kev:mtx:dissertation' : 'info:ofi/fmt:kev:mtx:journal';
    const coinsData = `ctx_ver=Z39.88-2004&rft_val_fmt=${fmt}&rft.title=${title}&rft.au=${author}&rft.date=${date}&rft.inst=${publisher}&rft.genre=${genre}`;
    return <span className="Z3988" title={coinsData} style={{ display: 'none' }}></span>;
  };

  // --- COMPOSANT POP-UP EMAIL ---
  const MailRequestPopup = () => {
    if (!showMailPopup || !selectedThesis) return null;
    const subject = encodeURIComponent(`Demande d'accès : ${selectedThesis.title.substring(0, 50)}...`);
    const body = encodeURIComponent(`Bonjour Dr. Nkodia,\n\nJe suis intéressé par votre publication "${selectedThesis.title}" (${selectedThesis.year}).\nPourriez-vous m'envoyer une copie privée ?`);
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=nkodiahardy@gmail.com&su=${subject}&body=${body}`;
    const mailtoLink = `mailto:nkodiahardy@gmail.com?subject=${subject}&body=${body}`;

    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative">
          <button onClick={() => setShowMailPopup(false)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-slate-900">Demander une copie privée</h3>
            <p className="text-sm text-slate-500 mt-2">Ce document est protégé. Veuillez envoyer une demande à l'auteur.</p>
          </div>
          <div className="space-y-3">
            <a href={gmailLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full bg-red-50 text-red-700 hover:bg-red-100 p-3 rounded-xl font-bold transition-colors">
              Écrire via Gmail
            </a>
            <a href={mailtoLink} className="block text-center text-xs text-slate-400 hover:text-blue-600 underline mt-4">Ou via l'application par défaut</a>
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
        <Helmet>
          <title>{selectedThesis.title} - Kongo Science</title>
          <meta name="description" content={`Découvrez l'article de ${selectedThesis.author} : ${selectedThesis.title}. Publié en ${selectedThesis.year}.`} />
        </Helmet>

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
             <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-4 leading-tight">{selectedThesis.title}</h1>
             <div className="text-slate-600 text-lg mb-8">
               <span className="font-bold text-slate-900">{selectedThesis.author}</span> • <span>{selectedThesis.year}</span> • <span className="italic">{selectedThesis.institution}</span>
             </div>
             <div className="mb-10">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Résumé</h3>
               <p className="text-slate-700 leading-relaxed text-lg text-justify font-serif">{selectedThesis.abstract}</p>
             </div>
             <div className="flex flex-col sm:flex-row gap-4 border-t border-slate-50 pt-8">
                {selectedThesis.isForSale ? (
                  <a href={selectedThesis.purchaseUrl} target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto">Acheter sur Amazon</a>
                ) : selectedThesis.isRestricted ? (
                  <button onClick={() => setShowMailPopup(true)} className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto">Demander une copie</button>
                ) : (
                  <a href={selectedThesis.pdfUrl} target="_blank" rel="noopener noreferrer" className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto">Télécharger (PDF)</a>
                )}
             </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------------------
  // VUE PRINCIPALE (LISTE)
  // ----------------------------------------------------------------------------------
  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>Bibliothèque Scientifique - Kongo Science</title>
        <meta name="description" content="Accédez à une base de données de plus de 1000 thèses, articles et mémoires sur la géologie, la santé et l'environnement en République du Congo." />
      </Helmet>

      {showSubmitModal && <SubmitPublicationModal onClose={() => setShowSubmitModal(false)} />}
      
      {/* HEADER RECHERCHE */}
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
             <button onClick={() => setShowSubmitModal(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold whitespace-nowrap transition-colors flex items-center gap-2">
                Soumettre
             </button>
        </div>
      </section>

      {/* CONTENU */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col md:flex-row gap-12">
        
        {/* SIDEBAR FILTRES */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
           <div>
             <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">
               Domaines
             </h4>
             <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
               <button
                  onClick={() => setSelectedDomain('Tous')}
                  className={`text-left text-sm flex justify-between items-center transition-colors ${selectedDomain === 'Tous' ? 'font-bold text-blue-700' : 'text-slate-600 hover:text-blue-600'}`}
               >
                 <span>Tous</span>
                 <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-full">{THESES_LIBRARY.length}</span>
               </button>

               {SCIMAGO_DOMAINS.map((dom) => {
                 const count = domainCounts[dom.value] || 0;
                 if (count === 0) return null;

                 return (
                   <button
                     key={dom.value}
                     onClick={() => setSelectedDomain(dom.value)}
                     className={`text-left text-sm flex justify-between items-center transition-colors ${selectedDomain === dom.value ? 'font-bold text-blue-700' : 'text-slate-600 hover:text-blue-600'}`}
                   >
                     <span className="truncate pr-2">{dom.label}</span>
                     <span className={`text-[10px] px-2 py-0.5 rounded-full ${selectedDomain === dom.value ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                       {count}
                     </span>
                   </button>
                 );
               })}
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
                    <h3 onClick={() => setSelectedThesis(thesis)} className="text-xl font-serif text-blue-800 font-medium cursor-pointer hover:underline hover:text-blue-600 mb-1 leading-snug">
                      {thesis.title}
                    </h3>
                    <div className="text-sm text-green-800 mb-2 font-medium">
                      {thesis.author} - <span className="italic">{thesis.institution}</span>, {thesis.year}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs">
                       <span className={`font-bold uppercase tracking-wider ${thesis.isForSale ? 'text-green-600' : thesis.isRestricted ? 'text-amber-600' : 'text-slate-500'}`}>
                        {thesis.isForSale ? `[Achat ${thesis.price}]` : thesis.isRestricted ? '[Sur demande]' : '[PDF] Accès Libre'}
                       </span>
                       <button onClick={() => setSelectedThesis(thesis)} className="text-slate-400 hover:text-blue-700 hover:underline">Voir détails</button>
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

            {/* PAGINATION GOOGLE STYLE */}
            {totalPages > 1 && (
              <div className="mt-16 pt-8 border-t border-slate-100 flex justify-center items-center gap-2 select-none flex-wrap">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="px-3 py-2 text-sm text-blue-700 hover:underline disabled:opacity-30 disabled:no-underline"
                >
                  Précédent
                </button>

                {getVisiblePages().map((page, idx) => (
                  typeof page === 'number' ? (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded text-sm font-bold transition-all ${
                        currentPage === page
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-blue-700 hover:bg-blue-50'
                      }`}
                    >
                      {page}
                    </button>
                  ) : (
                    <span key={idx} className="w-8 h-8 flex items-center justify-center text-slate-400">
                      ...
                    </span>
                  )
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
