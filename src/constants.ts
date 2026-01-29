import { Article, NavItem, Conference } from './types';

// --- IMPORTS DES IMAGES (ASSETS) ---
// Conférences
import peatlandsCard from "./assets/conf-peatlands-conferencecard.png";
import petroleumCard from "./assets/conf-ingenierie-petroliere.png";
import geotechCard from "./assets/conf-risques-geotech.png";
import technoGeoCard from "./assets/conf-techno-geo.png";
import solKoutikaCard from "./assets/conf-sol-koutika.png";

// Équipe
import hardyImg from './assets/hardy.png';
// import princeImg from './assets/prince.jpg'; 

// --- DOMAINES OFFICIELS (Classification SCIMAGO) ---
// Utilisés pour les filtres et le formulaire de soumission
export const SCIMAGO_DOMAINS = [
  { value: "Earth and Planetary Sciences", label: "Sciences de la Terre & Planétaires" },
  { value: "Environmental Science", label: "Sciences de l'Environnement" },
  { value: "Agricultural and Biological Sciences", label: "Agriculture & Biologie" },
  { value: "Energy", label: "Énergie" },
  { value: "Engineering", label: "Ingénierie" },
  { value: "Social Sciences", label: "Sciences Sociales" },
  { value: "Economics, Econometrics and Finance", label: "Économie & Finance" },
  { value: "Business, Management and Accounting", label: "Business & Management" },
  { value: "Medicine", label: "Médecine & Santé" },
  { value: "Immunology and Microbiology", label: "Immunologie & Microbiologie" },
  { value: "Biochemistry, Genetics and Molecular Biology", label: "Biochimie & Génétique" },
  { value: "Computer Science", label: "Informatique" },
  { value: "Mathematics", label: "Mathématiques" },
  { value: "Physics and Astronomy", label: "Physique & Astronomie" },
  { value: "Chemistry", label: "Chimie" },
  { value: "Arts and Humanities", label: "Arts & Humanités" },
  { value: "Multidisciplinary", label: "Multidisciplinaire" }
].sort((a, b) => a.label.localeCompare(b.label)); // Trié par ordre alphabétique Français

// --- NAVIGATION ---
export const NAV_ITEMS: NavItem[] = [
  { label: 'Accueil', path: 'home' },
  { label: 'Bibliothèque', path: 'library' },
  { label: 'Agenda', path: 'agenda' },
  { label: 'Programmes', path: 'programmes' },
  { label: 'Historique', path: 'history' },
  { label: 'Équipe', path: 'team' },
  { label: 'À Propos', path: 'about' }
];

// --- OBJECTIFS / VISION ---
export const OBJECTIFS = [
  {
    id: 1,
    title: "Mémoire & Souveraineté Numérique",
    description: "Centraliser et immortaliser la production scientifique congolaise (Thèses, Mémoires) via une bibliothèque numérique indexée aux standards internationaux (Zenodo/DOI), rendant notre savoir accessible et visible mondialement.",
    iconPath: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    linkTo: 'library'
  },
  {
    id: 2,
    title: "Incubateur d'Élite Scientifique",
    description: "Transformer le potentiel des chercheurs locaux par un mentorat de haut niveau ('Brain Gain') assuré par la diaspora. Nous ne visons pas seulement la publication, mais l'impact facteur et l'excellence méthodologique.",
    iconPath: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
  },
  {
    id: 3,
    title: "Expertise Stratégique & Développement",
    description: "Devenir le partenaire technique incontournable pour l'État et les industries. Transformer les données de recherche (géologie, santé, environnement) en solutions concrètes pour le développement national.",
    iconPath: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
  }
];

