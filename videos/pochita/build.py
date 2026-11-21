#!/usr/bin/env python3
"""Genera index.html y compositions/s1..s10.html a partir de script.json + assets/vo/*.srt.
Regenerar: python3 build.py  (tras cambiar guion o voz)."""
import json, re, subprocess, math, random
from pathlib import Path

P = Path(__file__).parent
VO_OFF = 0.5      # la voz empieza 0.5 s después del corte
GAP = 1.6         # aire tras cada frase de escena
FPS = 30
ORANGE, INK, PAPER, RED, STEEL = "#FF6A13", "#111111", "#F3F1EC", "#C3121E", "#8E8E8E"

script = json.load(open(P / "script.json"))


def dur(f):
    return float(subprocess.check_output(["ffprobe", "-v", "0", "-show_entries", "format=duration", "-of", "csv=p=0", str(f)]))


def srt(f):
    out = []
    for blk in open(f, encoding="utf-8").read().strip().split("\n\n"):
        lines = blk.strip().split("\n")
        a, b = lines[1].split(" --> ")
        ts = lambda s: (lambda h, m, x: int(h) * 3600 + int(m) * 60 + float(x.replace(",", ".")))(*s.split(":"))
        out.append((ts(a), ts(b), " ".join(lines[2:])))
    return out


scenes = []
t = 0.0
for i, (sid, text) in enumerate(script):
    d = dur(P / f"assets/vo/{sid}.mp3")
    D = round(VO_OFF + d + GAP + (1.4 if i == len(script) - 1 else 0), 2)
    scenes.append(dict(id=sid, start=round(t, 2), vo=d, D=D, cues=srt(P / f"assets/vo/{sid}.srt")))
    t += D
TOTAL = round(t, 2)


def cue_fn(sc):
    def at(si, frag=None, lead=0.0):
        a, b, txt = sc["cues"][si]
        frac = 0.0
        if frag:
            k = txt.lower().find(frag.lower())
            assert k >= 0, (sc["id"], frag, txt)
            frac = k / max(1, len(txt))
        return round(VO_OFF + a + frac * (b - a) - lead, 3)
    return at


# ---------- piezas SVG ----------
def speedlines(n=90, seed=7, color=INK, cx=960, cy=540, r0=260):
    rnd = random.Random(seed)
    s = []
    for k in range(n):
        ang = 2 * math.pi * k / n + rnd.uniform(-0.03, 0.03)
        r1 = r0 + rnd.uniform(0, 220)
        w = rnd.uniform(4, 16)
        x1, y1 = cx + math.cos(ang) * r1, cy + math.sin(ang) * r1
        x2, y2 = cx + math.cos(ang) * 2000, cy + math.sin(ang) * 2000
        px, py = -math.sin(ang) * w, math.cos(ang) * w
        s.append(f'<path d="M{x1:.0f},{y1:.0f} L{x2+px:.0f},{y2+py:.0f} L{x2-px:.0f},{y2-py:.0f}Z"/>')
    return f'<svg viewBox="0 0 1920 1080" width="1920" height="1080" fill="{color}">{"".join(s)}</svg>'


def emblem(uid, eyes=True):
    teeth = "".join(f'<path d="M{150+i*0},{40+k*22} l-16,8 l16,8Z"/>' for i in range(1) for k in range(8))
    teeth2 = "".join(f'<path d="M250,{40+k*22} l16,8 l-16,8Z"/>' for k in range(8))
    e = ('<circle cx="140" cy="250" r="14" fill="#111"/><circle cx="260" cy="250" r="14" fill="#111"/>'
         '<path d="M182,300 q18,16 36,0" stroke="#111" stroke-width="8" fill="none" stroke-linecap="round"/>') if eyes else ""
    return (f'<svg id="{uid}" viewBox="0 0 400 420" width="100%" height="100%">'
            f'<g fill="#111">{teeth}{teeth2}</g>'
            f'<rect x="150" y="20" width="100" height="200" rx="50" fill="{STEEL}" stroke="#111" stroke-width="10"/>'
            f'<line x1="200" y1="50" x2="200" y2="185" stroke="#111" stroke-width="6"/>'
            f'<path d="M40,300 C40,190 110,165 200,165 C290,165 360,190 360,300 C360,380 300,405 200,405 C100,405 40,380 40,300Z" fill="{ORANGE}" stroke="#111" stroke-width="12"/>'
            f'{e}</svg>')


def blade(uid, w=1000):
    n = int(w / 40) + 3
    top = "".join(f'<path d="M{-40+k*40},64 l20,-30 l20,30Z"/>' for k in range(n))
    bot = "".join(f'<path d="M{-40+k*40},136 l20,30 l20,-30Z"/>' for k in range(n))
    return (f'<svg viewBox="0 0 {w} 200" width="100%" height="100%" overflow="hidden">'
            f'<g id="{uid}-teeth" fill="#111">{top}{bot}</g>'
            f'<rect x="6" y="60" width="{w-12}" height="80" rx="40" fill="{STEEL}" stroke="#111" stroke-width="8"/>'
            f'<circle cx="{w-60}" cy="100" r="16" fill="#111"/></svg>')


def heart(uid):
    return (f'<svg id="{uid}" viewBox="0 0 400 380" width="100%" height="100%">'
            f'<path d="M200,360 C80,270 20,200 20,120 C20,60 70,20 125,20 C160,20 185,40 200,70 C215,40 240,20 275,20 C330,20 380,60 380,120 C380,200 320,270 200,360Z" '
            f'fill="{ORANGE}" stroke="#111" stroke-width="14"/>'
            f'<path d="M110,90 q-30,20 -25,60" stroke="#111" stroke-width="10" fill="none" stroke-linecap="round"/></svg>')


