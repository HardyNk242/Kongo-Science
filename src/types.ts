
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

export interface NavItem {
  label: string;
  path: string;
}

export interface Objective {
  id: string;
  title: string;
  description: string;
  iconPath: string;
}

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

export enum MessageRole {
  USER = 'user',
  MODEL = 'model'
}

export interface ChatMessage {
  role: MessageRole;
  text: string;
}

export interface Thesis {
  id: string;
  title: string;
  author: string;
  year: string;
  institution: string;
  domain: string; // ex: 'Géologie', 'Santé Publique', 'Environnement'
  type: 'Thèse Doctorat' | 'Mémoire Master' | 'Article' | 'Rapport';
  abstract: string;
  pages: number;
  pdfUrl?: string; // Lien vers le fichier (optionnel pour l'instant)
  isExclusive?: boolean; // Si c'est un document qu'on ne trouve que chez vous
}
