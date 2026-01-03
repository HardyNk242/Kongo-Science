
import React, { useState } from 'react';

type ProgramType = 'hub' | 'pacc' | 'sig';

interface DetailContent {
  title: string;
  fullDesc: string;
  points: string[];
  image: string;
  tools?: string[];
}

const ProgramsView: React.FC = () => {
  const [activeView, setActiveView] = useState<ProgramType>('hub');
  const [selectedDetail, setSelectedDetail] = useState<DetailContent | null>(null);

  const paccModules = [
    { 
      s: "S1", 
      title: "Démarrer son projet de recherche", 
      desc: "Fondations méthodologiques et épistémologie.",
      fullDesc: "Cette session initiale pose les bases de la pensée critique scientifique. Nous abordons la philosophie des sciences pour comprendre comment se construit un savoir rigoureux.",
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800",
      points: [
        "Philosophie des sciences et épistémologie",
        "Éveil de l'esprit scientifique critique",
        "Conception de protocoles de recherche solides",
        "Définition de la problématique et des hypothèses"
      ]
    },
    { 
      s: "S2", 
      title: "Revue Bibliographique & Zotero", 
      desc: "Maîtriser l'art de la synthèse documentaire numérique.",
      fullDesc: "Un chercheur doit savoir s'appuyer sur les travaux existants sans s'y perdre. Nous enseignons l'utilisation d'outils de gestion bibliographique automatisés.",
      image: "https://images.unsplash.com/photo-1507733593414-b230798365a4?auto=format&fit=crop&q=80&w=800",
      points: [
        "Techniques de recherche documentaire avancée",
        "Installation et configuration de Zotero",
        "Organisation de sa bibliothèque numérique",
        "Citations automatiques et bibliographies"
      ],
      tools: ["Zotero", "Google Scholar", "ResearchGate"]
    },
    { 
      s: "S3", 
      title: "Rédaction Scientifique", 
      desc: "Techniques de rédaction des différentes parties d'un document.",
      fullDesc: "Apprenez à structurer vos écrits selon les standards internationaux (IMRAD) pour maximiser vos chances de publication.",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800",
      points: [
        "Structure IMRAD (Introduction, Méthodes, Résultats, Discussion)",
        "Rédaction de l'Abstract et choix des mots-clés",
        "Style et clarté du discours scientifique",
        "Éthique de la publication et lutte contre le plagiat"
      ]
    },
    { 
      s: "S4", 
      title: "Outils Avancés & Design pro", 
      desc: "Dessin technique et mise en page académique.",
      fullDesc: "La forme est aussi importante que le fond. Nous formons les chercheurs aux outils de design pour produire des illustrations et des documents impeccables.",
      image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=800",
      points: [
        "Rédaction avancée avec WORD et Google Docs",
        "Dessiner et décalquer les images avec Adobe Illustrator",
        "Création de graphiques avec Excel",
        "Pitch de projet et présentations PowerPoint percutantes"
      ],
      tools: ["Word", "Excel", "Adobe Illustrator", "PowerPoint"]
    },
    { 
      s: "S5", 
      title: "Rédaction d'Article Scientifique", 
      desc: "Processus de publication et soumission.",
      fullDesc: "Le but ultime : voir son travail reconnu mondialement. Nous vous accompagnons dans le parcours complexe de la soumission en revue.",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800",
      points: [
        "Choix de la revue (Facteur d'impact)",
        "Gestion du Peer-Review (réponses aux relecteurs)",
        "Utilisation de l'IA pour l'aide à la rédaction",
        "Augmenter sa visibilité académique"
      ]
    },
    { 
      s: "S6", 
      title: "Réseautage & Financement", 
      desc: "Construction d'un réseau et recherche de fonds.",
      fullDesc: "La science est une aventure collective et coûteuse. Nous vous donnons les clés pour financer vos projets et collaborer à l'international.",
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800",
      points: [
        "Construction d'un réseau de scientifiques",
        "Techniques de recherche de financement",
        "Rédaction de CV scientifique professionnel",
        "Rédaction de lettres de motivation pour bourses"
      ]
    }
  ];

  const sigFormations = [
    { 
      title: "Initiation à QGIS", 
      status: "En ligne / Vidéos", 
      highlight: "Devenez un champion du SIG.",
      fullDesc: "Une immersion complète dans QGIS pour comprendre, analyser et visualiser les données spatiales. Crucial pour les télécoms, mines, et génie civil.",
      image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=800",
      points: [
        "Manipulation de données géographiques",
        "Conception de cartes professionnelles",
        "Analyse spatiale et géotraitements",
        "Gestion des systèmes de coordonnées"
      ],
      tools: ["QGIS"]
    },
    { 
      title: "Télédétection & SIG", 
      status: "À la demande", 
      highlight: "Analyse spectrale pour les Géosciences.",
      fullDesc: "Apprenez à interpréter les images satellites pour le suivi environnemental ou l'exploration minière.",
      image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800",
      points: [
        "Traitement d'images satellites",
        "Calcul d'indices de végétation et minéraux",
        "Classification supervisée et non supervisée",
        "Suivi temporel des changements (NDVI, etc.)"
      ]
    },
    { 
      title: "Google Earth Pro pour les Pros", 
      status: "À la demande", 
      highlight: "Analyse préliminaire de terrain.",
      fullDesc: "Utilisez Google Earth au-delà de la simple visualisation pour des analyses topographiques et historiques rapides.",
      image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800",
      points: [
        "Import/Export de données GPS",
        "Analyse historique de l'occupation du sol",
        "Profils altimétriques et mesures de surfaces",
        "Cartographie rapide pour rapports de terrain"
      ]
    },
    { 
      title: "HYDROSIG", 
      status: "À la demande", 
      highlight: "Études hydrologiques assistées par SIG.",
      fullDesc: "Réalisation d'études hydrologiques complexes : délimitation de bassins versants et réseaux hydrographiques.",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800",
      points: [
        "Délimitation automatique de bassins versants",
        "Analyse de l'écoulement des eaux",
        "Modélisation des risques d'inondation",
        "Gestion des ressources en eaux souterraines"
      ]
    },
    { 
      title: "Logiciel SURFER", 
      status: "À la demande", 
      highlight: "Modélisation 3D et interpolation.",
      fullDesc: "Maîtrisez la représentation de surfaces 3D pour la géologie et l'ingénierie.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
      points: [
        "Gridding et interpolation de données",
        "Création de cartes de contours (isovaleurs)",
        "Modélisation de terrains en 3D",
        "Calcul de volumes et de stocks"
      ]
    },
    { 
      title: "Base de Données SIG", 
      status: "À la demande", 
      highlight: "Gestion structurée spatiale.",
      fullDesc: "Conception et gestion de bases de données relationnelles pour stocker efficacement vos projets SIG.",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc48?auto=format&fit=crop&q=80&w=800",
      points: [
        "Architecture de base de données (PostGIS)",
        "Requêtes spatiales SQL",
        "Optimisation du stockage des données",
        "Intégrité et sécurité des données"
      ]
    }
  ];

  // --- SUB-COMPONENT: DETAIL OVERLAY ---
  const DetailOverlay = () => {
    if (!selectedDetail) return null;
    return (
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={() => setSelectedDetail(null)}></div>
        <div className="relative bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
           <div className="relative h-64 overflow-hidden">
              <img src={selectedDetail.image} alt={selectedDetail.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-blue-900/20 to-transparent"></div>
              <button onClick={() => setSelectedDetail(null)} className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-md transition-all">
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <div className="absolute bottom-8 left-10 right-10">
                 <h3 className="text-3xl font-serif font-bold text-white italic leading-tight">{selectedDetail.title}</h3>
              </div>
           </div>
           <div className="p-10">
              <p className="text-slate-600 mb-8 leading-relaxed italic">{selectedDetail.fullDesc}</p>
              <div className="space-y-4 mb-8">
                 <h4 className="text-xs font-black uppercase text-blue-700 tracking-widest">Au programme :</h4>
                 <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedDetail.points.map((p, i) => (
                      <li key={i} className="flex gap-3 text-sm text-slate-700 items-start">
                         <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                         {p}
                      </li>
                    ))}
                 </ul>
              </div>
              {selectedDetail.tools && (
                <div className="pt-8 border-t border-slate-100 flex flex-wrap gap-2">
                   {selectedDetail.tools.map(t => (
                     <span key={t} className="bg-slate-50 border border-slate-200 px-3 py-1 rounded-full text-[10px] font-bold text-slate-500 uppercase">{t}</span>
                   ))}
                </div>
              )}
           </div>
        </div>
      </div>
    );
  };

  // --- COMPONENT: HUB (MOSAÏQUE) ---
  const HubView = () => (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <span className="text-blue-700 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Académie Kongo Science</span>
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-6 italic">Nos Programmes de Formation</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
          Choisissez un programme pour développer vos compétences de chercheur ou maîtriser les outils géospatiaux de pointe.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <button 
          onClick={() => setActiveView('pacc')}
          className="group relative bg-slate-900 rounded-[3.5rem] p-12 text-left overflow-hidden transition-all hover:scale-[1.02] shadow-xl hover:shadow-blue-900/20"
        >
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:rotate-6 transition-transform">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <h2 className="text-3xl font-serif font-bold text-white mb-4 italic">Programme PACC</h2>
              <p className="text-blue-200/70 text-sm leading-relaxed mb-8 max-w-xs">
                Programme Avancé sur les Compétences du Chercheur. Renforcez vos capacités de rédaction, de recherche et de publication.
              </p>
            </div>
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest">
              Explorer le programme
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </div>
          </div>
          <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
             <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" />
          </div>
        </button>

        <button 
          onClick={() => setActiveView('sig')}
          className="group relative bg-white rounded-[3.5rem] p-12 text-left overflow-hidden border border-slate-200 transition-all hover:scale-[1.02] shadow-sm hover:shadow-xl"
        >
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-8 group-hover:rotate-6 transition-transform">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
              </div>
              <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4 italic">Devenir Champion SIG</h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-xs">
                Maîtrisez les Systèmes d'Information Géographique pour les mines, le pétrole, les télécoms et l'urbanisme.
              </p>
            </div>
            <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-widest">
              Explorer les formations
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </div>
          </div>
          <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
             <img src="https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" />
          </div>
        </button>
      </div>
    </div>
  );

  // --- COMPONENT: PACC DETAIL ---
  const PaccDetailView = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section className="bg-slate-900 py-24 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <button onClick={() => setActiveView('hub')} className="mb-8 flex items-center gap-2 text-blue-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Retour aux programmes
          </button>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold mb-8 italic">PACC : Programme Avancé Compétences Chercheurs</h1>
              <p className="text-slate-300 text-lg leading-relaxed mb-10">
                Nous proposons une approche holistique incluant la philosophie des sciences, l'IA et les outils de publication pour stimuler la production scientifique africaine.
              </p>
              <div className="flex gap-4">
                <div className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                  <span className="block text-2xl font-bold text-white">100 000 FCFA</span>
                  <span className="text-[10px] text-blue-400 uppercase font-black">Coût du programme</span>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                  <span className="block text-2xl font-bold text-white">+20%</span>
                  <span className="text-[10px] text-blue-400 uppercase font-black">Objectif Annuel</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block relative">
               <div className="w-full aspect-video rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" />
               </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
           <span className="text-blue-700 font-bold uppercase text-[10px] tracking-widest mb-4 block">Cliquez sur un module pour plus de détails</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paccModules.map((m, idx) => (
            <button 
              key={idx} 
              onClick={() => setSelectedDetail({title: `${m.s} : ${m.title}`, fullDesc: m.fullDesc, points: m.points, tools: m.tools, image: m.image})}
              className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-blue-500 hover:shadow-xl hover:scale-105 transition-all text-left group flex flex-col overflow-hidden"
            >
              <div className="h-48 w-full overflow-hidden relative">
                 <img src={m.image} alt={m.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                 <div className="absolute top-4 left-4 bg-blue-700 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-lg">
                    {m.s}
                 </div>
                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                 <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">{m.title}</h3>
                 <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">{m.desc}</p>
                 <span className="text-[10px] font-black uppercase text-blue-700 tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity mt-auto">Voir le détail du module +</span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );

  // --- COMPONENT: SIG DETAIL ---
  const SigDetailView = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section className="bg-blue-700 py-24 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <button onClick={() => setActiveView('hub')} className="mb-8 flex items-center gap-2 text-white/60 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Retour aux programmes
          </button>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-8 italic">Pôle SIG : Devenez un Expert</h1>
          <p className="text-blue-50 text-xl leading-relaxed max-w-3xl">
            Maîtrisez les outils de pointe (QGIS, SURFER, HYDROSIG) pour transformer vos données spatiales en décisions stratégiques.
          </p>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
           <span className="text-blue-700 font-bold uppercase text-[10px] tracking-widest mb-4 block">Cliquez sur une formation pour voir le contenu détaillé</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {sigFormations.map((f, idx) => (
             <button 
               key={idx} 
               onClick={() => setSelectedDetail({title: f.title, fullDesc: f.fullDesc, points: f.points, tools: f.tools, image: f.image})}
               className="bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:shadow-xl hover:border-blue-500 hover:scale-105 transition-all text-left group flex flex-col overflow-hidden"
             >
               <div className="h-52 w-full overflow-hidden relative">
                  <img src={f.image} alt={f.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4">
                     <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase text-blue-700 shadow-sm border border-blue-100">
                        {f.status}
                     </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
               </div>
               <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{f.title}</h3>
                  <p className="text-sm text-slate-500 italic mb-6 leading-relaxed line-clamp-2">{f.highlight}</p>
                  <span className="text-[10px] font-black uppercase text-blue-700 tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity mt-auto">Savoir plus sur la formation +</span>
               </div>
             </button>
           ))}
        </div>
      </section>
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      {activeView === 'hub' && HubView()}
      {activeView === 'pacc' && PaccDetailView()}
      {activeView === 'sig' && SigDetailView()}
      
      {/* Cards Overlay Modal */}
      <DetailOverlay />

      {/* Contact Bar */}
      {activeView !== 'hub' && (
        <section className="bg-slate-900 py-16 text-white">
          <div className="max-w-7xl mx-auto px-6 text-center">
             <h3 className="text-2xl font-serif italic mb-8">Prêt à booster votre carrière ?</h3>
             <div className="flex flex-col md:flex-row justify-center gap-8 text-sm opacity-70 font-bold tracking-widest">
                <span className="flex items-center gap-2 justify-center">
                   <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                   kongoscience25@gmail.com
                </span>
                <span className="flex items-center gap-2 justify-center">
                   <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                   +242 06 834 78 20
                </span>
             </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProgramsView;