def drop(uid, color=RED):
    return (f'<svg id="{uid}" viewBox="0 0 200 280" width="100%" height="100%">'
            f'<path d="M100,10 C130,80 180,140 180,190 C180,240 145,270 100,270 C55,270 20,240 20,190 C20,140 70,80 100,10Z" fill="{color}" stroke="#111" stroke-width="10"/></svg>')


def coin(uid):
    return (f'<svg id="{uid}" viewBox="0 0 200 200" width="100%" height="100%"><circle cx="100" cy="100" r="88" fill="{STEEL}" stroke="#111" stroke-width="10"/>'
            f'<circle cx="100" cy="100" r="62" fill="none" stroke="#111" stroke-width="5"/>'
            f'<text x="100" y="128" text-anchor="middle" font-family="Archivo Black" font-size="80" fill="#111">¥</text></svg>')


def bread(uid):
    return (f'<svg id="{uid}" viewBox="0 0 300 260" width="100%" height="100%">'
            f'<path d="M40,250 L40,120 C10,110 10,30 80,20 C130,10 170,10 220,20 C290,30 290,110 260,120 L260,250Z" fill="#D9A35B" stroke="#111" stroke-width="12"/>'
            f'<path d="M70,230 L70,130 C50,120 45,55 95,48 C140,40 160,40 205,48 C255,55 250,120 230,130 L230,230Z" fill="#F6E7C8" stroke="#111" stroke-width="5"/>'
            f'<circle cx="120" cy="150" r="7" fill="#111"/><circle cx="180" cy="180" r="6" fill="#111"/><circle cx="150" cy="105" r="5" fill="#111"/></svg>')


def cord(uid):
    return (f'<svg id="{uid}" viewBox="0 0 300 700" width="100%" height="100%">'
            f'<line x1="150" y1="0" x2="150" y2="560" stroke="#111" stroke-width="14"/>'
            f'<rect x="40" y="540" width="220" height="70" rx="35" fill="{ORANGE}" stroke="#111" stroke-width="12"/></svg>')


# ---------- CSS común ----------
BASE = f"""
#root {{ position:absolute; inset:0; overflow:hidden; background:{PAPER}; color:{INK}; font-family:'Archivo Black', sans-serif; }}
.cam {{ position:absolute; inset:0; transform-origin:50% 50%; }}
.pn {{ position:absolute; border:10px solid {INK}; background:{PAPER}; overflow:hidden; opacity:0; }}
.tone {{ position:absolute; inset:0; background-image:radial-gradient({INK} 26%, transparent 29%); background-size:14px 14px; opacity:.22; }}
.big {{ position:absolute; text-transform:uppercase; letter-spacing:-0.01em; line-height:.92; margin:0; white-space:nowrap; }}
.sub {{ position:absolute; font-family:'Inter', sans-serif; font-weight:900; line-height:1.1; margin:0; }}
.h {{ opacity:0; }}
.fill {{ position:absolute; inset:0; }}
.svgbox {{ position:absolute; }}
"""

JS_HELPERS = """
const tl = gsap.timeline({ paused: true });
const slam = (s, t, f) => tl.fromTo(s, Object.assign({ opacity: 0, scale: 1.08 }, f || {}), { opacity: 1, scale: 1, x: 0, y: 0, rotation: 0, duration: 0.2, ease: "expo.out" }, t);
const pop = (s, t, f) => tl.fromTo(s, Object.assign({ opacity: 0, scale: 0.6 }, f || {}), { opacity: 1, scale: 1, x: 0, y: 0, rotation: 0, duration: 0.28, ease: "back.out(2.2)" }, t);
const on = (s, t) => tl.set(s, { opacity: 1 }, t);
const off = (s, t) => tl.set(s, { opacity: 0 }, t);
const shake = (s, t, a) => { a = a || 18; const p = [[1,-.6],[-.8,.9],[.7,.4],[-.5,-.8],[.4,.6],[-.3,-.2],[.15,.2]]; p.forEach((q, i) => tl.set(s, { x: q[0]*a, y: q[1]*a }, t + i / 30)); tl.set(s, { x: 0, y: 0 }, t + 7 / 30); };
const chain = (s, t, d) => tl.fromTo(s, { x: 0 }, { x: -40, duration: 0.1, ease: "none", repeat: Math.max(1, Math.round(d / 0.1) - 1) }, t);
"""


def scene_html(sc, css, markup, js):
    sid, D = sc["id"], sc["D"]
    return f"""<template>
  <style>{BASE}{css}</style>
  <div id="root" data-composition-id="{sid}" data-width="1920" data-height="1080" data-duration="{D}">
    <div id="{sid}-cam" class="cam">
{markup}
    </div>
  </div>
  <script>
{JS_HELPERS}
tl.fromTo("#{sid}-cam", {{ scale: 1 }}, {{ scale: 1.04, duration: {D}, ease: "none" }}, 0);
{js}
window.__timelines["{sid}"] = tl;
  </script>
</template>
"""


SFX = []   # (file, t_abs_peak_target, peak_s, volume)


def sfx(sc, f, t_local, peak, vol=1.0):
    SFX.append((f, sc["start"] + t_local, peak, vol))


