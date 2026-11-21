#!/usr/bin/env python3
"""Versión 2: motion comic con Denji, Makima y Pochita animados.
Entrada: script.json + assets/vo2/<scene>_<i>.wav (Chatterbox). Salida: index.html + compositions/*.html.
Regenerar: python3 build2.py"""
import json, subprocess, math, random
from pathlib import Path
from pochita_svg import pochita

P = Path(__file__).parent
FPS = 30
OR, INK, PAPER, RED, STEEL, CREAM = "#FF6A13", "#111111", "#F3F1EC", "#C3121E", "#8E8E8E", "#FFF4E2"
LEAD, GAP, TAIL = 0.45, 0.28, 0.9

script = json.load(open(P / "script.json"))


def dur(f):
    return float(subprocess.check_output(["ffprobe", "-v", "0", "-show_entries", "format=duration", "-of", "csv=p=0", str(f)]))


# ---- tiempos: cada frase en su propio archivo, encadenadas
scenes, t = [], 0.0
for k, (sid, sents) in enumerate(script):
    lines, c = [], LEAD
    for i, txt in enumerate(sents):
        f = f"assets/vo2/{sid}_{i}.wav"; d = dur(P / f)
        lines.append(dict(text=txt, file=f, s=round(c, 3), d=round(d, 3)))
        c += d + (GAP + (0.12 if txt.rstrip().endswith(("...", "?")) else 0))
    D = round(c - GAP + TAIL + (1.6 if k == len(script) - 1 else 0), 2)
    scenes.append(dict(id=sid, start=round(t, 2), D=D, lines=lines))
    t += D
TOTAL = round(t, 2)


def cue_fn(sc):
    def at(i, frag=None, lead=0.0):
        L = sc["lines"][i]; frac = 0
        if frag:
            k = L["text"].lower().find(frag.lower()); assert k >= 0, (sc["id"], frag)
            frac = k / len(L["text"])
        return round(L["s"] + frac * L["d"] - lead, 3)
    def end(i):
        L = sc["lines"][i]; return round(L["s"] + L["d"], 3)
    return at, end


# ---------- piezas ----------
def speedlines(n=110, seed=7, color=INK, cx=960, cy=540, r0=300):
    rnd = random.Random(seed); s = []
    for k in range(n):
        a = 2 * math.pi * k / n + rnd.uniform(-.03, .03); r1 = r0 + rnd.uniform(0, 260); w = rnd.uniform(4, 15)
        x1, y1 = cx + math.cos(a) * r1, cy + math.sin(a) * r1; x2, y2 = cx + math.cos(a) * 2300, cy + math.sin(a) * 2300
        px, py = -math.sin(a) * w, math.cos(a) * w
        s.append(f'<path d="M{x1:.0f},{y1:.0f} L{x2+px:.0f},{y2+py:.0f} L{x2-px:.0f},{y2-py:.0f}Z"/>')
    return f'<svg viewBox="0 0 1920 1080" width="1920" height="1080" fill="{color}" style="position:absolute;left:0;top:0;overflow:visible">{"".join(s)}</svg>'


def blade(uid, w=1000, h=200):
    n = int(w / 40) + 3
    top = "".join(f'<path d="M{-40+k*40},64 l20,-30 l20,30Z"/>' for k in range(n))
    bot = "".join(f'<path d="M{-40+k*40},136 l20,30 l20,-30Z"/>' for k in range(n))
    return (f'<svg viewBox="0 0 {w} 200" width="100%" height="100%" preserveAspectRatio="none" overflow="hidden">'
            f'<g id="{uid}-teeth" fill="#1d1d1f">{top}{bot}</g>'
            f'<rect x="6" y="60" width="{w-12}" height="80" rx="40" fill="#6b6b70" stroke="#111" stroke-width="8"/>'
            f'<line x1="40" y1="100" x2="{w-60}" y2="100" stroke="#a0a0a6" stroke-width="6"/>'
            f'<circle cx="{w-60}" cy="100" r="16" fill="#111"/></svg>')


def demon(uid, c="#1a0a0a"):
    return (f'<svg id="{uid}" viewBox="0 0 200 220" width="100%" height="100%">'
            f'<path d="M40,60 L20,0 L75,45 Z M160,60 L180,0 L125,45 Z" fill="{c}"/>'
            f'<path d="M20,210 C10,110 50,40 100,40 C150,40 190,110 180,210 C150,190 130,215 100,195 C70,215 50,190 20,210Z" fill="{c}"/>'
            f'<circle cx="75" cy="110" r="14" fill="#fff"/><circle cx="125" cy="110" r="14" fill="#fff"/>'
            f'<circle cx="78" cy="114" r="6" fill="#111"/><circle cx="128" cy="114" r="6" fill="#111"/>'
            f'<path d="M70,150 q30,25 60,0" stroke="#fff" stroke-width="6" fill="none"/></svg>')


def heart(uid):
    return (f'<svg id="{uid}" viewBox="0 0 400 380" width="100%" height="100%"><path d="M200,360 C80,270 20,200 20,120 C20,60 70,20 125,20 C160,20 185,40 200,70 C215,40 240,20 275,20 C330,20 380,60 380,120 C380,200 320,270 200,360Z" fill="{RED}" stroke="#111" stroke-width="14"/>'
            f'<path d="M110,90 q-30,20 -25,60" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round" opacity=".7"/></svg>')


def drop(uid):
    return (f'<svg id="{uid}" viewBox="0 0 200 280" width="100%" height="100%"><path d="M100,10 C130,80 180,140 180,190 C180,240 145,270 100,270 C55,270 20,240 20,190 C20,140 70,80 100,10Z" fill="{RED}" stroke="#111" stroke-width="10"/></svg>')


def coin(uid):
    return (f'<svg id="{uid}" viewBox="0 0 200 200" width="100%" height="100%"><circle cx="100" cy="100" r="88" fill="#E5B53A" stroke="#111" stroke-width="10"/>'
            f'<circle cx="100" cy="100" r="62" fill="none" stroke="#111" stroke-width="5"/><text x="100" y="128" text-anchor="middle" font-family="Archivo Black" font-size="80" fill="#111">¥</text></svg>')


def bread(uid):
    return (f'<svg id="{uid}" viewBox="0 0 300 260" width="100%" height="100%"><path d="M40,250 L40,120 C10,110 10,30 80,20 C130,10 170,10 220,20 C290,30 290,110 260,120 L260,250Z" fill="#D9A35B" stroke="#111" stroke-width="12"/>'
            f'<path d="M70,230 L70,130 C50,120 45,55 95,48 C140,40 160,40 205,48 C255,55 250,120 230,130 L230,230Z" fill="#F6E7C8" stroke="#111" stroke-width="5"/></svg>')


def hand(uid, c="#3c4a3a"):
    return (f'<svg id="{uid}" viewBox="0 0 200 400" width="100%" height="100%"><path d="M60,400 L60,170 L30,90 C25,70 45,62 55,80 L75,140 L70,40 C70,20 92,20 94,40 L100,130 L110,25 C112,5 135,8 134,28 L128,135 L146,50 C150,32 172,36 168,56 L150,170 L150,400Z" fill="{c}" stroke="#111" stroke-width="8"/></svg>')


def cord(uid):
    return (f'<svg id="{uid}" viewBox="0 0 120 300" width="100%" height="100%" overflow="visible"><line x1="60" y1="0" x2="60" y2="230" stroke="#111" stroke-width="10"/>'
            f'<rect x="10" y="220" width="100" height="44" rx="22" fill="{OR}" stroke="#111" stroke-width="8"/></svg>')


