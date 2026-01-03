
import React, { useState } from 'react';
import { NAV_ITEMS } from '../constants';

interface Props {
  onNavigate: (path: string) => void;
  currentPath: string;
}

const Header: React.FC<Props> = ({ onNavigate, currentPath }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <button 
              onClick={() => handleNavClick('home')}
              className="flex-shrink-0 flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">K</div>
              <div className="flex flex-col items-start">
                <span className="text-[10px] font-black uppercase text-blue-700 tracking-[0.2em] leading-none mb-1">Communauté</span>
                <span className="text-xl font-serif font-bold text-slate-900 tracking-tight leading-none">Kongo <span className="text-blue-700">SCIENCE</span></span>
              </div>
            </button>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.path)}
                className={`text-sm font-medium transition-colors ${
                  currentPath === item.path ? 'text-blue-700' : 'text-slate-600 hover:text-blue-700'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button className="bg-blue-700 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-blue-800 transition-all shadow-xl shadow-blue-100 active:scale-95">
              Rejoindre
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-blue-700 p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 pb-4 shadow-lg animate-in slide-in-from-top-4 duration-300">
          <div className="px-4 pt-4 space-y-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.path)}
                className={`block w-full text-left px-3 py-3 text-base font-medium rounded-xl transition-all ${
                  currentPath === item.path 
                    ? 'text-blue-700 bg-blue-50' 
                    : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-4">
              <button className="w-full bg-blue-700 text-white py-3 rounded-xl font-bold shadow-lg">
                Rejoindre la communauté
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
