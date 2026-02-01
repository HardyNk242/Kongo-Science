import { Article } from '../types';

// --- IMPORT DES IMAGES ---
import arseneImg from '../assets/arsenenganaloango.png';

// --- ARTICLES ---
export const ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'Impact des \u00e9rosions \u00e0 Brazzaville : Cas des quartiers Mfilou et Jacques Opangault',
    excerpt: 'Une \u00e9tude g\u00e9ologique approfondie sur les m\u00e9canismes de d\u00e9gradation des sols urbains et les solutions de stabilisation durable.',
    category: 'G\u00e9osciences',
    author: 'Dr. Hardy Nkodia',
    date: 'Oct 2024',
    imageUrl: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'art-2',
    title: 'G\u00e9omatique et Sant\u00e9 : Cartographie pr\u00e9dictive des zones \u00e0 risque COVID-19',
    excerpt: "Collaboration avec la Fondation Ntoumi pour l'utilisation du SIG dans la gestion des crises sanitaires en R\u00e9publique du Congo.",
    category: 'Sant\u00e9 Publique',
    author: 'Dr. Nicy Bazebizonza',
    date: 'Jan 2025',
    imageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'news-loango-suriname-2026',
    title: 'Une lumi\u00e8re nouvelle sur un chapitre m\u00e9connu : Ars\u00e8ne Francoeur Nganga publie son enqu\u00eate majeure',
    excerpt: "Parution de la 2e \u00e9dition de l'ouvrage de r\u00e9f\u00e9rence : 'The Slave Trade in Loango Coast for the Colony of Surinam'. Une plong\u00e9e in\u00e9dite dans les liens unissant l'Afrique Centrale \u00e0 l'Am\u00e9rique du Sud.",
    category: 'Litt\u00e9rature & Histoire',
    author: 'La R\u00e9daction',
    date: '31 Jan 2026',
    imageUrl: arseneImg,
    content: `
      <p><strong>Brazzaville/New York \u2013 31 Janvier 2026.</strong> C\u2019est aujourd\u2019hui que para\u00eet la seconde \u00e9dition revue et augment\u00e9e de l\u2019ouvrage historique de r\u00e9f\u00e9rence : <em>"The Slave Trade in Loango Coast for the Colony of Surinam"</em>. Publi\u00e9 par Black Seeds Publishing, ce livre sign\u00e9 par l'historien et consultant congolais Ars\u00e8ne Francoeur Nganga, offre une plong\u00e9e in\u00e9dite dans les liens profonds et douloureux unissant l\u2019Afrique Centrale \u00e0 l\u2019Am\u00e9rique du Sud.</p>

      <h3>Le Cha\u00eenon Manquant : Du Loango au Suriname</h3>
      <p>Si l'histoire de la traite transatlantique est vaste, certains de ses chapitres restent encore dans l'ombre. C'est le cas de la connexion sp\u00e9cifique entre la C\u00f4te de Loango \u2014 s'\u00e9tendant du Cap Lopez au Gabon jusqu'\u00e0 l'embouchure du fleuve Congo \u2014 et la colonie n\u00e9erlandaise du Suriname.</p>
      <p>S'appuyant sur des recherches archivistiques approfondies, l'auteur d\u00e9montre comment cette r\u00e9gion est devenue le plus grand site d'embarquement pour les Africains r\u00e9duits en esclavage \u00e0 destination des colonies n\u00e9erlandaises des Am\u00e9riques d\u00e8s les ann\u00e9es 1630.</p>

      <h3>Une 2e \u00c9dition Enrichie</h3>
      <p>Cette nouvelle \u00e9dition s'enrichit de l'exp\u00e9rience unique de l'auteur en tant que Consultant en Tourisme de M\u00e9moire pour la R\u00e9publique du Congo. Elle met en lumi\u00e8re la r\u00e9silience culturelle et la survie linguistique des peuples Bantous au Suriname et en Guyane fran\u00e7aise aujourd'hui.</p>

      <p><strong>Informations Pratiques :</strong></p>
      <ul>
        <li><strong>Titre :</strong> The Slave Trade In Loango Coast for The Colony of Surinam (2nd Edition)</li>
        <li><strong>Date :</strong> 31 Janvier 2026</li>
        <li><strong>\u00c9diteur :</strong> Black Seeds Publishing</li>
        <li><strong>Prix :</strong> 32,95 $ USD</li>
        <li><strong>Disponibilit\u00e9 :</strong> En stock \u2013 <a href="https://www.amazon.com/Slave-Trade-Loango-Colony-Surinam/dp/B0GGCMMP8W/ref=sr_1_2?crid=3IVFZ45NB2CL8&dib=eyJ2IjoiMSJ9.BbeGY9dBgqSU-NriJuT_LzEsxOKbaHEU6o9-UYrm6PyjHzOB84Qtaa3utKAvOndxg1766ZtX76RbKhWWIzaCmKLb1xPVjjyqhgQ0nm06gzIalJKF2dU2VeDN9GFv_Ce6.JJjE_Ff73MSBCfw9pnhBlnFHfg-_0yF5pP35Plm3eEk&dib_tag=se&keywords=Ars%C3%A8ne+Francoeur+Nganga&qid=1769920287&s=digital-text&sprefix=ars%C3%A8ne+francoeur+nganga%2Cdigital-text%2C254&sr=1-2-catcorr">Acheter sur Amazon</a></li>
      </ul>
    `
  }
];
