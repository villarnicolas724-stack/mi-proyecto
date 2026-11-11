# REVIEW — "¿Quién es Pochita?" (v1)

Render: `pochita.mp4` · 1920×1080 · 30 fps · 41.3 s · H.264 + AAC · 8.5 MB

## Decisiones creativas

- Storyline A "El corazón de Denji" (ver `STORYLINES.md`); no construidas: B "El expediente de Seguridad Pública" y C "Lo que Pochita borra".
- Look de página de manga: papel #F7F7F4, tinta #121212, screentone, un solo acento naranja #FF6A13.
- Pochita es una silueta propia y minimalista (no arte oficial): cuerpo naranja, motosierra en la frente, patas cortas y cola.
- Transiciones: corte de motosierra (4.6 s), cambio por desenfoque (10.6 s y 36.3 s), inundación de tinta (17.2 s), corte por coincidencia + inundación naranja (25.2 s → 27.2 s), barrido (30.4 s).
- Sin música: no hay fuente de música disponible (sin cuenta HeyGen ni modelo local). Solo efectos en acciones visibles.

## Qué se midió y qué solo se miró

- `hyperframes check`: 0 errores. Quedan 1 aviso y 2 notas (abajo).
- Audio medido, **no escuchado**: -13.9 LUFS integrado, pico real -1.0 dBTP, sin clipping; los golpes caen en 4.7 s (corte), 12.0 s (gota), 15.6 s (corte de la deuda), 17.5 s (muerte), 27.4 s (CHAINSAW MAN).
- Hojas de contacto por escena, por corte y a ancho de teléfono (360 px), revisadas a ojo.

## Plano más débil

- 10.9 s, Pochita herido: girado 90° se lee como "tumbado", pero no tanto como "herido". Con más tiempo: una versión con ojos en X o una venda.
- La escena final deja bastante papel vacío arriba a la izquierda.

## Avisos que se quedan a propósito

- `duplicate_media_discovery_risk`: las dos hojas del clímax usan el mismo SVG; se ven bien en el render.
- `text_occluded` (info) en el sello "DEUDA": la hoja de motosierra lo tapa a propósito al cortarlo.
- `#hook-lines` marcado `data-layout-allow-occlusion`: el detector confundía la rotación de "¡BRRRUM!" con texto tapado por las líneas de velocidad; en el fotograma se lee completo.
