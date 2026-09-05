# Pipeline de production d'une conférence Kongo Science

De l'idée à la mise en ligne, avec les visuels produits par IA et assemblés
dans Canva.

---

## Principe : qui possède quoi

| | Produit par | Pourquoi |
|---|---|---|
| **Arrière-plan de l'affiche** | IA | Aucune scène de terrain congolais n'existe en banque d'images |
| **Miniature YouTube (fond)** | IA | Même raison |
| **Titre, date, heure, contact** | Canva | Une IA écrit « CONFÉRENCE SCIENTIFOUE ». Et une heure fausse fait manquer la conférence |
| **Logo, typographie, bandeau** | Canva | La marque doit être identique au pixel près à chaque fois |
| **Photo de l'intervenant** | Photo réelle | Jamais générée |

**Règle unique : l'IA produit l'atmosphère, le gabarit porte les faits.**

Ce qui coûte 5 secondes à corriger dans Canva coûte une régénération complète
en IA — et tout le reste de l'image change avec.

---

## Étape 1 — La fiche conférence

Remplissez ceci **une fois**. Tout le reste en découle : le site, les
courriels, le sitemap, les deux prompts.

```
EventId          : conf-mayombe-bassin-cotier      (minuscules, tirets, jamais modifié)
Titre            : Du Mayombe au bassin côtier
Sous-titre       : Intérêts géologiques et économiques
Intervenant      : Dr Sage KEBI-TSOUMOU
Qualité          : Géologue · Docteur en géosciences
Date             : 2026-09-22
Heure Brazzaville: 19:30
Lieu             : En ligne (Zoom)
Contact          : 06 834 78 20
Accroche         : Comprendre notre sous-sol pour mieux valoriser ses potentialités
Thème visuel     : massif forestier ancien s'ouvrant sur une plaine côtière et l'océan,
                   strates géologiques visibles en coupe
Mots-clés visuels: roche, strates, forêt, littoral, sédiments, lumière rasante
```

L'`EventId` est le pivot : il nomme l'affiche, la page d'inscription
`/registration/<EventId>`, la ligne `EventsPrivate` et la campagne de
diffusion. **Ne le changez jamais après création.**

---

## Étape 2 — Prompt affiche (fond seul, 1080 × 1080)

> Recopiez ce prompt en remplaçant les crochets. Les trois dernières
> contraintes sont les plus importantes : sans elles, l'IA remplit toute
> l'image et vous n'avez plus où poser le texte.

```
Illustration éditoriale scientifique, format carré 1:1, 1080x1080 pixels.

SCÈNE
[Thème visuel de la fiche]. Vue en coupe géologique naturelle, lumière
rasante de fin de journée, atmosphère contemplative et documentaire.

STYLE
Illustration peinte à la main, texture de papier, précision d'une planche
scientifique du XIXe siècle revisitée. Ni photographie, ni rendu 3D, ni
image de banque d'images.

PALETTE
Vert forêt profond, terre de Sienne brûlée, ocre sable, crème chaud,
bleu océan sourd. Tons naturels et mats, aucune couleur fluorescente.

COMPOSITION — CONTRAINTE ESSENTIELLE
- Moitié supérieure : ciel ou surface calme, très peu de détail
- Tiers inférieur droit : zone sombre et unie
- Bande basse sur toute la largeur : sobre, sans élément marquant
Ces trois zones recevront du texte : elles doivent rester lisibles si
l'on y superpose des lettres claires.

INTERDICTIONS ABSOLUES
Aucun texte, aucune lettre, aucun chiffre, aucun logo, aucun filigrane.
Aucun visage, aucun personnage.
Aucun cadre ni bordure décorative.
```

**Pourquoi les zones calmes.** Votre affiche du Mayombe fonctionne parce que
le ciel et la mer y sont assez sobres pour accueillir le bloc d'informations.
Si l'IA remplit l'image de détails partout, aucun texte n'y sera lisible et
vous devrez tout régénérer.

**Deux ou trois générations suffisent.** Gardez celle dont les zones calmes
tombent au bon endroit, pas la plus spectaculaire.

---

## Étape 3 — Prompt miniature YouTube (fond seul, 1280 × 720)

Une miniature n'est **pas** une affiche recadrée. Elle est vue à environ
**320 × 180 pixels** dans un fil YouTube : tout ce qui est fin disparaît.

