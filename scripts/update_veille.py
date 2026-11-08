import html
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from xml.etree import ElementTree


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "data" / "veille.json"
FEEDS = {
    "articles-theme1": "IA developpement securite OR faille when:30d",
    "articles-theme2": "IA code donnees OR confidentialite OR propriete when:30d",
    "articles-theme3": "IA developpeur competences OR metier when:30d",
    "global": "IA developpeur vulnerabilite OR risque when:30d",
}
FEED_LIMITS = {
    "global": 18,
}


def feed_url(query):
    params = {"q": query, "hl": "fr", "gl": "FR", "ceid": "FR:fr"}
    return "https://news.google.com/rss/search?" + urlencode(params)


def clean_text(value):
    text = html.unescape(value or "")
    text = re.sub(r"<[^>]+>", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def parse_pub_date(value):
    try:
        return datetime.strptime(value, "%a, %d %b %Y %H:%M:%S %z")
    except ValueError:
        return datetime.min.replace(tzinfo=timezone.utc)


def load_feed(query, limit):
    request = Request(feed_url(query), headers={"User-Agent": "KrisPortfolioVeille/1.0"})
    with urlopen(request, timeout=20) as response:
        root = ElementTree.fromstring(response.read())

    articles = []
    for item in root.findall("./channel/item")[:limit]:
        title = clean_text(item.findtext("title"))
        link = (item.findtext("link") or "").strip()
        pub_date = (item.findtext("pubDate") or "").strip()
        description = clean_text(item.findtext("description"))
        if title and link:
            articles.append(
                {
                    "title": title,
                    "link": link,
                    "pubDate": pub_date,
                    "description": description,
                }
            )
    return sorted(articles, key=lambda article: parse_pub_date(article["pubDate"]), reverse=True)


def main():
    result = {
        "updatedAt": datetime.now(timezone.utc).isoformat(),
        "themes": {},
        "global": [],
    }

    for key, query in FEEDS.items():
        try:
            articles = load_feed(query, FEED_LIMITS.get(key, 6))
        except Exception as error:
            print(f"Unable to update {key}: {error}", file=sys.stderr)
            articles = []
        if key == "global":
            result["global"] = articles
        else:
            result["themes"][key] = articles[:3]

    total = len(result["global"]) + sum(len(items) for items in result["themes"].values())
    if total == 0:
        raise RuntimeError("No article could be retrieved; existing data was preserved.")

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
