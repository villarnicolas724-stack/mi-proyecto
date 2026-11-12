# -*- coding: utf-8 -*-
"""Genera la voz en off frase a frase (Kokoro, local), monta la pista completa
y escribe production/timing.json + subtítulos SRT/VTT.

Uso: /opt/kvenv/bin/python production/build_voice.py
"""
import json, os, sys, hashlib
import numpy as np, soundfile as sf
from scipy.signal import resample_poly, butter, sosfilt

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
from guion import CHAPTERS, CREDITS_DURATION

VOICE, SPEED, SR = "em_alex", 0.95, 48000
CACHE = os.path.join(HERE, ".tts_cache"); os.makedirs(CACHE, exist_ok=True)

_k = None
def tts(text):
    global _k
    key = hashlib.sha1(f"{VOICE}|{SPEED}|{text}".encode()).hexdigest()[:16]
    p = os.path.join(CACHE, key + ".wav")
    if os.path.exists(p):
        x, sr = sf.read(p); return x
    if _k is None:
        from kokoro_onnx import Kokoro
        c = os.path.expanduser("~/.cache/hyperframes/tts")
        _k = Kokoro(f"{c}/models/kokoro-v1.0.onnx", f"{c}/voices/voices-v1.0.bin")
    s, sr = _k.create(text, voice=VOICE, speed=SPEED, lang="es")
    x = resample_poly(np.asarray(s, dtype=np.float64), SR, sr)
    sf.write(p, x, SR)
    return x

def trim(x, thr=0.012, pad=0.04):
    env = np.convolve(np.abs(x), np.ones(240) / 240, "same")
    idx = np.where(env > thr)[0]
    if not len(idx): return x
    a = max(0, idx[0] - int(pad * SR)); b = min(len(x), idx[-1] + int(pad * SR))
    y = x[a:b].copy()
    f = int(0.012 * SR); y[:f] *= np.linspace(0, 1, f); y[-f:] *= np.linspace(1, 0, f)
    return y

def process(x):
    # limpieza: paso alto 75 Hz, ligera presencia, compresión suave, nivel uniforme
    x = sosfilt(butter(2, 75, "hp", fs=SR, output="sos"), x)
    pres = sosfilt(butter(2, [2500, 6000], "bp", fs=SR, output="sos"), x)
    x = x + 0.18 * pres
    rms = np.sqrt(np.mean(x[np.abs(x) > 0.01] ** 2) + 1e-9)
    x = x * (0.11 / rms)
    # compresor suave tipo soft-knee
    x = np.tanh(x * 1.6) / 1.6
    return x

timing = {"voice": VOICE, "speed": SPEED, "chapters": [], "cues": []}
track = []
t = 0.0
for ch in CHAPTERS:
    c0 = t
    t += ch["lead"]
    for cid, text, say, gap in ch["cues"]:
        x = process(trim(tts(say)))
        d = len(x) / SR
        timing["cues"].append({"id": cid, "chapter": ch["id"], "text": text,
                               "start": round(t, 3), "end": round(t + d, 3)})
        track.append((t, x))
        t += d + gap
    t += ch["tail"]
    timing["chapters"].append({"id": ch["id"], "title": ch["title"],
                               "start": round(c0, 3), "end": round(t, 3)})
credits_start = t
t += CREDITS_DURATION
timing["chapters"].append({"id": "credits", "title": None,
                           "start": round(credits_start, 3), "end": round(t, 3)})
timing["total"] = round(t, 3)

out = np.zeros(int((t + 0.5) * SR))
for s, x in track:
    i = int(round(s * SR)); out[i:i + len(x)] += x
peak = np.abs(out).max()
out *= min(1.0, 0.89 / peak)  # ~ -1 dBFS
os.makedirs(os.path.join(ROOT, "assets/voice"), exist_ok=True)
sf.write(os.path.join(ROOT, "assets/voice/narracion.wav"), out.astype(np.float32), SR, subtype="PCM_16")
json.dump(timing, open(os.path.join(HERE, "timing.json"), "w"), ensure_ascii=False, indent=1)

def ts(v, sep):
    h = int(v // 3600); m = int(v % 3600 // 60); s = v % 60
    return f"{h:02d}:{m:02d}:{int(s):02d}{sep}{int(round((s - int(s)) * 1000)):03d}"

def split_cue(c, maxw=11):
    """Parte frases largas en líneas de subtítulo, repartiendo el tiempo por caracteres."""
    words = c["text"].split()
    if len(words) <= maxw: return [(c["start"], c["end"], c["text"])]
    n = -(-len(words) // maxw); per = -(-len(words) // n)
    chunks = [" ".join(words[i:i + per]) for i in range(0, len(words), per)]
    tot = sum(len(x) for x in chunks); out = []; s = c["start"]
    for ch_ in chunks:
        e = s + (c["end"] - c["start"]) * len(ch_) / tot
        out.append((s, e, ch_)); s = e
    return out

srt, vtt = [], ["WEBVTT", ""]
n = 1
subs = []
for c in timing["cues"]:
    for s, e, txt in split_cue(c):
        subs.append({"cue": c["id"], "start": round(s, 3), "end": round(e, 3), "text": txt})
        srt += [str(n), f"{ts(s, ',')} --> {ts(e, ',')}", txt, ""]
        vtt += [f"{ts(s, '.')} --> {ts(e, '.')}", txt, ""]
        n += 1
timing["subs"] = subs
json.dump(timing, open(os.path.join(HERE, "timing.json"), "w"), ensure_ascii=False, indent=1)
os.makedirs(os.path.join(ROOT, "deliverables"), exist_ok=True)
open(os.path.join(ROOT, "deliverables/subtitulos_es.srt"), "w").write("\n".join(srt))
open(os.path.join(ROOT, "deliverables/subtitulos_es.vtt"), "w").write("\n".join(vtt))

words = sum(len(c["text"].split()) for c in timing["cues"])
print(f"total {t:.1f}s ({t/60:.2f} min), {len(timing['cues'])} frases, {words} palabras, {len(subs)} subtítulos")
for c in timing["chapters"]:
    print(f"  {c['id']:8s} {c['start']:7.1f} → {c['end']:7.1f}  ({c['end']-c['start']:.1f}s)")
