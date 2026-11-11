"""Render every page of a site in real Chrome and capture layout, styles, behaviour, screenshots, assets."""
import sys, json, os, re, hashlib, time, urllib.parse, traceback
from playwright.sync_api import sync_playwright

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
UA_M = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
VIEWPORTS = {"desktop": (1440, 900), "tablet": (820, 1180), "mobile": (390, 844)}
HERE = os.path.dirname(os.path.abspath(__file__))
EXTRACT_JS = open(os.path.join(HERE, "extract.js"), encoding="utf-8").read()


def slug(url):
    p = urllib.parse.urlparse(url)
    s = p.path.strip("/") or "home"
    return re.sub(r"[^a-zA-Z0-9_-]+", "__", s)[:90]


def asset_rel(url):
    p = urllib.parse.urlparse(url)
    path = p.path.lstrip("/") or "index"
    root, ext = os.path.splitext(path)
    if p.query:
        root += "_" + hashlib.md5(p.query.encode()).hexdigest()[:6]
    rel = f"{p.netloc}/{root}{ext}"
    rel = re.sub(r'[<>:"|?*]', "_", rel)
    parts = rel.split("/")
    parts = [x[:80] for x in parts]
    return "/".join(parts)


def j(o, path):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(o, f, indent=1, ensure_ascii=False)


TOKENS_JS = r"""() => {
  const vars = {}, fontFaces = [], keyframes = new Set(), media = new Set(), sheets = [];
  const grab = (rules, src) => {
    for (const r of rules) {
      try {
        if (r.type === 1 && r.style) {
          const sel = r.selectorText || '';
          if (/(:root|^body|^html|elementor-kit-|\.wp-site-blocks|editor-styles-wrapper)/.test(sel)) {
            for (const p of r.style) if (p.startsWith('--')) { (vars[p] = vars[p] || new Set()).add(r.style.getPropertyValue(p).trim().slice(0,200)); }
          }
        } else if (r.type === 5) {
          fontFaces.push({family: r.style.getPropertyValue('font-family'), weight: r.style.getPropertyValue('font-weight'), style: r.style.getPropertyValue('font-style'), src: r.style.getPropertyValue('src').slice(0, 220), sheet: src});
        } else if (r.type === 7) { keyframes.add(r.name); }
        else if (r.type === 4) { media.add(r.conditionText || r.media.mediaText); if (r.cssRules) grab(r.cssRules, src); }
        else if (r.cssRules) grab(r.cssRules, src);
      } catch (e) {}
    }
  };
  for (const s of document.styleSheets) {
    let rules; try { rules = s.cssRules; } catch (e) { sheets.push({href: s.href, crossOrigin: true}); continue; }
    sheets.push({href: s.href || '(inline #' + (s.ownerNode && s.ownerNode.id || '') + ')', rules: rules.length});
    grab(rules, s.href || 'inline');
  }
  const rootCs = getComputedStyle(document.documentElement);
  const resolved = {};
  for (const k of Object.keys(vars)) resolved[k] = { declared: [...vars[k]], computed: rootCs.getPropertyValue(k).trim() || getComputedStyle(document.body).getPropertyValue(k).trim() };
  const bcs = getComputedStyle(document.body);
  return { cssVars: resolved, fontFaces, keyframes: [...keyframes], mediaQueries: [...media], stylesheets: sheets,
    body: { bg: bcs.backgroundColor, color: bcs.color, fontFamily: bcs.fontFamily, fontSize: bcs.fontSize, lineHeight: bcs.lineHeight },
    loadedFonts: [...document.fonts].filter(f => f.status === 'loaded').map(f => `${f.family} ${f.weight} ${f.style}`) };
}"""

