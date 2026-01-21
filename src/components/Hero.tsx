
import React from 'react';

interface Props {
  onNavigate: (path: string) => void;
}

const Hero: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="relative bg-blue-900 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <img 
          src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1920&h=1080" 
          alt="Background Science" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-7xl font-serif font-bold mb-8 leading-tight">
            Bâtir un avenir scientifique <span className="text-blue-400 italic">prospère</span> en Afrique
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-12 leading-relaxed max-w-2xl">
            La Communauté Kongo SCIENCE promeut l'excellence de la recherche et l'innovation technologique pour résoudre les défis majeurs du Bassin du Congo.
          </p>
          <div className="flex flex-col sm:flex-row gap-5">
            <button 
              onClick={() => onNavigate('agenda')}
              className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-blue-900/50 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              Agenda Scientifique
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <button 
              onClick={() => onNavigate('programmes')}
              className="bg-white/10 backdrop-blur-md border-2 border-white/20 hover:bg-white/20 text-white px-10 py-5 rounded-2xl font-black text-lg transition-all active:scale-95"
            >
              Découvrir nos Programmes
            </button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent"></div>
    </div>
  );
};

export default Hero;
