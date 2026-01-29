import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ConferenceCard from './components/ConferenceCard';
import LibraryView from './components/LibraryView';
import ConferencesView from './components/ConferencesView';
import ArticleCard from './components/ArticleCard';
import RegistrationView from './components/RegistrationView';
import ProposalView from './components/ProposalView';
import ChatAssistant from './components/ChatAssistant';
import Footer from './components/Footer';
import HistoryView from './components/HistoryView';
import TeamView from './components/TeamView';
import ProgramsView from './components/ProgramsView';
import { OBJECTIFS, CONFERENCES, ARTICLES, PARTNERS } from './constants';
import { Conference } from './types';

const App: React.FC = () => {
  const [selectedConference, setSelectedConference] = useState<Conference | null>(null);
  const [currentPath, setCurrentPath] = useState('home');

  const upcomingConferences = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return CONFERENCES
      .filter((conf) => new Date(conf.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, []);

  // ✅ Parse hash robuste
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

  const renderContent = () => {
    switch (currentPath) {
      case 'history':
        return <HistoryView />;

      case 'team':
        return <TeamView />;

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
            <p className="mt-2 text-slate-500">
              Vérifie que l’URL contient un id valide.
            </p>
            <button
              onClick={() => navigateTo('home')}
              className="mt-4 text-blue-700 font-bold"
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
                    className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 group hover:shadow-xl hover:border-blue-100 transition-all duration-500 flex flex-col items-center text-center"
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
                  </div>
                ))}
              </div>
            </section>

            <section className="py-24 bg-white relative">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-blue-700 text-white rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-blue-700 font-black text-[10px] uppercase tracking-[0.2em]">
                        Agenda Scientifique
                      </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-tight">
                      Conférences en cours
                    </h2>
                    <p className="mt-4 text-slate-600 text-lg leading-relaxed">
                      Les sessions ouvertes à l'inscription et les prochains rendez-vous majeurs.
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => navigateTo('agenda')}
                      className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg"
                    >
                      Voir tout l'agenda
                    </button>
                    <button
                      onClick={() => navigateTo('proposal')}
                      className="bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-blue-800 transition-all shadow-lg shadow-blue-200"
                    >
                      Proposer une conférence
                    </button>
                  </div>
                </div>

                {upcomingConferences.length === 0 ? (
                  <div className="text-center text-slate-500 py-12">
                    Aucune conférence en cours pour le moment.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {upcomingConferences.map(conference => (
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

            <section className="py-24 bg-slate-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <span className="text-blue-700 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">
                    Savoir & Publication
                  </span>
                  <h2 className="text-4xl font-serif font-bold text-slate-900 italic">
                    Actualités Scientifiques
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {ARTICLES.map(article => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            </section>

            <section className="py-20 bg-white border-t border-slate-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* --- TITRE STYLISÉ AVEC LIGNES --- */}
                <div className="flex items-center justify-center gap-6 mb-16 opacity-60">
                   <div className="h-px bg-slate-300 w-12 md:w-32"></div>
                   <h3 className="text-xs md:text-sm font-black text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap">
                     Ils nous font confiance
                   </h3>
                   <div className="h-px bg-slate-300 w-12 md:w-32"></div>
                </div>
                {/* ---------------------------------- */}

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
