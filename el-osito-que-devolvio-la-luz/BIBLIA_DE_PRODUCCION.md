# EL PEQUEÑO OSITO QUE DEVOLVIÓ LA LUZ
### Biblia de producción · Cortometraje de animación 3D infantil · 60 s exactos

| Dato | Valor |
|---|---|
| Duración | **60,00 s** = 1440 fotogramas a 24 fps (o 1800 a 30 fps) |
| Formato | 16:9 horizontal · 1920×1080 (máster) · opcional reescalado a 3840×2160 |
| Fotogramas | **24 fps** recomendado (aspecto "cine de animación") |
| Público | Infantil 3–8 años |
| Idioma | Español de España (narrador) |
| Planos | 15 planos en 6 escenas |
| Herramienta principal | Adobe Firefly (imagen, vídeo, audio) + editor de vídeo de Firefly / Premiere Pro / Adobe Express |

> **Nota de transparencia.** En esta sesión Claude tiene conectado un servidor de Adobe, pero **solo expone herramientas de edición y búsqueda** (ajustes, máscaras, efectos, tableros, exportación), **no la generación de imagen, vídeo ni audio de Firefly**. Por tanto **no se ha generado ningún plano ni sonido**: este documento contiene los prompts listos para pegar y el procedimiento exacto para ejecutarlos en Firefly. Los nombres de funciones de Firefly cambian con frecuencia; si alguna opción no aparece en tu plan, se indica una alternativa.

---

## 0. Índice

1. Concepto y tono
2. Biblia de personajes (con prompts de hoja de personaje)
3. Biblia de escenarios y paleta
4. Prompt maestro de estilo (bloque fijo para TODOS los prompts)
5. Guion técnico plano a plano (15 planos con prompts de imagen y vídeo)
6. Narración, música y sonido
7. Flujo de trabajo en Adobe Firefly paso a paso
8. Montaje, transiciones, VFX y etalonaje
9. Control de calidad y coherencia
10. Checklist de entrega

---

## 1. Concepto y tono

**Logline:** Cuando las estrellas desaparecen del cielo de un mundo hecho de peluches, un pequeño osito llamado Nubi y dos nuevos amigos descubren que, trabajando juntos, pueden devolver la luz.

**Tono:** ternura, asombro, calma. Nada da miedo: la "oscuridad" es un azul lavanda profundo, nunca negro. Los obstáculos son suaves y divertidos.

**Arco emocional (curva de luz = curva emocional):**

| Tiempo | Emoción | Luz |
|---|---|---|
| 0–8 s | Maravilla | Atardecer dorado-rosado |
| 8–16 s | Preocupación | Se apaga a azul lavanda |
| 16–25 s | Esperanza | Farolillo cálido + luciérnagas |
| 25–37 s | Aventura | Bosque con luz de luna suave; destello amarillo al final |
| 37–49 s | Esfuerzo → triunfo | La estrella crece de 1× a 5× de brillo |
| 49–60 s | Alegría plena | Cielo estrellado + guirnaldas de luz en todo el mundo |

**Moraleja:** *La amistad, la cooperación y la bondad pueden iluminar incluso los momentos más oscuros.*

---

## 2. Biblia de personajes

Regla de oro: **cada personaje se describe SIEMPRE con la misma frase literal** (su "ADN de prompt"). Copiar y pegar, nunca reescribir.

### 2.1 NUBI — protagonista
- **ADN de prompt (pegar siempre igual):**
  `Nubi, a small cream-colored plush teddy bear made of soft fuzzy velvet, big round shiny dark-brown eyes with white sparkle highlights, small embroidered brown nose, rosy felt cheeks, round ears with light pink inner felt, short chubby limbs, wearing a small knitted sky-blue wool scarf with tiny white pom-poms at the ends`
- Altura: la mitad que el elefante; igual que la conejita (sin orejas).
- Personalidad: curioso, valiente a pesar de ser pequeño, muy dulce.
- Rasgo de animación: inclina la cabeza cuando piensa; la bufanda ondea con cada paso.
- Color: crema #F3E6CF · bufanda #8EC9EE · nariz #7A5235.

### 2.2 LILA — la conejita rosa
- **ADN:** `Lila, a small pastel-pink plush bunny made of soft minky fabric, very long floppy ears with white inner felt, big glossy black eyes with sparkles, tiny embroidered pink nose, round white cotton-ball tail, a small lavender felt flower clipped on one ear`
- Personalidad: alegre, rápida, saltarina; es la primera en ver la estrella.
- Rasgo de animación: las orejas reaccionan a cada emoción (arriba = alegría, caídas = pena).
- Color: rosa #F6C1D4 · flor #C9B6E8.

### 2.3 BRUNO — el elefante azul
- **ADN:** `Bruno, a chubby baby-blue plush elephant made of soft corduroy and velvet patches, big gentle round eyes with sparkles, large soft floppy ears, short curled trunk, visible cute hand-stitched seams, a small yellow star-shaped patch sewn on his belly`
- Personalidad: grande, tímido y amable; el más fuerte.
- Rasgo de animación: se mueve despacio, con peso; sopla con la trompa para apartar algodón.
- Color: azul #A9CDEB · parche #FBE38E.

### 2.4 LA ESTRELLA MÁGICA
- **ADN:** `a plush five-pointed star made of glowing golden-yellow satin and soft felt, rounded puffy points, a tiny sleepy embroidered smiling face, emitting warm soft golden light and floating sparkle particles`
- Estado A (atrapada): brillo débil, ojos cerrados.
- Estado B (liberada): abre los ojos, sonríe, brillo intenso.

### 2.5 Prompts de HOJA DE PERSONAJE (Firefly Image)
Genera estas imágenes primero. Serán tus **referencias** para todo el proyecto.

**Ajustes Firefly Image:** Relación de aspecto 16:9 · Tipo de contenido: *Arte* (o *Foto* si quieres más realismo de textura) · Modelo: el Firefly Image más reciente disponible · Efectos/Estilo: *3D render*, *Iluminación de estudio suave*.

