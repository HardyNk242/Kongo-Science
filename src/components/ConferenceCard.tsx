import React from 'react';
import { Conference } from '../types';

interface Props {
  conference: Conference & { imageUrl: string };
  onRegister: (conference: Conference) => void;
}

const typeStyles: Record<string, { bg: string; ring: string; label: string }> = {
  Webinaire:  { bg: 'bg-violet-500/90',   ring: 'ring-violet-300/50',  label: 'Webinaire' },
  Présentiel: { bg: 'bg-emerald-500/90',  ring: 'ring-emerald-300/50', label: 'Présentiel' },
  Hybride:    { bg: 'bg-amber-500/90',    ring: 'ring-amber-300/50',   label: 'Hybride' },
};

const ConferenceCard: React.FC<Props> = ({ conference, onRegister }) => {
  const typeStyle = typeStyles[conference.type] || typeStyles.Webinaire;

  return (
    <article className="relative bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 hover:border-slate-200 group flex flex-col h-full">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={conference.imageUrl}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/20 to-transparent"></div>

        {/* Date badge */}
        <div className="absolute top-5 left-5 w-14 h-16 bg-white rounded-2xl flex flex-col items-center justify-center shadow-xl border border-white">
          <span className="text-2xl font-serif font-bold text-slate-900 leading-none italic">{conference.day}</span>
          <span className="text-[9px] font-black text-blue-700 uppercase tracking-widest mt-1">{conference.month}</span>
        </div>

        {/* Type badge */}
        <div className="absolute top-5 right-5">
          <span className={`inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest text-white backdrop-blur-md shadow-lg ring-1 ${typeStyle.bg} ${typeStyle.ring}`}>
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            {typeStyle.label}
          </span>
        </div>

        {/* Organisateur sur l'image */}
        <div className="absolute bottom-5 left-5 right-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/80 mb-1">{conference.organizer}</p>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-7 flex flex-col flex-grow">
        <h4 className="text-xl font-serif font-bold text-slate-900 mb-3 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
          {conference.title}
        </h4>

        <p className="text-slate-600 text-sm mb-5 line-clamp-3 leading-relaxed flex-grow">
          {conference.description}
        </p>

        {/* Métadonnées */}
        <div className="space-y-2.5 mb-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-2.5 text-slate-700 text-xs">
            <span className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <span className="font-bold">{conference.time}</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-500 text-xs">
            <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>
            <span className="truncate font-medium">{conference.location}</span>
          </div>
        </div>

        <button
          onClick={() => onRegister(conference)}
          aria-label={`S'inscrire à ${conference.title}`}
          className="group/btn w-full bg-slate-900 hover:bg-blue-700 text-white px-5 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-md hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
        >
          S'inscrire
          <svg className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </article>
  );
};

export default ConferenceCard;