# ---------- escenas ----------
def s1(sc, at):
    c0, c1, c2, c2b, c3 = at(0), at(1), at(2), at(2, "y los demonios"), at(3)
    m = f"""
      <div id="s1-a" class="pn" style="left:60px;top:60px;width:760px;height:960px;">
        <div class="tone" style="opacity:.14"></div>
        <h1 class="big" style="left:50px;top:60px;font-size:112px;">Pequeño.</h1>
        <div id="s1-em" class="svgbox" style="left:300px;top:640px;width:150px;height:158px;">{emblem("s1-em-svg")}</div>
      </div>
      <div id="s1-b" class="pn" style="left:860px;top:60px;width:1000px;height:460px;background:{ORANGE};">
        <h1 class="big" style="left:56px;top:150px;font-size:150px;">Naranja.</h1>
      </div>
      <div id="s1-c" class="pn" style="left:860px;top:560px;width:1000px;height:460px;">
        <div class="svgbox" style="left:40px;top:150px;width:920px;height:184px;">{blade("s1-bl", 1000)}</div>
        <p class="sub" style="left:48px;top:40px;font-size:52px;">UNA MOTOSIERRA EN LA CABEZA</p>
      </div>
      <div id="s1-d" class="pn" style="left:-10px;top:-10px;width:1940px;height:1100px;border:none;">
        <div class="fill">{speedlines(110, 3)}</div>
        <h1 class="big" style="left:120px;top:330px;font-size:150px;background:{PAPER};padding:10px 26px;">Los demonios</h1>
        <h1 class="big" style="left:520px;top:540px;font-size:150px;background:{INK};color:{PAPER};padding:10px 26px;">le temen</h1>
      </div>
      <div id="s1-e" class="pn" style="left:-10px;top:-10px;width:1940px;height:1100px;border:none;background:{ORANGE};">
        <div class="tone" style="opacity:.18;-webkit-mask-image:linear-gradient(90deg,transparent 40%,#000);mask-image:linear-gradient(90deg,transparent 40%,#000)"></div>
        <p class="sub" style="left:130px;top:300px;font-size:60px;">ESTO ES</p>
        <h1 id="s1-title" class="big h" style="left:110px;top:390px;font-size:250px;">Pochita</h1>
        <div id="s1-em2" class="svgbox" style="left:1470px;top:420px;width:390px;height:410px;">{emblem("s1-em2-svg")}</div>
      </div>"""
    js = f"""
on("#s1-a", 0); pop("#s1-em", {c0 + 0.6});
slam("#s1-b", {c1}, {{ x: 80 }});
slam("#s1-c", {c2}); chain("#s1-bl-teeth", {c2 + 0.9}, {c2b - c2 - 0.9 + 0.4});
slam("#s1-d", {c2b}, {{ scale: 1.25 }}); off("#s1-a,#s1-b,#s1-c", {c2b + 0.22}); tl.fromTo("#s1-d svg", {{ rotation: 0 }}, {{ rotation: 4, duration: {c3 - c2b}, ease: "none", transformOrigin: "50% 50%" }}, {c2b});
on("#s1-e", {c3 - 0.05}); off("#s1-d", {c3 + 0.02}); slam("#s1-title", {c3 + 0.55}, {{ scale: 1.3 }}); pop("#s1-em2", {c3 + 0.7}, {{ y: 120 }}); shake("#s1-cam", {c3 + 0.55}, 16);
"""
    sfx(sc, "assets/sfx/chainsaw_start.mp3", c2 + 0.9 - 0.113, 0.0, 0.32)
    sfx(sc, "assets/sfx/film/whoosh.wav", c2b, 0.04, 0.9)
    sfx(sc, "assets/sfx/film/hit.wav", c3 + 0.55, 0.24, 1.0)
    return "", m, js


def s2(sc, at):
    c0, cm, cf, c1, cno = at(0), at(0, "de Chainsaw"), at(0, "Tatsuki"), at(1), at(1, "pero no")
    m = f"""
      <div id="s2-a" class="pn" style="left:60px;top:60px;width:1100px;height:600px;">
        <div class="tone" style="opacity:.12"></div>
        <p class="sub" style="left:60px;top:60px;font-size:48px;">POCHITA ES</p>
        <h1 class="big" style="left:52px;top:150px;font-size:132px;">El demonio</h1>
        <h1 class="big" style="left:52px;top:300px;font-size:132px;color:{ORANGE};-webkit-text-stroke:6px {INK};">motosierra</h1>
      </div>
      <div id="s2-b" class="pn" style="left:1200px;top:60px;width:660px;height:600px;background:{INK};color:{PAPER};">
        <h1 class="big" style="left:50px;top:70px;font-size:96px;line-height:1;">Chainsaw<br>Man</h1>
        <p id="s2-f" class="sub h" style="left:54px;top:330px;font-size:44px;color:{PAPER};">MANGA DE<br>TATSUKI FUJIMOTO</p>
      </div>
      <div id="s2-c" class="pn" style="left:60px;top:700px;width:1800px;height:320px;">
        <h1 class="big" style="left:60px;top:90px;font-size:120px;">¿Un perrito?</h1>
        <div id="s2-em" class="svgbox" style="left:1560px;top:40px;width:210px;height:220px;">{emblem("s2-em-svg")}</div>
        <div id="s2-no" class="svgbox h" style="left:1090px;top:66px;width:440px;height:170px;">
          <div style="position:absolute;inset:0;background:{RED};transform:rotate(-4deg);border:8px solid {INK};"></div>
          <h1 class="big" style="left:30px;top:46px;font-size:66px;color:{PAPER};transform:rotate(-4deg);">No lo es</h1>
        </div>
      </div>"""
    js = f"""
slam("#s2-a", {c0}); slam("#s2-b", {cm}, {{ x: 60 }}); on("#s2-f", {cf});
slam("#s2-c", {c1}, {{ y: 60 }}); tl.fromTo("#s2-em", {{ rotation: -6 }}, {{ rotation: 6, duration: 0.5, ease: "sine.inOut", repeat: 5, yoyo: true }}, {c1 + 0.3});
slam("#s2-no", {cno + 0.35}, {{ scale: 1.6 }}); shake("#s2-cam", {cno + 0.4}, 10);
"""
    sfx(sc, "assets/sfx/film/whoosh_soft.wav", 0.12, 0.30, 0.8)
    sfx(sc, "assets/sfx/film/drop.wav", cno + 0.4, 0.02, 0.9)
    return "", m, js


