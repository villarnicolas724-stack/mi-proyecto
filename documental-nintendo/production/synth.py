# -*- coding: utf-8 -*-
"""Motor de síntesis mínimo para la banda sonora original (numpy)."""
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000
RNG = np.random.default_rng(1889)

def mtof(m): return 440.0 * 2 ** ((m - 69) / 12)
def N(name):
    """'D4' / 'Eb5' / 'F#3' -> midi"""
    names = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}
    n = names[name[0]]; i = 1
    while i < len(name) and name[i] in "#b":
        n += 1 if name[i] == "#" else -1; i += 1
    return n + 12 * (int(name[i:]) + 1)

def tarr(d): return np.arange(int(d * SR)) / SR
def lp(x, f, o=2): return sosfilt(butter(o, min(f, SR / 2 - 100), "lp", fs=SR, output="sos"), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, "hp", fs=SR, output="sos"), x)
def bp(x, a, b, o=2): return sosfilt(butter(o, [a, b], "bp", fs=SR, output="sos"), x)
def noise(n, seed=None):
    r = np.random.default_rng(seed) if seed is not None else RNG
    return r.standard_normal(n)

def env(n, a=0.005, r=0.05, hold=None):
    """Envolvente lineal ataque / sostenido / relajación sobre n muestras."""
    e = np.ones(n)
    na = max(1, int(a * SR)); nr = max(1, int(r * SR))
    e[:na] = np.linspace(0, 1, na)[: n] if na <= n else np.linspace(0, 1, n)
    if nr < n: e[-nr:] *= np.linspace(1, 0, nr)
    return e

def polyblep_saw(f, t, phase0=0.0):
    f = np.broadcast_to(f, t.shape) if np.ndim(f) else np.full(t.shape, f)
    ph = (phase0 + np.cumsum(f) / SR) % 1.0
    dt = f / SR
    y = 2 * ph - 1
    m = ph < dt; x = ph[m] / dt[m]; y[m] -= x + x - x * x - 1
    m = ph > 1 - dt; x = (ph[m] - 1) / dt[m]; y[m] -= x * x + x + x + 1
    return y

# ---------------------------------------------------------------- instrumentos
def koto(f, dur=2.8, vel=1.0, bright=1.0):
    t = tarr(dur)
    bend = 2 ** ((0.3 * np.exp(-t / 0.025)) / 12)
    ph = 2 * np.pi * np.cumsum(f * bend) / SR
    y = np.zeros_like(t)
    for k in range(1, 11):
        if k * f > 15000: break
        y += (bright ** (k - 1)) / k ** 1.05 * np.sin(k * ph * (1 + 0.0007 * k * k)) * np.exp(-t * (0.9 + 0.75 * k))
    click = bp(noise(len(t), 7), 1500, 6000) * np.exp(-t / 0.004) * 0.25
    y = (y + click) * np.minimum(1, t / 0.0015)
    return vel * y * 0.5

def piano(f, dur=3.5, vel=0.8):
    t = tarr(dur)
    y = np.zeros_like(t); B = 0.0004
    br = 0.35 + 0.5 * vel
    for k in range(1, 14):
        fk = k * f * np.sqrt(1 + B * k * k)
        if fk > 16000: break
        a = br ** (k - 1) / k ** 0.9
        dec = np.exp(-t * (0.5 + 0.35 * k)) * 0.7 + np.exp(-t * (2.5 + 1.2 * k)) * 0.3
        y += a * dec * (np.sin(2 * np.pi * fk * t) + 0.6 * np.sin(2 * np.pi * (fk + 0.6) * t + 1.0))
    ham = lp(noise(len(t), 3), 3000) * np.exp(-t / 0.006) * 0.08
    y = (y + ham) * np.minimum(1, t / 0.002)
    y[-int(0.08 * SR):] *= np.linspace(1, 0, int(0.08 * SR))
    return vel * y * 0.28

def flute(f, dur, vel=0.6, scoop=1.0, vib=1.0):
    """Shakuhachi / flauta: soplo, vibrato tardío, ataque con portamento."""
    t = tarr(dur)
    bend = 2 ** ((-scoop * np.exp(-t / 0.09)) / 12)
    vibr = 1 + vib * 0.006 * np.sin(2 * np.pi * 5.2 * t) * np.clip((t - 0.35) / 0.5, 0, 1)
    ph = 2 * np.pi * np.cumsum(f * bend * vibr) / SR
    y = np.sin(ph) + 0.22 * np.sin(2 * ph) + 0.07 * np.sin(3 * ph)
    br = bp(noise(len(t), 11), f * 1.5, min(f * 4, 12000)) * 0.35
    e = np.clip(t / 0.18, 0, 1) ** 1.5 * (1 - 0.15 * np.clip((t - 0.2) / dur, 0, 1))
    rel = int(min(0.25, dur / 3) * SR); e[-rel:] *= np.linspace(1, 0, rel)
    return vel * (y + br) * e * 0.35

