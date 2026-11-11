# Capture tools

Requirements: Python 3.12, `pip install playwright beautifulsoup4 lxml`, Google Chrome installed (used via `channel="chrome"`, no browser download needed).

```bash
# 1. discover all URLs (sitemap + link crawl) -> JSON
python discover.py xcelcareers.com xcel_pages.json
# 2. render every page at 1440/820/390 and capture everything (optionally split: part=0/2, part=1/2)
python capture.py xcel_pages.json ../xcelcareers-current-site
# 3. build PAGE.md for every page + SITE-DATA.md
python render.py ../xcelcareers-current-site xcelcareers.com "XcelCareers (client's current site)"
# 4. optional: open dropdowns + hover before/after crops on one page
python interactions.py https://trecig.com/ ../trecig-reference-site/pages/home/interactions "a.elementor-button" ".elementor-social-icon"
```

`extract.js` is injected into each page by `capture.py` (element tree + computed styles).
