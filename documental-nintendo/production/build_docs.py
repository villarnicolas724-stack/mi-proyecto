# -*- coding: utf-8 -*-
"""Genera deliverables/STORYBOARD.md y deliverables/GUION.md a partir de timing.json."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
T = json.load(open(os.path.join(HERE, "timing.json")))

LOOK = {
 "hook": "Mesa de madera lacada bajo luz cálida. Música: dron grave, latidos de taiko, koto; resolución luminosa en el título.",
 "ch1": "Tinta sumi sobre washi, bermellón como único acento. Música: koto en escala miyako-bushi, shakuhachi, dron; armonía tonal al llegar 1902.",
 "ch2": "Impresión offset años 60: mostaza, verde azulado, trama de semitono. Música: swing de taller (contrabajo, escobillas, vibráfono, celesta).",
 "ch3": "Pantalla CRT: líneas de barrido, viñeta, tipografía de píxel. Música: chiptune 140 BPM en Do menor; silencio tras el fracaso de Radar Scope.",
 "ch4": "Estudio de plástico gris con consolas en 3D + mundo de 8 bits. Música: chip heroico en Sol; caída en la crisis; 16 bits con eco y cuerdas.",
 "ch5": "Polígono plano low-poly, primarios sobre grafito. Música: breakbeat 92 BPM, cuerdas en staccato; Pokémon en Sol mayor con marimbas.",
 "ch6": "Plástico blanco brillante, azul como acento. Música: piano para Iwata; marimba y palmas para DS/Wii; piano solo y sala amplia en 2015.",
 "ch7": "Grafito con campos de color rojo/azul. Música: híbrido cinematográfico 120 BPM; subida e impacto únicos para Switch 2.",
 "ch8": "Washi al amanecer y madera; regreso de la carta. Música: piano + cuerdas; el koto repite el leitmotiv en mayor; silencio en «¿Jugamos?».",
 "credits": "Washi; páginas fijas. Música: koto y pad que se desvanecen.",
}
VIS = {
 "h1": "Primer plano de la carta del pino y la grulla; el pigmento se pinta con cuatro pinceladas; empuje lento de cámara; «1889» a la izquierda.",
 "h2": "La carta gira 180° y 90° en 3D; su dorso se convierte en pantalla; dos mandos rojo/azul encajan a los lados; en la pantalla aparece la misma carta en píxeles; «2026».",
 "h3": "La consola se aleja; kanji 任天堂 en bermellón, «NINTENDO» letra a letra, subtítulo; inundación de color al papel.",
 "c1a": "Tarjeta de capítulo 一; panorámica con paralaje de Kioto al atardecer (montañas, pagoda de cinco pisos, tejados de machiya, farolillos, niebla); cruza un tren de vapor; corte a vista cenital de una partida sobre tatami.",
 "c1b": "Interior del taller: vigas, shoji, silueta que pinta una carta; rótulo «Fusajiro Yamauchi 山内房次郎 · 1859–1940».",
 "c1c": "Reparto de 48 cartas en rejilla 12×4 (meses en kanji, flor de cada mes); contador 0→48.",
 "c1d": "Cae un cartel de madera con 任天堂骨牌; rótulo «Nintendo Koppai».",
 "c1e": "Tres kanji grandes 任 天 堂 con su significado; «Deja la suerte en manos del cielo» + nota «traducción habitual».",
 "c1f": "Abanico de naipes occidentales junto a la hanafuda; «1902».",
 "c1g": "Línea temporal 1889→1949 con un montón de cartas que crece; contador de años.",
 "c1h": "Silueta de un joven con traje; «22 años · 1949»; gota de tinta que cubre la pantalla.",
 "c2a": "Tarjeta 二; cartel: disco verde azulado, silueta de Hiroshi Yamauchi; «1949», nombre, 山内溥, «Presidente de 1949 a 2002».",
 "c2b": "Fábrica con tejado de diente de sierra; rayos amarillos hacia fuera; «Mucho más que naipes».",
 "c2c": "Salón de los 50: dos niños, mesa, cartas que caen; «1959 · Acuerdo con Disney».",
 "c2d": "«Nintendo Playing Card Co., Ltd.»: tachado rojo de «Playing Card» y colapso a «Nintendo Co., Ltd.»; «1963».",
 "c2e": "Un taxi cruza y se cala; cuenco de arroz humeante; sellos «Taxis» / «Arroz instantáneo»; línea de resultados que cae.",
 "c2f": "Una puerta «Taller de mantenimiento» se abre hacia la luz; herramientas; empuje de cámara.",
 "c2g": "Silueta de Gunpei Yokoi; rótulo; prototipo de tijera extensible que se abre y se cierra.",
 "c2h": "PLANO CLAVE: la Ultra Hand cruza el plano, atrapa una pelota y la trae; «1966 Ultra Hand».",
 "c2i": "Cinta que avanza: 1973 Laser Clay (pistola y disparo), 1977 Color TV-Game (tele con pala y pelota), 1980 Game & Watch (pantalla LCD).",
 "c2j": "Cartel nocturno: 枯れた技術の水平思考 en vertical + «Tecnología madura, usada de formas nuevas»; la pantalla LCD crece y se convierte en el CRT del capítulo 3.",
 "c3a": "Tarjeta 三; travelling por un pasillo de recreativas en perspectiva, pantallas animadas; «Salones recreativos».",
 "c3b": "«1980 · Nintendo of America»; radar con barrido y ecos; «RADAR SCOPE»; «Fracaso».",
 "c3c": "Almacén: filas de muebles recreativos que se multiplican; «Sin vender».",
 "c3d": "Retrato en píxeles que se dibuja línea a línea; «Shigeru Miyamoto 宮本茂 · n. 1952».",
 "c3e": "Pistas de circuito («Ingeniero») frente a tres viñetas de storyboard («Narrador»).",
 "c3f": "Sprites originales: gorila, dama, carpintero; vigas inclinadas; un barril rueda y el carpintero lo salta.",
 "c3g": "PLANO CLAVE: destello, «DONKEY KONG» en píxel con aberración cromática, sacudida; «1981».",
 "c3h": "«JUMPMAN» rueda como tragaperras hasta «MARIO».",
 "c3i": "Mapa del mundo en puntos; ciudades que se encienden; barrido de píxeles hacia el capítulo 4.",
 "c4a": "Tarjeta 四; Famicom en 3D girando; «15·07·1983 · Famicom».",
 "c4b": "Curva ilustrativa que se desploma; «Crisis del videojuego · 1983»; cartuchos que caen.",
 "c4c": "NES en 3D; «1985 · Nueva York»; robot en píxeles que salta.",
 "c4d": "Cartucho gigante; un sello dorado «Sello de calidad» lo golpea; «Confianza».",
 "c4e": "Mundo de 8 bits; «SUPER MARIO BROS. · 13·09·1985» escrito en pasos.",
 "c4f": "Desplazamiento lateral: nubes, colinas, bloques, saltos del héroe genérico, bloque secreto con moneda.",
 "c4g": "El héroe sube peldaños 1985·1995·2005·2015·2025; «Un icono global».",
 "c4h": "62 iconos de consola; contador «61,91 M».",
 "c4i": "Game Boy en 3D; «21·04·1989».",
 "c4j": "Pantalla verde: piezas que caen y se apilan, pila que se gasta; «118,69 millones».",
 "c4k": "Super Famicom en 3D con mando de colores; comparación de la carta en 8 bits frente a 16 bits.",
 "c5a": "Tarjeta 五; pantalla partida roja/azul «Nintendo VS SEGA»; estela azul muy rápida.",
 "c5b": "Documento «Proyecto lector de CD · Nintendo × Sony» que se rompe; un CD gira; «PlayStation · Sony · 1994».",
 "c5c": "Nintendo 64 y su mando en 3D; etiqueta que sigue al stick analógico; «23·06·1996».",
 "c5d": "Vuelo de cámara por un mundo low-poly (colinas, agua, árboles, plataformas, icosaedro dorado); «Super Mario 64».",
 "c5e": "Barras de capacidad: cartucho 64 MB frente a CD ≈650 MB.",
 "c5f": "Una Game Boy cae en el bolsillo de un vaquero y asoma.",
 "c5g": "Dos Game Boy unidas por cable; criaturas de píxel viajan por él; «Pokémon · 27·02·1996».",
 "c5h": "Mapa de puntos que se enciende desde Japón; «Un fenómeno mundial».",
 "c5i": "GBA y GameCube en 3D; barras 81,51 M frente a 21,74 M.",
 "c5j": "Dos flechas suben («Más potencia»); una roja gira a la derecha («Otra forma de jugar»).",
 "c6a": "Tarjeta 六; retrato de Satoru Iwata; «2002», 岩田聡.",
 "c6b": "Monitor con código que se escribe («invitar(persona)»).",
 "c6c": "Tarjeta → mente → corazón: «presidente», «desarrollador», «jugador».",
 "c6d": "Curva de potencia frente a una multitud de 160 personas que aparece.",
 "c6e": "Nintendo DS en 3D: se abre la tapa, el lápiz baja a la pantalla; «2004».",
 "c6f": "Iconos «Entrenar la mente» y «Cuidar de un perro»; contador «154,02 M».",
 "c6g": "Wii en 3D con el mando que se balancea; arco de movimiento; «2006».",
 "c6h": "Salón familiar: el abuelo lanza, caen los bolos en la tele; «101,63 M».",
 "c6i": "«3D» en capas desplazadas rojo/cian; luego Wii U en 3D; «2011», «2012».",
 "c6j": "Comparativa de sobremesas (NES, SNES, N64, GameCube, Wii, Wii U) con Wii U en rojo.",
 "c6k": "Silencio visual: «Satoru Iwata · 1959 – 2015» y una línea.",
 "c6l": "La imagen de la tele viaja a la pantalla del mando; inundación roja/azul.",
 "c7a": "Tarjeta 七; Nintendo Switch en 3D sobre su base; «3·03·2017».",
 "c7b": "Sale de la base (Modo TV → Modo portátil) y los mandos se separan (Modo sobremesa).",
 "c7c": "Paisaje de mundo abierto con paralaje y hierba al viento; «Breath of the Wild».",
 "c7d": "Cortes de color: Mario Kart, Smash Bros., Animal Crossing; isla «2020» a la que llegan barcos.",
 "c7e": "Carrera de barras: Switch adelanta a Wii, Game Boy y DS; «N.º 1 de Nintendo».",
 "c7f": "Tres paradas: 2021 Super Nintendo World, 2023 película, 2024 Nintendo Museum.",
 "c7g": "PLANO CLAVE: destello, barrido de luz y Switch 2 en 3D; «Nintendo Switch 2 · 5·06·2025»; «3,5 millones en cuatro días».",
 "c7h": "Etiqueta «469,99 € → 499,99 €» (Europa, 1·09·2026); contador «26,35 M».",
 "c7i": "Línea temporal hacia el futuro: 2026 película de Mario, 2027 Zelda en imagen real; el fondo se vuelve papel.",
 "c8a": "Tarjeta 八; Kioto al amanecer con un edificio moderno; «137 años».",
 "c8b": "Un camino de tinta esquiva «guerras», «crisis», «fracasos»; «Hacer algo distinto».",
 "c8c": "Travelling por la alineación 3D de 11 consolas (1983–2025) con año y nombre; «Fáciles de entender, difíciles de olvidar».",
 "c8d": "Padre e hijo en un sofá: el mando gris pasa a sus manos y se convierte en dos mandos rojo/azul.",
 "c8e": "Sobre la mesa se reparten en abanico las ocho cartas de capítulo.",
 "c8f": "«¿Jugamos?» a pincel.",
 "c8g": "Vuelve la carta de la grulla del primer plano.",
 "c8h": "A su lado se desliza una carta boca abajo con un destello; fundido al papel.",
}

def ts(v): m = int(v // 60); return f"{m:02d}:{v - 60 * m:05.2f}"
sb = ["# Storyboard plano a plano", "", f"Duración total: {ts(T['total'])} ({T['total']:.1f} s) · 1920×1080 · 30 fps. Tiempos absolutos (mm:ss.cc), medidos sobre la voz real.", ""]
for ch in T["chapters"]:
    title = " · ".join(ch["title"]) if ch["title"] else ("Gancho" if ch["id"] == "hook" else "Créditos y fuentes")
    sb += [f"## {title}  ({ts(ch['start'])} – {ts(ch['end'])})", "", f"*{LOOK[ch['id']]}*", ""]
    if ch["title"]:
        sb += [f"- **{ts(ch['start'])}** Tarjeta de capítulo: una carta hanafuda gira mostrando el kanji del número con la estética de la época, se lee el título y la carta crece hasta convertirse en el mundo del capítulo (transición «el objeto se convierte en el mundo»).", ""]
    sb += ["| Tiempo | Narración | Imagen y animación |", "|---|---|---|"]
    for c in T["cues"]:
        if c["chapter"] == ch["id"]:
            sb.append(f"| {ts(c['start'])}–{ts(c['end'])} | {c['text']} | {VIS.get(c['id'], '')} |")
    if ch["id"] == "credits":
        sb.append("| — | (sin voz) | Seis páginas: título, producción y voz, música e ilustración, fuentes, aviso, «Gracias por jugar». |")
    sb.append("")
open(os.path.join(ROOT, "deliverables/STORYBOARD.md"), "w").write("\n".join(sb))

g = ["# Guion de narración", "", "Español de España · voz en off masculina · ~1.200 palabras.", ""]
for ch in T["chapters"]:
    if ch["id"] == "credits": continue
    title = " · ".join(ch["title"]) if ch["title"] else "Gancho"
    g += [f"## {title}", ""]
    g += [c["text"] for c in T["cues"] if c["chapter"] == ch["id"]] + [""]
open(os.path.join(ROOT, "deliverables/GUION.md"), "w").write("\n".join(g))
print("docs ok")
