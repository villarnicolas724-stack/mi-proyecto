# Canal de YouTube con IA

Repositorio de trabajo del canal: guiones, marca, recursos y proyectos de vídeo.

## Estructura

```
canal/            Marca del canal y banco de ideas
videos/
  _plantilla/     Copiar esta carpeta para cada vídeo nuevo
  001-mi-video/   guion.md, publicacion.md, voz.mp3, proyecto HyperFrames…
media/sfx/        Efectos de sonido libres (CC0) con sus créditos
tools/voz.sh      Voz en off en español (edge-tts) + subtítulos .srt
.claude/skills/   Skills de Claude del proyecto
```

## Flujo de un vídeo

1. Idea → `canal/ideas.md`
2. `cp -r videos/_plantilla videos/NNN-titulo` y escribir `guion.md`
3. Voz: `tools/voz.sh videos/NNN-titulo/guion.txt videos/NNN-titulo/voz.mp3`
4. Montaje y render con HyperFrames (los `.mp4` no se suben al repo)
5. Miniatura, título y descripción en `publicacion.md`
