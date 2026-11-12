# -*- coding: utf-8 -*-
"""Pista de efectos: cada efecto tiene una causa visible en pantalla (tiempos = los de las escenas).
Uso: /opt/kvenv/bin/python production/build_sfx.py"""
import json, os, sys, subprocess
import numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
from synth import SR, lp, hp, bp, noise, tarr, mtof

T = json.load(open(os.path.join(HERE, "timing.json")))
CH = {c["id"]: c for c in T["chapters"]}
CU = {c["id"]: c for c in T["cues"]}
def S(i): return CU[i]["start"]
def E(i): return CU[i]["end"]
def t0(ch): return CH[ch]["start"]
N = int((T["total"] + 2) * SR)
L = np.zeros(N); R = np.zeros(N)
BUND = "/root/.claude/skills/media-use/audio/assets/sfx"

def load(name):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", f"{BUND}/{name}.mp3", "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True).stdout
    x = np.frombuffer(raw, dtype=np.float32).astype(np.float64)
    return x / (np.abs(x).max() + 1e-9)
B = {n: load(n) for n in ["whoosh", "whoosh-short", "whoosh-cinematic", "riser", "impact-bass-1", "impact-bass-2", "sparkle", "pop", "click-soft", "glitch-1", "error"]}

def peak_off(x):  # segundos hasta el pico (para que el pico caiga 1 fotograma después de la imagen)
    env = np.convolve(np.abs(x), np.ones(480) / 480, "same"); return np.argmax(env) / SR
def place(t, x, gain=0.5, pan=0.0, align=True):
    off = peak_off(x) if align else 0.0
    t = t + 1 / 30 - off
    i = max(0, int(t * SR)); j = min(N, i + len(x)); s = x[: j - i] * gain
    a = (pan + 1) * np.pi / 4; L[i:j] += s * np.cos(a); R[i:j] += s * np.sin(a)

# --- efectos sintetizados
def swish(d=0.28, lo=900, hi=5000, seed=1):
    t = tarr(d); x = bp(noise(len(t), seed), lo, hi); return x * np.sin(np.pi * t / d) ** 2
def paper(seed=2):  # carta sobre la mesa
    t = tarr(0.09); return bp(noise(len(t), seed), 1500, 7000) * np.exp(-t / 0.02)
def thud(f=70, seed=3):
    t = tarr(0.5); ff = f * (1 + 0.6 * np.exp(-t / 0.03))
    return np.sin(2 * np.pi * np.cumsum(ff) / SR) * np.exp(-t / 0.14) + lp(noise(len(t), seed), 900) * np.exp(-t / 0.03) * 0.5
def click(seed=4):
    t = tarr(0.05); return hp(noise(len(t), seed), 2500) * np.exp(-t / 0.004) + np.sin(2 * np.pi * 1800 * t) * np.exp(-t / 0.006) * 0.5
def blip(f=880, d=0.07):
    t = tarr(d); y = np.where((np.cumsum(np.full(len(t), f)) / SR) % 1 < 0.5, 1.0, -1.0); return y * np.exp(-t / (d * 0.6)) * 0.5
def rip(seed=5):
    t = tarr(0.55); x = bp(noise(len(t), seed), 700, 6000) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 38 * t + 3 * np.sin(2 * np.pi * 7 * t))))
    return x * np.sin(np.pi * t / 0.55) ** 0.7
def ratchet(n=6, gap=0.07):
    out = np.zeros(int((n * gap + 0.1) * SR))
    for k in range(n): c = click(10 + k) * 0.7; i = int(k * gap * SR); out[i:i + len(c)] += c
    return out
def hum(d=1.2):
    t = tarr(d); return (np.sin(2 * np.pi * 60 * t) * 0.6 + np.sin(2 * np.pi * 15734 / 4 * t) * 0.02) * np.minimum(1, t / 0.05) * np.exp(-t / 0.6)