USAGE_JS = r"""() => {
  const fonts = {}, colors = {}, bgs = {}, radii = {}, shadows = {}, gradients = {};
  const inc = (o, k, n=1) => { if (!k) return; o[k] = (o[k] || 0) + n; };
  for (const el of document.body.querySelectorAll('*')) {
    const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
    if (cs.display === 'none' || cs.visibility === 'hidden' || r.width < 1 || r.height < 1) continue;
    let t = 0; el.childNodes.forEach(n => { if (n.nodeType === 3) t += n.textContent.trim().length; });
    if (t) { inc(fonts, `${cs.fontFamily.split(',')[0].replace(/["']/g,'')} | ${cs.fontWeight} | ${cs.fontSize} / ${cs.lineHeight}`, t); inc(colors, cs.color, t); }
    if (cs.backgroundColor !== 'rgba(0, 0, 0, 0)') inc(bgs, cs.backgroundColor, Math.round(r.width * r.height / 1000));
    if (cs.backgroundImage.includes('gradient')) inc(gradients, cs.backgroundImage.slice(0, 300));
    if (cs.borderRadius !== '0px') inc(radii, cs.borderRadius);
    if (cs.boxShadow !== 'none') inc(shadows, cs.boxShadow);
  }
  const top = (o, n=25) => Object.entries(o).sort((a,b) => b[1]-a[1]).slice(0, n);
  return { textStyles: top(fonts, 40), textColors: top(colors), backgrounds: top(bgs), gradients: top(gradients, 15), radii: top(radii, 15), shadows: top(shadows, 15) };
}"""

SECTIONS_JS = r"""() => {
  const vis = el => { const cs = getComputedStyle(el); const r = el.getBoundingClientRect(); return cs.display !== 'none' && cs.visibility !== 'hidden' && r.height > 4 && r.width > 4; };
  const pick = sels => { for (const s of sels) { const e = document.querySelector(s); if (e && vis(e)) return e; } return null; };
  const header = pick(['header.wp-block-template-part','[data-elementor-type="header"]','#site-header','header.site-header','header']);
  const footer = pick(['footer.wp-block-template-part','[data-elementor-type="footer"]','#site-footer','footer.site-footer','footer']);
  const main = pick(['[data-elementor-type="wp-page"]','[data-elementor-type="single-post"]','[data-elementor-type="single-page"]','[data-elementor-type="archive"]','[data-elementor-type="single"]','[data-elementor-type="wp-post"]','main .entry-content','main','#content','.site-content','.wp-site-blocks']);
  const notHF = k => !(header && (k === header || header.contains(k))) && !(footer && (k === footer || footer.contains(k)));
  const descend = (el, d) => { let kids = [...el.children].filter(k => !['SCRIPT','STYLE','LINK','NOSCRIPT'].includes(k.tagName)).filter(vis).filter(notHF);
    // a child that wraps header or footer is a page wrapper: dig into it
    if (kids.length === 1 && d < 8) return descend(kids[0], d + 1);
    const wrappers = kids.filter(k => (header && k.contains(header)) || (footer && k.contains(footer)));
    if (wrappers.length && d < 8) return kids.flatMap(k => wrappers.includes(k) ? descend(k, d + 1) : [k]);
    return kids.length ? kids : [el]; };
  const info = (el, role) => { const r = el.getBoundingClientRect(); const h = el.querySelector('h1,h2,h3,h4');
    const c = (typeof el.className === 'string' ? el.className : '').trim().replace(/\s+/g,' ');
    return { role, tag: el.tagName.toLowerCase(), id: el.id || undefined, cls: c.slice(0, 160), box: [Math.round(r.left+scrollX), Math.round(r.top+scrollY), Math.round(r.width), Math.round(r.height)],
      heading: h ? h.innerText.replace(/\s+/g,' ').trim().slice(0, 120) : undefined, preview: el.innerText.replace(/\s+/g,' ').trim().slice(0, 220) }; };
  const out = [];
  if (header) out.push(info(header, 'header'));
  if (main) for (const k of descend(main, 0)) { if (header && (k.contains(header) || header.contains(k))) continue; if (footer && (k.contains(footer) || footer.contains(k))) continue; out.push(info(k, 'section')); }
  if (footer) out.push(info(footer, 'footer'));
  // floating / fixed things (chat widgets, back-to-top, cookie bars, popups)
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if ((cs.position === 'fixed' || cs.position === 'sticky') && vis(el) && !(header && (header.contains(el) || el.contains(header)))) {
      if (out.some(o => o.role === 'floating' && o._el && o._el.contains(el))) continue;
      const i = info(el, 'floating'); i.position = cs.position; i.zIndex = cs.zIndex; out.push(i);
    }
  }
  return out;
}"""

