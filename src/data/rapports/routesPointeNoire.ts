import { Article } from '../../types';

// Étude pilote Kongo Science, novembre 2026. Chiffres issus de kongo_studio/videos/pointe_noire :
// sources/arrondissements_stats.json, sources/points_charges.json, controle/points.json, sources/etat_resultats.json,
// sources/scenarios.json, sources/rocade.json, sources/rosace.json, sources/detours.json, rushes_apercu/*_transcription.txt
const D = '/rapports/routes-pointe-noire';

const fig = (f: string, alt: string, legende: string) =>
  `<figure style="margin:2.5rem 0"><img src="${D}/${f}" alt="${alt}" loading="lazy" style="width:100%;height:auto;border:1px solid #e2e8f0"/><figcaption style="font-family:sans-serif;font-size:.8rem;line-height:1.5;color:#64748b;margin-top:.5rem">${legende}</figcaption></figure>`;

const table = (tetes: string[], lignes: string[][]) =>
  `<div style="overflow-x:auto;margin:2rem 0"><table style="width:100%;border-collapse:collapse;font-family:sans-serif;font-size:.85rem;line-height:1.45"><thead><tr>${tetes
    .map((t) => `<th style="text-align:left;padding:.55rem .6rem;border-bottom:2px solid #0f172a">${t}</th>`)
    .join('')}</tr></thead><tbody>${lignes
    .map((l) => `<tr>${l.map((c) => `<td style="padding:.5rem .6rem;border-bottom:1px solid #e2e8f0;vertical-align:top">${c}</td>`).join('')}</tr>`)
    .join('')}</tbody></table></div>`;

const liste = (items: string[]) =>
  `<ul style="list-style:disc;padding-left:1.4rem;margin:0 0 2rem">${items.map((i) => `<li style="margin-bottom:.6rem">${i}</li>`).join('')}</ul>`;

