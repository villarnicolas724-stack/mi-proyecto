#!/usr/bin/env bash
# Render por tramos (cada uno cabe en una sesión) y unión sin recodificar.
# Se puede relanzar: los tramos ya terminados se saltan. Si un tramo se bloquea
# en el fotograma N, se parte por ese segundo y se renderizan las dos mitades por separado.
set -uo pipefail
cd "$(dirname "$0")/.."
mkdir -p renders/tramos
END=534.719
B=(0 62 128 175 190 205 225 230 248 280 316 350 391 430 469 500)
name() { printf 'renders/tramos/s%04d.mp4' "$1"; }
done_upto() { # ¿hay ya tramos que cubren [s, e)?
  local s=$1 e=$2 f
  f=$(name "$s"); [ -s "$f" ] || return 1
  local n; n=$(ffprobe -v error -count_packets -select_streams v:0 -show_entries stream=nb_read_packets -of csv=p=0 "$f")
  local next; next=$(python3 -c "print(int(round($s+$n/30)))")
  [ "$next" -ge "${e%.*}" ] && return 0
  done_upto "$next" "$e"
}
render() { # render [s, e) con reintentos y partición automática
  local s=$1 e=$2 out log args intento stuck cut
  done_upto "$s" "$e" && { echo "salto $s → $e"; return 0; }
  out=$(name "$s"); [ -s "$out" ] && { # mitad izquierda hecha: seguir desde donde acaba
    local n; n=$(ffprobe -v error -count_packets -select_streams v:0 -show_entries stream=nb_read_packets -of csv=p=0 "$out")
    render "$(python3 -c "print(int(round($s+$n/30)))")" "$e"; return; }
  log=renders/tramos/s$s.log; args=(--start "$s"); [ "$e" != "$END" ] && args+=(--end "$e")
  for intento in 1 2 3; do
    echo "== tramo $s → $e  ($(date +%T))"
    rm -f "$out.part.mp4"
    if npx hyperframes render -o "$out.part.mp4" --quality delivery --workers 3 --quiet "${args[@]}" --skill=hyperframes > "$log" 2>&1; then
      mv "$out.part.mp4" "$out"; return 0; fi
    stuck=$(grep -m1 -oE 'stuck at [0-9]+' "$log" | grep -oE '[0-9]+$')
    cut=$(python3 -c "print($s + int(${stuck:-0})//30)")
    echo "reintento $s → $e ($intento): bloqueo en ${stuck:-?}"
    if [ "$cut" -gt "$s" ]; then render "$s" "$cut" && render "$cut" "$e"; return; fi
  done
  echo "fallo tramo $s → $e"; tail -5 "$log"; return 1
}
for i in "${!B[@]}"; do
  s=${B[$i]}; e=${B[$((i+1))]:-$END}
  render "$s" "$e" || exit 1
done
ls renders/tramos/s*.mp4 | sed "s/^renders\/tramos\//file '/; s/$/'/" > renders/tramos/lista.txt
ffmpeg -hide_banner -y -f concat -safe 0 -i renders/tramos/lista.txt -map 0:v -c copy renders/tramos/video.mp4
ffmpeg -hide_banner -y -i assets/voice/narracion.wav -i assets/music/banda_sonora.wav -i assets/sfx/efectos.wav \
  -filter_complex "[0]pan=stereo|c0=c0|c1=c0[v];[v][1][2]amix=inputs=3:normalize=0:duration=longest,atrim=0:$END" -c:a pcm_f32le renders/tramos/mezcla.wav
ffmpeg -hide_banner -y -i renders/tramos/video.mp4 -i renders/tramos/mezcla.wav -map 0:v -map 1:a -c:v copy -c:a pcm_s24le renders/nintendo_documental_raw.mov
echo "== listo ($(date +%T))"
