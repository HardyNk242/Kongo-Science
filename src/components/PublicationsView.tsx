import React, { useState, useEffect } from 'react';
import { ARTICLES } from '../data/articles';
import { SCHOLARSHIPS } from '../data/scholarships'; 
import ArticleCard from './ArticleCard';
import { Article } from '../types';

// Simulation d'une "Base de données" locale pour la session
const collectedEmails: string[] = [];

const PublicationsView: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState("");
  const [hasSubscribed, setHasSubscribed] = useState(false);

  // Remonter en haut quand on ouvre un article
  useEffect(() => {
    if (selectedArticle) window.scrollTo(0, 0);
  }, [selectedArticle]);

  // Déclencher le modal email après 5 secondes de lecture
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (selectedArticle && !hasSubscribed) {
      timer = setTimeout(() => setShowEmailModal(true), 5000); 
    }
    return () => clearTimeout(timer);
  }, [selectedArticle, hasSubscribed]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      console.log("NOUVEL EMAIL CAPTURÉ :", email);
      collectedEmails.push(email); 
      alert(`Merci ! Email sauvegardé : ${email}`);
      setHasSubscribed(true);
      setShowEmailModal(false);
    }
  };

  // =========================================================
  // 1. VUE DÉTAILLÉE (STYLE NEW YORK TIMES)
  // =========================================================
  if (selectedArticle) {
    return (
      <div className="bg-white min-h-screen text-slate-900 font-serif z-[60] relative">
        
        {/* Navbar Article */}
        <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm py-3 px-4 flex justify-between items-center font-sans">
            <button 
              onClick={() => setSelectedArticle(null)}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-black transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Retour
            </button>
            <div className="w-16"></div>
        </div>

        <article className="max-w-[740px] mx-auto px-6 py-12">
          
          {/* Header */}
          <header className="mb-8 text-center">
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-6 leading-tight">
              {selectedArticle.title}
            </h1>
            <p className="text-lg md:text-xl text-slate-600 italic font-serif leading-relaxed mb-8">
              {selectedArticle.excerpt}
            </p>
            
            <div className="flex justify-between items-end border-t border-black pt-4 pb-1 font-sans text-xs font-bold uppercase tracking-wider text-slate-700">
                <div className="flex flex-col text-left">
                    <span>{selectedArticle.author.toUpperCase()}</span>
                </div>
                <div className="text-slate-500">{selectedArticle.date}</div>
            </div>
          </header>

          {/* Image */}
          <figure className="mb-12 -mx-6 md:-mx-0">
            <img 
              src={selectedArticle.imageUrl} 
              alt={selectedArticle.title} 
              className="w-full h-auto object-cover"
            />
            <figcaption className="mt-2 text-xs text-slate-500 font-sans text-right px-6 md:px-0">
              Source : Black Seeds Publishing / Kongo Science
            </figcaption>
          </figure>

          {/* CORPS DU TEXTE (Avec Correction Espacements) */}
          <div className="
            font-serif text-lg md:text-xl leading-loose text-gray-900
            [&_p]:mb-8
            [&_h3]:text-2xl [&_h3]:font-sans [&_h3]:font-bold [&_h3]:uppercase [&_h3]:mt-12 [&_h3]:mb-6
            first-letter:float-left first-letter:text-7xl first-letter:pr-4 first-letter:font-black first-letter:leading-[0.8] first-letter:mt-2
          ">
            {selectedArticle.content ? (
              <div dangerouslySetInnerHTML={{ __html: selectedArticle.content }} />
            ) : (
              <p>{selectedArticle.excerpt}</p>
            )}
          </div>

          {/* Footer Article */}
          <div className="mt-16 pt-8 border-t border-slate-200 text-center font-sans">
            <button 
               onClick={() => setSelectedArticle(null)}
               className="bg-black text-white px-8 py-4 text-sm font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors"
            >
              Lire d'autres articles
            </button>
          </div>
        </article>

        {/* Modal Email */}
        {showEmailModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-md p-8 shadow-2xl relative animate-in zoom-in-95 duration-300">
                    <button 
                        onClick={() => setShowEmailModal(false)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-black"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    <h2 className="font-serif font-bold text-3xl mb-2 text-slate-900">Keep reading.</h2>
                    <p className="text-slate-600 mb-6 font-sans text-sm">
                        Create a free account to access our exclusive research and historical archives.
                    </p>
                    <form onSubmit={handleSubscribe} className="space-y-4">
                        <div>
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="votre.email@exemple.com"
                                className="w-full border border-slate-300 p-3 font-sans focus:outline-none focus:border-black transition-colors"
                            />
                        </div>
                        <button type="submit" className="w-full bg-black text-white font-bold py-3 uppercase tracking-widest hover:bg-slate-800 transition-colors">
                            Continue
                        </button>
                    </form>
                </div>
            </div>
        )}
      </div>
    );
  }

  // =========================================================
  // 2. VUE LISTE (PAGE PRINCIPALE AVEC BOURSES)
  // =========================================================
  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* En-tête de la page */}
        <div className="mb-20">
          <span className="text-blue-700 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Savoir & Opportunités</span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-6 italic">Actualités & Bourses</h1>
          <p className="text-slate-600 text-lg max-w-3xl leading-relaxed">
            Restez informé des dernières avancées scientifiques dans le Bassin du Congo et accédez aux financements pour vos recherches.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* --- GAUCHE : LISTE DES ARTICLES --- */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-10 border-b border-slate-200 pb-6">
               <h2 className="text-2xl font-serif font-bold text-slate-900 italic">À la Une</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {ARTICLES.map(article => (
                <ArticleCard 
                  key={article.id} 
                  article={article} 
                  onClick={(art) => setSelectedArticle(art)} 
                />
              ))}
            </div>
          </div>

          {/* --- DROITE : BOURSES (C'est ici qu'elles étaient manquantes) --- */}
          <div className="lg:col-span-4">
            <div className="sticky top-32">
               <div className="flex items-center justify-between mb-10 border-b border-slate-200 pb-6">
                  <h2 className="text-2xl font-serif font-bold text-slate-900 italic">Bourses</h2>
               </div>

               <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
                 {SCHOLARSHIPS.map(scholarship => {
                   // Gestion de la date pour éviter les erreurs d'affichage
                   const isUrgent = !isNaN(new Date(scholarship.deadline).getTime()) 
                        ? (new Date(scholarship.deadline).getTime() - new Date().getTime() < 1000 * 60 * 60 * 24 * 30)
                        : false;

                   return (
                     <div key={scholarship.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                        <div className="flex justify-between items-start mb-4">
                           <span className="text-[10px] font-black bg-blue-50 text-blue-700 px-3 py-1 rounded-full uppercase tracking-tighter">
                              {scholarship.level}
                           </span>
                           {isUrgent && (
                             <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping" title="Urgent"></span>
                           )}
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors leading-snug">
                           {scholarship.title}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">{scholarship.provider}</p>
                        
                        <div className="bg-slate-50 p-4 rounded-2xl mb-4">
                           <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                              {scholarship.description}
                           </p>
                           <div className="mt-3 text-[10px] font-bold text-slate-500 border-t border-slate-200 pt-2">
                              DEADLINE : {scholarship.deadline}
                           </div>
                        </div>

                        <a href={scholarship.link} target="_blank" rel="noreferrer" className="w-full bg-slate-900 text-white py-3 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                           Voir l'offre
                           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </a>
                     </div>
                   );
                 })}
               </div>

               {/* Newsletter Box */}
               <div className="mt-8 p-8 bg-blue-900 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                  <div className="relative z-10">
                    <h4 className="text-lg font-bold mb-2">Alerte Bourses</h4>
                    <p className="text-blue-100/70 text-xs mb-6 leading-relaxed">Recevez les financements par email.</p>
                    <input 
                      type="email" 
                      placeholder="email@univ.cg" 
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm mb-4 outline-none focus:ring-2 focus:ring-blue-400 text-white"
                    />
                    <button className="w-full bg-blue-500 text-white py-3 rounded-xl font-bold text-xs hover:bg-blue-400 transition-all">S'inscrire</button>
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-700 rounded-full blur-[40px] opacity-30"></div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicationsView;
