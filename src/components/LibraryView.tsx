import React, { useState, useEffect, useMemo } from 'react';
import { SCIMAGO_DOMAINS } from '../constants';
import { THESES_LIBRARY } from '../data/library';
import { Thesis } from '../types';
import SubmitPublicationModal from './SubmitPublicationModal';

const ITEMS_PER_PAGE = 10;

// AJOUT : Interface pour recevoir l'ID depuis l'URL
interface LibraryViewProps {
  initialThesisId?: string | null;
}

const LibraryView: React.FC<LibraryViewProps> = ({ initialThesisId }) => {
  // --- ÉTATS ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('Tous');
  const [selectedYearFilter, setSelectedYearFilter] = useState('any');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest'); 
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  
  // Navigation
  const [selectedThesis, setSelectedThesis] = useState<Thesis | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // État pour la Pop-up de demande d'email
  const [showMailPopup, setShowMailPopup] = useState(false);

  // --- NOUVEAU : EFFET POUR OUVRIR DEPUIS L'URL ---
  useEffect(() => {
    if (initialThesisId) {
      const found = THESES_LIBRARY.find(t => t.id === initialThesisId);
      if (found) {
        setSelectedThesis(found);
      }
    }
  }, [initialThesisId]);

  // --- NOUVEAU : FONCTIONS POUR GÉRER L'URL ---
  const openThesis = (thesis: Thesis) => {
    setSelectedThesis(thesis);
    window.location.hash = `library/${thesis.id}`;
  };

  const closeThesis = () => {
    setSelectedThesis(null);
    window.location.hash = `library`;
  };

  // --- 1. CALCUL DES COMPTEURS PAR DOMAINE ---
  const domainCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    THESES_LIBRARY.forEach((item) => {
      const domain = item.domain || "Multidisciplinary";
      counts[domain] = (counts[domain] || 0) + 1;
    });
    return counts;
  }, []);

  // --- LOGIQUE DE FILTRAGE ET TRI ---
  const filteredTheses = useMemo(() => {
    // 1. Filtrage
    let results = THESES_LIBRARY.filter((t) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        (t.title || "").toLowerCase().includes(searchLower) || 
        (t.author || "").toLowerCase().includes(searchLower) ||
        (t.abstract || "").toLowerCase().includes(searchLower);

      const matchesDomain = selectedDomain === 'Tous' || t.domain === selectedDomain;

      let matchesYear = true;
      const thesisYear = parseInt(t.year) || 0;
      if (selectedYearFilter !== 'any') {
         matchesYear = thesisYear >= parseInt(selectedYearFilter);
      }
      
      return matchesSearch && matchesDomain && matchesYear;
    });

    // 2. Tri
    results.sort((a, b) => {
      const dateA = parseInt(a.year) || 0;
      const dateB = parseInt(b.year) || 0;
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return results;
  }, [searchTerm, selectedDomain, selectedYearFilter, sortOrder]);

  // --- PAGINATION ---
  const totalPages = Math.ceil(filteredTheses.length / ITEMS_PER_PAGE);
  const currentTheses = filteredTheses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedDomain, selectedYearFilter, sortOrder]);
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

  // --- FONCTION WHATSAPP (CORRIGÉE AVEC LIEN PRÉCIS) ---
  const shareOnWhatsApp = (thesis: Thesis) => {
    // On génère le lien exact vers CETTE thèse
    const preciseLink = `${window.location.origin}/#library/${thesis.id}`;
    
    const text = `*Regarde cette publication sur Kongo Science :*\n\n"${thesis.title}"\n${thesis.author} (${thesis.year})\n\nLien : ${preciseLink}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
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
            <p className="text-sm text-slate-500 mt-2">Ce document est protégé. L'auteur recevra votre demande par email.</p>
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
        {showMailPopup && <MailRequestPopup />}
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={closeThesis} // MODIFIÉ : Utilise la fonction qui nettoie l'URL
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
              
              {/* --- ZONE DES BOUTONS --- */}
              <div className="flex flex-col gap-6 border-t border-slate-50 pt-8">
                
                <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
                    {/* 1. CAS VENTE */}
                    {selectedThesis.isForSale && selectedThesis.purchaseUrl ? (
                      <a href={selectedThesis.purchaseUrl} target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all hover:-translate-y-1">
                        Acheter
                      </a>
                    ) : null}

                    {/* 2. CAS RESTREINT : Bouton Demande */}
                    {selectedThesis.isRestricted && (
                        <button onClick={() => setShowMailPopup(true)} className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all hover:-translate-y-1">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            Demander une copie
                        </button>
                    )}

                    {/* 3. CAS LIEN WEB */}
                    {selectedThesis.pdfUrl && (
                        <a href={selectedThesis.pdfUrl} target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all hover:-translate-y-1">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            {selectedThesis.isRestricted ? "Voir sur le site source" : "Télécharger / Consulter"}
                        </a>
                    )}

                    {/* 4. WHATSAPP */}
                    <button onClick={() => shareOnWhatsApp(selectedThesis)} className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all hover:-translate-y-1">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                        Partager
                    </button>

                    {/* 5. BOUTON CITER */}
                    <button onClick={() => copyCitation(selectedThesis)} className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                        Citer
                    </button>
                </div>

                {/* NOTE EXPLICATIVE */}
                {selectedThesis.isRestricted && (
                    <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm text-slate-500">
                        <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <p>
                            Ce document n'est pas en libre accès (Open Access) en raison des droits d'auteur. 
                            Vous pouvez essayer de le consulter via le bouton "Voir sur le site source" (si vous avez un accès universitaire) ou "Demander une copie" directement à l'auteur.
                        </p>
                    </div>
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
      {showSubmitModal && <SubmitPublicationModal onClose={() => setShowSubmitModal(false)} />}
      
      {/* 1. SECTION HERO AVEC RECHERCHE (DESIGN SOMBRE) */}
      <section className="bg-slate-900 pt-32 pb-20 px-6 text-center">
        <div className="max-w-4xl mx-auto animate-fadeIn">
            {/* SURTITRE */}
            <h5 className="text-blue-500 font-bold text-xs tracking-[0.2em] uppercase mb-4">
              Archive Scientifique Souveraine
            </h5>
            
            {/* TITRE PRINCIPAL SERIF */}
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              Bibliothèque des Publications
            </h1>
            
            {/* DESCRIPTION MISE À JOUR (MISSION) */}
            <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Notre mission : Rendre le patrimoine scientifique du Bassin du Congo <span className="text-white font-bold border-b-2 border-blue-500">visible et accessible</span> à tous.
            </p>

            {/* BARRE DE RECHERCHE CENTRALE */}
            <div className="relative max-w-2xl mx-auto group">
               <div className="absolute inset-0 bg-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
               <div className="relative">
                 <input 
                   type="text" 
                   placeholder="Rechercher une publication, un auteur, un domaine..." 
                   className="w-full h-16 pl-14 pr-4 rounded-2xl text-lg text-slate-900 bg-white shadow-2xl focus:ring-4 focus:ring-blue-500/50 outline-none transition-all"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
                 <svg className="w-7 h-7 text-slate-400 absolute left-4 top-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                 </svg>
               </div>
            </div>
        </div>
      </section>

      {/* 2. BARRE D'OUTILS ET FILTRES (STICKY) */}
      <div className="border-b border-slate-100 bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-sm transition-all">
         <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
            
            {/* Filtres de Tri et Année */}
            <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
               <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                 <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
                 <select 
                   className="bg-transparent text-sm text-slate-700 outline-none font-medium cursor-pointer"
                   value={sortOrder}
                   onChange={(e) => setSortOrder(e.target.value as any)}
                 >
                   <option value="newest">Plus récents d'abord</option>
                   <option value="oldest">Plus anciens d'abord</option>
                 </select>
               </div>

               <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                 <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                 <select 
                   className="bg-transparent text-sm text-slate-700 outline-none font-medium cursor-pointer"
                   value={selectedYearFilter}
                   onChange={(e) => setSelectedYearFilter(e.target.value)}
                 >
                   <option value="any">Toutes les années</option>
                   <option value="2023">Depuis 2023</option>
                   <option value="2020">Depuis 2020</option>
                   <option value="2015">Depuis 2015</option>
                   <option value="2010">Depuis 2010</option>
                 </select>
               </div>
            </div>

            <button onClick={() => setShowSubmitModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm whitespace-nowrap transition-colors flex items-center gap-2 shadow-lg shadow-blue-600/20">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
               Contribuer
            </button>
         </div>
      </div>

      {/* 3. CONTENU PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col md:flex-row gap-12">
        
        {/* SIDEBAR DOMAINES */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
           <div>
             <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">
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

        {/* LISTE DES RÉSULTATS */}
        <main className="flex-grow">
            <div className="mb-6 flex items-center justify-between">
               <span className="text-slate-400 text-sm font-medium">
                 {filteredTheses.length} résultats trouvés
               </span>
            </div>

            <div className="space-y-6">
              {currentTheses.length > 0 ? (
                currentTheses.map((thesis) => (
                  <div key={thesis.id} className="group relative bg-white border border-slate-100 hover:border-blue-100 rounded-xl p-6 transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer" onClick={() => openThesis(thesis)}>
                    {renderZoteroCoins(thesis)}
                    
                    <div className="flex justify-between items-start gap-4">
                        <div>
                            <h3 className="text-xl font-serif text-slate-900 font-bold mb-2 group-hover:text-blue-700 transition-colors leading-snug">
                              {thesis.title}
                            </h3>
                            <div className="text-sm text-slate-500 mb-3">
                              <span className="font-semibold text-slate-700">{thesis.author}</span> • {thesis.year}
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-xs">
                                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded">
                                    {thesis.type || 'Publication'}
                                </span>
                                {thesis.isRestricted ? (
                                    <span className="flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded border border-amber-100">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                        Accès Restreint
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-green-700 font-bold bg-green-50 px-2 py-1 rounded border border-green-100">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        Open Access
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="hidden sm:block text-slate-300">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <p className="text-slate-500 font-medium">Aucun résultat ne correspond à votre recherche.</p>
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
                      className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                        currentPage === page
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'text-blue-700 hover:bg-blue-50'
                      }`}
                    >
                      {page}
                    </button>
                  ) : (
                    <span key={idx} className="w-9 h-9 flex items-center justify-center text-slate-400">...</span>
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