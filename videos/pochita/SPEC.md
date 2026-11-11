# SPEC — "¿Quién es Pochita?"

GOAL:    al terminar, el espectador sabe que Pochita es el Demonio Motosierra y que vive dentro de Denji como su corazón.
OUTPUT:  HyperFrames, 1920 x 1080, 30 fps
TIME:    42.3 s x 30 = 1269 frames. Narrado: la voz es el reloj; cada texto entra con la palabra que lo dice.
VOICE:   Kokoro "Dora" (ef_dora) local, 1.12x, -16 LUFS por línea; guion en assets/voice/guion.tsv
         ("Dendyi", "Fuyimoto" y "espóiler" son grafías fonéticas solo para la voz).

LOOK (medio: página de manga impresa):
  - papel: #F7F7F4 liso, sin degradados
  - tinta: #121212 — todo texto legible, bordes de viñeta de 8 px, líneas de velocidad
  - trama (screentone): puntos de tinta de 2 px cada 12 px, solo para sombra
  - acento: naranja Pochita #FF6A13 — solo Pochita, el cordón, una palabra por escena y la inundación del clímax
  - display: Archivo Black, mayúsculas, 84–260 px, tracking -1%
  - texto secundario: Inter 900 / 700, 38–64 px
  - sin sombras, sin brillo, sin grano

OBJETOS: Pochita (cuerpo naranja redondo, 4 patas cortas, cola, motosierra gris con dientes en la frente, contorno 12 px);
  hoja de motosierra horizontal con dientes; torso de Denji como contorno blanco de 8 px; cordón naranja con mango en T.

MOTION:
  - llegadas: expo.out / power4.out; cortes y salidas: power3.in; cámara/inundaciones: power2.inOut
  - sellos: escala 1.3 → 1 en 0.25 s expo.out, sin fundido
  - palabras: blur 6 px → 0 en 0.13 s, 0.067 s entre palabras
  - resorte de Pochita: back.out(1.6) en posición/rotación, nunca en opacidad

SHOTS:
  1. 0.0–5.0   gancho: Pochita sobre líneas de velocidad; "¿QUIÉN ES / POCHITA?" sellado; "¡BRRRUM!" al acelerar (1.6 s).
  2. 4.6–10.6  corte de motosierra (hoja diagonal) → "ES EL DEMONIO MOTOSIERRA"; etiquetas con línea guía a la motosierra y al cuerpo.
  3. 10.6–17.6 cambio por desenfoque → Pochita herido, cae una gota de sangre, revive; sello "DEUDA" que la motosierra corta.
  4. 17.2–25.2 inundación de tinta → la yakuza mata a Denji; Pochita entra en su pecho y se vuelve su corazón; sale el cordón; «Muéstrame tus sueños».
  5. 25.2–31.2 corte por coincidencia → tira del cordón → inundación naranja + líneas de velocidad → "CHAINSAW MAN" (impacto, única vez).
  6. 30.9–37.3 barrido → "ALERTA DE SPOILER" → "HÉROE DEL INFIERNO" con Pochita en tinta; "DEMONIO" cortado y borrado letra por letra.
  7. 37.3–42.3 cambio por desenfoque → "Pochita no es la mascota de Denji" → "Es su corazón" (se sostiene 2.4 s).

BANNED: fondo negro vacío con cosas flotando (el negro solo en la escena 4, y lleno); brillo, partículas, degradados morados;
  papel crema + serif + etiquetas mono; todo deslizándose hacia arriba; tres tarjetas en fila; logo en una esquina;
  títulos que se mueven después de aterrizar; dibujar arte oficial copiado.

QA: 0.0 (miniatura no vacía), 2.0, 4.8 (corte), 7.5, 12.2, 15.6, 18.5, 21.5, 23.5, 26.9, 28.5, 31.0, 33.9, 38.5.