// --- CONFÉRENCES ---
export const CONFERENCES: (Conference & { imageUrl: string })[] = [
  {
    id: 'conf-peatlands',
    title: 'Tourbières du Congo : mémoire climatique et enjeux de protection',
    description: 'Présentation scientifique basée sur une étude publiée dans Palaeogeography (2025) par Henrique Gloire Lungela Tchimpa, doctorant à l\'Université Marien Ngouabi.',
    date: '2026-01-13',
    replayUrl: 'https://www.youtube.com/watch?v=7PQs6Kbol_8',
    time: '21:00',
    day: '13',
    month: 'JAN',
    location: 'En ligne (Zoom)',
    type: 'Webinaire',
    organizer: 'Kongo Science',
    imageUrl: peatlandsCard
  },
  {
    id: 'conf-ingenierie-petroliere',
    title: 'Les métiers de l\'ingénierie pétrolière face aux défis de la transition énergétique',
    description: 'Conférence animée par Japhet MAVOUNGOU, de 20h00 à 21h00 (heure de Brazzaville).',
    date: '2026-01-28',
    replayUrl:'https://www.youtube.com/watch?v=9N9SuiV9Cf8',
    time: '20:00',
    day: '28',
    month: 'JAN',
    location: 'Brazzaville (heure locale)',
    type: 'Webinaire',
    organizer: 'Kongo Science',
    imageUrl: petroleumCard
  },
  {
    id: 'conf-risques-geotechniques',
    title: 'Gestion des risques géotechniques pour les infrastructures linéaires',
    description: 'Caractérisation & amélioration des sols pour les infrastructures de transport en milieu tropical. Présenté par Yves Ngoma (Doctorant FST, Univ. Marien Ngouabi).',
    date: '2026-02-08',
    time: '19:30',
    day: '08',
    month: 'FEV',
    location: 'Brazzaville (heure locale)',
    type: 'Webinaire',
    organizer: 'Kongo Science',
    imageUrl: geotechCard
  },
  {
    id: 'conf-atlas-fluvial',
    title: 'Atlas fluvial du bassin du Congo : cartographie dynamique et crues extremes',
    description: 'Lecture scientifique sur les nouvelles donnees hydrographiques et leur impact sur la planification territoriale.',
    date: '2024-09-22',
    replayUrl: 'https://www.youtube.com/watch?v=1a2b3c4d5e6',
    time: '18:00',
    day: '22',
    month: 'SEP',
    location: 'Brazzaville (heure locale)',
    type: 'Hybride',
    organizer: 'Kongo Science',
    imageUrl: peatlandsCard
  },
  {
    id: 'conf-technologies-geographiques',
    title: 'Les technologies géospatiales au service du développement',
    description: 'Une conférence de Nicy Bazebizonza (Doctorant en Géologie & Cartographe à l\'IGN). Exploration de l\'impact de la géomatique et des SIG sur la planification et le développement.',
    date: '2026-02-14',
    time: '20:30',
    day: '14',
    month: 'FEV',
    location: 'Brazzaville (heure locale)',
    type: 'Webinaire',
    organizer: 'Kongo Science',
    imageUrl: technoGeoCard
  },
  {
    id: 'conf-sol-koutika',
    title: 'Le Sol : Fondement invisible de la sécurité alimentaire et du développement durable',
    description: 'Keynote par Dr. Lydie-Stella Koutika (Prix Glinka FAO, Prix Kwame Nkrumah UA, Auteure GIEC). Une intervention de haut niveau sur le rôle vital des sols.',
    date: '2026-03-02',
    time: '14:00',
    day: '02',
    month: 'MAR',
    location: 'Brazzaville (heure locale)',
    type: 'Webinaire',
    organizer: 'Kongo Science',
    imageUrl: solKoutikaCard
  }
];

// --- ARTICLES ---
export const ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'Impact des érosions à Brazzaville : Cas des quartiers Mfilou et Jacques Opangault',
    excerpt: 'Une étude géologique approfondie sur les mécanismes de dégradation des sols urbains et les solutions de stabilisation durable.',
    category: 'Géosciences',
    author: 'Dr. Hardy Nkodia',
    date: 'Oct 2024',
    imageUrl: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'art-2',
    title: 'Géomatique et Santé : Cartographie prédictive des zones à risque COVID-19',
    excerpt: 'Collaboration avec la Fondation Ntoumi pour l\'utilisation du SIG dans la gestion des crises sanitaires en République du Congo.',
    category: 'Santé Publique',
    author: 'Dr. Nicy Bazebizonza',
    date: 'Jan 2025',
    imageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=800'
  }
];

// --- PARTENAIRES ---
export const PARTNERS = [
  { name: 'FCRM', logo: 'FCRM' },
  { name: 'IGN', logo: 'IGN' },
  { name: 'MRAC Tervuren', logo: 'MRAC' },
  { name: 'Univ. Marien Ngouabi', logo: 'UMNG' },
  { name: 'Luzabu Group', logo: 'LG' }
];

// --- PAYS (Formulaires) ---
export const COUNTRIES = [
  {name: 'Congo, Republic of', code: 'CG'},
  {name: 'Congo, Democratic Republic of', code: 'CD'},
  {name: 'Angola', code: 'AO'},
  {name: 'Gabon', code: 'GA'},
  {name: 'Cameroon', code: 'CM'},
  {name: 'France', code: 'FR'},
  {name: 'Belgium', code: 'BE'},
  {name: 'Canada', code: 'CA'},
  {name: 'United States', code: 'US'}
];

