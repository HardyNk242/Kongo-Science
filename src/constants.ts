import { NavItem, Conference } from './types';

// --- IMPORTS DES IMAGES (ASSETS) ---
import peatlandsCard from "./assets/conf-peatlands-conferencecard.png";
import petroleumCard from "./assets/conf-ingenierie-petroliere.png";
import geotechCard from "./assets/conf-risques-geotech.png";
import technoGeoCard from "./assets/conf-techno-geo.png";
import solKoutikaCard from "./assets/conf-sol-koutika.png";
import eauPotableCard from './assets/conf-eau-potable.jpg'; // Adaptez le chemin et le nom du fichier

// Équipe
import hardyImg from './assets/hardy.png';

// --- DOMAINES OFFICIELS (Classification SCIMAGO) ---
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
].sort((a, b) => a.label.localeCompare(b.label));

// --- NAVIGATION (REFONDUE) ---
export const NAV_ITEMS: NavItem[] = [
  { label: 'Accueil', path: 'home' },
  { label: 'Bibliothèque', path: 'library' },
  { label: 'Actualité', path: 'publications' }, // Nouvelle page
  { label: 'Programmes', path: 'programmes' },
  { 
    label: 'À Propos', 
    path: 'about',
    submenu: [ // Nouveau sous-menu
      { label: 'Notre Histoire', path: 'history' },
      { label: 'Notre Équipe', path: 'team' },
      { label: 'Agenda', path: 'agenda' }
    ]
  }
];

// --- OBJECTIFS ---
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
    id: 'conf-eau-potable',
    title: 'De la source au robinet : sécuriser l’accès à l’eau potable face aux risques sanitaires',
    description: 'Une expertise sur le génie des eaux et l\'environnement avec le Dr Gilver Mendel KOMBO (PhD, MSc, M.ing), chercheur à l\'École de Technologie Supérieure (ETS), Université du Québec.',
    date: '2026-02-24',
    replayUrl: 'https://youtu.be/Qe6MNant8LA',
    time: '20:00',
    day: '24',
    month: 'FÉV',
    location: 'En ligne',
    type: 'Webinaire',
    organizer: 'Kongo Science',
    imageUrl: eauPotableCard, // Pensez à importer l'image en haut du fichier : import eauPotableCard from './assets/1000462933.jpg';
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
    replayUrl: 'https://youtu.be/XxPdm_BEuUI',
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
    date: '2026-02-21',
    time: '20:30',
    day: '21',
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

// --- PARTENAIRES ---
export const PARTNERS = [
  { name: 'FCRM', logo: 'FCRM' },
  { name: 'IGN', logo: 'IGN' },
  { name: 'MRAC Tervuren', logo: 'MRAC' },
  { name: 'Univ. Marien Ngouabi', logo: 'UMNG' },
  { name: 'Luzabu Group', logo: 'LG' }
];

// --- PAYS ---
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

// --- LOGIQUE PROPOSITION ---
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

// --- ÉQUIPE (TEAM) ---
export const TEAM = [
  {
    id: 'hardy',
    name: "Dr. Hardy Nkodia",
    role: "Président du bureau exécutif",
    image: hardyImg,
  },
];
