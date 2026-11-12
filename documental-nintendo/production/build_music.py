# -*- coding: utf-8 -*-
"""Banda sonora original, compuesta por capítulos sobre los tiempos reales de la voz.

Leitmotiv (forma por grados de una escala pentatónica): [0, 1, 3, 2, 1]
  · Kioto (miyako-bushi en Re):   D Eb A G Eb   — koto / shakuhachi
  · Arcade (pentatónica menor Do): C Eb G F Eb  — pulso 8 bits
  · Era moderna / legado (Re mayor pentatónica): D E A F# E — sintes, piano, koto
Uso: /opt/kvenv/bin/python production/build_music.py
"""
import json, os, sys
import numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
from synth import *

T = json.load(open(os.path.join(HERE, "timing.json")))
CH = {c["id"]: c for c in T["chapters"]}
CU = {c["id"]: c for c in T["cues"]}
def cs(i): return CU[i]["start"]
def ce(i): return CU[i]["end"]
TOTAL = T["total"]
m = Mix(TOTAL)

def bars(t0, t1, bpm, beats=4):
    b = 60 / bpm * beats; out = []; k = 0
    while t0 + k * b < t1 - 0.05: out.append(t0 + k * b); k += 1
    return out
def f(n): return mtof(N(n)) if isinstance(n, str) else mtof(n)

PENTA_MIYAKO_D = ["D", "Eb", "G", "A", "Bb"]
def motif(scale, octave, start_deg=0):
    degs = [0, 1, 3, 2, 1]
    out = []
    for d in degs:
        k = start_deg + d; o = octave + k // 5
        out.append(f"{scale[k % 5]}{o}")
    return out

# =================================================================== GANCHO
def hook():
    c = CH["hook"]; t1 = c["end"]
    # dron grave y respiración
    m.add(0.0, saw_pad([f("D2"), f("A2"), f("D3")], t1 + 1.5, a=1.2, r=2.5, cutoff=700, vel=0.5), gain=0.9, verb=0.5)
    m.add(0.0, saw_pad([f("A3"), f("E4"), f("F4")], t1 - 2.5, a=4.0, r=2.0, cutoff=1800, vel=0.22), gain=0.8, verb=0.6)
    # latido de taiko, lento
    for i, t in enumerate(np.arange(0.35, cs("h3") - 0.5, 2.2)):
        m.add(t, taiko(0.45 + 0.04 * i, 58), gain=0.8, verb=0.4)
    # el koto anuncia la carta
    for t, n in [(0.25, "D5"), (0.62, "Eb5"), (1.05, "A5")]:
        m.add(t, koto(f(n), 3.5, 0.7), pan=0.15, verb=0.5)
    for k, n in enumerate(motif(PENTA_MIYAKO_D, 4)):
        m.add(cs("h2") + 0.4 + k * 0.42, koto(f(n), 3.0, 0.45), pan=-0.2, verb=0.5)
    # resolución luminosa en «Nintendo»
    hit = cs("h3") + 0.95
    m.add(hit, saw_pad([f("D3"), f("A3"), f("D4"), f("F#4"), f("A4"), f("E5")], 4.5, a=0.02, r=3.0, cutoff=3500, vel=0.5), gain=1.0, verb=0.7)
    m.add(hit, taiko(1.0, 55), gain=1.0, verb=0.5)
    m.add(hit, bell(f("D6"), 4.0, 0.35), pan=0.3, verb=0.8)

