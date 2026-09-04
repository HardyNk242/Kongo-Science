# Indexation du site Kongo Science

Ce document explique ce qui empêchait l'indexation, ce qui a été corrigé, et
les gestes à connaître pour ne pas réintroduire les mêmes défauts.

## Ce qui bloquait

### 1. Un sitemap qui pointait 2904 fois vers la même page

`generate_sitemap.py` produisait des URLs de la forme `/?article=<id>`.
Or aucun composant de l'application ne lit la query string `?article=` : le
routeur (`src/App.tsx`) ne lit que `location.pathname`. Les 2904 URLs
déclarées renvoyaient donc toutes la page d'accueil.

Pour un moteur de recherche, c'était 2904 pages au contenu identique — un
signal de duplication massif, et tout le budget de crawl dépensé pour rien.

**Corrigé** : les URLs suivent désormais les routes réelles.

| Contenu | URL |
|---|---|
| Thèse | `/library/<id>` |
| Article | `/publications/<id>` |
| Conférence | `/registration/<id>` |

### 2. Aucun lien explorable

Toute la navigation reposait sur `<button onClick={navigateTo}>`. Un bouton
n'est pas un lien : Googlebot arrivait sur l'accueil et n'y trouvait aucune
porte vers les autres pages. Sur 19 attributs `href` du code, aucun ne
pointait vers une route interne.

**Corrigé** : le composant [`SmartLink`](../src/components/SmartLink.tsx) rend
un vrai `<a href>` tout en conservant la navigation instantanée. Il est
appliqué au Header (menu, sous-menus, logo, bouton « Rejoindre ») et au titre
de chaque thèse.

> **Règle à tenir.** Tout nouvel élément de navigation doit être un
> `SmartLink`, jamais un `<button onClick>`. Un bouton reste légitime pour une
> action (ouvrir une fenêtre, soumettre un formulaire), pas pour aller
> ailleurs sur le site.

### 3. Un seul titre pour onze pages

`react-helmet-async` 2.0.5 **est inopérant sous React 19** : il n'injecte rien
et ne lève aucune erreur. De plus, aucun `HelmetProvider` n'était monté. Les
onze routes partageaient donc le `<title>` de `index.html`.

**Corrigé** : le composant [`Seo`](../src/components/Seo.tsx) met à jour titre,
description, URL canonique et balises de partage — sans dépendance, et en
modifiant les balises existantes plutôt qu'en les dupliquant.

Les textes de chaque route sont centralisés dans `SEO_ROUTES`
(`src/constants.ts`). Les pages de détail (une thèse, un article) déclarent
leur propre `<Seo>`, qui prend le dessus.

## Le pré-rendu

Même corrigé, le site reste un SPA : le HTML servi ne contient qu'un
`<div id="root">` vide. Google sait exécuter le JavaScript, mais il le fait
dans un second temps et avec un budget limité ; les robots des réseaux
sociaux et des agrégateurs académiques ne le font pas du tout.

[`scripts/prerender.mjs`](../scripts/prerender.mjs) sert `dist/`, visite chaque
URL avec un vrai navigateur, et écrit le HTML entièrement rendu à
l'emplacement correspondant :

```
dist/index.html
dist/library/index.html
dist/agenda/index.html
dist/registration/conf-mayombe-bassin-cotier/index.html
...
```

Le JavaScript reprend ensuite la main normalement : l'internaute garde sa
navigation instantanée, le robot reçoit une page complète.

### Commandes

```bash
npm run build                  # build + pré-rendu des routes principales
node scripts/prerender.mjs --all      # + les 2809 fiches de thèses (long)
node scripts/prerender.mjs --limit=20 # échantillon, pour tester
```

Les URLs pré-rendues sont lues dans `public/sitemap.xml` : une seule source de
vérité. Pensez donc à régénérer le sitemap avant le build si vous avez ajouté
du contenu :

```bash
python generate_sitemap.py
```

### Pourquoi les fiches de thèses ne sont pas pré-rendues par défaut

2809 pages représentent un temps de build et un volume de fichiers
considérables dans l'intégration continue. Elles restent parfaitement
indexables : leurs URLs sont valides, elles sont liées depuis
`/library` et déclarées au sitemap — Google les rendra en exécutant le
JavaScript. Passez `--all` si vous voulez les figer aussi.

## Défaut connu, non corrigé

**37 identifiants de thèses sont dupliqués** dans `src/data/library.ts`
(98 lignes en trop). `art-unk-2015-republic` apparaît **49 fois**.

Conséquence : `/library/art-unk-2015-republic` n'affichera jamais que la
première thèse portant cet identifiant. Les 48 autres sont inatteignables par
URL, et absentes du sitemap après dédoublonnage.

La correction demande de régénérer des identifiants uniques dans le fichier de
données — chantier à part entière.

## Après mise en ligne

1. Déclarer le site dans la **Google Search Console** (propriété de domaine).
2. Y soumettre `https://kongoscience.com/sitemap.xml`.
3. Utiliser l'**inspection d'URL** sur une fiche de thèse pour vérifier que
   Google voit bien le contenu et non l'écran de chargement.
4. Surveiller le rapport **Pages** : les anciennes URLs `/?article=` vont
   sortir de l'index progressivement.