def arms(uid):
    return (f'<svg viewBox="0 0 660 600" width="100%" height="100%" overflow="visible">'
            f'<path id="{uid}-a1" d="M40,520 C10,360 110,300 200,340 C250,365 290,390 330,395" fill="none" stroke="#E9C9A8" stroke-width="58" stroke-linecap="round" pathLength="100" stroke-dasharray="100 120" stroke-dashoffset="110"/>'
            f'<path id="{uid}-a2" d="M620,520 C650,360 550,300 460,340 C410,365 370,390 330,395" fill="none" stroke="#F1ECDD" stroke-width="58" stroke-linecap="round" pathLength="100" stroke-dasharray="100 120" stroke-dashoffset="110"/></svg>')


def img(uid, src, left, top, h, ratio, extra=""):
    w = round(h * ratio)
    return f'<div id="{uid}" class="ch" style="left:{left}px;top:{top}px;width:{w}px;height:{h}px;{extra}"><img src="{src}" style="width:100%;height:100%;display:block"/></div>'


DEN_R, MAK_R = 633 / 1713, 900 / 1200


def denji(uid, left, top, h, var="cut", overlays=""):
    w = round(h * DEN_R)
    return (f'<div id="{uid}" class="ch" style="left:{left}px;top:{top}px;width:{w}px;height:{h}px;">'
            f'<div id="{uid}-in" class="fill" style="transform-origin:50% 100%;"><img src="assets/chars/denji_{var}.png" style="width:100%;height:100%;display:block"/>{overlays}</div></div>')


def poch(uid, left, top, size, mood="happy", extra=""):
    return (f'<div id="{uid}" class="ch" style="left:{left}px;top:{top}px;width:{size}px;height:{round(size*1.05)}px;{extra}">'
            f'<div id="{uid}-in" class="fill" style="transform-origin:50% 100%;">{pochita(uid + "p", mood)}</div></div>')


BASE = f"""
#root {{ position:absolute; inset:0; overflow:hidden; background:{PAPER}; color:{INK}; font-family:'Archivo Black', sans-serif; }}
.cam {{ position:absolute; inset:0; transform-origin:50% 50%; }}
.pn {{ position:absolute; overflow:hidden; opacity:0; }}
.full {{ left:-20px; top:-20px; width:1960px; height:1120px; }}
.bord {{ border:10px solid {INK}; }}
.tone {{ position:absolute; inset:0; background-image:radial-gradient({INK} 26%, transparent 29%); background-size:14px 14px; opacity:.2; }}
.big {{ position:absolute; text-transform:uppercase; letter-spacing:-0.01em; line-height:.92; margin:0; white-space:nowrap; }}
.sub {{ position:absolute; font-family:'Inter', sans-serif; font-weight:900; line-height:1.1; margin:0; white-space:nowrap; }}
.h {{ opacity:0; }}
.fill {{ position:absolute; inset:0; }}
.ch {{ position:absolute; }}
.box {{ position:absolute; }}
.tag {{ position:absolute; font-family:'Archivo Black'; text-transform:uppercase; background:{INK}; color:{PAPER}; padding:6px 18px; font-size:44px; }}
"""

JS = """
const tl = gsap.timeline({ paused: true });
const slam = (s, t, f) => tl.fromTo(s, Object.assign({ opacity: 0, scale: 1.12 }, f || {}), { opacity: 1, scale: 1, x: 0, y: 0, rotation: 0, duration: 0.2, ease: "expo.out" }, t);
const pop = (s, t, f) => tl.fromTo(s, Object.assign({ opacity: 0, scale: 0.4 }, f || {}), { opacity: 1, scale: 1, x: 0, y: 0, rotation: 0, duration: 0.32, ease: "back.out(2.4)" }, t);
const slideIn = (s, t, dx, dy) => tl.fromTo(s, { opacity: 0, x: dx || 0, y: dy || 0, rotation: (dx || 0) > 0 ? 4 : -4 }, { opacity: 1, x: 0, y: 0, rotation: 0, duration: 0.42, ease: "back.out(1.6)" }, t);
const on = (s, t) => tl.set(s, { opacity: 1 }, t);
const off = (s, t) => tl.set(s, { opacity: 0 }, t);
const shake = (s, t, a) => { a = a || 18; [[1,-.6],[-.8,.9],[.7,.4],[-.5,-.8],[.4,.6],[-.3,-.2],[.15,.2]].forEach((q, i) => tl.set(s, { x: q[0]*a, y: q[1]*a }, t + i / 30)); tl.set(s, { x: 0, y: 0 }, t + 7 / 30); };
const punch = (s, t, k, d) => tl.fromTo(s, { scale: 1 }, { scale: k || 1.15, duration: 0.12, ease: "power3.out" }, t).to(s, { scale: 1, duration: (d || 0.9), ease: "power2.inOut" }, t + 0.5);
const chain = (s, t, d, ax) => { const o = {}; o[ax || "x"] = 0; const e = {}; e[ax || "x"] = ax === "y" ? 16 : -40; tl.fromTo(s, o, Object.assign(e, { duration: 0.08, ease: "none", repeat: Math.max(1, Math.round(d / 0.08) - 1) }), t); };
const breathe = (s, t, d) => tl.fromTo(s, { scaleY: 1, scaleX: 1 }, { scaleY: 1.018, scaleX: 0.995, duration: 0.9, ease: "sine.inOut", yoyo: true, repeat: Math.max(1, Math.floor(d / 0.9)) }, t);
const blink = (s, ts) => ts.forEach(t => { tl.to(s, { scaleY: 0.08, duration: 0.05, ease: "power2.in", transformOrigin: "50% 50%" }, t); tl.to(s, { scaleY: 1, duration: 0.08, ease: "power2.out" }, t + 0.08); });
const hop = (s, t, n, hgt) => { hgt = hgt || 70; for (let i = 0; i < n; i++) { const b = t + i * 0.5;
  tl.to(s, { scaleY: 0.86, scaleX: 1.1, duration: 0.07, ease: "power2.out" }, b);
  tl.to(s, { y: -hgt, scaleY: 1.1, scaleX: 0.93, duration: 0.18, ease: "power2.out" }, b + 0.07);
  tl.to(s, { y: 0, scaleY: 1, scaleX: 1, duration: 0.18, ease: "power2.in" }, b + 0.25);
  tl.to(s, { scaleY: 0.9, scaleX: 1.07, duration: 0.05 }, b + 0.43); tl.to(s, { scaleY: 1, scaleX: 1, duration: 0.07 }, b + 0.48); } };
const wag = (s, t, d) => tl.fromTo(s, { rotation: -14 }, { rotation: 14, duration: 0.14, ease: "sine.inOut", yoyo: true, repeat: Math.max(1, Math.round(d / 0.14)), transformOrigin: "0% 0%" }, t);
const sway = (s, t, d, a) => tl.fromTo(s, { rotation: -(a || 3) }, { rotation: (a || 3), duration: 0.6, ease: "sine.inOut", yoyo: true, repeat: Math.max(1, Math.round(d / 0.6)) }, t);
const impact = (s, t) => { tl.set(s, { opacity: 1 }, t); tl.set(s, { opacity: 0 }, t + 2 / 30); tl.set(s, { opacity: 1 }, t + 4 / 30); tl.set(s, { opacity: 0 }, t + 6 / 30); };
"""


def blinks(t0, t1, every=2.3, off=0.6):
    out, t = [], t0 + off
    while t < t1 - 0.3:
        out.append(round(t, 2)); t += every
    return out


