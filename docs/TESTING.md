# Testing the landing prototype

Headless browsers on this machine render in **software** (no GPU), so they are good for layout, behaviour, hit-testing and errors, and say nothing about real-GPU smoothness. Never target the user's own browser profile: always use a fresh `--profile` / `--user-data-dir`. Servers stop when a session ends: start `python3 landing-prototype/serve.py` first (port 3200).

## 1. Environments

| Browser | How | Notes |
|---|---|---|
| Firefox (headless) | `firefox --headless --marionette --no-remote --profile <fresh dir>`, driven over Marionette on port 2828 | Software WebGL. Window cannot be narrower than about 500 px (see §4). |
| Chromium 158 (headless) | `~/.cache/ms-playwright/chromium-1254/chrome-linux64/chrome --headless=new --remote-debugging-port=9333 --user-data-dir=<fresh dir> --use-angle=swiftshader --enable-unsafe-swiftshader --no-sandbox`, driven over the DevTools protocol | No Playwright library; Python `websockets` is installed. Use it for Chrome-only behaviour (3D hit-testing, `text-box`). |
| Not available | Safari, a real GPU, a touch screen, screen readers | Ask the user to check these. |

## 2. Minimal Marionette client (Firefox)

```python
import socket, json, subprocess, time, base64, shutil, os
class FF:
    def __init__(s, w=1400, h=900, extra=''):
        s.prof = '/tmp/ffprof'; shutil.rmtree(s.prof, ignore_errors=True); os.makedirs(s.prof)
        open(s.prof + '/user.js', 'w').write('user_pref("marionette.port",2828);user_pref("webgl.force-enabled",true);'
            'user_pref("gfx.webrender.software",true);user_pref("media.autoplay.default",0);' + extra)
        s.p = subprocess.Popen(['firefox', '--headless', '--marionette', '--no-remote', '--profile', s.prof,
                                '--width', str(w), '--height', str(h)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        for _ in range(60):
            try: s.s = socket.create_connection(('127.0.0.1', 2828)); break
            except OSError: time.sleep(0.5)
        s.id = 0; s.buf = b''; s.rd(); s.cmd('WebDriver:NewSession', {'capabilities': {}})
    def rd(s):
        while b':' not in s.buf: s.buf += s.s.recv(65536)
        n, rest = s.buf.split(b':', 1); n = int(n)
        while len(rest) < n: rest += s.s.recv(1 << 20)
        s.buf = rest[n:]; return json.loads(rest[:n])
    def cmd(s, name, params=None):
        s.id += 1; m = json.dumps([0, s.id, name, params or {}]); s.s.sendall(f'{len(m.encode())}:{m}'.encode())
        while True:
            r = s.rd()
            if r[0] == 1 and r[1] == s.id:
                if r[2]: raise Exception(r[2])
                return r[3]
    def go(s, u): s.cmd('WebDriver:Navigate', {'url': u})
    def js(s, code, args=None): return s.cmd('WebDriver:ExecuteScript', {'script': code, 'args': args or []}).get('value')
    def size(s, w, h): s.cmd('WebDriver:SetWindowRect', {'width': w, 'height': h})
    def shot(s, path): open(path, 'wb').write(base64.b64decode(s.cmd('WebDriver:TakeScreenshot', {'full': False})['value']))
    def close(s):
        try: s.cmd('Marionette:Quit')
        except Exception: pass
        s.p.kill()
```

`ExecuteScript` runs with `window` unwrapped; `return` a value to read it. The reduced-motion check uses `extra='user_pref("ui.prefersReducedMotion",1);'`.

## 3. Minimal DevTools-protocol client (Chromium)

