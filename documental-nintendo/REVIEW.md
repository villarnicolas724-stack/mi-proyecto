# REVIEW — «Nintendo: de las cartas a las consolas»

## Decisiones creativas
- **Storyline elegida:** «La carta que se convirtió en mando». Una carta hanafuda abre cada capítulo con el kanji de su número (一…八) y la estética de su época, y se convierte en el mundo del capítulo. Al final se reparten las ocho cartas y vuelve la carta de la grulla del primer plano. No construidas: «El archivo de Kioto» (plano continuo por un museo) y «Partida en tiempo real» (la historia como fases de juego). Ver STORYLINES.md.
- **Cada capítulo es un medio distinto:** tinta sobre washi, impresión offset de los 60, CRT, píxel de 8 bits con consolas 3D, polígono plano, plástico blanco, campos de color modernos y de vuelta al washi.
- **Leitmotiv musical de 5 notas** que cambia de instrumento con cada época (koto, celesta, pulso de 8 bits, sintes, piano, koto otra vez en tono mayor).
- **Sin material de terceros:** no hay logotipos, capturas, personajes con copyright ni melodías existentes. Mario, Donkey Kong y Pokémon se evocan con texto, siluetas genéricas y sprites originales. Las consolas son modelos 3D propios, simplificados y a escala relativa aproximada.

## Lo que se midió (no solo se miró)
- `hyperframes check`: **ok** (0 errores). Avisos que se mantienen a propósito: el tamaño de los archivos de escena, la densidad de la pista de subtítulos (146 grupos), los mensajes de rendimiento de WebGL por software, el letrero de la puerta en perspectiva (es decorativo) y el aviso legal de los créditos (4,3 s en pantalla, también disponible por escrito en este paquete).
- Voz: 80 frases, sin valores atípicos de velocidad (de 12 a 19 caracteres por segundo); pronunciación revisada con los fonemas de espeak-ng para cada nombre extranjero.
- Mezcla (medida, **no escuchada**): la música queda ~14,5 dB por debajo de la voz mientras se habla y unos 9 dB por debajo en las pausas, con reducción automática (ducking) de 7,5 dB guiada por la voz. Los golpes de efectos quedan ~3 dB por encima de la música. El máster final se normaliza a −16 LUFS con techo de −1,5 dBTP (ver renders/).
- Revisión visual: hojas de contacto de todos los capítulos, de los 9 cortes entre capítulos y a ancho de móvil (360 px).

## Lo que nadie ha comprobado
- **Nadie ha escuchado el audio.** La voz es una síntesis local (Kokoro) y la música está compuesta y sintetizada por código: se midieron los niveles, el equilibrio espectral y la ausencia de saturación, pero no su calidad ni su expresividad a oído.
- La voz Kokoro en español es correcta pero menos expresiva que la de un locutor profesional o una voz neuronal comercial.

## El plano más débil y qué cambiaría con más tiempo
- **La voz** es el punto más débil frente al objetivo de «gran productora». Para mejorarla: grabar a un locutor y sustituir `assets/voice/narracion.wav` (los tiempos de `production/guion.py` se regeneran solos), o usar una voz neuronal de pago.
- La música sintetizada no suena orquestal; una partitura grabada o una biblioteca con licencia mejoraría los capítulos 7 y 8.
- Algunos planos 2D (bolsillo, cartucho frente a CD) son sencillos; con más tiempo merecerían más capas y profundidad.
- Resolución: 1080p. No se hizo 4K porque el render WebGL por software lo haría varias veces más lento; el proyecto se puede renderizar a 4K cambiando la resolución en el estudio.