def scene_html(sc, m, js):
    sid, D = sc["id"], sc["D"]
    return f"""<template>
  <style>{BASE}</style>
  <div id="root" data-composition-id="{sid}" data-width="1920" data-height="1080" data-duration="{D}">
    <div id="{sid}-cam" class="cam">
{m}
    </div>
  </div>
  <script>
{JS}
tl.fromTo("#{sid}-cam", {{ scale: 1 }}, {{ scale: 1.035, duration: {D}, ease: "none" }}, 0);
{js}
window.__timelines["{sid}"] = tl;
  </script>
</template>
"""


SFX = []


def sfx(sc, f, t_local, peak, vol=1.0):
    SFX.append((f, sc["start"] + t_local, peak, vol))


def P_(uid):  # selectores de partes de Pochita
    return dict(root=f"#{uid}", inn=f"#{uid}-in", eyes=f"#{uid}p-eyes", teeth=f"#{uid}p-teeth", tail=f"#{uid}p-tail")


# ================= ESCENAS =================
def s1(sc):
    at, end = cue_fn(sc); a0, a1, a2, a2b, a3 = at(0), at(1), at(2), at(2, "y los demonios"), at(3); D = sc["D"]
    demons = "".join(f'<div id="s1-dm{k}" class="box" style="left:{200+k*330}px;top:{640+(k%2)*90}px;width:220px;height:242px;">{demon(f"s1-dmsvg{k}")}</div>' for k in range(5))
    m = f"""
      <div id="s1-a" class="pn full" style="background:{PAPER};opacity:1">
        {speedlines(90, 3, "#D8D4CC")}
        <h1 id="s1-t1" class="big h" style="left:1000px;top:250px;font-size:150px;">¡Pequeño!</h1>
        <h1 id="s1-t2" class="big h" style="left:1000px;top:430px;font-size:150px;color:{OR};-webkit-text-stroke:6px {INK};">¡Naranja!</h1>
        {poch("s1-p", 420, 460, 300)}
      </div>
      <div id="s1-b" class="pn full" style="background:{OR};">
        {speedlines(120, 9)}
        {poch("s1-pb", 560, 120, 800, "angry")}
        <p class="sub" style="left:110px;top:920px;font-size:58px;background:{INK};color:{PAPER};padding:6px 16px;">UNA MOTOSIERRA EN LA CABEZA</p>
      </div>
      <div id="s1-c" class="pn full" style="background:#2A0508;">
        {speedlines(100, 4, "#5A0A10")}
        {demons}
        <h1 class="big" style="left:110px;top:120px;font-size:150px;color:{PAPER};">Los demonios</h1>
        <h1 class="big" style="left:110px;top:290px;font-size:150px;color:{OR};">le temen</h1>
      </div>
      <div id="s1-d" class="pn full" style="background:{OR};">
        <div class="tone" style="opacity:.16"></div>
        <p class="sub" style="left:120px;top:250px;font-size:64px;">SEÑORAS Y SEÑORES…</p>
        <h1 id="s1-title" class="big h" style="left:100px;top:340px;font-size:250px;">Pochita</h1>
        {poch("s1-pd", 1380, 330, 470)}
      </div>
      <div id="s1-imp" class="pn full" style="background:{INK};"></div>"""
    p, pb, pd = P_("s1-p"), P_("s1-pb"), P_("s1-pd")
    js = f"""
tl.fromTo("{p['root']}", {{ y: -700, opacity: 1 }}, {{ y: 0, duration: 0.35, ease: "power3.in" }}, {a0 - 0.25});
hop("{p['inn']}", {a0 + 0.1}, 1, 0); slam("#s1-t1", {a0 + 0.15}, {{ x: 80 }});
blink("{p['eyes']}", {blinks(a0, a2)}); wag("{p['tail']}", {a1}, 1.2);
slam("#s1-t2", {a1}, {{ x: 80 }}); tl.to("{p['root']}", {{ scale: 1.5, x: 60, y: -80, duration: 0.25, ease: "back.out(2)" }}, {a1});
on("#s1-b", {a2}); off("#s1-a", {a2 + 0.05}); punch("#s1-b", {a2 + 0.6}, 1.08); chain("{pb['teeth']}", {a2 + 0.6}, {a2b - a2 - 0.4}, "y"); shake("#s1-cam", {a2 + 0.65}, 14); shake("#s1-cam", {a2 + 1.3}, 10);
on("#s1-c", {a2b}); off("#s1-b", {a2b + 0.05});
{"".join(f'pop("#s1-dm{k}", {a2b + 0.1 + k * 0.08:.2f}); tl.to("#s1-dm{k}", {{ x: {-1600 - k*120}, y: {(-1)**k * 40}, rotation: -20, duration: 0.6, ease: "power3.in" }}, {a2b + 1.3 + k*0.07:.2f});' for k in range(5))}
on("#s1-d", {a3}); off("#s1-c", {a3 + 0.05}); slam("#s1-title", {at(3, "esto")}, {{ scale: 1.4 }}); impact("#s1-imp", {at(3, "esto") - 0.02});
shake("#s1-cam", {at(3, "esto") + 0.05}, 16); hop("{pd['inn']}", {at(3, "esto") + 0.3}, 4, 60); blink("{pd['eyes']}", {blinks(a3, D, 1.9, 1.2)}); wag("{pd['tail']}", {a3}, {D - a3 - 0.2});
"""
    sfx(sc, "assets/sfx/film/drop.wav", a0 + 0.1, 0.02, 0.8)
    sfx(sc, "assets/sfx/chainsaw_start.mp3", a2 + 0.6 - 0.113, 0, 0.45)
    sfx(sc, "assets/sfx/film/whoosh.wav", a2b + 1.3, 0.04, 0.8)
    sfx(sc, "assets/sfx/film/hit.wav", at(3, "esto"), 0.24, 1.0)
    return m, js


def s2(sc):
    at, end = cue_fn(sc); a0, am, a1, ac, a2 = at(0), at(0, "Chainsaw"), at(1), at(1, "mueve"), at(2); D = sc["D"]
    m = f"""
      <div id="s2-a" class="pn bord" style="left:50px;top:50px;width:980px;height:980px;background:{CREAM};">
        <div class="tone" style="opacity:.1"></div>
        <p class="sub" style="left:56px;top:56px;font-size:46px;">POCHITA ES EL</p>
        <h1 class="big" style="left:50px;top:130px;font-size:118px;line-height:1;">Demonio<br><span style="color:{OR};-webkit-text-stroke:5px {INK};">Motosierra</span></h1>
        {poch("s2-p", 300, 420, 470)}
      </div>
      <div id="s2-b" class="pn bord" style="left:1070px;top:50px;width:800px;height:470px;background:{INK};color:{PAPER};">
        <h1 class="big" style="left:50px;top:60px;font-size:104px;color:{OR};line-height:1;">Chainsaw<br>Man</h1>
        <p class="sub" style="left:54px;top:310px;font-size:42px;color:{PAPER};">MANGA DE TATSUKI FUJIMOTO</p>
      </div>
      <div id="s2-c" class="pn bord" style="left:1070px;top:560px;width:800px;height:470px;background:{PAPER};">
        <h1 class="big" style="left:50px;top:60px;font-size:96px;">¿Un perrito?</h1>
        <div id="s2-bone" class="box" style="left:60px;top:230px;width:300px;height:120px;"><svg viewBox="0 0 300 120" width="100%" height="100%"><path d="M60,40 a30,30 0 1,1 20,-25 h140 a30,30 0 1,1 20,25 a30,30 0 1,1 -20,25 h-140 a30,30 0 1,1 -20,-25Z" fill="#fff" stroke="#111" stroke-width="10"/></svg></div>
      </div>
      <div id="s2-d" class="pn full" style="background:{RED};">
        {speedlines(120, 13, "#7A0A12")}
        {poch("s2-pd", 1140, 210, 700, "angry")}
        <h1 class="big" style="left:110px;top:330px;font-size:150px;color:{PAPER};-webkit-text-stroke:5px {INK};line-height:1;">¡No te dejes<br>engañar!</h1>
      </div>"""
    p, pd = P_("s2-p"), P_("s2-pd")
    js = f"""
slam("#s2-a", {a0}); pop("{p['root']}", {a0 + 0.3}, {{ y: 200 }}); blink("{p['eyes']}", {blinks(a0, a2)});
slideIn("#s2-b", {am}, 300);
slideIn("#s2-c", {a1}, 0, 300); wag("{p['tail']}", {ac}, {a2 - ac}); sway("{p['inn']}", {a1}, {a2 - a1}, 6); pop("#s2-bone", {ac});
on("#s2-d", {a2}); impact("#s2-imp", {a2}); punch("#s2-d", {a2 + 0.02}, 1.12); shake("#s2-cam", {a2 + 0.05}, 22); chain("{pd['teeth']}", {a2}, {D - a2}, "y");
"""
    m += f'\n      <div id="s2-imp" class="pn full" style="background:{PAPER};"></div>'
    sfx(sc, "assets/sfx/film/whoosh_soft.wav", am, 0.30, 0.7)
    sfx(sc, "assets/sfx/film/pop.wav", ac, 0.03, 0.9)
    sfx(sc, "assets/sfx/chainsaw_rev.mp3", a2 + 0.02, 0.0, 0.4)
    sfx(sc, "assets/sfx/film/impact.wav", a2, 0.25, 1.0)
    return m, js


