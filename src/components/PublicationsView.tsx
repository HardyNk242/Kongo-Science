import React from 'react';
import { ARTICLES, SCHOLARSHIPS } from '../constants';
import ArticleCard from './ArticleCard';

const PublicationsView: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- EN-TÊTE --- */}
        <div className="mb-20">
          <span className="text-blue-700 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Savoir & Opportunités</span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-6 italic">Actualités & Bourses</h1>
          <p className="text-slate-600 text-lg max-w-3xl leading-relaxed">
            Restez informé des dernières avancées scientifiques dans le Bassin du Congo et accédez aux financements pour vos recherches d'excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* --- COLONNE PRINCIPALE : ARTICLES --- */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-10 border-b border-slate-200 pb-6">
               <h2 className="text-2xl font-serif font-bold text-slate-900 italic">Actualités Scientifiques</h2>
               <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{ARTICLES.length} Articles</span>
            </div>
            
            {/* Grille des articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {ARTICLES.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
            
            {/* Bloc Appel à contribution */}
            <div className="mt-16 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm text-center">
               <div className="w-16 h-16 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-4">Contribuer à l'actualité</h3>
               <p className="text-slate-500 mb-8 max-w-sm mx-auto text-sm">Vous avez une découverte ou un article à partager ? Notre comité éditorial examine vos propositions de vulgarisation.</p>
               <button className="text-blue-700 font-bold border-b-2 border-blue-700 pb-1 hover:text-blue-800 transition-colors">Soumettre un article</button>
            </div>
          </div>

          {/* --- COLONNE LATÉRALE : BOURSES (STICKY) --- */}
          <div className="lg:col-span-4">
            <div className="sticky top-32"> {/* Reste accroché au scroll */}
               <div className="flex items-center justify-between mb-10 border-b border-slate-200 pb-6">
                  <h2 className="text-2xl font-serif font-bold text-slate-900 italic">Bourses & Opportunités</h2>
               </div>

               {/* Liste des bourses */}
               <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
                 {SCHOLARSHIPS.map(scholarship => {
                   // Calcul simple pour voir si la deadline est proche (< 30 jours)
                   const isUrgent = new Date(scholarship.deadline).getTime() - new Date().getTime() < 1000 * 60 * 60 * 24 * 30;
                   
                   return (
                     <div key={scholarship.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                        <div className="flex justify-between items-start mb-4">
                           <span className="text-[10px] font-black bg-blue-50 text-blue-700 px-3 py-1 rounded-full uppercase tracking-tighter">
                              {scholarship.level}
                           </span>
                           {isUrgent && (
                             <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping" title="Urgent : expire bientôt"></span>
                           )}
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors leading-snug">
                           {scholarship.title}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">{scholarship.provider}</p>
                        
                        <div className="bg-slate-50 p-4 rounded-2xl mb-4">
                           <div className="flex items-center gap-2 mb-2 text-[10px] font-bold text-slate-500">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>
                              DEADLINE : {new Date(scholarship.deadline).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                           </div>
                           <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                              {scholarship.description}
                           </p>
                        </div>

                        <a href={scholarship.link} target="_blank" rel="noreferrer" className="w-full bg-slate-900 text-white py-3 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                           Voir l'offre
                           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </a>
                     </div>
                   );
                 })}
               </div>

               {/* Newsletter Bourse */}
               <div className="mt-8 p-8 bg-blue-900 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                  <div className="relative z-10">
                    <h4 className="text-lg font-bold mb-2">Alerte Bourses</h4>
                    <p className="text-blue-100/70 text-xs mb-6 leading-relaxed">Recevez les nouveaux financements directement par email.</p>
                    <input 
                      type="email" 
                      placeholder="votre.email@univ.cg" 
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm mb-4 outline-none focus:ring-2 focus:ring-blue-400 placeholder-blue-300/50 text-white"
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