def s3(sc, at):
    c0, c1, cs, c2, ci = at(0), at(1), at(1, "su propia"), at(2), at(2, "inseparables")
    m = f"""
      <div id="s3-a" class="pn" style="left:60px;top:60px;width:900px;height:960px;">
        <div class="tone" style="opacity:.3"></div>
        <p class="sub" style="left:60px;top:60px;font-size:56px;background:{PAPER};padding:6px 12px;">DENJI LO ENCONTRÓ</p>
        <h1 class="big" style="left:52px;top:150px;font-size:150px;background:{PAPER};padding:0 12px;">Herido</h1>
        <div id="s3-em" class="svgbox" style="left:250px;top:520px;width:400px;height:420px;">{emblem("s3-em-svg", eyes=False)}</div>
      </div>
      <div id="s3-b" class="pn" style="left:1000px;top:60px;width:860px;height:960px;">
        <h1 class="big" style="left:56px;top:60px;font-size:112px;color:{RED};">Su propia</h1>
        <h1 class="big" style="left:56px;top:180px;font-size:112px;color:{RED};">sangre</h1>
        <div id="s3-drop" class="svgbox" style="left:330px;top:330px;width:180px;height:252px;">{drop("s3-drop-svg")}</div>
        <div id="s3-splat" class="svgbox h" style="left:180px;top:770px;width:480px;height:120px;border-radius:50%;background:{RED};border:8px solid {INK};"></div>
      </div>
      <div id="s3-c" class="pn" style="left:-10px;top:-10px;width:1940px;height:1100px;border:none;background:{PAPER};">
        <div class="fill">{speedlines(80, 11)}</div>
        <div id="s3-em3" class="svgbox" style="left:760px;top:250px;width:400px;height:420px;">{emblem("s3-em3-svg")}</div>
        <h1 id="s3-ins" class="big h" style="left:150px;top:740px;font-size:170px;background:{INK};color:{PAPER};padding:6px 30px;">Inseparables</h1>
      </div>"""
    js = f"""
slam("#s3-a", {c0}); tl.fromTo("#s3-em", {{ rotation: -78, y: 40 }}, {{ rotation: -84, y: 50, duration: 3, ease: "sine.inOut" }}, {c0});
slam("#s3-b", {c1}, {{ x: 60 }});
tl.fromTo("#s3-drop", {{ y: -260, opacity: 0 }}, {{ y: 0, opacity: 1, duration: 0.3, ease: "power2.out" }}, {cs});
tl.to("#s3-drop", {{ y: 420, duration: 0.42, ease: "power2.in" }}, {cs + 0.9});
off("#s3-drop", {cs + 1.32}); tl.fromTo("#s3-splat", {{ opacity: 0, scaleX: 0.2, scaleY: 0.4 }}, {{ opacity: 1, scaleX: 1, scaleY: 1, duration: 0.18, ease: "expo.out" }}, {cs + 1.32});
slam("#s3-c", {c2}); off("#s3-a,#s3-b", {c2 + 0.22}); pop("#s3-em3", {c2 + 0.15}); slam("#s3-ins", {ci}, {{ scale: 1.2 }});
"""
    sfx(sc, "assets/sfx/film/pop.wav", cs + 1.32, 0.03, 1.0)
    sfx(sc, "assets/sfx/film/slide.wav", c2, 0.24, 0.8)
    return "", m, js


def s4(sc, at):
    c0, c1, cm, cp, cv = at(0), at(1), at(1, "monedas"), at(1, "pan duro"), at(1, "y soñaban")
    coins = "".join(f'<div id="s4-co{k}" class="svgbox h" style="left:{80+k*150}px;top:{260+(k%2)*70}px;width:150px;height:150px;">{coin(f"s4-c{k}")}</div>' for k in range(4))
    m = f"""
      <div id="s4-a" class="pn" style="left:60px;top:60px;width:1800px;height:400px;background:{INK};color:{PAPER};">
        <p class="sub" style="left:60px;top:56px;font-size:52px;color:{PAPER};">LA DEUDA DE SU PADRE CON LA</p>
        <h1 class="big" style="left:52px;top:150px;font-size:190px;color:{ORANGE};">Yakuza</h1>
      </div>
      <div id="s4-b" class="pn" style="left:60px;top:500px;width:740px;height:520px;">
        <p class="sub" style="left:50px;top:40px;font-size:52px;">CAZAR DEMONIOS<br>POR MONEDAS</p>
        {coins}
      </div>
      <div id="s4-c" class="pn" style="left:840px;top:500px;width:420px;height:520px;">
        <div class="tone" style="opacity:.1"></div>
        <div id="s4-br" class="svgbox" style="left:60px;top:60px;width:280px;height:243px;">{bread("s4-br-svg")}</div>
        <p class="sub" style="left:50px;top:360px;font-size:60px;">PAN DURO</p>
      </div>
      <div id="s4-d" class="pn" style="left:1300px;top:500px;width:560px;height:520px;background:{ORANGE};">
        <p class="sub" style="left:44px;top:60px;font-size:48px;">SOÑABAN CON</p>
        <h1 class="big" style="left:40px;top:150px;font-size:88px;line-height:1;">Una vida<br>normal</h1>
      </div>"""
    js = f"""
slam("#s4-a", {c0}); slam("#s4-b", {c1}, {{ y: 60 }});
{"".join(f'pop("#s4-co{k}", {cm + k * 0.14:.3f}, {{ y: -80 }});' for k in range(4))}
slam("#s4-c", {cp}, {{ y: 60 }}); slam("#s4-d", {cv}, {{ x: 80 }});
"""
    for k in range(4):
        sfx(sc, "assets/sfx/film/tick.wav", cm + k * 0.14 + 0.05, 0.0, 0.7)
    sfx(sc, "assets/sfx/film/whoosh.wav", cv, 0.04, 0.8)
    return "", m, js