def s3(sc):
    at, end = cue_fn(sc); a0, ah, a1, as_, a2, ai = at(0), at(0, "herido"), at(1), at(1, "su propia"), at(2), at(2, "inseparables"); D = sc["D"]
    m = f"""
      <div id="s3-a" class="pn full" style="background:{PAPER};opacity:1">
        <div class="tone" style="opacity:.13"></div>
        <div style="position:absolute;left:0;top:880px;width:1960px;height:240px;background:#CFC9BD;border-top:8px solid {INK};"></div>
        {denji("s3-d", 140, 90, 980)}
        <span class="tag" style="left:560px;top:150px;">Denji</span>
        {poch("s3-ph", 1150, 640, 320, "hurt", "transform:rotate(-80deg);")}
        {poch("s3-pk", 1150, 600, 320, "happy", "opacity:0;")}
        <div id="s3-drop" class="box h" style="left:1260px;top:300px;width:90px;height:126px;">{drop("s3-dsvg")}</div>
        <p id="s3-l1" class="sub h" style="left:1050px;top:140px;font-size:66px;background:{INK};color:{PAPER};padding:6px 16px;">HERIDO…</p>
        <p id="s3-l2" class="sub h" style="left:1050px;top:140px;font-size:66px;background:{RED};color:{PAPER};padding:6px 16px;">¡SU PROPIA SANGRE!</p>
      </div>
      <div id="s3-b" class="pn full" style="background:{OR};">
        {speedlines(110, 17)}
        {denji("s3-d2", 360, 80, 1000)}
        {poch("s3-p2", 1000, 600, 380)}
        <h1 class="big" style="left:120px;top:60px;font-size:150px;background:{INK};color:{PAPER};padding:4px 26px;">Inseparables</h1>
      </div>"""
    ph, pk, p2 = P_("s3-ph"), P_("s3-pk"), P_("s3-p2")
    js = f"""
slideIn("#s3-d", {a0}, -700); breathe("#s3-d-in", {a0 + 0.4}, {a2 - a0});
on("#s3-l1", {ah}); tl.fromTo("{ph['root']}", {{ x: 0 }}, {{ x: 6, duration: 0.18, ease: "sine.inOut", yoyo: true, repeat: 9 }}, {a0 + 0.3});
off("#s3-l1", {as_}); on("#s3-l2", {as_}); punch("#s3-a", {as_}, 1.1);
tl.fromTo("#s3-drop", {{ opacity: 1, y: -320 }}, {{ y: 320, duration: 0.55, ease: "power2.in" }}, {as_ + 0.3}); off("#s3-drop", {as_ + 0.86});
off("{ph['root']}", {as_ + 0.9}); on("{pk['root']}", {as_ + 0.9}); hop("{pk['inn']}", {as_ + 0.9}, 3, 90); blink("{pk['eyes']}", [{as_ + 2.6}]);
on("#s3-b", {a2}); off("#s3-a", {a2 + 0.05}); slideIn("#s3-d2", {a2}, -400); pop("{p2['root']}", {a2 + 0.15}, {{ y: 200 }});
hop("{p2['inn']}", {ai}, 4, 70); wag("{p2['tail']}", {a2}, {D - a2}); blink("{p2['eyes']}", {blinks(a2, D, 1.8)}); sway("#s3-d2-in", {a2 + 0.4}, {D - a2 - 0.4}, 2);
"""
    sfx(sc, "assets/sfx/film/whoosh_soft.wav", a0 + 0.2, 0.30, 0.7)
    sfx(sc, "assets/sfx/film/pop.wav", as_ + 0.86, 0.03, 1.0)
    sfx(sc, "assets/sfx/film/sting.wav", as_ + 0.9, 0.65, 0.6)
    sfx(sc, "assets/sfx/film/hit.wav", ai, 0.24, 0.9)
    return m, js


def s4(sc):
    at, end = cue_fn(sc); a0, ay, a1, am, ap, a2 = at(0), at(0, "yakuza"), at(1), at(1, "monedas"), at(1, "pan duro"), at(2); D = sc["D"]
    coins = "".join(f'<div id="s4-c{k}" class="box h" style="left:{700+k*230}px;top:{-260}px;width:170px;height:170px;">{coin(f"s4-cs{k}")}</div>' for k in range(5))
    m = f"""
      <div id="s4-a" class="pn full" style="background:#1B1B22;opacity:1">
        {denji("s4-d", 150, 100, 980, "dark")}
        <p class="sub" style="left:640px;top:200px;font-size:56px;color:{PAPER};">UNA DEUDA ENORME CON LA</p>
        <h1 id="s4-y" class="big h" style="left:630px;top:290px;font-size:230px;color:{RED};-webkit-text-stroke:6px {INK};">Yakuza</h1>
        {coins}
      </div>
      <div id="s4-b" class="pn bord" style="left:50px;top:50px;width:900px;height:980px;background:{PAPER};">
        <div class="tone" style="opacity:.12"></div>
        <p class="sub" style="left:50px;top:50px;font-size:54px;">CAZAR DEMONIOS</p>
        <h1 class="big" style="left:46px;top:120px;font-size:110px;">x 4 monedas</h1>
        {poch("s4-p", 260, 420, 420)}
      </div>
      <div id="s4-c" class="pn bord" style="left:990px;top:50px;width:880px;height:470px;background:{CREAM};">
        <div id="s4-br" class="box" style="left:60px;top:90px;width:300px;height:260px;">{bread("s4-brs")}</div>
        <h1 class="big" style="left:400px;top:170px;font-size:96px;">Pan duro</h1>
      </div>
      <div id="s4-e" class="pn bord" style="left:990px;top:560px;width:880px;height:470px;background:{OR};">
        {denji("s4-d3", 40, 30, 1300)}
        <p class="sub" style="left:330px;top:70px;font-size:48px;">SUEÑAN CON</p>
        <h1 class="big" style="left:326px;top:140px;font-size:96px;line-height:1;">Una vida<br>normal</h1>
      </div>"""
    p = P_("s4-p")
    js = f"""
slideIn("#s4-d", {a0}, -500); breathe("#s4-d-in", {a0}, {a1 - a0}); slam("#s4-y", {ay}, {{ scale: 1.4 }}); shake("#s4-cam", {ay + 0.05}, 12);
{"".join(f'on("#s4-c{k}", {ay + 0.3 + k*0.12:.2f}); tl.fromTo("#s4-c{k}", {{ y: 0, rotation: 0 }}, {{ y: {1500 + k*40}, rotation: {(-1)**k * 200}, duration: 1.3, ease: "power2.in" }}, {ay + 0.3 + k*0.12:.2f});' for k in range(5))}
on("#s4-b", {a1}); off("#s4-a", {a1 + 0.05}); slam("#s4-b", {a1}); pop("{p['root']}", {am}, {{ y: 150 }}); hop("{p['inn']}", {am + 0.3}, 2, 50); blink("{p['eyes']}", {blinks(a1, D)});
slideIn("#s4-c", {ap}, 400); tl.fromTo("#s4-br", {{ rotation: -8 }}, {{ rotation: 8, duration: 0.3, yoyo: true, repeat: 5, ease: "sine.inOut" }}, {ap + 0.3});
slideIn("#s4-e", {a2}, 0, 400); breathe("#s4-d3-in", {a2}, {D - a2});
"""
    sfx(sc, "assets/sfx/film/drop.wav", ay + 0.05, 0.02, 0.9)
    for k in range(4):
        sfx(sc, "assets/sfx/film/tick.wav", am + 0.1 + k * 0.11, 0.0, 0.7)
    sfx(sc, "assets/sfx/film/slide.wav", ap, 0.24, 0.7)
    sfx(sc, "assets/sfx/film/whoosh_soft.wav", a2, 0.30, 0.7)
    return m, js


