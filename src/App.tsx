import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ConferenceCard from './components/ConferenceCard';
import ArticleCard from './components/ArticleCard';
import RegistrationView from './components/RegistrationView';
import ProposalView from './components/ProposalView';
import ChatAssistant from './components/ChatAssistant';
import Footer from './components/Footer';
import HistoryView from './components/HistoryView';
import TeamView from './components/TeamView';
import ProgramsView from './components/ProgramsView';
import { OBJECTIFS, UPCOMING_CONFERENCES, ARTICLES, PARTNERS } from './constants';
import { Conference } from './types';

const App: React.FC = () => {
  const [selectedConference, setSelectedConference] = useState<Conference | null>(null);
  const [currentPath, setCurrentPath] = useState('home');
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      const path = hash.split('/')[0] || 'home';
      setCurrentPath(path);
      
      if (path === 'registration') {
        const id = hash.split('/')[1];
        if (id) {
          const conf = UPCOMING_CONFERENCES.find(c => c.id === id);
          if (conf) setSelectedConference(conf);
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    handlePopState();
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const close = () => setShowTooltip(false);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, []);

  const navigateTo = (path: string, conf?: Conference) => {
    if (conf) {
      setSelectedConference(conf);
      const fullPath = `${path}/${conf.id}`;
      setCurrentPath(path);
      window.location.hash = fullPath;
    } else {
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
      case 'proposal':
        return <ProposalView onBack={() => navigateTo('home')} />;
      case 'registration':
        return selectedConference ? (
          <RegistrationView 
            conference={selectedConference} 
            onBack={() => navigateTo('home')} 
          />
        ) : (
          <div className="py-32 text-center">
            <h2 className="text-2xl font-bold">Conférence non trouvée</h2>
            <button onClick={() => navigateTo('home')} className="mt-4 text-blue-700 font-bold">Retour à l'accueil</button>
          </div>
        );
      case 'home':
      default:
        return (
          <>
            <Hero onNavigate={navigateTo} />
            
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <span className="text-blue-700 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Notre Engagement</span>
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-4 tracking-tight italic">Vision Scientifique</h2>
                <div className="w-20 h-1.5 bg-blue-700 mx-auto rounded-full"></div>
                <p className="mt-8 text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
                  Kongo Science œuvre pour l'éveil de la conscience scientifique à travers des piliers stratégiques d'excellence souveraine.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {OBJECTIFS.map((objectif) => (
                  <div key={objectif.id} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 group hover:shadow-xl hover:border-blue-100 transition-all duration-500 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-700 mb-8 mx-auto group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={objectif.iconPath} />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-700 transition-colors">{objectif.title}</h3>
                    <p className="text-slate-600 leading-relaxed text-sm">{objectif.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="conferences-section" className="py-24 bg-white relative">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-blue-700 text-white rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-blue-700 font-black text-[10px] uppercase tracking-[0.2em]">Agenda Scientifique</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-tight">Prochains Rendez-vous</h2>
                  </div>

                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                    
                    <div className="relative inline-block">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowTooltip(!showTooltip);
                        }}
                        className="relative bg-white border border-slate-200 px-8 py-5 rounded-2xl flex items-center gap-4 hover:border-blue-400 transition-all hover:shadow-2xl hover:-translate-y-1 active:scale-95 group z-10"
                      >
                        <div className="w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:rotate-12 transition-transform">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-[7px] font-black uppercase text-blue-700 tracking-widest">Partager vos connaissances</span>
                            <span className="flex h-1.5 w-1.5 rounded-full bg-blue-600 animate-ping"></span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900">Proposer ma conférence</h4>
                        </div>
                      </button>

                      {showTooltip && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
                        >
                          <div
                            className="pointer-events-auto w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 animate-in fade-in zoom-in-95 duration-200"
                          >
                            <div className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-widest">
                              Types d’interventions
                            </div>

                            <ul className="text-sm text-slate-600 space-y-2">
                              <li>• Recherche scientifique</li>
                              <li>• Formation académique</li>
                              <li>• Atelier technique</li>
                              <li>• Séminaire professionnel</li>
                              <li>• Colloque scientifique</li>
                            </ul>

                            <button
                              onClick={() => {
                                navigateTo('proposal');
                                setShowTooltip(false);
                              }}
                              className="mt-4 w-full bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-blue-800 transition"
                            >
                              Soumettre une proposition
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {UPCOMING_CONFERENCES.map(conference => (
                    <ConferenceCard 
                      key={conference.id} 
                      conference={conference} 
                      onRegister={(conf) => navigateTo('registration', conf)}
                    />
                  ))}
                </div>
              </div>
            </section>

            <section className="py-24 bg-slate-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <span className="text-blue-700 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Savoir & Publication</span>
                  <h2 className="text-4xl font-serif font-bold text-slate-900 italic">Actualités Scientifiques</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {ARTICLES.map(article => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            </section>

            <section className="py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                  {PARTNERS.map(partner => (
                    <div key={partner.name} className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-400 border border-slate-200">{partner.logo}</div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{partner.name}</span>
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
      
      <main className="flex-grow">
        {renderContent()}
      </main>

      <ChatAssistant />
      <Footer />
    </div>
  );
};

export default App;