def s5(sc, at):
    c0, ct, c1, cz, cd = at(0), at(0, "traicion"), at(1), at(1, "Demonio Zombi"), at(1, "despedazaron")
    m = f"""
      <div id="s5-a" class="pn" style="left:60px;top:60px;width:1800px;height:960px;">
        <div class="tone" style="opacity:.25"></div>
        <p class="sub" style="left:80px;top:80px;font-size:60px;background:{PAPER};padding:4px 12px;">HASTA QUE LA YAKUZA…</p>
        <h1 id="s5-t" class="big h" style="left:70px;top:360px;font-size:240px;color:{RED};-webkit-text-stroke:8px {INK};">Traición</h1>
      </div>
      <div id="s5-b" class="pn" style="left:-10px;top:-10px;width:1940px;height:1100px;border:none;background:{RED};">
        <div class="fill">{speedlines(100, 21, color="#7A0A12")}</div>
        <p class="sub" style="left:120px;top:250px;font-size:64px;color:{PAPER};">UN PACTO CON EL</p>
        <h1 class="big" style="left:110px;top:340px;font-size:176px;color:{PAPER};-webkit-text-stroke:6px {INK};">Demonio zombi</h1>
      </div>
      <div id="s5-c1" class="pn" style="left:-10px;top:-10px;width:1940px;height:1100px;border:none;background:{INK};clip-path:polygon(0 0,62% 0,38% 100%,0 100%);">
        <h1 class="big" style="left:110px;top:430px;font-size:170px;color:{PAPER};">Despe-</h1>
      </div>
      <div id="s5-c2" class="pn" style="left:-10px;top:-10px;width:1940px;height:1100px;border:none;background:{INK};clip-path:polygon(64% 0,100% 0,100% 100%,40% 100%);">
        <h1 class="big" style="left:1070px;top:430px;font-size:170px;color:{RED};">dazado</h1>
      </div>"""
    js = f"""
slam("#s5-a", {c0}); slam("#s5-t", {ct}, {{ scale: 1.4 }}); shake("#s5-cam", {ct + 0.05}, 14);
slam("#s5-b", {cz - 0.6}); off("#s5-a", {cz - 0.38}); off("#s5-b", {cd + 0.3});
on("#s5-c1", {cd}); tl.fromTo("#s5-c1", {{ x: -1300 }}, {{ x: 0, duration: 0.16, ease: "power4.out" }}, {cd});
on("#s5-c2", {cd + 0.06}); tl.fromTo("#s5-c2", {{ x: 1300 }}, {{ x: 0, duration: 0.16, ease: "power4.out" }}, {cd + 0.06});
shake("#s5-cam", {cd + 0.2}, 26);
tl.to("#s5-c1", {{ x: -40, y: 20, rotation: -2, duration: 1.4, ease: "power2.out" }}, {cd + 0.5});
tl.to("#s5-c2", {{ x: 40, y: -20, rotation: 2, duration: 1.4, ease: "power2.out" }}, {cd + 0.5});
"""
    sfx(sc, "assets/sfx/film/drop.wav", ct + 0.05, 0.02, 1.0)
    sfx(sc, "assets/sfx/film/whoosh_soft.wav", cz - 0.6, 0.30, 0.7)
    sfx(sc, "assets/sfx/film/impact.wav", cd + 0.2, 0.25, 1.0)
    return "", m, js


def s6(sc, at):
    c0, c1, cc, c2, cs = at(0), at(1), at(1, "corazón"), at(2), at(2, "ver sus")
    m = f"""
      <div id="s6-k" class="pn" style="left:120px;top:60px;width:1000px;height:960px;background:#FBFAF6;transform-origin:30% 100%;">
        <h1 class="big" style="left:70px;top:60px;font-size:130px;">Contrato</h1>
        <div style="position:absolute;left:70px;top:210px;width:840px;height:8px;background:{INK};"></div>
        <p id="s6-l1" class="sub h" style="left:70px;top:270px;font-size:46px;">POCHITA ENTREGA:</p>
        <h1 id="s6-l1b" class="big h" style="left:66px;top:340px;font-size:100px;color:{ORANGE};-webkit-text-stroke:5px {INK};">Su corazón</h1>
        <p id="s6-l2" class="sub h" style="left:70px;top:520px;font-size:46px;">A CAMBIO, DENJI DEBE:</p>
        <h1 id="s6-l2b" class="big h" style="left:66px;top:590px;font-size:76px;line-height:1;">Cumplir<br>sus sueños</h1>
        <div id="s6-stamp" class="svgbox h" style="left:560px;top:740px;width:340px;height:160px;">
          <div style="position:absolute;inset:0;border:10px solid {ORANGE};transform:rotate(-8deg);"><p class="sub" style="left:22px;top:38px;font-size:56px;color:{ORANGE};">FIRMADO</p></div>
        </div>
      </div>
      <div id="s6-h" class="svgbox h" style="left:1240px;top:260px;width:560px;height:532px;">{heart("s6-heart")}</div>"""
    js = f"""
slam("#s6-k", {c0}, {{ y: 80, rotation: -3 }});
on("#s6-l1", {c1}); slam("#s6-l1b", {cc}); pop("#s6-h", {cc});
tl.to("#s6-heart", {{ scale: 1.08, duration: 0.12, ease: "power2.out", transformOrigin: "50% 50%", yoyo: true, repeat: 1 }}, {cc + 0.5});
tl.to("#s6-heart", {{ scale: 1.08, duration: 0.12, ease: "power2.out", transformOrigin: "50% 50%", yoyo: true, repeat: 1 }}, {cc + 1.5});
tl.to("#s6-heart", {{ scale: 1.08, duration: 0.12, ease: "power2.out", transformOrigin: "50% 50%", yoyo: true, repeat: 1 }}, {cc + 2.5});
on("#s6-l2", {c2}); slam("#s6-l2b", {cs});
slam("#s6-stamp", {cs + 1.6}, {{ scale: 1.8 }}); shake("#s6-cam", {cs + 1.65}, 8);
"""
    for k in range(3):
        sfx(sc, "assets/sfx/heartbeat.mp3", cc + 0.5 + k, 0.099, 0.9)
    sfx(sc, "assets/sfx/film/drop.wav", cs + 1.65, 0.02, 0.9)
    return "", m, js