def s5(sc):
    at, end = cue_fn(sc); a0, a1, az, a2 = at(0), at(1), at(1, "Zombi"), at(2); D = sc["D"]
    hands = "".join(f'<div id="s5-h{k}" class="box" style="left:{80+k*370}px;top:620px;width:200px;height:400px;">{hand(f"s5-hs{k}")}</div>' for k in range(5))
    strips = ""
    polys = ["0 0,100% 0,100% 30%,0 42%", "0 42%,100% 30%,100% 64%,0 74%", "0 74%,100% 64%,100% 100%,0 100%"]
    for k, pg in enumerate(polys):
        strips += f'<div id="s5-s{k}" class="box" style="left:620px;top:60px;width:{round(960*DEN_R)}px;height:960px;clip-path:polygon({pg});"><img src="assets/chars/denji_red.png" style="width:100%;height:100%"/></div>'
    m = f"""
      <div id="s5-a" class="pn full" style="background:{INK};opacity:1">
        {speedlines(100, 21, "#3a0a0e")}
        {denji("s5-d", 1200, 90, 960, "red")}
        <h1 id="s5-t" class="big h" style="left:110px;top:400px;font-size:220px;color:{RED};-webkit-text-stroke:6px {PAPER};">Traición</h1>
      </div>
      <div id="s5-b" class="pn full" style="background:#2E3A2C;">
        <div class="tone" style="opacity:.25"></div>
        <p class="sub" style="left:120px;top:130px;font-size:62px;color:{PAPER};">UN PACTO CON EL</p>
        <h1 class="big" style="left:110px;top:220px;font-size:170px;color:#B9D99A;-webkit-text-stroke:6px {INK};">Demonio Zombi</h1>
        {hands}
      </div>
      <div id="s5-c" class="pn full" style="background:{RED};">
        {strips}
        <h1 class="big" style="left:110px;top:120px;font-size:150px;color:{PAPER};-webkit-text-stroke:5px {INK};line-height:1;">¡Despedazan<br>a Denji!</h1>
      </div>
      <div id="s5-imp" class="pn full" style="background:{PAPER};"></div>"""
    js = f"""
slideIn("#s5-d", {a0}, 500); slam("#s5-t", {at(0, "traición")}, {{ scale: 1.5 }}); shake("#s5-cam", {at(0, "traición") + 0.05}, 16);
on("#s5-b", {a1}); off("#s5-a", {a1 + 0.05});
{"".join(f'tl.fromTo("#s5-h{k}", {{ y: 420 }}, {{ y: 0, duration: 0.5, ease: "back.out(1.4)" }}, {az - 0.6 + k*0.1:.2f}); tl.fromTo("#s5-h{k}", {{ rotation: -4 }}, {{ rotation: 4, duration: 0.35, yoyo: true, repeat: 5, ease: "sine.inOut", transformOrigin: "50% 100%" }}, {az + k*0.1:.2f});' for k in range(5))}
on("#s5-c", {a2}); off("#s5-b", {a2 + 0.05}); impact("#s5-imp", {at(2, "despedazan")});
tl.fromTo("#s5-s0", {{ x: 0, y: 0, rotation: 0 }}, {{ x: -70, y: -40, rotation: -6, duration: 0.5, ease: "power4.out" }}, {at(2, "despedazan") + 0.1});
tl.fromTo("#s5-s2", {{ x: 0, y: 0, rotation: 0 }}, {{ x: 80, y: 50, rotation: 5, duration: 0.5, ease: "power4.out" }}, {at(2, "despedazan") + 0.1});
shake("#s5-cam", {at(2, "despedazan") + 0.1}, 28);
"""
    sfx(sc, "assets/sfx/film/drop.wav", at(0, "traición") + 0.05, 0.02, 1.0)
    sfx(sc, "assets/sfx/film/whoosh_soft.wav", az - 0.6, 0.30, 0.7)
    sfx(sc, "assets/sfx/film/impact.wav", at(2, "despedazan") + 0.1, 0.25, 1.0)
    return m, js


def s6(sc):
    at, end = cue_fn(sc); a0, a1, ac, a2, as_ = at(0), at(1), at(1, "corazón"), at(2), at(2, "ver sus"); D = sc["D"]
    m = f"""
      <div id="s6-a" class="pn full" style="background:radial-gradient(circle at 50% 55%, #3a3a3a 0, {INK} 60%);opacity:1">
        {poch("s6-p0", 760, 300, 420)}
        <h1 class="big" style="left:110px;top:90px;font-size:120px;color:{PAPER};">El momento clave</h1>
      </div>
      <div id="s6-b" class="pn full" style="background:{CREAM};">
        <div class="tone" style="opacity:.1"></div>
        {poch("s6-p", 120, 470, 440)}
        {denji("s6-d", 1380, 80, 980)}
        <div id="s6-h" class="box h" style="left:330px;top:420px;width:200px;height:190px;">{heart("s6-hs")}</div>
        <div class="box bord" style="left:640px;top:90px;width:640px;height:400px;background:#fff;transform:rotate(-2deg);">
          <h1 class="big" style="left:40px;top:30px;font-size:84px;">Contrato</h1>
          <p class="sub" style="left:44px;top:150px;font-size:40px;">POCHITA ENTREGA:</p>
          <p class="sub" style="left:44px;top:200px;font-size:56px;color:{RED};">SU CORAZÓN ♥</p>
          <p id="s6-l2" class="sub h" style="left:44px;top:290px;font-size:40px;">A CAMBIO: VER SUS SUEÑOS</p>
        </div>
        <div id="s6-st" class="box h" style="left:900px;top:430px;width:360px;height:130px;"><div style="position:absolute;inset:0;border:10px solid {RED};transform:rotate(-9deg);"><p class="sub" style="left:30px;top:28px;font-size:60px;color:{RED};">¡FIRMADO!</p></div></div>
      </div>"""
    p0, p = P_("s6-p0"), P_("s6-p")
    js = f"""
pop("{p0['root']}", {a0 + 0.1}, {{ y: 120 }}); blink("{p0['eyes']}", {blinks(a0, a1, 1.5, 0.8)}); breathe("{p0['inn']}", {a0}, {a1 - a0});
on("#s6-b", {a1}); off("#s6-a", {a1 + 0.05}); slideIn("#s6-d", {a1}, 400); breathe("#s6-d-in", {a1}, {D - a1}); blink("{p['eyes']}", {blinks(a1, D)});
pop("#s6-h", {ac}); tl.to("#s6-hs", {{ scale: 1.15, duration: 0.1, yoyo: true, repeat: 1, transformOrigin: "50% 50%" }}, {ac + 0.4});
tl.to("#s6-h", {{ x: 1130, y: -60, duration: 1.1, ease: "power2.inOut" }}, {ac + 0.8});
tl.to("#s6-hs", {{ scale: 1.2, duration: 0.1, yoyo: true, repeat: 1, transformOrigin: "50% 50%" }}, {ac + 2.0});
on("#s6-l2", {a2}); slam("#s6-st", {as_ + 0.2}, {{ scale: 2 }}); shake("#s6-cam", {as_ + 0.25}, 10); hop("{p['inn']}", {as_ + 0.4}, 3, 60);
"""
    for k, dt in enumerate((0.4, 2.0)):
        sfx(sc, "assets/sfx/heartbeat.mp3", ac + dt, 0.099, 0.9)
    sfx(sc, "assets/sfx/film/drop.wav", as_ + 0.25, 0.02, 0.9)
    return m, js