def wind(d):
    t = tarr(d); x = lp(noise(len(t), 77), 700) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.13 * t)) ; e = np.minimum(1, t / 1.5) * np.minimum(1, (d - t) / 1.5); return x * e
def crowd_murmur(d):
    t = tarr(d); x = bp(noise(len(t), 88), 300, 2500) * (0.7 + 0.3 * np.sin(2 * np.pi * 0.7 * t)); e = np.minimum(1, t / 0.8) * np.minimum(1, (d - t) / 0.8); return x * e

W = [B["whoosh"], B["whoosh-short"]]
wi = [0]
def whoosh(t, g=0.32, pan=0.0):
    x = W[wi[0] % 2]; wi[0] += 1; place(t, x, g, pan)

# ================================================================ eventos
# tarjetas de capítulo: la carta gira (swish) y se convierte en el mundo (whoosh)
HOLD = {"ch1": 1.55, "ch2": 1.6, "ch3": 1.5, "ch4": 1.5, "ch5": 1.5, "ch6": 1.5, "ch7": 1.5, "ch8": 1.5}
for ch, h in HOLD.items():
    a = t0(ch)
    place(a + 0.35, swish(0.4, 600, 4000, seed=sum(map(ord, ch)) % 97), 0.22, -0.2)
    whoosh(a + 0.6 + h + 0.55, 0.30)

# gancho
for k, tt in enumerate([0.15, 1.25, 2.1, 2.95]): place(tt + 0.4, swish(0.6, 400, 2500, seed=20 + k), 0.10, 0.2 * (k % 2 * 2 - 1), align=False)
flip = S("h2") + 0.25
place(flip + 0.65, swish(0.5, 500, 5000, seed=31), 0.26)
place(flip + 1.05 + 0.18, click(32), 0.45, -0.4); place(flip + 1.15 + 0.18, click(33), 0.45, 0.4)
place(flip + 1.8, blip(1320, 0.05), 0.08)
place(S("h3") + 0.95, B["impact-bass-1"], 0.30)

# cap. 1 — viento sobre Kioto, el tren, las cartas
a1 = t0("ch1")
place(a1 + 2.4, wind(S("c1b") - a1 - 2.0), 0.10, align=False)
for k in range(3): place(S("c1a") + 4.9 + 0.3 + k * 0.5 + 0.25, paper(40 + k), 0.28, -0.3 + 0.3 * k)
for k in range(12): place(S("c1c") + 0.9 + k * 0.2 + 0.12, paper(50 + k), 0.16, -0.6 + k * 0.1)
place(S("c1d") + 0.3, thud(110, 60), 0.18)
for k in range(3): place(S("c1e") + 0.1 + k * 0.45, swish(0.3, 300, 1800, 61 + k), 0.12, align=False)
for k in range(4): place(S("c1f") + 1.7 + k * 0.16 + 0.2, paper(70 + k), 0.2, 0.3)
place(t0("ch2") - 0.95, swish(0.9, 120, 900, 75), 0.3, align=False)          # gota de tinta

# cap. 2
place(S("c2e") - 0.05 + 1.45, thud(90, 80), 0.3)                         # el taxi se para
place(S("c2e") + 1.5, thud(60, 81), 0.35, -0.3); place(S("c2e") + 2.5, thud(60, 82), 0.35, 0.3)   # sellos
place(S("c2d") + 3.3, swish(0.4, 1500, 7000, 83), 0.16)                  # tachado
place(S("c2f") + 1.6, swish(1.4, 150, 900, 84), 0.2, align=False)        # la puerta
place(S("c2h") + 2.9, ratchet(8, 0.11), 0.35, 0.2, align=False)          # Ultra Hand se extiende
place(S("c2h") + 4.6, ratchet(5, 0.22), 0.25, -0.1, align=False)
place(t0("ch3") - 1.0, B["whoosh-cinematic"][: int(1.6 * SR)], 0.22)    # zoom a la pantalla

