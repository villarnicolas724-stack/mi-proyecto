// Kit de animación compartido (se inserta en cada escena al generar compositions/).
// Todo es función del tiempo de la línea temporal: sin reloj, sin azar sin semilla.
const KIT = (() => {
  const $ = (s, r = document) => (typeof s === "string" ? r.querySelector(s) : s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  function rng(seed) { // mulberry32
    return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  // separa un texto en palabras (span.w) una sola vez
  function split(el, cls = "w") {
    el = $(el); if (el.dataset.split) return $$("." + cls, el);
    const nodes = Array.from(el.childNodes); el.textContent = "";
    nodes.forEach(nd => {
      if (nd.nodeType !== 3) { el.appendChild(nd); return; }   // <br>, <b>… se conservan
      nd.textContent.split(/(\s+)/).forEach(p => {
        if (/^\s+$/.test(p)) el.appendChild(document.createTextNode(" "));
        else if (p) { const s = document.createElement("span"); s.className = cls; s.textContent = p; s.style.display = "inline-block"; el.appendChild(s); }
      });
    });
    $$(":scope > :not(." + cls + "):not(br)", el).forEach(x => x.classList.add(cls));
    el.dataset.split = 1; return $$("." + cls, el);
  }
  function splitChars(el) {
    el = $(el); const nodes = Array.from(el.childNodes); el.textContent = ""; const out = [];
    nodes.forEach(nd => { if (nd.nodeType !== 3) { el.appendChild(nd); return; } [...nd.textContent].forEach(ch => out.push(mk(ch))); });
    return out;
    function mk(ch) { const s = document.createElement("span"); s.textContent = ch === " " ? " " : ch; s.style.display = "inline-block"; el.appendChild(s); return s; }
  }
  // entrada por palabra: desenfoque → nítido, sin desplazamiento
  function wordsIn(tl, el, t, { gap = 0.07, dur = 0.16, blur = 6 } = {}) {
    const ws = split(el);
    tl.set($(el), { opacity: 1 }, t);
    ws.forEach((w, i) => tl.fromTo(w, { opacity: 0, filter: `blur(${blur}px)` }, { opacity: 1, filter: "blur(0px)", duration: dur, ease: "power2.out" }, t + i * gap));
    return t + ws.length * gap + dur;
  }
  function charsIn(tl, el, t, { gap = 0.045, dur = 0.2 } = {}) {
    const cs = splitChars(el); tl.set($(el), { opacity: 1 }, t);
    cs.forEach((c, i) => tl.fromTo(c, { opacity: 0.0, filter: "blur(4px)" }, { opacity: 1, filter: "blur(0px)", duration: dur, ease: "power1.out" }, t + i * gap));
    return t + cs.length * gap + dur;
  }
  function blurIn(tl, el, t, d = 0.35, from = {}) {
    return tl.fromTo($(el), { opacity: 0, filter: "blur(10px)", ...from }, { opacity: 1, filter: "blur(0px)", x: 0, y: 0, scale: 1, duration: d, ease: "expo.out" }, t);
  }
  function blurOut(tl, el, t, d = 0.25) {
    return tl.to($(el), { opacity: 0, filter: "blur(8px)", duration: d, ease: "power2.in" }, t);
  }
  function fadeIn(tl, el, t, d = 0.6) { return tl.fromTo($(el), { opacity: 0 }, { opacity: 1, duration: d, ease: "power1.inOut" }, t); }
  function fadeOut(tl, el, t, d = 0.4) { return tl.to($(el), { opacity: 0, duration: d, ease: "power1.inOut" }, t); }
  // contador que aterriza y se queda quieto
  function count(tl, el, from, to, t, d = 1.4, fmt = v => Math.round(v).toLocaleString("es-ES")) {
    el = $(el); const o = { v: from };
    el.textContent = fmt(from);
    tl.to(o, { v: to, duration: d, ease: "power2.out", onUpdate: () => (el.textContent = fmt(o.v)) }, t);
    tl.call(() => (el.textContent = fmt(to)), null, t + d + 0.001);
    return t + d;
  }
  const es2 = v => v.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  // un «plano» que entra y sale: devuelve el elemento
  function shot(tl, el, t0, t1, { inFx = "blur", outFx = "blur", dIn = 0.5, dOut = 0.3 } = {}) {
    el = $(el);
    if (inFx === "blur") blurIn(tl, el, t0, dIn); else if (inFx === "fade") fadeIn(tl, el, t0, dIn); else if (inFx === "cut") tl.set(el, { opacity: 1 }, t0);
    if (t1 != null) { if (outFx === "blur") blurOut(tl, el, t1 - dOut, dOut); else if (outFx === "fade") fadeOut(tl, el, t1 - dOut, dOut); else if (outFx === "cut") tl.set(el, { opacity: 0 }, t1); }
    return el;
  }
  // tarjeta de capítulo: la carta gira, se lee, y crece hasta convertirse en el mundo
  function chapterCard(tl, p, t0 = 0, hold = 1.9) {
    const wrap = $(`#${p}-card`), card = $(`#${p}-card .cc-card`), lbl = $(`#${p}-card .cc-num`), ttl = $(`#${p}-card .cc-title`), yr = $(`#${p}-card .cc-year`);
    tl.set(wrap, { opacity: 1 }, t0);
    tl.fromTo(card, { rotationY: -180, scale: 0.55, y: 60 }, { rotationY: 0, scale: 1, y: 0, duration: 1.0, ease: "expo.out" }, t0 + 0.05);
    tl.fromTo(lbl, { opacity: 0 }, { opacity: 1, duration: 0.3 }, t0 + 0.55);
    wordsIn(tl, ttl, t0 + 0.7, { gap: 0.08 });
    tl.fromTo(yr, { opacity: 0, filter: "blur(6px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.3 }, t0 + 1.1);
    const tz = t0 + 0.6 + hold;
    tl.to(card, { scale: 9, rotationZ: 0, duration: 0.75, ease: "power3.in" }, tz);
    tl.to([lbl, ttl, yr], { opacity: 0, duration: 0.2, ease: "power2.in" }, tz);
    tl.to(wrap, { opacity: 0, duration: 0.25, ease: "power1.in" }, tz + 0.55);
    return tz + 0.8;
  }
  // texturas deterministas
  function grain(canvas, { alpha = 0.06, seed = 7, size = 1 } = {}) {
    const c = $(canvas), x = c.getContext("2d"), w = c.width, h = c.height, im = x.createImageData(w, h), r = rng(seed);
    for (let i = 0; i < im.data.length; i += 4) { const v = r() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = alpha * 255; }
    x.putImageData(im, 0, 0);
  }
  function fibers(canvas, { n = 900, seed = 3, color = "rgba(80,60,40,0.10)" } = {}) {
    const c = $(canvas), x = c.getContext("2d"), r = rng(seed);
    x.strokeStyle = color; x.lineCap = "round";
    for (let i = 0; i < n; i++) { const px = r() * c.width, py = r() * c.height, a = r() * Math.PI * 2, l = 6 + r() * 38;
      x.lineWidth = 0.4 + r() * 1.1; x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px + Math.cos(a + 0.6) * l * 0.5, py + Math.sin(a + 0.6) * l * 0.5, px + Math.cos(a) * l, py + Math.sin(a) * l); x.stroke(); }
  }
  return { $, $$, rng, split, splitChars, wordsIn, charsIn, blurIn, blurOut, fadeIn, fadeOut, count, es2, shot, chapterCard, grain, fibers };
})();