def s7(sc):
    at, end = cue_fn(sc); a0, a1, a2 = at(0), at(1), at(2); D = sc["D"]
    # Denji 1000 px de alto -> cabeza x~49%, frente y~3.5%; muñeca alzada (39%,17%); muñeca en cadera (9%,36%)
    ov = (f'<div id="s7-bh" class="box h" style="left:42%;top:-24%;width:14%;height:27%;"><div class="fill" style="transform:rotate(90deg) scale(1.9,.52);transform-origin:50% 50%;">{blade("s7-b1", 600)}</div></div>'
          f'<div id="s7-ba" class="box h" style="left:24%;top:-2%;width:12%;height:22%;"><div class="fill" style="transform:rotate(80deg) scale(1.8,.5);">{blade("s7-b2", 500)}</div></div>'
          f'<div id="s7-bc" class="box h" style="left:-34%;top:33%;width:40%;height:7%;"><div class="fill" style="transform:rotate(-20deg);">{blade("s7-b3", 600)}</div></div>'
          f'<div id="s7-cord" class="box h" style="left:43%;top:21%;width:8%;height:12%;">{cord("s7-cs")}</div>')
    m = f"""
      <div id="s7-a" class="pn full" style="background:{OR};opacity:1">
        {speedlines(130, 5)}
        <h1 id="s7-t" class="big" style="left:90px;top:400px;font-size:200px;background:{INK};color:{OR};padding:6px 30px;">Chainsaw Man</h1>
      </div>
      <div id="s7-b" class="pn full" style="background:{PAPER};">
        <div class="tone" style="opacity:.14"></div>
        {speedlines(110, 6, "#d9d4ca")}
        {denji("s7-d", 760, 150, 1000, "cut", ov)}
        <p id="s7-l1" class="sub h" style="left:90px;top:820px;font-size:56px;background:{INK};color:{PAPER};padding:6px 16px;">TIRA DE LA CUERDA DE SU PECHO</p>
        <h1 id="s7-l2" class="big h" style="left:90px;top:160px;font-size:130px;color:{OR};-webkit-text-stroke:6px {INK};line-height:1;">¡Salen las<br>motosierras!</h1>
      </div>
      <div id="s7-imp" class="pn full" style="background:{INK};"></div>"""
    js = f"""
slam("#s7-t", {a0}, {{ scale: 1.5 }}); shake("#s7-cam", {a0 + 0.05}, 18); punch("#s7-a", {a0 + 0.8}, 1.1);
on("#s7-b", {a1}); off("#s7-a", {a1 + 0.05}); slideIn("#s7-d", {a1}, 0, 300); on("#s7-l1", {at(1, "tira")});
on("#s7-cord", {at(1, "tira")}); tl.fromTo("#s7-cord", {{ y: 0 }}, {{ y: 120, duration: 0.35, ease: "power2.in" }}, {at(1, "cuerda")}); tl.to("#s7-cord", {{ y: 0, duration: 0.12, ease: "power4.out" }}, {at(1, "cuerda") + 0.5});
impact("#s7-imp", {a2}); off("#s7-l1", {a2}); slam("#s7-l2", {a2 + 0.1});
tl.fromTo("#s7-bh", {{ opacity: 1, scaleY: 0, transformOrigin: "50% 100%" }}, {{ scaleY: 1, duration: 0.16, ease: "back.out(2)" }}, {a2 + 0.05});
tl.fromTo("#s7-ba", {{ opacity: 1, scaleY: 0, transformOrigin: "50% 100%" }}, {{ scaleY: 1, duration: 0.16, ease: "back.out(2)" }}, {a2 + 0.15});
tl.fromTo("#s7-bc", {{ opacity: 1, scaleX: 0, transformOrigin: "100% 50%" }}, {{ scaleX: 1, duration: 0.16, ease: "back.out(2)" }}, {a2 + 0.25});
chain("#s7-b1-teeth", {a2}, {D - a2}); chain("#s7-b2-teeth", {a2}, {D - a2}); chain("#s7-b3-teeth", {a2}, {D - a2});
shake("#s7-cam", {a2 + 0.1}, 24); shake("#s7-cam", {a2 + 0.7}, 14); shake("#s7-cam", {a2 + 1.4}, 10); punch("#s7-b", {a2 + 0.1}, 1.12);
"""
    sfx(sc, "assets/sfx/film/hit.wav", a0 + 0.05, 0.24, 1.0)
    sfx(sc, "assets/sfx/film/whoosh.wav", at(1, "cuerda") + 0.35, 0.04, 0.9)
    sfx(sc, "assets/sfx/chainsaw_rev.mp3", a2 + 0.05, 0.0, 0.6)
    sfx(sc, "assets/sfx/film/impact.wav", a2 + 0.05, 0.25, 1.0)
    return m, js


