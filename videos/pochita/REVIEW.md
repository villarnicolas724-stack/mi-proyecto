# REVIEW — "¿Quién es Pochita?" (v2, narrado)

Render: `pochita.mp4` · 1920×1080 · 30 fps · 42.3 s · H.264 + AAC · 9.5 MB

## Cambios en v2

- Voz en off que dice el texto en pantalla: Kokoro "Dora" (`ef_dora`), local y gratis, a 1.12× para que suene más animada.
  Elegida por la persona frente a HeyGen. Guion en `assets/voice/guion.tsv`; una pista `.wav` por línea en `assets/voice/`.
- La voz es el reloj: cada palabra o sello entra cuando la voz la dice (tiempos medidos con whisper `--word_timestamps`).
- "¡BRRRUM!" pasa al final del gancho (3.95 s), justo antes del corte de motosierra.
- El sello "DEUDA" cae con la palabra "deuda"; Pochita llega al pecho con "corazón"; "CHAINSAW" y "MAN" con sus palabras.
- Escenas 5 y 6 duran 0.5 s más cada una (total 42.3 s).
- Efectos bajados ~3 dB para que no tapen la voz.

## Qué se midió y qué solo se miró

- `hyperframes check`: OK, 0 errores.
- Audio medido, **no escuchado**: -13.5 LUFS integrado, pico real -1.1 dBTP, sin clipping. Cada línea de voz normalizada a ~-16 LUFS.
- Transcripción del render final con whisper `small`: las 17 líneas aparecen en orden y en su sitio (0.0 s → 41.0 s).
- Hojas de contacto de los momentos retemporizados, revisadas a ojo.

## Puntos débiles

- Pronunciación de "Denji": Kokoro lee en español; se escribió "Dendyi" para acercarse. Whisper la oye como "Dengi/Tendri".
  Si suena rara, alternativas: "Dench", "Dénchi", o grabar tu propia línea (`media-use` acepta tu grabación).
- Kokoro solo tiene una voz en español (femenina) y su entonación es menos expresiva que una voz de HeyGen.
- 10.9 s, Pochita herido: se lee "tumbado" más que "herido".

## Avisos que se quedan a propósito

- `duplicate_media_discovery_risk`: las dos hojas del clímax usan el mismo SVG; se ven bien en el render.
- `text_occluded` (info) en el sello "DEUDA": la hoja de motosierra lo tapa a propósito al cortarlo.
- `#hook-lines` con `data-layout-allow-occlusion`: falso positivo por la rotación de "¡BRRRUM!".
