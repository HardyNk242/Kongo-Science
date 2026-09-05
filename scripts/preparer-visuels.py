"""
Prépare les visuels d'une conférence pour le site et les courriels.

Pourquoi ce script existe : une affiche exportée par Canva pèse 2 à 3 Mo.
Envoyée à 238 abonnés, elle ralentit l'ouverture des messages et sature
certaines boîtes. L'affiche du Mayombe faisait 2,6 Mo ; ramenée à 174 Ko,
elle se charge en un tiers de seconde sans perte visible.

Usage
-----
    python scripts/preparer-visuels.py <EventId> <affiche> [miniature]

    python scripts/preparer-visuels.py conf-mayombe-bassin-cotier \
        ~/Downloads/affiche.png ~/Downloads/miniature.png

Produit
-------
    public/affiches/<EventId>.jpg          affiche pour courriel et partage
    public/affiches/<EventId>-yt.jpg       miniature YouTube (si fournie)
    src/assets/<EventId>.jpg               carte de la conférence sur le site

Le dossier public/ échappe au hachage des noms de fichiers : l'URL reste
identique d'un déploiement à l'autre, ce qui compte pour un courriel déjà
parti.
"""

import sys
import re
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow est requis :  pip install Pillow")

RACINE = Path(__file__).resolve().parent.parent

# Largeur, qualité, poids maximal visé. Au-delà de 800 px, aucun client de
# messagerie n'affiche l'image plus grande : le surplus ne fait que ralentir.
FORMATS = {
    "affiche": {
        "cible": RACINE / "public" / "affiches",
        "largeur": 800,
        "qualite": 82,
        "max_ko": 250,
        "carre": True,
    },
    "miniature": {
        "cible": RACINE / "public" / "affiches",
        "largeur": 1280,
        "qualite": 80,
        "max_ko": 350,
        "carre": False,
        "suffixe": "-yt",
    },
    "carte": {
        "cible": RACINE / "src" / "assets",
        "largeur": 1200,
        "qualite": 85,
        "max_ko": 500,
        "carre": True,
    },
}


def valider_event_id(event_id: str) -> str:
    """L'EventId nomme le fichier, l'URL et la campagne : il doit rester sobre."""
    propre = event_id.strip().lower()
    if not re.fullmatch(r"[a-z0-9-]+", propre):
        sys.exit(
            f"EventId invalide : {event_id!r}\n"
            "Uniquement des minuscules, chiffres et tirets — il sert d'URL."
        )
    return propre


def optimiser(source: Path, reglage: dict, nom_sortie: str) -> Path:
    im = Image.open(source)
    poids_origine = source.stat().st_size / 1024

    largeur = reglage["largeur"]
    if reglage["carre"]:
        # On recadre au centre plutôt que de déformer : une affiche étirée
        # se voit immédiatement.
        cote = min(im.size)
        gauche = (im.width - cote) // 2
        haut = (im.height - cote) // 2
        im = im.crop((gauche, haut, gauche + cote, haut + cote))
        hauteur = largeur
    else:
        hauteur = round(im.height * largeur / im.width)

    im = im.convert("RGB").resize((largeur, hauteur), Image.LANCZOS)

    reglage["cible"].mkdir(parents=True, exist_ok=True)
    destination = reglage["cible"] / nom_sortie

    # On redescend la qualité tant que le poids visé n'est pas atteint,
    # plutôt que d'imposer un réglage unique qui échouerait sur une image
    # très détaillée.
    qualite = reglage["qualite"]
    while qualite >= 60:
        im.save(destination, "JPEG", quality=qualite, optimize=True, progressive=True)
        poids = destination.stat().st_size / 1024
        if poids <= reglage["max_ko"]:
            break
        qualite -= 6

    reduction = (1 - poids / poids_origine) * 100 if poids_origine else 0
    print(
        f"  {destination.relative_to(RACINE)}\n"
        f"      {largeur}x{hauteur}px · {poids:.0f} Ko "
        f"(qualité {qualite}, {reduction:.0f} % de moins que l'original)"
    )
    if poids > reglage["max_ko"]:
        print(
            f"      ⚠️  {poids:.0f} Ko dépasse la cible de {reglage['max_ko']} Ko. "
            "L'image est sans doute très détaillée ; à surveiller en courriel."
        )
    return destination


def main() -> None:
    if len(sys.argv) < 3:
        sys.exit(__doc__)

    event_id = valider_event_id(sys.argv[1])
    affiche = Path(sys.argv[2]).expanduser()
    miniature = Path(sys.argv[3]).expanduser() if len(sys.argv) > 3 else None

    if not affiche.exists():
        sys.exit(f"Affiche introuvable : {affiche}")
    if miniature and not miniature.exists():
        sys.exit(f"Miniature introuvable : {miniature}")

    print(f"Conférence : {event_id}\n")

    print("Affiche (courriel et partage) :")
    optimiser(affiche, FORMATS["affiche"], f"{event_id}.jpg")

    print("\nCarte du site :")
    optimiser(affiche, FORMATS["carte"], f"{event_id}.jpg")

    if miniature:
        print("\nMiniature YouTube :")
        reglage = FORMATS["miniature"]
        optimiser(miniature, reglage, f"{event_id}{reglage['suffixe']}.jpg")

    print(f"""
À reporter ensuite :

  1. src/constants.ts — importer la carte et l'ajouter à CONFERENCES
       import {event_id.replace('-', '_')}Card from './assets/{event_id}.jpg';

  2. Onglet Campagnes du classeur Diffusion, colonne « Lien affiche » :
       https://www.kongoscience.com/affiches/{event_id}.jpg

  3. python generate_sitemap.py   puis   npm run build
""")


if __name__ == "__main__":
    main()