def s8(sc):
    at, end = cue_fn(sc); a0, a1, a2, a3, ad, ab = at(0), at(1), at(2), at(3), at(3, "desaparecen"), at(3, "se borra"); D = sc["D"]
    tape = lambda uid, top: f'<div id="{uid}" class="box" style="left:-200px;top:{top}px;width:2320px;height:150px;background:repeating-linear-gradient(45deg,{OR} 0 60px,{INK} 60px 120px);border-top:8px solid {INK};border-bottom:8px solid {INK};"></div>'
    letters = "".join(f'<span id="s8-L{k}" style="display:inline-block;">{ch}</span>' for k, ch in enumerate("CONCEPTO"))
    tiny = "".join(f'<div id="s8-dm{k}" class="box" style="left:{150+k*300}px;top:860px;width:130px;height:143px;">{demon(f"s8-dms{k}", "#120404")}</div>' for k in range(6))
    m = f"""
      <div id="s8-a" class="pn full" style="background:{PAPER};opacity:1">
        {tape("s8-t1", 150)}{tape("s8-t2", 780)}
        <h1 class="big" style="left:330px;top:410px;font-size:180px;background:{RED};color:{PAPER};padding:10px 36px;border:10px solid {INK};">¡Spoilers!</h1>
      </div>
      <div id="s8-b" class="pn full" style="background:{CREAM};">
        <div class="tone" style="opacity:.12"></div>
        {poch("s8-p", 760, 360, 400)}
        <p class="sub" style="left:110px;top:110px;font-size:64px;">NO ES UN DEMONIO CUALQUIERA…</p>
      </div>
      <div id="s8-c" class="pn full" style="background:linear-gradient(#5A0A10, #1A0204);">
        {speedlines(120, 29, "#7A0A12", 960, 300)}
        {poch("s8-pc", 520, -40, 920, "angry")}
        {tiny}
        <h1 class="big" style="left:90px;top:640px;font-size:150px;color:{PAPER};-webkit-text-stroke:5px {INK};">Héroe del Infierno</h1>
      </div>
      <div id="s8-d" class="pn full" style="background:{INK};">
        <p class="sub" style="left:140px;top:170px;font-size:60px;color:{PAPER};">LO QUE DEVORA…</p>
        <h1 class="big" data-layout-ignore style="left:130px;top:400px;font-size:230px;color:transparent;-webkit-text-stroke:3px #4a4a4a;">Concepto</h1>
        <h1 class="big" data-layout-allow-overlap style="left:130px;top:400px;font-size:230px;color:{PAPER};">{letters}</h1>
        <p id="s8-g" class="sub h" style="left:140px;top:760px;font-size:60px;color:{OR};">…SE BORRA DEL MUNDO PARA SIEMPRE</p>
        {poch("s8-pe", -500, 330, 380, "angry")}
      </div>
      <div id="s8-imp" class="pn full" style="background:{PAPER};"></div>"""
    p, pc, pe = P_("s8-p"), P_("s8-pc"), P_("s8-pe")
    eat = "".join(f'tl.to("#s8-L{k}", {{ opacity: 0, y: {(-1)**k * 70}, rotation: {(-1)**k * 30}, duration: 0.14, ease: "power2.in" }}, {ad + 0.35 + k * 0.11:.2f});' for k in range(8))
    js = f"""
on("#s8-t1", {a0}); tl.fromTo("#s8-t1", {{ x: -2400, rotation: -6 }}, {{ x: 0, rotation: -6, duration: 0.22, ease: "power4.out" }}, {a0});
on("#s8-t2", {a0}); tl.fromTo("#s8-t2", {{ x: 2400, rotation: 5 }}, {{ x: 0, rotation: 5, duration: 0.22, ease: "power4.out" }}, {a0 + 0.1}); shake("#s8-cam", {a0 + 0.3}, 10);
on("#s8-b", {a1}); off("#s8-a", {a1 + 0.05}); pop("{p['root']}", {a1 + 0.1}); blink("{p['eyes']}", [{a1 + 0.9}]); sway("{p['inn']}", {a1}, {a2 - a1}, 4);
on("#s8-c", {a2}); off("#s8-b", {a2 + 0.05}); impact("#s8-imp", {a2}); tl.fromTo("{pc['root']}", {{ y: 500, scale: 0.6 }}, {{ y: 0, scale: 1, duration: 0.5, ease: "back.out(1.5)" }}, {a2});
chain("{pc['teeth']}", {a2}, {a3 - a2}, "y"); shake("#s8-cam", {a2 + 0.1}, 22);
{"".join(f'tl.to("#s8-dm{k}", {{ x: {(-1)**k * 900}, y: 40, rotation: {(-1)**k * 25}, duration: 0.7, ease: "power3.in" }}, {a2 + 0.6 + k*0.06:.2f});' for k in range(6))}
on("#s8-d", {a3}); off("#s8-c", {a3 + 0.05});
tl.fromTo("{pe['root']}", {{ x: 0 }}, {{ x: 2700, duration: 1.4, ease: "none" }}, {ad + 0.1}); hop("{pe['inn']}", {ad + 0.1}, 3, 40); chain("{pe['teeth']}", {ad}, 1.6, "y");
{eat}
on("#s8-g", {ab});
"""
    sfx(sc, "assets/sfx/film/whoosh.wav", a0, 0.04, 0.9)
    sfx(sc, "assets/sfx/film/riser.wav", a2, 1.47, 0.8)
    sfx(sc, "assets/sfx/film/impact.wav", a2, 0.25, 1.0)
    sfx(sc, "assets/sfx/chainsaw_rev.mp3", ad + 0.1, 0.0, 0.45)
    return m, js


def s9(sc):
    at, end = cue_fn(sc); a0, am, ac = at(0), at(0, "Makima"), at(0, "controlarlo"); D = sc["D"]
    rings = "".join(f'<circle cx="0" cy="0" r="{r}" fill="none" stroke="{OR}" stroke-width="10"/>' for r in (40, 80, 120))
    m = f"""
      <div id="s9-a" class="pn full" style="background:#F6E9E4;opacity:1">
        <div class="tone" style="opacity:.1"></div>
        <div id="s9-mk" class="ch" style="left:980px;top:120px;width:900px;height:1200px;"><img src="assets/chars/makima_cut.png" style="width:100%;height:100%"/></div>
        <h1 id="s9-n" class="big h" style="left:110px;top:150px;font-size:220px;color:{RED};-webkit-text-stroke:7px {INK};">Makima</h1>
        <p id="s9-q" class="sub h" style="left:120px;top:400px;font-size:58px;">LA MISTERIOSA JEFA DE DENJI</p>
        <p id="s9-q2" class="sub h" style="left:120px;top:490px;font-size:58px;background:{INK};color:{PAPER};padding:6px 16px;">QUIERE CONTROLARLO</p>
        <svg class="box" style="left:0;top:0;" width="1920" height="1080" viewBox="0 0 1920 1080">
          <path id="s9-leash" d="M1150,760 C900,900 600,950 420,880" fill="none" stroke="{INK}" stroke-width="14" stroke-linecap="round" stroke-dasharray="22 14" pathLength="100"/>
        </svg>
        {poch("s9-p", 200, 700, 300)}
      </div>
      <div id="s9-b" class="pn full" style="background:{INK};">
        <div id="s9-eye" class="ch" style="left:-1150px;top:-1250px;width:4200px;height:5600px;"><img src="assets/chars/makima_cut.png" style="width:100%;height:100%"/></div>
        <p class="sub" style="left:120px;top:900px;font-size:66px;background:{RED};color:{PAPER};padding:6px 16px;">A CUALQUIER PRECIO</p>
      </div>"""
    p = P_("s9-p")
    js = f"""
slideIn("#s9-mk", {a0}, 600); breathe("#s9-mk", {a0 + 0.4}, {D - 0.4}); slam("#s9-n", {am}, {{ scale: 1.3 }}); on("#s9-q", {am + 0.6});
on("#s9-q2", {ac}); tl.fromTo("#s9-leash", {{ strokeDashoffset: 0, opacity: 0 }}, {{ strokeDashoffset: -60, opacity: 1, duration: 1.2, ease: "none" }}, {ac});
pop("{p['root']}", {am + 0.3}); tl.to("{p['root']}", {{ x: 40, rotation: 10, duration: 0.25, ease: "power3.out" }}, {ac + 0.6}); blink("{p['eyes']}", [{ac + 0.2}, {ac + 1.4}]);
on("#s9-b", {at(0, "a cualquier")}); tl.fromTo("#s9-eye", {{ scale: 0.92 }}, {{ scale: 1.0, duration: 1.8, ease: "power2.out" }}, {at(0, "a cualquier")});
"""
    sfx(sc, "assets/sfx/film/whoosh_soft.wav", a0 + 0.1, 0.30, 0.7)
    sfx(sc, "assets/sfx/film/sting.wav", am, 0.65, 0.8)
    sfx(sc, "assets/sfx/film/hit.wav", at(0, "a cualquier"), 0.24, 0.8)
    return m, js