# cap. 3
place(t0("ch3") + 2.2, hum(1.4), 0.12, align=False)
place(S("c3a"), crowd_murmur(4.5), 0.06, align=False)
for k in range(3): place(S("c3b") + 3.6 + k * 0.35, blip(1500 - k * 200, 0.05), 0.07, 0.3)
place(S("c3b") + 5.5, B["error"], 0.20)
for k in range(13): place(S("c3c") - 0.05 + 0.05 + k * 0.05 + 0.05, thud(120 + k * 3, 90 + k), 0.05, -0.6 + k * 0.1)
for k, dt in enumerate([0.1, 1.1, 2.1]): place(S("c3f") - 0.05 + dt + 0.05, blip(660 + 220 * k, 0.09), 0.10, -0.4 + 0.4 * k)
place(S("c3f") - 0.05 + 3.85, blip(990, 0.08), 0.08)
place(S("c3g") - 0.08, B["impact-bass-2"], 0.34)
for k in range(4): place(S("c3h") + 2.9 + k * 0.15, blip(1200 + 120 * k, 0.04), 0.07)
for k in range(12): place(S("c3i") + 0.6 + k * 0.28, blip(700 + (k % 3) * 300, 0.05), 0.05, -0.7 + k * 0.12)
place(t0("ch4") - 0.9, B["glitch-1"][: int(0.9 * SR)], 0.16, align=False)

# cap. 4
whoosh(S("c4a") - 0.6 + 0.2, 0.22)
for k in range(9): place(S("c4b") + 3.1 + k * 0.12 + 0.7, thud(140 + 9 * k, 100 + k), 0.14, -0.5 + k * 0.12)
whoosh(S("c4c") - 0.1 + 0.1, 0.22)
place(S("c4d") + 1.3, thud(55, 110), 0.42)                               # sello
place(S("c4e") + 0.2, blip(523, 0.06), 0.06)
for k in range(5): place(S("c4g") - 0.05 + 0.2 + k * 0.6 + 0.2, blip(440 * 2 ** (k / 5), 0.06), 0.07)
for k in range(0, 62, 3): place(S("c4h") - 0.05 + 0.3 + k * 0.03 + 0.12, click(120 + k), 0.06, -0.5 + k / 62)
whoosh(S("c4i") - 0.1 + 0.1, 0.22)
for k in range(6): place(S("c4j") - 0.05 + 0.1 + k * 0.75 + 0.9, thud(180, 130 + k), 0.10)
whoosh(S("c4k") - 0.1 + 0.1, 0.22)
place(S("c4k") + 4.2 + 0.6, swish(0.8, 2000, 9000, 140), 0.12, align=False)

# cap. 5
whoosh(t0("ch5") + 2.3, 0.3, -0.5); whoosh(t0("ch5") + 2.4, 0.3, 0.5)
place(S("c5a") + 2.5 + 0.3, B["impact-bass-1"], 0.22)
place(S("c5a") + 4.1 + 0.2, swish(0.45, 1200, 9000, 150), 0.3, 0.0, align=False)
place(S("c5b") + 1.6, rip(151), 0.3)
place(S("c5b") + 3.2, swish(1.6, 2500, 9000, 152), 0.08, align=False)
whoosh(S("c5c") - 0.1, 0.22)
place(S("c5d") + 0.1, B["whoosh-cinematic"][: int(2.0 * SR)], 0.18)
place(S("c5e") + 0.6, B["pop"], 0.12); place(S("c5e") + 2.6, B["pop"], 0.12)
place(S("c5f") - 0.05 + 1.0, swish(0.5, 300, 2500, 153), 0.2); place(S("c5f") + 1.9, swish(0.3, 600, 4000, 154), 0.18)
for k in range(3): place(S("c5g") + 3.0 + k * 0.7 + 0.65, blip(880 + 220 * k, 0.06), 0.08, -0.5 + 0.5 * k)
place(S("c5h") + 0.4, B["sparkle"], 0.16, align=False)
place(S("c5i") + 3.0, B["pop"], 0.10); place(S("c5i") + 4.6, B["pop"], 0.10)
place(S("c5j") + 1.5, swish(1.6, 300, 2000, 155), 0.14, align=False)

