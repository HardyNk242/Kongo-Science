import React, { useState } from 'react';
import { NAV_ITEMS } from '../constants';

interface Props {
  onNavigate: (path: string) => void;
  currentPath: string;
}

const Header: React.FC<Props> = ({ onNavigate, currentPath }) => {
  const [isOpen, setIsOpen] = useState(false);
  // État pour gérer l'ouverture des sous-menus sur mobile
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setIsOpen(false);
    setMobileSubmenu(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleMobileSubmenu = (label: string) => {
    setMobileSubmenu(mobileSubmenu === label ? null : label);
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          
          {/* --- LOGO --- */}
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
          
          {/* --- DESKTOP MENU --- */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_ITEMS.map((item) => {
              // Vérifie si le lien est actif (lui-même ou un de ses enfants)
              const isActive = currentPath === item.path || item.submenu?.some(sub => sub.path === currentPath);

              return (
                <div key={item.label} className="relative group">
                  <button
                    onClick={() => !item.submenu && handleNavClick(item.path)}
                    className={`text-sm font-medium transition-colors flex items-center gap-1 py-2 ${
                      isActive ? 'text-blue-700 font-bold' : 'text-slate-600 hover:text-blue-700'
                    }`}
                  >
                    {item.label}
                    {item.submenu && (
                      <svg className="w-3 h-3 mt-0.5 group-hover:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    )}
                  </button>

                  {/* Dropdown Desktop */}
                  {item.submenu && (
                    <div className="absolute top-full left-0 mt-0 w-48 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                      <div className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
                        {item.submenu.map((subItem) => (
                          <button
                            key={subItem.path}
                            onClick={() => handleNavClick(subItem.path)}
                            className={`block w-full text-left px-4 py-3 text-sm hover:bg-slate-50 hover:text-blue-700 border-b border-slate-50 last:border-none ${
                              currentPath === subItem.path ? 'text-blue-700 font-bold bg-blue-50' : 'text-slate-600'
                            }`}
                          >
                            {subItem.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            
            <button className="bg-blue-700 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-blue-800 transition-all shadow-xl shadow-blue-100 active:scale-95">
              Rejoindre
            </button>
          </div>

          {/* --- MOBILE HAMBURGER --- */}
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

      {/* --- MOBILE MENU --- */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 pb-4 shadow-lg animate-in slide-in-from-top-4 duration-300 h-screen overflow-y-auto">
          <div className="px-4 pt-4 space-y-2 pb-20">
            {NAV_ITEMS.map((item) => (
              <div key={item.label}>
                {item.submenu ? (
                  // Cas avec Sous-menu (Accordéon)
                  <div>
                    <button
                      onClick={() => toggleMobileSubmenu(item.label)}
                      className={`w-full flex justify-between items-center text-left px-3 py-3 text-base font-medium rounded-xl transition-all ${
                        currentPath === item.path || item.submenu.some(s => s.path === currentPath)
                          ? 'text-blue-700 bg-blue-50' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                      <svg className={`w-4 h-4 transition-transform ${mobileSubmenu === item.label ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    
                    {/* Liste des sous-liens */}
                    {mobileSubmenu === item.label && (
                      <div className="pl-4 mt-1 space-y-1 border-l-2 border-slate-100 ml-4">
                        {item.submenu.map((sub) => (
                          <button
                            key={sub.path}
                            onClick={() => handleNavClick(sub.path)}
                            className={`block w-full text-left px-3 py-2 text-sm rounded-lg ${
                              currentPath === sub.path ? 'text-blue-700 font-bold' : 'text-slate-500'
                            }`}
                          >
                            {sub.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // Cas lien simple
                  <button
                    onClick={() => handleNavClick(item.path)}
                    className={`block w-full text-left px-3 py-3 text-base font-medium rounded-xl transition-all ${
                      currentPath === item.path 
                        ? 'text-blue-700 bg-blue-50' 
                        : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                )}
              </div>
            ))}
            <div className="pt-6">
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