# =================================================================== CAP. 1 — KIOTO 1889
def ch1():
    c = CH["ch1"]; t0, t1 = c["start"], c["end"]; bpm = 72; e = 60 / bpm / 2
    # título del capítulo: shakuhachi solo + koto
    m.add(t0 + 0.2, flute(f("D5"), 1.6, 0.55), pan=-0.1, verb=0.7)
    m.add(t0 + 1.7, flute(f("Eb5"), 0.7, 0.5, scoop=0.6), pan=-0.1, verb=0.7)
    m.add(t0 + 2.3, flute(f("A5"), 1.8, 0.55), pan=-0.1, verb=0.7)
    # dron
    m.add(t0, saw_pad([f("D2"), f("A2")], t1 - t0 + 1, a=2.5, r=3, cutoff=500, vel=0.45), verb=0.4)
    # arpegios de koto en miyako-bushi
    pats = [["D3", "A3", "D4", "Eb4", "A4", "Eb4", "D4", "A3"],
            ["G2", "D3", "G3", "A3", "D4", "A3", "G3", "D3"],
            ["Bb2", "F3", "Bb3", "D4", "Eb4", "D4", "Bb3", "F3"],
            ["A2", "Eb3", "A3", "Bb3", "D4", "Bb3", "A3", "Eb3"]]
    western = cs("c1f")
    for bi, b in enumerate(bars(t0 + 3.0, t1 - 0.8, bpm)):
        p = pats[bi % 4]
        for k, n in enumerate(p):
            t = b + k * e + (0.012 if k % 2 else 0)  # ligero swing humano
            m.add(t, koto(f(n), 2.4, 0.42 if k else 0.55, bright=0.9), pan=-0.35 + 0.1 * (k % 3), verb=0.35)
        if bi % 2 == 1:
            m.add(b, woodblock(780, 0.15), pan=0.5, verb=0.3)
    # cartas occidentales (1902): entra una armonía tonal suave
    for b, ch_ in zip(bars(western, ce("c1g"), bpm), [["Bb3", "D4", "F4"], ["G3", "Bb3", "D4"], ["Eb3", "G3", "Bb3"], ["A3", "C#4", "E4"]]):
        m.add(b, strings([f(x) for x in ch_], 60 / bpm * 4 + 0.6, a=0.8, r=1.2, vel=0.22), pan=0.2, verb=0.5)
    # frases de shakuhachi en los respiros
    for t, ns in [(ce("c1a") + 0.05, [("D5", 0.5), ("Eb5", 0.5), ("A5", 1.2)]),
                  (ce("c1c") + 0.05, [("G5", 0.45), ("A5", 0.9)]),
                  (ce("c1e") - 0.3, [("Bb5", 0.5), ("A5", 0.5), ("G5", 1.0)])]:
        for n, d in ns:
            m.add(t, flute(f(n), d + 0.2, 0.42), pan=-0.1, verb=0.7); t += d
    # «un joven de veintidós años»: queda una sola nota
    m.add(ce("c1h") + 0.1, koto(f("D4"), 4.0, 0.6), verb=0.7)
    m.add(ce("c1h") + 0.1, bell(f("A5"), 4.0, 0.22, ratio=2.0, index=1.5), pan=0.3, verb=0.8)

# =================================================================== CAP. 2 — 1949-1980, swing de taller
def ch2():
    c = CH["ch2"]; t0, t1 = c["start"], c["end"]; bpm = 104; beat = 60 / bpm
    sw = beat * 0.62  # corchea con swing
    prog = [("F2", ["A3", "C4", "E4"]), ("D2", ["F3", "A3", "C4"]), ("G2", ["F3", "Bb3", "D4"]), ("C2", ["E3", "Bb3", "D4"])]
    fail0, fail1 = cs("c2e"), cs("c2f")
    walk = {"F2": ["F2", "A2", "C3", "D3"], "D2": ["D2", "F2", "A2", "C3"], "G2": ["G2", "Bb2", "D3", "E3"], "C2": ["C2", "E2", "G2", "Bb2"]}
    for bi, b in enumerate(bars(t0 + 0.6, t1 - 0.4, bpm)):
        root, chord = prog[bi % 4]
        failing = fail0 - 0.3 <= b < fail1 - 0.2
        for k, n in enumerate(walk[root]):
            m.add(b + k * beat, pluck_bass(f(n), 0.55, 0.75 if k == 0 else 0.6), pan=-0.05, verb=0.1)
        if failing:
            continue
        for k in range(4):
            m.add(b + k * beat, brush(0.11 if k % 2 == 0 else 0.16, seed=bi * 4 + k), pan=0.25, verb=0.2)
            m.add(b + k * beat + sw, brush(0.07, seed=99 + k), pan=0.3, verb=0.2)
        # vibráfono comping a contratiempo
        for k in (1, 3):
            for n in chord:
                m.add(b + k * beat + sw * 0.0 + (0.0 if k == 1 else sw), vibes(f(n), 1.4, 0.3), pan=0.35, verb=0.35)
    # melodía de celesta (leitmotiv en Fa mayor pentatónico)
    penta_f = ["F", "G", "A", "C", "D"]
    for t in [t0 + 0.6 + 4 * beat * 1, cs("c2c") - 0.2, cs("c2h") + 1.5]:
        for k, n in enumerate(motif(penta_f, 5)):
            m.add(t + k * beat * (0.5 if k < 4 else 1), bell(f(n), 1.8, 0.28, ratio=4.0, index=1.2, decay=0.6), pan=-0.3, verb=0.5)
    # el fracaso: tres notas que caen, con trombón de juguete
    for k, n in enumerate(["C4", "B3", "Bb3", "A3"]):
        m.add(fail0 + 1.6 + k * 0.42, pulse(f(n), 0.38 if k < 3 else 1.0, 0.07, duty=0.5, vib=1 if k == 3 else 0, slide=-1 if k == 3 else 0), pan=0.1, verb=0.3)
    # Ultra Hand: chasquido de tijera y subida
    uh = cs("c2h")
    for k in range(6):
        m.add(uh + 3.2 + k * 0.09, woodblock(1200 + 140 * k, 0.18), pan=-0.4 + 0.15 * k, verb=0.2)
    # Game & Watch: pitidos LCD como puente al capítulo 3
    gw = ce("c2i") - 1.2
    for k, n in enumerate(["C6", "E6", "G6"]):
        m.add(gw + k * 0.14, pulse(f(n), 0.09, 0.05, duty=0.5), pan=0.2, verb=0.15)
    for k, n in enumerate(["G5", "C6"]):
        m.add(ce("c2j") + 0.15 + k * 0.18, pulse(f(n), 0.12, 0.06, duty=0.5), verb=0.2)

