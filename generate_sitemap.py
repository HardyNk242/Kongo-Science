import re
import datetime
import urllib.parse

# --- CONFIGURATION ---
input_file = r"src/data/library.ts"
output_file = r"public/sitemap.xml"
# Replace with your real production URL
base_url = "https://kongoscience.com"


def generate_sitemap():
    print("Analyse de library.ts en cours...")

    ids = []

    # Read as UTF-8 to preserve accents
    try:
        with open(input_file, "r", encoding="utf-8") as f:
            content = f.read()
            matches = re.findall(r"id:\s*['\"](.*?)['\"]", content)
            ids = matches
    except FileNotFoundError:
        print(f"Erreur: Impossible de trouver {input_file}")
        return

    print(f"{len(ids)} articles trouvés.")

    # XML header
    xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

    # 1. Homepage
    xml_content += "  <url>\n"
    xml_content += f"    <loc>{base_url}/</loc>\n"
    xml_content += "    <changefreq>daily</changefreq>\n"
    xml_content += "    <priority>1.0</priority>\n"
    xml_content += "  </url>\n"

    today = datetime.date.today().isoformat()

    # 2. Articles
    for article_id in ids:
        safe_id = urllib.parse.quote(article_id)
        xml_content += "  <url>\n"
        xml_content += f"    <loc>{base_url}/?article={safe_id}</loc>\n"
        xml_content += f"    <lastmod>{today}</lastmod>\n"
        xml_content += "    <changefreq>monthly</changefreq>\n"
        xml_content += "    <priority>0.7</priority>\n"
        xml_content += "  </url>\n"

    xml_content += "</urlset>"

    # Save as UTF-8
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(xml_content)

    print(f"Succès ! Sitemap généré ici : {output_file}")
    print("Les accents ont été convertis en format URL sécurisé (ex: %C3%A9).")


if __name__ == "__main__":
    generate_sitemap()
