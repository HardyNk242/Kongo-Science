import React, { useMemo } from 'react';
import { CONFERENCES } from '../constants';
import ConferenceCard from './ConferenceCard';
import { Conference } from '../types';

interface Props {
  onRegister: (conference: Conference) => void;
  onProposal: () => void;
}

const ConferencesView: React.FC<Props> = ({ onRegister, onProposal }) => {
  const now = new Date();

  /**
   * LOGIQUE : Groupement et Tri
   * Transforme la liste plate en [ ["Janvier 2026", [conf1, conf2]], ["Décembre 2025", [conf3]] ]
   */
  const groupedConferences = useMemo(() => {
    const groups: { [key: string]: (Conference & { imageUrl: string })[] } = {};

    // 1. Trier par date (futur vers passé)
    const sorted = [...CONFERENCES].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // 2. Grouper
    sorted.forEach(conf => {
      const date = new Date(conf.date);
      const monthNames = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
      ];
      const monthYear = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

      if (!groups[monthYear]) groups[monthYear] = [];
      groups[monthYear].push(conf);
    });

    return Object.entries(groups);
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen pb-32">
      {/* BANNIÈRE HÉRO */}
      <section className="bg-blue-900 pt-32 pb-24 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <span className="text-blue-400 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Agenda Scientifique</span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold italic leading-tight mb-8">
            L'Éveil de la <br /> Conscience
          </h1>
          <p className="text-blue-100 text-xl max-w-2xl leading-relaxed">
            Participez aux échanges qui façonnent la recherche dans le Bassin du Congo. Inscriptions ouvertes pour les sessions en direct.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 grayscale pointer-events-none">
            <img src="https://images.unsplash.com/photo-1517245318728-8bb56989396a?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Background" />
        </div>
      </section>

      {/* GRILLE DE CONFÉRENCES */}
      <section className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
        <div className="space-y-24">
          {groupedConferences.map(([monthYear, conferences]) => (
            <div key={monthYear} className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              {/* Séparateur de Mois */}
              <div className="flex items-end justify-between border-b border-slate-200 pb-6 mb-12">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 italic">{monthYear}</h2>
                <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm">
                   <span className="text-blue-700 font-bold text-sm">
                      {conferences.length} {conferences.length > 1 ? 'Sessions' : 'Session'}
                   </span>
                </div>
              </div>

              {/* Liste des cartes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {conferences.map(conf => {
                  const confDate = new Date(conf.date);
                  const isPast = confDate < now;

                  return (
                    <div key={conf.id} className="relative group/past flex flex-col h-full">

                       {/* ÉTAT 1 : Carte Standard (Floutée si passée) */}
                       <div className={`h-full transition-all duration-700 ${
                         isPast
                          ? "opacity-30 grayscale blur-lg pointer-events-none group-hover/past:blur-md group-hover/past:opacity-50"
                          : "hover:-translate-y-2"
                       }`}>
                          <ConferenceCard
                            conference={conf}
                            onRegister={onRegister}
                          />
                       </div>

                       {/* ÉTAT 2 : Overlay Replay (Visible uniquement si passée) */}
                       {isPast && (
                         <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-30">
                            <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl flex flex-col items-center text-center transform group-hover/past:scale-105 transition-transform duration-500 max-w-[280px]">
                               {/* Icone YouTube Animée */}
                               <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center mb-4 shadow-xl shadow-red-500/40 relative">
                                  <span className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-20"></span>
                                  <svg className="w-8 h-8 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                                  </svg>
                               </div>

                               <span className="text-slate-400 font-black text-[9px] uppercase tracking-[0.3em] mb-2">Contenu Archivé</span>
                               <h4 className="text-slate-900 font-bold text-sm mb-6 line-clamp-2 leading-tight">
                                 {conf.title}
                               </h4>

                               {/* Bouton avec Glow Effect */}
                               <a
                                 href={conf.replayUrl || "https://youtube.com/@KongoScience"}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold text-xs transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 active:scale-95 border border-red-500/50"
                               >
                                 Regarder le Replay
                                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                 </svg>
                               </a>
                            </div>
                         </div>
                       )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER DE SECTION */}
      <section className="mt-32 max-w-3xl mx-auto px-6 text-center">
         <div className="bg-blue-50 p-12 rounded-[3rem] border border-blue-100">
            <h3 className="text-2xl font-serif font-bold text-blue-900 mb-4 italic">Vous êtes chercheur ?</h3>
            <p className="text-blue-700/70 mb-8">
              Kongo Science offre une plateforme de visibilité exceptionnelle pour vos travaux. Proposez votre propre conférence ou atelier technique.
            </p>
            <button
              onClick={onProposal}
              className="bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-800 transition-all"
            >
               Soumettre une proposition
            </button>
         </div>
      </section>
    </div>
  );
};

export default ConferencesView;
