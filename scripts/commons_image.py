#!/usr/bin/env python3
"""
Busca imágenes con licencia libre en Wikimedia Commons para las noticias de TodoEnergías.

Uso:
  python3 scripts/commons_image.py "parque eólico Argentina" "wind farm"     # buscar candidatas
  python3 scripts/commons_image.py --check "File:Nombre del archivo.jpg"      # licencia + URL final

Imprime por cada candidata: título | autor | licencia | URL (1280 px, host upload.wikimedia.org).
Solo devuelve imágenes de al menos 1000 px de ancho y con licencia reutilizable (CC0, CC BY, CC BY-SA, dominio público).
"""
import json
import re
import sys
import urllib.parse
import urllib.request

API = "https://commons.wikimedia.org/w/api.php"
UA = {"User-Agent": "TodoEnergiasBot/1.0 (https://todoenergias.com.ar)"}
OK_LICENSE = re.compile(r"^(CC0|CC BY|CC-BY|CC BY-SA|CC-BY-SA|Public domain|PD)", re.I)


def _get(params):
    url = API + "?" + urllib.parse.urlencode(params)
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as r:
        return json.load(r)


def _row(page):
    ii = page.get("imageinfo", [{}])[0]
    meta = ii.get("extmetadata", {})
    artist = re.sub(r"<[^>]+>", "", meta.get("Artist", {}).get("value", "")).strip().replace("\n", " ")[:80]
    lic = meta.get("LicenseShortName", {}).get("value", "")
    url = (ii.get("thumburl") or ii.get("url") or "").split("?")[0].replace("thumb.wikimedia.org", "upload.wikimedia.org")
    return page.get("title", ""), artist, lic, url, ii.get("width", 0)


def search(query, limit=6):
    data = _get({
        "action": "query", "format": "json", "generator": "search",
        "gsrsearch": f"{query} filetype:bitmap", "gsrnamespace": "6", "gsrlimit": str(limit),
        "prop": "imageinfo", "iiprop": "url|extmetadata|size", "iiurlwidth": "1280",
    })
    for page in (data.get("query", {}).get("pages", {}) or {}).values():
        title, artist, lic, url, width = _row(page)
        if width >= 1000 and OK_LICENSE.match(lic):
            print(f"{title} | {artist} | {lic} | {url}")


def check(titles):
    data = _get({
        "action": "query", "format": "json", "titles": "|".join(titles),
        "prop": "imageinfo", "iiprop": "url|extmetadata|size", "iiurlwidth": "1280",
    })
    for page in data.get("query", {}).get("pages", {}).values():
        if "imageinfo" not in page:
            print(f"MISSING | {page.get('title')}")
            continue
        title, artist, lic, url, _ = _row(page)
        print(f"{title} | {artist} | {lic} | {url}")


if __name__ == "__main__":
    args = sys.argv[1:]
    if not args:
        print(__doc__)
    elif args[0] == "--check":
        check(args[1:])
    else:
        for q in args:
            print(f"## {q}")
            try:
                search(q)
            except Exception as exc:  # noqa: BLE001
                print(f"ERROR {exc}")
