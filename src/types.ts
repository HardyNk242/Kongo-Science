// --- ARTICLES (Blog/News) ---
export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  imageUrl: string;
  content?: string;
}

// --- NAVIGATION ---
export interface NavItem {
  label: string;
  path: string;
  submenu?: NavItem[]; // NOUVEAU : Permet d'avoir des sous-menus
}

// --- OBJECTIFS (Vision) ---
export interface Objective {
  id: number;
  title: string;
  description: string;
  iconPath: string;
  linkTo?: string;
}

// --- CONFÉRENCES (Agenda) ---
export interface Conference {
  id: string;
  title: string;
  description: string;
  date: string; // Format YYYY-MM-DD
  replayUrl?: string;
  time: string; // Format HH:mm
  day: string;
  month: string;
  location: string;
  type: 'Webinaire' | 'Présentiel' | 'Hybride';
  organizer: string;
}

// --- BOURSES (NOUVEAU) ---
export interface Scholarship {
  id: string;
  title: string;
  provider: string;   // Ex: "Ambassade de France", "DAAD"
  deadline: string;   // Format YYYY-MM-DD pour le tri et le calcul d'urgence
  level: string;      // Ex: "Master", "Doctorat", "Post-Doc"
  description: string;
  link: string;       // Lien vers le formulaire de candidature
}

// --- CHATBOT ---
export enum MessageRole {
  USER = 'user',
  MODEL = 'model'
}

export interface ChatMessage {
  role: MessageRole;
  text: string;
}

// --- BIBLIOTHÈQUE (Thèses & Publications) ---
export interface Thesis {
  id: string;
  title: string;
  author: string;
  year: string;
  institution: string;
  domain: string;
  type: string;
  abstract: string;
  pages?: number | string;
  pdfUrl: string;
  isExclusive?: boolean;
  isRestricted?: boolean;
  // Champs E-commerce / Vente
  isForSale?: boolean;
  purchaseUrl?: string;
  price?: string;
}
