import { Article, NavItem, Objective, Conference } from './types';
import peatlandsCard from "./assets/conf-peatlands-conferencecard.png";
import petroleumCard from "./assets/conf-ingenierie-petroliere.png";

export const NAV_ITEMS: NavItem[] = [
  { label: 'Accueil', path: 'home' },
  { label: 'Agenda', path: 'agenda' },
  { label: 'Programmes', path: 'programmes' },
  { label: 'Historique', path: 'history' },
  { label: 'Équipe', path: 'team' },
  { label: 'À Propos', path: 'about' }
];

export const OBJECTIFS: Objective[] = [
  {
    id: 'renforcement-competences',
    title: 'Excellence & Production Académique',
    description: 'Renforcer les capacités des chercheurs africains pour propulser la production d\'articles scientifiques de 20% par an.',
    iconPath: 'M12 14l9-5-9-5-9 5 9 5zm0 0l9-5-9-5-9 5 9 5zm0 0v6m0-6L3 9m18 0l-9 5'
  },
  {
    id: 'acces-connaissance',
    title: 'Démocratisation du Savoir',
    description: 'Ouvrir des plateformes de conférences publiques d\'élite, garantissant un accès massif à la connaissance pour les universitaires.',
    iconPath: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
  },
  {
    id: 'developpement-science',
    title: 'Science & Impact Régional',
    description: 'Transformer les défis sociétaux en solutions durables par l\'application rigoureuse des approches scientifiques.',
    iconPath: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
];

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
    organizer: 'Univ. Marien Ngouabi',
    imageUrl: peatlandsCard
  },
  {
    id: 'conf-ingenierie-petroliere',
    title: 'Les métiers de l\'ingénierie pétrolière face aux défis de la transition énergétique',
    description: 'Conférence animée par Japhet MAVOUNGOU, de 20h00 à 21h00 (heure de Brazzaville).',
    date: '2026-01-28',
    time: '20:00',
    day: '28',
    month: 'JAN',
    location: 'Brazzaville (heure locale)',
    type: 'Webinaire',
    organizer: 'Japhet MAVOUNGOU',
    imageUrl: petroleumCard
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
    location: 'Brazzaville (Campus ENS)',
    type: 'Hybride',
    organizer: 'Laboratoire Hydrologie KS',
    imageUrl: peatlandsCard
  },
  {
    id: 'conf-technologies-geographiques',
    title: 'Les technologies geographiques au service du developpement',
    description: 'Conference animee par Nicy Bazebizonza, de 20h30 a 21h30 (heure de Brazzville).',
    date: '2026-02-07',
    time: '20:30',
    day: '07',
    month: 'FEV',
    location: 'En ligne (Zoom)',
    type: 'Webinaire',
    organizer: 'Institut Geographique du Congo',
    imageUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='
  }
];

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

export const PARTNERS = [
  { name: 'Fondation Ntoumi', logo: 'FN' },
  { name: 'IGN Congo', logo: 'IGN' },
  { name: 'FRMC', logo: 'FR' },
  { name: 'Univ. Marien Ngouabi', logo: 'UM' }
];

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