**CH-01 · Nubi (hoja de modelo):**
```
Character turnaround model sheet of [ADN NUBI], shown in four poses side by side: front view, three-quarter view, side view, back view, neutral friendly expression, standing on a plain soft cream background, even soft studio lighting, high-end 3D animated feature film character design, ultra-detailed realistic velvet fur fibers and wool knit texture, pastel color palette, 8k render
```

**CH-02 · Nubi (expresiones):**
```
Expression sheet of [ADN NUBI], six head close-ups in a grid: happy smile, amazed wonder with open mouth, worried with raised eyebrows, determined, straining with effort, joyful laughing with closed eyes, plain pastel cream background, soft studio lighting, high-end 3D animated feature film style, realistic plush fabric textures
```

**CH-03 · Lila:** igual que CH-01 sustituyendo `[ADN NUBI]` por `[ADN LILA]`.
**CH-04 · Bruno:** igual que CH-01 con `[ADN BRUNO]`.
**CH-05 · Estrella (dos estados):**
```
Two versions side by side of [ADN ESTRELLA]: left dim and sleepy with eyes closed, right wide awake smiling and glowing brightly with golden light rays and sparkles, plain dark lavender background, high-end 3D animated film prop design, realistic satin and felt textures
```
**CH-06 · Grupo (referencia de escala):**
```
Lineup of three plush characters standing side by side for size comparison: [ADN LILA] on the left, [ADN NUBI] in the center, [ADN BRUNO] on the right and twice as tall, all smiling at camera, plain pastel background, soft studio lighting, high-end 3D animated feature film character design, realistic plush textures
```

> Elige la mejor variante de cada hoja, descárgala en PNG y guárdala en `ref/`. Si una variante cambia el color de la bufanda, los ojos o las proporciones, descártala.

---

## 3. Biblia de escenarios y paleta

### 3.1 Paleta global
| Nombre | Hex | Uso |
|---|---|---|
| Crema peluche | #F3E6CF | Nubi, caminos, casas |
| Rosa algodón | #F6C1D4 | Flores, Lila, cielo de atardecer |
| Azul cielo | #8EC9EE | Bufanda, río, cielo de día |
| Lavanda | #C9B6E8 | Noche, sombras, montañas lejanas |
| Amarillo estrella | #FBE38E | Estrella, ventanas, luces |
| Menta suave | #BFE6D3 | Hierba de fieltro, hojas |
| Noche lavanda | #4B3F72 | Cielo sin estrellas (nunca negro puro) |

### 3.2 Localizaciones
| ID | Lugar | Descripción (bloque de prompt) |
|---|---|---|
| LOC-A | Valle de Peluche | `rolling hills of mint-green felt grass, cotton-ball mountains, trees with knitted wool trunks and pompom canopies, tiny fabric cottages with button windows and quilted roofs, a river made of shimmering light-blue satin, fluffy cotton clouds` |
| LOC-B | Colina de Nubi | `a small round felt hill with a tiny patchwork cottage, a little felt flower garden, a wooden-toy fence with yarn ties` |
| LOC-C | Bosque de Algodón | `a magical forest of tall fluffy white and lavender cotton-candy-like cotton trees, glowing felt mushrooms, yarn vines, floating fuzzy firefly pompoms` |
| LOC-D | Puente de Lana | `a small wobbly bridge woven from chunky pastel pink and blue knitted wool over a sparkling satin stream` |
| LOC-E | Montaña de Algodón | `a soft giant mound of white cotton wool shaped like a small mountain, a golden glow leaking from underneath` |

### 3.3 Prompts de fondos clave (Firefly Image, 16:9)
**BG-01 · Valle de día:**
```
Wide establishing shot of [LOC-A] at golden sunset, everything made of plush fabrics, wool, cotton, felt and velvet, pastel pink, sky blue, lavender, cream and yellow palette, soft cinematic volumetric lighting, gentle haze, high-end 3D animated feature film, ultra-detailed realistic fabric textures with visible stitches and fibers, shallow depth of field, magical cozy atmosphere
```
**BG-02 · Valle de noche sin estrellas:** igual que BG-01 cambiando `at golden sunset` por `at night under a starless deep lavender sky, cottage windows glowing faint yellow, cool moonlight rim light, slightly melancholic but still soft and cozy`.
**BG-03 · Bosque de Algodón:** `Wide shot of [LOC-C] at night, soft moonlight shafts through cotton trees, ...` + bloque de estilo.
**BG-04 · Puente de Lana:** `Medium wide shot of [LOC-D] in [LOC-C] at night, ...` + bloque de estilo.
**BG-05 · Montaña de Algodón:** `Wide shot of [LOC-E] in a clearing of [LOC-C] at night, a warm golden glow escaping from beneath the cotton, ...` + bloque de estilo.
**BG-06 · Valle iluminado final:** igual que BG-02 pero `under a sky full of twinkling golden plush stars, fabric bunting and warm fairy lights on every cottage and tree, festive joyful glow`.

---

## 4. Prompt maestro de estilo

**Pega este bloque al final de CADA prompt de imagen y de vídeo** (en inglés: los modelos responden mejor):

```
STYLE: high-end 3D animated feature film, everything in the world is made of plush toys and soft materials (wool, cotton, felt, velvet, satin), ultra-realistic fabric textures with visible fibers and hand stitches, pastel palette of pink, sky blue, lavender, cream and soft yellow, soft cinematic lighting, gentle volumetric light, soft shadows, subtle specular highlights on satin, cinematic shallow depth of field, smooth natural motion, adorable expressive faces with big sparkling eyes, warm tender magical atmosphere, 16:9
```

