import React, { useState, useEffect, useMemo } from 'react';
import ReactGA from 'react-ga4'; 
import { useLocation, useNavigate } from 'react-router-dom'; // NOUVEAU : Imports essentiels pour Vercel

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

// --- VOS PAGES ---
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
  // État partagé pour stocker l'ID (Article ou Thèse)
  const [urlId, setUrlId] = useState<string | null>(null);

  // NOUVEAU : Hooks du routeur moderne
  const location = useLocation();
  const navigate = useNavigate();

  // --- SUIVI GOOGLE ANALYTICS ---
  useEffect(() => {
    // On suit maintenant le "pathname" propre au lieu du hash
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);

  // --- FILTRE DES CONFÉRENCES À VENIR ---
  const upcomingConferences = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return CONFERENCES
      .filter((conf) => new Date(conf.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, []);

  // --- GESTION DU ROUTAGE (URLS PROPRES) ---
  // Cette fonction remplace l'ancien "syncFromHash"
  useEffect(() => {
    // On découpe l'URL proprement : /library/mon-article
    // .filter(Boolean) enlève les éléments vides (ex: le premier slash)
    const pathParts = location.pathname.split('/').filter(Boolean);
    
    const mainPath = pathParts[0] || 'home';
    const subId = pathParts[1] || null;

    setCurrentPath(mainPath);

    // Capture l'ID pour Publications ET Library
    if (mainPath === 'publications' || mainPath === 'library') {
      setUrlId(subId);
    } else {
      setUrlId(null);
    }

    // Gestion de l'inscription conférence
    if (mainPath === 'registration') {
      if (subId) {
        const conf = CONFERENCES.find(c => c.id === subId);
        setSelectedConference(conf ?? null);
      } else {
        setSelectedConference(null);
      }
    } else {
      setSelectedConference(null);
    }
  }, [location]); // Se déclenche à chaque changement d'URL

  // --- NAVIGATION MODERNE ---
  const navigateTo = (path: string, conf?: Conference) => {
    if (conf) {
      setSelectedConference(conf);
      // Change l'URL proprement sans rechargement ni #
      navigate(`/${path}/${conf.id}`);
    } else {
      setSelectedConference(null);
      // Change l'URL proprement
      navigate(`/${path}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- ROUTEUR PRINCIPAL ---
  const renderContent = () => {
    // Astuce : On utilise "key" pour forcer React à re-rendre le composant si l'ID change
    switch (currentPath) {
      
      case 'publications':
        return <PublicationsView initialArticleId={urlId} key={urlId || 'pub-list'} />;

      case 'library':
        return <LibraryView initialThesisId={urlId} key={urlId || 'lib-list'} />;

      case 'history':
        return <HistoryView />;

      case 'team':
        return <TeamView />;

      case 'offres':
        return <ProgramsView forceView="offers" />;

      case 'programmes':
        return <ProgramsView />;
        
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
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mb-16">
                <div className="inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full mb-6">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-700">Notre Engagement</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-6 leading-[1.1]">
                  Une vision scientifique <span className="italic text-blue-700">au service du continent.</span>
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed max-w-2xl">
                  Kongo Science œuvre pour l'éveil de la conscience scientifique à travers des piliers stratégiques d'excellence souveraine.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {OBJECTIFS.map((objectif, idx) => (
                  <div
                    key={objectif.id}
                    onClick={() => objectif.linkTo && navigateTo(objectif.linkTo)}
                    onKeyDown={(e) => objectif.linkTo && (e.key === 'Enter' || e.key === ' ') && navigateTo(objectif.linkTo)}
                    tabIndex={objectif.linkTo ? 0 : undefined}
                    role={objectif.linkTo ? 'button' : undefined}
                    aria-label={objectif.linkTo ? `Accéder à ${objectif.title}` : undefined}
                    className={`relative bg-white p-8 rounded-3xl border border-slate-100 group hover:shadow-2xl hover:border-slate-200 hover:-translate-y-1 transition-all duration-300 flex flex-col ${objectif.linkTo ? 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2' : ''}`}
                  >
                    {/* Numéro */}
                    <span className="absolute top-6 right-7 text-5xl font-serif font-bold text-slate-100 italic select-none group-hover:text-blue-100 transition-colors">
                      {String(idx + 1).padStart(2, '0')}
                    </span>

                    <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-700 transition-colors duration-300">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={objectif.iconPath} />
                      </svg>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-slate-900 mb-3 leading-snug">
                      {objectif.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-sm flex-grow">{objectif.description}</p>

                    {objectif.linkTo && (
                      <span className="mt-6 text-blue-700 text-xs font-bold uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                        Accéder
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* --- SECTION OFFRES & BOUQUETS --- */}
            <section className="py-20 bg-slate-950 text-white overflow-hidden relative">
              {/* Décor */}
              <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-600/15 rounded-full blur-[140px] translate-x-1/3 -translate-y-1/3"></div>
              <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-[120px] -translate-x-1/3 translate-y-1/3"></div>
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)',
                  backgroundSize: '60px 60px',
                }}
              ></div>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-7">
                    <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full mb-6">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                      <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-blue-100">Saison 2026 · Inscriptions ouvertes</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-[1.1]">
                      Offres d'Accompagnement
                      <span className="block italic text-blue-300">Scientifique.</span>
                    </h2>
                    <p className="text-blue-100/80 text-lg leading-relaxed mb-10 max-w-2xl">
                      Cinq bouquets sur-mesure — du mentorat Master/Doctorat à l'accélérateur de carrière internationale et la mise aux normes finale du manuscrit.
                    </p>

                    {/* Liste des bouquets en style minimal éditorial */}
                    <ul className="divide-y divide-white/10 border-y border-white/10 mb-10">
                      {[
                        { name: 'Stratégie Express', price: '30 000', tag: 'Session unique' },
                        { name: 'Bouquet Standard', price: '65 000', tag: 'Mentorat 3 mois' },
                        { name: 'Bouquet Premium', price: '150 000', tag: 'Best-seller · 6 mois' },
                        { name: 'Publication Internationale', price: '150 000', tag: 'Article scientifique' },
                        { name: 'Finisher', price: '100 000', tag: 'Nouveau · Mise aux normes' },
                      ].map((b) => (
                        <li key={b.name} className="flex items-center justify-between py-3 group hover:bg-white/[0.02] -mx-3 px-3 rounded-xl transition-colors">
                          <div className="flex items-baseline gap-3 min-w-0">
                            <span className="font-serif font-bold text-base">{b.name}</span>
                            <span className="text-[10px] uppercase tracking-widest text-blue-300/70 font-bold truncate">{b.tag}</span>
                          </div>
                          <span className="font-mono text-sm text-blue-200 whitespace-nowrap">
                            <span className="text-white font-bold">{b.price}</span> <span className="text-blue-300/60 text-[10px]">FCFA</span>
                          </span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => navigateTo('offres')}
                      className="group bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-50 active:scale-[0.98] transition-all shadow-2xl flex items-center gap-2"
                    >
                      Découvrir les offres
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>

                  {/* Carte stats / preuve sociale */}
                  <div className="lg:col-span-5 hidden lg:block">
                    <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
                      <div className="flex items-center justify-between mb-8">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-300">Ils nous ont fait confiance</span>
                        <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>

                      <div className="space-y-6">
                        <div className="pb-6 border-b border-white/10">
                          <p className="font-serif italic text-blue-50 leading-relaxed mb-4">
                            « J'ai bénéficié du programme de renforcement de compétences. Cela m'a permis de développer un réseau académique solide qui m'a aidé à décrocher mon poste chez TOTAL EP. »
                          </p>
                          <p className="text-sm font-bold text-white">Perrin Letembet</p>
                          <p className="text-xs text-blue-300/80">Ingénieur de Production · TOTAL EP CONGO</p>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <p className="font-serif italic text-3xl font-bold text-white">50+</p>
                            <p className="text-[9px] uppercase tracking-widest text-blue-300/80 font-bold mt-1">Chercheurs</p>
                          </div>
                          <div className="text-center border-x border-white/10">
                            <p className="font-serif italic text-3xl font-bold text-white">15</p>
                            <p className="text-[9px] uppercase tracking-widest text-blue-300/80 font-bold mt-1">Publications</p>
                          </div>
                          <div className="text-center">
                            <p className="font-serif italic text-3xl font-bold text-white">6</p>
                            <p className="text-[9px] uppercase tracking-widest text-blue-300/80 font-bold mt-1">Années</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION CONFÉRENCES */}
            <section className="py-24 bg-slate-50 relative">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14 pb-8 border-b border-slate-200">
                  <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-full mb-5 shadow-sm">
                      <svg className="w-3.5 h-3.5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-700">Agenda Scientifique</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-[1.1]">
                      Prochains <span className="italic text-blue-700">Rendez-vous</span>
                    </h2>
                    <p className="text-slate-600 mt-4 max-w-xl leading-relaxed">
                      Conférences mensuelles, webinaires, ateliers. Inscription gratuite, places limitées.
                    </p>
                  </div>

                  <button
                    onClick={() => navigateTo('agenda')}
                    className="group bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg flex items-center gap-2 whitespace-nowrap"
                  >
                    Tout l'agenda
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>

                {upcomingConferences.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
                    <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-slate-500 font-medium">Aucune conférence programmée prochainement.</p>
                    <p className="text-slate-400 text-sm mt-1">Revenez bientôt pour les prochains rendez-vous.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            <section className="py-24 bg-white border-t border-slate-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400">
                    Partenaires institutionnels & académiques
                  </span>
                </div>

                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                  {PARTNERS.map(partner => (
                    <div key={partner.name} className="group flex flex-col items-center gap-3 grayscale opacity-50 hover:opacity-100 hover:grayscale-0 transition-all duration-300">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center font-serif font-bold text-slate-400 border-2 border-slate-100 shadow-sm group-hover:border-blue-200 group-hover:shadow-md transition-all">
                        {partner.logo}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-700 transition-colors">
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
      <main id="main-content" tabIndex={-1} className="flex-grow focus:outline-none">{renderContent()}</main>
      <ChatAssistant />
      <Footer />
    </div>
  );
};

export default App;