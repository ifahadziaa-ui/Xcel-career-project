"""Turn captured JSON into readable Markdown: per-page PAGE.md + site-level SITE-DATA.md."""
import sys, os, json, re, glob, collections, urllib.parse

RGB = re.compile(r"rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)")


def hexify(s):
    if not isinstance(s, str):
        return s
    def rep(m):
        r, g, b, a = m.groups()
        h = "#%02X%02X%02X" % (int(r), int(g), int(b))
        if a is not None and float(a) < 1:
            if float(a) == 0:
                return "transparent"
            h += " @%d%%" % round(float(a) * 100)
        return h
    return RGB.sub(rep, s)


def fam(f):
    return (f or "").split(",")[0].strip().strip('"\'')


def short_url(u, host):
    if not u:
        return ""
    p = urllib.parse.urlparse(u)
    if p.netloc.replace("www.", "") == host:
        return p.path + (("?" + p.query) if p.query else "") + (("#" + p.fragment) if p.fragment else "")
    return u


def fname(u):
    return urllib.parse.urlparse(u or "").path.split("/")[-1] or u


def box_desc(st):
    parts = []
    d = st.get("display")
    if d and "flex" in d:
        parts.append("flex " + st.get("flexDirection", "row") + (" wrap" if st.get("flexWrap") else ""))
        if st.get("justify"): parts.append("justify:" + st["justify"])
        if st.get("align"): parts.append("align:" + st["align"])
    elif d and "grid" in d:
        parts.append("grid cols[" + st.get("gridCols", "") + "]")
    elif d and d not in ("block",):
        parts.append(d)
    for k, lab in [("gap", "gap"), ("bg", "bg"), ("bgImage", "bg-image"), ("bgSize", "bg-size"), ("bgPos", "bg-pos"), ("bgAttach", "bg-attach"),
                   ("padding", "pad"), ("margin", "margin"), ("maxWidth", "max-w"), ("minHeight", "min-h"), ("width", "w"), ("borderRadius", "radius"),
                   ("border", "border"), ("boxShadow", "shadow"), ("position", "pos"), ("zIndex", "z"), ("opacity", "opacity"), ("overflow", "overflow"),
                   ("transform", "transform"), ("filter", "filter"), ("backdrop", "backdrop"), ("textAlign", "align-text"), ("transition", "transition"), ("animation", "animation")]:
        v = st.get(k)
        if v:
            if k == "bgImage" and "url(" in v:
                m = re.findall(r'url\("?([^")]+)', v)
                v = ", ".join(fname(x) for x in m) + (" + gradient" if "gradient" in v else "")
            if k == "position" and v == "relative":
                continue
            parts.append(f"{lab}:{hexify(v)}")
    return " · ".join(parts)


def text_desc(st):
    s = f"{fam(st.get('fontFamily'))} {st.get('fontSize')}/{st.get('fontWeight')} lh {st.get('lineHeight')} · {hexify(st.get('color'))}"
    for k in ("letterSpacing", "textTransform", "textAlign", "textDecoration", "fontStyle", "textShadow"):
        if st.get(k):
            s += f" · {k}:{hexify(st[k])}"
    if st.get("gradientText"):
        s += " · gradient-text"
    extra = box_desc({k: v for k, v in st.items() if k in ("bg", "padding", "borderRadius", "border", "boxShadow", "display", "transition", "margin", "maxWidth")})
    if extra:
        s += " ‖ " + extra
    return s


def find_node(tree, box):
    best = [None, 1e18]
    def rec(n, depth):
        if not isinstance(n, dict):
            return
        b = n.get("box")
        if b:
            d = sum(abs(a - c) for a, c in zip(b, box)) + depth * 0.1
            if d < best[1]:
                best[0], best[1] = n, d
        for c in n.get("children", []) or []:
            rec(c, depth + 1)
    rec(tree, 0)
    # a big mismatch means the section element itself was empty (spacer) and got pruned
    if best[1] > 24:
        return None
    return best[0]


def sig(n):
    return (n.get("t"), (n.get("cls") or "").split(" ")[0], n.get("kind"))