**Bloque negativo** (en Firefly Image usa el campo *Excluir/Exclude* si existe; en vídeo añádelo como frase final "Avoid: …"):
```
Avoid: realistic humans, scary or dark horror mood, sharp teeth, black sky, plastic or shiny CGI skin, deformed limbs, extra eyes, extra ears, changing scarf color, text, watermark, logos, flicker, morphing faces
```

---

## 5. Guion técnico plano a plano

**Convenciones**
- `PG` = Plano general · `PM` = Plano medio · `PP` = Primer plano · `PD` = Plano detalle.
- **Método por plano:** (1) generar en Firefly Image el **fotograma inicial** (key frame) usando la hoja del personaje como *Referencia de estilo/composición*; (2) llevar ese fotograma a Firefly Video **Imagen a vídeo** (opcionalmente con fotograma final) y el prompt de movimiento; (3) recortar a la duración indicada.
- Firefly Video genera clips cortos (≈5 s). Todos los planos están diseñados para caber en un clip de 5 s y recortarse.
- `[NUBI]`, `[LILA]`, `[BRUNO]`, `[ESTRELLA]` = pegar el ADN correspondiente. `+ STYLE` = pegar el prompt maestro.

---

### ESCENA 1 — "El mundo de peluche" · 0:00 – 0:08

**Narrador (0:01,0 – 0:07,0):** *"En un lugar muy lejano existía un mundo donde todo estaba hecho de peluches..."*

#### Plano 1A · 0:00,00 – 0:05,00 (5,0 s · 120 f)
- **Encuadre:** PG aéreo. Lente 24 mm.
- **Cámara:** dolly aéreo hacia delante muy lento, ligero descenso (drone suave).
- **Acción:** nubes de algodón pasan cerca de cámara; el río de satén brilla; humo de lana sale de una chimenea.
- **Luz:** atardecer dorado-rosado, rayos volumétricos entre montañas.
- **Fundido de entrada** desde negro lavanda (12 f).
- **Prompt imagen (key frame):**
```
Breathtaking aerial establishing shot over [LOC-A] at golden sunset, fluffy cotton clouds in the foreground, a tiny patchwork cottage on a small hill in the distance + STYLE
```
- **Prompt vídeo:**
```
Slow cinematic aerial dolly forward and slightly downward over a magical plush world at sunset, cotton clouds drift gently past the camera, the satin river shimmers, a puff of soft wool smoke rises from a tiny fabric cottage chimney, felt flowers sway softly in the breeze, smooth steady camera, no cuts + STYLE
```
- **Ajustes de cámara Firefly:** Tamaño de plano: *Extreme wide* · Ángulo: *Aerial* · Movimiento: *Zoom in / Push in*.

#### Plano 1B · 0:05,00 – 0:08,00 (3,0 s · 72 f)
- **Encuadre:** PM → PMC de Nubi de espaldas/tres cuartos sobre su colina, mirando el cielo. Lente 50 mm.
- **Cámara:** push-in lento hacia Nubi.
- **Acción:** Nubi levanta la mirada y sonríe; la bufanda ondea; aparecen las primeras estrellas de peluche.
- **Transición desde 1A:** disolvencia cruzada 12 f.
- **Prompt imagen:**
```
[NUBI] standing on [LOC-B] seen from a three-quarter back angle, looking up at a pastel sunset sky where the first golden plush stars appear, scarf gently blowing + STYLE
```
- **Prompt vídeo:**
```
Slow push-in toward the small cream plush teddy bear on the hill, he lifts his head to look at the sky and smiles with wonder, his blue knitted scarf flutters softly in the breeze, tiny golden plush stars begin to twinkle above, gentle camera motion + STYLE
```

---

### ESCENA 2 — "Las estrellas se apagan" · 0:08 – 0:16

**Narrador (0:09,0 – 0:15,0):** *"Pero una noche, todas las estrellas desaparecieron y el mundo quedó a oscuras."*

#### Plano 2A · 0:08,00 – 0:12,00 (4,0 s · 96 f)
- **Encuadre:** contrapicado del cielo nocturno con la silueta de la colina abajo. Lente 24 mm.
- **Cámara:** tilt-up lento.
- **Acción:** las estrellas de peluche parpadean y se apagan una a una, como velas que se soplan; una sola estrella cae dejando una estela dorada hacia el bosque.
- **Luz:** de azul noche estrellado a lavanda profundo.
- **Transición:** disolvencia 12 f (el cielo de 1B se oscurece).
- **Prompt imagen:**
```
Low-angle view of a deep lavender night sky filled with soft golden plush stars above the silhouette of a felt hill and a tiny glowing cottage + STYLE
```
- **Prompt vídeo:**
```
Slow tilt up to a night sky of golden plush stars, the stars flicker and fade out one by one like candles being gently blown out, the sky turns a deep soft lavender, one last star falls in a slow golden arc toward a distant cotton forest leaving a sparkling trail, calm mysterious mood, not scary + STYLE
```

#### Plano 2B · 0:12,00 – 0:16,00 (4,0 s · 96 f)
- **Encuadre:** PP de Nubi. Lente 85 mm, profundidad de campo muy corta.
- **Cámara:** estática con micro push-in.
- **Acción:** Nubi pasa de la sonrisa a la preocupación; sus ojos reflejan la estrella que cae; sujeta su bufanda con las patitas.
- **Luz:** fría lunar lateral + reflejo dorado fugaz en los ojos.
- **Corte directo** desde 2A (en el momento en que la estrella cae, para dar ritmo).
- **Prompt imagen:**
```
Close-up of [NUBI] at night looking up with a worried expression, raised eyebrows, holding his scarf with both little paws, cool soft lavender moonlight, a tiny golden reflection of a falling star in his big eyes + STYLE
```
- **Prompt vídeo:**
```
Close-up of the cream plush teddy bear looking up at the darkening sky, his smile slowly turns into a worried look, ears droop slightly, he hugs his blue scarf with his paws, a small golden falling-star reflection crosses his shiny eyes, subtle camera push-in, very gentle emotional performance + STYLE
```

---