META_JS = r"""() => {
  const m = {}; document.querySelectorAll('meta').forEach(x => { const k = x.getAttribute('name') || x.getAttribute('property'); if (k) m[k] = x.getAttribute('content'); });
  const links = [...document.querySelectorAll('a[href]')].map(a => ({ text: (a.innerText || a.getAttribute('aria-label') || '').replace(/\s+/g,' ').trim().slice(0, 100), href: a.href, target: a.target || undefined, inHeader: !!a.closest('header,[data-elementor-type=header]'), inFooter: !!a.closest('footer,[data-elementor-type=footer]') }));
  const images = [...document.images].map(i => ({ src: i.currentSrc || i.src, alt: i.alt, natural: [i.naturalWidth, i.naturalHeight], rendered: [Math.round(i.getBoundingClientRect().width), Math.round(i.getBoundingClientRect().height)], srcset: i.srcset ? i.srcset.slice(0, 300) : undefined }));
  const bgImages = []; document.querySelectorAll('body *').forEach(el => { const b = getComputedStyle(el).backgroundImage; if (b && b.includes('url(')) bgImages.push({ el: el.tagName.toLowerCase() + '.' + ((typeof el.className === 'string' ? el.className : '').split(' ')[0] || ''), bg: b.slice(0, 300) }); });
  const forms = [...document.forms].map(f => ({ id: f.id, cls: f.className, action: f.action, method: f.method, fields: [...f.elements].map(e => ({ tag: e.tagName.toLowerCase(), type: e.type, name: e.name, placeholder: e.placeholder || undefined, required: e.required || undefined, label: (e.labels && e.labels[0] ? e.labels[0].innerText.trim() : undefined), options: e.tagName === 'SELECT' ? [...e.options].map(o => o.text).slice(0, 40) : undefined, value: e.type === 'submit' ? e.value || e.innerText : undefined })) }));
  const scripts = [...document.scripts].map(s => s.src).filter(Boolean);
  const iframes = [...document.querySelectorAll('iframe')].map(f => ({ src: f.src, title: f.title }));
  const jsonld = [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => s.textContent.slice(0, 3000));
  const anim = [];
  document.querySelectorAll('[data-settings]').forEach(el => { try { const s = JSON.parse(el.getAttribute('data-settings')); const keys = Object.keys(s).filter(k => /anim|sticky|motion|parallax|scroll|background_slideshow|effects/i.test(k)); if (keys.length) { const o = {}; keys.forEach(k => o[k] = s[k]); anim.push({ el: el.tagName.toLowerCase() + ' ' + (el.getAttribute('data-element_type') || '') + ' ' + (el.getAttribute('data-widget_type') || ''), id: el.getAttribute('data-id'), text: el.innerText.replace(/\s+/g,' ').trim().slice(0, 80), settings: o }); } } catch (e) {} });
  document.querySelectorAll('[data-aos],[class*="uagb-animate"],[class*="animate__"],[class*="wow"],[data-animation],[class*="uag-animation"],[data-uag-animation]').forEach(el => anim.push({ el: el.tagName.toLowerCase(), cls: (typeof el.className === 'string' ? el.className : '').slice(0, 150), aos: el.getAttribute('data-aos') || el.getAttribute('data-animation') || undefined, text: el.innerText.replace(/\s+/g,' ').trim().slice(0, 80) }));
  return { title: document.title, lang: document.documentElement.lang, meta: m, canonical: (document.querySelector('link[rel=canonical]') || {}).href,
    favicon: [...document.querySelectorAll('link[rel*=icon]')].map(l => l.href), links, images, bgImages: bgImages.slice(0, 80), forms, scripts, iframes, jsonld, animations: anim,
    docHeight: document.documentElement.scrollHeight, docWidth: document.documentElement.scrollWidth };
}"""

HEADER_STATE_JS = r"""() => {
  const h = document.querySelector('header.wp-block-template-part,[data-elementor-type="header"],#site-header,header');
  if (!h) return null;
  const all = [h, ...h.querySelectorAll('*')].filter(e => { const cs = getComputedStyle(e); return cs.position === 'fixed' || cs.position === 'sticky' || e === h; });
  return all.slice(0, 6).map(e => { const cs = getComputedStyle(e); const r = e.getBoundingClientRect(); return { el: e.tagName.toLowerCase() + '.' + (typeof e.className === 'string' ? e.className.trim().split(/\s+/).slice(0, 4).join('.') : ''), position: cs.position, top: Math.round(r.top), height: Math.round(r.height), bg: cs.backgroundColor, bgImage: cs.backgroundImage.slice(0, 120), shadow: cs.boxShadow, backdrop: cs.backdropFilter, zIndex: cs.zIndex, transition: cs.transition.slice(0, 120) }; });
}"""

