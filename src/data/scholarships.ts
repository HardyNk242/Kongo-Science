import { Scholarship } from '../types';

// --- BOURSES ---
export const SCHOLARSHIPS: Scholarship[] = [
  {
    id: 'bourse-france-2026',
    title: "Bourses du Gouvernement Fran\u00e7ais (BGF) 2026-2027",
    provider: "Ambassade de France au Congo",
    deadline: "2026-03-15",
    level: "Master / Doctorat",
    description: "Financement complet pour les \u00e9tudiants congolais souhaitant poursuivre leurs \u00e9tudes en France. Priorit\u00e9 aux fili\u00e8res STEM.",
    link: "#"
  },
  {
    id: 'bourse-daad-2026',
    title: "Bourses de recherche DAAD - Allemagne",
    provider: "DAAD",
    deadline: "2026-04-30",
    level: "Doctorat / Post-Doc",
    description: "Soutien aux jeunes chercheurs pour des s\u00e9jours de recherche de courte dur\u00e9e en Allemagne.",
    link: "#"
  },
  {
    id: 'bourse-kongo-science',
    title: "Micro-Grant Kongo Science : Soutien \u00e0 la publication",
    provider: "Fondation Kongo Science",
    deadline: "2026-06-01",
    level: "Tous niveaux",
    description: "Aide financi\u00e8re pour couvrir les frais de publication (APC) dans des revues internationales \u00e0 fort impact.",
    link: "#"
  },
  {
    id: 'bourse-comstech-women-ldc',
    title: "COMSTECH-Research Fellowships for Women Scientists in LDCs",
    provider: "COMSTECH / OIC",
    deadline: "Candidatures ouvertes toute l'ann\u00e9e",
    level: "Master / PhD / Post-Doc",
    description: "Bourses de recherche de 6 \u00e0 12 mois pour les jeunes femmes scientifiques des pays les moins avanc\u00e9s (LDC) de l'OCI. Domaines : Sciences naturelles, appliqu\u00e9es, ing\u00e9nierie et technologie.",
    link: "https://comstech.org/comstech-research-fellowships-for-women-scientists-ldc-oic/"
  }
];