// --- LOGIQUE DE PROPOSITION ---
export const PROPOSAL_PSYCHOLOGY = {
  main_promise: "Kongo Science transforme un événement en référence scientifique.",
  strategic_question: "À la fin de cette conférence, qu’est-ce que vous voulez que les participants disent de vous ?",
  formats: {
    "Recherche scientifique": {
      want: "Sérieux, citabilité et respect académique.",
      promise: "Une intervention scientifiquement défendable, référencée et alignée avec les standards internationaux."
    },
    "Formation académique": {
      want: "Montée en niveau et avantage compétitif.",
      promise: "Une formation qui transforme la compréhension en compétence réelle."
    },
    "Atelier technique": {
      want: "Savoir-faire et résultat immédiat.",
      promise: "À la fin, les participants repartent avec quelque chose de concret."
    },
    "Séminaire professionnel": {
      want: "Clarté stratégique et vision.",
      promise: "Des idées exploitables dès le lendemain."
    },
    "Colloque scientifique": {
      want: "Statut, réseau et trace durable.",
      promise: "Un événement qui laisse une trace scientifique et institutionnelle."
    }
  }
};

// --- BIBLIOTHÈQUE (THÈSES) ---
export const THESES_LIBRARY = [
  {
    id: 'th-hardy-2017',
    title: "Style structural et tectonique de la Formation de l'Inkisi",
    author: "Hardy M. D.-V. Nkodia",
    year: "2017",
    institution: "Université Marien Ngouabi (FST)",
    domain: "Earth and Planetary Sciences", // Migré vers Scimago
    type: "Mémoire Master",
    abstract: "Cette étude démontre que la Formation de l’Inkisi en République du Congo a été affectée par deux phases de tectonique décrochante associées chacune à une transpression. Lesquelles ont engendré deux systèmes de fracturation qui ont permis de déterminer les paléocontraintes...",
    pages: 68,
    isExclusive: true,
    pdfUrl: "https://zenodo.org/records/18408747/files/Master_thesis_25_07_2017_%20H_NKODIA.pdf?download=1"
  },
  {
    id: 'th-mouellet-2019',
    title: "Implication des bactéries du genre Bacillus dans la bioconversion du jus de gingembre",
    author: "Rodd Jurah Mouellet Maboulou",
    year: "2019",
    institution: "Université Marien Ngouabi (FST)",
    domain: "Agricultural and Biological Sciences", // Migré vers Scimago
    type: "Mémoire de Master",
    abstract: "Ce travail de recherche examine le potentiel des souches bactériennes du genre Bacillus pour la fermentation et la bioconversion du jus de gingembre...",
    pages: 49,
    isExclusive: false, 
    pdfUrl: "https://www.researchgate.net/profile/Aime-Christian-Kayath/publication/348153985..."
  },
  {
    id: 'bk-georisques-2024',
    title: "L'Afrique centrale face aux géorisques - Origine naturelle",
    author: "Camille François, J.M. Akame, Nicy Bazebizonza et al.",
    year: "2024",
    institution: "UNESCO / MRAC / GeoRiskA",
    domain: "Earth and Planetary Sciences", // Migré vers Scimago
    type: "Livre / Guide",
    abstract: "Publié par l'UNESCO et le MRAC, cet ouvrage de référence analyse les risques géologiques majeurs en Afrique centrale...",
    pages: "Multiple",
    isExclusive: false,
    pdfUrl: "https://www.researchgate.net/profile/Camille-Francois-2/publication/387662450..."
  },
  {
    id: 'art-nkodia-2022-seismo',
    title: "Seismogenic Fault Reactivation in Western Central Africa",
    author: "Hardy M. Nkodia, Nicy Bazebizonza, Damien Delvaux et al.",
    year: "2022",
    institution: "AGU Geochemistry, Geophysics, Geosystems",
    domain: "Earth and Planetary Sciences", // Migré vers Scimago
    type: "Article Scientifique",
    abstract: "Cette étude majeure analyse le potentiel sismogène des failles en Afrique centrale...",
    pages: 23,
    isExclusive: false,
    pdfUrl: "https://agupubs.onlinelibrary.wiley.com/doi/epdf/10.1029/2022GC010377"
  },
  {
    id: 'art-nkodia-2020-flower',
    title: "Flower structures in sandstones of the Paleozoic Inkisi Group",
    author: "Hardy M. Nkodia, T. Miyouna, Damien Delvaux et al.",
    year: "2020",
    institution: "South African Journal of Geology",
    domain: "Earth and Planetary Sciences", // Migré vers Scimago
    type: "Article Scientifique",
    abstract: "Cette étude décrit pour la première fois les structures en fleur ('flower structures') dans les grès du groupe de l'Inkisi...",
    pages: 20,
    isExclusive: false,
    pdfUrl: "https://www.researchgate.net/profile/Hardy-Medry-Dieu-Veil-Nkodia/publication/346398097..."
  },
  {
    id: 'art-bazebizonza-2020-neotect',
    title: "Detection of Neotectonic Signatures by Morphometric Analysis",
    author: "Nicy C. Bazebizonza, Hardy M. Nkodia, T. Miyouna et al.",
    year: "2020",
    institution: "Journal of Geosciences and Geomatics",
    domain: "Earth and Planetary Sciences", // Migré vers Scimago
    type: "Article Scientifique",
    abstract: "Cette étude utilise l'analyse morphométrique et les SIG pour détecter des signatures néotectoniques...",
    pages: 11,
    isExclusive: false,
    pdfUrl: "https://www.researchgate.net/profile/Nicy-Carmel-Bazebizonza/publication/344635627..."
  },
  {
    id: 'art-okouakoua-2024-bacillus',
    title: "Involvement of the Bacillus SecYEG Pathway in Biosurfactant Production",
    author: "F. Y. Okouakoua, C. A. Kayath, E. Nguimbi et al.",
    year: "2024",
    institution: "Wiley / Université Marien Ngouabi",
    domain: "Biochemistry, Genetics and Molecular Biology", // Migré vers Scimago
    type: "Article Scientifique",
    abstract: "Cette étude explore le rôle du système de transport membranaire SecYEG chez les bactéries Bacillus...",
    pages: 12,
    isExclusive: false,
    pdfUrl: "https://onlinelibrary.wiley.com/doi/epdf/10.1155/2024/6627190"
  },
  {
    id: 'art-nganga-2025-origines-kongo',
    title: "De la terre de Canaan au fleuve Congo : origines du peuple Kongo",
    author: "Arsène Francœur Nganga",
    year: "2025",
    institution: "Revue Congolaise d'Histoire (MAZAYU) - UMNG",
    domain: "Arts and Humanities", // Migré vers Scimago
    type: "Article Scientifique",
    abstract: "Cet article fondamental reconstruit la migration plurimillénaire du peuple Kongo depuis l'Israël antique...",
    pages: 20,
    isExclusive: true, 
    pdfUrl: "https://drive.google.com/file/d/1dHCIWGSfophBuEcLCK9tT8-QyplARkT2/view?usp=drive_link"
  },
  {
    id: 'art-mavoungou-2025-bikelele',
    title: "Petrology and geochemistry of the metamorphic rocks from the Bikélélé area",
    author: "Yarsé B. Mavoungou, Hardy M. Nkodia, N. Watha-Ndoudy et al.",
    year: "2025",
    institution: "Arabian Journal of Geosciences",
    domain: "Earth and Planetary Sciences", // Migré vers Scimago
    type: "Article Scientifique",
    abstract: "Cette étude présente les données pétrographiques et géochimiques des roches métamorphiques...",
    pages: "Vol 18, Art. 144",
    isRestricted: true,
    isExclusive: true,
    pdfUrl: "https://drive.google.com/file/d/1QliljB9o6unoIMtKXvEJgWq9DrpUA8cX/view?usp=drive_link"
  },
  {
    id: 'bk-nkodia-2023-revue',
    title: "Maitriser l'Art de la Revue Bibliographique: Guide Pratique",
    author: "Hardy Nkodia",
    year: "2023",
    institution: "Kongo Science (Éditions)",
    domain: "Multidisciplinary", // Migré vers Scimago
    type: "Livre / Guide Pratique",
    abstract: "Avez-vous du mal à organiser vos documents et à extraire les données pour réaliser une revue pertinente...",
    pages: "89 pages",
    isForSale: true,
    price: "3.66 € (Kindle) / 12.00 € (Broché)",
    purchaseUrl: "https://www.amazon.fr/Maitriser-lArt-Revue-Bibliographique-Pratique-ebook/dp/B0CG2B65WP",
    pdfUrl: ""
  },
  {
    id: 'bk-kinouani-2025-therapeutique',
    title: "Repenser la thérapeutique: Un point de vue heuristique",
    author: "Duchel Kinouani",
    year: "2025",
    institution: "Upway Books",
    domain: "Medicine", // Migré vers Scimago
    type: "Livre / Essai",
    abstract: "Notre compréhension du vivant a atteint des sommets, pourtant la médecine contemporaine peine...",
    pages: "300 pages",
    isForSale: true,
    price: "48.98 €",
    purchaseUrl: "https://www.amazon.fr/Repenser-th%C3%A9rapeutique-heuristique-th%C3%A9rapeutiques-dynamiques/dp/1917916647",
    pdfUrl: ""
  },
];

// --- ÉQUIPE (TEAM) ---
export const TEAM = [
  {
    id: 'hardy',
    name: "Dr. Hardy Nkodia",
    role: "Président du bureau exécutif",
    image: hardyImg,
  },
];