def outline(n, host, lines, depth=0, maxlines=400):
    if len(lines) > maxlines or not isinstance(n, dict):
        return
    ind = "  " * depth
    k = n.get("kind")
    b = n.get("box") or [0, 0, 0, 0]
    pos = f"`@{b[0]},{b[1]} {b[2]}×{b[3]}`"
    tag = n.get("t", "")
    c = (n.get("cls") or "").split(" ")
    cl = "." + c[0] if c and c[0] else ""
    # keep meaningful widget class names
    widget = [x for x in c if re.match(r"(elementor-widget-|wp-block-uagb-|wp-block-[a-z-]+$|uagb-(?:block|ifb|tm|slider|testimonial)|elementor-(section|column|container|element-populated)$|e-con|awsm-)", x)]
    if widget:
        cl = "." + widget[0]
    if k in ("text", "link", "button"):
        txt = (n.get("text") or "").replace("|", "/")
        txt = txt if len(txt) <= 160 else txt[:157] + "…"
        lab = tag.upper() if tag != "#text" else "text"
        if k == "link":
            lab = f"A→{short_url(n.get('href'), host)}"
        icons = ""
        if n.get("icons"):
            icons = " +icon[" + ", ".join((i.get("icon") or fname(i.get("img")))[:40] for i in n["icons"][:3]) + "]"
        marks = ""
        if n.get("marks"):
            marks = " · highlights: " + "; ".join(f"\"{m['text']}\" {hexify(m.get('color') or '')} {m.get('weight') or ''} {m.get('size') or ''} {hexify(m.get('bg') or '')} {fam(m.get('family')) if m.get('family') else ''}".strip() for m in n["marks"][:3])
        lines.append(f"{ind}- **{lab}** \"{txt}\"{icons} — {text_desc(n.get('style', {}))}{marks} {pos}")
    elif k == "image":
        st = n.get("style", {})
        lines.append(f"{ind}- **IMG** `{fname(n.get('src'))}` alt=\"{n.get('alt', '')}\" natural {n.get('natural', ['?', '?'])[0]}×{n.get('natural', ['?', '?'])[1]}" + (f" · fit:{n['objectFit']}" if n.get("objectFit") else "") + (f" · {box_desc(st)}" if box_desc(st) else "") + f" {pos}")
    elif k == "svg":
        lines.append(f"{ind}- **SVG icon** {n.get('w')}×{n.get('h')} fill:{hexify(n.get('fill'))} color:{hexify(n.get('color'))} {('.' + n['cls'].split(' ')[0]) if n.get('cls') else ''} {pos}")
    elif k in ("video", "iframe", "canvas", "picture"):
        lines.append(f"{ind}- **{k.upper()}** {n.get('src', '')} {n.get('title', '')} {'autoplay ' if n.get('autoplay') else ''}{'loop ' if n.get('loop') else ''}{pos}")
    elif k == "field":
        st = n.get("style", {})
        lines.append(f"{ind}- **FIELD** <{tag} type={n.get('type')} name={n.get('name')}> placeholder=\"{n.get('placeholder') or ''}\"{' required' if n.get('required') else ''}{(' value=' + repr(n.get('value'))) if n.get('value') else ''} — {text_desc(st)} {pos}")
    else:
        lab = tag + cl
        if k == "form":
            lab = "FORM " + lab
        if n.get("href"):
            lab += f" (link→{short_url(n['href'], host)})"
        pseudo = ""
        if n.get("pseudo"):
            pseudo = " · pseudo:" + "; ".join(f"{p}{{{hexify(json.dumps({k: v for k, v in d.items() if v}, ensure_ascii=False))}}}" for p, d in n["pseudo"].items())
        desc = box_desc(n.get("style", {}))
        lines.append(f"{ind}- {lab}" + (f" [{desc}]" if desc else "") + pseudo + f" {pos}" + (" (empty/decorative)" if n.get("empty") else ""))
        kids = n.get("children", []) or []
        same = len(kids) > 10 and len({sig(k) for k in kids}) <= 2
        for idx, ch in enumerate(kids):
            if same and idx == 6:
                lines.append(f"{ind}  - … {len(kids) - 6} more siblings of the same type (carousel slides / repeated items — see layout-desktop.json)")
                break
            outline(ch, host, lines, depth + 1, maxlines)