def s7(sc, at):
    c0, c1, cp, cs = at(0), at(1), at(1, "tira de"), at(1, "las motosierras")
    m = f"""
      <div id="s7-a" class="pn" style="left:-10px;top:-10px;width:1940px;height:1100px;border:none;background:{ORANGE};">
        <div class="fill">{speedlines(120, 5)}</div>
        <p class="sub" style="left:140px;top:270px;font-size:62px;background:{ORANGE};padding:4px 12px;">ASÍ NACE</p>
        <h1 id="s7-t" class="big" style="left:120px;top:350px;font-size:186px;background:{INK};color:{ORANGE};padding:10px 30px;">Chainsaw Man</h1>
      </div>
      <div id="s7-b" class="pn" style="left:60px;top:60px;width:1800px;height:960px;">
        <div class="tone" style="opacity:.15"></div>
        <p class="sub" style="left:80px;top:820px;font-size:56px;background:{PAPER};padding:4px 12px;">DENJI TIRA DE LA CUERDA DE SU PECHO</p>
        <div id="s7-cord" class="svgbox" style="left:1300px;top:-330px;width:300px;height:700px;">{cord("s7-cord-svg")}</div>
        <div id="s7-bl1" class="svgbox h" style="left:-100px;top:420px;width:1100px;height:220px;">{blade("s7-b1", 1100)}</div>
        <div id="s7-bl2" class="svgbox h" style="left:820px;top:650px;width:1100px;height:220px;"><div class="fill" style="transform:scaleX(-1);">{blade("s7-b2", 1100)}</div></div>
        <div id="s7-bl3" class="svgbox h" style="left:1000px;top:180px;width:900px;height:180px;"><div class="fill" style="transform:scaleX(-1);">{blade("s7-b3", 900)}</div></div>
      </div>"""
    js = f"""
slam("#s7-a", {c0}, {{ scale: 1.3 }}); shake("#s7-cam", {c0 + 0.05}, 18);
slam("#s7-b", {c1}); off("#s7-a", {c1 + 0.22});
tl.fromTo("#s7-cord", {{ y: 0 }}, {{ y: 420, duration: 0.5, ease: "power1.inOut" }}, {cp + 0.2});
tl.to("#s7-cord", {{ y: 640, duration: 0.14, ease: "power4.in" }}, {cp + 1.0});
on("#s7-bl1", {cs}); tl.fromTo("#s7-bl1", {{ x: -900 }}, {{ x: 0, duration: 0.18, ease: "power4.out" }}, {cs});
on("#s7-bl2", {cs + 0.12}); tl.fromTo("#s7-bl2", {{ x: 900 }}, {{ x: 0, duration: 0.18, ease: "power4.out" }}, {cs + 0.12});
on("#s7-bl3", {cs + 0.24}); tl.fromTo("#s7-bl3", {{ x: 900 }}, {{ x: 0, duration: 0.18, ease: "power4.out" }}, {cs + 0.24});
chain("#s7-b1-teeth", {cs}, {sc['D'] - cs}); chain("#s7-b2-teeth", {cs}, {sc['D'] - cs}); chain("#s7-b3-teeth", {cs}, {sc['D'] - cs});
shake("#s7-cam", {cs + 0.1}, 22); shake("#s7-cam", {cs + 0.6}, 12);
"""
    sfx(sc, "assets/sfx/film/hit.wav", c0 + 0.05, 0.24, 1.0)
    sfx(sc, "assets/sfx/chainsaw_rev.mp3", cs + 0.05, 1.70 - 1.4, 0.5)
    return "", m, js


