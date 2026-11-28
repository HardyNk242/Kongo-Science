import { Article } from '../../types';

// Synthèse Kongo Science, novembre 2026, de Watha-Ndoudy et al. 2023 (Open J. Geol. 13:287-305, CC BY 4.0)
// et Makamba et al. 2023 (Open J. Geol. 13:107-135). Images et calculs : kongo_studio/videos/or_elogo.
const D = '/rapports/or-elogo';

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

const ART = 'Watha-Ndoudy et al. 2023, <em>Open Journal of Geology</em> 13:287-305, licence CC BY 4.0';

export const RAPPORT_OR_ELOGO: Article = {
  id: 'or-elogo-2026',
  title: "L'or d'Elogo : la source est toute proche",
  excerpt:
    "Dans la Sangha, une équipe de l'Université Marien Ngouabi a étudié les graviers aurifères d'Elogo. La forme des grains montre que la roche-mère de l'or est à quelques dizaines ou centaines de mètres. Pendant ce temps, les chantiers s'étendent. Synthèse, images satellite et contexte mondial.",
  category: 'Géosciences',
  author: 'Hardy Nkodia',
  date: 'Nov. 2026',
  imageUrl: `${D}/zazou_2022.jpg`,
  imageCredit: 'Esri World Imagery, WorldView-2 du 21 janvier 2022 (Vantor / Maxar)',
  content: `
<p><strong>En bref.</strong> À Elogo, dans le département de la Sangha, l'or est lavé dans les graviers des rivières, sur des roches parmi les plus anciennes du Congo. Une équipe de l'Université Marien Ngouabi, avec des géologues de MAC-Congo et de l'IRGM de Yaoundé, a décrit une vingtaine de chantiers et analysé quarante concentrés de batée. Dix-sept minéraux accompagnent l'or. La forme des grains montre que leur source est proche : une cinquantaine de mètres au nord, plus de trois cents mètres au sud. La roche-mère, probablement des filons de quartz ou des formations de fer rubané, reste à trouver, et la chimie de l'or reste à mesurer. Pendant ce temps, les images satellite montrent de nouveaux chantiers entre 2016 et 2022, et l'or vaut plus de 4 000 dollars l'once.</p>

<p><strong>Ce rapport est une synthèse</strong> de deux articles scientifiques publiés en libre accès, complétée par une lecture d'images satellite et des données du World Gold Council. Il fait suite à notre vidéo « D'où vient l'or du Mayombe ? », consacrée aux travaux de la même équipe aux Saras, dans le Mayombe.</p>

<h3>1. Où est Elogo ?</h3>
<p>Elogo est un village du nord-ouest du Congo, dans la Sangha, au sud de Souanké, sur la route qui longe Bamegod et Bethel vers Mbam Gor et Messok. Les chantiers étudiés sont autour de Koko et Gola au nord, et autour de Zazou et Mayembe au sud. D'après la carte de l'article, Elogo est vers 1,81° N et 14,26° E.</p>
${fig('sangha.jpg', 'Elogo, Koko et Souanké sur image satellite', 'Elogo, Koko et Souanké. Coordonnées lues sur la Fig. 2 de Watha-Ndoudy et al. 2023 (UTM 33N converties). Image : Sentinel-2 cloudless 2016 by EOX (Copernicus), CC BY 4.0.')}

<h3>2. Des roches très anciennes</h3>
<p>Elogo est posé sur le socle de l'Ivindo, au bord du craton du Congo, là où il rencontre le bassin plus jeune de Sembé-Ouesso. On y trouve une <strong>ceinture de roches vertes</strong> de l'Archéen, donc de plus de 2,5 milliards d'années : d'anciens basaltes, des roches ultrabasiques, des quartzites et des formations de fer rubané. Les granitoïdes voisins, au nord, sont datés entre 3,23 et 2,7 milliards d'années (Makamba et al. 2023). Pour ces auteurs, une partie des basaltes d'Elogo s'est formée dans un bassin d'arrière-arc, et une autre dans un arc volcanique, au-dessus d'une zone de subduction.</p>
${fig('geologie.png', 'Carte géologique de la région d\'Elogo', `Socle de l'Ivindo, ceintures de roches vertes (vert), formations de fer rubané (rouge) et complexe ultrabasique d'Elogo (bleu). Fig. 1 de ${ART}.`)}
<p>Ce détail compte : dans le monde, les ceintures de roches vertes de l'Archéen portent de grands gisements d'or, au Canada, en Australie, en Afrique du Sud ou en Tanzanie (Goldfarb et al. 2001).</p>

<h3>3. L'équipe et la méthode</h3>
${liste([
  "<strong>Université Marien Ngouabi</strong> : Noël Watha-Ndoudy (aussi à l'Institut national de recherche forestière), Prince Espoire Wamene Okoumel, Timothée Miyouna, Pr Florent Boudzoumou.",
  '<strong>MAC-Congo</strong> (Mines d\'or et carrières du Congo) : Renaud Hermann Assouka Mpika, Eddy Guembou Massala, Guichel Souaty Mibantsa, Kester Mayenga.',
  '<strong>IRGM, Yaoundé</strong> : Joseph Victor Hell, Boniface Kankeu.',
])}
<p>L'équipe a décrit les coupes d'une vingtaine de chantiers. L'or est dans une couche de graviers, souvent de moins de 80 cm, sous cinq à dix mètres de terre stérile. Quarante échantillons ont été lavés à la batée. Dans chaque concentré, deux cents grains ont été identifiés à la loupe binoculaire. Les assemblages ont ensuite été comparés par analyse factorielle des correspondances et par analyse en composantes principales.</p>
${fig('placers.png', 'Coupes des placers d\'Elogo', `Les quatre types de placers : sol, horizons argileux ou latéritiques, puis graviers minéralisés sur le socle. Fig. 3 de ${ART}.`)}
${fig('sites.png', 'Carte des échantillons', `Sites d'échantillonnage entre Koko et Messok. Fig. 2 de ${ART}.`)}

<h3>4. Ce qu'ils ont trouvé</h3>
<p><strong>Dix-sept minéraux</strong> : zircon, olivine, magnétite, ilménite, or, grenat, rutile, coltan, cassitérite, monazite, apatite, amphibole, tourmaline, pyrite, limonite, chromite et hornblende. La magnétite est presque partout. <strong>L'or est présent dans 23 échantillons</strong>, de 1,17 % à 45,45 % des grains comptés. Dans les plus riches, près d'un grain sur deux est de l'or.</p>
${fig('mineraux.png', 'Pourcentages des minéraux dans l\'échantillon T35G1', `Échantillon T35G1 : l'or dépasse 45 % des grains comptés. Fig. 4 de ${ART}.`)}
<p><strong>Les grains racontent leur voyage.</strong> Au nord, les grains sont souvent cristallins et encore attachés à du quartz : ils ont peu voyagé. Vers le sud, ils sont plus aplatis et portent des marques de chocs. Les auteurs estiment que l'or du nord est à environ <strong>50 m</strong> de sa source, et celui du sud à <strong>plus de 300 m</strong>.</p>
${fig('grains.png', 'Grains d\'or d\'Elogo à la loupe', `Grains d'or d'Elogo, cristallins, arrondis ou aplatis, parfois avec du quartz. Loupe ×30 à ×40. Fig. 6 de ${ART}.`)}

<h3>5. Où chercher la roche-mère ?</h3>
<p>Pour les auteurs, l'or est lié à des <strong>filons de quartz hydrothermaux</strong>, et peut-être à l'altération des sulfures des formations de fer rubané, comme à Mayoko. Ils proposent de chercher les filons et les formations de fer près des chantiers au nord, et à plus de 300 m en amont au sud.</p>
${fig('cibles.png', 'Zones de recherche proposées', `Les deux zones de recherche proposées : (1) au nord, source proche ; (2) au sud, source plus éloignée. Fig. 9 de ${ART}.`)}
<p><strong>Ce qui manque encore.</strong> Contrairement à l'étude des Saras, dans le Mayombe, où l'équipe avait mesuré la pureté de l'or à la microsonde, l'article d'Elogo ne donne aucune analyse chimique des grains. Les conclusions reposent sur la forme des grains et sur les minéraux associés. Les auteurs le disent eux-mêmes : la géochimie de l'or est la prochaine étape.</p>

<h3>6. Pendant ce temps, sur le terrain</h3>
<p>Nous avons comparé deux images du même cadrage, de 13 km sur 17 km. Sur la mosaïque Sentinel-2 de 2016, on voit surtout des clairières autour d'Elogo et de Zazou. Sur l'image WorldView-2 du 21 janvier 2022, de nouveaux chantiers apparaissent le long des rivières, au nord-ouest et jusqu'à Mayembe. Nous ne donnons pas de surface : les deux images n'ont ni la même résolution ni les mêmes couleurs, et un calcul automatique serait trompeur.</p>
${fig('elogo_2016_2022.jpg', 'Elogo en 2016 et en 2022', 'À gauche : Sentinel-2 cloudless 2016 by EOX (Copernicus), CC BY 4.0. À droite : Esri World Imagery, WorldView-2 du 21 janvier 2022 (Vantor / Maxar). Même cadrage, centré sur 1,82° N et 14,30° E.')}
<p>Mongabay rapportait en janvier 2025 qu'au moins <strong>79 permis semi-industriels d'exploration et d'exploitation de l'or</strong> avaient été accordés dans la Sangha en environ quatre ans. À Bamegod, voisin d'Elogo, des habitants y décrivent des ruisseaux devenus boueux, sans poissons, et une eau qu'on ne peut plus boire. L'article ne parle pas de mercure, et nous n'avons pas de mesure à Elogo.</p>

<h3>7. L'or dans le monde et en Afrique</h3>
${table(['Indicateur', 'Valeur', 'Source'], [
  ["Prix moyen de l'or, 3e trimestre 2026", '4 262 dollars l\'once (environ 137 dollars le gramme), +23 % en un an', 'World Gold Council, 3 nov. 2026'],
  ['Achats des banques centrales, 3e trimestre 2026', '321 tonnes', 'World Gold Council, 3 nov. 2026'],
  ['Production minière mondiale 2025', '3 672 tonnes', 'World Gold Council, 29 janv. 2026'],
])}
<p>L'or n'a jamais été aussi recherché, en grande partie par les banques centrales. En Afrique, le Ghana, le Mali ou le Burkina Faso tirent déjà une part importante de leurs revenus d'exportation de l'or. Pour le Congo, la question n'est donc pas seulement « y a-t-il de l'or ? », mais <strong>qui le connaît, qui le transforme et qui en profite</strong>. La loi minière du 18 avril 2026 prévoit la participation de l'État, le partage de production et la transformation avant l'exportation. Pour la négocier, il faut connaître les gisements : c'est le travail de la recherche.</p>

<h3>8. Limites</h3>
${liste([
  "Ce rapport est une synthèse : nous n'avons ni prélevé ni analysé d'échantillons.",
  "L'article ne donne ni teneur en or au mètre cube, ni pureté de l'or, ni coordonnées précises des sites ; nos coordonnées sont lues sur sa carte.",
  "Le nombre d'échantillons est ambigu dans l'article (40 concentrés, 40 coupes), et certains pourcentages statistiques ne concordent pas entre eux.",
  "La comparaison 2016 – 2022 est visuelle. Les dates des images sont celles des métadonnées : mosaïque Sentinel-2 de 2016, image WorldView-2 du 21 janvier 2022.",
  "Les chiffres du World Gold Council sont des estimations susceptibles d'être révisées.",
])}

<h3>9. Des sujets de thèse</h3>
${liste([
  "Mesurer la chimie des grains d'or d'Elogo (pureté, argent, inclusions) et la comparer à celle des Saras.",
  'Trouver, cartographier et dater la roche-mère : filons de quartz, formations de fer rubané, roches vertes.',
  'Mesurer ce que les chantiers font aux rivières : matières en suspension, poissons, mercure, eau potable.',
  'Suivre les chantiers par satellite, année par année, dans toute la Sangha.',
  "Estimer ce que l'or d'Elogo rapporte, et à qui : orpailleurs, sociétés, État, villages.",
])}
<p>Ça t'énerve de voir l'or partir, et la forêt avec, sans savoir combien ni pour qui ? Cette colère est légitime. Emmène-la à l'université : <strong>ta colère est ton sujet de thèse.</strong></p>

<h3>Sources</h3>
${liste([
  'Watha-Ndoudy N., Wamene Okoumel P.E., Miyouna T., Assouka Mpika R.H., Guembou Massala E., Souaty Mibantsa G., Mayenga K., Hell J.V., Kankeu B., Boudzoumou F. (2023). Characterization of Gold Bearing Placers and Associated Minerals in the Elogo Region (North-West Congo Republic). <em>Open Journal of Geology</em> 13:287-305. <a href="https://doi.org/10.4236/ojg.2023.135014" style="color:#1d4ed8;text-decoration:underline">doi:10.4236/ojg.2023.135014</a>. Figures reproduites sous licence CC BY 4.0.',
  'Makamba N.L., Bouenitela V.T.T., Matiaba-Bazika U.V., Boudzoumou F. (2023). Geochemistry and Petrogenesis of Basic and Ultrabasic Rocks Elogo Complex in Ivindo Archean Block (Congo Craton): Geodynamic Implications. <em>Open Journal of Geology</em> 13:107-135. <a href="https://doi.org/10.4236/ojg.2023.132006" style="color:#1d4ed8;text-decoration:underline">doi:10.4236/ojg.2023.132006</a>.',
  'Goldfarb R.J., Groves D.I., Gardoll S. (2001). Orogenic gold and geologic time: a global synthesis. <em>Ore Geology Reviews</em> 18:1-75.',
  'World Gold Council : Gold Demand Trends Q3 2026 (3 novembre 2026) ; Gold Demand Trends Full Year 2025, Supply (29 janvier 2026).',
  'Mongabay, E. Toto (30 janvier 2025). Mineral exploitation overshadows green diplomacy in Congo\'s Sangha region.',
  'Images : Sentinel-2 cloudless 2016 by EOX IT Services (données Copernicus modifiées), CC BY 4.0 ; Esri World Imagery, WorldView-2 du 21 janvier 2022 (Vantor / Maxar), date lue dans les métadonnées Esri.',
])}
`,
};