def saw_pad(freqs, dur, a=1.5, r=2.0, cutoff=2200, voices=5, det=0.12, vel=0.3, vib=0.0):
    t = tarr(dur); y = np.zeros_like(t)
    for i, f in enumerate(freqs):
        for v in range(voices):
            d = (v - (voices - 1) / 2) * det / max(1, voices - 1) * 2
            ff = f * 2 ** (d / 12) * (1 + vib * 0.004 * np.sin(2 * np.pi * (5 + 0.3 * v) * t + v))
            y += polyblep_saw(ff, t, phase0=(i * 0.37 + v * 0.21) % 1)
    y = lp(y, cutoff, 2) / (len(freqs) * voices) ** 0.5
    return vel * y * env(len(t), a, r)

def strings(freqs, dur, a=0.6, r=1.2, vel=0.3, cutoff=3200):
    return saw_pad(freqs, dur, a, r, cutoff, voices=3, det=0.18, vel=vel, vib=1.0)

def choir(freqs, dur, a=1.2, r=2.0, vel=0.25):
    y = saw_pad(freqs, dur, a, r, 6000, voices=4, det=0.15, vel=1.0, vib=1.0)
    # formantes de «aah»
    z = bp(y, 650, 1100) * 1.0 + bp(y, 1000, 1500) * 0.5 + bp(y, 2400, 3000) * 0.25
    return vel * z * 1.6

def vibes(f, dur=2.2, vel=0.5):
    t = tarr(dur)
    idx = 2.2 * np.exp(-t / 0.15)
    y = np.sin(2 * np.pi * f * t + idx * np.sin(2 * np.pi * 4 * f * t))
    y *= np.exp(-t / 0.9) * (1 + 0.25 * np.sin(2 * np.pi * 5.5 * t))
    return vel * y * np.minimum(1, t / 0.002) * 0.35

def bell(f, dur=3.0, vel=0.5, ratio=3.5, index=3.0, decay=1.2):
    t = tarr(dur)
    idx = index * np.exp(-t / 0.4)
    y = np.sin(2 * np.pi * f * t + idx * np.sin(2 * np.pi * ratio * f * t))
    return vel * y * np.exp(-t / decay) * np.minimum(1, t / 0.001) * 0.3

def marimba(f, dur=0.9, vel=0.6):
    t = tarr(dur)
    y = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.35) + 0.35 * np.sin(2 * np.pi * 4 * f * t) * np.exp(-t / 0.05)
    y += 0.12 * np.sin(2 * np.pi * 10 * f * t) * np.exp(-t / 0.01)
    return vel * y * np.minimum(1, t / 0.001) * 0.4

def pluck_bass(f, dur=0.6, vel=0.7, bright=0.5):
    t = tarr(dur); y = np.zeros_like(t)
    for k in range(1, 7):
        y += (bright ** (k - 1)) / k * np.sin(2 * np.pi * k * f * t) * np.exp(-t * (3 + 2.5 * k))
    y *= np.minimum(1, t / 0.003)
    y[-int(0.03 * SR):] *= np.linspace(1, 0, int(0.03 * SR))
    return vel * y * 0.6

def synth_bass(f, dur, vel=0.6, cutoff=900):
    t = tarr(dur)
    y = 0.6 * polyblep_saw(f, t) + 0.8 * np.sin(2 * np.pi * f * t)
    bright = lp(y, cutoff * 3) * np.exp(-t / 0.12) + lp(y, cutoff) * 0.8
    return vel * bright * env(len(t), 0.004, 0.05) * 0.45

def arp_synth(f, dur, vel=0.4, cutoff=3500):
    t = tarr(dur)
    y = polyblep_saw(f, t) + polyblep_saw(f * 1.006, t, 0.3)
    y = lp(y, cutoff) * np.exp(-t / max(0.05, dur * 0.6))
    return vel * y * env(len(t), 0.002, 0.02) * 0.3

# chip (8 bits)
def pulse(f, dur, vel=0.3, duty=0.25, vib=0.0, decay=None, slide=0.0):
    t = tarr(dur)
    ff = f * (1 + vib * 0.012 * np.sin(2 * np.pi * 6 * t) * np.clip((t - 0.15) / 0.2, 0, 1))
    if slide: ff = ff * 2 ** (slide * t / dur / 12)
    ph = np.cumsum(ff) / SR % 1
    y = np.where(ph < duty, 1.0, -1.0)
    e = np.ones_like(t) if decay is None else np.exp(-t / decay)
    e = np.round(e * 15) / 15  # volumen en 16 pasos, como un chip real
    return vel * y * e * env(len(t), 0.001, 0.01)

def tri(f, dur, vel=0.5):
    t = tarr(dur)
    ph = np.cumsum(np.full(t.shape, f)) / SR % 1
    y = np.round((4 * np.abs(ph - 0.5) - 1) * 7.5) / 7.5
    return vel * y * env(len(t), 0.001, 0.01)