def s8(sc, at):
    c0, c1, c2, c3, cdes, cbor = at(0), at(1), at(2), at(3), at(3, "desaparecen"), at(3, "se borra")
    tape = lambda uid, top, rot: (f'<div id="{uid}" class="svgbox h" style="left:-200px;top:{top}px;width:2320px;height:150px;'
                                  f'background:repeating-linear-gradient(45deg,{ORANGE} 0 60px,{INK} 60px 120px);border-top:8px solid {INK};border-bottom:8px solid {INK};"></div>')
    letters = "".join(f'<span id="s8-L{k}" style="display:inline-block;">{ch}</span>' for k, ch in enumerate("CONCEPTO"))
    m = f"""
      <div id="s8-a" class="pn" style="left:-10px;top:-10px;width:1940px;height:1100px;border:none;background:{PAPER};">
        {tape("s8-t1", 150, -6)}{tape("s8-t2", 780, 5)}
        <h1 class="big" style="left:300px;top:400px;font-size:200px;background:{RED};color:{PAPER};padding:10px 36px;border:10px solid {INK};">Spoilers</h1>
      </div>
      <div id="s8-b" class="pn" style="left:60px;top:60px;width:1800px;height:960px;">
        <div class="tone" style="opacity:.2"></div>
        <p class="sub" style="left:80px;top:90px;font-size:60px;background:{PAPER};padding:4px 12px;">NO ES UN DEMONIO CUALQUIERA</p>
        <p id="s8-es" class="sub h" style="left:80px;top:300px;font-size:64px;background:{PAPER};padding:4px 12px;">ES EL</p>
        <h1 id="s8-h" class="big h" style="left:70px;top:390px;font-size:190px;line-height:1;color:{INK};">Héroe del<br><span style="color:{ORANGE};-webkit-text-stroke:6px {INK};">infierno</span></h1>
      </div>
      <div id="s8-c" class="pn" style="left:-10px;top:-10px;width:1940px;height:1100px;border:none;background:{INK};color:{PAPER};">
        <p class="sub" style="left:140px;top:200px;font-size:60px;color:{PAPER};">LO QUE DEVORA…</p>
        <h1 class="big" data-layout-ignore style="left:130px;top:430px;font-size:230px;color:transparent;-webkit-text-stroke:3px #4a4a4a;">Concepto</h1>
        <h1 id="s8-w" class="big" data-layout-allow-overlap style="left:130px;top:430px;font-size:230px;color:{PAPER};">{letters}</h1>
        <p id="s8-g" class="sub h" style="left:140px;top:780px;font-size:60px;color:{ORANGE};">…SE BORRA DEL MUNDO</p>
        <div id="s8-saw" class="svgbox" style="left:-1200px;top:470px;width:1100px;height:220px;">{blade("s8-b1", 1100)}</div>
      </div>"""
    eat = "".join(f'tl.to("#s8-L{k}", {{ opacity: 0, y: {(-1)**k * 60}, rotation: {(-1)**k * 25}, duration: 0.16, ease: "power2.in" }}, {cdes + 0.2 + k * 0.09:.3f});' for k in range(8))
    js = f"""
slam("#s8-a", {c0}); on("#s8-t1", {c0}); tl.fromTo("#s8-t1", {{ x: -2400, rotation: -6 }}, {{ x: 0, rotation: -6, duration: 0.22, ease: "power4.out" }}, {c0});
on("#s8-t2", {c0 + 0.1}); tl.fromTo("#s8-t2", {{ x: 2400, rotation: 5 }}, {{ x: 0, rotation: 5, duration: 0.22, ease: "power4.out" }}, {c0 + 0.1});
slam("#s8-b", {c1}); off("#s8-a", {c1 + 0.22}); on("#s8-es", {c2}); slam("#s8-h", {c2 + 0.35}, {{ scale: 1.25 }}); shake("#s8-cam", {c2 + 0.4}, 18);
slam("#s8-c", {c3}); off("#s8-b", {c3 + 0.22});
tl.fromTo("#s8-saw", {{ x: 0 }}, {{ x: 2900, duration: 1.1, ease: "none" }}, {cdes}); chain("#s8-b1-teeth", {cdes}, 1.1);
{eat}
on("#s8-g", {cbor});
"""
    sfx(sc, "assets/sfx/film/whoosh.wav", c0, 0.04, 0.9)
    sfx(sc, "assets/sfx/film/riser.wav", c2 + 0.4, 1.47, 0.8)
    sfx(sc, "assets/sfx/film/impact.wav", c2 + 0.4, 0.25, 1.0)
    sfx(sc, "assets/sfx/chainsaw_rev.mp3", cdes + 0.2, 1.70 - 0.8, 0.35)
    return "", m, js


def s9(sc, at):
    c0, cmk, cc = at(0), at(0, "Makima"), at(0, "controlarlo")
    m = f"""
      <div id="s9-a" class="pn" style="left:-10px;top:-10px;width:1940px;height:1100px;border:none;background:{PAPER};">
        <div class="tone" style="opacity:.16"></div>
        <h1 id="s9-m" class="big h" style="left:110px;top:150px;font-size:260px;color:{RED};-webkit-text-stroke:8px {INK};">Makima</h1>
        <p id="s9-q" class="sub h" style="left:120px;top:470px;font-size:60px;">QUIERE CONTROLARLO</p>
        <p id="s9-q2" class="sub h" style="left:120px;top:550px;font-size:60px;background:{INK};color:{PAPER};padding:4px 14px;">A CUALQUIER PRECIO</p>
        <svg class="svgbox" style="left:0;top:0;" width="1920" height="1080" viewBox="0 0 1920 1080">
          <path id="s9-leash" d="M760,330 C1000,620 1200,760 1420,760" fill="none" stroke="{INK}" stroke-width="14" stroke-linecap="round" pathLength="100" stroke-dasharray="100 120" stroke-dashoffset="110"/>
        </svg>
        <div id="s9-em" class="svgbox h" style="left:1400px;top:560px;width:380px;height:399px;">{emblem("s9-em-svg")}</div>
      </div>"""
    js = f"""
on("#s9-a", 0); slam("#s9-m", {cmk}, {{ scale: 1.3 }}); pop("#s9-em", {cmk + 0.3});
on("#s9-q", {cc}); tl.to("#s9-leash", {{ strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" }}, {cc});
on("#s9-q2", {cc + 0.9}); tl.to("#s9-em", {{ x: -60, rotation: -8, duration: 0.25, ease: "power3.out" }}, {cc + 0.75});
"""
    sfx(sc, "assets/sfx/film/sting.wav", cmk, 0.65, 0.7)
    sfx(sc, "assets/sfx/film/whoosh_soft.wav", cc + 0.75, 0.30, 0.6)
    return "", m, js