export const RAPPORT_ROUTES_POINTE_NOIRE: Article = {
  id: 'routes-pointe-noire-2026',
  title: 'Pointe-Noire : peu de routes, et des routes détruites',
  excerpt:
    "Étude pilote : 403 403 bâtiments, le réseau routier, l'état des chaussées et la croissance de la ville croisés pour comprendre les bouchons de Pointe-Noire, de Thystère à Patra, et chiffrer les liaisons qui manquent.",
  category: 'Géosciences',
  author: 'Hardy Nkodia',
  date: 'Nov. 2026',
  imageUrl: `${D}/plans.jpg`,
  imageCredit: 'Kongo Science. © contributeurs OpenStreetMap ; bâti Overture Maps',
  content: `
<p><strong>En bref.</strong> Pointe-Noire souffre de deux maux à la fois. <strong>Il manque des routes</strong> : à Loandjili, 56 % des bâtiments sont à plus de 500 mètres d'une grande voie, contre 1 % à Mvou-Mvou. <strong>Et les routes existantes sont détruites</strong> : sur 52 points contrôlés sur image satellite, 21 grandes voies sont en terre ou en sable. Notre simulation retrouve d'elle-même les points noirs cités par les habitants : la RN1 entre Loandjili et Thystère, Nkouikou, Mongo-Kamba, la RN4 vers Ngoyo. Réparer seul déplacerait le bouchon vers Thystère. <strong>Réparer les axes détruits, bitumer quatre axes sur des rues existantes et réserver une rocade Est</strong> raccourcirait les trajets d'environ un quart, pour 83 à 186 milliards de FCFA, soit environ trois fois moins que tout bitumer.</p>

<p><strong>Ceci est une étude pilote, non évaluée par les pairs.</strong> Le trafic est simulé, il n'a pas été compté. Les tracés sont à étudier, ce ne sont pas des projets de construction.</p>

<h3>1. Ce que disent les habitants</h3>
<p>Après notre étude sur Brazzaville, des Ponténégrins nous ont écrit. Ils citent les bouchons de Siafoumou, de Tié-Tié, de Thystère, de Nkouikou et de Patra, toujours aux mêmes heures, et surtout de « mauvaises routes ». Nous avons filmé le 26 novembre 2026 devant la mairie de Loandjili et au rond-point Thystère : taxis, bus, motos, camions porte-conteneurs et citernes y partagent la même chaussée.</p>
<p>Deux reportages télévisés décrivent l'axe Fond Tié-Tié – Patra, sur l'avenue de l'Indépendance (TPT PLUS TV, et MCRTV NF le 5 novembre 2026). Chauffeurs, commerçants et passagers y parlent de trous profonds, de bourbiers les jours de pluie, de clients déposés avant la destination et de tarifs qui montent. La presse le dit depuis des années : bouchons de deux à trois heures et tarif doublé les jours de pluie sur l'avenue Thystère à Mongo-Kamba (La Semaine Africaine, 2023) ; Fond Tié-Tié, « Bord-Bord » et avenue de l'Indépendance dégradés (ADIAC, 2025) ; route de Djeno décrite par le préfet comme un « parcours de combattant » (ADIAC, 2026).</p>

<h3>2. Données et méthode</h3>
${liste([
  '<strong>Routes</strong> : OpenStreetMap, coupé aux six arrondissements (258 km²).',
  '<strong>Bâtiments</strong> : 403 403 emprises dans la commune (Overture Maps, version du 18 novembre 2026).',
  '<strong>Relief</strong> : MNT ALOS 30 m. Pointe-Noire est plate : la pente médiane va de 0,8 % (Lumumba) à 2,3 % (Tié-Tié). Le relief n\'est pas l\'obstacle ; le sable, l\'eau de pluie et l\'aéroport le sont.',
  '<strong>État des chaussées</strong> : revêtement OSM, contrôlé sur 52 points tirés le long de toutes les grandes voies et regardés un par un sur l\'imagerie Maxar (via Esri ; date des images non connue). Tronçons signalés détruits par la presse, les reportages, nos vidéos et les habitants.',
  '<strong>Simulation</strong> : 300 origines et 300 destinations tirées dans le bâti (90 000 trajets), avec ralentissement aux points chargés. Une voie en terre ou détruite est supposée deux fois plus lente et 40 % moins capable : c\'est une hypothèse, qui règle l\'ampleur des gains, pas leur classement.',
  '<strong>Croissance</strong> : GHSL 1975 à 2020 (Commission européenne), et bâtiments récents hors de la tache urbaine 2020.',
])}

<h3>3. Les problèmes</h3>
<p><strong>Peu de grandes voies hors du centre.</strong></p>
${table(['Arrondissement', 'Surface', 'Bâtiments', 'Grandes voies par km²', 'Bâtiments à plus de 500 m d\'une grande voie'], [
  ['Mvou-Mvou', '5,3 km²', '16 938', '3,27', '1 %'],
  ['Lumumba', '29,7 km²', '52 005', '2,14', '8 %'],
  ['Tié-Tié', '53,4 km²', '90 668', '0,70', '28 %'],
  ['Ngoyo', '64,0 km²', '76 381', '0,58', '44 %'],
  ['Mongo-Mpoukou', '65,4 km²', '93 698', '0,49', '52 %'],
  ['<strong>Loandjili</strong>', '41,1 km²', '73 713', '<strong>0,42</strong>', '<strong>56 %</strong>'],
])}
${fig('diagnostic.jpg', 'Trafic simulé et accès aux grandes voies', 'Part des trajets simulés passant par chaque voie, et part des bâtiments à plus de 500 m d\'une grande voie (orange). Grandes voies : classes OSM trunk, primary, secondary, tertiary.')}
<p><strong>Des routes en terre ou détruites.</strong> Sur les 52 points contrôlés, 25 sont bitumés, 21 en terre ou en sable, 6 douteux. OSM dit juste quand il annonce du bitume dans 21 cas sur 28, mais 4 routes notées bitumées sont en terre sur l'image : deux points de la RN4 et l'avenue Marien-Ngouabi, celles que dénoncent la presse et le préfet. Quand le revêtement n'est pas renseigné, c'est de la terre 2 fois sur 3. Sur l'échantillon, environ la moitié des grandes voies est bitumée (48 %), 40 % sont en terre ou en sable. Le modèle, plus prudent, traite comme lentes toutes les voies sans bitume connu : 192 km sur 287 km de grandes voies dans la zone d'étude. Le chiffrage du chantier 2 est donc un maximum.</p>
${fig('etat_routes.jpg', "État des grandes voies de Pointe-Noire", "Revêtement OSM, 52 points contrôlés sur image et tronçons signalés détruits. Imagerie Maxar via Esri, date non connue ; MCRTV NF ; presse.")}
<p><strong>Des passages obligés.</strong> Les points les plus chargés de la simulation sont, dans l'ordre : Nkouikou (avenue Mâ-Loango), la RN1 entre Loandjili et Thystère, la RN4 de Tchimbamba à Ngoyo, Thystère, Davum et KM4. Thystère figure parmi les 0,14 % de points les plus chargés du réseau. C'est le point zéro de la RN1 : tout ce qui part vers Brazzaville, camions du port compris, y passe.</p>
<p><strong>Des voisins éloignés par la route.</strong></p>
${table(['Trajet', "Vol d'oiseau", 'Par grandes voies', 'Détour'], [
  ['Fond Tié-Tié – Tchimbamba', '3,1 km', '8,4 km', '× 2,8 (l\'aéroport est entre les deux)'],
  ['Tchimbamba – Voungou', '4,8 km', '10,5 km', '× 2,2'],
  ['Siafoumou – Mongo-Kamba', '6,0 km', '12,2 km', '× 2,0'],
  ['Siafoumou – Vindoulou', '8,0 km', '15,8 km', '× 2,0'],
  ['Siafoumou – Thystère', '4,9 km', '9,1 km', '× 1,9'],
  ['Nkouikou – Voungou', '3,8 km', '7,1 km', '× 1,9'],
])}

<h3>4. L'état des routes change-t-il les bouchons ?</h3>
${fig('trafic_etat.jpg', "Trafic simulé avec l'état réel des routes", "Même simulation, avec les voies en terre ou détruites ralenties. Les points noirs restent les mêmes ; c'est la durée des trajets qui change.")}
<p>Peu, pour les lieux : <strong>les points noirs restent les mêmes</strong>. Ce qui change, c'est la durée de tous les trajets, et un report vers Fond Tié-Tié et le marché de Tié-Tié. Quand une grande voie est détruite, les chauffeurs fuient par les ruelles, comme le racontent les reportages ; mais les ruelles sont en sable elles aussi.</p>

<h3>5. Les plans : réparer, relier, réserver</h3>
${fig('plans.jpg', 'Plans pour décongestionner Pointe-Noire', "Réparations (rouge), quatre axes à bitumer sur des rues existantes (bleu, L1 à L4) et rocade Est à réserver (vert). Tracés calculés sur le réseau OSM et le bâti Overture.")}
<p><strong>Pointe-Noire a déjà des rues partout</strong> (3 700 km), mais étroites et en sable. Il ne s'agit donc pas surtout d'ouvrir des routes neuves, mais de <strong>choisir des rues existantes et d'en faire de vrais axes bitumés</strong>, qui contournent les passages obligés. Leur emprise est large : 30 à 39 m en moyenne de façade à façade. Mais des constructions s'y sont installées : une chaussée de 12 m en touche entre 32 et 144 par axe, petites pour la plupart (36 à 43 m² en valeur médiane : boutiques, kiosques, annexes).</p>
${table(['Axe', 'Longueur', "Vol d'oiseau", 'Déjà grande voie', 'Constructions dans 12 m', 'Effet seul (trajets améliorés)', 'Ordre de grandeur'], [
  ['<strong>L1</strong> Siafoumou – Mongo-Kamba, au nord de Thystère', '6,5 km', '5,2 km', '0 km', '142', '16 %', '7,8 – 17,6 Mds FCFA'],
  ['<strong>L2</strong> Nkouikou – Voungou', '4,5 km', '3,8 km', '0,1 km', '144', '18 %', '5,3 – 12,0 Mds'],
  ["<strong>L3</strong> Fond Tié-Tié – Tchimbamba, par le nord-ouest de l'aéroport", '6,2 km', '3,1 km', '1,2 km', '83', '13 %', '6,7 – 14,8 Mds'],
  ["<strong>L4</strong> Mongo-Kamba – Voungou, parallèle à l'avenue Thystère", '6,8 km', '5,3 km', '4,3 km', '32', '23 %', '5,6 – 11,9 Mds'],
  ['<strong>R</strong> Rocade Est Vindoulou – Patra, à réserver', '14,2 km', '–', '–', '164 (emprise 20 m)', '40 %', '17 – 38 Mds'],
])}
<p style="font-family:sans-serif;font-size:.85rem;line-height:1.6;color:#475569">Coût : 1,2 à 2,7 milliards de FCFA par km de voie à bitumer, la moitié sur les tronçons déjà classés grande voie. Hors expropriations. L2 seul attire du trafic vers Nkouikou : il doit venir avec le réaménagement de ce carrefour.</p>
${table(['Scénario', 'Temps moyen des trajets', 'Trajets améliorés (> 5 %)', 'Thystère', 'Nkouikou', 'Ordre de grandeur'], [
  ["Aujourd'hui", '–', '–', '10,1 %', '12,7 %', '–'],
  ['Réparer les 34 km signalés', '−13 %', '68 %', '15,6 %', '18,3 %', '41 – 92 Mds'],
  ['Les quatre axes L1 à L4', '−11 %', '68 %', '12,0 %', '14,1 %', '25 – 56 Mds'],
  ['<strong>Réparations + L1 à L4</strong>', '<strong>−22 %</strong>', '89 %', '12,6 %', '18,4 %', '66 – 148 Mds'],
  ['<strong>Réparations + L1 à L4 + rocade</strong>', '<strong>−27 %</strong>', '91 %', '11,4 %', '17,4 %', '83 – 186 Mds'],
  ['Bitumer toutes les grandes voies sans bitume connu', '−30 %', '95 %', '16,7 %', '18,2 %', '230 – 519 Mds'],
])}
<p style="font-family:sans-serif;font-size:.85rem;line-height:1.6;color:#475569">Thystère et Nkouikou : part des trajets simulés qui y passent. Les gains de temps dépendent de l'hypothèse de ralentissement des voies en terre : ce sont des ordres de grandeur.</p>
<p><strong>Réparer seul déplace le bouchon.</strong> Une route réparée attire du trafic : Thystère passerait de 10 % à 16 % des trajets simulés. <strong>Réparer et relier</strong> donne presque le même gain que tout bitumer (−27 % contre −30 %), pour environ trois fois moins cher, et Thystère reste proche d'aujourd'hui (11 %). Nkouikou, sur l'avenue Mâ-Loango, reste le point le plus chargé dans tous les scénarios : ce carrefour doit être réaménagé.</p>
<p><strong>La rocade Est</strong> traverse la réserve de terrain de l'est (section 7). Seule, elle agit peu ; elle prépare surtout la ville de 2040. Prolongée vers Ngoyo, elle traverserait un quartier dense (118 bâtiments sur 4,9 km) : là, mieux vaut bitumer les rues existantes.</p>
<p><strong>Les camions du port.</strong> Contourner Thystère par la RN4 puis la rocade ne leur fait gagner qu'environ 4 % dans notre modèle. Ils resteront sur la RN1 tant que le port n'aura pas d'autre sortie vers le nord-est.</p>

<h3>6. Thystère</h3>
<p>La Congolaise des routes a lancé le 12 décembre 2025 la réhabilitation du giratoire et de 200 m de chaussée, annoncée pour un mois (ADIAC). Un conteneur s'y est renversé le 28 février 2024, jour du lancement des voiries de la ville (La Semaine Africaine). Un nouveau marché y est annoncé (ADIAC, février 2026). Nos vidéos du 26 novembre 2026 montrent un marché sur les bords du giratoire, des citernes et des porte-conteneurs mêlés aux taxis.</p>
<p>Avant tout autopont, nous recommandons de <strong>compter</strong> les véhicules par mouvement et par heure, de <strong>déplacer les étals</strong> hors de la chaussée, d'organiser les arrêts de bus et d'étudier <strong>des horaires pour les poids lourds</strong>. Un échangeur ne se justifie qu'avec des comptages : à Brazzaville, notre étude de Mazala a montré qu'un autopont seul peut repousser la file plus loin.</p>

<h3>7. Vers où la ville s'étale</h3>
${fig('rosace.jpg', "Rosaces des directions d'étalement de Pointe-Noire", "Directions d'étalement depuis le centre de la tache urbaine de 1975 (rayon 20 km ; 15 km pour la rosace 3). Rosaces à surface égale, océan exclu. GHSL, Overture Maps, ALOS.")}
${table(['Période', 'Surface', 'Nord-est (NNE – ENE)', 'Nord (N, NNO)', 'Est', 'Sud-est (ESE – SSE)', 'Sud, sud-ouest'], [
  ['2000 – 2010, observé', '12,3 km²', '43 %', '27 %', '1 %', '12 %', '15 %'],
  ['2010 – 2020, observé', '41,3 km²', '42 %', '17 %', '4 %', '32 %', '2 %'],
  ['Bâtiments actuels hors tache 2020', '41,4 km²', '35 %', '24 %', '11 %', '22 %', '5 %'],
  ['Terrain libre, pente ≤ 12 %', '229,8 km²', '28 %', '19 %', '14 %', '31 %', '2 %'],
])}
<p>La ville pousse vers le nord-est (Loandjili, Mongo-Mpoukou, Vindoulou) et, depuis 2010, vers le sud-est (Ngoyo, Patra). C'est justement là que les grandes voies manquent. Le terrain libre est surtout à l'est et au sud-est : <strong>réservons l'emprise de la rocade avant que les maisons n'arrivent</strong>.</p>
<p>Le centre est calculé, pas choisi : c'est le centre de gravité de la tache GHSL de 1975 (107 km² d'un seul tenant, sans doute surestimée, comme à Brazzaville). Il bouge de moins de 400 m quand on fait varier le seuil, pour des taches de 72 à 107 km². Il tombe à 0,8 km du marché de Tié-Tié.</p>

<h3>8. Combien cela coûterait ?</h3>
${liste([
  'Rues urbaines avec drainage : 1,2 à 2,1 milliards de FCFA par km (estimation de 2015 du projet DURQuaP, Banque mondiale, à Brazzaville).',
  'Route Pointe-Noire – Djeno (RN4) : près de 42 milliards de FCFA pour 15,4 km, soit environ 2,7 milliards par km (ADIAC, février 2026). Nous l\'utilisons comme borne haute.',
])}
<p>Une partie du chantier 1 est déjà lancée ou annoncée : la RN4 vers Djeno (février 2026) et la RN1 Loandjili – Thystère (programme de février 2024, avançant « à pas d'escargot » selon La Semaine Africaine en juin 2025). Ne sont pas comptés : les études, les expropriations, le drainage lourd, l'inflation et les imprévus.</p>

<h3>9. Priorités proposées</h3>
<ol style="list-style:decimal;padding-left:1.6rem;margin:0 0 2rem">
<li style="margin-bottom:.7rem"><strong>Réparer les axes signalés</strong> : avenue de l'Indépendance Fond Tié-Tié – Patra, RN1 Loandjili – Thystère, avenue Marien-Ngouabi « Bord-Bord », avenue Thystère à Mongo-Kamba, RN4 vers Ngoyo. <strong>En même temps</strong>, réaménager Thystère et Nkouikou.</li>
<li style="margin-bottom:.7rem"><strong>Bitumer quatre axes sur des rues existantes</strong> : L4 Mongo-Kamba – Voungou d'abord (le plus efficace, le moins de constructions touchées), puis L1, L3 et L2, en libérant les emprises occupées.</li>
<li style="margin-bottom:.7rem"><strong>Bitumer progressivement</strong> les autres grandes voies en terre de Loandjili, Mongo-Mpoukou, Tié-Tié et Ngoyo, avec leur drainage.</li>
<li style="margin-bottom:.7rem"><strong>Réserver l'emprise de la rocade Est</strong>, de Vindoulou à Patra, dès maintenant.</li>
<li style="margin-bottom:.7rem"><strong>Compter</strong> le trafic à Thystère, à Nkouikou et sur la RN1, avant toute décision d'échangeur.</li>
</ol>

<h3>10. Limites</h3>
${liste([
  'Aucun comptage de véhicules ni relevé GPS ; capacités, ralentissements et effets de saturation sont des hypothèses.',
  'Le contrôle du revêtement porte sur 52 points ; la date des images n\'est pas connue ; certaines routes ont pu être refaites ou détruites depuis.',
  'Les camions ne sont pas simulés à part ; le port, les marchés et les horaires réels non plus.',
  'GHSL surestime la ville ancienne ; les directions d\'étalement sont plus solides que les surfaces.',
  'La rocade et les axes L1 à L4 n\'ont pas été vus sur le terrain ; propriété foncière, zones humides, réseaux et état des constructions dans l\'emprise ne sont pas vérifiés.',
  'Les articles de presse ont été lus en ligne ; les reportages ont été transcrits automatiquement.',
])}

<h3>11. Des sujets de thèse</h3>
${liste([
  'Compter et modéliser le trafic de Thystère et de la RN1, camions du port compris.',
  'Cartographier l\'état de toutes les routes de Pointe-Noire par images et par téléphone, avec les habitants.',
  'Concevoir des chaussées et un drainage durables sur les sables de Pointe-Noire.',
  'Chiffrer ce que coûtent aux familles les routes détruites : tarifs doublés, temps perdu, véhicules abîmés.',
  'Trouver une nouvelle sortie pour les camions du port, sans traverser la ville.',
  'Réaménager les marchés de bord de route : Thystère, Fond Tié-Tié, Tié-Tié.',
  'Cartographier l\'étalement de Pointe-Noire année par année, et réserver les emprises des routes de demain.',
])}
<p>Tu es fatigué de pousser la voiture dans le sable, de payer le double quand il pleut, de descendre avant ta destination ? Cette colère est légitime. Emmène-la à l'université : <strong>ta colère est ton sujet de thèse.</strong></p>

<h3>Données et sources</h3>
<p>Téléchargement : <a href="${D}/Routes_Pointe-Noire.kmz" style="color:#1d4ed8;text-decoration:underline">rocade et 52 points de contrôle pour Google Earth (KMZ)</a>.</p>
${liste([
  'ADIAC / Les Dépêches de Brazzaville : giratoire de Thystère (23 décembre 2025) ; routes en lamentable état (6 mars 2025) ; marchés de Thystère et Fond Tié-Tié (19 février 2026) ; route Pointe-Noire – Djeno (10 février 2026).',
  'La Semaine Africaine : réseau routier « très lamentable » (1er mai 2023) ; conteneur renversé au rond-point Thystère (8 mars 2024) ; réhabilitation attendue (3 juin 2025).',
  'Les Échos du Congo-Brazzaville : lancement des travaux de voirie (29 février 2024).',
  'MCRTV NF : « Voiries urbaines, le tronçon Fond Tié-Tié – Patra à l\'agonie » (5 novembre 2026) ; TPT PLUS TV : « Circulation routière, route dégradée axe Fond de Tié-Tié à Patra ».',
  'Vidéos de terrain : H. Nkodia, Loandjili et Thystère, 26 novembre 2026.',
  'Banque mondiale (2023). <em>DURQuaP, Implementation Completion and Results Report</em>, ICR00006200.',
  'Données : © contributeurs OpenStreetMap (ODbL) ; Overture Maps ; ALOS World 3D 30 m (JAXA) ; GHSL GHS-BUILT-S R2023A (Commission européenne, JRC) ; imagerie Maxar via Esri World Imagery (contrôle visuel).',
])}
`,
};