```
Illustration éditoriale scientifique, format paysage 16:9, 1280x720 pixels.

SCÈNE
[Thème visuel de la fiche], cadrage large et lisible.

STYLE
Illustration peinte, formes larges et contrastées. Peu d'éléments, très
peu de détail fin : l'image doit rester lisible réduite à 320x180 pixels.

PALETTE
Vert forêt profond, terre de Sienne brûlée, crème. Contraste marqué entre
les masses claires et sombres.

COMPOSITION — CONTRAINTE ESSENTIELLE
- Moitié GAUCHE : zone sombre et unie, elle recevra le titre en gros
- Moitié DROITE : le sujet visuel, bien contrasté
- Coin inférieur droit : laisser vide, YouTube y affiche la durée

INTERDICTIONS ABSOLUES
Aucun texte, aucune lettre, aucun chiffre, aucun logo, aucun visage.
```

**Sur Canva ensuite :** 4 à 6 mots maximum, en très gros. La photo de
l'intervenant détourée à droite améliore nettement le taux de clic — un
visage humain attire l'œil bien plus qu'un paysage.

---

## Étape 4 — Assemblage Canva

Créez **un gabarit par format**, réutilisé à chaque conférence. Seuls le
fond, le titre, la photo et les dates changent.

**Affiche 1080 × 1080**
1. Fond IA en calque du bas
2. Bandeau supérieur : « CONFÉRENCE SCIENTIFIQUE » + logo Kongo Science
3. Titre sur deux lignes, la seconde en terre de Sienne
4. Sous-titre en italique, filets de part et d'autre
5. Photo de l'intervenant, cercle, bord doré, en bas à gauche
6. Bloc informations en bas à droite : date, deux fuseaux, plateforme, contact
7. Bande basse : accroche en italique

**Miniature 1280 × 720**
1. Fond IA
2. Titre court à gauche, très gros
3. Photo détourée à droite
4. Petit logo dans un coin

---

## Étape 5 — Optimiser avant publication

Une affiche exportée par Canva pèse 2 à 3 Mo. Envoyée à 238 abonnés, elle
ralentit l'ouverture des courriels et sature certaines boîtes.

```bash
python scripts/preparer-visuels.py conf-mayombe-bassin-cotier ~/Downloads/affiche.png
```

Le script produit les versions optimisées et les place au bon endroit :

| Fichier | Usage | Poids visé |
|---|---|---|
| `public/affiches/<EventId>.jpg` | Courriel de diffusion, partage social | < 200 Ko |
| `src/assets/conf-<...>.png` | Carte de la conférence sur le site | < 500 Ko |

L'URL de l'affiche devient `https://www.kongoscience.com/affiches/<EventId>.jpg`.
Elle est **stable** : le dossier `public/` échappe au hachage des noms, donc
un courriel déjà parti continue d'afficher l'image.

---

## Étape 6 — Mise en ligne

1. **Site** : ajouter l'entrée dans `CONFERENCES` (`src/constants.ts`)
2. **Sitemap** : `python generate_sitemap.py`
3. **Publier** : `npm run build`, puis commit et push
4. **Zoom** : renseigner la ligne dans l'onglet `EventsPrivate` du classeur
   des inscriptions — sans elle, les inscrits n'ont pas le lien
5. **Diffusion** : ligne dans l'onglet `Campagnes`, statut `À préparer`,
   puis `preparerCampagnes`, `envoyerTestAMoi`, `envoyerLot`

⏱️ **Lancez la diffusion au moins 5 jours avant.** Il faut 3 jours pour
couvrir 238 abonnés à 100 courriels par jour, et les derniers prévenus
doivent avoir le temps de s'inscrire.

---

## Contrôle avant publication

- [ ] Aucune lettre ni chiffre dans les images générées
- [ ] Les zones destinées au texte sont restées calmes
- [ ] Miniature lisible réduite à 320 × 180 (dézoomez pour vérifier)
- [ ] Date, heure et fuseaux relus **sur l'affiche finale**
- [ ] `EventId` identique partout : fichier, site, `EventsPrivate`, campagne
- [ ] Affiche sous 200 Ko
- [ ] Photo de l'intervenant : accord obtenu

---

## Ce qu'il ne faut jamais confier à l'IA

**Le visage de l'intervenant.** Générer ou retoucher lourdement le portrait
d'une personne réelle est un problème d'image et de confiance.

**Les chiffres.** Dates, heures, tarifs, numéros. Toujours saisis à la main
dans Canva, puis relus sur le rendu final.

**Le logo.** Il existe en fichier. Une IA en produira une variante approchante
qui abîmera la marque sans que personne ne sache dire pourquoi.
