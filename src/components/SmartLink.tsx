import React from 'react';

/**
 * Lien interne explorable par les moteurs de recherche.
 *
 * Pourquoi ce composant existe : toute la navigation du site reposait sur
 * `<button onClick={navigateTo}>`. Un bouton n'est pas un lien — Googlebot
 * arrivait sur l'accueil sans trouver la moindre porte vers /library,
 * /agenda ou /programmes, et le site entier se résumait à une seule URL
 * explorable.
 *
 * SmartLink rend un véritable `<a href>` (que le robot suit et que
 * l'utilisateur peut ouvrir dans un nouvel onglet), tout en conservant la
 * navigation instantanée de l'application au clic simple.
 */

interface SmartLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'> {
  /** Chemin interne, avec ou sans barre oblique : "library", "/library/abc", "home". */
  to: string;
  /** Fonction de navigation de l'application (navigateTo / handleNavClick). */
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

/** "home" -> "/" ; "library" -> "/library" ; "/library/abc" inchangé. */
export function toHref(to: string): string {
  const propre = to.replace(/^\/+/, '');
  if (!propre || propre === 'home') return '/';
  return `/${propre}`;
}

/**
 * Vrai si le clic doit être laissé au navigateur : nouvel onglet, nouvelle
 * fenêtre, téléchargement… Intercepter ces clics casserait une attente de base.
 */
function clicANeToucherPas(e: React.MouseEvent<HTMLAnchorElement>): boolean {
  return (
    e.defaultPrevented ||
    e.button !== 0 ||
    e.metaKey ||
    e.ctrlKey ||
    e.shiftKey ||
    e.altKey
  );
}

const SmartLink: React.FC<SmartLinkProps> = ({ to, onNavigate, children, ...rest }) => {
  const cible = to.replace(/^\/+/, '') || 'home';

  return (
    <a
      href={toHref(to)}
      onClick={(e) => {
        if (clicANeToucherPas(e)) return;
        e.preventDefault();
        onNavigate(cible);
      }}
      {...rest}
    >
      {children}
    </a>
  );
};

export default SmartLink;
