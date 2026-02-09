import React, { useState } from 'react';

// --- TYPES ---
type ProgramType = 'hub' | 'offers' | 'sig';

interface DetailContent {
  title: string;
  fullDesc: string;
  points: string[];
  image: string;
  tools?: string[];
}

interface Props {
  forceView?: 'offers' | 'sig'; // Pour les liens directs (Marketing)
}

const ProgramsView: React.FC<Props> = ({ forceView }) => {
  // Si on reçoit "forceView" (ex: via le lien WhatsApp), on l'utilise, sinon on affiche le Hub
  const [activeView, setActiveView] = useState<ProgramType>(forceView || 'hub');
  const [selectedDetail, setSelectedDetail] = useState<DetailContent | null>(null);

  // ==========================================
  // 1. DONNÉES (NOUVELLES OFFRES 2026)
  // ==========================================
  const bouquets = [
    {
      id: 'express',
      title: 'STRATÉGIE EXPRESS',
      subtitle: 'Session Unique',
      price: '30 000 FCFA',
      idealFor: 'Débloquer une situation précise ou valider une orientation.',
      format: '1 Session intensive (Visioconférence)',
      inclus: [
        'Diagnostic complet de l\'état d\'avancement',
        'Discussion approfondie sur le projet',
        'Recommandations stratégiques immédiates',
        'Feuille de route pour les prochaines étapes'
      ]
    },
    {
      id: 'standard',
      title: 'STANDARD',
      subtitle: 'Le Mentorat',
      price: '65 000 FCFA',
      idealFor: 'L\'étudiant en Master ou Doctorat qui veut un guide fiable.',
      format: 'Suivi régulier (Pack de sessions)',
      inclus: [
        'Accompagnement méthodologique structuré',
        'Relecture critique des chapitres',
        'Préparation aux présentations',
        'Support moral via WhatsApp/Email jusqu\'à la soutenance'
      ]
    },
    {
      id: 'premium',
      title: 'PREMIUM',
      subtitle: 'L\'Accélérateur de Carrière',
      price: '150 000 FCFA',
      isBestSeller: true,
      idealFor: 'Le chercheur visant une carrière internationale d\'excellence.',
      inclus: [
        'Tout le bouquet Standard',
        'Programme PACC (Modules 1 à 6)',
        'Accès aux formations Live du samedi',
        'Maîtrise outils modernes (IA, Zotéro, Illustrator)'
      ]
    },
    {
      id: 'publication',
      title: 'PUBLICATION INTERNATIONALE',
      price: '150 000 FCFA',
      idealFor: 'Chercheurs avec résultats prêts mais bloqués à la rédaction.',
      goal: 'Transformer vos données en un article publiable.',
      inclus: [
        'Restructuration manuscrit (IMRAD)',
        'Amélioration du style et anglais scientifique',
        'Optimisation des figures et tableaux',
        'Sélection journaux cibles et aide soumission'
      ]
    },
    {
      id: 'finisher',
      title: 'FINISHER',
      subtitle: 'Relecture & Mise aux Normes',
      price: '100 000 FCFA',
      isNew: true,
      idealFor: 'Un manuscrit "Zéro Défaut" avant le dépôt final.',
      note: 'Volume : Jusqu\'à 65 pages standard.',
      inclus: [
        'Correction orthographe, grammaire, syntaxe',
        'Mise en forme stricte (Charte Université)',
        'Uniformisation références (APA, ISO, etc.)',
        'Table des matières & Listes automatiques'
      ]
    }
  ];

  const paccModulesSimple = [
    { id: 1, title: 'Démarrer son projet & Philosophie des sciences' },
    { id: 2, title: 'L\'art de la Revue Bibliographique & Maîtrise de Zotéro' },
    { id: 3, title: 'Techniques de rédaction scientifique & Protocoles rigoureux' },
    { id: 4, title: 'Outils Numériques : Word, Google Docs & Adobe Illustrator' },
    { id: 5, title: 'Communication : Pitch, PowerPoint & Recherche de financement' },
    { id: 6, title: 'Carrière : Rédaction d\'article, CV Scientifique & Networking' }
  ];

  const testimonials = [
    {
      name: 'Perrin LETEMBET',
      role: 'Ingénieur de Production (TOTAL EP CONGO)',
      text: "J'ai bénéficié du programme de renforcement de compétences avec Kongo Science. Cela m'a permis de développer un réseau académique solide qui m'a aidé à décrocher mon poste chez TOTAL EP."
    },
    {
      name: 'Gabriella Jesnaure BOUKOU',
      role: 'PNUD (Promotion 2017)',
      text: "Suivie dans le cadre de mon Master en Biologie, j'ai pu publier mon premier article scientifique grâce à Kongo Science et trouver un emploi au PNUD."
    }
  ];

  // ==========================================
  // 2. DONNÉES (ANCIEN SIG - CONSERVÉ)
  // ==========================================
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

  // ==========================================
  // 3. SOUS-COMPOSANTS (VUES)
  // ==========================================

  // --- A. HUB (L'ACCUEIL AVEC LES 2 CARTES) ---
  const HubView = () => (
    <div className="max-w-7xl mx-auto px-6 py-20 animate-in fade-in zoom-in-95 duration-700">
      <div className="text-center mb-16">
        <span className="text-blue-700 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Académie Kongo Science</span>
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-6 italic">Nos Programmes de Formation</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
          Choisissez votre parcours : l'excellence académique (PACC) ou la maîtrise technologique (SIG).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* CARTE 1 : PACC (Mène vers les OFFRES 2026) */}
        <button 
          onClick={() => setActiveView('offers')}
          className="group relative bg-slate-900 rounded-[3.5rem] p-12 text-left overflow-hidden transition-all hover:scale-[1.02] shadow-xl hover:shadow-blue-900/20"
        >
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:rotate-6 transition-transform">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <h2 className="text-3xl font-serif font-bold text-white mb-4 italic">Programme PACC</h2>
              <p className="text-blue-200/70 text-sm leading-relaxed mb-8 max-w-xs">
                Accédez à nos 5 bouquets d'accompagnement 2026. Du mentorat au dépôt de thèse "Zéro Défaut".
              </p>
            </div>
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest">
              Voir les Offres 2026
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </div>
          </div>
          <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
              <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="PACC" />
          </div>
        </button>

        {/* CARTE 2 : SIG (Mène vers le SIG classique) */}
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
              Explorer les formations SIG
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </div>
          </div>
          <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
              <img src="https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="SIG" />
          </div>
        </button>
      </div>
    </div>
  );

  // --- B. OFFRES 2026 (LE CONTENU DU PACC MODERNE) ---
  const OffersView = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Navigation Retour */}
        <button onClick={() => setActiveView('hub')} className="mb-8 flex items-center gap-2 text-blue-600 hover:text-slate-900 transition-colors text-xs font-bold uppercase tracking-widest">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Retour à l'accueil des programmes
        </button>

        {/* Hero Section */}
        <div className="text-center mb-24">
          <span className="text-blue-700 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Excellence 2026</span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-6 italic leading-tight">
            Offres d'Accompagnement <br /> Kongo Science
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Éveiller l'esprit scientifique, propulser les chercheurs africains. Une approche holistique pour transformer vos travaux en standards internationaux.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {bouquets.map((b) => (
            <div 
              key={b.id} 
              className={`relative bg-white border ${b.isBestSeller ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'} p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group flex flex-col h-full`}
            >
              {b.isBestSeller && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                  Best-Seller 🔥
                </div>
              )}
              {b.isNew && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                  Nouveau ✨
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-blue-700 transition-colors uppercase tracking-tight">{b.title}</h3>
                {b.subtitle && <p className="text-blue-600 font-bold text-xs uppercase tracking-widest">{b.subtitle}</p>}
              </div>

              <div className="mb-8">
                <span className="text-4xl font-serif font-bold text-slate-900 italic">{b.price}</span>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl mb-8 flex-grow">
                 <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter mb-2">Idéal pour :</p>
                 <p className="text-sm text-slate-700 leading-relaxed italic">"{b.idealFor}"</p>
                 {b.note && <p className="mt-2 text-[10px] text-blue-600 font-bold uppercase">{b.note}</p>}
                 {b.goal && <p className="mt-2 text-xs font-bold text-slate-900">Objectif : {b.goal}</p>}
              </div>

              <div className="space-y-4 mb-10">
                {b.inclus.map((item, i) => (
                  <div key={i} className="flex gap-3 text-sm text-slate-600 items-start">
                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    {item}
                  </div>
                ))}
              </div>

              <a 
                href="https://wa.me/242068347820" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 ${
                  b.isBestSeller 
                    ? 'bg-blue-700 text-white hover:bg-blue-800' 
                    : 'bg-slate-900 text-white hover:bg-blue-700'
                }`}
              >
                Réserver mon bouquet
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </a>
            </div>
          ))}
        </div>

        {/* PACC Focus Section */}
        <section className="bg-slate-50 rounded-[4rem] p-12 md:p-24 border border-slate-100 mb-32 relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-blue-700 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Le Cœur du Premium</span>
              <h2 className="text-4xl font-serif font-bold italic leading-tight mb-8 text-slate-900">Programme Avancé sur les Compétences du Chercheur (PACC)</h2>
              <p className="text-slate-600 leading-relaxed mb-10">
                Inclus dans le bouquet Premium, ce programme exclusif forme à l'utilisation de l'Intelligence Artificielle, de la gestion bibliographique et du design scientifique.
              </p>
              <div className="space-y-4">
                {paccModulesSimple.map(m => (
                  <div key={m.id} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-xs">{m.id}</div>
                    <p className="text-sm font-bold text-slate-800">{m.title}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
               <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl">
                  <h4 className="text-2xl font-serif font-bold italic mb-6">Objectifs PACC</h4>
                  <ul className="space-y-6">
                    <li className="flex gap-4">
                       <span className="text-blue-400 text-2xl">🚀</span>
                       <p className="text-slate-300 text-sm">Maîtrise des outils modernes : Zotéro, Illustrator, IA générative.</p>
                    </li>
                    <li className="flex gap-4">
                       <span className="text-blue-400 text-2xl">📈</span>
                       <p className="text-slate-300 text-sm">Augmenter la production scientifique individuelle et collective.</p>
                    </li>
                    <li className="flex gap-4">
                       <span className="text-blue-400 text-2xl">🌍</span>
                       <p className="text-slate-300 text-sm">Alignement total sur les standards de publication internationaux.</p>
                    </li>
                  </ul>
               </div>
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500 rounded-full blur-[80px] opacity-20"></div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold italic text-slate-900">Ils nous ont fait confiance</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white border border-slate-100 p-10 rounded-[3rem] shadow-sm relative italic">
                 <svg className="w-12 h-12 text-blue-100 absolute top-8 left-8" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 8.89543 14.017 10V13H11.017V10C11.017 7.23858 13.2556 5 16.017 5H19.017C21.7784 5 24.017 7.23858 24.017 10V15C24.017 18.3137 21.3307 21 18.017 21H14.017ZM0 15V10C0 7.23858 2.23858 5 5 5H8C10.7614 5 13 7.23858 13 10V15C13 18.3137 10.3137 21 7 21H3C1.89543 21 1 20.1046 1 19V16C1 14.8954 1.89543 14 3 14H6C6.55228 14 7 13.5523 7 13V10C7 9.44772 6.55228 9 6 9H3C1.89543 9 1 9.89543 1 11V14L0 15Z" /></svg>
                 <div className="relative z-10">
                   <p className="text-slate-600 mb-8 leading-relaxed text-lg">"{t.text}"</p>
                   <div>
                     <p className="text-slate-900 font-black text-sm uppercase tracking-widest">{t.name}</p>
                     <p className="text-blue-600 font-bold text-xs">{t.role}</p>
                   </div>
                 </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );

  // --- C. SIG DETAIL (L'ANCIENNE VUE SIG) ---
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

  // --- D. OVERLAY (POUR LES DÉTAILS SIG) ---
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

  // ==========================================
  // 4. RENDU PRINCIPAL
  // ==========================================
  return (
    <div className="bg-white min-h-screen pt-20">
      {activeView === 'hub' && <HubView />}
      {activeView === 'offers' && <OffersView />}
      {activeView === 'sig' && <SigDetailView />}
      
      {/* Modal pour les détails SIG */}
      <DetailOverlay />

      {/* Barre de Contact (Affichée sauf sur le Hub) */}
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