# Paquete de entrega — «Nintendo: de las cartas a las consolas»

| Archivo | Qué es |
|---|---|
| `renders/nintendo_documental_1080p.mp4` | Documental terminado: 1920×1080, 30 fps, H.264 + AAC, subtítulos en español incrustados, 8 min 55 s, audio estéreo a −16 LUFS |
| `deliverables/subtitulos_es.srt` / `.vtt` | Subtítulos aparte (para YouTube o reproductores) |
| `deliverables/GUION.md` | Guion completo de la narración |
| `deliverables/STORYBOARD.md` | Storyboard plano a plano con tiempos exactos, animación, música y transiciones |
| `RESEARCH.md` | Documentación histórica: cada dato con su fuente y si es un hecho o una interpretación |
| `SPEC.md`, `STORYLINES.md`, `REVIEW.md` | Dirección de arte, alternativas y notas de revisión |
| `assets/voice/narracion.wav`, `assets/music/banda_sonora.wav`, `assets/sfx/efectos.wav` | Pistas separadas de voz, música y efectos |

## Cómo está hecho
- **Escenas:** HTML + GSAP + three.js renderizadas con HyperFrames (`compositions/` se genera desde `src/` con `production/build_scenes.py`).
- **Voz:** `production/guion.py` (texto en pantalla + texto fonético) → `production/build_voice.py` (Kokoro local, voz `em_alex`). Cada frase es un clip, así que los subtítulos y las animaciones quedan sincronizados por construcción.
- **Música:** `production/build_music.py` + `production/synth.py`: composición original por capítulos, ajustada a los tiempos de la voz, con ducking automático.
- **Efectos:** `production/build_sfx.py`: efectos sintetizados y algunos de Pixabay (licencia Pixabay).

## Regenerar todo
```bash
/opt/kvenv/bin/python production/build_voice.py
```
```bash
/opt/kvenv/bin/python production/build_music.py
```
```bash
/opt/kvenv/bin/python production/build_sfx.py
```
```bash
python3 production/build_scenes.py
```
```bash
./production/render_chunks.sh   # render por tramos reanudable + mezcla de audio
```
```bash
./production/master.sh          # normaliza el audio y genera renders/nintendo_documental_1080p.mp4
```

## Cambiar la voz por la de un locutor
Graba cada frase de `production/guion.py` (o la narración entera) y sustituye `assets/voice/narracion.wav`. Si cambian los tiempos, ajusta los huecos (`gap`) del guion y vuelve a ejecutar los pasos de arriba.
