# SPEC — «Nintendo: de las cartas a las consolas»

GOAL:   Al terminar, el espectador entiende por qué una fábrica de cartas de 1889 acabó definiendo el videojuego, y siente nostalgia y curiosidad.
OUTPUT: HyperFrames, 1920 × 1080, 30 fps, MP4 H.264 + AAC; subtítulos quemados + SRT/VTT aparte.
TIME:   532,9 s × 30 = 15 987 fotogramas. La voz es el reloj (production/timing.json: 80 frases).

## LOOK por capítulo (cada uno un medio, no una paleta)
| Escena | Medio | Fondo | Tinta | Acento (1 por plano) | Tipo |
|---|---|---|---|---|---|
| Gancho, Cap. 1, Cap. 8 | Tinta sumi sobre washi, pigmento plano | #EDE3CF + fibra 4 % | #1B1714 | bermellón #C23B22 | Yuji Syuku (kanji), Shippori Mincho 700 |
| Cap. 2 | Impresión offset años 60: tramas de semitono, 2 tintas desplazadas 3 px | mostaza #E8B23A / verde azulado #1F5F5B | #1E1A17 | rojo #D9452B | League Gothic, Archivo Black |
| Cap. 3 | Fósforo CRT: líneas de barrido 3 px al 18 %, viñeta 30 % | #07060B (es la pantalla, no un vacío) | #F2F2F2 | rojo #FF3B3B / cian #3BE3FF | Press Start 2P |
| Cap. 4 | Píxel 8 bits (rejilla de 8 px) + plástico gris de consola en 3D | #6888FC cielo / #D8D6D0 estudio | #2A2A2E | rojo #C8102E | Press Start 2P, Archivo Black |
| Cap. 5 | Polígono plano low-poly, sin texturas | #1E1E24 → suelo de rejilla | #F4F4F4 | rojo #E4002B, amarillo #FFC72C | Archivo Black |
| Cap. 6 | Plástico blanco brillante, sombras suaves 0 24 60 rgba(0,0,0,.12) | #F5F7F8 | #2B2F33 | azul #00A2E8 | Nunito 800 |
| Cap. 7 | Campos de color planos modernos | grafito #17181C con campos #FF3C28 / #0AB9E6 | #FFFFFF | el campo de color mismo | Montserrat 800/900 |
| Créditos | washi | #EDE3CF | #1B1714 | — | Shippori Mincho |

Luz 3D: clave cálida arriba-izquierda (#FFE8CC, 2.2), contraluz frío (#9FC7FF, 1.4), hemisférica 0.5, sombra de contacto 0.45. Rugosidad ≥ 0.4.

## OBJECTS (dibujados para que se reconozcan sin rótulo)
- Carta hanafuda: 0,6 de proporción, borde negro 6 px, pigmento plano rojo/verde/negro, papel con grano.
- Kioto: pagoda de cinco pisos, tejados de machiya, farolillos, montañas de Higashiyama en capas de tinta.
- Consolas 3D (assets/lib/consoles.js): Famicom, NES, Game Boy, Super Famicom, N64, GameCube, GBA, DS, Wii, Wii U, Switch, Switch 2 — volúmenes reales simplificados, a escala relativa.
- Ultra Hand: tijera extensible de rombos blanca, pinzas naranjas.
- Recreativa: mueble con marquesina iluminada, pantalla CRT curva, palanca.

## MOTION
- Entradas: expo.out 0,6–0,9 s; cámara: power2.inOut 1,2–4 s; salidas: power3.in 0,3–0,4 s (40–50 % de la entrada).
- Textos: por palabra con blur 6→0 px en 0,13 s, 0,07 s de separación; nombres por letra 0,05 s; una vez asentados, quietos.
- Contadores: 1,4 s power2.out y se quedan quietos.
- Transiciones (5 tipos con causa): carta-que-se-convierte-en-mundo (inicio de cada capítulo), zoom a través de pantalla, barrido de píxeles (Cap. 3–4), inundación de color (Cap. 6–7), corte con oscurecimiento (dentro de capítulos).
- Algo nuevo cada 2–4 s; un movimiento protagonista por plano.

## SHOTS
Ver production/shots.md (plano por plano con tiempos absolutos, generado a partir de timing.json).

## BANNED
Vacío oscuro con elementos pequeños flotando; brillos/bloom/partículas decorativas; degradados morados; tres tarjetas en fila; todo centrado y apareciendo a la vez; texto que se mueve mientras se lee; logotipos de Nintendo o de terceros; personajes con copyright dibujados (Mario, Donkey Kong, Pokémon, Mickey): se evocan con siluetas genéricas y texto; melodías existentes.

## QA
Fotograma 0 con la carta visible; cada título de capítulo; Donkey Kong 1981 (~159 s); Super Mario Bros. (~202 s); comparativa Wii U (~371 s); revelación Switch 2 (~441 s); «¿Jugamos?» (~501 s); créditos legibles a 360 px.