NAV_JS = r"""() => {
  const h = document.querySelector('header.wp-block-template-part,[data-elementor-type="header"],#site-header,header') || document.body;
  const items = [];
  const tops = h.querySelectorAll('nav > ul > li, .wp-block-navigation__container > li, ul.elementor-nav-menu > li, .menu > li');
  const seen = new Set();
  tops.forEach((li, i) => {
    const a = li.querySelector('a,button'); if (!a) return;
    const r = a.getBoundingClientRect(); if (r.width < 1) return;
    const key = a.innerText.trim() + '|' + a.href; if (seen.has(key)) return; seen.add(key);
    const sub = li.querySelector('ul');
    const cs = getComputedStyle(a);
    items.push({ index: i, text: a.innerText.replace(/\s+/g,' ').trim(), href: a.href, hasSub: !!sub, sub: sub ? [...sub.querySelectorAll('a')].map(s => ({ text: s.innerText.replace(/\s+/g,' ').trim(), href: s.href })) : [],
      style: { fontFamily: cs.fontFamily, fontSize: cs.fontSize, fontWeight: cs.fontWeight, color: cs.color, textTransform: cs.textTransform, letterSpacing: cs.letterSpacing, padding: cs.padding }, box: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], current: li.className.includes('current') });
    a.setAttribute('data-cap-nav', String(items.length - 1));
  });
  return items;
}"""

HOVER_CANDIDATES_JS = r"""() => {
  const sels = 'a.elementor-button, .elementor-button, .wp-block-button__link, .uagb-buttons-repeater, a.uagb-button__link, .wp-element-button, button:not([aria-hidden=true]), input[type=submit], .elementor-icon, .elementor-social-icon, .elementor-image-box-wrapper, .elementor-flip-box, .uagb-ifb-content, .wp-block-uagb-info-box, .uagb-post__inner-wrap, .elementor-post, .awsm-job-listing-item, .wp-block-uagb-container a, nav a, footer a';
  const seen = new Set(); const out = [];
  document.querySelectorAll(sels).forEach(el => {
    const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    if (r.width < 5 || r.height < 5 || cs.display === 'none' || cs.visibility === 'hidden') return;
    const sig = el.tagName + '|' + (typeof el.className === 'string' ? el.className : '') + '|' + cs.backgroundColor + '|' + cs.color + '|' + cs.fontSize;
    if (seen.has(sig)) return; seen.add(sig);
    el.setAttribute('data-cap-hover', String(out.length));
    out.push({ i: out.length, tag: el.tagName.toLowerCase(), cls: (typeof el.className === 'string' ? el.className : '').slice(0, 120), text: (el.innerText || el.value || '').replace(/\s+/g,' ').trim().slice(0, 60) });
  });
  return out.slice(0, 18);
}"""

STYLE_SNAPSHOT_JS = r"""(el) => { const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
  const pick = ['color','backgroundColor','backgroundImage','borderTopColor','borderTopWidth','borderRadius','boxShadow','transform','opacity','textDecorationLine','fontWeight','letterSpacing','padding','filter','outline'];
  const o = {}; pick.forEach(k => o[k] = (cs[k] || '').slice(0, 200));
  o.transition = cs.transition.slice(0, 200); o.cursor = cs.cursor; o.w = Math.round(r.width); o.h = Math.round(r.height);
  // child image/icon changes (e.g. image zoom on hover)
  const img = el.querySelector('img,svg'); if (img) { const ics = getComputedStyle(img); o.childTransform = ics.transform; o.childFilter = ics.filter; o.childOpacity = ics.opacity; o.childFill = ics.fill; o.childColor = ics.color; }
  return o; }"""


