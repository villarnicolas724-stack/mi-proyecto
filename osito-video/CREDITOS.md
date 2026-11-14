# Créditos — "El pequeño osito que devolvió la luz"

- Animación, personajes y escenarios: dibujados en código (SVG + GSAP) con HyperFrames.
- Narración: voz sintética local Kokoro-82M (voz `ef_dora`, español).
- Música: "Frost Waltz" de Kevin MacLeod (incompetech.com), licencia CC BY 3.0 —
  https://creativecommons.org/licenses/by/3.0/ — fuente: https://commons.wikimedia.org/w/index.php?curid=64745272
- Efectos de sonido: banco incluido en earshot.

Para regenerar: `node build/build.mjs` (escenas), `python3 build/mix.py` (audio), `npx hyperframes render --fps 24`.
