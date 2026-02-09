import React, { useState, useEffect, useMemo } from 'react';
import ReactGA from 'react-ga4'; // NOUVEAU : Import Google Analytics

// --- COMPOSANTS ---
import Header from './components/Header';
import Hero from './components/Hero';
import ConferenceCard from './components/ConferenceCard';
import LibraryView from './components/LibraryView';
import ConferencesView from './components/ConferencesView';
import RegistrationView from './components/RegistrationView';
import ProposalView from './components/ProposalView';
import ChatAssistant from './components/ChatAssistant';
import Footer from './components/Footer';

// --- VOS NOUVELLES PAGES ---
import HistoryView from './components/HistoryView';
import TeamView from './components/TeamView';
import ProgramsView from './components/ProgramsView';
import PublicationsView from './components/PublicationsView';

import { OBJECTIFS, CONFERENCES, PARTNERS } from './constants';
import { Conference } from './types';

// --- CONFIGURATION GOOGLE ANALYTICS ---
const GA_MEASUREMENT_ID = "G-2N8BKNB1V0"; 
ReactGA.initialize(GA_MEASUREMENT_ID);

const App: React.FC = () => {
  const [selectedConference, setSelectedConference] = useState<Conference | null>(null);
  const [currentPath, setCurrentPath] = useState('home');

  // --- SUIVI GOOGLE ANALYTICS ---
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.hash || '/home' });
  }, [currentPath]);

  // --- FILTRE DES CONFÉRENCES À VENIR ---
  const upcomingConferences = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return CONFERENCES
      .filter((conf) => new Date(conf.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, []);

  // --- GESTION DU HASH (URL) ---
  const syncFromHash = () => {
    const raw = window.location.hash || '';
    const cleaned = raw.replace(/^#\/?/, '');
    const [path = 'home', id] = cleaned.split('/');

    setCurrentPath(path || 'home');

    if (path === 'registration') {
      if (id) {
        const conf = CONFERENCES.find(c => c.id === id);
        setSelectedConference(conf ?? null);
      } else {
        setSelectedConference(null);
      }
    } else {
      setSelectedConference(null);
    }
  };

  useEffect(() => {
    window.addEventListener('hashchange', syncFromHash);
    window.addEventListener('popstate', syncFromHash);
    syncFromHash();
    return () => {
      window.removeEventListener('hashchange', syncFromHash);
      window.removeEventListener('popstate', syncFromHash);
    };
  }, []);

  const navigateTo = (path: string, conf?: Conference) => {
    if (conf) {
      setSelectedConference(conf);
      setCurrentPath(path);
      window.location.hash = `${path}/${conf.id}`;
    } else {
      setSelectedConference(null);
      setCurrentPath(path);
      window.location.hash = path;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- ROUTEUR PRINCIPAL ---
  const renderContent = () => {
    switch (currentPath) {
      
      case 'publications':
        return <PublicationsView />;

      case 'history':
        return <HistoryView />;

      case 'team':
        return <TeamView />;

      // --- LE RACCOURCI MARKETING (Lien direct vers les prix) ---
      case 'offres':
        return <ProgramsView forceView="offers" />;

      case 'programmes':
        return <ProgramsView />;
        
      case 'library':
        return <LibraryView />;

      case 'agenda':
        return (
          <ConferencesView
            onRegister={(conf) => navigateTo('registration', conf)}
            onProposal={() => navigateTo('proposal')}
          />
        );

      case 'proposal':
        return <ProposalView onBack={() => navigateTo('home')} />;

      case 'registration':
        return selectedConference ? (
          <RegistrationView
            conference={selectedConference}
            onBack={() => navigateTo('agenda')}
          />
        ) : (
          <div className="py-32 text-center">
            <h2 className="text-2xl font-bold">Conférence non trouvée</h2>
            <button
              onClick={() => navigateTo('home')}
              className="mt-4 text-blue-700 font-bold hover:underline"
            >
              Retour à l'accueil
            </button>
          </div>
        );

      case 'home':
      default:
        return (
          <>
            <Hero onNavigate={navigateTo} />

            {/* SECTION VISION */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <span className="text-blue-700 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">
                  Notre Engagement
                </span>
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-4 tracking-tight italic">
                  Vision Scientifique
                </h2>
                <div className="w-20 h-1.5 bg-blue-700 mx-auto rounded-full"></div>
                <p className="mt-8 text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
                  Kongo Science œuvre pour l'éveil de la conscience scientifique à travers des piliers stratégiques d'excellence souveraine.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {OBJECTIFS.map((objectif) => (
                  <div
                    key={objectif.id}
                    onClick={() => objectif.linkTo && navigateTo(objectif.linkTo)}
                    className={`bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 group hover:shadow-xl hover:border-blue-100 transition-all duration-500 flex flex-col items-center text-center ${objectif.linkTo ? 'cursor-pointer hover:scale-105' : ''}`}
                  >
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-700 mb-8 mx-auto group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={objectif.iconPath} />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-700 transition-colors">
                      {objectif.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-sm">{objectif.description}</p>
                    
                    {objectif.linkTo && (
                      <span className="mt-6 text-blue-600 text-xs font-bold uppercase tracking-widest flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        Accéder →
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* --- SECTION OFFRES & BOUQUETS (Avec couleurs) --- */}
            <section className="py-16 bg-blue-900 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-[100px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                 <div className="bg-white/10 backdrop-blur-lg rounded-[3rem] p-10 md:p-16 border border-white/10 shadow-2xl">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                       <div className="flex-1">
                          <span className="inline-block bg-blue-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg mb-6">
                            Lancement 2026
                          </span>
                          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 italic leading-tight">
                            Offres d'Accompagnement Scientifique
                          </h2>
                          <p className="text-blue-100 text-lg leading-relaxed mb-8">
                            Propulsez votre carrière avec nos 5 bouquets exclusifs : du mentorat Master/Doctorat à l'accélérateur de carrière internationale.
                          </p>
                          
                          {/* TAGS COLORÉS ICI */}
                          <div className="flex flex-wrap gap-3 mb-10">
                            <span className="bg-amber-500 text-white border-2 border-amber-400 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide shadow-lg shadow-amber-900/20 transform hover:scale-105 transition-transform cursor-default">
                              Stratégie Express
                            </span>
                            <span className="bg-blue-500 text-white border-2 border-blue-400 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide shadow-lg shadow-blue-900/20 transform hover:scale-105 transition-transform cursor-default">
                              Bouquet Standard
                            </span>
                            <span className="bg-purple-600 text-white border-2 border-purple-400 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide shadow-lg shadow-purple-900/40 ring-2 ring-purple-300/30 transform hover:scale-105 transition-transform cursor-default">
                              Bouquet Premium 👑
                            </span>
                            <span className="bg-pink-600 text-white border-2 border-pink-400 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide shadow-lg shadow-pink-900/20 transform hover:scale-105 transition-transform cursor-default">
                              Publication Int.
                            </span>
                            <span className="bg-emerald-600 text-white border-2 border-emerald-400 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide shadow-lg shadow-emerald-900/20 transform hover:scale-105 transition-transform cursor-default">
                              Finisher
                            </span>
                          </div>

                          <button 
                            onClick={() => navigateTo('offres')}
                            className="bg-white text-blue-900 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl flex items-center gap-2"
                          >
                            Découvrir les Offres
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                          </button>
                       </div>
                       
                       <div className="hidden md:block w-1/3">
                           {/* Illustration abstraite */}
                           <div className="grid grid-cols-2 gap-4 opacity-80">
                              <div className="bg-blue-500/20 h-32 rounded-3xl backdrop-blur-sm border border-white/10"></div>
                              <div className="bg-blue-300/20 h-32 rounded-3xl backdrop-blur-sm border border-white/10 mt-8"></div>
                              <div className="bg-white/20 h-32 rounded-3xl backdrop-blur-sm border border-white/10 -mt-8"></div>
                              <div className="bg-blue-600/20 h-32 rounded-3xl backdrop-blur-sm border border-white/10"></div>
                           </div>
                       </div>
                    </div>
                 </div>
              </div>
            </section>

            {/* SECTION CONFÉRENCES */}
            <section className="py-24 bg-white relative">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-blue-700 text-white rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-blue-700 font-black text-[10px] uppercase tracking-[0.2em]">
                        Agenda Scientifique
                      </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-tight">
                      Prochains Rendez-vous
                    </h2>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => navigateTo('agenda')}
                      className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg"
                    >
                      Tout l'agenda
                    </button>
                  </div>
                </div>

                {upcomingConferences.length === 0 ? (
                  <div className="text-center text-slate-500 py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    Aucune conférence programmée prochainement.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {upcomingConferences.slice(0, 3).map(conference => (
                      <ConferenceCard
                        key={conference.id}
                        conference={conference}
                        onRegister={(conf) => navigateTo('registration', conf)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* SECTION PARTENAIRES */}
            <section className="py-20 bg-slate-50 border-t border-slate-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center gap-6 mb-16 opacity-60">
                   <div className="h-px bg-slate-300 w-12 md:w-32"></div>
                   <h3 className="text-xs md:text-sm font-black text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap">
                     Ils nous font confiance
                   </h3>
                   <div className="h-px bg-slate-300 w-12 md:w-32"></div>
                </div>

                <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                  {PARTNERS.map(partner => (
                    <div key={partner.name} className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center font-bold text-slate-400 border-2 border-slate-100 shadow-sm">
                        {partner.logo}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        {partner.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-blue-100 selection:text-blue-900">
      <Header onNavigate={navigateTo} currentPath={currentPath} />
      <main className="flex-grow">{renderContent()}</main>
      <ChatAssistant />
      <Footer />
    </div>
  );
};

export default App;