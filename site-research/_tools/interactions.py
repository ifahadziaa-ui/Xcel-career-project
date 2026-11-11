"""Targeted interaction captures: open dropdown menus, hover states of buttons/cards with before/after crops."""
import sys, os, json
from playwright.sync_api import sync_playwright

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"

def run(url, outdir, hover_selectors):
    os.makedirs(outdir, exist_ok=True)
    res = {"url": url, "dropdowns": [], "hovers": []}
    with sync_playwright() as p:
        b = p.chromium.launch(channel="chrome", headless=True)
        pg = b.new_page(viewport={"width": 1440, "height": 900}, user_agent=UA)
        pg.goto(url, wait_until="load", timeout=90000)
        try: pg.wait_for_load_state("networkidle", timeout=8000)
        except Exception: pass
        pg.wait_for_timeout(2000)
        # dropdowns: any li in header with a nested ul
        lis = pg.locator("header li:has(> ul), header li:has(ul.sub-menu)")
        n = lis.count()
        for i in range(n):
            li = lis.nth(i)
            try:
                if not li.is_visible(): continue
                a = li.locator("> a").first
                # SmartMenus needs to "detect a mouse": several real mousemove events
                pg.mouse.move(300, 600); pg.mouse.move(340, 640, steps=6)
                bb = a.bounding_box()
                pg.mouse.move(bb["x"] + bb["width"] / 2, bb["y"] + bb["height"] / 2, steps=12)
                pg.wait_for_timeout(1300)
                opened_by = "hover"
                if li.evaluate("li => getComputedStyle(li.querySelector('ul')).display") == "none":
                    a.click(); pg.wait_for_timeout(1200); opened_by = "click (hover did not open it in automated Chrome)"
                info = li.evaluate("""li => { const ul = li.querySelector('ul'); const cs = getComputedStyle(ul); const r = ul.getBoundingClientRect(); const a = ul.querySelector('a'); const acs = a ? getComputedStyle(a) : null;
                  return { label: li.querySelector('a').innerText.trim(), items: [...ul.querySelectorAll('a')].map(x => x.innerText.trim()), visible: r.width > 0 && cs.visibility !== 'hidden' && cs.opacity !== '0',
                    box: [r.left, r.top, r.width, r.height].map(Math.round), bg: cs.backgroundColor, shadow: cs.boxShadow, border: cs.border, radius: cs.borderRadius, padding: cs.padding, minWidth: cs.minWidth,
                    link: acs && { font: acs.fontFamily.split(',')[0], size: acs.fontSize, weight: acs.fontWeight, color: acs.color, padding: acs.padding, transform: acs.textTransform, bg: acs.backgroundColor } }; }""")
                # hover first sub item
                if info["visible"]:
                    sa = li.locator("ul a").first
                    sa.hover(); pg.wait_for_timeout(600)
                    info["subHover"] = sa.evaluate("a => { const cs = getComputedStyle(a); return { color: cs.color, bg: cs.backgroundColor }; }")
                fn = f"dropdown-{i}.png"
                pg.screenshot(path=os.path.join(outdir, fn), clip={"x": 0, "y": 0, "width": 1440, "height": 520})
                info["shot"] = fn
                info["openedBy"] = opened_by
                res["dropdowns"].append(info)
                pg.mouse.move(5, 880); pg.mouse.click(5, 880); pg.wait_for_timeout(900)
            except Exception as e:
                res["dropdowns"].append({"i": i, "err": str(e)[:150]})
        # hovers
        k = 0
        for sel in hover_selectors:
            loc = pg.locator(sel)
            for j in range(min(loc.count(), 2)):
                el = loc.nth(j)
                try:
                    if not el.is_visible(): continue
                    el.scroll_into_view_if_needed(); pg.wait_for_timeout(400)
                    pg.mouse.move(2, 450); pg.wait_for_timeout(500)
                    bb = el.bounding_box()
                    pad = 24
                    clip = {"x": max(0, bb["x"] - pad), "y": max(0, bb["y"] - pad), "width": min(bb["width"] + 2 * pad, 1440), "height": min(bb["height"] + 2 * pad, 900)}
                    snap = """e => { const cs = getComputedStyle(e); const i = e.querySelector('img'); const o = {color: cs.color, bg: cs.backgroundColor, bgImage: cs.backgroundImage.slice(0,120), border: cs.border, shadow: cs.boxShadow, transform: cs.transform, transition: cs.transition.slice(0,160)};
                       if (i) { const ic = getComputedStyle(i); o.imgTransform = ic.transform; o.imgFilter = ic.filter; o.imgOpacity = ic.opacity; }
                       const b = getComputedStyle(e, '::before'); if (b.content !== 'none') o.before = {bg: b.backgroundColor, w: b.width, opacity: b.opacity, transform: b.transform};
                       return o; }"""
                    before = el.evaluate(snap)
                    f1 = f"hover-{k:02d}-before.png"; pg.screenshot(path=os.path.join(outdir, f1), clip=clip)
                    el.hover(force=True); pg.wait_for_timeout(900)
                    after = el.evaluate(snap)
                    f2 = f"hover-{k:02d}-after.png"; pg.screenshot(path=os.path.join(outdir, f2), clip=clip)
                    res["hovers"].append({"selector": sel, "text": el.inner_text()[:60].strip(), "before": before, "after": after, "diff": {x: [before[x], after.get(x)] for x in before if before[x] != after.get(x)}, "shots": [f1, f2]})
                    k += 1
                except Exception as e:
                    res["hovers"].append({"selector": sel, "err": str(e)[:150]})
        b.close()
    json.dump(res, open(os.path.join(outdir, "interactions.json"), "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    print(json.dumps(res, indent=1, ensure_ascii=False)[:6000])

if __name__ == "__main__":
    run(sys.argv[1], sys.argv[2], sys.argv[3:])
