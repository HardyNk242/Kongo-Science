"""
Génère public/sitemap.xml pour kongoscience.com.

IMPORTANT — historique du bug corrigé ici :
l'ancienne version produisait des URLs de la forme `/?article=<id>`.
Or aucun composant de l'application ne lit la query string `?article=` :
le routeur (src/App.tsx) ne lit que `location.pathname`. Résultat, les
2904 URLs déclarées renvoyaient toutes la page d'accueil — soit, pour un
moteur de recherche, 2904 pages dupliquées consommant tout le budget de
crawl.

Les URLs suivent désormais le routeur réel :
    thèse   -> /library/<id>       (App.tsx : case 'library'      -> initialThesisId)
    article -> /publications/<id>  (App.tsx : case 'publications' -> initialArticleId)
"""

import re
import datetime
import urllib.parse
from pathlib import Path

# --- CONFIGURATION ---
LIBRARY_FILE = Path("src/data/library.ts")
ARTICLES_FILE = Path("src/data/articles.ts")
CONSTANTS_FILE = Path("src/constants.ts")
OUTPUT_FILE = Path("public/sitemap.xml")
BASE_URL = "https://kongoscience.com"

# Routes fixes servies par le routeur de src/App.tsx.
# priority : importance relative, changefreq : fréquence de mise à jour.
STATIC_ROUTES = [
    ("/", "daily", "1.0"),
    ("/library", "daily", "0.9"),
    ("/publications", "weekly", "0.8"),
    ("/agenda", "weekly", "0.8"),
    ("/programmes", "monthly", "0.8"),
    ("/offres", "monthly", "0.7"),
    ("/rejoindre", "monthly", "0.7"),
    ("/history", "yearly", "0.5"),
    ("/team", "monthly", "0.5"),
    ("/proposal", "yearly", "0.4"),
]


def extract_ids(path: Path) -> list[str]:
    """Relève les identifiants `id: '...'` du fichier de données."""
    try:
        content = path.read_text(encoding="utf-8")
    except FileNotFoundError:
        print(f"Avertissement : {path} introuvable, ignoré.")
        return []

    ids = re.findall(r"id:\s*['\"](.*?)['\"]", content)

    # Dédoublonnage en conservant l'ordre d'apparition.
    vus = set()
    uniques = []
    for identifiant in ids:
        if identifiant and identifiant not in vus:
            vus.add(identifiant)
            uniques.append(identifiant)
    return uniques


def extract_conference_ids(path: Path) -> list[str]:
    """
    Relève les identifiants de conférences dans constants.ts.

    On ne peut pas réutiliser extract_ids ici : le fichier contient aussi les
    identifiants des objectifs et de l'équipe. On ne retient donc que ceux
    préfixés « conf- », qui correspondent à la route /registration/<id>.
    """
    try:
        content = path.read_text(encoding="utf-8")
    except FileNotFoundError:
        print(f"Avertissement : {path} introuvable, ignoré.")
        return []

    ids = re.findall(r"id:\s*['\"](conf-[^'\"]+)['\"]", content)
    vus = set()
    uniques = []
    for identifiant in ids:
        if identifiant not in vus:
            vus.add(identifiant)
            uniques.append(identifiant)
    return uniques


def bloc_url(loc: str, changefreq: str, priority: str, lastmod: str | None = None) -> str:
    xml = "  <url>\n"
    xml += f"    <loc>{loc}</loc>\n"
    if lastmod:
        xml += f"    <lastmod>{lastmod}</lastmod>\n"
    xml += f"    <changefreq>{changefreq}</changefreq>\n"
    xml += f"    <priority>{priority}</priority>\n"
    xml += "  </url>\n"
    return xml


def generate_sitemap() -> None:
    print("Analyse des fichiers de données...")

    theses = extract_ids(LIBRARY_FILE)
    articles = extract_ids(ARTICLES_FILE)
    conferences = extract_conference_ids(CONSTANTS_FILE)
    print(f"{len(theses)} thèses, {len(articles)} articles et {len(conferences)} conférences trouvés.")

    today = datetime.date.today().isoformat()

    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

    for chemin, changefreq, priority in STATIC_ROUTES:
        xml += bloc_url(f"{BASE_URL}{chemin}", changefreq, priority)

    for identifiant in theses:
        # quote() encode accents et caractères réservés ; safe="" encode aussi le "/"
        # afin qu'un identifiant fantaisiste ne puisse pas fabriquer un faux segment d'URL.
        segment = urllib.parse.quote(identifiant, safe="")
        xml += bloc_url(f"{BASE_URL}/library/{segment}", "monthly", "0.7", today)

    for identifiant in articles:
        segment = urllib.parse.quote(identifiant, safe="")
        xml += bloc_url(f"{BASE_URL}/publications/{segment}", "monthly", "0.6", today)

    for identifiant in conferences:
        segment = urllib.parse.quote(identifiant, safe="")
        xml += bloc_url(f"{BASE_URL}/registration/{segment}", "weekly", "0.6", today)

    xml += "</urlset>"

    OUTPUT_FILE.write_text(xml, encoding="utf-8")

    total = len(STATIC_ROUTES) + len(theses) + len(articles) + len(conferences)
    print(f"Succès : {total} URLs écrites dans {OUTPUT_FILE}")
    print(f"  - {len(STATIC_ROUTES)} routes fixes")
    print(f"  - {len(theses)} thèses en /library/<id>")
    print(f"  - {len(articles)} articles en /publications/<id>")
    print(f"  - {len(conferences)} conférences en /registration/<id>")


if __name__ == "__main__":
    generate_sitemap()
