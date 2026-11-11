// Runs inside the page. Exposes window.__X with helpers. Returns nothing by itself.
(() => {
  const SKIP = new Set(['SCRIPT','STYLE','NOSCRIPT','LINK','META','TEMPLATE','HEAD','BR','WBR','PATH','DEFS','G','USE','CIRCLE','RECT','POLYGON','LINE','POLYLINE','ELLIPSE','SYMBOL','LINEARGRADIENT','STOP','CLIPPATH','MASK','TITLE']);
  const TEXTUAL = new Set(['H1','H2','H3','H4','H5','H6','P','A','BUTTON','LI','LABEL','BLOCKQUOTE','FIGCAPTION','SPAN','STRONG','EM','B','I','SMALL','DT','DD','TD','TH','CAPTION','LEGEND','CITE','TIME','ADDRESS','SUMMARY']);
  const INLINE = new Set(['SPAN','STRONG','EM','B','I','SMALL','SUP','SUB','CODE','MARK','U','S','ABBR','TIME','BR','WBR','CITE','Q','FONT','svg','SVG','I']);
  const MEDIA = new Set(['IMG','VIDEO','IFRAME','CANVAS','PICTURE','OBJECT','EMBED']);
  const FORM = new Set(['INPUT','SELECT','TEXTAREA']);

  const px = v => v && v !== 'auto' && v !== 'normal' ? v : null;
  const isZero = v => !v || v === '0px' || v === 'auto' || v === 'normal' || v === 'none';
  const transparent = c => !c || c === 'rgba(0, 0, 0, 0)' || c === 'transparent';

  function visible(el, cs, r) {
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    if (parseFloat(cs.opacity) === 0 && !el.matches('[class*=elementor-invisible],[class*=animated],[data-aos]')) return false;
    if (r.width < 1 && r.height < 1) return false;
    return true;
  }

  function boxStyle(cs) {
    const s = {};
    const add = (k, v, skip) => { if (v && !(skip && skip(v))) s[k] = v; };
    add('display', cs.display, v => v === 'block');
    add('position', cs.position, v => v === 'static');
    if (cs.display.includes('flex')) {
      add('flexDirection', cs.flexDirection, v => v === 'row');
      add('flexWrap', cs.flexWrap, v => v === 'nowrap');
      add('justify', cs.justifyContent, v => v === 'normal' || v === 'flex-start');
      add('align', cs.alignItems, v => v === 'normal' || v === 'stretch');
      add('gap', cs.rowGap === cs.columnGap ? cs.rowGap : cs.rowGap + ' ' + cs.columnGap, v => v === 'normal' || v === '0px' || v === '0px 0px');
      add('flexGrow', cs.flexGrow, v => v === '0');
    }
    if (cs.display.includes('grid')) {
      add('gridCols', cs.gridTemplateColumns, v => v === 'none');
      add('gap', cs.rowGap === cs.columnGap ? cs.rowGap : cs.rowGap + ' ' + cs.columnGap, v => v === 'normal' || v === '0px' || v === '0px 0px');
    }
    add('bg', cs.backgroundColor, transparent);
    if (cs.backgroundImage && cs.backgroundImage !== 'none') {
      add('bgImage', cs.backgroundImage.length > 400 ? cs.backgroundImage.slice(0, 400) + '…' : cs.backgroundImage);
      add('bgSize', cs.backgroundSize, v => v === 'auto');
      add('bgPos', cs.backgroundPosition, v => v === '0% 0%');
      add('bgRepeat', cs.backgroundRepeat, v => v === 'repeat');
      add('bgAttach', cs.backgroundAttachment, v => v === 'scroll');
    }
    const pad = [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft];
    if (pad.some(p => p !== '0px')) s.padding = pad.join(' ');
    const mar = [cs.marginTop, cs.marginRight, cs.marginBottom, cs.marginLeft];
    if (mar.some(p => p !== '0px')) s.margin = mar.join(' ');
    add('maxWidth', cs.maxWidth, isZero);
    add('minHeight', cs.minHeight, v => v === '0px' || v === 'auto');
    add('width', cs.width && cs.width.endsWith('px') ? null : cs.width);
    add('borderRadius', cs.borderRadius, v => v === '0px');
    const bw = [cs.borderTopWidth, cs.borderRightWidth, cs.borderBottomWidth, cs.borderLeftWidth];
    if (bw.some(b => b !== '0px')) s.border = `${bw.join(' ')} ${cs.borderTopStyle} ${cs.borderTopColor}`;
    add('boxShadow', cs.boxShadow, v => v === 'none');
    add('opacity', cs.opacity, v => v === '1');
    add('overflow', cs.overflow, v => v === 'visible');
    add('zIndex', cs.zIndex, v => v === 'auto');
    add('transform', cs.transform, v => v === 'none');
    add('filter', cs.filter, v => v === 'none');
    add('backdrop', cs.backdropFilter, v => v === 'none');
    add('textAlign', cs.textAlign, v => v === 'start' || v === 'left');
    add('transition', cs.transitionProperty && cs.transitionProperty !== 'all' || (cs.transitionDuration && cs.transitionDuration !== '0s') ? `${cs.transitionProperty} ${cs.transitionDuration} ${cs.transitionTimingFunction}` : null);
    add('animation', cs.animationName, v => v === 'none');
    return s;
  }

  function textStyle(cs) {
    const s = {
      fontFamily: cs.fontFamily, fontSize: cs.fontSize, fontWeight: cs.fontWeight, lineHeight: cs.lineHeight, color: cs.color,
    };
    const add = (k, v, skip) => { if (v && !(skip && skip(v))) s[k] = v; };
    add('letterSpacing', cs.letterSpacing, v => v === 'normal' || v === '0px');
    add('textTransform', cs.textTransform, v => v === 'none');
    add('textAlign', cs.textAlign, v => v === 'start' || v === 'left');
    add('textDecoration', cs.textDecorationLine, v => v === 'none');
    add('fontStyle', cs.fontStyle, v => v === 'normal');
    add('textShadow', cs.textShadow, v => v === 'none');
    if (cs.webkitBackgroundClip === 'text' || cs.backgroundClip === 'text') s.gradientText = cs.backgroundImage;
    return s;
  }

  function cls(el) {
    const c = (typeof el.className === 'string' ? el.className : (el.className && el.className.baseVal) || '').trim().replace(/\s+/g, ' ');
    return c.length > 160 ? c.slice(0, 160) + '…' : c;
  }

  function rect(el) {
    const r = el.getBoundingClientRect();
    return [Math.round(r.left + scrollX), Math.round(r.top + scrollY), Math.round(r.width), Math.round(r.height)];
  }

  function hasBlockChildren(el) {
    for (const c of el.children) {
      if (SKIP.has(c.tagName)) continue;
      const cs = getComputedStyle(c);
      if (cs.display === 'none') continue;
      if (MEDIA.has(c.tagName) || FORM.has(c.tagName)) return true;
      const d = cs.display;
      if (!d.startsWith('inline') && d !== 'contents') return true;
      if (c.tagName === 'A' || c.tagName === 'BUTTON' || /^H[1-6]$|^P$|^UL$|^OL$|^DIV$|^FORM$|^FIGURE$|^SECTION$/.test(c.tagName)) return true;
    }
    return false;
  }

  function directText(el) {
    let t = '';
    el.childNodes.forEach(n => { if (n.nodeType === 3) t += n.textContent; });
    return t.trim();
  }

  function clean(t) { return (t || '').replace(/\s+/g, ' ').trim(); }

  function svgInfo(el) {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return { kind: 'svg', w: Math.round(r.width), h: Math.round(r.height), fill: cs.fill, color: cs.color, cls: cls(el), label: el.getAttribute('aria-label') || undefined, paths: el.querySelectorAll('path').length };
  }

  function walk(el, depth, opts) {
    if (SKIP.has(el.tagName)) return null;
    if (depth > 45) return null;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (el.tagName.toLowerCase() === 'svg') {
      if (r.width < 1) return null;
      return { t: 'svg', box: rect(el), ...svgInfo(el) };
    }
    if (!visible(el, cs, r)) return null;
    const tag = el.tagName.toLowerCase();
    const base = { t: tag, box: rect(el) };
    const id = el.id; if (id) base.id = id;
    const c = cls(el); if (c) base.cls = c;

    if (el.tagName === 'IMG') {
      return { ...base, kind: 'image', src: el.currentSrc || el.src, alt: el.alt, natural: [el.naturalWidth, el.naturalHeight], objectFit: cs.objectFit !== 'fill' ? cs.objectFit : undefined, style: boxStyle(cs), loading: el.loading || undefined };
    }
    if (el.tagName === 'VIDEO') {
      return { ...base, kind: 'video', src: el.currentSrc || el.src || (el.querySelector('source') || {}).src, autoplay: el.autoplay, loop: el.loop, muted: el.muted, poster: el.poster, style: boxStyle(cs) };
    }
    if (el.tagName === 'IFRAME') {
      return { ...base, kind: 'iframe', src: el.src, title: el.title, style: boxStyle(cs) };
    }
    if (el.tagName === 'CANVAS' || el.tagName === 'PICTURE') {
      const img = el.querySelector('img');
      return { ...base, kind: el.tagName.toLowerCase(), src: img ? (img.currentSrc || img.src) : undefined, alt: img ? img.alt : undefined, style: boxStyle(cs) };
    }
    if (FORM.has(el.tagName)) {
      const o = { ...base, kind: 'field', type: el.type, name: el.name, placeholder: el.placeholder || undefined, required: el.required || undefined, value: (el.type === 'submit' ? el.value : undefined), style: { ...boxStyle(cs), ...textStyle(cs) } };
      return o;
    }

    // textual leaf
    const isLeafText = (TEXTUAL.has(el.tagName) && !hasBlockChildren(el)) ||
      (['A', 'BUTTON'].includes(el.tagName) && !el.querySelector('img,figure,h1,h2,h3,h4,h5,h6,p,ul'));
    if (isLeafText) {
      const text = clean(el.innerText);
      const icons = [...el.querySelectorAll('svg,i[class*=icon],i[class*=fa],img')].map(i => i.tagName.toLowerCase() === 'img' ? { img: i.src } : { icon: cls(i) || 'svg', ...(i.tagName.toLowerCase() === 'svg' ? { w: Math.round(i.getBoundingClientRect().width) } : {}) });
      if (!text && !icons.length) return null;
      const o = { ...base, kind: ['A', 'BUTTON'].includes(el.tagName) ? (el.tagName === 'A' ? 'link' : 'button') : 'text', text, style: { ...boxStyle(cs), ...textStyle(cs) } };
      if (el.tagName === 'A') { o.href = el.href; if (el.target) o.target = el.target; }
      if (icons.length) o.icons = icons;
      // inline emphasis spans with different styling
      const marks = [...el.querySelectorAll('strong,b,em,i,span,mark,u')].filter(m => clean(m.innerText)).map(m => { const mcs = getComputedStyle(m); return { text: clean(m.innerText).slice(0, 60), color: mcs.color !== cs.color ? mcs.color : undefined, weight: mcs.fontWeight !== cs.fontWeight ? mcs.fontWeight : undefined, size: mcs.fontSize !== cs.fontSize ? mcs.fontSize : undefined, bg: !transparent(mcs.backgroundColor) ? mcs.backgroundColor : undefined, family: mcs.fontFamily !== cs.fontFamily ? mcs.fontFamily : undefined }; }).filter(m => m.color || m.weight || m.size || m.bg || m.family);
      if (marks.length) o.marks = marks.slice(0, 6);
      return o;
    }

    // container
    const node = { ...base, kind: 'box', style: boxStyle(cs) };
    if (el.tagName === 'A') { node.href = el.href; }
    if (el.tagName === 'FORM') { node.kind = 'form'; node.action = el.action; node.method = el.method; }
    if (el.tagName === 'UL' || el.tagName === 'OL') { node.kind = 'list'; if (cs.listStyleType !== 'none') node.listStyle = cs.listStyleType; }
    const kids = [];
    // pseudo-element content (decorations)
    for (const ps of ['::before', '::after']) {
      const pcs = getComputedStyle(el, ps);
      if (pcs.content && pcs.content !== 'none' && pcs.content !== 'normal' && pcs.display !== 'none') {
        const hasVisual = !transparent(pcs.backgroundColor) || (pcs.backgroundImage && pcs.backgroundImage !== 'none') || pcs.borderTopWidth !== '0px' || (pcs.content !== '""' && pcs.content !== "''");
        if (hasVisual) {
          (node.pseudo = node.pseudo || {})[ps] = { content: pcs.content.slice(0, 40), w: pcs.width, h: pcs.height, bg: !transparent(pcs.backgroundColor) ? pcs.backgroundColor : undefined, bgImage: pcs.backgroundImage !== 'none' ? pcs.backgroundImage.slice(0, 200) : undefined, position: pcs.position !== 'static' ? pcs.position : undefined, opacity: pcs.opacity !== '1' ? pcs.opacity : undefined };
        }
      }
    }
    const dt = directText(el);
    if (dt) kids.push({ t: '#text', kind: 'text', text: clean(dt), style: textStyle(cs), box: base.box });
    for (const ch of el.children) {
      const w = walk(ch, depth + 1, opts);
      if (w) kids.push(w);
    }
    if (!kids.length) {
      const hasBg = !transparent(cs.backgroundColor) || cs.backgroundImage !== 'none';
      if (!hasBg && !node.pseudo) return null;
      node.empty = true;
      return node;
    }
    // collapse pass-through wrappers
    const sk = Object.keys(node.style).filter(k => !['display', 'textAlign', 'transition', 'overflow'].includes(k) && !(k === 'position' && node.style[k] === 'relative'));
    if (kids.length === 1 && !sk.length && !node.pseudo && node.kind === 'box' && !node.href) {
      const only = kids[0];
      if (!only.wrapped) only.wrapped = [];
      only.wrapped.push((tag + (c ? '.' + c.split(' ')[0] : '')));
      return only;
    }
    node.children = kids;
    return node;
  }

  window.__X = { walk, cls, rect, clean, boxStyle, textStyle, visible };
})();
