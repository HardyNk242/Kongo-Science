import React, { useState } from 'react';
import { THESES_LIBRARY } from '../constants';
import { Thesis } from '../types';

const LibraryView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('Tous');

  // Récupération dynamique des domaines disponibles
  const domains = ['Tous', ...new Set(THESES_LIBRARY.map((t) => t.domain))];

  // Logique de filtrage (Recherche + Domaine)
  const filteredTheses = THESES_LIBRARY.filter((t) => {
    const matchesSearch = 
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = selectedDomain === 'Tous' || t.domain === selectedDomain;
    
    return matchesSearch && matchesDomain;
  });

  const copyCitation = (thesis: Thesis) => {
    const citation = `${thesis.author} (${thesis.year}). ${thesis.title}. ${thesis.institution}. Archivé sur Kongo Science.`;
    navigator.clipboard.writeText(citation);
    alert('Citation copiée au format APA !');
  };

  return (
    <div className="bg-white min-h-screen">
      {/* --- HERO SECTION (Recherche) --- */}
      <section className="bg-slate-900 pt-32 pb-24 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <span className="text-blue-400 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">
            Archive Scientifique Souveraine
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold italic mb-6">
            Bibliothèque des Publications
          </h1>
          <p className="text-slate-400 text-xl max-w-3xl mx-auto leading-relaxed">
            Kongo Science est le <span className="text-white font-bold underline decoration-blue-500">SEUL</span> endroit où ces publications fondamentales du Bassin du Congo sont accessibles au monde entier.
          </p>

          <div className="mt-12 max-w-2xl mx-auto relative">
             <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
             </div>
             <input 
               type="text" 
               placeholder="Rechercher une publication, un auteur, un domaine..." 
               className="w-full bg-white text-slate-900 pl-14 pr-6 py-5 rounded-2xl shadow-2xl focus:ring-4 focus:ring-blue-500/20 outline-none transition-all text-lg font-medium"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
      </section>

      {/* --- BARRE DE FILTRES --- */}
      <section className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-4 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest whitespace-nowrap">
            Disciplines :
          </span>
          {domains.map((domain) => (
            <button
              key={domain}
              onClick={() => setSelectedDomain(domain)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                selectedDomain === domain 
                ? 'bg-blue-700 text-white shadow-lg shadow-blue-200' 
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {domain}
            </button>
          ))}
        </div>
      </section>

      {/* --- LISTE DES THÈSES --- */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="space-y-12">
          {filteredTheses.length > 0 ? (
            filteredTheses.map((thesis) => (
              <div key={thesis.id} className="group bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 hover:shadow-2xl hover:border-blue-100 transition-all duration-500 flex flex-col md:flex-row gap-10 items-start">
                
                {/* Bloc Icône & Type */}
                <div className="w-full md:w-32 flex flex-col items-center flex-shrink-0">
                   <div className="w-20 h-24 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center relative group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors shadow-inner">
                      <svg className="w-10 h-10 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div className="absolute -bottom-2 bg-blue-700 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
                        PDF
                      </div>
                   </div>
                   <span className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                     {thesis.type}
                   </span>
                </div>

                {/* Bloc Contenu */}
                <div className="flex-grow">
                   {/* Badges et Métadonnées */}
                   <div className="flex flex-wrap gap-3 mb-4">
                      <span className="bg-slate-900 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                        {thesis.domain}
                      </span>
                      {thesis.isExclusive && (
                        <span className="bg-blue-100 text-blue-700 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                          Exclusivité Kongo Science
                        </span>
                      )}
                      <span className="text-slate-400 text-xs font-medium ml-auto">
                        {thesis.pages} pages • {thesis.year}
                      </span>
                   </div>

                   {/* Titre */}
                   <h3 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-4 italic leading-tight group-hover:text-blue-700 transition-colors">
                     {thesis.title}
                   </h3>

                   {/* Auteur */}
                   <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 font-bold text-[10px]">
                         {thesis.author.split(' ').pop()?.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-900">{thesis.author}</span>
                      <span className="text-slate-400 mx-2">|</span>
                      <span className="text-slate-500 text-sm">{thesis.institution}</span>
                   </div>

                   {/* Abstract */}
                   <p className="text-slate-600 leading-relaxed mb-8 text-sm md:text-base border-l-4 border-slate-50 pl-6 group-hover:border-blue-200 transition-colors">
                     {thesis.abstract}
                   </p>

                   {/* Boutons d'action */}
                   <div className="flex flex-wrap gap-4 pt-6 border-t border-slate-50">
                      <button 
                        onClick={() => copyCitation(thesis)}
                        className="flex items-center gap-2 text-slate-400 hover:text-blue-700 font-bold text-xs uppercase tracking-widest transition-colors"
                      >
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                         Citer cette publication
                      </button>
                      
                      {/* BOUTON LIRE : Changé en <a> pour lien direct */}
                      <a 
                        href={thesis.pdfUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-blue-700 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-xl shadow-blue-100 hover:bg-blue-800 hover:-translate-y-1 transition-all ml-auto flex items-center gap-2 cursor-pointer"
                      >
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                         Lire la publication
                      </a>
                   </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-[3rem]">
               <div className="text-6xl mb-6">🔍</div>
               <h3 className="text-xl font-bold text-slate-900">Aucune publication trouvée</h3>
               <p className="text-slate-500 mt-2">Essayez d'autres mots-clés ou changez de discipline.</p>
            </div>
          )}
        </div>
      </section>

      {/* --- BANDEAU APPEL À ACTION (Soumettre) --- */}
      <section className="bg-blue-50 py-24">
         <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-serif font-bold text-slate-900 italic mb-6">
              Votre recherche mérite d'être lue.
            </h2>
            <p className="text-slate-600 text-lg mb-10">
               Vous êtes un chercheur ou venez de valider votre Master avec brio ? <br/> 
               Ne laissez pas vos découvertes dans l'ombre.
            </p>
            
            {/* BOUTON SOUMETTRE : Pointe vers votre futur Google Form */}
            {/* REMPLACEZ LE LIEN CI-DESSOUS PAR VOTRE PROPRE LIEN GOOGLE FORM */}
            <a 
              href="https://forms.google.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-2xl hover:-translate-y-1"
            >
               Soumettre ma publication
            </a>
            
            <p className="mt-8 text-xs text-slate-400 uppercase tracking-widest font-bold">
              Processus de vérification scientifique rigoureux
            </p>
         </div>
      </section>
    </div>
  );
};

export default LibraryView;