### ESCENA 3 — "Nuevos amigos" · 0:16 – 0:25

**Narrador (0:17,0 – 0:24,0):** *"Nubi decidió buscar la estrella perdida. Y no lo haría solo, porque encontró dos nuevos amigos."*

#### Plano 3A · 0:16,00 – 0:20,50 (4,5 s · 108 f)
- **Encuadre:** PM. Lente 35 mm.
- **Cámara:** travelling lateral acompañando a Nubi.
- **Acción:** Nubi camina decidido con un pequeño farolillo de tela; de un arbusto de flores de fieltro asoma Lila, primero las orejas, luego la cara sonriente; salta a su lado.
- **Luz:** farolillo cálido amarillo como luz principal; luciérnagas de pompón.
- **Transición:** disolvencia 8 f.
- **Prompt imagen:**
```
Medium shot of [NUBI] walking determined along a felt path at night holding a small glowing fabric lantern, beside a bush of felt flowers from which [LILA] peeks out with her long ears, warm lantern light, floating fuzzy firefly pompoms + STYLE
```
- **Prompt vídeo:**
```
Lateral tracking shot following the small cream plush teddy bear walking with a glowing lantern, a pink plush bunny pops out of a felt flower bush, ears first, then smiles and happily hops next to him, warm lantern glow, fuzzy fireflies float around, smooth natural character motion + STYLE
```

#### Plano 3B · 0:20,50 – 0:25,00 (4,5 s · 108 f)
- **Encuadre:** PG de grupo. Lente 35 mm.
- **Cámara:** dolly-out lento revelando a Bruno.
- **Acción:** Bruno aparece tímido tras un árbol de lana; Nubi le tiende la pata; Bruno sonríe. Los tres miran hacia el bosque al fondo, donde se ve un leve brillo dorado.
- **Transición:** corte directo con *match de acción* (salto de Lila).
- **Prompt imagen:**
```
[NUBI] and [LILA] meeting [BRUNO] who shyly peeks from behind a knitted wool tree, Nubi offers his paw, a faint golden glow visible far away in a cotton forest in the background, warm lantern light, night + STYLE
```
- **Prompt vídeo:**
```
Slow dolly out revealing a shy chubby blue plush elephant stepping out from behind a knitted wool tree, the cream teddy bear offers his paw, the elephant smiles warmly, then the three friends turn together to look at a faint golden glow in the distant cotton forest, gentle heartwarming moment + STYLE
```

---

### ESCENA 4 — "La gran aventura" · 0:25 – 0:37

**Narrador (0:27,0 – 0:35,0):** *"Después de una gran aventura, encontraron la estrella. ¡Pero necesitaban trabajar juntos para liberarla!"*

#### Plano 4A · 0:25,00 – 0:29,00 (4,0 s · 96 f)
- **Encuadre:** PG. Lente 28 mm, cámara a ras del suelo.
- **Cámara:** travelling hacia atrás (los personajes vienen hacia cámara).
- **Acción:** los tres atraviesan el Bosque de Algodón; Bruno sopla con la trompa y aparta una nube de algodón que bloquea el paso; Lila ríe.
- **Luz:** haces de luna lavanda, setas de fieltro luminosas.
- **Transición:** disolvencia 12 f.
- **Prompt imagen:**
```
Low ground-level wide shot of [NUBI], [LILA] and [BRUNO] walking toward camera through [LOC-C] at night, soft moonlight shafts, glowing felt mushrooms + STYLE
```
- **Prompt vídeo:**
```
Low tracking shot moving backward as three plush friends walk toward the camera through a magical cotton forest, the blue elephant gently blows a fluffy cotton cloud out of the path with his trunk, cotton fluff floats in the air, the pink bunny laughs, glowing felt mushrooms, moonlight shafts + STYLE
```

#### Plano 4B · 0:29,00 – 0:33,00 (4,0 s · 96 f)
- **Encuadre:** PG lateral del puente. Lente 35 mm.
- **Cámara:** travelling lateral lento.
- **Acción:** cruzan el puente de lana; se balancea un poco; Bruno duda, Lila y Nubi le dan la mano y cruzan juntos.
- **Transición:** barrido suave (*whip pan*) de 6 f o disolvencia 8 f.
- **Prompt imagen:**
```
Side view of [NUBI], [LILA] and [BRUNO] crossing [LOC-D] holding hands, the bridge wobbles gently, sparkling satin stream below, night forest of cotton trees behind + STYLE
```
- **Prompt vídeo:**
```
Side tracking shot of three plush friends crossing a small woven pastel wool bridge, the bridge sways gently, the blue elephant hesitates, the teddy bear and the bunny hold his trunk and paw and they cross together, sparkling satin water flows below, playful and tender + STYLE
```

#### Plano 4C · 0:33,00 – 0:37,00 (4,0 s · 96 f)
- **Encuadre:** de PM de espaldas (los tres) a PG de la montaña. Lente 35→50 mm.
- **Cámara:** push-in sobre sus hombros hacia la montaña de algodón.
- **Acción:** rodean un árbol y descubren la Montaña de Algodón; por debajo escapa luz dorada; se ve una punta de la estrella. Los tres se miran sorprendidos.
- **Luz:** el dorado de la estrella ilumina sus caras por primera vez.
- **SFX:** primera campanilla de la estrella.
- **Prompt imagen:**
```
Over-the-shoulder shot from behind [NUBI], [LILA] and [BRUNO] discovering [LOC-E], a soft golden light escaping from beneath the cotton and one glowing point of [ESTRELLA] peeking out, golden glow on their faces + STYLE
```
- **Prompt vídeo:**
```
Slow push-in over the shoulders of three plush friends as they discover a giant soft mound of white cotton in a forest clearing, warm golden light pulses from underneath, one glowing satin star point peeks out, the friends look at each other amazed, golden light softly illuminates their faces + STYLE
```

---

### ESCENA 5 — "Juntos lo conseguimos" · 0:37 – 0:49