def s10(sc, at):
    c0, c1, cab, c2, cy = at(0), at(1), at(1, "alguien"), at(2), at(2, "y el mejor")
    m = f"""
      <div id="s10-a" class="pn" style="left:60px;top:60px;width:1800px;height:960px;">
        <p class="sub" style="left:80px;top:80px;font-size:60px;">EL SUEÑO DE POCHITA:</p>
        <h1 id="s10-d" class="big h" style="left:70px;top:190px;font-size:140px;line-height:1;">Que alguien<br>lo abrazara</h1>
        <div id="s10-em" class="svgbox" style="left:1180px;top:340px;width:460px;height:483px;">{emblem("s10-em-svg")}</div>
        <svg class="svgbox" style="left:1080px;top:320px;" width="660" height="600" viewBox="0 0 660 600">
          <path id="s10-arm1" d="M70,540 C40,370 120,330 200,370 C250,395 290,420 330,420" fill="none" stroke="{INK}" stroke-width="44" stroke-linecap="round" pathLength="100" stroke-dasharray="100 120" stroke-dashoffset="110"/>
          <path id="s10-arm2" d="M590,540 C620,370 540,330 460,370 C410,395 370,420 330,420" fill="none" stroke="{INK}" stroke-width="44" stroke-linecap="round" pathLength="100" stroke-dasharray="100 120" stroke-dashoffset="110"/>
        </svg>
      </div>
      <div id="s10-b" class="pn" style="left:-10px;top:-10px;width:1940px;height:1100px;border:none;background:{ORANGE};">
        <div class="tone" style="opacity:.18;-webkit-mask-image:linear-gradient(90deg,transparent 45%,#000);mask-image:linear-gradient(90deg,transparent 45%,#000)"></div>
        <p class="sub" style="left:130px;top:180px;font-size:56px;">EL DEMONIO MÁS TEMIDO DEL INFIERNO…</p>
        <h1 class="big" style="left:110px;top:300px;font-size:250px;">Pochita</h1>
        <p id="s10-f" class="sub h" style="left:130px;top:580px;font-size:68px;background:{INK};color:{ORANGE};padding:8px 18px;">…Y EL MEJOR AMIGO DE DENJI</p>
        <div id="s10-em2" class="svgbox" style="left:1470px;top:420px;width:390px;height:410px;">{emblem("s10-em2-svg")}</div>
      </div>"""
    js = f"""
slam("#s10-a", {c0}); slam("#s10-d", {c1});
tl.to("#s10-arm1", {{ strokeDashoffset: 0, duration: 0.9, ease: "power2.out" }}, {cab});
tl.to("#s10-arm2", {{ strokeDashoffset: 0, duration: 0.9, ease: "power2.out" }}, {cab + 0.08});
tl.to("#s10-em", {{ scale: 0.94, duration: 0.3, ease: "power2.out", transformOrigin: "50% 80%" }}, {cab + 0.8});
slam("#s10-b", {c2 + 1.0}); off("#s10-a", {c2 + 1.22}); pop("#s10-em2", {c2 + 1.25}, {{ y: 100 }}); on("#s10-f", {cy});
"""
    sfx(sc, "assets/sfx/film/whoosh_soft.wav", c2 + 1.0, 0.30, 0.8)
    sfx(sc, "assets/sfx/film/logo.wav", cy, 0.30, 1.0)
    return "", m, js


FUNCS = dict(s1=s1, s2=s2, s3=s3, s4=s4, s5=s5, s6=s6, s7=s7, s8=s8, s9=s9, s10=s10)

(P / "compositions").mkdir(exist_ok=True)
for sc in scenes:
    css, m, js = FUNCS[sc["id"]](sc, cue_fn(sc))
    (P / f"compositions/{sc['id']}.html").write_text(scene_html(sc, css, m, js), encoding="utf-8")

hosts = "\n".join(
    f'      <div id="{sc["id"]}" data-composition-id="{sc["id"]}" data-composition-src="compositions/{sc["id"]}.html" '
    f'data-start="{sc["start"]}" data-duration="{sc["D"]}" data-track-index="1" data-track-kind="graphics" '
    f'data-width="1920" data-height="1080"></div>' for sc in scenes)
vo = "\n".join(
    f'      <audio id="vo-{sc["id"]}" class="clip" src="assets/vo/{sc["id"]}.mp3" data-start="{round(sc["start"] + VO_OFF, 3)}" '
    f'data-duration="{round(sc["vo"], 3)}" data-track-index="3" data-volume="1"></audio>' for sc in scenes)
SFX.sort(key=lambda x: x[1])
lanes_end = []
fx = []
for k, (f, tpk, peak, vol) in enumerate(SFX):
    st = max(0, round(tpk - peak, 3))
    d = round(dur(P / f) - (0.06 if f.endswith(".mp3") else 0), 3)
    lane = next((i for i, e in enumerate(lanes_end) if e <= st), None)
    if lane is None:
        lanes_end.append(0); lane = len(lanes_end) - 1
    lanes_end[lane] = st + d
    fx.append(f'      <audio id="fx{k}" class="clip" src="{f}" data-start="{st}" data-duration="{d}" data-track-index="{5 + lane}" data-volume="{vol}"></audio>')

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
      <audio id="music" class="clip" src="assets/music/bed.mp3" data-start="0" data-duration="{TOTAL}" data-media-start="0" data-track-index="2" data-volume="0.13" data-fade-in="0.4" data-fade-out="2.5"></audio>
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
print("total", TOTAL, "s;", len(SFX), "sfx;", [(s["id"], s["start"], s["D"]) for s in scenes])