def s10(sc):
    at, end = cue_fn(sc); a0, aa, a1, a2, a3 = at(0), at(0, "alguien"), at(1), at(2), at(3); D = sc["D"]
    hearts = "".join(f'<div id="s10-h{k}" class="box h" style="left:{1150+(k%3)*170}px;top:{230+(k//3)*90}px;width:90px;height:86px;">{heart(f"s10-hs{k}")}</div>' for k in range(5))
    m = f"""
      <div id="s10-a" class="pn full" style="background:{CREAM};opacity:1">
        <div class="tone" style="opacity:.1"></div>
        <p class="sub" style="left:110px;top:110px;font-size:60px;">EL SUEÑO DE POCHITA:</p>
        <h1 class="big" style="left:100px;top:210px;font-size:120px;line-height:1;">Que alguien<br>lo abrazara</h1>
        {denji("s10-d", 1130, 1200, 1500)}
        {poch("s10-p", 1180, 560, 440)}
        <div id="s10-arms" class="box" style="left:1070px;top:470px;width:660px;height:600px;">{arms("s10-ar")}</div>
        {hearts}
      </div>
      <div id="s10-b" class="pn full" style="background:{OR};">
        {speedlines(110, 33)}
        {denji("s10-d2", 1240, 90, 980)}
        {poch("s10-p2", 1000, 640, 360)}
        <p class="sub" style="left:110px;top:200px;font-size:54px;">EL DEMONIO MÁS TEMIDO DEL INFIERNO…</p>
        <h1 class="big" style="left:90px;top:290px;font-size:220px;">Pochita</h1>
        <p id="s10-f" class="sub h" style="left:110px;top:560px;font-size:64px;background:{INK};color:{OR};padding:8px 18px;">…Y EL MEJOR AMIGO DE DENJI</p>
        <div id="s10-cta" class="box h" style="left:100px;top:740px;width:820px;height:150px;background:{PAPER};border:8px solid {INK};">
          <p class="sub" style="left:30px;top:38px;font-size:54px;">💬 ¡TE LEO EN LOS COMENTARIOS!</p></div>
      </div>"""
    p, p2 = P_("s10-p"), P_("s10-p2")
    js = f"""
pop("{p['root']}", {a0 + 0.2}, {{ y: 120 }}); blink("{p['eyes']}", {blinks(a0, a1, 1.7)}); sway("{p['inn']}", {a0}, {aa - a0}, 3);
tl.fromTo("#s10-d", {{ y: 0 }}, {{ y: -1110, duration: 0.6, ease: "power3.out" }}, {aa - 0.4});
tl.to("#s10-ar-a1", {{ strokeDashoffset: 0, duration: 0.7, ease: "power2.out" }}, {aa + 0.1}); tl.to("#s10-ar-a2", {{ strokeDashoffset: 0, duration: 0.7, ease: "power2.out" }}, {aa + 0.18});
tl.to("{p['inn']}", {{ scaleX: 0.93, scaleY: 1.04, duration: 0.3, ease: "power2.out" }}, {aa + 0.75});
{"".join(f'pop("#s10-h{k}", {aa + 0.9 + k*0.15:.2f}); tl.to("#s10-h{k}", {{ y: -120, duration: 1.6, ease: "sine.out" }}, {aa + 1.0 + k*0.15:.2f});' for k in range(5))}
on("#s10-b", {a1}); off("#s10-a", {a1 + 0.05}); slideIn("#s10-d2", {a1}, 400); pop("{p2['root']}", {a1 + 0.2}, {{ y: 150 }}); breathe("#s10-d2-in", {a1}, {D - a1});
on("#s10-f", {a2}); hop("{p2['inn']}", {a2}, 6, 60); wag("{p2['tail']}", {a1}, {D - a1}); blink("{p2['eyes']}", {blinks(a1, D, 2.0)});
slideIn("#s10-cta", {a3}, 0, 200);
"""
    sfx(sc, "assets/sfx/film/whoosh_soft.wav", aa - 0.4, 0.30, 0.7)
    sfx(sc, "assets/sfx/film/pop.wav", aa + 0.9, 0.03, 0.8)
    sfx(sc, "assets/sfx/film/whoosh.wav", a1, 0.04, 0.8)
    sfx(sc, "assets/sfx/film/logo.wav", a2, 0.30, 1.0)
    sfx(sc, "assets/sfx/film/slide.wav", a3, 0.24, 0.7)
    return m, js


FUNCS = dict(s1=s1, s2=s2, s3=s3, s4=s4, s5=s5, s6=s6, s7=s7, s8=s8, s9=s9, s10=s10)
(P / "compositions").mkdir(exist_ok=True)
for sc in scenes:
    m, js = FUNCS[sc["id"]](sc)
    (P / f"compositions/{sc['id']}.html").write_text(scene_html(sc, m, js), encoding="utf-8")

hosts = "\n".join(
    f'      <div id="{sc["id"]}" data-composition-id="{sc["id"]}" data-composition-src="compositions/{sc["id"]}.html" data-start="{sc["start"]}" data-duration="{sc["D"]}" '
    f'data-track-index="1" data-track-kind="graphics" data-width="1920" data-height="1080"></div>' for sc in scenes)
vo = "\n".join(
    f'      <audio id="vo-{sc["id"]}-{i}" class="clip" src="{L["file"]}" data-start="{round(sc["start"] + L["s"], 3)}" data-duration="{L["d"]}" data-track-index="3" data-volume="1"></audio>'
    for sc in scenes for i, L in enumerate(sc["lines"]))
SFX.sort(key=lambda x: x[1]); lanes, fx = [], []
for k, (f, tpk, peak, vol) in enumerate(SFX):
    st = max(0, round(tpk - peak, 3)); d = round(dur(P / f) - (0.06 if f.endswith(".mp3") else 0), 3)
    lane = next((i for i, e in enumerate(lanes) if e <= st), None)
    if lane is None: lanes.append(0); lane = len(lanes) - 1
    lanes[lane] = st + d
    fx.append(f'      <audio id="fx{k}" class="clip" src="{f}" data-start="{st}" data-duration="{d}" data-track-index="{5+lane}" data-volume="{vol}"></audio>')

MUS = dur(P / "assets/music/metal.mp3")
mus = f'      <audio id="music" class="clip" src="assets/music/metal.mp3" data-start="0" data-duration="{min(TOTAL, round(MUS - 0.1, 2))}" data-track-index="2" data-volume="0.16" data-fade-in="0.3" data-fade-out="3"></audio>'
if TOTAL > MUS - 0.1:  # cola: reusar el arranque del tema para cubrir el final
    tail_start = round(MUS - 2.0, 2)
    mus += f'\n      <audio id="music2" class="clip" src="assets/music/metal.mp3" data-start="{tail_start}" data-duration="{round(TOTAL - tail_start, 2)}" data-media-start="23" data-track-index="4" data-volume="0.16" data-fade-in="2" data-fade-out="2.5"></audio>'

index = f"""<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <style>
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ margin: 0; width: 1920px; height: 1080px; overflow: hidden; background: {PAPER}; }}
      #root {{ position: relative; width: 1920px; height: 1080px; background: {PAPER}; }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{TOTAL}" data-width="1920" data-height="1080">
{hosts}
{mus}
{vo}
{chr(10).join(fx)}
    </div>
    <script>
      window.__timelines = window.__timelines || {{}};
      window.__timelines["main"] = gsap.timeline({{ paused: true }});
    </script>
  </body>
</html>
"""
(P / "index.html").write_text(index, encoding="utf-8")
print("total", TOTAL, [(s["id"], s["start"], s["D"]) for s in scenes])
