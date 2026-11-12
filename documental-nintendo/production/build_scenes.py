# -*- coding: utf-8 -*-
"""Genera compositions/*.html (desde src/*.html), compositions/subs.html e index.html
a partir de production/timing.json. Uso: python3 production/build_scenes.py"""
import json, os, html
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
T = json.load(open(os.path.join(HERE, "timing.json")))
KIT = open(os.path.join(ROOT, "src/kit.js")).read()
JP = open(os.path.join(ROOT, "assets/fonts/jp-fonts.css")).read()
PIXEL = "@font-face{font-family:'Press Start 2P';font-weight:400;font-style:normal;font-display:block;src:url('assets/fonts/press-start-2p.woff2') format('woff2');}"
os.makedirs(os.path.join(ROOT, "compositions"), exist_ok=True)

hosts = []
for ch in T["chapters"]:
    cid = ch["id"]; t0 = ch["start"]; dur = round(ch["end"] - ch["start"], 3)
    src = os.path.join(ROOT, "src", cid + ".html")
    if not os.path.exists(src):
        print("falta", src); continue
    cues = {c["id"]: [round(c["start"] - t0, 3), round(c["end"] - t0, 3)] for c in T["cues"] if c["chapter"] == cid}
    s = open(src).read()
    num, title, years = ch["title"] if ch["title"] else ("", "", "")
    rep = {"__C__": json.dumps(cues), "__T0__": str(t0), "__DUR__": str(dur), "__KIT__": KIT,
           "__FONT_JP__": JP, "__FONT_PIXEL__": PIXEL, "__NUM__": html.escape(num), "__TITLE__": html.escape(title), "__YEARS__": html.escape(years)}
    for k, v in rep.items(): s = s.replace(k, v)
    import re
    s = re.sub(r"__INCLUDE\(([^|)]+)\|([^)]+)\)__", lambda mm: open(os.path.join(ROOT, mm.group(1))).read().replace("ID-", mm.group(2) + "-"), s)
    open(os.path.join(ROOT, "compositions", cid + ".html"), "w").write(s)
    hosts.append((cid, t0, dur))

# ---------------------------------------------------------------- subtítulos
groups = []
for i, sb in enumerate(T["subs"]):
    s0 = round(sb["start"] - 0.05, 3); d = round(sb["end"] - sb["start"] + 0.12, 3)
    groups.append(f'    <div id="sb{i}" class="clip sb" data-start="{s0}" data-duration="{d}" data-track-index="0"><span class="sbt">{html.escape(sb["text"])}</span></div>')
subs = f'''<template>
  <style>
    #root {{ position: absolute; inset: 0; pointer-events: none; }}
    .sb {{ position: absolute; left: 0; right: 0; bottom: 112px; text-align: center; overflow: visible; }}
    .sbt {{ display: inline-block; max-width: 1480px; padding: 9px 22px 11px; border-radius: 10px;
      background: rgba(14, 12, 12, 0.64); color: #fff; font-family: "Inter", sans-serif; font-weight: 600;
      font-size: 40px; line-height: 1.28; letter-spacing: 0.005em; text-wrap: balance; }}
  </style>
  <div id="root" data-composition-id="subs" data-width="1920" data-height="1080" data-layout-allow-caption-zone>
{chr(10).join(groups)}
  </div>
  <script>
    (() => {{
      const tl = gsap.timeline({{ paused: true }});
      document.querySelectorAll("#root .sb").forEach(el => {{
        const s = parseFloat(el.dataset.start), d = parseFloat(el.dataset.duration), t = el.querySelector(".sbt");
        tl.fromTo(t, {{ opacity: 0 }}, {{ opacity: 1, duration: 0.12, ease: "power1.out" }}, s);
        tl.to(t, {{ opacity: 0, duration: 0.1, ease: "power1.in" }}, s + d - 0.1);
      }});
      window.__timelines["subs"] = tl;
    }})();
  </script>
</template>
'''
open(os.path.join(ROOT, "compositions/subs.html"), "w").write(subs)

# ---------------------------------------------------------------- índice
total = T["total"]
hl = []
for i, (cid, t0, dur) in enumerate(hosts):
    hl.append(f'      <div id="{cid}" data-composition-id="{cid}" data-composition-src="compositions/{cid}.html" data-start="{t0}" data-duration="{dur}" data-track-index="{1 + (i % 2)}" data-track-kind="graphics" data-width="1920" data-height="1080" style="z-index:{1 + i}"></div>')
sfx = '      <audio id="efectos" class="clip" src="assets/sfx/efectos.wav" data-start="0" data-duration="%s" data-track-index="12" data-volume="1"></audio>' % total if os.path.exists(os.path.join(ROOT, "assets/sfx/efectos.wav")) else ""
index = f'''<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>Nintendo: de las cartas a las consolas</title>
    <script src="assets/lib/gsap.min.js"></script>
    <style>
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ margin: 0; width: 1920px; height: 1080px; overflow: hidden; background: #1b1714; }}
      #root {{ position: relative; width: 1920px; height: 1080px; overflow: hidden; }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{total}" data-width="1920" data-height="1080" data-fps="30">
{chr(10).join(hl)}
      <div id="subs" data-composition-id="subs" data-composition-src="compositions/subs.html" data-start="0" data-duration="{total}" data-track-index="9" data-track-kind="captions" data-width="1920" data-height="1080" style="z-index:50"></div>
      <audio id="voz" class="clip" src="assets/voice/narracion.wav" data-start="0" data-duration="{total}" data-track-index="10" data-volume="1"></audio>
      <audio id="musica" class="clip" src="assets/music/banda_sonora.wav" data-start="0" data-duration="{total}" data-track-index="11" data-volume="1"></audio>
{sfx}
    </div>
    <script>
      window.__timelines = window.__timelines || {{}};
      window.__timelines["main"] = gsap.timeline({{ paused: true }});
    </script>
  </body>
</html>
'''
open(os.path.join(ROOT, "index.html"), "w").write(index)
print("escenas:", [h[0] for h in hosts], "| subtítulos:", len(groups), "| total", total)
