
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
