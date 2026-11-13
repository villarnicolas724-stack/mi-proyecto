#!/usr/bin/env bash
# Render por tramos (cada uno cabe en una sesión) y unión sin recodificar.
# Se puede relanzar: los tramos ya terminados se saltan.
set -uo pipefail
cd "$(dirname "$0")/.."
mkdir -p renders/tramos
B=(0 62 128 175 248 316 391 469 END)
for i in $(seq 0 $((${#B[@]}-2))); do
  s=${B[$i]}; e=${B[$((i+1))]}; out=renders/tramos/t$(printf %02d $i).mp4
  [ -s "$out" ] && { echo "salto $out"; continue; }
  args=(--start "$s"); [ "$e" != END ] && args+=(--end "$e")
  echo "== tramo $i: $s → $e  ($(date +%T))"
  npx hyperframes render -o "$out.part.mp4" --quality delivery --workers 3 --quiet "${args[@]}" --skill=hyperframes > "renders/tramos/t$i.log" 2>&1 \
    && mv "$out.part.mp4" "$out" || { echo "fallo tramo $i"; tail -5 "renders/tramos/t$i.log"; exit 1; }
done
ls renders/tramos/t*.mp4 | sed "s/^renders\/tramos\//file '/; s/$/'/" > renders/tramos/lista.txt
ffmpeg -hide_banner -y -f concat -safe 0 -i renders/tramos/lista.txt -map 0:v -c copy renders/tramos/video.mp4
ffmpeg -hide_banner -y -i assets/voice/narracion.wav -i assets/music/banda_sonora.wav -i assets/sfx/efectos.wav \
  -filter_complex "[0][1][2]amix=inputs=3:normalize=0:duration=longest" -c:a pcm_f32le renders/tramos/mezcla.wav
ffmpeg -hide_banner -y -i renders/tramos/video.mp4 -i renders/tramos/mezcla.wav -map 0:v -map 1:a -c:v copy -c:a pcm_s24le -shortest renders/nintendo_documental_raw.mov
echo "== listo ($(date +%T))"