def auto_scroll(page):
    try:
        h = page.evaluate("document.documentElement.scrollHeight")
        y = 0
        while y < h:
            y += 500
            page.evaluate(f"window.scrollTo(0, {y})")
            page.wait_for_timeout(120)
            h = page.evaluate("document.documentElement.scrollHeight")
            if y > 60000:
                break
        page.wait_for_timeout(1200)
        page.evaluate("window.scrollTo(0, 0)")
        page.wait_for_timeout(900)
    except Exception as e:
        print("   scroll err", e)


def shoot_full(page, path_base, max_h=14000):
    h = page.evaluate("document.documentElement.scrollHeight")
    w = page.viewport_size["width"]
    files = []
    if h <= max_h:
        page.screenshot(path=f"{path_base}.png", full_page=True)
        files.append(os.path.basename(path_base) + ".png")
    else:
        n = 0
        for y in range(0, h, 6000):
            n += 1
            fn = f"{path_base}-part{n:02d}.png"
            page.screenshot(path=fn, full_page=True, clip={"x": 0, "y": y, "width": w, "height": min(6000, h - y)})
            files.append(os.path.basename(fn))
    return files, h


def goto(page, url):
    resp = page.goto(url, wait_until="load", timeout=90000)
    try:
        page.wait_for_load_state("networkidle", timeout=8000)
    except Exception:
        pass
    page.wait_for_timeout(1500)
    return resp


class AssetSaver:
    def __init__(self, root):
        self.root = root
        self.manifest = {}
        self.pending = []
        self.scripts = set()

    def on_response(self, resp):
        try:
            rt = resp.request.resource_type
            if rt in ("stylesheet", "image", "font", "media"):
                self.pending.append((rt, resp))
            elif rt == "script":
                self.scripts.add(resp.url)
        except Exception:
            pass

    def flush(self):
        for rt, resp in self.pending:
            url = resp.url
            if url in self.manifest or url.startswith("data:"):
                continue
            try:
                if resp.status >= 300:
                    continue
                body = resp.body()
                if len(body) > 25_000_000:
                    self.manifest[url] = {"type": rt, "skipped": "too large", "bytes": len(body)}
                    continue
                rel = asset_rel(url)
                full = os.path.join(self.root, rt + "s", rel)
                os.makedirs(os.path.dirname(full), exist_ok=True)
                with open(full, "wb") as f:
                    f.write(body)
                self.manifest[url] = {"type": rt, "file": f"assets/{rt}s/{rel}", "bytes": len(body), "contentType": resp.headers.get("content-type")}
            except Exception as e:
                self.manifest.setdefault(url, {"type": rt, "error": str(e)[:120]})
        self.pending = []


