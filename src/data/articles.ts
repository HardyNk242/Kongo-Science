import { Article } from '../types';

// --- IMPORT DES IMAGES ---
import arseneImg from '../assets/arsenenganaloango.png';

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
    excerpt: "Collaboration avec la Fondation Ntoumi pour l'utilisation du SIG dans la gestion des crises sanitaires en République du Congo.",
    category: 'Santé Publique',
    author: 'Dr. Nicy Bazebizonza',
    date: 'Jan 2025',
    imageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'news-loango-suriname-2026',
    title: 'The Slave Trade in Loango Coast for the Colony of Surinam',
    excerpt: "Une enquête historique majeure révèle les connexions oubliées entre l'Afrique Centrale et l'Amérique du Sud.",
    category: 'History & Books',
    author: 'Par La Rédaction',
    date: 'Jan. 31, 2026',
    imageUrl: arseneImg,
    content: `
      <p><strong>BRAZZAVILLE</strong> — C’est une histoire longtemps restée dans l’ombre des archives coloniales, un fil invisible reliant les rives du fleuve Congo aux plantations humides du Suriname. Avec la publication de la seconde édition de son ouvrage magistral, <em>The Slave Trade in Loango Coast for the Colony of Surinam</em>, l'historien Arsène Francoeur Nganga ne se contente pas de relater des faits ; il cartographie la mémoire d'un exil forcé.</p>

      <p>L'ouvrage, publié ce samedi par Black Seeds Publishing, arrive à un moment charnière où la demande pour une réappropriation de l'histoire africaine par des chercheurs africains n'a jamais été aussi forte. Nganga, fort de son expérience de consultant en tourisme de mémoire, propose ici une "géographie de la douleur" qui s'étend du Cap Lopez jusqu'à l'embouchure du Congo.</p>

      <h3>Le Chaînon Manquant de l'Atlantique</h3>

      <p>Contrairement aux études classiques qui se concentrent souvent sur l'Afrique de l'Ouest, Nganga déplace le regard vers le sud. Il démontre, archives néerlandaises à l'appui, comment la côte de Loango a servi de plaque tournante logistique pour la Compagnie néerlandaise des Indes occidentales (WIC).</p>
      
      <p>"Ce n'est pas seulement une histoire de commerce," écrit Nganga dans son introduction. "C'est l'histoire de la survie culturelle." En effet, l'une des contributions majeures du livre est l'analyse linguistique. L'auteur trace les survivances des langues bantoues dans le Sranan Tongo parlé aujourd'hui au Suriname, prouvant que si les corps ont été enchaînés, les esprits et les cultures ont traversé l'océan.</p>

      <p>Cette seconde édition s'enrichit de nouvelles cartes et de correspondances inédites découvertes lors d'une mission interministérielle en 2017. Elle bénéficie également de l'apport critique du Professeur Willem Frijhoff, offrant une validation académique internationale à ces travaux.</p>

      <p>Pour les historiens comme pour le grand public, ce livre agit comme un miroir tendu entre deux continents, rappelant que l'histoire du Suriname est, indissociablement, une histoire congolaise.</p>
    `
  }
];
