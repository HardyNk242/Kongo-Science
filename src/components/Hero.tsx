import React from 'react';

interface Props {
  onNavigate: (path: string) => void;
}

const Hero: React.FC<Props> = ({ onNavigate }) => {
  return (
    <section className="relative isolate overflow-hidden bg-slate-950 text-white">
      {/* ====== ARRIÈRE-PLAN MULTICOUCHE ====== */}
      {/* Image fond */}
      <div className="absolute inset-0 -z-20">
        <img
          src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1920&h=1080"
          alt=""
          className="w-full h-full object-cover opacity-30"
        />
      </div>
      {/* Gradient mesh */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950 via-blue-950/90 to-slate-950"></div>
      {/* Halos colorés */}
      <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] bg-blue-600/30 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute top-1/2 right-0 w-[32rem] h-[32rem] bg-indigo-500/20 rounded-full blur-[140px] -z-10"></div>
      {/* Grille subtile */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 md:pt-32 md:pb-40 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* ====== COLONNE GAUCHE : CONTENU ====== */}
          <div className="lg:col-span-7">
            {/* Badge intro */}
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-100">Recherche · Innovation · Souveraineté</span>
            </div>

            {/* Titre principal */}
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-[1.05] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              L'Excellence Scientifique
              <br />
              <span className="bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent italic">
                au service de la Souveraineté.
              </span>
            </h1>

            {/* Sous-titre */}
            <p className="text-lg md:text-xl text-blue-100/80 mb-10 leading-relaxed max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              Kongo Science catalyse la recherche de pointe et l'innovation technologique pour apporter des réponses
              concrètes aux défis stratégiques du <span className="text-white font-semibold">Bassin du Congo</span>.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
              <button
                onClick={() => onNavigate('agenda')}
                className="group relative overflow-hidden bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider shadow-2xl shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
              >
                <span className="relative z-10">Agenda Scientifique</span>
                <svg
                  className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              <button
                onClick={() => onNavigate('programmes')}
                className="group bg-white/5 backdrop-blur-md border border-white/15 hover:bg-white/10 hover:border-white/30 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                Découvrir nos Programmes
                <svg className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6 text-blue-100/60 animate-in fade-in duration-1000 delay-500">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                6 ans d'expertise
              </div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                50+ chercheurs accompagnés
              </div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Bassin du Congo
              </div>
            </div>
          </div>

          {/* ====== COLONNE DROITE : VISUEL FEATURED ====== */}
          <div className="lg:col-span-5 hidden lg:block animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
            <div className="relative">
              {/* Carte principale */}
              <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-300">Prochain événement</span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-400/30">
                    Live
                  </span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-white mb-3 leading-tight">
                  Conférences scientifiques mensuelles
                </h3>
                <p className="text-blue-100/70 text-sm mb-6 leading-relaxed">
                  Géosciences, télécoms, ingénierie, environnement — des experts décodent les enjeux du Bassin du Congo.
                </p>
                <button
                  onClick={() => onNavigate('agenda')}
                  className="w-full bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-black uppercase tracking-widest py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  Voir le calendrier
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>

              {/* Carte secondaire flottante */}
              <div className="absolute -bottom-6 -left-6 bg-blue-600 rounded-2xl px-5 py-4 shadow-2xl shadow-blue-900/50 border border-blue-400/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">Bibliothèque</p>
                    <p className="text-white font-bold text-sm">Thèses & articles</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====== TRANSITION INFÉRIEURE ====== */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-50 via-slate-50/70 to-transparent pointer-events-none"></div>
      {/* Vague décorative */}
      <svg
        className="absolute -bottom-1 left-0 right-0 w-full text-slate-50"
        viewBox="0 0 1440 80"
        fill="currentColor"
        preserveAspectRatio="none"
      >
        <path d="M0,32L60,37.3C120,43,240,53,360,53.3C480,53,600,43,720,37.3C840,32,960,32,1080,37.3C1200,43,1320,53,1380,58.7L1440,64L1440,80L1380,80C1320,80,1200,80,1080,80C960,80,840,80,720,80C600,80,480,80,360,80C240,80,120,80,60,80L0,80Z" />
      </svg>
    </section>
  );
};

export default Hero;