def capture_page(ctxs, saver, url, outdir, is_first):
    s = slug(url)
    pdir = os.path.join(outdir, "pages", s)
    shots = os.path.join(pdir, "screenshots")
    os.makedirs(shots, exist_ok=True)
    data = {"url": url, "slug": s, "capturedAt": time.strftime("%Y-%m-%d %H:%M:%S")}

    # ---------------- DESKTOP ----------------
    page = ctxs["desktop"].new_page()
    try:
        resp = goto(page, url)
        data["status"] = resp.status if resp else None
        data["finalUrl"] = page.url
        try:
            open(os.path.join(pdir, "raw.html"), "wb").write(resp.body())
        except Exception as e:
            print("   raw body err", e)
        auto_scroll(page)
        page.evaluate(EXTRACT_JS)
        open(os.path.join(pdir, "rendered.html"), "w", encoding="utf-8").write(page.content())
        open(os.path.join(pdir, "content.txt"), "w", encoding="utf-8").write(page.inner_text("body"))
        data["meta"] = page.evaluate(META_JS)
        data["tokens"] = page.evaluate(TOKENS_JS)
        data["usage"] = page.evaluate(USAGE_JS)
        data["sections"] = page.evaluate(SECTIONS_JS)
        j(page.evaluate("() => __X.walk(document.body, 0)"), os.path.join(pdir, "layout-desktop.json"))
        files, h = shoot_full(page, os.path.join(shots, "desktop-full"))
        data["screenshots"] = {"desktop": files}
        # section crops
        crops = []
        for i, sec in enumerate(data["sections"][:40]):
            x, y, w, hh = sec["box"]
            if w < 10 or hh < 10:
                continue
            if sec["role"] == "floating":
                continue
            fn = f"desktop-sec{i:02d}-{sec['role']}.png"
            try:
                page.screenshot(path=os.path.join(shots, fn), full_page=True,
                                clip={"x": max(0, x), "y": max(0, y), "width": min(w, 1440), "height": min(hh, 5000)})
                sec["screenshot"] = fn
                crops.append(fn)
            except Exception as e:
                sec["screenshotErr"] = str(e)[:100]
        # header / sticky behaviour
        page.evaluate("window.scrollTo(0,0)"); page.wait_for_timeout(500)
        hb = {"atTop": page.evaluate(HEADER_STATE_JS)}
        page.screenshot(path=os.path.join(shots, "desktop-viewport-top.png"))
        page.mouse.wheel(0, 1400); page.wait_for_timeout(1200)
        hb["afterScroll1400"] = page.evaluate(HEADER_STATE_JS)
        page.screenshot(path=os.path.join(shots, "desktop-viewport-scrolled.png"))
        data["headerBehaviour"] = hb
        page.evaluate("window.scrollTo(0,0)"); page.wait_for_timeout(700)
        # nav + dropdowns
        nav = page.evaluate(NAV_JS)
        for i, it in enumerate(nav):
            try:
                loc = page.locator(f'[data-cap-nav="{i}"]').first
                before = loc.evaluate(STYLE_SNAPSHOT_JS)
                loc.hover(timeout=3000); page.wait_for_timeout(600)
                after = loc.evaluate(STYLE_SNAPSHOT_JS)
                it["hoverDiff"] = {k: [before[k], after[k]] for k in before if before[k] != after[k]}
                if it["hasSub"] and is_first:
                    fn = f"desktop-nav-dropdown-{i}.png"
                    page.screenshot(path=os.path.join(shots, fn), clip={"x": 0, "y": 0, "width": 1440, "height": 700})
                    it["dropdownShot"] = fn
                    it["dropdownStyle"] = page.evaluate("""(i) => { const a = document.querySelector('[data-cap-nav="'+i+'"]'); const ul = a && a.closest('li').querySelector('ul'); if (!ul) return null; const cs = getComputedStyle(ul); const r = ul.getBoundingClientRect(); const la = ul.querySelector('a'); const lcs = la ? getComputedStyle(la) : null;
                      return { visible: cs.visibility !== 'hidden' && cs.display !== 'none' && cs.opacity !== '0', box: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], bg: cs.backgroundColor, shadow: cs.boxShadow, radius: cs.borderRadius, border: cs.border, padding: cs.padding, transition: cs.transition.slice(0,150), linkColor: lcs && lcs.color, linkSize: lcs && lcs.fontSize, linkWeight: lcs && lcs.fontWeight, linkPadding: lcs && lcs.padding }; }""", i)
                page.mouse.move(5, 890); page.wait_for_timeout(300)
            except Exception as e:
                it["hoverErr"] = str(e)[:100]
        data["nav"] = nav
        # hover states
        if is_first or True:
            cands = page.evaluate(HOVER_CANDIDATES_JS)
            for c in cands:
                try:
                    loc = page.locator(f'[data-cap-hover="{c["i"]}"]').first
                    loc.scroll_into_view_if_needed(timeout=3000); page.wait_for_timeout(250)
                    page.mouse.move(2, 2); page.wait_for_timeout(250)
                    before = loc.evaluate(STYLE_SNAPSHOT_JS)
                    loc.hover(timeout=3000, force=True); page.wait_for_timeout(700)
                    after = loc.evaluate(STYLE_SNAPSHOT_JS)
                    c["normal"] = before
                    c["hoverDiff"] = {k: [before[k], after[k]] for k in before if before[k] != after[k]}
                except Exception as e:
                    c["err"] = str(e)[:100]
            data["hoverStates"] = cands
    except Exception as e:
        data["desktopError"] = traceback.format_exc()[-1500:]
        print("   DESKTOP ERR", e)
    finally:
        saver.flush()
        page.close()

    # ---------------- TABLET / MOBILE ----------------
    for vp in ("tablet", "mobile"):
        page = ctxs[vp].new_page()
        try:
            try:
                goto(page, url)
            except Exception as e:
                print("   retry", vp, str(e)[:60])
                try: page.close()
                except Exception: pass
                page = ctxs[vp].new_page()
                goto(page, url)
            auto_scroll(page)
            page.evaluate(EXTRACT_JS)
            files, h = shoot_full(page, os.path.join(shots, f"{vp}-full"))
            data["screenshots"][vp] = files
            data.setdefault("responsive", {})[vp] = {"docHeight": h, "sections": page.evaluate(SECTIONS_JS), "usage": page.evaluate(USAGE_JS)["textStyles"][:20]}
            j(page.evaluate("() => __X.walk(document.body, 0)"), os.path.join(pdir, f"layout-{vp}.json"))
            page.screenshot(path=os.path.join(shots, f"{vp}-viewport-top.png"))
            # open hamburger
            for sel in ['.wp-block-navigation__responsive-container-open', '.elementor-menu-toggle', 'button[aria-label*="menu" i]', '.menu-toggle', '[class*="hamburger"]', '.uagb-nav-toggle', '[aria-controls*="menu"]']:
                loc = page.locator(sel).first
                try:
                    if loc.count() and loc.is_visible():
                        loc.click(timeout=3000); page.wait_for_timeout(900)
                        fn = f"{vp}-menu-open.png"
                        page.screenshot(path=os.path.join(shots, fn))
                        data["responsive"][vp]["menu"] = {"toggle": sel, "shot": fn, "items": page.evaluate("""() => [...document.querySelectorAll('.wp-block-navigation__responsive-container.is-menu-open a, .elementor-nav-menu--dropdown a, nav.elementor-nav-menu--dropdown a, .is-menu-open a, [aria-expanded=true] ~ * a')].filter(a => a.getBoundingClientRect().width > 0).map(a => a.innerText.replace(/\\s+/g,' ').trim()).filter(Boolean)""")}
                        break
                except Exception as e:
                    data["responsive"][vp]["menuErr"] = str(e)[:100]
        except Exception as e:
            data.setdefault("responsiveErrors", {})[vp] = str(e)[:500]
            print("   ", vp, "ERR", e)
        finally:
            saver.flush()
            page.close()

    j(data, os.path.join(pdir, "page.json"))
    return data


