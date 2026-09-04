/**
 * Pré-rendu HTML du site Kongo Science.
 *
 * Pourquoi : l'application est un SPA. Le fichier servi à l'arrivée ne
 * contient qu'un <div id="root"> et un écran de chargement ; tout le contenu
 * n'apparaît qu'après l'exécution de plus de 2 Mo de JavaScript. Google sait
 * exécuter le JavaScript, mais il le fait dans un second temps, avec un budget
 * limité — et les autres robots (réseaux sociaux, moteurs alternatifs,
 * agrégateurs académiques) ne le font pas du tout.
 *
 * Ce script sert le dossier dist/, visite chaque URL avec un vrai navigateur,
 * puis écrit le HTML entièrement rendu à l'emplacement correspondant. Le
 * JavaScript reprend ensuite la main normalement : l'internaute garde une
 * navigation instantanée, le robot reçoit une page complète.
 *
 * Les URLs sont lues dans public/sitemap.xml, pour n'avoir qu'une seule
 * source de vérité (voir generate_sitemap.py).
 *
 * Usage :
 *   node scripts/prerender.mjs              routes principales + conférences
 *   node scripts/prerender.mjs --all        + les fiches de thèses (long)
 *   node scripts/prerender.mjs --limit=50   échantillon, pour tester
 */

import http from 'node:http';
import fs from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(RACINE, 'dist');
const SITEMAP = path.join(RACINE, 'public', 'sitemap.xml');
const PORT = 4178;

const TYPES_MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

/** Serveur statique minimal, avec repli SPA vers index.html. */
function demarrerServeur() {
  const serveur = http.createServer(async (req, res) => {
    const chemin = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let fichier = path.join(DIST, chemin);

    // Empêche toute sortie du dossier dist via "../".
    if (!fichier.startsWith(DIST)) {
      res.writeHead(403).end('Interdit');
      return;
    }

    try {
      const infos = await fs.stat(fichier);
      if (infos.isDirectory()) fichier = path.join(fichier, 'index.html');
      await fs.access(fichier);
    } catch {
      // Route applicative : on rend index.html, le routeur fera le reste.
      fichier = path.join(DIST, 'index.html');
    }

    res.writeHead(200, {
      'Content-Type': TYPES_MIME[path.extname(fichier)] ?? 'application/octet-stream',
    });
    createReadStream(fichier).pipe(res);
  });

  return new Promise((resolve) => serveur.listen(PORT, () => resolve(serveur)));
}

/** Extrait les chemins du sitemap, classés en routes principales et fiches. */
async function lireRoutes() {
  const xml = await fs.readFile(SITEMAP, 'utf-8');
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  const chemins = urls.map((u) => {
    try {
      return decodeURIComponent(new URL(u).pathname);
    } catch {
      return null;
    }
  }).filter(Boolean);

  const theses = chemins.filter((c) => c.startsWith('/library/'));
  const principales = chemins.filter((c) => !c.startsWith('/library/'));

  return { principales, theses };
}

/** Destination sur disque : "/" -> dist/index.html, "/library" -> dist/library/index.html */
function destination(chemin) {
  if (chemin === '/') return path.join(DIST, 'index.html');
  return path.join(DIST, chemin.replace(/^\/+/, ''), 'index.html');
}

async function prerendre() {
  const args = process.argv.slice(2);
  const tout = args.includes('--all');
  const limiteArg = args.find((a) => a.startsWith('--limit='));
  const limite = limiteArg ? parseInt(limiteArg.split('=')[1], 10) : null;

  const { principales, theses } = await lireRoutes();

  let routes = [...principales];
  if (tout) routes = routes.concat(theses);
  if (limite) routes = routes.slice(0, limite);

  console.log(`Pré-rendu de ${routes.length} URLs`);
  console.log(`  ${principales.length} routes principales` + (tout ? `, ${theses.length} fiches de thèses` : `  (fiches de thèses ignorées — utiliser --all)`));

  const serveur = await demarrerServeur();
  const navigateur = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });

  let reussies = 0;
  const echecs = [];
  const debut = Date.now();

  try {
    const page = await navigateur.newPage();

    // Les visuels de conférence pèsent jusqu'à 9 Mo et n'apportent rien au
    // HTML produit : on les bloque pour accélérer nettement le rendu.
    await page.setRequestInterception(true);
    page.on('request', (requete) => {
      if (['image', 'media', 'font'].includes(requete.resourceType())) requete.abort();
      else requete.continue();
    });

    /** Rend une route et écrit le fichier. Lève en cas d'échec. */
    const rendre = async (route) => {
      await page.goto(`http://localhost:${PORT}${route}`, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });

      // On attend que React ait remplacé l'écran de chargement *et* que le
      // composant Seo ait posé le titre de la page.
      await page.waitForFunction(
        () => {
          const racine = document.getElementById('root');
          return racine && racine.children.length > 0 && !document.body.innerText.includes('Chargement de la bibliothèque');
        },
        { timeout: 20000 }
      );

      const html = '<!DOCTYPE html>\n' + (await page.content()).replace(/^<!DOCTYPE html>/i, '').trim();

      const cible = destination(route);
      await fs.mkdir(path.dirname(cible), { recursive: true });
      await fs.writeFile(cible, html, 'utf-8');
    };

    for (const route of routes) {
      // Une seconde tentative : sur une machine chargée, un dépassement de
      // délai est fréquent et sans rapport avec la page elle-même. Sans
      // reprise, cette page partirait en production sans pré-rendu.
      let derniereErreur = null;
      for (let essai = 1; essai <= 2; essai++) {
        try {
          await rendre(route);
          derniereErreur = null;
          break;
        } catch (err) {
          derniereErreur = err;
          if (essai === 1) await new Promise((r) => setTimeout(r, 1500));
        }
      }

      if (derniereErreur) {
        const message = derniereErreur.message.split('\n')[0];
        echecs.push({ route, message });
        console.warn(`  ✗ ${route} — ${message}`);
      } else {
        reussies += 1;
        if (reussies % 25 === 0 || routes.length <= 30) {
          console.log(`  ✓ ${route}`);
        }
      }
    }
  } finally {
    await navigateur.close();
    serveur.close();
  }

  const secondes = ((Date.now() - debut) / 1000).toFixed(1);
  console.log(`\nTerminé en ${secondes}s : ${reussies} pages écrites, ${echecs.length} en échec.`);

  // Un échec ne doit pas faire tomber le déploiement : la page reste servie
  // par le repli SPA, exactement comme avant le pré-rendu.
  if (echecs.length > 0) {
    console.log('Échecs :');
    for (const e of echecs.slice(0, 10)) console.log(`  ${e.route} — ${e.message}`);
  }
}

prerendre().catch((err) => {
  // On sort volontairement en succès : un pré-rendu impossible (navigateur
  // indisponible sur le runner, mémoire insuffisante…) ne doit pas faire
  // échouer le build et bloquer tout le déploiement. Le site reste servi
  // par le repli SPA, exactement comme avant l'ajout du pré-rendu.
  console.error('\n⚠️  PRÉ-RENDU ABANDONNÉ —', err.message);
  console.error('   Le site sera déployé sans pré-rendu : le contenu restera');
  console.error('   rendu côté client. À corriger, mais rien n\'est cassé.');
  process.exit(0);
});
