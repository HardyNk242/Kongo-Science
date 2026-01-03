import React from 'react';
import { Conference } from '../types';

interface Props {
  conference: Conference & { imageUrl: string };
  onRegister: (conference: Conference) => void;
}

const ConferenceCard: React.FC<Props> = ({ conference, onRegister }) => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 group flex flex-col h-full">
      {/* 1:1 Aspect Ratio Image (1080x1080) */}
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={conference.imageUrl} 
          alt={conference.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60"></div>
        
        {/* Date Badge Overlay */}
        <div className="absolute top-6 left-6 w-14 h-16 bg-white rounded-2xl flex flex-col items-center justify-center shadow-lg border border-slate-100 transform group-hover:-translate-y-1 transition-transform">
          <span className="text-xl font-bold text-blue-700 leading-none">{conference.day}</span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{conference.month}</span>
        </div>

        {/* Type Label */}
        <div className="absolute bottom-6 left-6">
          <span className={`text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest text-white backdrop-blur-md border border-white/30 shadow-sm ${
            conference.type === 'Webinaire' ? 'bg-purple-500/60' : 
            conference.type === 'Présentiel' ? 'bg-green-500/60' : 'bg-orange-500/60'
          }`}>
            {conference.type}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-8 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-blue-600"></div>
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">{conference.organizer}</span>
        </div>
        
        <h4 className="text-2xl font-serif font-bold text-slate-900 mb-4 leading-tight group-hover:text-blue-700 transition-colors">
          {conference.title}
        </h4>
        
        <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed">
          {conference.description}
        </p>

        <div className="space-y-2 mb-8">
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold">{conference.time}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <span className="truncate max-w-[200px]">{conference.location}</span>
          </div>
        </div>
        
        <div className="mt-auto pt-6 border-t border-slate-100">
          <button 
            onClick={() => onRegister(conference)}
            className="w-full bg-blue-700 text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-blue-800 transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
          >
            S'inscrire
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConferenceCard;