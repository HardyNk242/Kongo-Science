import { Article } from '../../types';

// Étude pilote Kongo Science, novembre 2026. Chiffres issus de :
// topographie/bilan_liaisons.json, topographie/controle_topo.json, sources/scenarios5.json, sources/itineraires.json
const D = '/rapports/routes-brazzaville';

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

export const RAPPORT_ROUTES_BRAZZAVILLE: Article = {
  id: 'routes-manquantes-brazzaville-2026',
  title: 'Quelles routes manquent à Brazzaville ?',
  excerpt:
    "Étude pilote : réseau routier, relief et bâti croisés sur 327 km² pour repérer les liaisons manquantes, avec leurs pentes, leurs coûts indicatifs et leurs limites.",
  category: 'Géosciences',
  author: 'Hardy Nkodia',
  date: 'Nov. 2026',
  imageUrl: `${D}/liaisons.jpg`,
  imageCredit: 'Kongo Science. Fond Sentinel-2 cloudless 2016 by EOX (Copernicus), CC BY 4.0 ; © contributeurs OpenStreetMap',
  content: `
<p><strong>En bref.</strong> Les grandes voies de Brazzaville sont concentrées au centre, et la moitié des bâtiments de Madibou et de Djiri en sont à environ 500 mètres ou plus. Dans notre simulation, un quart des trajets passe par le pont du Djoué. Parmi les liaisons testées, une seule agit à l'échelle de la ville : un second pont sur le Djoué entre Mfilou et Madibou. Les autres désenclavent des quartiers voisins. Aucune ne soulage nettement Mazala.</p>

<p><strong>Ceci est une étude pilote, non évaluée par les pairs.</strong> Le trafic est simulé, il n'a pas été compté. Les tracés sont à étudier, ils ne sont pas des projets de construction.</p>

<h3>1. Ce que dit la recherche</h3>
<p>Une étude de plus de 1 200 villes montre que l'on roule environ 50 % plus vite dans les pays riches, surtout parce que leurs villes ont davantage de grandes voies (Akbar et al., 2023, document de travail). Lagos y est la deuxième ville la plus lente. L'Europe invite pourtant à la prudence : dans 545 villes, étendre les autoroutes a attiré du trafic supplémentaire (Garcia-López et al., 2021).</p>
<p>En Afrique centrale, une enquête donne un trajet moyen de 1 h 45 à Kinshasa, 1 h 15 à Douala et environ une heure à Brazzaville (Mfewou, 2025, prépublication ; le texte indique 1 h puis 1 h 10). À Brazzaville, 85 % des 180 ménages interrogés par Ndey Ngandzo et Mouthou (Université Marien Ngouabi) estiment que la Corniche a décongestionné leur zone : une liaison nouvelle peut donc aider. Wester et Audard (2017) ont simulé le transport artisanal de la ville. Mambou et Elenga (2023) rappellent le poids de l'érosion et du mauvais drainage.</p>

<h3>2. Données et méthode</h3>
${liste([
  '<strong>Routes</strong> : OpenStreetMap, coupé aux neuf arrondissements (327 km²). Le revêtement n\'est renseigné que sur environ 5 % du linéaire.',
  '<strong>Bâtiments</strong> : 420 662 emprises (Overture Maps).',
  '<strong>Relief</strong> : MNT ALOS 30 m, comparé à Copernicus 30 m (écart-type de 2,3 m) ; courbes de niveau à 5 m.',
  '<strong>Règles de tracé</strong> : réutiliser les rues existantes ; pente en long de 8 % au plus pour le neuf et 10 % pour les rues à bitumer ; pénaliser les bâtiments ; pas de franchissement du plan d\'eau hors pont ; aucun ouvrage à moins de 400 m du barrage du Djoué.',
  '<strong>Simulation</strong> : 300 origines et 300 destinations pondérées par le bâti (90 000 trajets), avec et sans ralentissement aux points chargés. Les capacités des voies sont des hypothèses.',
  '<strong>Contrôle visuel</strong> : Google Maps et Google Earth Pro. Deux emplacements de pont ont été rejetés (près du barrage, puis franchissement en biais). Le site retenu a été vu de près, mais la tête nord du pont calculé est décalée de 110 m environ : 260 m dans le calcul, environ 160 m au droit du site vu.',
])}
${fig('courbes_niveau.jpg', 'Courbes de niveau de Brazzaville', 'Courbes de niveau de Brazzaville (5 m, maîtresses 25 m). MNT ALOS et Copernicus lissés à 40 m.')}

<h3>3. Les problèmes</h3>
<p><strong>Des grandes voies au centre.</strong> Bacongo compte 2,96 km de grandes voies par km², Djiri 0,32 : neuf fois moins. 54 % des bâtiments de Madibou, 48 % de ceux de Djiri et 45 % de ceux de Mfilou sont à plus de 500 m d'une grande voie.</p>
${fig('densites.png', 'Densité des grandes voies par arrondissement', 'Grandes voies (OSM : trunk, primary, secondary, tertiary), chaussées séparées comptées une fois.')}
${fig('bati_voies.jpg', 'Densité du bâti et grandes voies', 'Densité du bâti (du clair au rouge) et grandes voies en noir.')}
<p><strong>Un relief exigeant.</strong> La pente du terrain dépasse 12 % sur 40 % de la surface de Mfilou, 35 % de Djiri et 28 % de Talangaï.</p>
<p><strong>Des passages obligés.</strong> Sans ralentissement, 26 % des trajets simulés passent par le pont du Djoué et 21 % par Matsoua. Aux heures de pointe (7 h – 9 h et 17 h – 20 h, constat de terrain), les axes Matsoua – Mazala – Nkombo, Poto-Poto – Congo Pharmacie et CCF – pont du Djoué sont saturés.</p>
<p><strong>Des voisins éloignés par la route.</strong></p>
${table(['Trajet', "Vol d'oiseau", 'Par grandes voies', 'Détour'], [
  ['Sadelmi – Nkombo', '3,9 km', '8,7 km', '× 2,2'],
  ['Case Barnier – Kintélé', '13,5 km', '28,1 km', '× 2,1'],
  ['Case Barnier – Massengo', '5,1 km', '10,5 km', '× 2,0'],
  ['Massengo – Sadelmi', '6,6 km', '12,5 km', '× 1,9'],
  ['Mfilou – Madibou', '8,1 km', '15,2 km', '× 1,9'],
  ['Mfilou – Case Barnier', '9,2 km', '16,6 km', '× 1,8'],
])}

<h3>4. Les liaisons étudiées</h3>
${fig('traces_courbes.jpg', 'Tracés sur les courbes de niveau', 'Tracés posés sur les courbes de niveau : vert ≤ 8 %, orange 8 à 12 %.')}
${table(['Liaison', 'À bitumer', 'À créer', 'Pente max', 'Bâtiments possibles*', 'Trajet simulé**', 'Ordre de grandeur'], [
  ['<strong>A</strong> Mfilou – Madibou', '1,6 km', '0,5 km + pont 260 m', '6,4 %', '17', '−23 %', '6,6 – 10,6 Mds FCFA'],
  ['<strong>B1</strong> Sadelmi – Case Barnier', '1,7 km', '0,2 km', '9,1 %', '4', '−18 %', '2,3 – 4,0 Mds'],
  ['<strong>B2</strong> Case Barnier – Nkombo', '3,9 km', '2,2 km', '8,7 %', '7', '−46 %', '7,3 – 12,8 Mds'],
  ['<strong>B3</strong> Sadelmi – Nkombo', '2,2 km', '1,5 km', '7,6 %', '25', '−31 %', '4,5 – 7,8 Mds'],
  ['<strong>C1</strong> Case Barnier – Massengo', '6,5 km', '2,1 km', '8,5 %', '7', '−55 %', '10,2 – 17,9 Mds'],
  ['<strong>C2</strong> Massengo – Kintélé', '3,8 km', '2,6 km', '7,8 %', '29', '−5 %', '7,7 – 13,5 Mds'],
  ['<strong>D</strong> Comus – Poudrière', '0,4 km', '–', '2,5 %', '5', '−9 %', '0,5 – 0,9 Md'],
])}
<p style="font-family:sans-serif;font-size:.85rem;line-height:1.6;color:#475569">* Bâtiments dont plus de 20 % de l'emprise rectangulaire touche une plateforme de 8 m ; une vraie voie à 2×1 avec caniveaux est plus large, le nombre augmentera. ** Temps relatif sans bouchon, entre les deux extrémités de la liaison. Longueurs et tracés sur une grille de 40 m.</p>
<p>Les premières versions des liaisons B2 et C ont été <strong>refusées</strong> au contrôle topographique : elles atteignaient 18 % et 24 % de pente. Les tracés ci-dessus ont été recalculés.</p>
${fig('profils.jpg', 'Profils en long', 'Profils en long des tracés retenus. Pente sur 100 m : vert ≤ 8 %, orange 8 à 12 %, rouge > 12 %.')}

<h3>5. L'effet à l'échelle de la ville</h3>
${table(['Scénario', 'Pont du Djoué', 'Mazala', 'Trajets améliorés (> 5 %)', 'Trajets dégradés (> 5 %)'], [
  ["Aujourd'hui, sans bouchon", '26,0 %', '13,1 %', '–', '–'],
  ['A, sans bouchon', '19,5 %', '13,0 %', '5,0 %', '0,0 %'],
  ['Toutes, sans bouchon', '19,6 %', '12,5 %', '6,9 %', '0,0 %'],
  ["Aujourd'hui, avec bouchons", '26,0 %', '11,8 %', '–', '–'],
  ['A, avec bouchons', '21,6 %', '11,3 %', '11,0 %', '3,0 %'],
  ['B, avec bouchons', '26,0 %', '11,7 %', '1,8 %', '0,0 %'],
  ['C, avec bouchons', '26,0 %', '11,7 %', '0,5 %', '0,0 %'],
  ['D, avec bouchons', '26,0 %', '11,7 %', '0,0 %', '0,0 %'],
  ['Toutes, avec bouchons', '21,6 %', '11,2 %', '14,1 %', '2,8 %'],
])}
<p>La liaison A porte l'essentiel du gain. B et C répondent à un autre objectif : rapprocher des quartiers voisins. D n'apporte rien de mesurable ici. <strong>Mazala ne baisse que de 11,8 % à 11,2 % des trajets</strong> : un échangeur doit y être étudié séparément.</p>

<h3>6. Aller en ville sans passer par Mazala ni le CCF</h3>
${fig('itineraires.jpg', 'Itinéraires depuis Sadelmi et Nkombo', 'Itinéraires calculés depuis Sadelmi et Nkombo vers Bacongo. Fond Sentinel-2 2016 (EOX), CC BY 4.0.')}
<p>Un contournement existe déjà sur la carte. De Sadelmi à Bacongo, il fait 12,1 km par l'ouest de l'aéroport, contre 12,9 km par Mazala. Il emprunte environ 2,4 km de petites rues, avec une pente atteignant 12 % : les améliorer est peut-être l'option la moins coûteuse. De Nkombo à Bacongo, il fait 15,3 km au lieu de 14,6 km, et passe par Matsoua. L'état réel de ces voies reste à vérifier sur le terrain.</p>

<h3>7. Combien cela coûterait ?</h3>
${liste([
  'Rues urbaines avec drainage à Brazzaville : 2 à 3,5 millions de dollars par km, soit 1,2 à 2,1 milliards de FCFA à 600 FCFA le dollar (estimation de 2015 du projet DURQuaP, Banque mondiale).',
  'Pont : 15,5 milliards de FCFA par km, d\'après le viaduc Talangaï – Kintélé (106,4 milliards pour environ 6,9 km, ADIAC, 2015). La borne haute ajoute 50 %, par hypothèse.',
  'À titre de comparaison, la Corniche sud a été annoncée à 45,9 milliards pour 5,2 km de 2×2 voies (ADIAC, 2015).',
])}
<p>Ne sont pas compris : l'inflation depuis 2015, les études, les expropriations, les petits franchissements de vallon et les imprévus. Pour les rues de DURQuaP, la Banque mondiale a calculé un rapport bénéfice-coût de 2,4, surtout lié aux dommages d'inondation évités. Ce chiffre ne s'applique pas directement à nos liaisons.</p>

<h3>8. Priorités proposées</h3>
<ol style="list-style:decimal;padding-left:1.6rem;margin:0 0 2rem">
<li style="margin-bottom:.7rem"><strong>Finir Sadelmi.</strong> Selon notre constat de terrain, la route s'arrête entre la caserne et le marché, les travaux attendant des fonds. En 2022, Vox Congo signalait déjà l'arrêt du chantier d'accès aux casernes de N'douo et Sadelmi.</li>
<li style="margin-bottom:.7rem"><strong>Liaison A</strong>, Mfilou – Madibou, avec un second pont sur le Djoué.</li>
<li style="margin-bottom:.7rem"><strong>Liaison B</strong>, Sadelmi – Case Barnier – Nkombo.</li>
<li style="margin-bottom:.7rem"><strong>Liaison C</strong>, Case Barnier – Massengo – Kintélé, comme vision à long terme.</li>
</ol>
<p>En parallèle : étudier un échangeur à Mazala, et améliorer le contournement ouest de l'aéroport. L'idée de voies souterraines est une question de recherche : les sables, la nappe et les grès de l'Inkisi doivent d'abord être reconnus par sondages.</p>

<h3>9. Limites</h3>
${liste([
  'Aucun comptage de véhicules ni relevé GPS ; les capacités et les effets de saturation sont des hypothèses.',
  'MNT à 30 m incluant toits et arbres ; aucun levé, sondage ni étude d\'érosion ou hydraulique.',
  'OpenStreetMap ne dit presque jamais si une voie est bitumée ou praticable.',
  'Certaines coordonnées (Case Barnier, Comus, Poudrière) sont approchées ; Kombé, Kimpomo et Tsielampo ne sont pas encore traités.',
  'Les études de Garcia-López et al. et de Mambou et Elenga ont été lues en résumé.',
])}

<h3>10. Des sujets de thèse</h3>
${liste([
  'Compter et modéliser le trafic de Brazzaville.',
  'Dimensionner un second pont sur le Djoué.',
  'Concevoir des routes résistantes à l\'érosion à Mfilou et Djiri.',
  'Étudier un échangeur à Mazala.',
  'Évaluer la faisabilité géologique d\'un ouvrage souterrain.',
  'Organiser les bus et chiffrer le coût des « demi-terrains » pour les usagers.',
])}
<p>Être fatigué des bouchons, du prix des bus et des demi-terrains est une colère légitime. Elle peut devenir un projet de recherche.</p>

<h3>Données et sources</h3>
<p>Téléchargements : <a href="${D}/Routes_Brazzaville.kmz" style="color:#1d4ed8;text-decoration:underline">tracés pour Google Earth (KMZ)</a> · <a href="${D}/courbes_niveau_Brazzaville_5m.geojson" style="color:#1d4ed8;text-decoration:underline">courbes de niveau (GeoJSON)</a>.</p>
${liste([
  'Akbar, Couture, Duranton, Storeygard (2023). <em>The Fast, the Slow, and the Congested</em>. NBER WP 31642.',
  'Garcia-López, Pasidis, Viladecans-Marsal (2021). <em>Journal of Economic Geography</em>. doi:10.1093/jeg/lbab025',
  'Mfewou (2025). ESI Preprints. doi:10.19044/esipreprint.12.2025.p320',
  'Ndey Ngandzo, Mouthou. <em>L\'importance d\'une infrastructure routière à Brazzaville : cas de la Corniche</em> (enquête de mai 2020). LAGEA, Université Marien Ngouabi.',
  'Mambou, Elenga (2023). <em>European Scientific Journal</em>. doi:10.19044/esj.2023.v19n20p205',
  'Wester, Audard (2017). <em>Les Cahiers Scientifiques du Transport</em> 72. doi:10.46298/cst.12167',
  'Banque mondiale (2023). <em>DURQuaP, Implementation Completion and Results Report</em>, ICR00006200.',
  'ADIAC (2015), viaduc Talangaï – Kintélé et voie express de la Corniche ; Vox Congo (2 septembre 2022), Case Barnier.',
  'Données : © contributeurs OpenStreetMap (ODbL) ; Overture Maps ; ALOS World 3D 30 m (JAXA) ; Copernicus DEM GLO-30 ; Sentinel-2 cloudless 2016 by EOX, CC BY 4.0 ; arrondissements : SIG H. Nkodia.',
])}
`,
};
