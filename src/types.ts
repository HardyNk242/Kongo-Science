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
}

// --- OBJECTIFS (Vision) ---
export interface Objective {
  id: number; // Corrigé en number pour correspondre à constants.ts
  title: string;
  description: string;
  iconPath: string;
  linkTo?: string; // Permet le clic vers la bibliothèque
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
  domain: string; // ex: 'Géologie', 'Santé Publique', 'Histoire'
  type: string;   // ex: 'Thèse Doctorat', 'Article Scientifique', 'Livre / Guide'
  abstract: string;
  pages?: number | string; // Accepte "49" (number) ou "Vol 18, Art. 144" (string)
  pdfUrl: string; // Lien vers le fichier ou la référence
  isExclusive?: boolean; // Badge "Exclusif Kongo Science"
  isRestricted?: boolean; // Déclenche le bouton "Demande de copie privée"
  // --- NOUVEAUX CHAMPS POUR LA VENTE ---
  isForSale?: boolean;    // Si vrai, affiche le bouton "Acheter"
  purchaseUrl?: string;   // Lien Amazon/Editeur
  price?: string;         // Ex: "3.66 €"
}