def main(pages_json, outdir, only=None):
    pages = json.load(open(pages_json))
    urls = [u for u, v in pages.items() if v.get("status") == 200]
    part = ""
    if only and only[0].startswith("part="):
        i, n = map(int, only[0][5:].split("/"))
        urls = urls[i::n]
        part = f"-{i}"
        only = only[1:] or None
    if only:
        urls = [u for u in urls if any(o in u for o in only)]
    os.makedirs(outdir, exist_ok=True)
    saver = AssetSaver(os.path.join(outdir, "assets"))
    summary = []
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome", headless=True)
        ctxs = {}
        for name, (w, h) in VIEWPORTS.items():
            ctxs[name] = browser.new_context(viewport={"width": w, "height": h}, user_agent=UA_M if name == "mobile" else UA,
                                             is_mobile=(name == "mobile"), has_touch=(name != "desktop"), device_scale_factor=1 if name == "desktop" else 2 if name == "mobile" else 1,
                                             extra_http_headers={"Accept-Language": "en-US,en;q=0.9"})
            ctxs[name].on("response", saver.on_response)
        for i, u in enumerate(urls):
            t = time.time()
            print(f"[{i+1}/{len(urls)}] {u}", flush=True)
            try:
                d = capture_page(ctxs, saver, u, outdir, is_first=(i == 0))
                summary.append({"url": u, "slug": d["slug"], "title": d.get("meta", {}).get("title"), "status": d.get("status"), "sections": len(d.get("sections", [])), "height": d.get("meta", {}).get("docHeight"), "errors": bool(d.get("desktopError") or d.get("responsiveErrors"))})
            except Exception as e:
                print("   PAGE FAIL", e)
                summary.append({"url": u, "fail": str(e)[:300]})
            print(f"   done {time.time()-t:.0f}s", flush=True)
            j(saver.manifest, os.path.join(outdir, "assets", f"manifest{part}.json"))
        browser.close()
    j({"pages": summary, "scripts": sorted(saver.scripts)}, os.path.join(outdir, f"crawl-summary{part}.json"))


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], sys.argv[3:] or None)