**Narrador (0:40,0 – 0:46,5):** *"Con esfuerzo, amistad y mucho cariño, consiguieron liberar la estrella mágica."*

#### Plano 5A · 0:37,00 – 0:41,50 (4,5 s · 108 f)
- **Encuadre:** PM frontal de los tres empujando. Lente 35 mm.
- **Cámara:** cámara en mano muy suave (respiración) + ligero push-in.
- **Acción:** apoyan las patitas en la montaña y empujan; caras de esfuerzo tierno (mejillas infladas); el algodón se hunde; motas de algodón saltan.
- **Transición:** corte directo.
- **Prompt imagen:**
```
Front medium shot of [NUBI], [LILA] and [BRUNO] pushing together against [LOC-E] with their paws, cute determined straining faces with puffed cheeks, golden light glowing through the cotton + STYLE
```
- **Prompt vídeo:**
```
Three plush friends push together against a soft cotton mountain, cute straining faces with puffed cheeks, the cotton squishes and slowly gives way, small cotton fluffs pop into the air, warm golden glow intensifies from inside, subtle handheld camera with slight push-in + STYLE
```

#### Plano 5B · 0:41,50 – 0:45,50 (4,0 s · 96 f)
- **Encuadre:** PG. Lente 28 mm, contrapicado ligero.
- **Cámara:** grúa ascendente siguiendo a la estrella.
- **Acción:** el algodón se abre como una flor; la estrella sale flotando, despierta, abre los ojos y sonríe.
- **Transición:** disolvencia 6 f con destello (flash suave blanco-dorado 4 f).
- **SFX:** "puff" de algodón + arpa ascendente.
- **Prompt imagen:**
```
The cotton mountain opening like a flower and [ESTRELLA] rising out of it, awakening and smiling, the three friends looking up in awe at the bottom of the frame + STYLE
```
- **Prompt vídeo:**
```
Crane up shot: the cotton mound bursts open softly like a blooming flower, a plush golden satin star floats up out of it, opens its tiny embroidered eyes and smiles, sparkles swirl around it, the three plush friends look up in awe below, magical and joyful + STYLE
```

#### Plano 5C · 0:45,50 – 0:49,00 (3,5 s · 84 f)
- **Encuadre:** PP de las caras de los tres, iluminadas por la estrella. Lente 50 mm.
- **Cámara:** arco lento (orbit) de 30°.
- **Acción:** la estrella brilla intensamente; sus caras se iluminan de dorado; se miran y sonríen. Nubi se seca una lagrimita de alegría.
- **Prompt imagen:**
```
Close-up of the smiling faces of [NUBI], [LILA] and [BRUNO] side by side, lit by intense warm golden starlight from above, sparkles reflecting in their big eyes + STYLE
```
- **Prompt vídeo:**
```
Slow 30-degree orbit around the faces of three plush friends glowing in warm golden starlight, the light grows brighter, sparkles reflect in their eyes, they look at each other and smile happily, gentle emotional moment + STYLE
```

---

### ESCENA 6 — "La luz vuelve" · 0:49 – 1:00

**Narrador (0:50,0 – 0:56,5):** *"Y desde aquel día, Nubi aprendió que cuando estamos unidos, ¡podemos hacer brillar el mundo entero!"*
**Texto en pantalla (0:56,5 – 1:00,0):** **LA AMISTAD HACE BRILLAR EL MUNDO**

#### Plano 6A · 0:49,00 – 0:53,00 (4,0 s · 96 f)
- **Encuadre:** PG del cielo con el valle abajo. Lente 24 mm.
- **Cámara:** tilt-up siguiendo a la estrella.
- **Acción:** la estrella sube al cielo; al llegar estalla en una onda suave de luz que vuelve a encender todas las estrellas de peluche en cadena.
- **SFX:** campanillas en cascada + "whoosh" de terciopelo.
- **Transición:** disolvencia 12 f.
- **Prompt imagen:**
```
Wide shot of a deep lavender night sky above [LOC-A], [ESTRELLA] flying high leaving a golden sparkle trail, the first stars lighting up again + STYLE
```
- **Prompt vídeo:**
```
Tilt up following a glowing golden plush star soaring into the night sky with a sparkling trail, when it reaches the top it releases a soft ring of golden light that spreads across the sky and relights hundreds of plush stars one after another, magical and joyful + STYLE
```

#### Plano 6B · 0:53,00 – 0:57,00 (4,0 s · 96 f)
- **Encuadre:** PG del valle. Lente 28 mm.
- **Cámara:** dolly lateral lento.
- **Acción:** el valle se ilumina: ventanas de botón se encienden, guirnaldas de luz, peluches (patitos, gatitos, ovejas de lana) salen de sus casas y bailan; confeti de fieltro.
- **Prompt imagen:**
```
[BG-06 bloque] with many cute plush animal villagers (wool sheep, felt ducklings, velvet kittens) dancing and celebrating outside their fabric cottages, felt confetti in the air + STYLE
```
- **Prompt vídeo:**
```
Slow lateral dolly across a plush valley as it lights up: button windows glow warm yellow, strings of soft fairy lights switch on across knitted trees, cute plush animal villagers come out of their fabric cottages and dance happily, felt confetti falls, the sky full of twinkling plush stars + STYLE
```

#### Plano 6C · 0:57,00 – 1:00,00 (3,0 s · 72 f)
- **Encuadre:** PM del abrazo → PG con grúa hacia atrás y arriba.
- **Cámara:** crane-out lento.
- **Acción:** Nubi abraza a Lila y Bruno; la cámara se eleva; el texto final aparece sobre el cielo estrellado; fundido a lavanda/negro en los últimos 12 f (0:59,50–1:00,00).
- **Prompt imagen:**
```
[NUBI] warmly hugging [LILA] and [BRUNO] on [LOC-B] under a sky full of twinkling golden plush stars, festive fairy lights in the valley behind, cozy joyful glow + STYLE
```
- **Prompt vídeo:**
```
The cream teddy bear hugs the pink bunny and the blue elephant tightly, they sway happily together, the camera slowly cranes up and back revealing the glowing plush valley and a sky full of twinkling stars, leaving empty sky space in the upper third for a title, heartwarming ending + STYLE
```

