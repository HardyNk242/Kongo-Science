import React, { useMemo, useState } from 'react';
import { CONFERENCES } from '../constants';
import ConferenceCard from './ConferenceCard';
import { Conference } from '../types';

interface Props {
  onRegister: (conference: Conference) => void;
  onProposal: () => void;
}

type FilterMode = 'all' | 'upcoming' | 'past';

const ConferencesView: React.FC<Props> = ({ onRegister, onProposal }) => {
  const now = new Date();
  const [filter, setFilter] = useState<FilterMode>('all');

  const { upcomingCount, pastCount, groupedConferences } = useMemo(() => {
    const sorted = [...CONFERENCES].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let upcoming = 0;
    let past = 0;
    sorted.forEach(c => {
      if (new Date(c.date) >= now) upcoming++;
      else past++;
    });

    // Filtrage
    const filtered = sorted.filter(c => {
      const isPast = new Date(c.date) < now;
      if (filter === 'upcoming') return !isPast;
      if (filter === 'past') return isPast;
      return true;
    });

    // Groupement par mois/année
    const monthNames = [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];
    const groups: { [key: string]: (Conference & { imageUrl: string })[] } = {};
    filtered.forEach(conf => {
      const date = new Date(conf.date);
      const monthYear = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      if (!groups[monthYear]) groups[monthYear] = [];
      groups[monthYear].push(conf);
    });

    return { upcomingCount: upcoming, pastCount: past, groupedConferences: Object.entries(groups) };
  }, [filter]);

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* ====== HERO ====== */}
      <section className="relative bg-slate-950 pt-24 pb-32 text-white overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] bg-blue-600/30 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 right-0 w-[32rem] h-[32rem] bg-indigo-500/20 rounded-full blur-[140px]"></div>
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        ></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-blue-100">Agenda scientifique 2026</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold leading-[1.05] mb-6">
            L'éveil de la
            <span className="block italic text-blue-300">conscience scientifique.</span>
          </h1>
          <p className="text-blue-100/80 text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
            Participez aux échanges qui façonnent la recherche dans le Bassin du Congo. Inscriptions ouvertes pour les sessions en direct, replays archivés sur YouTube.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3">
              <p className="font-serif italic text-3xl font-bold text-white leading-none">{upcomingCount}</p>
              <p className="text-[10px] uppercase tracking-widest text-blue-300 font-bold mt-1">À venir</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3">
              <p className="font-serif italic text-3xl font-bold text-white leading-none">{pastCount}</p>
              <p className="text-[10px] uppercase tracking-widest text-blue-300 font-bold mt-1">Replays</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3">
              <p className="font-serif italic text-3xl font-bold text-white leading-none">{CONFERENCES.length}</p>
              <p className="text-[10px] uppercase tracking-widest text-blue-300 font-bold mt-1">Total</p>
            </div>
          </div>
        </div>
      </section>

      {/* ====== FILTRES ====== */}
      <section className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-900/5 p-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1 bg-slate-50 p-1.5 rounded-2xl">
            {([
              { id: 'all', label: 'Toutes', count: CONFERENCES.length },
              { id: 'upcoming', label: 'À venir', count: upcomingCount },
              { id: 'past', label: 'Replays', count: pastCount },
            ] as const).map(t => (
              <button
                key={t.id}
                onClick={() => setFilter(t.id)}
                aria-pressed={filter === t.id}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                  filter === t.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {t.label}
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  filter === t.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                }`}>{t.count}</span>
              </button>
            ))}
          </div>
          <button
            onClick={onProposal}
            className="hidden sm:inline-flex group items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-md active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Proposer
          </button>
        </div>
      </section>

      {/* ====== LISTE ====== */}
      <section className="max-w-7xl mx-auto px-6 mt-16">
        {groupedConferences.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-500 font-medium">Aucune conférence dans cette catégorie.</p>
          </div>
        ) : (
          <div className="space-y-20">
            {groupedConferences.map(([monthYear, conferences]) => (
              <div key={monthYear} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Séparateur mois */}
                <div className="flex items-center gap-4 mb-10">
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 leading-none">
                    {monthYear}
                  </h2>
                  <div className="flex-1 h-px bg-slate-200"></div>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500 bg-white border border-slate-200 px-4 py-1.5 rounded-full">
                    {conferences.length} {conferences.length > 1 ? 'sessions' : 'session'}
                  </span>
                </div>

                {/* Cartes */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {conferences.map(conf => {
                    const confDate = new Date(conf.date);
                    const isPast = confDate < now;

                    if (!isPast) {
                      return (
                        <ConferenceCard
                          key={conf.id}
                          conference={conf}
                          onRegister={onRegister}
                        />
                      );
                    }

                    // === CONFÉRENCE PASSÉE : affiche lisible + bouton replay ===
                    return (
                      <article
                        key={conf.id}
                        className="relative bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 hover:border-slate-200 group flex flex-col h-full"
                      >
                        <div className="relative aspect-square overflow-hidden bg-slate-100">
                          {/* Affiche NETTE avec léger overlay */}
                          <img
                            src={conf.imageUrl}
                            alt={conf.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          {/* Voile subtil pour signaler l'archive (au lieu du blur) */}
                          <div className="absolute inset-0 bg-slate-950/15 group-hover:bg-slate-950/5 transition-colors"></div>
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-transparent"></div>

                          {/* Date badge */}
                          <div className="absolute top-5 left-5 w-14 h-16 bg-white/95 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center shadow-xl">
                            <span className="text-2xl font-serif font-bold text-slate-900 leading-none italic">{conf.day}</span>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">{conf.month}</span>
                          </div>

                          {/* Badge REPLAY visible */}
                          <div className="absolute top-5 right-5">
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest text-white bg-red-600/90 backdrop-blur-md shadow-lg ring-1 ring-red-300/50">
                              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                              Replay
                            </span>
                          </div>

                          {/* Bouton Replay overlay au survol */}
                          <a
                            href={conf.replayUrl || "https://youtube.com/@KongoScience"}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Regarder le replay : ${conf.title}`}
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-950/40"
                          >
                            <span className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl shadow-red-600/50 hover:scale-110 transition-transform">
                              <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </span>
                          </a>

                          {/* Organisateur sur image */}
                          <div className="absolute bottom-5 left-5 right-5">
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/90 mb-1">{conf.organizer}</p>
                          </div>
                        </div>

                        {/* Contenu */}
                        <div className="p-7 flex flex-col flex-grow">
                          <h4 className="text-xl font-serif font-bold text-slate-900 mb-3 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
                            {conf.title}
                          </h4>
                          <p className="text-slate-600 text-sm mb-5 line-clamp-3 leading-relaxed flex-grow">
                            {conf.description}
                          </p>

                          <a
                            href={conf.replayUrl || "https://youtube.com/@KongoScience"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/btn w-full bg-slate-100 hover:bg-red-600 text-slate-900 hover:text-white px-5 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-slate-200 hover:border-red-600"
                          >
                            <svg className="w-4 h-4 text-red-600 group-hover/btn:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                            </svg>
                            Voir le replay
                          </a>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ====== CTA PROPOSITION ====== */}
      <section className="mt-24 max-w-5xl mx-auto px-6">
        <div className="relative bg-slate-950 text-white rounded-[3rem] p-12 md:p-16 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-600/30 rounded-full blur-[100px]"></div>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-blue-300 mb-3 block">Pour les chercheurs</span>
              <h3 className="text-3xl md:text-4xl font-serif font-bold italic leading-tight mb-4">
                Vous avez une recherche à partager ?
              </h3>
              <p className="text-blue-100/80 leading-relaxed">
                Kongo Science offre une plateforme de visibilité exceptionnelle. Proposez votre propre conférence ou atelier technique.
              </p>
            </div>
            <button
              onClick={onProposal}
              className="group bg-white hover:bg-blue-50 text-slate-900 px-7 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl flex items-center justify-center gap-2 active:scale-95"
            >
              Soumettre
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ConferencesView;
