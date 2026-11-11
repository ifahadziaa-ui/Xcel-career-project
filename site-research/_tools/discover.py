"""Discover all internal pages of a site via sitemap + link crawling (raw HTTP)."""
import sys, re, json, urllib.request, urllib.parse, time
from bs4 import BeautifulSoup

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

def get(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as r:
        ct = r.headers.get("Content-Type", "")
        return r.status, ct, r.read(), r.geturl()

def norm(u, host):
    u, _ = urllib.parse.urldefrag(u)
    p = urllib.parse.urlparse(u)
    if p.netloc.replace("www.", "") != host.replace("www.", ""):
        return None
    if re.search(r"\.(jpg|jpeg|png|gif|svg|webp|pdf|zip|css|js|ico|mp4|woff2?|xml|docx?)$", p.path, re.I):
        return None
    if "/wp-json" in p.path or "/feed" in p.path or "xmlrpc" in p.path or "wp-login" in p.path:
        return None
    path = p.path or "/"
    q = f"?{p.query}" if p.query else ""
    return f"https://{host}{path}{q}"

def main(host):
    seeds = [f"https://{host}/"]
    # sitemaps
    for sm in ["sitemap.xml", "wp-sitemap.xml", "sitemap_index.xml", "page-sitemap.xml", "post-sitemap.xml"]:
        try:
            st, ct, body, _ = get(f"https://{host}/{sm}")
            if st == 200 and b"<loc>" in body:
                locs = re.findall(rb"<loc>([^<]+)</loc>", body)
                for l in locs:
                    l = l.decode()
                    if l.endswith(".xml"):
                        try:
                            _, _, b2, _ = get(l)
                            seeds += [x.decode() for x in re.findall(rb"<loc>([^<]+)</loc>", b2)]
                        except Exception as e:
                            print("  sitemap fail", l, e)
                    else:
                        seeds.append(l)
                print("sitemap ok:", sm, len(locs))
        except Exception as e:
            print("sitemap miss", sm, getattr(e, "code", e))
    seen, queue, found = set(), [], {}
    for s in seeds:
        n = norm(s, host)
        if n and n not in seen:
            seen.add(n); queue.append(n)
    while queue:
        url = queue.pop(0)
        try:
            st, ct, body, final = get(url)
        except Exception as e:
            print("ERR", url, getattr(e, "code", e)); found[url] = {"status": str(getattr(e, "code", e))}; continue
        if "html" not in ct:
            continue
        soup = BeautifulSoup(body, "lxml")
        title = soup.title.get_text(strip=True) if soup.title else ""
        found[url] = {"status": st, "final": final, "title": title}
        print(st, url, "|", title[:70])
        for a in soup.find_all("a", href=True):
            n = norm(urllib.parse.urljoin(final, a["href"]), host)
            if n and n not in seen and not n.startswith("mailto"):
                seen.add(n); queue.append(n)
        time.sleep(0.3)
    return found

if __name__ == "__main__":
    host = sys.argv[1]
    res = main(host)
    out = sys.argv[2]
    json.dump(res, open(out, "w"), indent=2)
    print("TOTAL", len(res))