# cap. 6
for k in range(0, 160, 8): place(S("c6d") + 2.6 + k * 0.022, B["pop"][: int(0.2 * SR)], 0.025, -0.6 + k / 140)
place(S("c6e") + 0.6 + 0.3, click(160), 0.25); place(S("c6e") + 2.0, click(161), 0.2)
place(S("c6f") + 2.4 + 1.4, B["pop"], 0.1)
place(S("c6g") + 1.6, swish(0.7, 400, 3000, 162), 0.3, 0.4)
place(S("c6h") - 0.05 + 1.6, rip(163)[: int(0.3 * SR)] * 0.6 + 0, 0.25, 0.1)
for k in range(6): place(S("c6h") - 0.05 + 1.6 + k * 0.04 + 0.2, click(170 + k), 0.12, -0.2 + 0.08 * k)
for k in range(6): place(S("c6j") - 0.05 + 0.2 + k * 0.22 + 0.2, B["pop"][: int(0.25 * SR)], 0.05)
place(t0("ch7") - 0.55, B["whoosh-cinematic"][: int(1.2 * SR)], 0.2)

# cap. 7
place(S("c7a") - 0.45 + 0.3, swish(0.6, 300, 3000, 180), 0.12, align=False)
place(S("c7b") + 1.0, swish(0.9, 300, 2500, 181), 0.14, align=False)
place(S("c7b") + 4.2 + 0.3, click(182), 0.4, -0.5); place(S("c7b") + 4.2 + 0.35, click(183), 0.4, 0.5)
place(S("c7c") + 0.1, wind(5.5), 0.08, align=False)
for k, dt in enumerate([0.0, 1.2, 2.2, 3.6]): whoosh(S("c7d") - 0.05 + dt, 0.28, -0.3 + 0.2 * k)
for v in (101.63, 118.69, 154.02): whoosh(S("c7e") + 1.6 + 4.0 * v / 157.2, 0.14)
place(S("c7e") + 1.6 + 4.2, B["pop"], 0.12)
whoosh(S("c7f") + 3.6, 0.22); whoosh(S("c7f") + 6.8, 0.22)
r = B["riser"]; place(S("c7g") - 0.05 - (len(r) / SR) + 0.1, r * np.linspace(0, 1, len(r)) ** 2, 0.22, align=False)   # subida → impacto (una vez)
place(S("c7g") - 0.05, B["impact-bass-2"], 0.42)
place(S("c7h") + 1.6, swish(0.35, 1500, 7000, 185), 0.16)
place(S("c7h") + 4.4 + 1.4, B["pop"], 0.1)
place(S("c7i") + 1.3, B["pop"], 0.1); place(S("c7i") + 4.2, B["pop"], 0.1)

# cap. 8
place(S("c8b") + 0.2, swish(6.0, 200, 1200, 190), 0.05, align=False)
for k in range(8): place(S("c8e") - 0.05 + 0.3 + k * 0.55 + 0.1, paper(200 + k), 0.30, 0.4 - k * 0.1)
place(S("c8f") - 0.3 + 0.2, swish(0.5, 500, 3000, 210), 0.14)
place(S("c8h") + 0.1 + 0.25, paper(211), 0.32, 0.3)

# ---- nivel y salida
st = np.stack([L, R], 1)[: int(T["total"] * SR)]
pk = np.abs(st).max(); st *= min(1.0, 0.95 / pk)
os.makedirs(os.path.join(ROOT, "assets/sfx"), exist_ok=True)
sf.write(os.path.join(ROOT, "assets/sfx/efectos.wav"), st.astype(np.float32), SR, subtype="PCM_16")
print("efectos ok", st.shape[0] / SR, "pico", pk)