# =================================================================== CAP. 3 — ARCADE 1980-1983
def ch3():
    c = CH["ch3"]; t0, t1 = c["start"], c["end"]; bpm = 140; beat = 60 / bpm; e = beat / 2; s16 = beat / 4
    prog = [("C2", ["C4", "Eb4", "G4"]), ("Ab1", ["C4", "Eb4", "Ab4"]), ("Bb1", ["D4", "F4", "Bb4"]), ("G1", ["D4", "G4", "B4"])]
    build, full = cs("c3d"), cs("c3g") - 0.05
    fail = ce("c3c")
    for bi, b in enumerate(bars(t0 + 0.2, t1 - 0.3, bpm)):
        root, chord = prog[bi % 4]
        if fail - 0.6 < b < build - 0.1:  # silencio tras el fracaso de Radar Scope
            continue
        # bajo triangular en corcheas con octavas
        for k in range(8):
            n = N(root) + (12 if k % 2 else 0)
            m.add(b + k * e, tri(mtof(n), e * 0.9, 0.3), verb=0.05)
        for k in range(8):
            m.add(b + k * e, chip_noise(0.03, 0.06 if k % 2 else 0.09, rate=16000, decay=0.012, seed=bi * 8 + k), pan=0.3, verb=0.05)
        if b >= build - 0.1:
            # arpegio de 16 notas (pulso 12,5 %)
            for k in range(16):
                n = chord[k % 3]; o = 12 if (k // 3) % 2 else 0
                m.add(b + k * s16, pulse(mtof(N(n) + o), s16 * 0.8, 0.06, duty=0.125), pan=-0.35, verb=0.1, echo=0.15)
        if b >= full:
            for k in range(4):  # batería de ruido
                if k % 2 == 0: m.add(b + k * beat, chip_noise(0.12, 0.28, rate=3000, decay=0.05, seed=k), verb=0.08)
                else: m.add(b + k * beat, chip_noise(0.16, 0.22, rate=9000, decay=0.07, seed=40 + k), pan=0.1, verb=0.12)
    # Radar Scope: entrada tímida y caída tipo «fin de partida»
    for k, n in enumerate(["G5", "F#5", "F5", "E5", "Eb5", "D5", "C#5", "C5"]):
        m.add(fail - 0.3 + k * 0.11, pulse(f(n), 0.1, 0.07, duty=0.5), verb=0.2)
    m.add(fail + 0.62, pulse(f("C4"), 0.7, 0.08, duty=0.5, slide=-12), verb=0.3)
    # leitmotiv en el título «Donkey Kong. 1981.»
    penta_c = ["C", "Eb", "F", "G", "Bb"]
    lead = motif(penta_c, 5)
    for rep, t in enumerate([full, full + 8 * beat, cs("c3i") + 0.4]):
        rhythm = [1, 1, 1.5, 0.5, 2]
        tt = t
        for k, n in enumerate(lead):
            d = rhythm[k] * beat
            m.add(tt, pulse(f(n), d * 0.92, 0.12, duty=0.25, vib=1 if d > beat else 0), pan=0.1, verb=0.15, echo=0.2)
            tt += d
    # golpe de título
    m.add(full, chip_noise(0.6, 0.35, rate=2000, decay=0.25, seed=77), verb=0.3)
    m.add(full, tri(f("C2"), 0.6, 0.7))

# =================================================================== CAP. 4 — CONSOLAS 1983-1991
def ch4():
    c = CH["ch4"]; t0, t1 = c["start"], c["end"]
    # 1983: fanfarria Famicom
    bpm = 150; beat = 60 / bpm; e = beat / 2
    for k, (n, d) in enumerate([("G4", 1), ("B4", 1), ("D5", 1), ("G5", 3)]):
        st = t0 + 0.4 + sum([1, 1, 1, 3][:k]) * e
        m.add(st, pulse(f(n), d * e * 0.95, 0.09, duty=0.5, vib=1 if d > 1 else 0), verb=0.2)
        m.add(st, pulse(f(n) / 2, d * e * 0.95, 0.06, duty=0.25), pan=-0.3, verb=0.2)
    m.add(t0 + 0.4, tri(f("G2"), 6 * e, 0.6))
    prog = [("G2", ["G4", "B4", "D5"]), ("E2", ["E4", "G4", "B4"]), ("C2", ["E4", "G4", "C5"]), ("D2", ["F#4", "A4", "D5"])]
    crash0, crash1 = cs("c4b"), cs("c4c") + 0.8
    gb0, snes0 = cs("c4i"), cs("c4k")
    penta_g = ["G", "A", "B", "D", "E"]
    for bi, b in enumerate(bars(t0 + 2.0, snes0 - 0.2, bpm)):
        root, chord = prog[bi % 4]
        crash = crash0 - 0.3 <= b < crash1
        gb = b >= gb0 - 0.2
        if crash:
            # el mercado se hunde: notas largas desafinadas y graves
            if bi % 2 == 0:
                m.add(b, tri(f(root) / 2, 4 * beat * 2, 0.3), verb=0.3)
                m.add(b, pulse(f(chord[0]) * 0.985, 4 * beat * 1.8, 0.035, duty=0.5, slide=-2), pan=0.3, verb=0.5)
            continue
        for k in range(8):
            m.add(b + k * e, tri(f(root) * (2 if k in (2, 6) else 1), e * 0.85, 0.3))
        for k in range(4):
            if k % 2 == 0: m.add(b + k * beat, chip_noise(0.1, 0.22, rate=2500, decay=0.04, seed=k), verb=0.05)
            else: m.add(b + k * beat, chip_noise(0.14, 0.18, rate=9000, decay=0.06, seed=k + 9), pan=0.1, verb=0.08)
            m.add(b + k * beat + e, chip_noise(0.03, 0.06, rate=16000, decay=0.01, seed=k + 30), pan=-0.3)
        # acordes «stab» de pulso a contratiempo
        for k in (1, 3, 5, 7):
            for n in chord[:2]:
                m.add(b + k * e, pulse(f(n), e * 0.5, 0.03 if not gb else 0.022, duty=0.25), pan=0.35 if not gb else 0.0, verb=0.1)
    # melodía heroica (leitmotiv en Sol) en Super Mario Bros. y al final de la NES
    def melody(t, oct_=5, vel=0.085, duty=0.25):
        notes = motif(penta_g, oct_) + motif(penta_g, oct_, 2)
        rh = [0.5, 0.5, 1, 0.5, 1.5, 0.5, 0.5, 1, 0.5, 1.5]
        for n, r in zip(notes, rh):
            m.add(t, pulse(f(n), r * beat * 0.9, vel, duty=duty, vib=1 if r > 1 else 0), pan=0.05, verb=0.15)
            t += r * beat
    melody(cs("c4e") + 0.1)
    melody(ce("c4g") + 0.05)
    # Game Boy: el mismo motivo, timbre estrecho y mono
    melody(ce("c4i") - 0.3, oct_=5, vel=0.06, duty=0.5)
    # Super Nintendo: 16 bits — eco, cuerdas, bajo FM, en La mayor
    bpm2 = 120; beat2 = 60 / bpm2
    prog2 = [("A1", ["A3", "C#4", "E4", "B4"]), ("F#1", ["F#3", "A3", "C#4", "E4"]), ("D2", ["D4", "F#4", "A4", "C#5"]), ("E2", ["E3", "G#3", "B3", "D4"])]
    for bi, b in enumerate(bars(snes0 - 0.15, t1 + 0.5, bpm2)):
        root, chord = prog2[bi % 4]
        m.add(b, strings([f(x) for x in chord], 4 * beat2 + 0.5, a=0.25, r=0.8, vel=0.3), verb=0.5)
        for k in range(8):
            m.add(b + k * beat2 / 2, synth_bass(f(root) * (2 if k % 4 == 2 else 1), beat2 / 2 * 0.9, 0.5), verb=0.05)
        for k in range(4):
            m.add(b + k * beat2, kick(0.55) if k % 2 == 0 else snare(0.35, seed=bi + k), verb=0.25 if k % 2 else 0.05)
        for k in range(8):
            m.add(b + k * beat2 / 2, arp_synth(f(chord[k % 4]) * 2, beat2 / 2, 0.16), pan=-0.4 + 0.8 * (k % 2), verb=0.2, echo=0.35)
    m.add(snes0 - 0.15, bell(f("A5"), 3.0, 0.3), pan=0.2, verb=0.6, echo=0.4)

# =================================================================== CAP. 5 — GUERRA Y 3D 1991-2002
def ch5():
    c = CH["ch5"]; t0, t1 = c["start"], c["end"]; bpm = 92; beat = 60 / bpm; s16 = beat / 4
    prog = [("E1", ["E3", "G3", "B3"]), ("C2", ["C3", "E3", "G3"]), ("D2", ["D3", "F#3", "A3"]), ("B1", ["B2", "D3", "F#3"])]
    n64, lose, poke, gba, end = cs("c5c"), cs("c5e"), cs("c5f"), cs("c5i"), cs("c5j")
    for bi, b in enumerate(bars(t0 + 0.3, poke - 0.1, bpm)):
        root, chord = prog[bi % 4]
        dark = b >= lose - 0.2
        m.add(b, strings([f(x) for x in chord], 4 * beat + 0.6, a=0.4, r=1.0, vel=0.26 if not dark else 0.18, cutoff=2600), verb=0.45)
        for k in range(8):
            m.add(b + k * beat / 2, synth_bass(f(root) * (2 if k in (3, 7) else 1), beat / 2 * 0.85, 0.5, cutoff=700))
        if not dark:
            # ritmo «breakbeat» de los 90
            for pos, kind in [(0, "k"), (1, "s"), (1.75, "k"), (2.5, "k"), (3, "s")]:
                m.add(b + pos * beat, kick(0.6) if kind == "k" else snare(0.42, seed=bi), verb=0.08 if kind == "k" else 0.3)
            for k in range(8):
                m.add(b + k * beat / 2, hat(0.12 if k % 2 else 0.18, seed=k + bi), pan=0.3)
            # cuerdas en staccato: tensión de rivalidad
            if b < n64:
                for k in (0, 0.75, 1.5, 2.5):
                    m.add(b + k * beat, strings([f(chord[0]) * 2, f(chord[2]) * 2], beat * 0.3, a=0.01, r=0.1, vel=0.22), pan=0.4, verb=0.3)
        if n64 - 0.2 <= b < lose:
            # 3D: arpegio que gira en el espacio estéreo
            for k in range(16):
                n = chord[k % 3]
                m.add(b + k * s16, arp_synth(f(n) * 4, s16 * 1.4, 0.13), pan=np.sin(k / 16 * 2 * np.pi) * 0.7, verb=0.3, echo=0.25)
    m.add(n64 - 0.1, saw_pad([f("E3"), f("B3"), f("E4"), f("G#4")], 5.0, a=0.05, r=3.0, cutoff=4500, vel=0.3), verb=0.7)
    # Pokémon: brillo inesperado, Sol mayor, campanas y palmas
    bpm2 = 120; beat2 = 60 / bpm2
    prog2 = [("G2", ["G4", "B4", "D5"]), ("D2", ["F#4", "A4", "D5"]), ("E2", ["E4", "G4", "B4"]), ("C2", ["E4", "G4", "C5"])]
    penta_g = ["G", "A", "B", "D", "E"]
    for bi, b in enumerate(bars(poke, end + 1.5, bpm2)):
        root, chord = prog2[bi % 4]
        quiet = b < cs("c5g") - 0.1
        for k in range(8):
            m.add(b + k * beat2 / 2, marimba(f(chord[k % 3]), 0.6, 0.4 if not quiet else 0.25), pan=-0.3 + 0.6 * ((k * 3) % 4) / 3, verb=0.25)
        if quiet: continue
        for k in range(4):
            m.add(b + k * beat2, pluck_bass(f(root), 0.45, 0.7))
            if k % 2: m.add(b + k * beat2, clap(0.32, seed=bi + k), verb=0.3)
            else: m.add(b + k * beat2, kick(0.45))
        m.add(b, saw_pad([f(x) for x in chord], 4 * beat2 + 0.3, a=0.2, r=0.6, cutoff=2500, vel=0.16), verb=0.4)
    for t in [cs("c5g") + 0.0, ce("c5h") + 0.1]:
        for k, n in enumerate(motif(penta_g, 5)):
            m.add(t + k * beat2 * 0.5, bell(f(n), 1.5, 0.22, ratio=2.0, index=2.0, decay=0.5), pan=0.25, verb=0.4, echo=0.3)
    # GBA y GameCube, y la conclusión: acorde suspendido sin resolver
    m.add(end - 0.2, saw_pad([f("C3"), f("G3"), f("D4"), f("G4")], t1 - end + 2.5, a=0.6, r=2.5, cutoff=2400, vel=0.3), verb=0.7)

# =================================================================== CAP. 6 — DS, WII, WII U, IWATA
def ch6():
    c = CH["ch6"]; t0, t1 = c["start"], c["end"]
    bpm = 112; beat = 60 / bpm
    quote0, quote1 = cs("c6b"), ce("c6c")
    up0, down0, loss0, hope0 = cs("c6d"), cs("c6i"), cs("c6k"), cs("c6l")
    # Iwata: piano y pad
    pno = [("A2", ["A3", "C#4", "E4"]), ("F#2", ["F#3", "A3", "C#4"]), ("D2", ["D3", "F#3", "A3"]), ("E2", ["E3", "G#3", "B3"])]
    slow = 60 / 76
    for bi, b in enumerate(bars(t0 + 0.2, up0 - 0.2, 76)):
        root, chord = pno[bi % 4]
        m.add(b, piano(f(root), 4.0, 0.55), pan=-0.1, verb=0.45)
        for k, n in enumerate(chord + [chord[1]]):
            m.add(b + (k + 1) * slow, piano(f(n) * 2, 2.5, 0.38), pan=0.1, verb=0.45)
        m.add(b, saw_pad([f(x) for x in chord], 4 * slow + 0.8, a=1.0, r=1.5, cutoff=1500, vel=0.15), verb=0.6)
    # DS / Wii: optimismo, marimba y palmas
    prog = [("A1", ["A4", "C#5", "E5"]), ("E2", ["G#4", "B4", "E5"]), ("F#2", ["F#4", "A4", "C#5"]), ("D2", ["F#4", "A4", "D5"])]
    for bi, b in enumerate(bars(up0, down0 - 0.2, bpm)):
        root, chord = prog[bi % 4]
        for k in range(8):
            if k in (0, 3, 6) or (bi % 2 and k == 7):
                m.add(b + k * beat / 2, marimba(f(chord[(k // 2) % 3]), 0.7, 0.42), pan=-0.25, verb=0.25)
        for k in range(4):
            m.add(b + k * beat, kick(0.42) if k % 2 == 0 else clap(0.3, seed=k + bi), verb=0.06 if k % 2 == 0 else 0.3)
            m.add(b + k * beat + beat / 2, hat(0.1, seed=k), pan=0.35)
            m.add(b + k * beat, pluck_bass(f(root) * (1 if k % 2 == 0 else 2), 0.5, 0.65))
        m.add(b, saw_pad([f(x) / 2 for x in chord], 4 * beat + 0.3, a=0.3, r=0.6, cutoff=2200, vel=0.14), verb=0.4)
    # silbido alegre: leitmotiv en La mayor pentatónico (Wii)
    penta_a = ["A", "B", "C#", "E", "F#"]
    for t in [cs("c6g") + 0.2, ce("c6h") - 0.2]:
        for k, n in enumerate(motif(penta_a, 5)):
            m.add(t + k * beat * 0.5, flute(f(n), beat * (0.6 if k < 4 else 1.4), 0.25, scoop=0.3, vib=0.6), pan=0.3, verb=0.4)
    # 3DS / Wii U: se apaga, tinte menor
    for bi, b in enumerate(bars(down0 - 0.1, loss0 - 0.2, 76)):
        chord = [["F#3", "A3", "C#4"], ["D3", "F#3", "A3"], ["B2", "D3", "F#3"], ["C#3", "E#3", "G#3"]][bi % 4]
        m.add(b, saw_pad([f(x) for x in chord], 4 * slow + 0.6, a=0.6, r=1.2, cutoff=1300, vel=0.18), verb=0.6)
        m.add(b, piano(f(chord[0]) / 2, 3.0, 0.4), verb=0.5)
    # Iwata: piano solo, el motivo despacio, mucha sala
    t = loss0 + 0.3
    for k, n in enumerate(motif(penta_a, 4)):
        m.add(t, piano(f(n), 4.0, 0.42), verb=0.8); t += 1.05
    # una idea en el aire: pad que se abre
    m.add(hope0 - 0.4, saw_pad([f("D3"), f("A3"), f("E4"), f("F#4")], t1 - hope0 + 2.4, a=2.5, r=1.6, cutoff=2000, vel=0.24), verb=0.7)

# =================================================================== CAP. 7 — SWITCH Y SWITCH 2
def ch7():
    c = CH["ch7"]; t0, t1 = c["start"], c["end"]; bpm = 120; beat = 60 / bpm; s16 = beat / 4
    prog = [("D2", ["D4", "F#4", "A4", "E5"]), ("B1", ["B3", "D4", "F#4", "A4"]), ("G1", ["G3", "B3", "D4", "F#4"]), ("A1", ["A3", "C#4", "E4", "G4"])]
    sw1, botw, full, sw2, end = cs("c7a") + 2.0, cs("c7c"), cs("c7d"), cs("c7g") - 0.05, ce("c7i")
    for bi, b in enumerate(bars(t0 + 0.4, t1 + 0.2, bpm)):
        root, chord = prog[bi % 4]
        calm = botw - 0.2 <= b < full - 0.2
        big = b >= sw2 - 0.05
        outro = b >= end - 0.3
        m.add(b, strings([f(x) for x in chord], 4 * beat + 0.5, a=0.5 if not calm else 1.0, r=1.0, vel=0.25 if not big else 0.34), verb=0.5)
        if outro: continue
        if calm:
            for k, n in enumerate([chord[0], chord[2], chord[3]]):
                m.add(b + k * beat * 1.3, piano(f(n) * 2, 3.0, 0.4), pan=0.15, verb=0.6)
            m.add(b, synth_bass(f(root), 4 * beat * 0.95, 0.3, cutoff=300))
            continue
        if b < sw1 - 0.1: continue
        for k in range(16):  # arpegio pulsante de 16 notas
            n = chord[[0, 1, 2, 3, 2, 1, 2, 3][k % 8]]
            m.add(b + k * s16, arp_synth(f(n) * 2, s16 * 0.9, 0.12 if not big else 0.15, cutoff=4200), pan=-0.3 + 0.6 * (k % 2), verb=0.15, echo=0.2)
        for k in range(8):
            m.add(b + k * beat / 2, synth_bass(f(root) * (2 if k % 2 else 1), beat / 2 * 0.9, 0.5, cutoff=800))
        for k in range(4):
            m.add(b + k * beat, kick(0.62), verb=0.05)
            if k % 2: m.add(b + k * beat, snare(0.38, seed=bi * 4 + k), verb=0.35)
            m.add(b + k * beat + beat / 2, hat(0.11, seed=k), pan=0.3)
        if big:
            m.add(b, choir([f(x) for x in chord[:3]], 4 * beat + 0.5, a=0.4, r=1.0, vel=0.2), verb=0.7)
            m.add(b + 3.5 * beat, tom(110, 0.45), verb=0.4); m.add(b + 3.75 * beat, tom(85, 0.5), verb=0.4)
    # Switch: golpe de presentación
    m.add(sw1 - 0.1, saw_pad([f("D3"), f("A3"), f("D4"), f("F#4")], 3.0, a=0.02, r=2.2, cutoff=3800, vel=0.35), verb=0.6)
    m.add(sw1 - 0.1, taiko(0.8, 60), verb=0.4)
    # silencio y subida antes de Switch 2
    pre = sw2 - 1.6
    m.add(pre, saw_pad([f("A2"), f("E3"), f("A3")], 1.6, a=1.4, r=0.1, cutoff=5000, vel=0.25), verb=0.3)
    m.add(sw2, taiko(1.0, 52), verb=0.5); m.add(sw2, kick(0.9))
    m.add(sw2, saw_pad([f("D2"), f("D3"), f("A3"), f("D4"), f("F#4"), f("A4")], 4.0, a=0.01, r=3.0, cutoff=5000, vel=0.42), verb=0.8)
    # leitmotiv heroico en Re mayor sobre Switch 2
    penta_d = ["D", "E", "F#", "A", "B"]
    t = sw2 + 2 * beat
    for k, n in enumerate(motif(penta_d, 5)):
        d = [1, 1, 1.5, 0.5, 3][k] * beat
        m.add(t, saw_pad([f(n)], d + 0.3, a=0.03, r=0.3, cutoff=4500, voices=3, vel=0.32), pan=0.0, verb=0.5); t += d

# =================================================================== CAP. 8 — LEGADO + CRÉDITOS
def ch8():
    c = CH["ch8"]; t0, t1 = c["start"], c["end"]
    bpm = 66; beat = 60 / bpm
    prog = [("D2", ["D3", "F#3", "A3"]), ("C#2", ["E3", "A3", "C#4"]), ("B1", ["D3", "F#3", "B3"]), ("G1", ["D3", "G3", "B3"]),
            ("F#1", ["D3", "F#3", "A3"]), ("E2", ["E3", "G3", "B3"]), ("A1", ["E3", "A3", "C#4"]), ("D2", ["D3", "F#3", "A3"])]
    jug = cs("c8f")
    penta_d = ["D", "E", "F#", "A", "B"]
    for bi, b in enumerate(bars(t0 + 0.2, jug - 0.6, bpm)):
        root, chord = prog[bi % 8]
        m.add(b, piano(f(root), 4.5, 0.5), verb=0.5)
        for k, n in enumerate([chord[0], chord[1], chord[2], chord[1]]):
            m.add(b + k * beat, piano(f(n) * 2, 3.0, 0.33), pan=0.1, verb=0.5)
        m.add(b, strings([f(x) for x in chord], 4 * beat + 0.8, a=1.0, r=1.5, vel=0.2 + 0.02 * min(bi, 6)), verb=0.6)
    # el koto vuelve: el leitmotiv, ahora en mayor (el círculo se cierra)
    for t in [t0 + 0.4, cs("c8d") - 0.2]:
        for k, n in enumerate(motif(penta_d, 4)):
            m.add(t + k * beat * 0.5, koto(f(n), 3.0, 0.42), pan=-0.3, verb=0.6)
    # «¿Jugamos?»: todo se detiene, una sola carta
    m.add(jug - 0.05, koto(f("A4"), 4.0, 0.55), verb=0.8)
    # gran acorde final
    fin = cs("c8g") - 0.1
    m.add(fin, strings([f("D3"), f("A3"), f("D4"), f("F#4"), f("A4")], t1 - fin + 3.0, a=1.6, r=3.0, vel=0.36), verb=0.7)
    m.add(fin, piano(f("D2"), 6.0, 0.6), verb=0.6)
    m.add(fin, taiko(0.55, 55), verb=0.5)
    for k, n in enumerate(motif(penta_d, 5)):
        m.add(fin + 0.6 + k * 0.48, piano(f(n), 3.5, 0.4), pan=0.15, verb=0.6)
    # créditos: koto y pad, se desvanece
    cr = CH["credits"]["start"]
    m.add(cr, saw_pad([f("D3"), f("A3"), f("E4"), f("F#4")], CH["credits"]["end"] - cr + 1.0, a=1.5, r=6.0, cutoff=1800, vel=0.24), verb=0.7)
    for bi, b in enumerate(bars(cr + 0.5, CH["credits"]["end"] - 4, 72)):
        p = [["D4", "A4", "E5", "F#5"], ["B3", "F#4", "D5", "E5"], ["G3", "D4", "B4", "D5"], ["A3", "E4", "C#5", "E5"]][bi % 4]
        for k, n in enumerate(p):
            m.add(b + k * 60 / 72, koto(f(n), 3.0, 0.32), pan=-0.3 + 0.2 * k, verb=0.6)

for fn in (hook, ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8):
    fn(); print("compuesto", fn.__name__)

L, R = m.render()
n = int(TOTAL * SR); L, R = L[:n], R[:n]
# fundido final
fo = int(4.0 * SR); L[-fo:] *= np.linspace(1, 0, fo) ** 2; R[-fo:] *= np.linspace(1, 0, fo) ** 2

# ---- ducking bajo la voz (envolvente de la narración)
v, vsr = sf.read(os.path.join(ROOT, "assets/voice/narracion.wav"))
v = np.abs(v[:n] if v.ndim == 1 else v[:n].mean(1))
if len(v) < n: v = np.pad(v, (0, n - len(v)))
blk = 480; vb = v[: len(v) // blk * blk].reshape(-1, blk).mean(1)
act = (vb > 0.01).astype(float)
att, rel = 0.25, 0.04   # coeficientes por bloque de 10 ms (ataque rápido, relajación lenta)
sm = np.zeros_like(act); s = 0.0
look = 8  # anticipa la voz 80 ms
act = np.concatenate([act[look:], np.zeros(look)])
for i, a in enumerate(act):
    s += (att if a > s else rel) * (a - s); sm[i] = s
duck_db = -7.5 * sm
g = 10 ** (duck_db / 20)
g = np.repeat(g, blk); g = np.pad(g, (0, max(0, n - len(g))), constant_values=1)[:n]
L *= g; R *= g

# ---- nivel por capítulo: la música queda ~12 dB bajo la voz y crece en los silencios
def kw(x): return hp(x, 60) + 0.6 * hp(x, 2000)
def lufs(x): return -0.691 + 10 * np.log10(np.mean(kw(x) ** 2) + 1e-12)
vact = np.repeat(sm > 0.5, blk); vact = np.pad(vact, (0, max(0, n - len(vact))))[:n]
mono = (L + R) / 2
vraw, _ = sf.read(os.path.join(ROOT, "assets/voice/narracion.wav"))
vraw = vraw[:n] if vraw.ndim == 1 else vraw[:n].mean(1)
vraw = np.pad(vraw, (0, max(0, n - len(vraw))))
vlufs = lufs(vraw[vact])
gains = []
for c in T["chapters"]:
    a, b = int(c["start"] * SR), int(c["end"] * SR)
    seg = vact[a:b]
    if seg.mean() > 0.2:
        cur = lufs(mono[a:b][seg]); tgt = vlufs - 14.0
    else:
        cur = lufs(mono[a:b]); tgt = vlufs - 6.0
    gains.append((c["start"], c["end"], 10 ** ((tgt - cur) / 20)))
    print(f"  {c['id']:8s} {cur:6.1f} -> {tgt:6.1f}")
gc = np.ones(n); xf = int(1.5 * SR)
for i, (a, b, g_) in enumerate(gains):
    ia, ib = int(a * SR), int(b * SR); gc[ia:ib] = g_
for i in range(1, len(gains)):
    ib = int(gains[i][0] * SR); g0, g1 = gains[i - 1][2], gains[i][2]
    lo_, hi_ = max(0, ib - xf // 2), min(n, ib + xf // 2)
    gc[lo_:hi_] = np.linspace(g0, g1, hi_ - lo_)
L *= gc; R *= gc
st = np.stack([L, R], 1)
st = hp(st.T, 30).T
# limitador suave: solo actúa por encima de 0.8
a_ = np.abs(st); over = a_ > 0.8
st[over] = np.sign(st[over]) * (0.8 + 0.15 * np.tanh((a_[over] - 0.8) / 0.15))
print("peak", np.abs(st).max())
os.makedirs(os.path.join(ROOT, "assets/music"), exist_ok=True)
sf.write(os.path.join(ROOT, "assets/music/banda_sonora.wav"), st.astype(np.float32), SR, subtype="PCM_16")
print("ok", st.shape[0] / SR, "s")
