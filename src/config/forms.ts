/**
 * POINTS DE COLLECTE DES FORMULAIRES — configuration centrale
 * ===========================================================
 *
 * Tous les formulaires du site écrivent vers un script Google Apps Script
 * déployé en « application web ». Ces adresses étaient jusqu'ici recopiées
 * dans six composants différents : impossible de savoir d'un coup d'œil où
 * partaient les données, ni de changer de compte sans en oublier une.
 *
 * ⚠️  RÈGLE : toutes les données du site doivent être reçues par le compte
 * institutionnel **kongoscience25@gmail.com**, jamais par un compte
 * personnel. Un Apps Script déployé avec « Exécuter en tant que : Moi »
 * s'exécute sous le compte qui l'a déployé : c'est ce compte qui possède le
 * classeur, qui envoie les courriels et dont le quota est consommé.
 *
 * Pour transférer un formulaire vers le compte Kongo Science :
 *   1. Ouvrir le Google Sheet depuis kongoscience25@gmail.com
 *      (ou en transférer la propriété depuis l'ancien compte).
 *   2. Extensions > Apps Script, coller le code, puis Déployer >
 *      Nouveau déploiement > Application Web
 *      (Exécuter en tant que : Moi — Qui a accès : Tout le monde).
 *   3. Remplacer l'URL correspondante ci-dessous.
 *
 * L'état de chaque point de collecte est indiqué par son commentaire.
 */

/**
 * Adresse institutionnelle unique du site.
 *
 * contact@kongoscience.com n'est pas opérationnelle : l'afficher reviendrait
 * à perdre le courrier des visiteurs. Tout passe donc par la boîte Gmail de
 * l'association. Le jour où l'adresse du domaine sera active, cette seule
 * ligne sera à changer.
 */
export const CONTACT_EMAIL = 'kongoscience25@gmail.com';

/**
 * Conservées pour compatibilité : les composants qui distinguaient une
 * adresse principale d'une adresse en copie pointent désormais sur la même
 * boîte, ce qui évite d'envoyer deux fois le même message.
 */
export const CONTACT_EMAIL_FALLBACK = CONTACT_EMAIL;
export const CONTACT_EMAIL_PUBLIC = CONTACT_EMAIL;

export const FORM_ENDPOINTS = {
  /**
   * Candidatures « Rejoindre Kongo Science ».
   * Code source : docs/rejoindre-apps-script.gs
   * Classeur : 1PoeolKU7qXFBtuaPR62JL-kytU-x4I7YPLLzqOoLWiY
   * À déployer depuis kongoscience25@gmail.com.
   */
  rejoindre:
    'https://script.google.com/macros/s/AKfycbxwH3tBvH3ds2v43n9ptWLzm90WPDssEAQg4Z1MKiFvP3zlKCaXicYPtUUyhNhryKgs5A/exec',

  /**
   * Inscriptions aux conférences (page complète et fenêtre modale).
   * Classeur : 1wEQ2ljHv6ZvVzFVdHly3XSJgiKlm0rMnZjNNFHqF42E
   * ⚠️  À REDÉPLOYER depuis kongoscience25@gmail.com.
   */
  inscriptionConference:
    'https://script.google.com/macros/s/AKfycbw-XKGABUep94GRlVd1X_t1O-8UeuFIlMAz_EGU1KTWjghlvbLrMnm73eT1Eff7jcis/exec',

  /**
   * Ancien déploiement utilisé par la fenêtre modale d'inscription.
   * À faire converger vers `inscriptionConference` une fois vérifié que les
   * deux écrivent bien dans le même classeur.
   */
  inscriptionConferenceModale:
    'https://script.google.com/macros/s/AKfycby2QOJtSBLXavDoAssvNKFKgj30kG-nKXy8QM_ieicDB1mJmhqI6J5YPo1qewKE2UpM/exec',

  /**
   * Propositions d'intervention scientifique.
   * ⚠️  À REDÉPLOYER depuis kongoscience25@gmail.com.
   */
  proposition:
    'https://script.google.com/macros/s/AKfycbz5gO1pZtR9HnMnQbGzzP67c8eYPGUpY335vTAZXgdq4D_XwSnj3L6PFtl0S17r70s7QA/exec',
} as const;

/**
 * Déploiements propres à une conférence donnée.
 * Ne renseigner une entrée que si l'événement doit alimenter un classeur
 * distinct ; sinon `inscriptionConference` s'applique.
 */
export const CONFERENCE_ENDPOINT_OVERRIDES: Record<string, string> = {
  'conf-ingenierie-petroliere':
    'https://script.google.com/macros/s/AKfycbxj29r4wCZte8QJBBIuE-JCTVQdh404NvuW3Hq6Hdy6ON4ZGw4uyu9jWTfDj3YLMDSKRg/exec',
};

/** Point de collecte à utiliser pour une conférence. */
export function endpointPourConference(conferenceId: string): string {
  return CONFERENCE_ENDPOINT_OVERRIDES[conferenceId] ?? FORM_ENDPOINTS.inscriptionConference;
}
