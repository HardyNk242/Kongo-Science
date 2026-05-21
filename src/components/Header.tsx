import React, { useState, useEffect } from 'react';
import { NAV_ITEMS } from '../constants';

interface Props {
  onNavigate: (path: string) => void;
  currentPath: string;
}

const Header: React.FC<Props> = ({ onNavigate, currentPath }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Bloque le scroll body quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

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
    <>
      {/* Skip-to-content link (a11y) */}
      <a href="#main-content" className="skip-link">Aller au contenu principal</a>

      <nav
        aria-label="Navigation principale"
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-sm'
            : 'bg-white/80 backdrop-blur-md border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center transition-all duration-300 ${scrolled ? 'h-16' : 'h-20'}`}>
            {/* --- LOGO --- */}
            <button
              onClick={() => handleNavClick('home')}
              aria-label="Kongo Science — Accueil"
              className="flex-shrink-0 flex items-center gap-3 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg">
                  K
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex flex-col items-start leading-none">
                <span className="text-[9px] font-bold uppercase text-slate-400 tracking-[0.25em] mb-1">Communauté</span>
                <span className="text-lg font-serif font-bold text-slate-900 tracking-tight">
                  Kongo <span className="text-blue-700 italic">Science</span>
                </span>
              </div>
            </button>

            {/* --- DESKTOP MENU --- */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = currentPath === item.path || item.submenu?.some(sub => sub.path === currentPath);

                return (
                  <div key={item.label} className="relative group">
                    <button
                      onClick={() => !item.submenu && handleNavClick(item.path)}
                      aria-current={isActive ? 'page' : undefined}
                      aria-haspopup={item.submenu ? 'true' : undefined}
                      className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                        isActive
                          ? 'text-slate-900'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                      {item.submenu && (
                        <svg
                          className="w-3 h-3 mt-0.5 opacity-50 group-hover:opacity-100 group-hover:rotate-180 transition-all"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                      {/* Active indicator (underline) */}
                      {isActive && (
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      )}
                    </button>

                    {/* Dropdown */}
                    {item.submenu && (
                      <div
                        className="absolute top-full left-0 mt-1 w-56 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0"
                        role="menu"
                      >
                        <div className="bg-white rounded-2xl shadow-2xl shadow-slate-900/10 border border-slate-100 overflow-hidden p-2">
                          {item.submenu.map((subItem) => {
                            const subActive = currentPath === subItem.path;
                            return (
                              <button
                                key={subItem.path}
                                onClick={() => handleNavClick(subItem.path)}
                                role="menuitem"
                                aria-current={subActive ? 'page' : undefined}
                                className={`block w-full text-left px-4 py-2.5 text-sm rounded-xl transition-all ${
                                  subActive
                                    ? 'bg-blue-50 text-blue-700 font-semibold'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                              >
                                {subItem.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* CTA Rejoindre */}
              <button
                onClick={() => handleNavClick('rejoindre')}
                className="ml-3 group bg-slate-900 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg shadow-slate-900/10 hover:shadow-blue-500/20 active:scale-95 flex items-center gap-2"
              >
                Rejoindre
                <svg
                  className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

            {/* --- MOBILE HAMBURGER --- */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              className="md:hidden text-slate-700 hover:text-slate-900 p-2 -mr-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* --- MOBILE MENU --- */}
        {isOpen && (
          <div
            id="mobile-menu"
            className="md:hidden bg-white border-t border-slate-100 shadow-lg animate-in slide-in-from-top-4 duration-300 h-[calc(100vh-4rem)] overflow-y-auto"
          >
            <div className="px-4 pt-4 space-y-1 pb-32">
              {NAV_ITEMS.map((item) => {
                const isActive = currentPath === item.path || item.submenu?.some(s => s.path === currentPath);
                return (
                  <div key={item.label}>
                    {item.submenu ? (
                      <div>
                        <button
                          onClick={() => toggleMobileSubmenu(item.label)}
                          aria-expanded={mobileSubmenu === item.label}
                          className={`w-full flex justify-between items-center text-left px-4 py-3.5 text-base font-semibold rounded-xl transition-all ${
                            isActive
                              ? 'text-blue-700 bg-blue-50'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {item.label}
                          <svg
                            className={`w-4 h-4 transition-transform ${mobileSubmenu === item.label ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {mobileSubmenu === item.label && (
                          <div className="pl-3 mt-1 mb-2 space-y-0.5 border-l-2 border-blue-100 ml-4 animate-in slide-in-from-top-2 duration-200">
                            {item.submenu.map((sub) => (
                              <button
                                key={sub.path}
                                onClick={() => handleNavClick(sub.path)}
                                aria-current={currentPath === sub.path ? 'page' : undefined}
                                className={`block w-full text-left px-4 py-2.5 text-sm rounded-lg transition-colors ${
                                  currentPath === sub.path
                                    ? 'text-blue-700 font-bold bg-blue-50'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                              >
                                {sub.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleNavClick(item.path)}
                        aria-current={isActive ? 'page' : undefined}
                        className={`block w-full text-left px-4 py-3.5 text-base font-semibold rounded-xl transition-all ${
                          isActive
                            ? 'text-blue-700 bg-blue-50'
                            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        {item.label}
                      </button>
                    )}
                  </div>
                );
              })}

              {/* CTA bottom mobile */}
              <div className="pt-6 px-1">
                <button
                  onClick={() => handleNavClick('rejoindre')}
                  className="w-full bg-slate-900 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-lg transition-colors flex items-center justify-center gap-2"
                >
                  Rejoindre la communauté
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Header;