def chip_noise(dur, vel=0.3, rate=12000, decay=0.08, seed=5):
    n = int(dur * SR); hold = max(1, int(SR / rate))
    r = np.random.default_rng(seed).choice([-1.0, 1.0], n // hold + 1)
    y = np.repeat(r, hold)[:n]
    e = np.round(np.exp(-tarr(dur) / decay) * 15) / 15
    return vel * y * e

# percusión
def kick(vel=0.8, dur=0.45):
    t = tarr(dur)
    f = 48 + 110 * np.exp(-t / 0.035)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.18)
    y += lp(noise(len(t), 1), 4000) * np.exp(-t / 0.003) * 0.3
    return vel * y

def snare(vel=0.6, dur=0.3, seed=2):
    t = tarr(dur)
    y = bp(noise(len(t), seed), 1200, 9000) * np.exp(-t / 0.09) * 0.8
    y += np.sin(2 * np.pi * 190 * t) * np.exp(-t / 0.06) * 0.6
    return vel * y

def hat(vel=0.25, open_=False, seed=3):
    d = 0.35 if open_ else 0.06
    t = tarr(d)
    return vel * hp(noise(len(t), seed), 7000) * np.exp(-t / (0.12 if open_ else 0.018))

def clap(vel=0.5, seed=4):
    t = tarr(0.35); y = np.zeros_like(t)
    base = bp(noise(len(t), seed), 900, 5000)
    for i, o in enumerate([0, 0.011, 0.022]):
        y += np.where(t >= o, 1, 0) * np.exp(-np.clip(t - o, 0, None) / (0.008 if i < 2 else 0.12))
    return vel * base * y * 0.7

def tom(f=95, vel=0.6):
    t = tarr(0.8)
    ff = f * (1 + 0.4 * np.exp(-t / 0.05))
    return vel * np.sin(2 * np.pi * np.cumsum(ff) / SR) * np.exp(-t / 0.3)

def taiko(vel=0.8, f=62):
    t = tarr(1.8)
    ff = f * (1 + 0.5 * np.exp(-t / 0.04))
    y = np.sin(2 * np.pi * np.cumsum(ff) / SR) * np.exp(-t / 0.5)
    y += lp(noise(len(t), 8), 600) * np.exp(-t / 0.06) * 0.6
    return vel * y

def brush(vel=0.2, seed=9):
    t = tarr(0.25)
    return vel * bp(noise(len(t), seed), 2000, 8000) * np.sin(np.pi * np.clip(t / 0.25, 0, 1)) ** 2

def woodblock(f=900, vel=0.4):
    t = tarr(0.15)
    return vel * (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * 2.7 * f * t)) * np.exp(-t / 0.025)

# ---------------------------------------------------------------- mezcla
class Mix:
    def __init__(self, dur):
        n = int((dur + 4) * SR)
        self.L = np.zeros(n); self.R = np.zeros(n)
        self.vL = np.zeros(n); self.vR = np.zeros(n)  # envío a reverb
        self.eL = np.zeros(n); self.eR = np.zeros(n)  # envío a eco
    def add(self, t0, sig, pan=0.0, gain=1.0, verb=0.25, echo=0.0):
        if t0 < 0: sig = sig[int(-t0 * SR):]; t0 = 0
        i = int(round(t0 * SR)); j = min(len(self.L), i + len(sig)); s = sig[: j - i] * gain
        a = (pan + 1) * np.pi / 4; gl, gr = np.cos(a), np.sin(a)
        self.L[i:j] += s * gl; self.R[i:j] += s * gr
        if verb: self.vL[i:j] += s * gl * verb; self.vR[i:j] += s * gr * verb
        if echo: self.eL[i:j] += s * gl * echo; self.eR[i:j] += s * gr * echo
    def render(self, rt60=2.4, echo_time=0.32, echo_fb=0.38):
        # eco estéreo ping-pong
        d = int(echo_time * SR); eL = np.zeros_like(self.eL); eR = np.zeros_like(self.eR)
        g = 1.0; srcL, srcR = self.eL, self.eR
        for k in range(1, 7):
            g *= echo_fb; sh = d * k
            if k % 2: eR[sh:] += srcL[:-sh] * g; eL[sh:] += srcR[:-sh] * g
            else: eL[sh:] += srcL[:-sh] * g; eR[sh:] += srcR[:-sh] * g
        eL, eR = lp(eL, 5000), lp(eR, 5000)
        # reverb por convolución (respuesta sintética decorrelada)
        n = int(rt60 * SR); t = np.arange(n) / SR
        dec = np.exp(-6.9 * t / rt60)
        irL = lp(noise(n, 101), 7000) * dec; irR = lp(noise(n, 202), 7000) * dec
        pre = int(0.022 * SR); irL = np.concatenate([np.zeros(pre), irL]); irR = np.concatenate([np.zeros(pre), irR])
        irL /= np.sqrt((irL ** 2).sum()); irR /= np.sqrt((irR ** 2).sum())
        vL = hp(self.vL + eL * 0.3, 200); vR = hp(self.vR + eR * 0.3, 200)
        rL = fftconvolve(vL, irL)[: len(self.L)]; rR = fftconvolve(vR, irR)[: len(self.R)]
        return self.L + eL + rL * 0.55, self.R + eR + rR * 0.55