def page_md(pdir, host, site_label):
    d = json.load(open(os.path.join(pdir, "page.json"), encoding="utf-8"))
    tree = json.load(open(os.path.join(pdir, "layout-desktop.json"), encoding="utf-8"))
    mtree = None
    if os.path.exists(os.path.join(pdir, "layout-mobile.json")):
        mtree = json.load(open(os.path.join(pdir, "layout-mobile.json"), encoding="utf-8"))
    m = d.get("meta", {})
    L = []
    L.append(f"# {m.get('title', d['slug'])}")
    L.append("")
    L.append(f"*{site_label}* · URL: {d['url']} · captured {d.get('capturedAt')} · HTTP {d.get('status')}")
    L.append("")
    L.append(f"- **Meta description:** {m.get('meta', {}).get('description', '—')}")
    for k in ("og:title", "og:description", "og:image", "og:type"):
        if m.get("meta", {}).get(k):
            L.append(f"- **{k}:** {m['meta'][k]}")
    L.append(f"- **Page size (desktop 1440px):** {m.get('docWidth')}×{m.get('docHeight')} px · tablet (820px): {d.get('responsive', {}).get('tablet', {}).get('docHeight')} px · mobile (390px): {d.get('responsive', {}).get('mobile', {}).get('docHeight')} px")
    sh = d.get("screenshots", {})
    L.append("- **Screenshots:** " + " · ".join(f"[{vp}](screenshots/{f})" for vp, fs in sh.items() for f in fs) + " · [desktop top](screenshots/desktop-viewport-top.png) · [desktop scrolled](screenshots/desktop-viewport-scrolled.png)")
    L.append("- **Files:** [raw.html](raw.html) (server HTML) · [rendered.html](rendered.html) (DOM after JS) · [content.txt](content.txt) (all visible text) · layout-*.json (full element tree with computed styles) · page.json (everything)")
    if d.get("desktopError"):
        L.append(f"- ⚠ desktop capture error: `{d['desktopError'][-300:]}`")
    L.append("")
    # Section map
    L.append("## 1. Section map (top → bottom, desktop 1440px)")
    L.append("")
    L.append("| # | Role | Y from top | Height | Heading / first text | Mobile height | Screenshot |")
    L.append("|---|---|---|---|---|---|---|")
    msecs = d.get("responsive", {}).get("mobile", {}).get("sections", [])
    for i, s in enumerate(d.get("sections", [])):
        mh = ""
        if s["role"] != "floating" and i < len(msecs):
            mh = str(msecs[i]["box"][3])
        head = (s.get("heading") or s.get("preview") or "").replace("|", "/")[:90]
        shot = f"[img](screenshots/{s['screenshot']})" if s.get("screenshot") else ""
        role = s["role"] + (f" ({s.get('position')}, z {s.get('zIndex')})" if s["role"] == "floating" else "")
        L.append(f"| {i} | {role} | {s['box'][1]} | {s['box'][3]} | {head} | {mh} | {shot} |")
    L.append("")
    # Sections detail
    L.append("## 2. Section-by-section layout (desktop)")
    L.append("")
    L.append("Legend: each line is an element in DOM order. `@x,y w×h` = position/size in px on the 1440px-wide page. Text lines show *font size/weight, line-height, colour*. Boxes show layout (flex/grid), background, padding, radius, shadow, etc. Pass-through wrappers are collapsed.")
    L.append("")
    for i, s in enumerate(d.get("sections", [])):
        if s["role"] == "floating":
            continue
        L.append(f"### 2.{i} {s['role'].upper()} — {(s.get('heading') or s.get('preview') or '')[:80]}")
        L.append("")
        L.append(f"Element: `<{s['tag']} class=\"{s['cls'][:140]}\">` at y={s['box'][1]}, {s['box'][2]}×{s['box'][3]}px" + (f" · ![section](screenshots/{s['screenshot']})" if s.get("screenshot") else ""))
        L.append("")
        node = find_node(tree, s["box"])
        lines = []
        if node:
            outline(node, host, lines, 0, 350)
        else:
            lines.append(f"- *(empty block — vertical spacer / gap of {s['box'][3]}px)*")
        L.extend(lines)
        if len(lines) > 350:
            L.append("  - … (truncated — see layout-desktop.json)")
        L.append("")
    # floating
    fl = [s for s in d.get("sections", []) if s["role"] == "floating"]
    if fl:
        L.append("### Floating / fixed elements")
        for s in fl:
            L.append(f"- `{s['tag']}.{s['cls'][:80]}` {s.get('position')} at {s['box']} z-index {s.get('zIndex')} — \"{(s.get('preview') or '')[:80]}\"")
        L.append("")
    # Header behaviour + nav
    L.append("## 3. Header, navigation & interaction behaviour")
    L.append("")
    hb = d.get("headerBehaviour") or {}
    for state, rows in hb.items():
        for r in rows or []:
            L.append(f"- **{state}** `{r['el'][:80]}` position:{r['position']} top:{r['top']} height:{r['height']} bg:{hexify(r['bg'])} shadow:{hexify(r['shadow'])} backdrop:{r['backdrop']} z:{r['zIndex']}")
    L.append("")
    if d.get("nav"):
        L.append("| Menu item | Link | Dropdown | Style | Hover change |")
        L.append("|---|---|---|---|---|")
        for n in d["nav"]:
            st = n.get("style", {})
            sub = "; ".join(f"{x['text']} ({short_url(x['href'], host)})" for x in n.get("sub", []))
            hd = "; ".join(f"{k}: {hexify(v[0])} → {hexify(v[1])}" for k, v in (n.get("hoverDiff") or {}).items() if k not in ("outline", "borderTopColor"))
            L.append(f"| {n['text']}{' (current)' if n.get('current') else ''} | {short_url(n['href'], host)} | {sub or '—'} | {fam(st.get('fontFamily'))} {st.get('fontSize')}/{st.get('fontWeight')} {hexify(st.get('color'))} {st.get('textTransform') if st.get('textTransform') != 'none' else ''} ls {st.get('letterSpacing')} | {hd or 'none'} |")
            if n.get("dropdownStyle"):
                ds = n["dropdownStyle"]
                L.append(f"| ↳ dropdown panel | | [screenshot](screenshots/{n.get('dropdownShot')}) | bg {hexify(ds.get('bg'))} · shadow {hexify(ds.get('shadow'))} · radius {ds.get('radius')} · pad {ds.get('padding')} · links {ds.get('linkSize')}/{ds.get('linkWeight')} {hexify(ds.get('linkColor'))} pad {ds.get('linkPadding')} · box {ds.get('box')} | transition {ds.get('transition')} |")
        L.append("")
    mob = d.get("responsive", {}).get("mobile", {})
    if mob.get("menu"):
        L.append(f"- **Mobile menu:** toggle `{mob['menu']['toggle']}` → [screenshot](screenshots/{mob['menu']['shot']}) · items: {', '.join(mob['menu'].get('items', [])[:30])}")
    tab = d.get("responsive", {}).get("tablet", {})
    if tab.get("menu"):
        L.append(f"- **Tablet menu:** toggle `{tab['menu']['toggle']}` → [screenshot](screenshots/{tab['menu']['shot']})")
    L.append("")
    if d.get("hoverStates"):
        L.append("### Hover states (measured by hovering in Chrome)")
        L.append("")
        L.append("| Element | Text | Normal | On hover |")
        L.append("|---|---|---|---|")
        for h in d["hoverStates"]:
            nm = h.get("normal") or {}
            normal = f"color {hexify(nm.get('color'))} · bg {hexify(nm.get('backgroundColor'))} · radius {nm.get('borderRadius')} · pad {nm.get('padding')} · border {nm.get('borderTopWidth')} {hexify(nm.get('borderTopColor'))} · transition {nm.get('transition')}" if nm else h.get("err", "")
            hd = "; ".join(f"{k}: {hexify(v[0])[:60]} → {hexify(v[1])[:60]}" for k, v in (h.get("hoverDiff") or {}).items() if k not in ("outline",))
            L.append(f"| `{h['tag']}.{(h['cls'] or '').split(' ')[0]}` | {h['text'][:40]} | {normal} | {hd or 'no change'} |")
        L.append("")
    if m.get("animations"):
        L.append("### Animations / motion settings found in markup")
        L.append("")
        for a in m["animations"][:60]:
            L.append(f"- `{a.get('el')}` \"{a.get('text', '')[:60]}\" → {json.dumps(a.get('settings') or a.get('aos') or a.get('cls'), ensure_ascii=False)[:250]}")
        L.append("")
    # Typography / colours for the page
    u = d.get("usage", {})
    L.append("## 4. Typography & colour used on this page (weighted by amount of text / area)")
    L.append("")
    L.append("| Font · weight · size / line-height | chars |")
    L.append("|---|---|")
    for k, v in u.get("textStyles", [])[:25]:
        L.append(f"| {k} | {v} |")
    L.append("")
    L.append("- **Text colours:** " + ", ".join(f"{hexify(k)} ({v})" for k, v in u.get("textColors", [])[:12]))
    L.append("- **Background colours (by area):** " + ", ".join(f"{hexify(k)} ({v})" for k, v in u.get("backgrounds", [])[:12]))
    if u.get("gradients"):
        L.append("- **Gradients:** " + " | ".join(hexify(k)[:160] for k, v in u["gradients"][:6]))
    L.append("- **Border radii:** " + ", ".join(f"{k} ({v})" for k, v in u.get("radii", [])[:10]))
    L.append("- **Shadows:** " + " | ".join(f"{hexify(k)} ({v})" for k, v in u.get("shadows", [])[:6]))
    if mob.get("usage"):
        L.append("- **Mobile text styles:** " + "; ".join(f"{k} ({v})" for k, v in mob["usage"][:10]))
    L.append("")
    # Forms
    if m.get("forms"):
        L.append("## 5. Forms")
        for f in m["forms"]:
            L.append(f"- **Form** `{f.get('id') or f.get('cls', '')[:60]}` → {f.get('action')} ({f.get('method')})")
            for fl_ in f["fields"]:
                if fl_.get("type") == "hidden":
                    continue
                L.append(f"  - {fl_['tag']}[{fl_.get('type')}] name=`{fl_.get('name')}` label=\"{fl_.get('label') or ''}\" placeholder=\"{fl_.get('placeholder') or ''}\"{' *required*' if fl_.get('required') else ''}" + (f" options: {fl_['options']}" if fl_.get("options") else "") + (f" value=\"{fl_.get('value')}\"" if fl_.get("value") else ""))
        L.append("")
    # Images & links
    L.append("## 6. Images on the page")
    L.append("")
    seen = set()
    for im in m.get("images", []):
        if im["src"] in seen:
            continue
        seen.add(im["src"])
        L.append(f"- `{fname(im['src'])}` natural {im['natural'][0]}×{im['natural'][1]} → shown {im['rendered'][0]}×{im['rendered'][1]} · alt=\"{im.get('alt')}\" · {im['src']}")
    for bg in m.get("bgImages", [])[:30]:
        L.append(f"- background on `{bg['el']}`: {', '.join(re.findall(r'url\(\"?([^\")]+)', bg['bg']))}")
    L.append("")
    L.append("## 7. Links on the page")
    L.append("")
    seen = set()
    for a in m.get("links", []):
        key = (a["text"], a["href"])
        if key in seen:
            continue
        seen.add(key)
        where = "header" if a.get("inHeader") else "footer" if a.get("inFooter") else "body"
        L.append(f"- [{where}] \"{a['text'] or '(icon/image)'}\" → {short_url(a['href'], host)}" + (f" (target {a['target']})" if a.get("target") else ""))
    L.append("")
    # Mobile layout outline (condensed)
    if mtree:
        L.append("## 8. Mobile layout (390px) — condensed outline")
        L.append("")
        for i, s in enumerate(msecs):
            if s["role"] == "floating":
                continue
            L.append(f"### 8.{i} {s['role']} — {(s.get('heading') or s.get('preview') or '')[:70]} (y {s['box'][1]}, h {s['box'][3]})")
            node = find_node(mtree, s["box"])
            lines = []
            if node:
                outline(node, host, lines, 0, 80)
            else:
                lines.append(f"- *(empty block — spacer of {s['box'][3]}px)*")
            L.extend(lines[:80])
            L.append("")
    out = os.path.join(pdir, "PAGE.md")
    open(out, "w", encoding="utf-8").write("\n".join(L))
    return d