```python
import asyncio, json, subprocess, time, urllib.request, base64, os, shutil, websockets
CHROME = os.path.expanduser('~/.cache/ms-playwright/chromium-1254/chrome-linux64/chrome')
class CR:
    def __init__(s, w=1400, h=900):
        s.prof = '/tmp/crprof'; shutil.rmtree(s.prof, ignore_errors=True)
        s.p = subprocess.Popen([CHROME, '--headless=new', '--no-sandbox', '--remote-debugging-port=9333', '--user-data-dir=' + s.prof,
            f'--window-size={w},{h}', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', 'about:blank'],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        for _ in range(60):
            try: j = json.load(urllib.request.urlopen('http://127.0.0.1:9333/json')); break
            except Exception: time.sleep(0.5)
        s.url = [t for t in j if t['type'] == 'page'][0]['webSocketDebuggerUrl']; s.w, s.h = w, h
    async def open(s):
        s.ws = await websockets.connect(s.url, max_size=50_000_000); s.id = 0
        await s.cmd('Page.enable'); await s.cmd('Runtime.enable')
        await s.cmd('Emulation.setDeviceMetricsOverride', {'width': s.w, 'height': s.h, 'deviceScaleFactor': 1, 'mobile': False})
    async def cmd(s, m, p=None):
        s.id += 1; i = s.id; await s.ws.send(json.dumps({'id': i, 'method': m, 'params': p or {}}))
        while True:
            r = json.loads(await s.ws.recv())
            if r.get('id') == i: return r
    async def js(s, code):
        r = await s.cmd('Runtime.evaluate', {'expression': code, 'returnByValue': True, 'awaitPromise': True})
        return r['result']['result'].get('value')
    async def shot(s, path): open(path, 'wb').write(base64.b64decode((await s.cmd('Page.captureScreenshot', {'format': 'png'}))['result']['data']))
    async def mouse(s, t, x, y, **k): await s.cmd('Input.dispatchMouseEvent', {'type': t, 'x': x, 'y': y, 'button': k.get('button', 'none'), 'buttons': k.get('buttons', 0), 'clickCount': k.get('clickCount', 0)})
    def close(s): s.p.kill()
```

Use `Input.dispatchMouseEvent` (`mouseMoved`, `mousePressed`, `mouseReleased`) for real hover and click, and `Page.navigate` + `Runtime.evaluate` for the rest. In Chromium use `window.scrollTo`; `window.__proto.lenis.scrollTo(y, {immediate: true})` also works.

## 4. Recipes

**Scrolling to a place.** `window.__proto.lenis.scrollTo(y, {immediate: true})` (Lenis is exposed there). The showreel track: `top = #sr-track.getBoundingClientRect().top + scrollY`, `H = #sr-track.offsetHeight`, then `y = top + (H - innerHeight) * fraction`. Fraction 0.999 is the closing frame.

**Widths below 500 px (headless Firefox).** Load the page, then replace the document with `<iframe id=ifr src=/ style="width:390px;height:850px;border:0">` and measure `document.getElementById('ifr').contentWindow`. Same-origin, so scripts can read it.

**Overflow.** Scroll the whole page first (in 300 to 400 px steps) so every reveal plays. Then list elements whose `getBoundingClientRect().right > innerWidth + 1`, excluding `.sr-sticky, .sr-portfolio, .preloader, #top, .xc-panel, .sr-track`. Expected: none at 1400, 1024, 820, 768, 390, 360 and 320 px.

**Text size floor.** Every element with direct text below `#top` and the bar must have `getComputedStyle().fontSize >= 11`. Expected: none under 11 px.

**Contrast.** Compute the WCAG ratio of text colour against the effective background (blend translucent layers up the parent chain; default `#101012`). Large text needs 3:1, other text 4.5:1. Exclude the showreel stage (gradients) and decorative outlines. Expected: only the footer outline wordmark (a logotype) is reported.

**Text centring.** Take a screenshot, find the element's box, then the first and last rows containing ink inside it. For capital-only labels the gaps above and below should match within about 1 px; mixed-case text includes descenders, so compare cap height.

**Hit-testing (Chromium).** `document.elementsFromPoint(x, y)` at a button's centre must list the button first. Then dispatch `mouseMoved` (hover: computed `background-color` changes, allow 1 to 2 s because software rendering is slow), and `mousePressed`/`mouseReleased` (click: `location` or `scrollY` changes).

**Keyboard.** Send real Tab key events and record `document.activeElement` and its rect each time. No focused control may be fully covered by `#site-header` or `.xc-launch` (the control's own bar and launcher do not count), and every focus must land in the viewport.

**Reduced motion / pause.** Firefox pref `ui.prefersReducedMotion=1`. Expected: `#mo-toggle[aria-pressed=true]`, `html[data-motion=paused]`, `.sr-marquee-row` `animation-play-state: paused`, and the sphere canvas unchanged between two screenshots while scroll is still.

**Adaptive resolution.** In headless (slow) rendering the quality steps down by itself: watch `#services` `data-quality` (1, 2, 3) and the sphere canvas size shrink. It is paused while animations are paused.

**Form and launcher.** Click `#join-form .btn` with an empty, a malformed and a valid email: `aria-invalid`, `#join-msg` text and `role`, and no network request. For the launcher read `getComputedStyle(.xc-launch).opacity`: 1 when idle past the hero, 0 while scrolling, 1 again about 1 s after the last scroll.

## 5. What these tests cannot tell you

Real-GPU smoothness, trackpad and touch gestures, Safari, screen readers, and the user's reported black closing-frame background in Chrome (it does not reproduce in either headless browser; see the status doc §4).