---

### 5.1 Tabla de montaje (EDL) — suma exacta 60,00 s

| # | Plano | Entrada | Salida | Duración | Fotogramas (24 fps) | Transición de entrada |
|---|---|---|---|---|---|---|
| 1 | 1A | 00:00,00 | 00:05,00 | 5,0 s | 120 | Fundido desde negro 12 f |
| 2 | 1B | 00:05,00 | 00:08,00 | 3,0 s | 72 | Disolvencia 12 f |
| 3 | 2A | 00:08,00 | 00:12,00 | 4,0 s | 96 | Disolvencia 12 f |
| 4 | 2B | 00:12,00 | 00:16,00 | 4,0 s | 96 | Corte |
| 5 | 3A | 00:16,00 | 00:20,50 | 4,5 s | 108 | Disolvencia 8 f |
| 6 | 3B | 00:20,50 | 00:25,00 | 4,5 s | 108 | Corte (match de acción) |
| 7 | 4A | 00:25,00 | 00:29,00 | 4,0 s | 96 | Disolvencia 12 f |
| 8 | 4B | 00:29,00 | 00:33,00 | 4,0 s | 96 | Whip pan 6 f |
| 9 | 4C | 00:33,00 | 00:37,00 | 4,0 s | 96 | Corte |
| 10 | 5A | 00:37,00 | 00:41,50 | 4,5 s | 108 | Corte |
| 11 | 5B | 00:41,50 | 00:45,50 | 4,0 s | 96 | Flash dorado 4 f |
| 12 | 5C | 00:45,50 | 00:49,00 | 3,5 s | 84 | Corte |
| 13 | 6A | 00:49,00 | 00:53,00 | 4,0 s | 96 | Disolvencia 12 f |
| 14 | 6B | 00:53,00 | 00:57,00 | 4,0 s | 96 | Disolvencia 8 f |
| 15 | 6C | 00:57,00 | 01:00,00 | 3,0 s | 72 | Corte; fundido a negro 12 f al final |
| | **TOTAL** | | | **60,0 s** | **1440** | |

> Con disolvencias, genera cada clip con ~0,5 s de "cola" extra a cada lado (por eso clips de 5 s) para que el solapamiento no acorte la duración total.

---

## 6. Narración, música y sonido

### 6.1 Narración (texto final y tiempos)
Archivo de subtítulos con los tiempos exactos: [`narracion.srt`](narracion.srt).

| Bloque | Inicio | Fin | Texto | Dirección de voz |
|---|---|---|---|---|
| N1 | 0:01,0 | 0:07,0 | En un lugar muy lejano existía un mundo donde todo estaba hecho de peluches... | Susurro cálido de cuento, pausa tras "lejano" |
| N2 | 0:09,0 | 0:15,0 | Pero una noche, todas las estrellas desaparecieron y el mundo quedó a oscuras. | Más lento y bajo en "a oscuras", sin dramatismo |
| N3 | 0:17,0 | 0:24,0 | Nubi decidió buscar la estrella perdida. Y no lo haría solo, porque encontró dos nuevos amigos. | Decidido; sonrisa audible en "dos nuevos amigos" |
| N4 | 0:27,0 | 0:35,0 | Después de una gran aventura, encontraron la estrella. ¡Pero necesitaban trabajar juntos para liberarla! | Ritmo ágil; énfasis en "juntos" |
| N5 | 0:40,0 | 0:46,5 | Con esfuerzo, amistad y mucho cariño, consiguieron liberar la estrella mágica. | Crescendo emocional hasta "mágica" |
| N6 | 0:50,0 | 0:56,5 | Y desde aquel día, Nubi aprendió que cuando estamos unidos, ¡podemos hacer brillar el mundo entero! | Alegría plena, abierta, sonriente |

**Perfil de voz:** narradora o narrador adulto, español peninsular (castellano), timbre cálido y dulce, ritmo ~2,2 palabras/s, sonrisa en la voz, sin sobreactuar. Grabar a −18 LUFS en bruto; mezcla final de voz en torno a −16 LUFS integrados para web.

**Cómo generarla:**
- **Opción A — Firefly "Generar voz / Generate Speech"** (si aparece en tu cuenta): pega cada bloque por separado, idioma *Español (España)*, elige una voz cálida y ajusta estabilidad/expresividad media. Descarga en WAV.
- **Opción B — Grabación propia** (la más fiable para acento de España): micrófono a 15 cm, habitación con textiles; después pasa la toma por **Adobe Podcast "Enhance Speech"** (en esta sesión existe la herramienta `media_enhance_speech`, que puedo usar si me subes la grabación).

### 6.2 Música
**Brief musical (para Firefly "Generar banda sonora/Generate Soundtrack" si está disponible, o para buscar en Adobe Stock Audio):**
```
Gentle magical orchestral lullaby for a children's animated film, 60 seconds, soft solo piano melody, celesta and glockenspiel sparkles, warm pizzicato and legato strings, light harp glissandos, starts dreamy and tender, becomes softly mysterious, then hopeful and adventurous, builds to a joyful warm finale and ends with a soft chime, 80 to 96 bpm, key of F major
```