def site_md(outdir, host, label):
    pages = []
    for pj in sorted(glob.glob(os.path.join(outdir, "pages", "*", "page.json"))):
        pdir = os.path.dirname(pj)
        try:
            pages.append(page_md(pdir, host, label))
        except Exception as e:
            import traceback; traceback.print_exc()
            print("render fail", pdir, e)
    L = [f"# {label} — captured data summary", "", f"Site: https://{host}/ · {len(pages)} pages captured with Chrome at 1440 / 820 / 390 px.", ""]
    L.append("## Pages")
    L.append("")
    L.append("| Page | Title | Sections | Desktop height | Mobile height | Detail |")
    L.append("|---|---|---|---|---|---|")
    for d in sorted(pages, key=lambda x: x["url"]):
        m = d.get("meta", {})
        L.append(f"| {short_url(d['url'], host)} | {m.get('title', '')[:70]} | {len([s for s in d.get('sections', []) if s['role'] == 'section'])} | {m.get('docHeight')} | {d.get('responsive', {}).get('mobile', {}).get('docHeight')} | [PAGE.md](pages/{d['slug']}/PAGE.md) |")
    L.append("")
    # merged tokens
    vars_ = {}
    ff, kf, mq, sheets = {}, set(), collections.Counter(), set()
    styles, colors, bgs, radii, shadows, grads = (collections.Counter() for _ in range(6))
    for d in pages:
        t = d.get("tokens", {})
        for k, v in t.get("cssVars", {}).items():
            vars_[k] = v.get("computed") or (v.get("declared") or [""])[0]
        for f in t.get("fontFaces", []):
            ff[(f["family"], f["weight"], f["style"])] = f["src"][:120]
        kf.update(t.get("keyframes", []))
        mq.update(t.get("mediaQueries", []))
        for s in t.get("stylesheets", []):
            if s.get("href"): sheets.add(s["href"])
        u = d.get("usage", {})
        for k, v in u.get("textStyles", []): styles[k] += v
        for k, v in u.get("textColors", []): colors[k] += v
        for k, v in u.get("backgrounds", []): bgs[k] += v
        for k, v in u.get("radii", []): radii[k] += v
        for k, v in u.get("shadows", []): shadows[k] += v
        for k, v in u.get("gradients", []): grads[k] += v
    L.append("## Site-wide typography (all pages, weighted by characters of text)")
    L.append("")
    L.append("| Font · weight · size / line-height | chars |")
    L.append("|---|---|")
    for k, v in styles.most_common(40):
        L.append(f"| {k} | {v} |")
    L.append("")
    L.append("## Site-wide colours")
    L.append("")
    L.append("- **Text colours:** " + ", ".join(f"{hexify(k)} ({v})" for k, v in colors.most_common(20)))
    L.append("- **Backgrounds (by area):** " + ", ".join(f"{hexify(k)} ({v})" for k, v in bgs.most_common(20)))
    L.append("- **Gradients:** " + " | ".join(hexify(k)[:200] for k, v in grads.most_common(10)))
    L.append("- **Radii:** " + ", ".join(f"{k} ({v})" for k, v in radii.most_common(15)))
    L.append("- **Shadows:** " + " | ".join(f"{hexify(k)} ({v})" for k, v in shadows.most_common(10)))
    L.append("")
    L.append("## Design tokens declared in CSS (custom properties on :root / body / theme kit)")
    L.append("")
    interesting = re.compile(r"(color|font|size|spacing|gap|radius|shadow|width|gradient|container|line-height|weight|e-global|preset|custom|ast-|uag|layout)", re.I)
    groups = collections.defaultdict(list)
    for k in sorted(vars_):
        if not interesting.search(k):
            continue
        g = re.sub(r"--+", "-", k).strip("-").split("-")
        groups["-".join(g[:3])].append(k)
    for g, ks in sorted(groups.items()):
        L.append(f"<details><summary><b>{g}</b> ({len(ks)})</summary>\n")
        for k in ks:
            L.append(f"- `{k}`: `{hexify(str(vars_[k]))[:160]}`")
        L.append("\n</details>")
    L.append("")
    L.append("## Web fonts loaded (@font-face)")
    L.append("")
    for (fa, w, s), src in sorted(ff.items()):
        L.append(f"- **{fa}** {w} {s} — `{src}`")
    L.append("")
    L.append("## Responsive breakpoints (media queries seen in CSS, by frequency)")
    L.append("")
    L.append(", ".join(f"`{k}` ({v})" for k, v in mq.most_common(30)))
    L.append("")
    L.append("## CSS keyframe animations available")
    L.append("")
    L.append(", ".join(sorted(kf)))
    L.append("")
    L.append("## Stylesheets loaded")
    L.append("")
    for s in sorted(sheets):
        L.append(f"- {s}")
    scripts = set()
    for cs in glob.glob(os.path.join(outdir, "crawl-summary*.json")):
        scripts.update(json.load(open(cs, encoding="utf-8")).get("scripts", []))
    if scripts:
        L.append("")
        L.append("## Scripts loaded (libraries / plugins)")
        L.append("")
        for s in sorted(scripts):
            L.append(f"- {s}")
    open(os.path.join(outdir, "SITE-DATA.md"), "w", encoding="utf-8").write("\n".join(L))
    print("rendered", len(pages), "pages")


if __name__ == "__main__":
    site_md(sys.argv[1], sys.argv[2], sys.argv[3])
