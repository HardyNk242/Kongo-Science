import { useEffect } from 'react';

/**
 * Métadonnées d'une page : titre, description, URL canonique, partage social.
 *
 * Deux problèmes réglés ici.
 *
 * 1. L'application ne déclarait qu'un seul <title> — celui de index.html —
 *    pour ses onze routes. Deux pages indiscernables pour un moteur de
 *    recherche sont deux pages qu'il n'a aucune raison de classer séparément.
 *
 * 2. Le composant s'appuyait auparavant sur react-helmet-async 2.0.5, qui est
 *    inopérant sous React 19 : il ne lève aucune erreur et n'injecte rien.
 *    On met donc les balises à jour directement, sans dépendance.
 *
 * Les balises existantes sont *modifiées* plutôt que dupliquées : un document
 * ne doit porter qu'une seule description et qu'une seule URL canonique.
 */

const SITE_NAME = 'Kongo Science';
const BASE_URL = 'https://www.kongoscience.com';
const DEFAULT_IMAGE = `${BASE_URL}/social-image.jpg`;

interface SeoProps {
  /** Titre de la page, sans le nom du site (ajouté automatiquement). */
  title: string;
  description: string;
  /** Chemin canonique, ex. "/library" ou "/library/abc". */
  path?: string;
  image?: string;
  /** "website" pour les pages de rubrique, "article" pour une fiche. */
  type?: 'website' | 'article';
}

/** Crée la balise <meta> si elle manque, sinon met à jour son contenu. */
function majMeta(attribut: 'name' | 'property', cle: string, valeur: string) {
  let balise = document.head.querySelector<HTMLMetaElement>(`meta[${attribut}="${cle}"]`);
  if (!balise) {
    balise = document.createElement('meta');
    balise.setAttribute(attribut, cle);
    document.head.appendChild(balise);
  }
  balise.setAttribute('content', valeur);
}

/** Idem pour <link rel="canonical">. */
function majCanonical(url: string) {
  let balise = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!balise) {
    balise = document.createElement('link');
    balise.setAttribute('rel', 'canonical');
    document.head.appendChild(balise);
  }
  balise.setAttribute('href', url);
}

const Seo: React.FC<SeoProps> = ({
  title,
  description,
  path = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
}) => {
  const titreComplet = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const url = `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

  // Une description tronquée proprement vaut mieux qu'une description coupée
  // par le moteur de recherche au milieu d'un mot.
  const resume =
    description.length > 300 ? `${description.slice(0, 297).trimEnd()}…` : description;

  useEffect(() => {
    document.title = titreComplet;

    majMeta('name', 'description', resume);
    majCanonical(url);

    majMeta('property', 'og:site_name', SITE_NAME);
    majMeta('property', 'og:type', type);
    majMeta('property', 'og:url', url);
    majMeta('property', 'og:title', titreComplet);
    majMeta('property', 'og:description', resume);
    majMeta('property', 'og:image', image);

    majMeta('name', 'twitter:card', 'summary_large_image');
    majMeta('name', 'twitter:url', url);
    majMeta('name', 'twitter:title', titreComplet);
    majMeta('name', 'twitter:description', resume);
    majMeta('name', 'twitter:image', image);
  }, [titreComplet, resume, url, image, type]);

  return null;
};

export default Seo;