**Mapa musical (cue sheet):**
| Tiempo | Sección | Instrumentación | Intensidad |
|---|---|---|---|
| 0:00–0:08 | Tema de Nubi (A) | Piano + celesta | Suave |
| 0:08–0:16 | Misterio | Cuerdas graves sostenidas, piano en menor (Re m) | Baja; silencio de 0,5 s en 0:12 al caer la estrella |
| 0:16–0:25 | Esperanza | Pizzicato juguetón + glockenspiel | Media |
| 0:25–0:37 | Aventura | Ritmo ligero, cuerdas en staccato, arpa | Media-alta |
| 0:37–0:49 | Esfuerzo → triunfo | Crescendo de cuerdas, timbal suave; clímax en 0:42 | Alta |
| 0:49–1:00 | Final (A') | Tema de Nubi completo, coro "ooh" suave, campanilla final en 0:59 | Alta → resolución suave |

**Ducking:** baja la música −8 a −10 dB bajo cada bloque de narración (fundidos de 300 ms).

### 6.3 Efectos de sonido (SFX)
Usa Firefly **"Generar efectos de sonido / Generate Sound Effects"** (puedes grabar una onomatopeya con la voz para marcar el ritmo, si tu versión lo permite) o librerías libres (Adobe Stock, Freesound CC0).

| Tiempo | Plano | SFX | Prompt SFX |
|---|---|---|---|
| 0:00–0:08 | 1A–1B | Ambiente de prado mágico | `soft gentle breeze, distant tiny birds chirping, soft wind chimes, calm magical meadow ambience` |
| 0:04 | 1A | Puff de humo de lana | `tiny soft fluffy puff` |
| 0:08–0:12 | 2A | Estrellas apagándose | `series of soft delicate descending twinkles, like tiny candles being blown out` |
| 0:11,5 | 2A | Estrella cayendo | `soft magical whoosh with descending shimmer` |
| 0:12–0:16 | 2B | Ambiente nocturno | `quiet night ambience, soft crickets, very gentle wind` |
| 0:17 | 3A | Pasitos de peluche | `soft fabric footsteps on felt, muffled cute steps` |
| 0:18,5 | 3A | Salto de Lila | `cute soft boing, small cloth flutter` |
| 0:22 | 3B | Hojas de lana | `soft rustle of wool leaves` |
| 0:26,5 | 4A | Soplido de trompa | `gentle cartoon elephant trumpet toot, soft and cute, followed by fluffy cotton whoosh` |
| 0:30 | 4B | Puente crujiente | `soft creaking of a wool rope bridge, gentle sway` |
| 0:30–0:33 | 4B | Arroyo | `gentle tiny stream water trickling` |
| 0:34 | 4C | Primer brillo | `single bright magical chime with soft shimmer` |
| 0:37–0:41 | 5A | Esfuerzo | `soft squishing cotton, cute small grunts` (o voces de esfuerzo grabadas) |
| 0:42 | 5B | Liberación | `fluffy cotton burst puff followed by rising harp glissando and sparkling chimes` |
| 0:46 | 5C | Brillo intenso | `warm magical shimmer swell` |
| 0:50,5 | 6A | Onda de luz | `soft whoosh and cascading bell twinkles spreading across the sky` |
| 0:53–0:57 | 6B | Celebración | `cute small cheers, soft clapping of plush paws, gentle party poppers with confetti` |
| 0:59 | 6C | Final | `single soft sparkling chime` |

**Niveles de mezcla orientativos:** Narración 0 dB (referencia) · Música −10/−12 dB bajo voz · SFX −6 a −14 dB · Ambientes −20 dB. Máster final: −14 LUFS integrados (YouTube/redes), pico real ≤ −1 dBTP.

---

## 7. Flujo de trabajo en Adobe Firefly paso a paso

### Fase 1 — Preproducción (Firefly Boards)
1. Abre **firefly.adobe.com → Boards** y crea el tablero "Osito Luz".
2. Pega la paleta de §3.1 y los fondos de §3.3 como primeras generaciones. Así tienes un moodboard común.
   *(Puedo crear el tablero con la herramienta `create_firefly_board` en cuanto tengas generaciones en tu cuenta.)*

### Fase 2 — Diseño de personajes (Firefly Image)
1. **Generar imagen** → pega CH-01 (sustituyendo `[ADN NUBI]`) → 16:9 → genera 4 variantes.
2. Elige la mejor. Úsala como **Referencia de estilo** (Style reference) en las siguientes generaciones con intensidad alta, y como **Referencia de composición** cuando necesites mantener una pose.
3. Repite para Lila, Bruno, Estrella y la alineación de grupo (CH-06). Guarda todo en `ref/`.
4. Si dispones de **modelos de socio** en Firefly (p. ej. modelos con edición por referencia de personaje), úsalos para los fotogramas con los tres personajes: suben a la vez las tres hojas como referencias.

### Fase 3 — Fotogramas clave (Firefly Image)
1. Para cada plano (§5), genera el **fotograma inicial** con su prompt de imagen + STYLE, usando la hoja del personaje como referencia.
2. Comprueba coherencia (ver §9). Corrige detalles con **Relleno generativo** (p. ej. repintar la bufanda en azul) en lugar de regenerar todo.
3. Para planos con gran cambio (2A estrellas apagándose, 5B estrella saliendo, 6A cielo encendiéndose) genera también un **fotograma final**.
4. Exporta a 1920×1080 o más.

### Fase 4 — Animación (Firefly Video)
1. **Generar vídeo → Imagen a vídeo**. Sube el fotograma inicial (y el final si lo tienes).
2. Pega el **prompt de vídeo** del plano + STYLE + bloque "Avoid".
3. Ajustes: 16:9 · 1080p · duración 5 s · **Controles de cámara** según cada plano (tamaño de plano, ángulo, movimiento).
4. Genera 2–4 tomas por plano; elige la que mantenga mejor la cara y las proporciones.
5. Si una toma deforma al personaje en el último segundo, recórtala en el montaje en vez de regenerar.
6. Para los planos sin personajes (1A, 2A, 6A) también puedes usar **Texto a vídeo** directamente.
7. Opcional: si tu plan incluye modelos de vídeo de socios en Firefly, prueba el plano más complejo (5A empujando) con varios modelos y quédate con el más estable.

### Fase 5 — VFX con Firefly
- **Partículas y destellos** (5B, 6A): genera con Texto a vídeo un clip `golden magical sparkle particles and soft glowing dust floating on a pure black background, 16:9` y colócalo encima en modo de fusión **Pantalla/Screen**.
- **Onda de luz** (6A): `soft expanding golden light ring wave on a pure black background`.
- **Luciérnagas** (3A, 4A): `fuzzy glowing yellow firefly pompoms drifting slowly on black background`.
- **Bloom/brillo** en fotogramas fijos: el servidor de Adobe conectado aquí tiene el efecto *Bloom* y ajustes de exposición; puedo aplicarlos a tus fotogramas si me pasas las URLs.

### Fase 6 — Audio
Ver §6: voz (Generate Speech o grabación + Enhance Speech), música (Generate Soundtrack o Adobe Stock), SFX (Generate Sound Effects).

### Fase 7 — Montaje y composición
- **Editor de vídeo de Firefly** (si aparece en tu cuenta, con línea de tiempo multipista) o **Adobe Premiere Pro** (recomendado para precisión de fotograma) o **Adobe Express** (más sencillo).
- Secuencia: 1920×1080, 24 fps, duración 00:01:00:00.
- Pistas: V1 planos · V2 VFX (Screen) · V3 título · A1 narración · A2 música · A3 SFX · A4 ambientes.
- Coloca los planos con la tabla de §5.1 y las transiciones indicadas.

---

## 8. Montaje, VFX, título y etalonaje

### 8.1 Título final
- Texto: **LA AMISTAD HACE BRILLAR EL MUNDO** (dos líneas: "LA AMISTAD HACE" / "BRILLAR EL MUNDO").
- Tipografía: redondeada y suave, tipo *Fredoka*, *Baloo 2* o *Nunito ExtraBold* (o similar de Adobe Fonts).
- Color: crema #FFF6E5 con resplandor exterior amarillo #FBE38E (radio 20 px, opacidad 60 %) y sombra lavanda suave.
- Animación: entrada letra a letra con escala 90→100 % y destellos (0:56,5–0:58,0), mantener, fundido a negro con la imagen en 0:59,5–1:00,0.
- Zona segura: tercio superior, márgenes del 10 %.
- Opcional: genera el título como imagen en Firefly con `Text effects` de "fieltro bordado con hilo dorado" para que parezca de peluche.

### 8.2 Etalonaje (look)
- Base común en todos los planos para unificar las tomas generadas: contraste −5, saturación −5, tinte rosado ligero en altas luces, lavanda en sombras.
- Escenas 2–4: balance más frío (lavanda), pero nunca negro puro (negros elevados a ~8 %).
- Escenas 5–6: calor progresivo, bloom/glow suave sobre la estrella y las luces.
- Grano fino de película al 5–8 % para unificar texturas de distintas tomas.
- Viñeta suave (−10 %).

### 8.3 Ritmo
- Primer tercio pausado (planos largos, disolvencias).
- Escena 4–5 más ágil (cortes directos, whip pan).
- Final amplio y lento (grúa, fundido).

---

## 9. Control de calidad y coherencia

**Checklist por plano (rechaza la toma si falla algo):**
- [ ] Nubi: color crema, bufanda azul cielo con pompones blancos, nariz marrón bordada, ojos grandes con brillo.
- [ ] Lila: rosa, orejas largas con interior blanco, flor lavanda en una oreja.
- [ ] Bruno: azul bebé, parche de estrella amarillo en la barriga, costuras visibles.
- [ ] Escala correcta (Bruno ≈ 2× Nubi).
- [ ] Sin dedos, ojos u orejas extra; sin caras que "se derriten".
- [ ] Sin texto o marcas de agua generadas.
- [ ] Texturas de tela visibles (no plástico).
- [ ] Paleta pastel; ninguna zona en negro puro.
- [ ] La dirección de la mirada coincide con el plano anterior (regla de 180°: el bosque y la estrella siempre a la **derecha** del encuadre en las escenas 3–4).
- [ ] Movimiento fluido, sin parpadeo (flicker).

**Trucos de coherencia:**
1. Siempre el mismo ADN de prompt, palabra por palabra.
2. Siempre la misma referencia de estilo (la hoja de personaje elegida).
3. Imagen a vídeo en lugar de texto a vídeo en todos los planos con personajes.
4. Planos cortos (3–5 s): cuanto más corto, menos deriva.
5. Si un detalle se desvía (p. ej. bufanda verde), corrígelo en el fotograma inicial con Relleno generativo antes de animar.
6. Unifica con el etalonaje y el grano del §8.2.

---

## 10. Checklist de entrega

- [ ] `OSITO_LUZ_MASTER_1080p24.mp4` — H.264, 1920×1080, 24 fps, 60,00 s exactos (1440 f), 15–20 Mbps, audio AAC 48 kHz estéreo 320 kbps, −14 LUFS.
- [ ] (Opcional) versión 4K reescalada.
- [ ] `narracion.srt` incrustado o como pista de subtítulos.
- [ ] Stems de audio: voz, música, SFX.
- [ ] Carpeta `ref/` con hojas de personaje y fotogramas clave.
- [ ] Miniatura: PP de Nubi iluminado por la estrella (fotograma de 5C).
- [ ] Revisar las condiciones de uso comercial de los modelos usados (los modelos propios de Firefly están pensados como "comercialmente seguros"; los modelos de socios pueden tener condiciones distintas).

### Estructura de carpetas sugerida
```
el-osito-que-devolvio-la-luz/
├── BIBLIA_DE_PRODUCCION.md
├── narracion.srt
├── ref/          (hojas de personaje CH-01..CH-06, fondos BG-01..BG-06)
├── keyframes/    (1A_start.png, 1A_end.png, ...)
├── clips/        (1A_take2.mp4, ...)
├── vfx/          (sparkles.mp4, lightwave.mp4, fireflies.mp4)
├── audio/        (voz/, musica/, sfx/)
└── export/
```
